import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

import PurchaseOrderToolbar from "./PurchaseOrderToolbar";
import PurchaseOrderStatistics from "./PurchaseOrderStatistics";
import PurchaseOrderSearch from "./PurchaseOrderSearch";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderPagination from "./PurchaseOrderPagination";
import PurchaseOrderModal from "./PurchaseOrderModal";
import PurchaseOrderView from "./PurchaseOrderView";
import DeletePurchaseOrderDialog from "./DeletePurchaseOrderDialog";

import "./PurchaseOrders.css";


/* =========================================================
   SERVER CONFIGURATION
========================================================= */

const SERVER_URL =
    "http://localhost:5000";

const PURCHASE_ORDER_API =
    `${SERVER_URL}/api/purchase-orders`;

const DEFAULT_PAGE_SIZE = 10;


/* =========================================================
   PURCHASE ORDER LIST
========================================================= */

const PurchaseOrderList = () => {


    /* =====================================================
       STATE
    ===================================================== */

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(DEFAULT_PAGE_SIZE);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            severity: "success",
            message: ""
        });


    /* =====================================================
       LOAD PURCHASE ORDERS
    ===================================================== */

    const loadItems = async () => {

        try {

            setLoading(true);

            const response =
                await axios.get(
                    PURCHASE_ORDER_API
                );

            const data =
                response?.data;

            /* =================================================
               NORMALIZE RESPONSE
            ================================================= */

            if (Array.isArray(data)) {

                setItems(data);

            }
            else if (
                Array.isArray(data?.items)
            ) {

                setItems(
                    data.items
                );

            }
            else if (
                Array.isArray(data?.data)
            ) {

                setItems(
                    data.data
                );

            }
            else if (
                Array.isArray(data?.purchaseOrders)
            ) {

                setItems(
                    data.purchaseOrders
                );

            }
            else {

                setItems([]);

            }

        }
        catch (error) {

            console.error(
                "LOAD PURCHASE ORDERS ERROR:",
                error
            );

            setItems([]);

            setSnackbar({

                open: true,

                severity: "error",

                message:
                    error?.response?.data?.message ||
                    "Failed to load Purchase Orders."

            });

        }
        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadItems();

    }, []);


    /* =====================================================
       FILTER PURCHASE ORDERS
    ===================================================== */

    const filteredItems =
        useMemo(() => {

            if (
                !searchText.trim()
            ) {

                return items;

            }

            const value =
                searchText
                    .toLowerCase()
                    .trim();

            return items.filter(
                (item) => {

                    return (

                        String(
                            item.PurchaseOrderId ??
                            item.purchaseOrderId ??
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.PurchaseOrderNumber ??
                            item.purchaseOrderNumber ??
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.SellerId ??
                            item.sellerId ??
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.SupplierId ??
                            item.supplierId ??
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.Status ??
                            item.status ??
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.Remarks ??
                            item.remarks ??
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.TotalAmount ??
                            item.totalAmount ??
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                    );

                }
            );

        }, [
            items,
            searchText
        ]);


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalRecords =
        filteredItems.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords /
                pageSize
            )
        );

    const pagedItems =
        filteredItems.slice(

            (page - 1) *
            pageSize,

            page *
            pageSize

        );


    /* =====================================================
       KEEP PAGE VALID
    ===================================================== */

    useEffect(() => {

        if (
            page > totalPages
        ) {

            setPage(1);

        }

    }, [
        page,
        totalPages
    ]);


    /* =====================================================
       ADD
    ===================================================== */

    const handleAdd = () => {

        setSelectedItem(null);

        setModalOpen(true);

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (
        item
    ) => {

        setSelectedItem(item);

        setModalOpen(true);

    };


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (
        item
    ) => {

        setSelectedItem(item);

        setViewOpen(true);

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = (
        item
    ) => {

        setSelectedItem(item);

        setDeleteOpen(true);

    };


    /* =====================================================
       CREATE / UPDATE PURCHASE ORDER
    ===================================================== */

    const handleSave = async (
        purchaseOrder
    ) => {

        try {

            const id =
                purchaseOrder?.PurchaseOrderId ??
                purchaseOrder?.purchaseOrderId;


            /* =============================================
               UPDATE
            ============================================= */

            if (id) {

                await axios.put(

                    `${PURCHASE_ORDER_API}/${id}`,

                    purchaseOrder

                );

                setSnackbar({

                    open: true,

                    severity: "success",

                    message:
                        "Purchase Order updated successfully."

                });

            }


            /* =============================================
               CREATE
            ============================================= */

            else {

                await axios.post(

                    PURCHASE_ORDER_API,

                    purchaseOrder

                );

                setSnackbar({

                    open: true,

                    severity: "success",

                    message:
                        "Purchase Order created successfully."

                });

            }


            /* =============================================
               CLOSE MODAL
            ============================================= */

            setModalOpen(false);

            setSelectedItem(null);


            /* =============================================
               RELOAD
            ============================================= */

            await loadItems();

        }
        catch (error) {

            console.error(
                "SAVE PURCHASE ORDER ERROR:",
                error
            );

            setSnackbar({

                open: true,

                severity: "error",

                message:
                    error?.response?.data?.message ||
                    "Unable to save Purchase Order."

            });

        }

    };


    /* =====================================================
       DELETE PURCHASE ORDER
    ===================================================== */

    const handleDeleteConfirm =
        async (
            id
        ) => {

            try {

                await axios.delete(

                    `${PURCHASE_ORDER_API}/${id}`

                );

                setDeleteOpen(false);

                setSelectedItem(null);

                setSnackbar({

                    open: true,

                    severity: "success",

                    message:
                        "Purchase Order deleted successfully."

                });

                await loadItems();

            }
            catch (error) {

                console.error(
                    "DELETE PURCHASE ORDER ERROR:",
                    error
                );

                setSnackbar({

                    open: true,

                    severity: "error",

                    message:
                        error?.response?.data?.message ||
                        "Unable to delete Purchase Order."

                });

            }

        };


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics =
        useMemo(() => {

            const totalOrders =
                items.length;

            const totalAmount =
                items.reduce(

                    (
                        sum,
                        item
                    ) => {

                        const amount =
                            item.TotalAmount ??
                            item.totalAmount ??
                            0;

                        return (
                            sum +
                            Number(amount || 0)
                        );

                    },

                    0

                );

            const pendingOrders =
                items.filter(
                    (item) => {

                        const status =
                            item.Status ??
                            item.status ??
                            "";

                        return (
                            String(status)
                                .toLowerCase() ===
                            "pending"
                        );

                    }
                ).length;

            const completedOrders =
                items.filter(
                    (item) => {

                        const status =
                            item.Status ??
                            item.status ??
                            "";

                        return (
                            String(status)
                                .toLowerCase() ===
                            "completed"
                        );

                    }
                ).length;

            return {

                totalOrders,

                totalAmount,

                pendingOrders,

                completedOrders

            };

        }, [
            items
        ]);


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >

                <CircularProgress />

            </Box>

        );

    }


    /* =====================================================
       JSX
    ===================================================== */

    return (

        <Box
            className="purchase-orders-container"
        >

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >

                Purchase Orders

            </Typography>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <PurchaseOrderToolbar

                onAdd={
                    handleAdd
                }

                onRefresh={
                    loadItems
                }

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <PurchaseOrderStatistics

                statistics={
                    statistics
                }

            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <PurchaseOrderSearch

                searchText={
                    searchText
                }

                setSearchText={
                    setSearchText
                }

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <Grid
                container
                spacing={3}
            >

                <Grid
                    item
                    xs={12}
                >

                    <PurchaseOrderTable

                        items={
                            pagedItems
                        }

                        loading={
                            loading
                        }

                        onView={
                            handleView
                        }

                        onEdit={
                            handleEdit
                        }

                        onDelete={
                            handleDelete
                        }

                    />

                </Grid>

            </Grid>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <PurchaseOrderPagination

                page={
                    page
                }

                totalPages={
                    totalPages
                }

                pageSize={
                    pageSize
                }

                totalRecords={
                    totalRecords
                }

                onPageChange={
                    setPage
                }

                onPageSizeChange={
                    (size) => {

                        setPageSize(
                            size
                        );

                        setPage(1);

                    }
                }

            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <PurchaseOrderModal

                open={
                    modalOpen
                }

                item={
                    selectedItem
                }

                onClose={
                    () => {

                        setModalOpen(
                            false
                        );

                        setSelectedItem(
                            null
                        );

                    }
                }

                onSave={
                    handleSave
                }

            />


            {/* =================================================
                VIEW
            ================================================= */}

            <PurchaseOrderView

                open={
                    viewOpen
                }

                item={
                    selectedItem
                }

                onClose={
                    () => {

                        setViewOpen(
                            false
                        );

                    }
                }

            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeletePurchaseOrderDialog

                open={
                    deleteOpen
                }

                item={
                    selectedItem
                }

                onClose={
                    () => {

                        setDeleteOpen(
                            false
                        );

                    }
                }

                onDeleted={
                    handleDeleteConfirm
                }

            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar

                open={
                    snackbar.open
                }

                autoHideDuration={
                    3000
                }

                onClose={
                    () =>
                        setSnackbar(
                            (previous) => ({
                                ...previous,
                                open: false
                            })
                        )
                }

            >

                <Alert
                    severity={
                        snackbar.severity
                    }

                    variant="filled"
                >

                    {
                        snackbar.message
                    }

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default PurchaseOrderList;
