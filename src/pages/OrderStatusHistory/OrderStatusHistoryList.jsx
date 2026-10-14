import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

import DeleteOrderStatusHistoryDialog
    from "./DeleteOrderStatusHistoryDialog";


/* =========================================================
   NODE SERVER
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/order-status-histories`;


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
            ? { Authorization: `Bearer ${token}` }
            : {})
    };
};


/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeResponse = (data) => {

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.result)) return data.result;
    if (Array.isArray(data?.results)) return data.results;

    return [];
};


/* =========================================================
   GET HISTORY ID
========================================================= */

const getHistoryId = (item) => {

    return Number(
        item?.orderStatusHistoryId ??
        item?.OrderStatusHistoryId ??
        item?.historyId ??
        item?.HistoryId ??
        item?.id ??
        item?.Id ??
        0
    );
};


/* =========================================================
   COMPONENT
========================================================= */

const OrderStatusHistoryList = () => {

    const navigate = useNavigate();

    const [historyList, setHistoryList] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedHistory, setSelectedHistory] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [snackbar, setSnackbar] = useState({
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

        setSnackbar(previous => ({
            ...previous,
            open: false
        }));
    };


    /* =====================================================
       LOAD HISTORY
    ===================================================== */

    const loadHistory = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/all`,
                {
                    headers: getHeaders()
                }
            );

            console.log(
                "ORDER STATUS HISTORY RESPONSE:",
                response.data
            );

            const data = normalizeResponse(response.data);

            setHistoryList(data);

        } catch (error) {

            console.error(
                "LOAD ORDER STATUS HISTORY ERROR:",
                error
            );

            setHistoryList([]);

            showMessage(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Unable to load order status history.",
                "error"
            );

        } finally {

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

        let result = [...historyList];

        if (searchText.trim()) {

            const search = searchText
                .toLowerCase()
                .trim();

            result = result.filter(item => {

                const orderId = String(
                    item.orderId ??
                    item.OrderId ??
                    ""
                ).toLowerCase();

                const status = String(
                    item.status ??
                    item.Status ??
                    ""
                ).toLowerCase();

                const remarks = String(
                    item.remarks ??
                    item.Remarks ??
                    ""
                ).toLowerCase();

                return (
                    orderId.includes(search) ||
                    status.includes(search) ||
                    remarks.includes(search)
                );
            });
        }

        setFilteredHistory(result);
        setPage(1);

    }, [historyList, searchText]);


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages = Math.ceil(
        filteredHistory.length / pageSize
    );

    const pagedHistory = filteredHistory.slice(
        (page - 1) * pageSize,
        page * pageSize
    );


    /* =====================================================
       CREATE - REDIRECT TO PAGE
    ===================================================== */

    const handleAdd = () => {

        navigate("/order-status-history/create");

    };


    /* =====================================================
       VIEW - REDIRECT TO PAGE
    ===================================================== */

    const handleView = (row) => {

        const id = getHistoryId(row);

        if (!id) {

            showMessage(
                "Unable to open history: invalid ID.",
                "error"
            );

            return;
        }

        navigate(`/order-status-history/view/${id}`);

    };


    /* =====================================================
       EDIT - REDIRECT TO PAGE
    ===================================================== */

    const handleEdit = (row) => {

        const id = getHistoryId(row);

        if (!id) {

            showMessage(
                "Unable to edit history: invalid ID.",
                "error"
            );

            return;
        }

        navigate(`/order-status-history/edit/${id}`);

    };


    /* =====================================================
       OPEN DELETE DIALOG
    ===================================================== */

    const handleDeleteDialog = (row) => {

        setSelectedHistory(row);
        setDeleteOpen(true);

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (id) => {

        try {

            setLoading(true);

            const historyId = Number(
                id ??
                getHistoryId(selectedHistory)
            );

            if (!historyId) {
                throw new Error(
                    "Invalid order status history ID."
                );
            }

            await axios.delete(
                `${API_URL}/${historyId}`,
                {
                    headers: getHeaders()
                }
            );

            showMessage(
                "Order status history deleted successfully.",
                "success"
            );

            setDeleteOpen(false);
            setSelectedHistory(null);

            await loadHistory();

        } catch (error) {

            console.error(
                "DELETE ORDER STATUS HISTORY ERROR:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.message ||
                "Unable to delete order status history.",
                "error"
            );

        } finally {

            setLoading(false);

        }
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

        <Box sx={{ p: 3 }}>

            {/* TOOLBAR */}

            <OrderStatusHistoryToolbar
                onAdd={handleAdd}
                onRefresh={loadHistory}
                onExport={() => {
                    console.log(
                        "Export Order Status History"
                    );
                }}
            />


            {/* STATISTICS */}

            <OrderStatusHistoryStatistics
                history={historyList}
            />


            {/* SEARCH */}

            <OrderStatusHistorySearch
                searchText={searchText}
                setSearchText={setSearchText}
            />


            {/* TABLE */}

            <OrderStatusHistoryTable
                items={pagedHistory}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteDialog}
            />


            {/* PAGINATION */}

            <OrderStatusHistoryPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={filteredHistory.length}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />


            {/* DELETE DIALOG ONLY */}

            <DeleteOrderStatusHistoryDialog
                open={deleteOpen}
                item={selectedHistory}
                onClose={handleDeleteClose}
                onDeleted={handleDelete}
            />


            {/* NOTIFICATIONS */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default OrderStatusHistoryList;
