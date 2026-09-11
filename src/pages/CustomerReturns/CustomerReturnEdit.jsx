// =========================================================
// CustomerReturnEdit.jsx
// Customer Return Edit Page
//
// React
//   ↓
// Node server.js
//   ↓
// ASP.NET Core CustomerReturnController
//
// React API:
// GET  /api/customer-returns/:id
// PUT  /api/customer-returns/:id
//
// ASP.NET API:
// GET  /api/CustomerReturn/:id
// PUT  /api/CustomerReturn/:id
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
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Save,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/customer-returns`;

// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // =====================================================
    // CUSTOMER RETURN ID
    // =====================================================

    const returnId =
        String(id ?? "").trim();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [form, setForm] = useState({
        SalesInvoiceId: "",
        ProductId: "",
        ReturnNumber: "",
        ReturnDate: "",
        Quantity: "",
        ReturnAmount: "",
        Reason: "",
        Status: "Pending",
        SellerId: "",
        CustomerId: "",
    });

    // =====================================================
    // GET VALUE
    // Supports PascalCase + camelCase
    // =====================================================

    const getValue = (
        data,
        pascalName,
        camelName,
        defaultValue = ""
    ) => {

        if (!data) {
            return defaultValue;
        }

        return (
            data[pascalName] ??
            data[camelName] ??
            defaultValue
        );
    };

    // =====================================================
    // EXTRACT CUSTOMER RETURN
    // =====================================================

    const extractReturnData = (
        responseData
    ) => {

        if (!responseData) {
            return null;
        }

        // Direct CustomerReturn object
        if (
            responseData.CustomerReturnId !== undefined ||
            responseData.customerReturnId !== undefined
        ) {
            return responseData;
        }

        // { data: object }
        if (
            responseData.data &&
            typeof responseData.data === "object" &&
            !Array.isArray(responseData.data)
        ) {
            return responseData.data;
        }

        // { item: object }
        if (
            responseData.item &&
            typeof responseData.item === "object" &&
            !Array.isArray(responseData.item)
        ) {
            return responseData.item;
        }

        // { customerReturn: object }
        if (
            responseData.customerReturn &&
            typeof responseData.customerReturn === "object" &&
            !Array.isArray(responseData.customerReturn)
        ) {
            return responseData.customerReturn;
        }

        // { return: object }
        if (
            responseData.return &&
            typeof responseData.return === "object" &&
            !Array.isArray(responseData.return)
        ) {
            return responseData.return;
        }

        return responseData;
    };

    // =====================================================
    // FORMAT DATE
    // datetime-local requires:
    //
    // YYYY-MM-DDTHH:mm
    // =====================================================

    const formatDateTimeLocal = (
        value
    ) => {

        if (!value) {
            return "";
        }

        // Already suitable
        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
        ) {
            return value.substring(0, 16);
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                date.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                date.getMinutes()
            ).padStart(2, "0");

        return (
            `${year}-${month}-${day}` +
            `T${hours}:${minutes}`
        );
    };

    // =====================================================
    // LOAD CUSTOMER RETURN BY ID
    // =====================================================

    const loadReturn = useCallback(
        async () => {

            // -------------------------------------------------
            // Validate ID
            // -------------------------------------------------

            if (!returnId) {

                setError(
                    "Customer Return ID is missing from the URL."
                );

                setLoading(false);

                return;
            }

            if (
                returnId === ":id" ||
                !/^\d+$/.test(returnId)
            ) {

                setError(
                    `Invalid Customer Return ID: ${returnId}`
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                setError("");

                // -------------------------------------------------
                // React → Node
                // -------------------------------------------------

                const requestUrl =
                    `${API_URL}/${returnId}`;

                console.log(
                    "================================================="
                );

                console.log(
                    "GET CUSTOMER RETURN BY ID"
                );

                console.log(
                    "Customer Return ID:",
                    returnId
                );

                console.log(
                    "React → Node:",
                    requestUrl
                );

                console.log(
                    "================================================="
                );

                // -------------------------------------------------
                // GET
                // -------------------------------------------------

                const response =
                    await axios.get(
                        requestUrl,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                            },
                            timeout: 30000,
                        }
                    );

                console.log(
                    "Customer Return GET status:",
                    response.status
                );

                console.log(
                    "Customer Return GET response:",
                    response.data
                );

                // -------------------------------------------------
                // Extract object
                // -------------------------------------------------

                const data =
                    extractReturnData(
                        response.data
                    );

                if (!data) {

                    throw new Error(
                        "Customer Return response is empty."
                    );
                }

                console.log(
                    "Normalized Customer Return:",
                    data
                );

                // -------------------------------------------------
                // Extract fields
                // -------------------------------------------------

                const salesInvoiceId =
                    getValue(
                        data,
                        "SalesInvoiceId",
                        "salesInvoiceId"
                    );

                const productId =
                    getValue(
                        data,
                        "ProductId",
                        "productId"
                    );

                const returnNumber =
                    getValue(
                        data,
                        "ReturnNumber",
                        "returnNumber"
                    );

                const returnDate =
                    getValue(
                        data,
                        "ReturnDate",
                        "returnDate"
                    );

                const quantity =
                    getValue(
                        data,
                        "Quantity",
                        "quantity"
                    );

                const returnAmount =
                    getValue(
                        data,
                        "ReturnAmount",
                        "returnAmount"
                    );

                const reason =
                    getValue(
                        data,
                        "Reason",
                        "reason"
                    );

                const status =
                    getValue(
                        data,
                        "Status",
                        "status",
                        "Pending"
                    );

                const sellerId =
                    getValue(
                        data,
                        "SellerId",
                        "sellerId"
                    );

                const customerId =
                    getValue(
                        data,
                        "CustomerId",
                        "customerId"
                    );

                // -------------------------------------------------
                // Populate form
                // -------------------------------------------------

                setForm({
                    SalesInvoiceId:
                        salesInvoiceId ?? "",

                    ProductId:
                        productId ?? "",

                    ReturnNumber:
                        returnNumber ?? "",

                    ReturnDate:
                        formatDateTimeLocal(
                            returnDate
                        ),

                    Quantity:
                        quantity ?? "",

                    ReturnAmount:
                        returnAmount ?? "",

                    Reason:
                        reason ?? "",

                    Status:
                        status || "Pending",

                    SellerId:
                        sellerId ?? "",

                    CustomerId:
                        customerId ?? "",
                });

            }
            catch (err) {

                console.error(
                    "================================================="
                );

                console.error(
                    "LOAD CUSTOMER RETURN ERROR"
                );

                console.error(
                    "Customer Return ID:",
                    returnId
                );

                console.error(
                    "React → Node URL:",
                    `${API_URL}/${returnId}`
                );

                console.error(
                    "HTTP Status:",
                    err.response?.status
                );

                console.error(
                    "Response:",
                    err.response?.data
                );

                console.error(
                    "Error:",
                    err
                );

                console.error(
                    "================================================="
                );

                const status =
                    err.response?.status;

                const responseData =
                    err.response?.data;

                const serverMessage =
                    responseData?.message ||
                    responseData?.title ||
                    (
                        typeof responseData === "string"
                            ? responseData
                            : ""
                    );

                if (status === 404) {

                    setError(
                        `Customer Return ID ${returnId} was not found.`
                    );

                }
                else if (status === 400) {

                    setError(
                        serverMessage ||
                        "Invalid Customer Return ID."
                    );

                }
                else {

                    setError(
                        serverMessage ||
                        `Unable to load Customer Return.${
                            status
                                ? ` HTTP ${status}`
                                : ""
                        }`
                    );
                }

            }
            finally {

                setLoading(false);

            }

        },
        [returnId]
    );

    // =====================================================
    // LOAD WHEN ID CHANGES
    // =====================================================

    useEffect(() => {

        loadReturn();

    }, [loadReturn]);

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        if (!form.SalesInvoiceId) {
            return "Sales Invoice ID is required.";
        }

        if (
            Number(form.SalesInvoiceId) <= 0
        ) {
            return "Sales Invoice ID must be greater than 0.";
        }

        if (!form.ProductId) {
            return "Product ID is required.";
        }

        if (
            Number(form.ProductId) <= 0
        ) {
            return "Product ID must be greater than 0.";
        }

        if (
            !form.ReturnNumber.trim()
        ) {
            return "Return Number is required.";
        }

        if (!form.ReturnDate) {
            return "Return Date is required.";
        }

        if (!form.Quantity) {
            return "Quantity is required.";
        }

        if (
            Number(form.Quantity) <= 0
        ) {
            return "Quantity must be greater than 0.";
        }

        if (
            form.ReturnAmount === ""
        ) {
            return "Return Amount is required.";
        }

        if (
            Number(form.ReturnAmount) < 0
        ) {
            return "Return Amount cannot be negative.";
        }

        if (!form.SellerId) {
            return "Seller ID is required.";
        }

        if (
            Number(form.SellerId) <= 0
        ) {
            return "Seller ID must be greater than 0.";
        }

        if (!form.CustomerId) {
            return "Customer ID is required.";
        }

        if (
            Number(form.CustomerId) <= 0
        ) {
            return "Customer ID must be greater than 0.";
        }

        return "";
    };

    // =====================================================
    // SAVE / UPDATE
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        // -------------------------------------------------
        // Validate ID
        // -------------------------------------------------

        if (
            !returnId ||
            returnId === ":id" ||
            !/^\d+$/.test(returnId)
        ) {

            setError(
                `Invalid Customer Return ID: ${returnId}`
            );

            return;
        }

        // -------------------------------------------------
        // Validate form
        // -------------------------------------------------

        const validationError =
            validateForm();

        if (validationError) {

            setError(
                validationError
            );

            return;
        }

        try {

            setSaving(true);

            setError("");

            // -------------------------------------------------
            // Build payload
            // -------------------------------------------------

            const payload = {

                SalesInvoiceId:
                    Number(
                        form.SalesInvoiceId
                    ),

                ProductId:
                    Number(
                        form.ProductId
                    ),

                ReturnNumber:
                    form.ReturnNumber.trim(),

                ReturnDate:
                    form.ReturnDate,

                Quantity:
                    Number(
                        form.Quantity
                    ),

                ReturnAmount:
                    Number(
                        form.ReturnAmount
                    ),

                Reason:
                    form.Reason?.trim() || "",

                Status:
                    form.Status || "Pending",

                SellerId:
                    Number(
                        form.SellerId
                    ),

                CustomerId:
                    Number(
                        form.CustomerId
                    ),
            };

            const requestUrl =
                `${API_URL}/${returnId}`;

            console.log(
                "================================================="
            );

            console.log(
                "UPDATE CUSTOMER RETURN"
            );

            console.log(
                "Customer Return ID:",
                returnId
            );

            console.log(
                "React → Node:",
                requestUrl
            );

            console.log(
                "Payload:",
                payload
            );

            console.log(
                "================================================="
            );

            // -------------------------------------------------
            // PUT
            // -------------------------------------------------

            const response =
                await axios.put(
                    requestUrl,
                    payload,
                    {
                        headers: {
                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "Customer Return UPDATE status:",
                response.status
            );

            console.log(
                "Customer Return UPDATE response:",
                response.data
            );

            // -------------------------------------------------
            // Success
            // -------------------------------------------------

            setSuccess(true);

            setTimeout(() => {

                // IMPORTANT:
                // Current App.jsx route is:
                //
                // customer-returns/details/:id
                //
                navigate(
                    `/customer-returns/details/${returnId}`
                );

            }, 700);

        }
        catch (err) {

            console.error(
                "================================================="
            );

            console.error(
                "UPDATE CUSTOMER RETURN ERROR"
            );

            console.error(
                "Customer Return ID:",
                returnId
            );

            console.error(
                "HTTP Status:",
                err.response?.status
            );

            console.error(
                "Response:",
                err.response?.data
            );

            console.error(
                "Error:",
                err
            );

            console.error(
                "================================================="
            );

            const status =
                err.response?.status;

            const responseData =
                err.response?.data;

            const serverMessage =
                responseData?.message ||
                responseData?.title ||
                (
                    typeof responseData === "string"
                        ? responseData
                        : ""
                );

            if (status === 404) {

                setError(
                    `Customer Return ID ${returnId} was not found or the update endpoint returned 404.`
                );

            }
            else if (status === 400) {

                setError(
                    serverMessage ||
                    "Invalid Customer Return data."
                );

            }
            else {

                setError(
                    serverMessage ||
                    `Unable to update Customer Return.${
                        status
                            ? ` HTTP ${status}`
                            : ""
                    }`
                );
            }

        }
        finally {

            setSaving(false);

        }
    };

    // =====================================================
    // GO TO DETAILS
    //
    // IMPORTANT:
    // This must NOT navigate to /edit/:id.
    // =====================================================

    const goToDetails = () => {

        if (!returnId) {

            navigate(
                "/customer-returns"
            );

            return;
        }

        navigate(
            `/customer-returns/details/${returnId}`
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <CircularProgress />

            </Box>

        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                p: 3,
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                sx={{
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Edit Customer Return
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update customer return information
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Return ID: {returnId}
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={goToDetails}
                    disabled={saving}
                >
                    Back
                </Button>

            </Stack>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}

            {/* =================================================
                FORM
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 2,
                            }}
                        >
                            Return Information
                        </Typography>

                        <Divider
                            sx={{
                                mb: 3,
                            }}
                        />

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* SALES INVOICE ID */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Sales Invoice ID"
                                    name="SalesInvoiceId"
                                    type="number"
                                    value={
                                        form.SalesInvoiceId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    inputProps={{
                                        min: 1,
                                    }}
                                />

                            </Grid>

                            {/* PRODUCT ID */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Product ID"
                                    name="ProductId"
                                    type="number"
                                    value={
                                        form.ProductId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    inputProps={{
                                        min: 1,
                                    }}
                                />

                            </Grid>

                            {/* RETURN NUMBER */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Return Number"
                                    name="ReturnNumber"
                                    value={
                                        form.ReturnNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    inputProps={{
                                        maxLength: 100,
                                    }}
                                />

                            </Grid>

                            {/* RETURN DATE */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Return Date"
                                    name="ReturnDate"
                                    type="datetime-local"
                                    value={
                                        form.ReturnDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />

                            </Grid>

                            {/* QUANTITY */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="Quantity"
                                    type="number"
                                    value={
                                        form.Quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    inputProps={{
                                        min: 1,
                                        step: 1,
                                    }}
                                />

                            </Grid>

                            {/* RETURN AMOUNT */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Return Amount"
                                    name="ReturnAmount"
                                    type="number"
                                    value={
                                        form.ReturnAmount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    inputProps={{
                                        min: 0,
                                        step: "0.01",
                                    }}
                                />

                            </Grid>

                            {/* STATUS */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    name="Status"
                                    value={
                                        form.Status ||
                                        "Pending"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value="Pending">
                                        Pending
                                    </MenuItem>

                                    <MenuItem value="Approved">
                                        Approved
                                    </MenuItem>

                                    <MenuItem value="Processing">
                                        Processing
                                    </MenuItem>

                                    <MenuItem value="Completed">
                                        Completed
                                    </MenuItem>

                                    <MenuItem value="Rejected">
                                        Rejected
                                    </MenuItem>

                                    <MenuItem value="Cancelled">
                                        Cancelled
                                    </MenuItem>

                                </TextField>

                            </Grid>

                            {/* SELLER ID */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Seller ID"
                                    name="SellerId"
                                    type="number"
                                    value={
                                        form.SellerId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    inputProps={{
                                        min: 1,
                                    }}
                                />

                            </Grid>

                            {/* CUSTOMER ID */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Customer ID"
                                    name="CustomerId"
                                    type="number"
                                    value={
                                        form.CustomerId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    inputProps={{
                                        min: 1,
                                    }}
                                />

                            </Grid>

                            {/* REASON */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Reason"
                                    name="Reason"
                                    value={
                                        form.Reason
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter reason for the customer return"
                                />

                            </Grid>

                        </Grid>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <Stack
                            direction={{
                                xs: "column-reverse",
                                sm: "row",
                            }}
                            justifyContent="flex-end"
                            spacing={2}
                            sx={{
                                mt: 4,
                            }}
                        >

                            <Button
                                variant="outlined"
                                onClick={goToDetails}
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    saving ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"
                                }
                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>

            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={success}
                autoHideDuration={700}
                onClose={() =>
                    setSuccess(false)
                }
                message="Customer return updated successfully"
            />

        </Box>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default CustomerReturnEdit;