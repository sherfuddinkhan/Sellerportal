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
   AUTH HEADERS
========================================================= */

const getHeaders = () => {

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        "";

    return {
        Accept: "application/json",
        ...(token
            ? {
                Authorization: `Bearer ${token}`
            }
            : {})
    };

};


/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeResponse = (responseData) => {

    if (Array.isArray(responseData)) {

        return responseData;

    }


    if (Array.isArray(responseData?.data)) {

        return responseData.data;

    }


    if (Array.isArray(responseData?.items)) {

        return responseData.items;

    }


    if (Array.isArray(responseData?.result)) {

        return responseData.result;

    }


    if (Array.isArray(responseData?.results)) {

        return responseData.results;

    }


    return [];

};


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
       
       NODE:
       GET /api/order-status-histories/all

       ASP.NET:
       GET /api/order-status-histories/all
    ===================================================== */

    const loadHistory = async () => {

        try {

            setLoading(true);


            console.log(
                "================================================"
            );

            console.log(
                "GET ALL ORDER STATUS HISTORY"
            );

            console.log(
                `${SERVER_URL}/api/order-status-histories/all`
            );


            const response =
                await axios.get(
                    `${SERVER_URL}/api/order-status-histories/all`,
                    {
                        headers: getHeaders()
                    }
                );


            console.log(
                "ORDER STATUS HISTORY RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );


            const data =
                normalizeResponse(
                    response.data
                );


            console.log(
                "NORMALIZED HISTORY:",
                data
            );


            setHistoryList(data);

            setFilteredHistory(data);

        }
        catch (error) {

            console.error(
                "Load Order Status History Error:",
                error
            );


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "DATA:",
                error.response?.data
            );


            setHistoryList([]);

            setFilteredHistory([]);


            showMessage(
                error.response?.data?.message ||
                error.response?.data?.title ||
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


            result =
                result.filter(
                    item => {

                        const orderId =
                            String(
                                item.orderId ??
                                item.OrderId ??
                                ""
                            )
                                .toLowerCase();


                        const status =
                            String(
                                item.status ??
                                item.Status ??
                                ""
                            )
                                .toLowerCase();


                        const remarks =
                            String(
                                item.remarks ??
                                item.Remarks ??
                                ""
                            )
                                .toLowerCase();


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
       CREATE / UPDATE
    ===================================================== */

    const handleSave = async (data) => {

        try {

            setLoading(true);


            const historyId =
                Number(
                    data.orderStatusHistoryId ??
                    data.OrderStatusHistoryId ??
                    data.historyId ??
                    data.HistoryId ??
                    0
                );


            console.log(
                "SAVE ORDER STATUS HISTORY"
            );

            console.log(
                "HISTORY ID:",
                historyId
            );

            console.log(
                "PAYLOAD:",
                data
            );


            /* =============================================
               UPDATE
            ============================================= */

            if (historyId > 0) {

                await axios.put(
                    `${SERVER_URL}/api/order-status-histories/${historyId}`,
                    data,
                    {
                        headers: {
                            ...getHeaders(),
                            "Content-Type":
                                "application/json"
                        }
                    }
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
                            ...getHeaders(),
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


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "DATA:",
                error.response?.data
            );


            showMessage(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Unable to save order status history.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (id) => {

        try {

            setLoading(true);


            const historyId =
                Number(id);


            if (!historyId) {

                throw new Error(
                    "Invalid order status history ID."
                );

            }


            console.log(
                "DELETE ORDER STATUS HISTORY:",
                historyId
            );


            await axios.delete(
                `${SERVER_URL}/api/order-status-histories/${historyId}`,
                {
                    headers: getHeaders()
                }
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


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "DATA:",
                error.response?.data
            );


            showMessage(
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.message ||
                "Unable to delete order status history.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       ADD
    ===================================================== */

    const handleAdd = () => {

        setSelectedHistory(null);

        setModalOpen(true);

    };


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (row) => {

        setSelectedHistory(row);

        setViewOpen(true);

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (row) => {

        setSelectedHistory(row);

        setModalOpen(true);

    };


    /* =====================================================
       DELETE DIALOG
    ===================================================== */

    const handleDeleteDialog = (row) => {

        setSelectedHistory(row);

        setDeleteOpen(true);

    };


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const handleModalClose = () => {

        setModalOpen(false);

        setSelectedHistory(null);

    };


    /* =====================================================
       CLOSE VIEW
    ===================================================== */

    const handleViewClose = () => {

        setViewOpen(false);

        setSelectedHistory(null);

    };


    /* =====================================================
       CLOSE DELETE
    ===================================================== */

    const handleDeleteClose = () => {

        setDeleteOpen(false);

        setSelectedHistory(null);

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

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <OrderStatusHistoryToolbar

                onAdd={handleAdd}

                onRefresh={loadHistory}

                onExport={() => {

                    console.log(
                        "Export Order Status History"
                    );

                }}

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <OrderStatusHistoryStatistics
                history={historyList}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <OrderStatusHistorySearch

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

            <OrderStatusHistoryTable

                items={
                    pagedHistory
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
                    handleDeleteDialog
                }

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <OrderStatusHistoryPagination

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
                    filteredHistory.length
                }

                onPageChange={
                    setPage
                }

                onPageSizeChange={
                    size => {

                        setPageSize(size);

                        setPage(1);

                    }
                }

            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <OrderStatusHistoryModal

                open={
                    modalOpen
                }

                item={
                    selectedHistory
                }

                onClose={
                    handleModalClose
                }

                onSave={
                    handleSave
                }

            />


            {/* =================================================
                VIEW
            ================================================= */}

            <OrderStatusHistoryView

                open={
                    viewOpen
                }

                item={
                    selectedHistory
                }

                onClose={
                    handleViewClose
                }

            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteOrderStatusHistoryDialog

                open={
                    deleteOpen
                }

                item={
                    selectedHistory
                }

                onClose={
                    handleDeleteClose
                }

                onDeleted={
                    handleDelete
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
                    4000
                }

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

                    {
                        snackbar.message
                    }

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default OrderStatusHistoryList;
