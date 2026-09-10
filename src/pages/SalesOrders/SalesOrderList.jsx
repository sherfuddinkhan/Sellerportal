import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Typography
} from "@mui/material";

import axios from "axios";

import SalesOrderToolbar from "./SalesOrderToolbar";
import SalesOrderStatistics from "./SalesOrderStatistics";
import SalesOrderSearch from "./SalesOrderSearch";
import SalesOrderTable from "./SalesOrderTable";
import SalesOrderPagination from "./SalesOrderPagination";
import SalesOrderModal from "./SalesOrderModal";
import SalesOrderView from "./SalesOrderView";
import DeleteSalesOrderDialog from "./DeleteSalesOrderDialog";

import "./SalesOrders.css";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/SalesOrder`;

const SELLER_ID = 6;

const DEFAULT_PAGE_SIZE = 10;


// =========================================================
// COMPONENT
// =========================================================

const SalesOrderList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [salesOrders, setSalesOrders] =
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

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            severity: "success",
            message: ""
        });


    // =====================================================
    // NORMALIZE SALES ORDER
    // =====================================================

    const normalizeSalesOrder = (item) => {

        if (!item) {
            return null;
        }

        return {

            SalesOrderId:
                item.salesOrderId ??
                item.SalesOrderId ??
                0,

            SellerId:
                item.sellerId ??
                item.SellerId ??
                0,

            CustomerId:
                item.customerId ??
                item.CustomerId ??
                0,

            SalesOrderNumber:
                item.salesOrderNumber ??
                item.SalesOrderNumber ??
                "",

            OrderDate:
                item.orderDate ??
                item.OrderDate ??
                "",

            Status:
                item.status ??
                item.Status ??
                "Pending",

            TotalAmount:
                Number(
                    item.totalAmount ??
                    item.TotalAmount ??
                    0
                ),

            Remarks:
                item.remarks ??
                item.Remarks ??
                "",

            CreatedDate:
                item.createdDate ??
                item.CreatedDate ??
                null,

            UpdatedDate:
                item.updatedDate ??
                item.UpdatedDate ??
                null

        };

    };


    // =====================================================
    // EXTRACT API DATA
    // =====================================================

    const extractSalesOrders =
        (responseData) => {

            if (
                Array.isArray(
                    responseData
                )
            ) {

                return responseData;

            }


            if (
                Array.isArray(
                    responseData?.data
                )
            ) {

                return responseData.data;

            }


            if (
                Array.isArray(
                    responseData?.items
                )
            ) {

                return responseData.items;

            }


            return [];

        };


    // =====================================================
    // LOAD ALL SALES ORDERS
    // =====================================================

    const loadSalesOrders =
        async () => {

            try {

                setLoading(true);


                const response =
                    await axios.get(
                        `${API_URL}/seller/${SELLER_ID}`,
                        {
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                console.log(
                    "ALL Sales Orders Response:",
                    response.data
                );


                const data =
                    extractSalesOrders(
                        response.data
                    );


                const normalizedOrders =
                    data
                        .map(
                            normalizeSalesOrder
                        )
                        .filter(Boolean);


                console.log(
                    "Normalized Sales Orders:",
                    normalizedOrders
                );


                setSalesOrders(
                    normalizedOrders
                );

                setPage(1);

            }
            catch (error) {

                console.error(
                    "Load Sales Orders Error:",
                    error
                );


                setSalesOrders([]);


                setSnackbar({
                    open: true,
                    severity: "error",
                    message:
                        error.response?.data
                            ?.message ||
                        "Failed to load Sales Orders."
                });

            }
            finally {

                setLoading(false);

            }

        };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadSalesOrders();

    }, []);


    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    const filteredOrders =
        useMemo(() => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();


            // ---------------------------------------------
            // NO SEARCH
            // ---------------------------------------------

            if (!search) {

                return salesOrders;

            }


            // ---------------------------------------------
            // FILTER
            // ---------------------------------------------

            return salesOrders.filter(
                (order) => {

                    const salesOrderId =
                        String(
                            order.SalesOrderId ??
                            ""
                        )
                            .toLowerCase();


                    const salesOrderNumber =
                        String(
                            order.SalesOrderNumber ??
                            ""
                        )
                            .toLowerCase();


                    const sellerId =
                        String(
                            order.SellerId ??
                            ""
                        )
                            .toLowerCase();


                    const customerId =
                        String(
                            order.CustomerId ??
                            ""
                        )
                            .toLowerCase();


                    const status =
                        String(
                            order.Status ??
                            ""
                        )
                            .toLowerCase();


                    const remarks =
                        String(
                            order.Remarks ??
                            ""
                        )
                            .toLowerCase();


                    return (

                        salesOrderId.includes(
                            search
                        )

                        ||

                        salesOrderNumber.includes(
                            search
                        )

                        ||

                        sellerId.includes(
                            search
                        )

                        ||

                        customerId.includes(
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

                    );

                }
            );

        }, [
            salesOrders,
            searchText
        ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalRecords =
        filteredOrders.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords /
                pageSize
            )
        );


    const pagedOrders =
        useMemo(() => {

            const startIndex =
                (page - 1) *
                pageSize;


            const endIndex =
                startIndex +
                pageSize;


            return filteredOrders.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredOrders,
            page,
            pageSize
        ]);


    // =====================================================
    // PAGE VALIDATION
    // =====================================================

    useEffect(() => {

        if (
            page >
            totalPages
        ) {

            setPage(
                totalPages
            );

        }

    }, [
        page,
        totalPages
    ]);


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedOrder(
            null
        );

        setModalOpen(
            true
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit =
        (order) => {

            setSelectedOrder(
                order
            );

            setModalOpen(
                true
            );

        };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView =
        (order) => {

            setSelectedOrder(
                order
            );

            setViewOpen(
                true
            );

        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        (order) => {

            setSelectedOrder(
                order
            );

            setDeleteOpen(
                true
            );

        };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSave =
        async (order) => {

            try {

                const salesOrderId =
                    Number(
                        order.SalesOrderId
                    );


                // =========================================
                // UPDATE
                // =========================================

                if (
                    Number.isInteger(
                        salesOrderId
                    ) &&
                    salesOrderId > 0
                ) {

                    await axios.put(
                        `${API_URL}/${salesOrderId}`,
                        order,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                    setSnackbar({
                        open: true,
                        severity: "success",
                        message:
                            "Sales Order updated successfully."
                    });

                }

                // =========================================
                // CREATE
                // =========================================

                else {

                    await axios.post(
                        API_URL,
                        order,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                    setSnackbar({
                        open: true,
                        severity: "success",
                        message:
                            "Sales Order created successfully."
                    });

                }


                setModalOpen(
                    false
                );

                setSelectedOrder(
                    null
                );


                // -----------------------------------------
                // RELOAD ALL
                // -----------------------------------------

                await loadSalesOrders();

            }
            catch (error) {

                console.error(
                    "Save Sales Order Error:",
                    error
                );


                setSnackbar({
                    open: true,
                    severity: "error",
                    message:
                        error.response?.data
                            ?.message ||
                        "Unable to save Sales Order."
                });

            }

        };


    // =====================================================
    // DELETE CONFIRM
    // =====================================================

    const handleDeleteConfirm =
        async (id) => {

            try {

                const salesOrderId =
                    Number(id);


                if (
                    !Number.isInteger(
                        salesOrderId
                    ) ||
                    salesOrderId <= 0
                ) {

                    setSnackbar({
                        open: true,
                        severity: "error",
                        message:
                            "Invalid Sales Order ID."
                    });

                    return;

                }


                await axios.delete(
                    `${API_URL}/${salesOrderId}`,
                    {
                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


                setDeleteOpen(
                    false
                );

                setSelectedOrder(
                    null
                );


                setSnackbar({
                    open: true,
                    severity: "success",
                    message:
                        "Sales Order deleted successfully."
                });


                // -----------------------------------------
                // RELOAD ALL
                // -----------------------------------------

                await loadSalesOrders();

            }
            catch (error) {

                console.error(
                    "Delete Sales Order Error:",
                    error
                );


                setSnackbar({
                    open: true,
                    severity: "error",
                    message:
                        error.response?.data
                            ?.message ||
                        "Unable to delete Sales Order."
                });

            }

        };


    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics =
        useMemo(() => {

            const totalOrders =
                salesOrders.length;


            const totalAmount =
                salesOrders.reduce(
                    (
                        sum,
                        item
                    ) => {

                        return (
                            sum +
                            Number(
                                item.TotalAmount ||
                                0
                            )
                        );

                    },
                    0
                );


            const completedOrders =
                salesOrders.filter(
                    (item) => {

                        const status =
                            String(
                                item.Status ||
                                ""
                            )
                                .trim()
                                .toLowerCase();


                        return (
                            status ===
                                "completed" ||
                            status ===
                                "confirmed"
                        );

                    }
                ).length;


            const pendingOrders =
                salesOrders.filter(
                    (item) => {

                        const status =
                            String(
                                item.Status ||
                                ""
                            )
                                .trim()
                                .toLowerCase();


                        return (
                            status ===
                            "pending"
                        );

                    }
                ).length;


            return {

                totalOrders,

                totalAmount,

                completedOrders,

                pendingOrders

            };

        }, [
            salesOrders
        ]);


    // =====================================================
    // LOADING
    // =====================================================

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


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            className="sales-orders-container"
        >

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Sales Orders
            </Typography>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <SalesOrderToolbar
                onAdd={
                    handleAdd
                }

                onRefresh={
                    loadSalesOrders
                }
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <SalesOrderStatistics
                statistics={
                    statistics
                }
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <SalesOrderSearch
                searchText={
                    searchText
                }

                setSearchText={
                    (value) => {

                        setSearchText(
                            value
                        );

                        setPage(1);

                    }
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

                    <SalesOrderTable
                        items={
                            pagedOrders
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

            <SalesOrderPagination

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
                CREATE / EDIT
            ================================================= */}

            <SalesOrderModal

                open={
                    modalOpen
                }

                item={
                    selectedOrder
                }

                onClose={() => {

                    setModalOpen(
                        false
                    );

                    setSelectedOrder(
                        null
                    );

                }}

                onSave={
                    handleSave
                }

            />


            {/* =================================================
                VIEW
            ================================================= */}

            <SalesOrderView

                open={
                    viewOpen
                }

                item={
                    selectedOrder
                }

                onClose={() => {

                    setViewOpen(
                        false
                    );

                    setSelectedOrder(
                        null
                    );

                }}

            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteSalesOrderDialog

                open={
                    deleteOpen
                }

                item={
                    selectedOrder
                }

                onClose={() => {

                    setDeleteOpen(
                        false
                    );

                    setSelectedOrder(
                        null
                    );

                }}

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

                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }

            >

                <Alert

                    severity={
                        snackbar.severity
                    }

                    variant="filled"

                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
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


export default SalesOrderList;
