import React, {
    useState
} from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Button,
    Stack,
    Alert,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const PURCHASE_ORDER_API =
    `${SERVER_URL}/api/purchase-orders`;


/* =========================================================
   INITIAL FORM STATE
========================================================= */

const initialFormData = {

    SellerId: "",

    SupplierId: "",

    PurchaseOrderNumber: "",

    OrderDate: "",

    ExpectedDeliveryDate: "",

    Status: "Pending",

    TotalAmount: "",

    Remarks: ""

};


/* =========================================================
   PURCHASE ORDER CREATE
========================================================= */

const PurchaseOrderCreate = () => {


    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [
        formData,
        setFormData
    ] = useState(initialFormData);


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        fieldErrors,
        setFieldErrors
    ] = useState({});


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));


        setFieldErrors((previous) => ({

            ...previous,

            [name]: ""

        }));


        setError("");

    };


    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        const errors = {};


        const sellerId =
            Number(formData.SellerId);


        const supplierId =
            Number(formData.SupplierId);


        const totalAmount =
            Number(formData.TotalAmount);


        if (
            !Number.isInteger(sellerId) ||
            sellerId <= 0
        ) {

            errors.SellerId =
                "Valid Seller ID is required.";

        }


        if (
            !Number.isInteger(supplierId) ||
            supplierId <= 0
        ) {

            errors.SupplierId =
                "Valid Supplier ID is required.";

        }


        if (
            !formData.PurchaseOrderNumber.trim()
        ) {

            errors.PurchaseOrderNumber =
                "Purchase Order Number is required.";

        }


        if (!formData.OrderDate) {

            errors.OrderDate =
                "Order Date is required.";

        }


        if (
            !formData.ExpectedDeliveryDate
        ) {

            errors.ExpectedDeliveryDate =
                "Expected Delivery Date is required.";

        }


        if (
            formData.OrderDate &&
            formData.ExpectedDeliveryDate &&
            formData.ExpectedDeliveryDate <
            formData.OrderDate
        ) {

            errors.ExpectedDeliveryDate =
                "Expected Delivery Date cannot be before Order Date.";

        }


        if (
            formData.TotalAmount === "" ||
            !Number.isFinite(totalAmount) ||
            totalAmount < 0
        ) {

            errors.TotalAmount =
                "Valid Total Amount is required.";

        }


        setFieldErrors(errors);

        return Object.keys(errors).length === 0;

    };


    /* =====================================================
       CREATE PURCHASE ORDER
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        setLoading(true);

        setError("");


        try {


            const payload = {

                SellerId:
                    Number(formData.SellerId),

                SupplierId:
                    Number(formData.SupplierId),

                PurchaseOrderNumber:
                    formData.PurchaseOrderNumber.trim(),

                OrderDate:
                    formData.OrderDate,

                ExpectedDeliveryDate:
                    formData.ExpectedDeliveryDate,

                Status:
                    formData.Status,

                TotalAmount:
                    Number(formData.TotalAmount),

                Remarks:
                    formData.Remarks.trim()

            };


            await axios.post(
                PURCHASE_ORDER_API,
                payload
            );


            navigate("/purchase-orders");


        } catch (err) {

            console.error(
                "CREATE PURCHASE ORDER ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.title ||

                "Failed to create Purchase Order."

            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       HANDLE BACK
    ===================================================== */

    const handleBack = () => {

        navigate("/purchase-orders");

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box sx={{ p: 3 }}>


            {/* =================================================
               PAGE HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    sm: "center"
                }}
                sx={{ mb: 3 }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >

                        Create Purchase Order

                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        Create a new Purchase Order

                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
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
                    sx={{ mb: 3 }}
                >

                    {error}

                </Alert>

            )}


            {/* =================================================
               FORM CARD
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >


                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                        >

                            Purchase Order Information

                        </Typography>


                        <Divider
                            sx={{ mb: 3 }}
                        />


                        {/* =====================================
                           BASIC INFORMATION
                        ===================================== */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr"
                                },
                                gap: 2
                            }}
                        >


                            <TextField
                                fullWidth
                                label="Seller ID"
                                name="SellerId"
                                type="number"
                                value={formData.SellerId}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.SellerId
                                )}
                                helperText={
                                    fieldErrors.SellerId
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />


                            <TextField
                                fullWidth
                                label="Supplier ID"
                                name="SupplierId"
                                type="number"
                                value={formData.SupplierId}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.SupplierId
                                )}
                                helperText={
                                    fieldErrors.SupplierId
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />


                            <TextField
                                fullWidth
                                label="Purchase Order Number"
                                name="PurchaseOrderNumber"
                                value={
                                    formData.PurchaseOrderNumber
                                }
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.PurchaseOrderNumber
                                )}
                                helperText={
                                    fieldErrors.PurchaseOrderNumber
                                }
                            />


                            <TextField
                                fullWidth
                                label="Status"
                                name="Status"
                                select
                                value={formData.Status}
                                onChange={handleChange}
                            >

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Processing">
                                    Processing
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>

                            </TextField>


                            <TextField
                                fullWidth
                                label="Order Date"
                                name="OrderDate"
                                type="date"
                                value={formData.OrderDate}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.OrderDate
                                )}
                                helperText={
                                    fieldErrors.OrderDate
                                }
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />


                            <TextField
                                fullWidth
                                label="Expected Delivery Date"
                                name="ExpectedDeliveryDate"
                                type="date"
                                value={
                                    formData.ExpectedDeliveryDate
                                }
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.ExpectedDeliveryDate
                                )}
                                helperText={
                                    fieldErrors.ExpectedDeliveryDate
                                }
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />


                            <TextField
                                fullWidth
                                label="Total Amount"
                                name="TotalAmount"
                                type="number"
                                value={formData.TotalAmount}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.TotalAmount
                                )}
                                helperText={
                                    fieldErrors.TotalAmount
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />


                            <TextField
                                fullWidth
                                label="Remarks"
                                name="Remarks"
                                value={formData.Remarks}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />

                        </Box>


                        {/* =====================================
                           ACTIONS
                        ===================================== */}

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{ mt: 4 }}
                        >

                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={loading}
                            >

                                Cancel

                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading
                                        ? <CircularProgress
                                            size={18}
                                            color="inherit"
                                          />
                                        : <Save />
                                }
                                disabled={loading}
                            >

                                {loading
                                    ? "Creating..."
                                    : "Create Purchase Order"}

                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

};


export default PurchaseOrderCreate;

