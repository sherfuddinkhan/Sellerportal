// =========================================================
// StockAdjustmentList.jsx
// Stock Adjustment List
// =========================================================

import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    Add,
    Delete,
    Edit,
    Refresh,
    Search,
    Visibility
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentList = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [adjustments, setAdjustments] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [sort, setSort] = useState("");

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(15);

    const [totalPages, setTotalPages] = useState(1);

    const [totalRecords, setTotalRecords] = useState(0);

    const [deleteLoading, setDeleteLoading] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD ALL
    // =====================================================

    const loadAdjustments = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            let url =
                `${SERVER_URL}/api/stock-adjustments`;

            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

            if (search.trim()) {

                url =
                    `${SERVER_URL}/api/stock-adjustments/search?search=${encodeURIComponent(
                        search.trim()
                    )}`;

            }

            // -------------------------------------------------
            // SORT
            // -------------------------------------------------

            else if (sort) {

                url =
                    `${SERVER_URL}/api/stock-adjustments/sort?sort=${encodeURIComponent(
                        sort
                    )}`;

            }

            // -------------------------------------------------
            // PAGINATION
            // -------------------------------------------------

            else {

                url =
                    `${SERVER_URL}/api/stock-adjustments/page?page=${page}&limit=${limit}`;

            }


            const response = await fetch(url);


            if (!response.ok) {

                throw new Error(
                    `Request failed with status ${response.status}`
                );

            }


            const data = await response.json();


            // =================================================
            // NORMALIZE RESPONSE
            // =================================================

            let records = [];

            if (Array.isArray(data)) {

                records = data;

            }

            else if (Array.isArray(data.items)) {

                records = data.items;

            }

            else if (Array.isArray(data.data)) {

                records = data.data;

            }

            else if (Array.isArray(data.results)) {

                records = data.results;

            }


            setAdjustments(records);


            // =================================================
            // PAGINATION INFORMATION
            // =================================================

            const total =
                data.totalCount ??
                data.totalRecords ??
                data.total ??
                records.length;


            const pages =
                data.totalPages ??
                Math.max(
                    1,
                    Math.ceil(total / limit)
                );


            setTotalRecords(total);
            setTotalPages(pages);

        }

        catch (err) {

            console.error(
                "Stock Adjustment Load Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load stock adjustments"
            );

            setAdjustments([]);

        }

        finally {

            setLoading(false);

        }

    }, [
        search,
        sort,
        page,
        limit
    ]);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAdjustments();

    }, [loadAdjustments]);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {

        setPage(1);

        loadAdjustments();

    };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch = () => {

        setSearch("");
        setSort("");
        setPage(1);

    };


    // =====================================================
    // SORT
    // =====================================================

    const handleSortChange = (event) => {

        setSort(event.target.value);

        setPage(1);

    };


    // =====================================================
    // PAGE SIZE
    // =====================================================

    const handleLimitChange = (event) => {

        setLimit(
            Number(event.target.value)
        );

        setPage(1);

    };


    // =====================================================
    // PREVIOUS PAGE
    // =====================================================

    const handlePreviousPage = () => {

        if (page > 1) {

            setPage(
                previous => previous - 1
            );

        }

    };


    // =====================================================
    // NEXT PAGE
    // =====================================================

    const handleNextPage = () => {

        if (page < totalPages) {

            setPage(
                previous => previous + 1
            );

        }

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (id) => {

        navigate(
            `/stock-adjustments/view/${id}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (id) => {

        navigate(
            `/stock-adjustments/edit/${id}`
        );

    };


    // =====================================================
    // CREATE
    // =====================================================

    const handleCreate = () => {

        navigate(
            "/stock-adjustments/create"
        );

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this stock adjustment?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeleteLoading(id);

            setError("");


            const response = await fetch(
                `${SERVER_URL}/api/stock-adjustments/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    `Delete failed with status ${response.status}`
                );

            }


            setSuccess(
                "Stock adjustment deleted successfully."
            );


            await loadAdjustments();

        }

        catch (err) {

            console.error(
                "Delete Stock Adjustment Error:",
                err
            );

            setError(
                err.message ||
                "Failed to delete stock adjustment"
            );

        }

        finally {

            setDeleteLoading(null);

        }

    };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        loadAdjustments();

    };


    // =====================================================
    // FIELD HELPER
    // =====================================================

    const getValue = (
        item,
        ...fields
    ) => {

        for (const field of fields) {

            if (
                item[field] !== undefined &&
                item[field] !== null
            ) {

                return item[field];

            }

        }

        return "-";

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

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

            return value;

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // FORMAT NUMBER
    // =====================================================

    const formatNumber = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "-";

        }


        const number =
            Number(value);


        if (Number.isNaN(number)) {

            return value;

        }


        return number.toLocaleString(
            "en-IN"
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Container
            maxWidth="xl"
            sx={{
                py: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center"
                    },
                    gap: 2,
                    mb: 3,
                    flexDirection: {
                        xs: "column",
                        md: "row"
                    }
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Stock Adjustments
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage inventory stock adjustments
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Add Stock Adjustment
                </Button>

            </Box>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 2
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        md: "row"
                    }}
                    spacing={2}
                >

                    {/* SEARCH */}

                    <TextField
                        fullWidth
                        size="small"
                        label="Search"
                        placeholder="Search stock adjustments..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        onKeyDown={(event) => {

                            if (
                                event.key === "Enter"
                            ) {

                                handleSearch();

                            }

                        }}
                        InputProps={{
                            startAdornment: (
                                <Search
                                    sx={{
                                        mr: 1,
                                        color: "text.secondary"
                                    }}
                                />
                            )
                        }}
                    />


                    {/* SORT */}

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 190
                        }}
                    >

                        <InputLabel>
                            Sort
                        </InputLabel>

                        <Select
                            value={sort}
                            label="Sort"
                            onChange={handleSortChange}
                        >

                            <MenuItem value="">
                                Default
                            </MenuItem>

                            <MenuItem value="date_desc">
                                Date: Newest
                            </MenuItem>

                            <MenuItem value="date_asc">
                                Date: Oldest
                            </MenuItem>

                            <MenuItem value="quantity_desc">
                                Quantity: High to Low
                            </MenuItem>

                            <MenuItem value="quantity_asc">
                                Quantity: Low to High
                            </MenuItem>

                        </Select>

                    </FormControl>


                    {/* SEARCH BUTTON */}

                    <Button
                        variant="outlined"
                        startIcon={<Search />}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>


                    {/* CLEAR */}

                    <Button
                        variant="outlined"
                        onClick={handleClearSearch}
                    >
                        Clear
                    </Button>


                    {/* REFRESH */}

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>

                </Stack>

            </Paper>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <Paper
                elevation={1}
                sx={{
                    overflow: "hidden"
                }}
            >

                <Box
                    sx={{
                        overflowX: "auto"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={headerStyle}>
                                    ID
                                </th>

                                <th style={headerStyle}>
                                    Seller
                                </th>

                                <th style={headerStyle}>
                                    Product
                                </th>

                                <th style={headerStyle}>
                                    Warehouse
                                </th>

                                <th style={headerStyle}>
                                    Adjustment Type
                                </th>

                                <th style={headerStyle}>
                                    Quantity
                                </th>

                                <th style={headerStyle}>
                                    Date
                                </th>

                                <th style={headerStyle}>
                                    Remarks
                                </th>

                                <th
                                    style={{
                                        ...headerStyle,
                                        textAlign: "center"
                                    }}
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={9}
                                        style={{
                                            textAlign: "center",
                                            padding: "40px"
                                        }}
                                    >

                                        <CircularProgress />

                                        <Typography
                                            sx={{
                                                mt: 1
                                            }}
                                        >
                                            Loading stock adjustments...
                                        </Typography>

                                    </td>

                                </tr>

                            ) : adjustments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={9}
                                        style={{
                                            textAlign: "center",
                                            padding: "40px"
                                        }}
                                    >

                                        <Typography
                                            color="text.secondary"
                                        >
                                            No stock adjustments found.
                                        </Typography>

                                    </td>

                                </tr>

                            ) : (

                                adjustments.map(
                                    (item, index) => {

                                        const id =
                                            getValue(
                                                item,
                                                "stockAdjustmentId",
                                                "StockAdjustmentId",
                                                "id",
                                                "Id"
                                            );


                                        const sellerId =
                                            getValue(
                                                item,
                                                "sellerId",
                                                "SellerId"
                                            );


                                        const productId =
                                            getValue(
                                                item,
                                                "productId",
                                                "ProductId"
                                            );


                                        const warehouseId =
                                            getValue(
                                                item,
                                                "warehouseId",
                                                "WarehouseId"
                                            );


                                        const adjustmentType =
                                            getValue(
                                                item,
                                                "adjustmentType",
                                                "AdjustmentType"
                                            );


                                        const quantity =
                                            getValue(
                                                item,
                                                "quantity",
                                                "Quantity"
                                            );


                                        const date =
                                            getValue(
                                                item,
                                                "adjustmentDate",
                                                "AdjustmentDate",
                                                "date",
                                                "Date",
                                                "createdDate",
                                                "CreatedDate"
                                            );


                                        const remarks =
                                            getValue(
                                                item,
                                                "remarks",
                                                "Remarks"
                                            );


                                        return (

                                            <tr
                                                key={
                                                    id !== "-"
                                                        ? id
                                                        : index
                                                }
                                            >

                                                <td style={cellStyle}>
                                                    {id}
                                                </td>

                                                <td style={cellStyle}>
                                                    {sellerId}
                                                </td>

                                                <td style={cellStyle}>
                                                    {productId}
                                                </td>

                                                <td style={cellStyle}>
                                                    {warehouseId}
                                                </td>

                                                <td style={cellStyle}>
                                                    {adjustmentType}
                                                </td>

                                                <td style={cellStyle}>
                                                    {formatNumber(
                                                        quantity
                                                    )}
                                                </td>

                                                <td style={cellStyle}>
                                                    {formatDate(
                                                        date
                                                    )}
                                                </td>

                                                <td style={cellStyle}>
                                                    {remarks}
                                                </td>

                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        textAlign: "center"
                                                    }}
                                                >

                                                    <Stack
                                                        direction="row"
                                                        spacing={0.5}
                                                        justifyContent="center"
                                                    >

                                                        <Button
                                                            size="small"
                                                            title="View"
                                                            onClick={() =>
                                                                handleView(id)
                                                            }
                                                        >
                                                            <Visibility />
                                                        </Button>


                                                        <Button
                                                            size="small"
                                                            title="Edit"
                                                            onClick={() =>
                                                                handleEdit(id)
                                                            }
                                                        >
                                                            <Edit />
                                                        </Button>


                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            title="Delete"
                                                            disabled={
                                                                deleteLoading === id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(id)
                                                            }
                                                        >

                                                            {deleteLoading === id
                                                                ? (
                                                                    <CircularProgress
                                                                        size={20}
                                                                    />
                                                                )
                                                                : (
                                                                    <Delete />
                                                                )}

                                                        </Button>

                                                    </Stack>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </Box>


                {/* =================================================
                    PAGINATION
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Total Records: {totalRecords}
                    </Typography>


                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >

                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 90
                            }}
                        >

                            <InputLabel>
                                Rows
                            </InputLabel>

                            <Select
                                value={limit}
                                label="Rows"
                                onChange={handleLimitChange}
                            >

                                <MenuItem value={10}>
                                    10
                                </MenuItem>

                                <MenuItem value={15}>
                                    15
                                </MenuItem>

                                <MenuItem value={25}>
                                    25
                                </MenuItem>

                                <MenuItem value={50}>
                                    50
                                </MenuItem>

                            </Select>

                        </FormControl>


                        <Button
                            variant="outlined"
                            disabled={
                                page <= 1 ||
                                loading
                            }
                            onClick={
                                handlePreviousPage
                            }
                        >
                            Previous
                        </Button>


                        <Typography
                            variant="body2"
                            sx={{
                                minWidth: 80,
                                textAlign: "center"
                            }}
                        >
                            Page {page} of {totalPages}
                        </Typography>


                        <Button
                            variant="outlined"
                            disabled={
                                page >= totalPages ||
                                loading
                            }
                            onClick={
                                handleNextPage
                            }
                        >
                            Next
                        </Button>

                    </Stack>

                </Box>

            </Paper>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccess("")
                }
                message={success}
            />

        </Container>

    );
};


// =========================================================
// TABLE STYLES
// =========================================================

const headerStyle = {

    padding: "14px 12px",

    textAlign: "left",

    fontWeight: 700,

    whiteSpace: "nowrap",

    backgroundColor: "#f5f5f5",

    borderBottom: "1px solid #ddd"

};


const cellStyle = {

    padding: "12px",

    borderBottom: "1px solid #eee",

    whiteSpace: "nowrap"

};


// =========================================================
// EXPORT
// =========================================================

export default StockAdjustmentList;

