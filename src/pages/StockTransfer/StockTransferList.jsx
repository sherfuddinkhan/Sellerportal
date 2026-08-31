// =========================================================
// StockTransferList.jsx
// Central Stock Transfer Management Page
//
// FRONTEND
// React → Node server.js → .NET API
// =========================================================

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";

import {
    Delete,
    Edit,
    Visibility,
} from "@mui/icons-material";

import {
    useNavigate,
} from "react-router-dom";

import StockTransferToolbar
    from "./StockTransferToolbar";

import StockTransferStatistics
    from "./StockTransferStatistics";

import StockTransferFilters
    from "./StockTransferFilters";

// =========================================================
// NODE SERVER URL
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const StockTransferList = () => {

    const navigate =
        useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [
        transfers,
        setTransfers,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        sellerId,
        setSellerId,
    ] = useState("");

    const [
        productId,
        setProductId,
    ] = useState("");

    const [
        fromWarehouseId,
        setFromWarehouseId,
    ] = useState("");

    const [
        toWarehouseId,
        setToWarehouseId,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState("");

    const [
        sort,
        setSort,
    ] = useState("");

    const [
        page,
        setPage,
    ] = useState(0);

    const [
        rowsPerPage,
        setRowsPerPage,
    ] = useState(15);

    const [
        totalCount,
        setTotalCount,
    ] = useState(0);

    // =====================================================
    // LOAD ALL STOCK TRANSFERS
    // =====================================================

    const loadTransfers = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "Loading all stock transfers..."
                );

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/stock-transfers`
                    );

                console.log(
                    "Stock Transfers:",
                    response.data
                );

                const data =
                    extractArray(
                        response.data
                    );

                setTransfers(data);

                setTotalCount(
                    data.length
                );

                setPage(0);

            } catch (err) {

                console.error(
                    "Stock transfer load error:",
                    err
                );

                console.error(
                    "Response:",
                    err?.response?.data
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    "Failed to load stock transfers."
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadTransfers();

    }, [loadTransfers]);

    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = async () => {

        const searchValue =
            search.trim();

        // =================================================
        // EMPTY SEARCH
        // =================================================

        if (!searchValue) {

            await loadTransfers();

            return;
        }

        try {

            setLoading(true);
            setError("");

            console.log(
                "Searching stock transfers:",
                searchValue
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/stock-transfers/search`,
                    {
                        params: {
                            search:
                                searchValue,
                        },
                    }
                );

            console.log(
                "Search result:",
                response.data
            );

            const data =
                extractArray(
                    response.data
                );

            setTransfers(data);

            setTotalCount(
                extractTotal(
                    response.data,
                    data.length
                )
            );

            setPage(0);

        } catch (err) {

            console.error(
                "Stock transfer search error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Search failed."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // APPLY FILTERS
    // =====================================================

    const handleApplyFilters =
        async () => {

            try {

                setLoading(true);
                setError("");

                let response;

                // =========================================
                // SELLER
                // =========================================

                if (sellerId) {

                    response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/seller/${sellerId}`
                        );

                }

                // =========================================
                // PRODUCT
                // =========================================

                else if (productId) {

                    response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/product/${productId}`
                        );

                }

                // =========================================
                // FROM WAREHOUSE
                // =========================================

                else if (fromWarehouseId) {

                    response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/fromwarehouse/${fromWarehouseId}`
                        );

                }

                // =========================================
                // TO WAREHOUSE
                // =========================================

                else if (toWarehouseId) {

                    response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/towarehouse/${toWarehouseId}`
                        );

                }

                // =========================================
                // STATUS
                // =========================================

                else if (status) {

                    response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/status/${encodeURIComponent(status)}`
                        );

                }

                // =========================================
                // SORT
                // =========================================

                else if (sort) {

                    response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/sort`,
                            {
                                params: {
                                    sort,
                                },
                            }
                        );

                }

                // =========================================
                // PAGINATION
                // =========================================

                else {

                    response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/page`,
                            {
                                params: {
                                    page: 1,
                                    limit:
                                        rowsPerPage,
                                },
                            }
                        );

                }

                // =========================================
                // EXTRACT DATA
                // =========================================

                const data =
                    extractArray(
                        response.data
                    );

                setTransfers(data);

                setTotalCount(
                    extractTotal(
                        response.data,
                        data.length
                    )
                );

                setPage(0);

            } catch (err) {

                console.error(
                    "Stock transfer filter error:",
                    err
                );

                console.error(
                    "Response:",
                    err?.response?.data
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    "Failed to apply filters."
                );

            } finally {

                setLoading(false);

            }
        };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClearFilters =
        async () => {

            setSellerId("");
            setProductId("");
            setFromWarehouseId("");
            setToWarehouseId("");
            setStatus("");
            setSort("");
            setSearch("");

            setPage(0);

            await loadTransfers();
        };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        async (
            stockTransferId
        ) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this stock transfer?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                console.log(
                    "Deleting stock transfer:",
                    stockTransferId
                );

                await axios.delete(
                    `${SERVER_URL}/api/stock-transfers/${stockTransferId}`
                );

                await loadTransfers();

            } catch (err) {

                console.error(
                    "Stock transfer delete error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    "Failed to delete stock transfer."
                );

                setLoading(false);
            }
        };

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        (
            event,
            newPage
        ) => {

            setPage(
                newPage
            );
        };

    // =====================================================
    // ROWS PER PAGE
    // =====================================================

    const handleRowsPerPageChange =
        (
            event
        ) => {

            const newRows =
                parseInt(
                    event.target.value,
                    10
                );

            setRowsPerPage(
                newRows
            );

            setPage(0);
        };

    // =====================================================
    // CURRENT PAGE
    // =====================================================

    const visibleTransfers =
        transfers.slice(
            page * rowsPerPage,
            page * rowsPerPage +
                rowsPerPage
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 3,
                },
            }}
        >

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                    mb: 3,
                }}
            >
                Stock Transfers
            </Typography>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}

            {/* =================================================
                STATISTICS
            ================================================= */}

            <StockTransferStatistics />

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <StockTransferToolbar
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                onRefresh={loadTransfers}
                onAdd={() =>
                    navigate(
                        "/stock-transfers/create"
                    )
                }
            />

            {/* =================================================
                FILTERS
            ================================================= */}

            <StockTransferFilters
                sellerId={sellerId}
                setSellerId={setSellerId}

                productId={productId}
                setProductId={setProductId}

                fromWarehouseId={
                    fromWarehouseId
                }
                setFromWarehouseId={
                    setFromWarehouseId
                }

                toWarehouseId={
                    toWarehouseId
                }
                setToWarehouseId={
                    setToWarehouseId
                }

                status={status}
                setStatus={setStatus}

                sort={sort}
                setSort={setSort}

                onApply={
                    handleApplyFilters
                }

                onClear={
                    handleClearFilters
                }
            />

            {/* =================================================
                TABLE
            ================================================= */}

            <Paper>

                {loading ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            minHeight: 250,
                            p: 5,
                        }}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <TableContainer>

                        <Table>

                            {/* =================================
                                TABLE HEADER
                            ================================= */}

                            <TableHead>

                                <TableRow>

                                    <TableCell>
                                        ID
                                    </TableCell>

                                    <TableCell>
                                        Seller
                                    </TableCell>

                                    <TableCell>
                                        Product
                                    </TableCell>

                                    <TableCell>
                                        From Warehouse
                                    </TableCell>

                                    <TableCell>
                                        To Warehouse
                                    </TableCell>

                                    <TableCell>
                                        Quantity
                                    </TableCell>

                                    <TableCell>
                                        Status
                                    </TableCell>

                                    <TableCell>
                                        Date
                                    </TableCell>

                                    <TableCell align="right">
                                        Actions
                                    </TableCell>

                                </TableRow>

                            </TableHead>

                            {/* =================================
                                TABLE BODY
                            ================================= */}

                            <TableBody>

                                {visibleTransfers.length === 0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={9}
                                            align="center"
                                            sx={{
                                                py: 5,
                                            }}
                                        >
                                            No stock transfers found.
                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    visibleTransfers.map(
                                        (
                                            transfer
                                        ) => (

                                            <TableRow
                                                key={
                                                    transfer.stockTransferId
                                                }
                                                hover
                                            >

                                                {/* ID */}

                                                <TableCell>
                                                    {
                                                        transfer.stockTransferId
                                                    }
                                                </TableCell>

                                                {/* SELLER */}

                                                <TableCell>
                                                    {
                                                        transfer.sellerId
                                                    }
                                                </TableCell>

                                                {/* PRODUCT */}

                                                <TableCell>
                                                    {
                                                        transfer.productId
                                                    }
                                                </TableCell>

                                                {/* FROM WAREHOUSE */}

                                                <TableCell>
                                                    {
                                                        transfer.fromWarehouseId
                                                    }
                                                </TableCell>

                                                {/* TO WAREHOUSE */}

                                                <TableCell>
                                                    {
                                                        transfer.toWarehouseId
                                                    }
                                                </TableCell>

                                                {/* QUANTITY */}

                                                <TableCell>
                                                    {
                                                        transfer.quantity ??
                                                        0
                                                    }
                                                </TableCell>

                                                {/* STATUS */}

                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            transfer.status ||
                                                            "-"
                                                        }
                                                        size="small"
                                                        color={
                                                            getStatusColor(
                                                                transfer.status
                                                            )
                                                        }
                                                    />

                                                </TableCell>

                                                {/* DATE */}

                                                <TableCell>
                                                    {
                                                        formatDate(
                                                            transfer.transferDate
                                                        )
                                                    }
                                                </TableCell>

                                                {/* ACTIONS */}

                                                <TableCell
                                                    align="right"
                                                >

                                                    {/* VIEW */}

                                                    <IconButton
                                                        color="primary"
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(
                                                                `/stock-transfers/${transfer.stockTransferId}`
                                                            )
                                                        }
                                                    >
                                                        <Visibility />
                                                    </IconButton>

                                                    {/* EDIT */}

                                                    <IconButton
                                                        color="secondary"
                                                        title="Edit"
                                                        onClick={() =>
                                                            navigate(
                                                                `/stock-transfers/${transfer.stockTransferId}/edit`
                                                            )
                                                        }
                                                    >
                                                        <Edit />
                                                    </IconButton>

                                                    {/* DELETE */}

                                                    <IconButton
                                                        color="error"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                transfer.stockTransferId
                                                            )
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>

                                                </TableCell>

                                            </TableRow>

                                        )
                                    )

                                )}

                            </TableBody>

                        </Table>

                        {/* =====================================
                            PAGINATION
                        ===================================== */}

                        <TablePagination
                            component="div"
                            count={
                                totalCount
                            }
                            page={
                                page
                            }
                            onPageChange={
                                handlePageChange
                            }
                            rowsPerPage={
                                rowsPerPage
                            }
                            onRowsPerPageChange={
                                handleRowsPerPageChange
                            }
                            rowsPerPageOptions={[
                                10,
                                15,
                                25,
                                50,
                            ]}
                        />

                    </TableContainer>

                )}

            </Paper>

        </Box>
    );
};

// =========================================================
// EXTRACT ARRAY
// =========================================================

const extractArray = (
    result
) => {

    if (
        Array.isArray(result)
    ) {
        return result;
    }

    if (
        Array.isArray(
            result?.items
        )
    ) {
        return result.items;
    }

    if (
        Array.isArray(
            result?.data
        )
    ) {
        return result.data;
    }

    if (
        Array.isArray(
            result?.results
        )
    ) {
        return result.results;
    }

    return [];
};

// =========================================================
// EXTRACT TOTAL
// =========================================================

const extractTotal = (
    result,
    fallback
) => {

    return (
        result?.totalCount ??
        result?.total ??
        result?.count ??
        fallback
    );
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (
    value
) => {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }

    return date.toLocaleDateString();
};

// =========================================================
// STATUS COLOR
// =========================================================

const getStatusColor = (
    status
) => {

    switch (
        String(
            status || ""
        ).toLowerCase()
    ) {

        case "completed":
            return "success";

        case "approved":
            return "info";

        case "in transit":
            return "warning";

        case "cancelled":
            return "error";

        case "pending":
            return "default";

        default:
            return "default";
    }
};

// =========================================================
// EXPORT
// =========================================================

export default StockTransferList;
