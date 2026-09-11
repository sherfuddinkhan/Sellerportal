// ============================================================
// GoodsReceiptNoteFilters.jsx
// ============================================================

import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

// ============================================================
// API
// ============================================================

const SERVER_URL = "http://localhost:5000";

const GRN_API =
    `${SERVER_URL}/api/goods-receipt-notes`;

// ============================================================
// COMPONENT
// ============================================================

const GoodsReceiptNoteFilters = () => {

    const navigate = useNavigate();

    // ========================================================
    // DATA
    // ========================================================

    const [goodsReceiptNotes, setGoodsReceiptNotes] =
        useState([]);

    const [filteredNotes, setFilteredNotes] =
        useState([]);

    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    // ========================================================
    // ERROR
    // ========================================================

    const [error, setError] =
        useState("");

    // ========================================================
    // FILTERS
    // ========================================================

    const [filters, setFilters] = useState({
        sellerId: "",
        customerId: "",
        supplierId: "",
        purchaseOrderId: "",
        status: "",
        minAmount: "",
        maxAmount: ""
    });

    // ========================================================
    // LOAD DATA
    // ========================================================

    useEffect(() => {

        loadGoodsReceiptNotes();

    }, []);

    // ========================================================
    // GET ALL
    // ========================================================

    const loadGoodsReceiptNotes = async () => {

        setLoading(true);
        setError("");

        try {

            console.log(
                "GET GOODS RECEIPT NOTES:",
                GRN_API
            );

            const response = await axios.get(
                GRN_API
            );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.items ||
                      response.data?.data ||
                      [];

            console.log(
                "GOODS RECEIPT NOTES RESPONSE:",
                data
            );

            setGoodsReceiptNotes(data);
            setFilteredNotes(data);

        } catch (err) {

            console.error(
                "LOAD GOODS RECEIPT NOTES ERROR:",
                err.response?.data || err.message
            );

            const responseData =
                err.response?.data;

            if (
                typeof responseData === "string"
            ) {
                setError(responseData);
            }
            else if (
                responseData?.message
            ) {
                setError(responseData.message);
            }
            else if (
                responseData?.title
            ) {
                setError(responseData.title);
            }
            else {
                setError(
                    "Failed to load Goods Receipt Notes."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    // ========================================================
    // HELPERS
    // ========================================================

    const getValue = (
        item,
        camelCase,
        pascalCase
    ) => {

        return (
            item?.[camelCase] ??
            item?.[pascalCase] ??
            ""
        );
    };

    const getNumber = (
        item,
        camelCase,
        pascalCase
    ) => {

        const value =
            getValue(
                item,
                camelCase,
                pascalCase
            );

        const number =
            Number(value);

        return Number.isNaN(number)
            ? 0
            : number;
    };

    // ========================================================
    // UNIQUE STATUS VALUES
    // ========================================================

    const statuses = useMemo(() => {

        const values =
            goodsReceiptNotes
                .map((item) =>
                    getValue(
                        item,
                        "status",
                        "Status"
                    )
                )
                .filter(Boolean);

        return [
            ...new Set(values)
        ];

    }, [goodsReceiptNotes]);

    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleFilterChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ========================================================
    // APPLY FILTERS
    // ========================================================

    const handleApplyFilters = () => {

        let result = [
            ...goodsReceiptNotes
        ];

        // ----------------------------------------------------
        // SELLER
        // ----------------------------------------------------

        if (filters.sellerId !== "") {

            result = result.filter((item) =>
                String(
                    getValue(
                        item,
                        "sellerId",
                        "SellerId"
                    )
                ) ===
                String(filters.sellerId)
            );
        }

        // ----------------------------------------------------
        // CUSTOMER
        // ----------------------------------------------------

        if (filters.customerId !== "") {

            result = result.filter((item) =>
                String(
                    getValue(
                        item,
                        "customerId",
                        "CustomerId"
                    )
                ) ===
                String(filters.customerId)
            );
        }

        // ----------------------------------------------------
        // SUPPLIER
        // ----------------------------------------------------

        if (filters.supplierId !== "") {

            result = result.filter((item) =>
                String(
                    getValue(
                        item,
                        "supplierId",
                        "SupplierId"
                    )
                ) ===
                String(filters.supplierId)
            );
        }

        // ----------------------------------------------------
        // PURCHASE ORDER
        // ----------------------------------------------------

        if (filters.purchaseOrderId !== "") {

            result = result.filter((item) =>
                String(
                    getValue(
                        item,
                        "purchaseOrderId",
                        "PurchaseOrderId"
                    )
                ) ===
                String(filters.purchaseOrderId)
            );
        }

        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        if (filters.status !== "") {

            result = result.filter((item) =>
                String(
                    getValue(
                        item,
                        "status",
                        "Status"
                    )
                ).toLowerCase() ===
                String(filters.status).toLowerCase()
            );
        }

        // ----------------------------------------------------
        // MINIMUM AMOUNT
        // ----------------------------------------------------

        if (filters.minAmount !== "") {

            const minAmount =
                Number(filters.minAmount);

            if (!Number.isNaN(minAmount)) {

                result = result.filter((item) =>
                    getNumber(
                        item,
                        "totalAmount",
                        "TotalAmount"
                    ) >= minAmount
                );
            }
        }

        // ----------------------------------------------------
        // MAXIMUM AMOUNT
        // ----------------------------------------------------

        if (filters.maxAmount !== "") {

            const maxAmount =
                Number(filters.maxAmount);

            if (!Number.isNaN(maxAmount)) {

                result = result.filter((item) =>
                    getNumber(
                        item,
                        "totalAmount",
                        "TotalAmount"
                    ) <= maxAmount
                );
            }
        }

        setFilteredNotes(result);
    };

    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const handleClearFilters = () => {

        const emptyFilters = {
            sellerId: "",
            customerId: "",
            supplierId: "",
            purchaseOrderId: "",
            status: "",
            minAmount: "",
            maxAmount: ""
        };

        setFilters(emptyFilters);

        setFilteredNotes(
            goodsReceiptNotes
        );
    };

    // ========================================================
    // VIEW DETAILS
    // ========================================================

    const handleView = (item) => {

        const id =
            getValue(
                item,
                "goodsReceiptNoteId",
                "GoodsReceiptNoteId"
            );

        if (!id) {
            return;
        }

        navigate(
            `/goods-receipt-notes/details/${id}`
        );
    };

    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = (item) => {

        const id =
            getValue(
                item,
                "goodsReceiptNoteId",
                "GoodsReceiptNoteId"
            );

        if (!id) {
            return;
        }

        navigate(
            `/goods-receipt-notes/edit/${id}`
        );
    };

    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            "/goods-receipt-notes"
        );
    };

    // ========================================================
    // FORMAT AMOUNT
    // ========================================================

    const formatAmount = (item) => {

        const amount =
            getNumber(
                item,
                "totalAmount",
                "TotalAmount"
            );

        return amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <Stack
                    spacing={2}
                    alignItems="center"
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading Goods Receipt Notes...
                    </Typography>

                </Stack>

            </Box>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box
            sx={{
                p: 3,
                width: "100%"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                spacing={2}
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Goods Receipt Note Filters
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Filter Goods Receipt Notes
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    onClick={handleBack}
                >
                    Back
                </Button>

            </Stack>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            <Card
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Filter Criteria
                    </Typography>

                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================================
                            SELLER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Seller ID"
                                name="sellerId"
                                value={
                                    filters.sellerId
                                }
                                onChange={
                                    handleFilterChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            CUSTOMER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Customer ID"
                                name="customerId"
                                value={
                                    filters.customerId
                                }
                                onChange={
                                    handleFilterChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            SUPPLIER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Supplier ID"
                                name="supplierId"
                                value={
                                    filters.supplierId
                                }
                                onChange={
                                    handleFilterChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            PURCHASE ORDER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Purchase Order ID"
                                name="purchaseOrderId"
                                value={
                                    filters.purchaseOrderId
                                }
                                onChange={
                                    handleFilterChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <FormControl
                                fullWidth
                            >

                                <InputLabel>
                                    Status
                                </InputLabel>

                                <Select
                                    label="Status"
                                    name="status"
                                    value={
                                        filters.status
                                    }
                                    onChange={
                                        handleFilterChange
                                    }
                                >

                                    <MenuItem value="">
                                        All Statuses
                                    </MenuItem>

                                    {statuses.map(
                                        (status) => (
                                            <MenuItem
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </MenuItem>
                                        )
                                    )}

                                </Select>

                            </FormControl>

                        </Grid>


                        {/* =================================================
                            MIN AMOUNT
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Minimum Amount"
                                name="minAmount"
                                value={
                                    filters.minAmount
                                }
                                onChange={
                                    handleFilterChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            MAX AMOUNT
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Maximum Amount"
                                name="maxAmount"
                                value={
                                    filters.maxAmount
                                }
                                onChange={
                                    handleFilterChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />

                        </Grid>

                    </Grid>


                    <Divider
                        sx={{
                            my: 3
                        }}
                    />


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="outlined"
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear
                        </Button>

                        <Button
                            variant="contained"
                            onClick={
                                handleApplyFilters
                            }
                        >
                            Apply Filters
                        </Button>

                    </Stack>

                </CardContent>

            </Card>


            {/* =================================================
                RESULTS
            ================================================= */}

            <Card>

                <CardContent>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center"
                        }}
                        spacing={1}
                        sx={{
                            mb: 2
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Filter Results
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {filteredNotes.length} result
                            {filteredNotes.length === 1
                                ? ""
                                : "s"}
                        </Typography>

                    </Stack>

                    <Divider
                        sx={{
                            mb: 2
                        }}
                    />


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {filteredNotes.length === 0 ? (

                        <Alert
                            severity="info"
                        >
                            No Goods Receipt Notes match
                            the selected filters.
                        </Alert>

                    ) : (

                        <Box
                            sx={{
                                overflowX: "auto"
                            }}
                        >

                            <Box
                                component="table"
                                sx={{
                                    width: "100%",
                                    borderCollapse:
                                        "collapse",
                                    minWidth: 900,

                                    "& th, & td": {
                                        borderBottom:
                                            "1px solid",
                                        borderColor:
                                            "divider",
                                        padding: "12px",
                                        textAlign: "left"
                                    },

                                    "& th": {
                                        fontWeight: 600,
                                        backgroundColor:
                                            "action.hover"
                                    }
                                }}
                            >

                                <thead>

                                    <tr>

                                        <th>
                                            GRN ID
                                        </th>

                                        <th>
                                            GRN Number
                                        </th>

                                        <th>
                                            Purchase Order
                                        </th>

                                        <th>
                                            Supplier
                                        </th>

                                        <th>
                                            Seller
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredNotes.map(
                                        (item, index) => {

                                            const id =
                                                getValue(
                                                    item,
                                                    "goodsReceiptNoteId",
                                                    "GoodsReceiptNoteId"
                                                );

                                            const grnNumber =
                                                getValue(
                                                    item,
                                                    "grnNumber",
                                                    "GRNNumber"
                                                );

                                            const purchaseOrderId =
                                                getValue(
                                                    item,
                                                    "purchaseOrderId",
                                                    "PurchaseOrderId"
                                                );

                                            const supplierId =
                                                getValue(
                                                    item,
                                                    "supplierId",
                                                    "SupplierId"
                                                );

                                            const sellerId =
                                                getValue(
                                                    item,
                                                    "sellerId",
                                                    "SellerId"
                                                );

                                            const customerId =
                                                getValue(
                                                    item,
                                                    "customerId",
                                                    "CustomerId"
                                                );

                                            const status =
                                                getValue(
                                                    item,
                                                    "status",
                                                    "Status"
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        id ||
                                                        index
                                                    }
                                                >

                                                    <td>
                                                        {id || "-"}
                                                    </td>

                                                    <td>
                                                        {
                                                            grnNumber ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            purchaseOrderId ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            supplierId ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            sellerId ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            customerId ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            status ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        ₹{" "}
                                                        {
                                                            formatAmount(
                                                                item
                                                            )
                                                        }
                                                    </td>

                                                    <td>

                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                        >

                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    handleView(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>

                                                        </Stack>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </Box>

                        </Box>
                    )}

                </CardContent>

            </Card>


            {/* =================================================
                ERROR SNACKBAR
            ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={() => setError("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{
                        width: "100%"
                    }}
                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default GoodsReceiptNoteFilters;

