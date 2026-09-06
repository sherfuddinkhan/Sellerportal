import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Snackbar,
    Alert
} from "@mui/material";

import OrderStatusHistoryToolbar
    from "./OrderStatusHistoryToolbar";

import OrderStatusHistoryStatistics
    from "./OrderStatusHistoryStatistics";

import OrderStatusHistorySearch
    from "./OrderStatusHistorySearch";

import OrderStatusHistoryTable
    from "./OrderStatusHistoryTable";

import OrderStatusHistoryPagination
    from "./OrderStatusHistoryPagination";

import OrderStatusHistoryModal
    from "./OrderStatusHistoryModal";

import OrderStatusHistoryView
    from "./OrderStatusHistoryView";

import DeleteOrderStatusHistoryDialog
    from "./DeleteOrderStatusHistoryDialog";


/* =========================================================
   NODE SERVER
========================================================= */

const SERVER_URL = "http://localhost:5000";


/* =========================================================
   COMPONENT
========================================================= */

const OrderStatusHistoryList = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [
        historyList,
        setHistoryList
    ] = useState([]);

    const [
        filteredHistory,
        setFilteredHistory
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        selectedHistory,
        setSelectedHistory
    ] = useState(null);

    const [
        modalOpen,
        setModalOpen
    ] = useState(false);

    const [
        viewOpen,
        setViewOpen
    ] = useState(false);

    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);

    const [
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    const [
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        message: "",
        severity: "success"
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
            message,
            severity
        });

    };


    /* =====================================================
       CLOSE MESSAGE
    ===================================================== */

    const handleSnackbarClose = () => {

        setSnackbar(
            previous => ({
                ...previous,
                open: false
            })
        );

    };


    /* =====================================================
       GET ALL ORDER STATUS HISTORY
       
       GET:
       http://localhost:5000/api/order-status-histories/all
    ===================================================== */

    const loadHistory = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${SERVER_URL}/api/order-status-histories/all`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setHistoryList(data);

            setFilteredHistory(data);

        }
        catch (error) {

            console.error(
                "Load Order Status History Error:",
                error
            );

            setHistoryList([]);

            setFilteredHistory([]);

            showMessage(
                error.response?.data?.message ||
                "Unable to load order status history.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadHistory();

    }, []);


    /* =====================================================
       SEARCH
    ===================================================== */

    useEffect(() => {

        let result = [
            ...historyList
        ];


        if (
            searchText.trim() !== ""
        ) {

            const search =
                searchText
                    .toLowerCase()
                    .trim();


            result = result.filter(
                item => {

                    const orderId =
                        String(
                            item.orderId ??
                            item.OrderId ??
                            ""
                        ).toLowerCase();


                    const status =
                        String(
                            item.status ??
                            item.Status ??
                            ""
                        ).toLowerCase();


                    const remarks =
                        String(
                            item.remarks ??
                            item.Remarks ??
                            ""
                        ).toLowerCase();


                    return (
                        orderId.includes(search) ||
                        status.includes(search) ||
                        remarks.includes(search)
                    );

                }
            );

        }


        setFilteredHistory(result);

        setPage(1);

    }, [
        historyList,
        searchText
    ]);


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages =
        Math.ceil(
            filteredHistory.length /
            pageSize
        );


    const pagedHistory =
        filteredHistory.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    /* =====================================================
       SAVE HISTORY
       
       POST:
       /api/order-status-histories

       PUT:
       /api/order-status-histories/:id
    ===================================================== */

    const handleSave = async (data) => {

        try {

            setLoading(true);


            const historyId =
                data.orderStatusHistoryId ??
                data.OrderStatusHistoryId ??
                data.historyId ??
                data.HistoryId ??
                0;


            /* =============================================
               UPDATE
            ============================================= */

            if (historyId) {

                await axios.put(
                    `${SERVER_URL}/api/order-status-histories/${historyId}`,
                    data
                );

                showMessage(
                    "Order status history updated successfully.",
                    "success"
                );

            }


            /* =============================================
               CREATE
            ============================================= */

            else {

                await axios.post(
                    `${SERVER_URL}/api/order-status-histories`,
                    data,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

                showMessage(
                    "Order status history created successfully.",
                    "success"
                );

            }


            /* =============================================
               REFRESH
            ============================================= */

            await loadHistory();


            setModalOpen(false);

            setSelectedHistory(null);

        }
        catch (error) {

            console.error(
                "Save Order Status History Error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                "Unable to save order status history.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       DELETE HISTORY
       
       DELETE:
       /api/order-status-histories/:id
    ===================================================== */

    const handleDelete = async (id) => {

        try {

            setLoading(true);


            await axios.delete(
                `${SERVER_URL}/api/order-status-histories/${id}`
            );


            showMessage(
                "Order status history deleted successfully.",
                "success"
            );


            await loadHistory();


            setDeleteOpen(false);

            setSelectedHistory(null);

        }
        catch (error) {

            console.error(
                "Delete Order Status History Error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                "Unable to delete order status history.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =============================================
                TOOLBAR
            ============================================= */}

            <OrderStatusHistoryToolbar

                onAdd={() => {

                    setSelectedHistory(null);

                    setModalOpen(true);

                }}

                onRefresh={loadHistory}

                onExport={() => {

                    console.log(
                        "Export Order Status History"
                    );

                }}

            />


            {/* =============================================
                STATISTICS
            ============================================= */}

            <OrderStatusHistoryStatistics
                history={historyList}
            />


            {/* =============================================
                SEARCH
            ============================================= */}

            <OrderStatusHistorySearch

                searchText={searchText}

                setSearchText={
                    setSearchText
                }

            />


            {/* =============================================
                TABLE
            ============================================= */}

            <OrderStatusHistoryTable

                items={pagedHistory}

                loading={loading}


                onView={(row) => {

                    setSelectedHistory(row);

                    setViewOpen(true);

                }}


                onEdit={(row) => {

                    setSelectedHistory(row);

                    setModalOpen(true);

                }}


                onDelete={(row) => {

                    setSelectedHistory(row);

                    setDeleteOpen(true);

                }}

            />


            {/* =============================================
                PAGINATION
            ============================================= */}

            <OrderStatusHistoryPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredHistory.length
                }

                onPageChange={
                    setPage
                }

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />


            {/* =============================================
                CREATE / EDIT MODAL
            ============================================= */}

            <OrderStatusHistoryModal

                open={modalOpen}

                item={selectedHistory}


                onClose={() => {

                    setModalOpen(false);

                    setSelectedHistory(null);

                }}


                onSave={handleSave}

            />


            {/* =============================================
                VIEW
            ============================================= */}

            <OrderStatusHistoryView

                open={viewOpen}

                item={selectedHistory}


                onClose={() => {

                    setViewOpen(false);

                    setSelectedHistory(null);

                }}

            />


            {/* =============================================
                DELETE
            ============================================= */}

            <DeleteOrderStatusHistoryDialog

                open={deleteOpen}

                item={selectedHistory}


                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedHistory(null);

                }}


                onDeleted={handleDelete}

            />


            {/* =============================================
                SNACKBAR
            ============================================= */}

            <Snackbar

                open={snackbar.open}

                autoHideDuration={4000}

                onClose={
                    handleSnackbarClose
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}

            >

                <Alert

                    onClose={
                        handleSnackbarClose
                    }

                    severity={
                        snackbar.severity
                    }

                    variant="filled"

                    sx={{
                        width: "100%"
                    }}

                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default OrderStatusHistoryList;
