import React, {
    useEffect,
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
    useNavigate,
    useParams
} from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const PURCHASE_ORDER_API =
    `${SERVER_URL}/api/purchase-orders`;


/* =========================================================
   EMPTY FORM
========================================================= */

const initialFormData = {

    PurchaseOrderId: 0,

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
   FORMAT DATE FOR INPUT
========================================================= */

const formatDateForInput = (value) => {

    if (!value) {

        return "";

    }


    const date = new Date(value);


    if (Number.isNaN(date.getTime())) {

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


    return `${year}-${month}-${day}`;

};


/* =========================================================
   PURCHASE ORDER EDIT
========================================================= */

const PurchaseOrderEdit = () => {


    const navigate = useNavigate();


    const {
        id
    } = useParams();


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
    ] = useState(true);


    const [
        saving,
        setSaving
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
       LOAD PURCHASE ORDER
    ===================================================== */

    const loadPurchaseOrder = async () => {

        const purchaseOrderId =
            Number(id);


        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {

            setError(
                "Invalid Purchase Order ID."
            );

            setLoading(false);

            return;

        }


        setLoading(true);

        setError("");


        try {

            const response = await axios.get(

                `${PURCHASE_ORDER_API}/${purchaseOrderId}`

            );


            const data = response.data;


            const item =
                data?.data ??
                data?.purchaseOrder ??
                data;


            if (!item) {

                throw new Error(
                    "Purchase Order not found."
                );

            }


            setFormData({

                PurchaseOrderId:
                    item.PurchaseOrderId ??
                    item.purchaseOrderId ??
                    purchaseOrderId,

                SellerId:
                    item.SellerId ??
                    item.sellerId ??
                    "",

                SupplierId:
                    item.SupplierId ??
                    item.supplierId ??
                    "",

                PurchaseOrderNumber:
                    item.PurchaseOrderNumber ??
                    item.purchaseOrderNumber ??
                    "",

                OrderDate:
                    formatDateForInput(
                        item.OrderDate ??
                        item.orderDate
                    ),

                ExpectedDeliveryDate:
                    formatDateForInput(
                        item.ExpectedDeliveryDate ??
                        item.expectedDeliveryDate
                    ),

                Status:
                    item.Status ??
                    item.status ??
                    "Pending",

                TotalAmount:
                    item.TotalAmount ??
                    item.totalAmount ??
                    "",

                Remarks:
                    item.Remarks ??
                    item.remarks ??
                    ""

            });


        } catch (err) {

            console.error(
                "LOAD PURCHASE ORDER FOR EDIT ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.title ||

                err?.message ||

                "Failed to load Purchase Order."

            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD ON MOUNT
    ===================================================== */

    useEffect(() => {

        loadPurchaseOrder();

    }, [id]);


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
       UPDATE PURCHASE ORDER
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        const purchaseOrderId =
            Number(formData.PurchaseOrderId);


        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {

            setError(
                "Invalid Purchase Order ID."
            );

            return;

        }


        setSaving(true);

        setError("");


        try {


            const payload = {

                PurchaseOrderId:
                    purchaseOrderId,

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


            await axios.put(

                `${PURCHASE_ORDER_API}/${purchaseOrderId}`,

                payload

            );


            navigate(
                `/purchase-orders/details/${purchaseOrderId}`
            );


        } catch (err) {

            console.error(
                "UPDATE PURCHASE ORDER ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.title ||

                "Failed to update Purchase Order."

            );

        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        navigate("/purchase-orders");

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,
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

                        Loading Purchase Order...

                    </Typography>

                </Stack>

            </Box>

        );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box sx={{ p: 3 }}>


            {/* =================================================
               HEADER
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

                        Edit Purchase Order

                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        Update Purchase Order information

                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
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


                            {/* =================================
                               PURCHASE ORDER ID
                            ================================= */}

                            <TextField
                                fullWidth
                                label="Purchase Order ID"
                                value={
                                    formData.PurchaseOrderId
                                }
                                disabled
                            />


                            {/* =================================
                               SELLER ID
                            ================================= */}

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


                            {/* =================================
                               SUPPLIER ID
                            ================================= */}

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


                            {/* =================================
                               ORDER NUMBER
                            ================================= */}

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


                            {/* =================================
                               ORDER DATE
                            ================================= */}

                            <TextField
                                fullWidth
                                label="Order Date"
                                name="OrderDate"
                                type="date"
                                value={
                                    formData.OrderDate
                                }
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


                            {/* =================================
                               EXPECTED DELIVERY
                            ================================= */}

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


                            {/* =================================
                               STATUS
                            ================================= */}

                            <TextField
                                fullWidth
                                label="Status"
                                name="Status"
                                select
                                value={
                                    formData.Status
                                }
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


                            {/* =================================
                               TOTAL AMOUNT
                            ================================= */}

                            <TextField
                                fullWidth
                                label="Total Amount"
                                name="TotalAmount"
                                type="number"
                                value={
                                    formData.TotalAmount
                                }
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


                            {/* =================================
                               REMARKS
                            ================================= */}

                            <TextField
                                fullWidth
                                label="Remarks"
                                name="Remarks"
                                value={
                                    formData.Remarks
                                }
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />

                        </Box>


                        {/* =================================================
                           ACTIONS
                        ================================================= */}

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{ mt: 4 }}
                        >

                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={saving}
                            >

                                Cancel

                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    saving
                                        ? <CircularProgress
                                            size={18}
                                            color="inherit"
                                          />
                                        : <Save />
                                }
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

};


export default PurchaseOrderEdit;

