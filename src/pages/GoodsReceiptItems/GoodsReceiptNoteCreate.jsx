// ============================================================
// GoodsReceiptNoteCreate.jsx
// ============================================================

import React, {
    useEffect,
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
    Grid,
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

const GoodsReceiptNoteCreate = () => {

    const navigate = useNavigate();

    // ========================================================
    // FORM
    // ========================================================

    const [formData, setFormData] = useState({
        goodsReceiptNoteId: 0,
        grnNumber: "",
        goodsReceiptNumber: "",
        purchaseOrderId: "",
        supplierId: "",
        sellerId: "",
        customerId: "",
        status: "Pending",
        remarks: "",
        totalAmount: 0
    });

    // ========================================================
    // STATE
    // ========================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {

        if (!formData.purchaseOrderId) {
            setError("Purchase Order ID is required.");
            return false;
        }

        if (!formData.supplierId) {
            setError("Supplier ID is required.");
            return false;
        }

        if (!formData.sellerId) {
            setError("Seller ID is required.");
            return false;
        }

        if (!formData.customerId) {
            setError("Customer ID is required.");
            return false;
        }

        return true;
    };

    // ========================================================
    // CREATE
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {

            const payload = {
                goodsReceiptNoteId:
                    Number(formData.goodsReceiptNoteId) || 0,

                grnNumber:
                    formData.grnNumber?.trim() || null,

                goodsReceiptNumber:
                    formData.goodsReceiptNumber?.trim() || null,

                purchaseOrderId:
                    Number(formData.purchaseOrderId),

                supplierId:
                    Number(formData.supplierId),

                sellerId:
                    Number(formData.sellerId),

                customerId:
                    Number(formData.customerId),

                status:
                    formData.status?.trim() || "Pending",

                remarks:
                    formData.remarks?.trim() || null,

                totalAmount:
                    Number(formData.totalAmount) || 0
            };

            console.log(
                "CREATE GOODS RECEIPT NOTE PAYLOAD:",
                payload
            );

            const response = await axios.post(
                GRN_API,
                payload
            );

            console.log(
                "CREATE GOODS RECEIPT NOTE RESPONSE:",
                response.data
            );

            setSuccess(
                "Goods Receipt Note created successfully."
            );

            setTimeout(() => {
                navigate("/goods-receipt-notes");
            }, 800);

        } catch (err) {

            console.error(
                "CREATE GOODS RECEIPT NOTE ERROR:",
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
                    "Failed to create Goods Receipt Note."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        navigate("/goods-receipt-notes");
    };

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
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Create Goods Receipt Note
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Create a new Goods Receipt Note
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Back
                </Button>

            </Stack>


            {/* =================================================
                FORM CARD
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* =================================================
                                GRN NUMBER
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="GRN Number"
                                    name="grnNumber"
                                    value={formData.grnNumber}
                                    onChange={handleChange}
                                    placeholder="GRN-2026-001"
                                />

                            </Grid>


                            {/* =================================================
                                GOODS RECEIPT NUMBER
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Goods Receipt Number"
                                    name="goodsReceiptNumber"
                                    value={
                                        formData.goodsReceiptNumber
                                    }
                                    onChange={handleChange}
                                    placeholder="GRN-001"
                                />

                            </Grid>


                            {/* =================================================
                                PURCHASE ORDER
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Purchase Order ID"
                                    name="purchaseOrderId"
                                    value={
                                        formData.purchaseOrderId
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================================
                                SUPPLIER
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Supplier ID"
                                    name="supplierId"
                                    value={
                                        formData.supplierId
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================================
                                SELLER
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    name="sellerId"
                                    value={
                                        formData.sellerId
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================================
                                CUSTOMER
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Customer ID"
                                    name="customerId"
                                    value={
                                        formData.customerId
                                    }
                                    onChange={handleChange}
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
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Status"
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>


                            {/* =================================================
                                TOTAL AMOUNT
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Amount"
                                    name="totalAmount"
                                    value={
                                        formData.totalAmount
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* =================================================
                                REMARKS
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    label="Remarks"
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>

                        </Grid>


                        <Divider
                            sx={{
                                my: 3
                            }}
                        />


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                        >

                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={
                                    loading
                                        ? (
                                            <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                        )
                                        : null
                                }
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Goods Receipt Note"}
                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>


            {/* =================================================
                ERROR
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


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() => setSuccess("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="success"
                    onClose={() => setSuccess("")}
                    sx={{
                        width: "100%"
                    }}
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default GoodsReceiptNoteCreate;

