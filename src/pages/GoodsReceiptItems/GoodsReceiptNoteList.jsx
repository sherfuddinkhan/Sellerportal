// ============================================================
// GoodsReceiptNoteList.jsx
// ============================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar,
    Typography
} from "@mui/material";

// ============================================================
// GRN COMPONENTS
// ============================================================

import GoodsReceiptNoteToolbar
    from "./GoodsReceiptNoteToolbar";

import GoodsReceiptNoteStatistics
    from "./GoodsReceiptNoteStatistics";

import GoodsReceiptNoteSearch
    from "./GoodsReceiptNoteSearch";

import GoodsReceiptNoteTable
    from "./GoodsReceiptNoteTable";

import GoodsReceiptNotePagination
    from "./GoodsReceiptNotePagination";

import DeleteGoodsReceiptNoteDialog
    from "./DeleteGoodsReceiptNoteDialog";

// ============================================================
// NODE SERVER
// ============================================================

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/goods-receipt-notes`;

// ============================================================
// COMPONENT
// ============================================================

const GoodsReceiptNoteList = () => {

    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [
        goodsReceiptNotes,
        setGoodsReceiptNotes
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
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    const [
        selectedNote,
        setSelectedNote
    ] = useState(null);

    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);

    const [
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =========================================================
    // NORMALIZE SEARCH VALUE
    // =========================================================

    const normalizeSearchValue = (value) => {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .trim()
            .toLowerCase();
    };

    // =========================================================
    // GET GRN ID
    // =========================================================

    const getGoodsReceiptNoteId = (note) => {

        if (!note) {
            return null;
        }

        const rawId =
            note.goodsReceiptNoteId ??
            note.GoodsReceiptNoteId ??
            note.goodsReceiptID ??
            note.GoodsReceiptID ??
            note.id ??
            note.Id ??
            null;

        const id = Number(rawId);

        if (
            Number.isInteger(id) &&
            id > 0
        ) {
            return id;
        }

        return null;
    };

    // =========================================================
    // NORMALIZE API RESPONSE
    // =========================================================

    const normalizeGoodsReceiptNotes = (responseData) => {

        // -----------------------------------------------------
        // Direct array
        // -----------------------------------------------------

        if (Array.isArray(responseData)) {

            return responseData.filter(
                (item) =>
                    item !== null &&
                    item !== undefined
            );
        }

        // -----------------------------------------------------
        // Common wrapper formats
        // -----------------------------------------------------

        if (
            Array.isArray(
                responseData?.data
            )
        ) {

            return responseData.data.filter(
                (item) =>
                    item !== null &&
                    item !== undefined
            );
        }

        if (
            Array.isArray(
                responseData?.items
            )
        ) {

            return responseData.items.filter(
                (item) =>
                    item !== null &&
                    item !== undefined
            );
        }

        if (
            Array.isArray(
                responseData?.results
            )
        ) {

            return responseData.results.filter(
                (item) =>
                    item !== null &&
                    item !== undefined
            );
        }

        if (
            Array.isArray(
                responseData?.records
            )
        ) {

            return responseData.records.filter(
                (item) =>
                    item !== null &&
                    item !== undefined
            );
        }

        // -----------------------------------------------------
        // ASP.NET sometimes returns object with value
        // -----------------------------------------------------

        if (
            Array.isArray(
                responseData?.value
            )
        ) {

            return responseData.value.filter(
                (item) =>
                    item !== null &&
                    item !== undefined
            );
        }

        // -----------------------------------------------------
        // Unexpected response
        // -----------------------------------------------------

        console.warn(
            "Unexpected Goods Receipt Notes response format:",
            responseData
        );

        return null;
    };

    // =========================================================
    // LOAD ALL GOODS RECEIPT NOTES
    //
    // React
    // GET http://localhost:5000/api/goods-receipt-notes
    //
    // Node
    // GET https://localhost:7203/api/GoodsReceiptNotes
    // =========================================================

    const loadGoodsReceiptNotes = useCallback(
        async () => {

            try {

                setLoading(true);

                console.log(
                    "================================================="
                );

                console.log(
                    "GET ALL GOODS RECEIPT NOTES"
                );

                console.log(
                    "NODE API URL:",
                    API_URL
                );

                const response =
                    await axios.get(
                        API_URL,
                        {
                            timeout: 30000,
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );

                console.log(
                    "================================================="
                );

                console.log(
                    "GOODS RECEIPT NOTES HTTP STATUS:",
                    response.status
                );

                console.log(
                    "GOODS RECEIPT NOTES RESPONSE DATA:",
                    response.data
                );

                console.log(
                    "GOODS RECEIPT NOTES RESPONSE TYPE:",
                    typeof response.data
                );

                // -------------------------------------------------
                // Normalize response
                // -------------------------------------------------

                const normalizedData =
                    normalizeGoodsReceiptNotes(
                        response.data
                    );

                // -------------------------------------------------
                // Invalid response format
                // -------------------------------------------------

                if (
                    normalizedData === null
                ) {

                    console.error(
                        "Goods Receipt Notes API did not return an array."
                    );

                    setGoodsReceiptNotes([]);

                    setSnackbar({
                        open: true,
                        message:
                            "Goods Receipt Notes API returned an unexpected response format.",
                        severity: "error"
                    });

                    return;
                }

                // -------------------------------------------------
                // Log normalized result
                // -------------------------------------------------

                console.log(
                    "NORMALIZED GOODS RECEIPT NOTES:",
                    normalizedData
                );

                console.log(
                    "TOTAL GOODS RECEIPT NOTES:",
                    normalizedData.length
                );

                // -------------------------------------------------
                // Log first record
                // -------------------------------------------------

                if (
                    normalizedData.length > 0
                ) {

                    console.log(
                        "FIRST GOODS RECEIPT NOTE:",
                        normalizedData[0]
                    );

                    console.log(
                        "FIRST GRN ID:",
                        getGoodsReceiptNoteId(
                            normalizedData[0]
                        )
                    );
                }

                // -------------------------------------------------
                // Update state
                // -------------------------------------------------

                setGoodsReceiptNotes(
                    normalizedData
                );

                setPage(1);

            }
            catch (error) {

                console.error(
                    "================================================="
                );

                console.error(
                    "GET GOODS RECEIPT NOTES ERROR"
                );

                console.error(
                    "MESSAGE:",
                    error.message
                );

                console.error(
                    "STATUS:",
                    error?.response?.status
                );

                console.error(
                    "RESPONSE DATA:",
                    error?.response?.data
                );

                console.error(
                    "REQUEST URL:",
                    error?.config?.url
                );

                console.error(
                    "================================================="
                );

                setGoodsReceiptNotes([]);

                setSnackbar({
                    open: true,
                    message:
                        error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        error?.message ||
                        "Failed to load Goods Receipt Notes.",
                    severity: "error"
                });

            }
            finally {

                setLoading(false);

            }

        },
        []
    );

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadGoodsReceiptNotes();

    }, [
        loadGoodsReceiptNotes
    ]);

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredNotes = useMemo(
        () => {

            const search =
                normalizeSearchValue(
                    searchText
                );

            if (!search) {

                return goodsReceiptNotes;

            }

            return goodsReceiptNotes.filter(
                (note) => {

                    if (!note) {
                        return false;
                    }

                    const goodsReceiptNoteId =
                        note.goodsReceiptNoteId ??
                        note.GoodsReceiptNoteId ??
                        note.goodsReceiptID ??
                        note.GoodsReceiptID ??
                        note.id ??
                        note.Id ??
                        "";

                    const grnNumber =
                        note.grnNumber ??
                        note.GRNNumber ??
                        note.goodsReceiptNumber ??
                        note.GoodsReceiptNumber ??
                        note.GrnNumber ??
                        "";

                    const purchaseOrderId =
                        note.purchaseOrderId ??
                        note.PurchaseOrderId ??
                        "";

                    const supplierId =
                        note.supplierId ??
                        note.SupplierId ??
                        "";

                    const sellerId =
                        note.sellerId ??
                        note.SellerId ??
                        "";

                    const customerId =
                        note.customerId ??
                        note.CustomerId ??
                        "";

                    const status =
                        note.status ??
                        note.Status ??
                        "";

                    const remarks =
                        note.remarks ??
                        note.Remarks ??
                        "";

                    const totalAmount =
                        note.totalAmount ??
                        note.TotalAmount ??
                        "";

                    const receiptDate =
                        note.receiptDate ??
                        note.ReceiptDate ??
                        note.receivedDate ??
                        note.ReceivedDate ??
                        "";

                    const searchableValues = [
                        goodsReceiptNoteId,
                        grnNumber,
                        purchaseOrderId,
                        supplierId,
                        sellerId,
                        customerId,
                        status,
                        remarks,
                        totalAmount,
                        receiptDate
                    ];

                    return searchableValues.some(
                        (value) =>
                            normalizeSearchValue(
                                value
                            ).includes(search)
                    );

                }
            );

        },
        [
            goodsReceiptNotes,
            searchText
        ]
    );

    // =========================================================
    // RESET PAGE ON SEARCH
    // =========================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText
    ]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalRecords =
        filteredNotes.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords /
                pageSize
            )
        );

    const paginatedNotes =
        filteredNotes.slice(
            (page - 1) * pageSize,
            page * pageSize
        );

    // =========================================================
    // KEEP PAGE VALID
    // =========================================================

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

    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(
        () => {

            const totalAmount =
                goodsReceiptNotes.reduce(
                    (
                        sum,
                        note
                    ) => {

                        const value =
                            Number(
                                note?.totalAmount ??
                                note?.TotalAmount ??
                                0
                            );

                        return (
                            sum +
                            (
                                Number.isFinite(value)
                                    ? value
                                    : 0
                            )
                        );

                    },
                    0
                );

            const totalReceived =
                goodsReceiptNotes.reduce(
                    (
                        sum,
                        note
                    ) => {

                        const value =
                            Number(
                                note?.receivedQuantity ??
                                note?.ReceivedQuantity ??
                                0
                            );

                        return (
                            sum +
                            (
                                Number.isFinite(value)
                                    ? value
                                    : 0
                            )
                        );

                    },
                    0
                );

            const totalRejected =
                goodsReceiptNotes.reduce(
                    (
                        sum,
                        note
                    ) => {

                        const value =
                            Number(
                                note?.rejectedQuantity ??
                                note?.RejectedQuantity ??
                                0
                            );

                        return (
                            sum +
                            (
                                Number.isFinite(value)
                                    ? value
                                    : 0
                            )
                        );

                    },
                    0
                );

            return {

                totalNotes:
                    goodsReceiptNotes.length,

                totalReceived,

                totalRejected,

                totalAmount

            };

        },
        [
            goodsReceiptNotes
        ]
    );

    // =========================================================
    // ADD
    // =========================================================

    const handleAdd = () => {

        navigate(
            "/goods-receipt-notes/create"
        );

    };

    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (note) => {

        const id =
            getGoodsReceiptNoteId(
                note
            );

        console.log(
            "VIEW GRN:",
            note
        );

        console.log(
            "VIEW GRN ID:",
            id
        );

        if (!id) {

            setSnackbar({
                open: true,
                message:
                    "Invalid Goods Receipt Note ID.",
                severity: "error"
            });

            return;
        }

        navigate(
            `/goods-receipt-notes/${id}`
        );

    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (note) => {

        const id =
            getGoodsReceiptNoteId(
                note
            );

        console.log(
            "EDIT GRN:",
            note
        );

        console.log(
            "EDIT GRN ID:",
            id
        );

        if (!id) {

            setSnackbar({
                open: true,
                message:
                    "Invalid Goods Receipt Note ID.",
                severity: "error"
            });

            return;
        }

        navigate(
            `/goods-receipt-notes/edit/${id}`
        );

    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (note) => {

        const id =
            getGoodsReceiptNoteId(
                note
            );

        console.log(
            "DELETE GRN:",
            note
        );

        console.log(
            "DELETE GRN ID:",
            id
        );

        if (!id) {

            setSnackbar({
                open: true,
                message:
                    "Invalid Goods Receipt Note ID.",
                severity: "error"
            });

            return;
        }

        setSelectedNote({
            ...note,
            goodsReceiptNoteId: id
        });

        setDeleteOpen(true);

    };

    // =========================================================
    // CONFIRM DELETE
    // =========================================================

    const handleDeleteConfirm =
        async (id) => {

            try {

                const goodsReceiptNoteId =
                    Number(id);

                if (
                    !Number.isInteger(
                        goodsReceiptNoteId
                    ) ||
                    goodsReceiptNoteId <= 0
                ) {

                    setSnackbar({
                        open: true,
                        message:
                            "Valid Goods Receipt Note ID is required.",
                        severity: "error"
                    });

                    return;

                }

                console.log(
                    "================================================="
                );

                console.log(
                    "DELETE GOODS RECEIPT NOTE"
                );

                console.log(
                    "ID:",
                    goodsReceiptNoteId
                );

                console.log(
                    "NODE URL:",
                    `${API_URL}/${goodsReceiptNoteId}`
                );

                const response =
                    await axios.delete(
                        `${API_URL}/${goodsReceiptNoteId}`,
                        {
                            timeout: 30000
                        }
                    );

                console.log(
                    "DELETE GRN STATUS:",
                    response.status
                );

                console.log(
                    "DELETE GRN RESPONSE:",
                    response.data
                );

                setDeleteOpen(false);

                setSelectedNote(null);

                await loadGoodsReceiptNotes();

                setSnackbar({
                    open: true,
                    message:
                        "Goods Receipt Note deleted successfully.",
                    severity: "success"
                });

            }
            catch (error) {

                console.error(
                    "DELETE GOODS RECEIPT NOTE ERROR:",
                    error
                );

                console.error(
                    "STATUS:",
                    error?.response?.status
                );

                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );

                setSnackbar({
                    open: true,
                    message:
                        error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        error?.message ||
                        "Failed to delete Goods Receipt Note.",
                    severity: "error"
                });

            }

        };

    // =========================================================
    // CLOSE DELETE
    // =========================================================

    const handleDeleteClose = () => {

        setDeleteOpen(false);

        setSelectedNote(null);

    };

    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (value) => {

        const newPage =
            Number(value);

        if (
            Number.isInteger(newPage) &&
            newPage > 0
        ) {

            setPage(newPage);

        }
        else {

            setPage(1);

        }

    };

    // =========================================================
    // PAGE SIZE CHANGE
    // =========================================================

    const handlePageSizeChange = (value) => {

        const newPageSize =
            Number(value);

        if (
            Number.isInteger(newPageSize) &&
            newPageSize > 0
        ) {

            setPageSize(
                newPageSize
            );

        }
        else {

            setPageSize(10);

        }

        setPage(1);

    };

    // =========================================================
    // SEARCH CHANGE
    // =========================================================

    const handleSearchChange = (value) => {

        setSearchText(
            value ?? ""
        );

        setPage(1);

    };

    // =========================================================
    // SNACKBAR CLOSE
    // =========================================================

    const handleSnackbarClose = () => {

        setSnackbar(
            (previous) => ({
                ...previous,
                open: false
            })
        );

    };

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Box
            className="goods-receipt-notes-container"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Goods Receipt Notes
            </Typography>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <GoodsReceiptNoteToolbar
                onAdd={
                    handleAdd
                }
                onRefresh={
                    loadGoodsReceiptNotes
                }
            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <GoodsReceiptNoteStatistics
                statistics={
                    statistics
                }
            />

            {/* =================================================
                SEARCH
            ================================================= */}

            <GoodsReceiptNoteSearch
                searchText={
                    searchText
                }
                setSearchText={
                    handleSearchChange
                }
            />

            {/* =================================================
                TABLE
            ================================================= */}

            {
                loading ? (

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="300px"
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                   <GoodsReceiptNoteTable
    notes={paginatedNotes}
    onView={handleView}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>

                )
            }

            {/* =================================================
                PAGINATION
            ================================================= */}

            <GoodsReceiptNotePagination
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
                    handlePageChange
                }
                onPageSizeChange={
                    handlePageSizeChange
                }
            />

            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteGoodsReceiptNoteDialog
                open={
                    deleteOpen
                }
                item={
                    selectedNote
                }
                onClose={
                    handleDeleteClose
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
                    severity={
                        snackbar.severity
                    }
                    onClose={
                        handleSnackbarClose
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

export default GoodsReceiptNoteList;