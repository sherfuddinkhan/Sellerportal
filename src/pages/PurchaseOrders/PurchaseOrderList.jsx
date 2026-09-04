import React, {
    useCallback,
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
       SHOW MESSAGE
    ===================================================== */

    const showMessage = (
        message,
        severity = "success"
    ) => {

        setSnackbar({

            open: true,

            severity,

            message

        });

    };


    /* =====================================================
       LOAD ALL PURCHASE ORDERS
       
       GET:
       http://localhost:5000/api/purchase-orders

       Node forwards to:
       https://localhost:7203/api/purchase-orders
    ===================================================== */

    const loadItems = useCallback(
        async () => {

            try {

                setLoading(true);

                console.log(
                    "GET ALL PURCHASE ORDERS:",
                    PURCHASE_ORDER_API
                );

                const response =
                    await axios.get(
                        PURCHASE_ORDER_API
                    );

                const data =
                    response?.data;


                /* =========================================
                   NORMALIZE API RESPONSE
                ========================================= */

                let purchaseOrders = [];


                /*
                   ASP.NET may return:

                   [
                       {...},
                       {...}
                   ]
                */

                if (
                    Array.isArray(data)
                ) {

                    purchaseOrders =
                        data;

                }


                /*
                   Or:

                   {
                       items: [...]
                   }
                */

                else if (
                    Array.isArray(
                        data?.items
                    )
                ) {

                    purchaseOrders =
                        data.items;

                }


                /*
                   Or:

                   {
                       data: [...]
                   }
                */

                else if (
                    Array.isArray(
                        data?.data
                    )
                ) {

                    purchaseOrders =
                        data.data;

                }


                /*
                   Or:

                   {
                       purchaseOrders: [...]
                   }
                */

                else if (
                    Array.isArray(
                        data?.purchaseOrders
                    )
                ) {

                    purchaseOrders =
                        data.purchaseOrders;

                }


                /*
                   No valid array
                */

                else {

                    purchaseOrders =
                        [];

                }


                setItems(
                    purchaseOrders
                );


                /*
                   Keep current page valid
                */

                setPage(
                    (currentPage) =>
                        currentPage < 1
                            ? 1
                            : currentPage
                );

            }
            catch (error) {

                console.error(
                    "LOAD PURCHASE ORDERS ERROR:",
                    error
                );

                setItems([]);

                showMessage(

                    error
                        ?.response
                        ?.data
                        ?.message ||

                    "Failed to load Purchase Orders.",

                    "error"

                );

            }
            finally {

                setLoading(false);

            }

        },
        []
    );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadItems();

    }, [
        loadItems
    ]);


    /* =====================================================
       SEARCH / FILTER
    ===================================================== */

    const filteredItems =
        useMemo(() => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();


            /*
               No search
            */

            if (!search) {

                return items;

            }


            return items.filter(
                (item) => {

                    const purchaseOrderId =
                        String(
                            item?.PurchaseOrderId ??
                            item?.purchaseOrderId ??
                            ""
                        )
                            .toLowerCase();


                    const purchaseOrderNumber =
                        String(
                            item?.PurchaseOrderNumber ??
                            item?.purchaseOrderNumber ??
                            ""
                        )
                            .toLowerCase();


                    const sellerId =
                        String(
                            item?.SellerId ??
                            item?.sellerId ??
                            ""
                        )
                            .toLowerCase();


                    const supplierId =
                        String(
                            item?.SupplierId ??
                            item?.supplierId ??
                            ""
                        )
                            .toLowerCase();


                    const status =
                        String(
                            item?.Status ??
                            item?.status ??
                            ""
                        )
                            .toLowerCase();


                    const remarks =
                        String(
                            item?.Remarks ??
                            item?.remarks ??
                            ""
                        )
                            .toLowerCase();


                    const totalAmount =
                        String(
                            item?.TotalAmount ??
                            item?.totalAmount ??
                            ""
                        )
                            .toLowerCase();


                    return (

                        purchaseOrderId.includes(
                            search
                        )

                        ||

                        purchaseOrderNumber.includes(
                            search
                        )

                        ||

                        sellerId.includes(
                            search
                        )

                        ||

                        supplierId.includes(
                            search
                        )

                        ||

                        status.includes(
                            search
                        )

                        ||

                        remarks.includes(
                            search
                        )

                        ||

                        totalAmount.includes(
                            search
                        )

                    );

                }
            );

        }, [
            items,
            searchText
        ]);


    /* =====================================================
       RESET PAGE WHEN SEARCH CHANGES
    ===================================================== */

    useEffect(() => {

        setPage(1);

    }, [
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
        useMemo(() => {

            const startIndex =
                (page - 1) *
                pageSize;

            const endIndex =
                startIndex +
                pageSize;

            return filteredItems.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredItems,
            page,
            pageSize
        ]);


    /* =====================================================
       KEEP PAGE VALID
    ===================================================== */

    useEffect(() => {

        if (
            page > totalPages
        ) {

            setPage(
                totalPages
            );

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
       CREATE / UPDATE
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

                console.log(
                    "UPDATE PURCHASE ORDER:",
                    id
                );

                await axios.put(

                    `${PURCHASE_ORDER_API}/${id}`,

                    purchaseOrder

                );

                showMessage(
                    "Purchase Order updated successfully.",
                    "success"
                );

            }


            /* =============================================
               CREATE
            ============================================= */

            else {

                console.log(
                    "CREATE PURCHASE ORDER"
                );

                await axios.post(

                    PURCHASE_ORDER_API,

                    purchaseOrder

                );

                showMessage(
                    "Purchase Order created successfully.",
                    "success"
                );

            }


            /* =============================================
               CLOSE MODAL
            ============================================= */

            setModalOpen(false);

            setSelectedItem(null);


            /* =============================================
               RELOAD ALL ORDERS
            ============================================= */

            await loadItems();

        }
        catch (error) {

            console.error(
                "SAVE PURCHASE ORDER ERROR:",
                error
            );

            showMessage(

                error
                    ?.response
                    ?.data
                    ?.message ||

                "Unable to save Purchase Order.",

                "error"

            );

        }

    };


    /* =====================================================
       DELETE PURCHASE ORDER
    ===================================================== */

    const handleDeleteConfirm =
        async (
            id
        ) => {

            const purchaseOrderId =
                Number(id);


            if (
                !Number.isInteger(
                    purchaseOrderId
                ) ||
                purchaseOrderId <= 0
            ) {

                showMessage(
                    "Invalid Purchase Order ID.",
                    "error"
                );

                return;

            }


            try {

                console.log(
                    "DELETE PURCHASE ORDER:",
                    purchaseOrderId
                );


                await axios.delete(

                    `${PURCHASE_ORDER_API}/${purchaseOrderId}`

                );


                /* =========================================
                   CLOSE DELETE DIALOG
                ========================================= */

                setDeleteOpen(false);

                setSelectedItem(null);


                /* =========================================
                   MESSAGE
                ========================================= */

                showMessage(
                    "Purchase Order deleted successfully.",
                    "success"
                );


                /* =========================================
                   RELOAD
                ========================================= */

                await loadItems();

            }
            catch (error) {

                console.error(
                    "DELETE PURCHASE ORDER ERROR:",
                    error
                );

                showMessage(

                    error
                        ?.response
                        ?.data
                        ?.message ||

                    "Unable to delete Purchase Order.",

                    "error"

                );

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
                            Number(
                                item?.TotalAmount ??
                                item?.totalAmount ??
                                0
                            );

                        return (
                            sum +
                            (
                                Number.isFinite(
                                    amount
                                )
                                    ? amount
                                    : 0
                            )
                        );

                    },
                    0
                );


            const pendingOrders =
                items.filter(
                    (item) => {

                        const status =
                            String(
                                item?.Status ??
                                item?.status ??
                                ""
                            )
                                .trim()
                                .toLowerCase();

                        return (
                            status === "pending"
                        );

                    }
                ).length;


            const completedOrders =
                items.filter(
                    (item) => {

                        const status =
                            String(
                                item?.Status ??
                                item?.status ??
                                ""
                            )
                                .trim()
                                .toLowerCase();

                        return (

                            status ===
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
       CLOSE VIEW
    ===================================================== */

    const handleCloseView = () => {

        setViewOpen(false);

        setSelectedItem(null);

    };


    /* =====================================================
       CLOSE DELETE
    ===================================================== */

    const handleCloseDelete = () => {

        setDeleteOpen(false);

        setSelectedItem(null);

    };


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
                            Number(size)
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
                    handleCloseView
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
                    handleCloseDelete
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

                    {
                        snackbar.message
                    }

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default PurchaseOrderList;
