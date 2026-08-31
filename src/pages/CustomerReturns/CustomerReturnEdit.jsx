// =========================================================
// CustomerReturnEdit.jsx
// Customer Return Edit Page
// React -> server.js -> ASP.NET Core
// =========================================================

import React, {
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

// React -> Node server.js
const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnEdit = () => {

    const navigate = useNavigate();

    // =====================================================
    // URL
    //
    // /customer-returns/:id/edit
    //
    // Example:
    // /customer-returns/2/edit
    // =====================================================

    const { id } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

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
    // LOAD CUSTOMER RETURN
    // =====================================================

    const loadReturn = async () => {

        // -------------------------------------------------
        // Validate ID
        // -------------------------------------------------

        if (!id) {

            setError(
                "Customer Return ID is missing from URL."
            );

            setLoading(false);

            return;
        }

        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading Customer Return:",
                id
            );

            // =================================================
            // React
            //    ↓
            // server.js
            //    ↓
            // ASP.NET Core
            //
            // GET:
            // /api/customer-returns/2
            // =================================================

            const response = await axios.get(

                `${SERVER_URL}/api/customer-returns/${id}`

            );

            const data = response.data;

            console.log(
                "Customer Return Response:",
                data
            );

            // =================================================
            // SUPPORT BOTH
            //
            // PascalCase
            // camelCase
            // =================================================

            const salesInvoiceId =
                data.SalesInvoiceId ??
                data.salesInvoiceId ??
                "";

            const productId =
                data.ProductId ??
                data.productId ??
                "";

            const returnNumber =
                data.ReturnNumber ??
                data.returnNumber ??
                "";

            const returnDate =
                data.ReturnDate ??
                data.returnDate ??
                "";

            const quantity =
                data.Quantity ??
                data.quantity ??
                "";

            const returnAmount =
                data.ReturnAmount ??
                data.returnAmount ??
                "";

            const reason =
                data.Reason ??
                data.reason ??
                "";

            const status =
                data.Status ??
                data.status ??
                "Pending";

            const sellerId =
                data.SellerId ??
                data.sellerId ??
                "";

            const customerId =
                data.CustomerId ??
                data.customerId ??
                "";

            // =================================================
            // FORMAT DATE FOR DATETIME-LOCAL
            // =================================================

            let formattedDate = "";

            if (returnDate) {

                const date = new Date(
                    returnDate
                );

                if (!Number.isNaN(
                    date.getTime()
                )) {

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

                    formattedDate =
                        `${year}-${month}-${day}T${hours}:${minutes}`;

                }

            }

            // =================================================
            // SET FORM
            // =================================================

            setForm({

                SalesInvoiceId:
                    salesInvoiceId,

                ProductId:
                    productId,

                ReturnNumber:
                    returnNumber,

                ReturnDate:
                    formattedDate,

                Quantity:
                    quantity,

                ReturnAmount:
                    returnAmount,

                Reason:
                    reason,

                Status:
                    status,

                SellerId:
                    sellerId,

                CustomerId:
                    customerId,

            });

        }
        catch (err) {

            console.error(
                "Load Customer Return Error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );

            setError(

                err.response?.data?.message ||

                `Unable to load customer return. HTTP ${
                    err.response?.status || ""
                }`

            );

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // EFFECT
    // =====================================================

    useEffect(() => {

        loadReturn();

    }, [id]);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

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
    // SAVE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        // -------------------------------------------------
        // Validate ID
        // -------------------------------------------------

        if (!id) {

            setError(
                "Customer Return ID is missing."
            );

            return;
        }

        try {

            setSaving(true);

            setError("");

            // =================================================
            // PAYLOAD
            // =================================================

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
                    form.ReturnNumber,

                ReturnDate:
                    form.ReturnDate,

                Quantity:
                    Number(
                        form.Quantity || 0
                    ),

                ReturnAmount:
                    Number(
                        form.ReturnAmount || 0
                    ),

                Reason:
                    form.Reason,

                Status:
                    form.Status,

                SellerId:
                    Number(
                        form.SellerId || 0
                    ),

                CustomerId:
                    Number(
                        form.CustomerId || 0
                    ),

            };

            console.log(
                "Updating Customer Return:",
                {
                    id,
                    payload,
                }
            );

            // =================================================
            // PUT
            //
            // React
            //    ↓
            // server.js
            //    ↓
            // ASP.NET Core
            //
            // PUT:
            // /api/customer-returns/2
            // =================================================

            await axios.put(

                `${SERVER_URL}/api/customer-returns/${id}`,

                payload,

                {
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }

            );

            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(true);

            // -------------------------------------------------
            // Redirect to details
            // -------------------------------------------------

            setTimeout(() => {

                navigate(
                    `/customer-returns/${id}`
                );

            }, 700);

        }
        catch (err) {

            console.error(
                "Update Customer Return Error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );

            setError(

                err.response?.data?.message ||

                `Unable to update customer return. HTTP ${
                    err.response?.status || ""
                }`

            );

        }
        finally {

            setSaving(false);

        }

    };

    // =====================================================
    // GO TO DETAILS
    // =====================================================

    const goToDetails = () => {

        if (!id) {

            navigate(
                "/customer-returns"
            );

            return;
        }

        navigate(
            `/customer-returns/${id}`
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
                direction="row"
                justifyContent="space-between"
                alignItems="center"
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
                        Return ID: {id}
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

                            {/* =====================================
                                SALES INVOICE ID
                            ===================================== */}

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


                            {/* =====================================
                                PRODUCT ID
                            ===================================== */}

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


                            {/* =====================================
                                RETURN NUMBER
                            ===================================== */}

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
                                />

                            </Grid>


                            {/* =====================================
                                RETURN DATE
                            ===================================== */}

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


                            {/* =====================================
                                QUANTITY
                            ===================================== */}

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
                                    }}
                                />

                            </Grid>


                            {/* =====================================
                                RETURN AMOUNT
                            ===================================== */}

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


                            {/* =====================================
                                REASON
                            ===================================== */}

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
                                />

                            </Grid>


                            {/* =====================================
                                STATUS
                            ===================================== */}

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
                                        form.Status
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


                            {/* =====================================
                                SELLER ID
                            ===================================== */}

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


                            {/* =====================================
                                CUSTOMER ID
                            ===================================== */}

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

                        </Grid>


                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <Stack
                            direction="row"
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
                                    saving

                                        ?

                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />

                                        :

                                        <Save />
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
                SUCCESS MESSAGE
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

