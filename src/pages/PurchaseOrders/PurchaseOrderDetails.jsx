import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    Button,
    Chip,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ArrowBack,
    Edit
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
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {

        return "₹ 0.00";

    }

    return `₹ ${amount.toLocaleString("en-IN", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    })}`;

};


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {

        return "-";

    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {

        return "-";

    }

    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "2-digit",

        year: "numeric"

    });

};


/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    switch (
        String(status || "").toLowerCase()
    ) {

        case "completed":
            return "success";

        case "processing":
            return "info";

        case "pending":
            return "warning";

        case "cancelled":
            return "error";

        default:
            return "default";

    }

};


/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value
}) => {

    return (

        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
            >

                {label}

            </Typography>


            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    wordBreak: "break-word"
                }}
            >

                {value ?? "-"}

            </Typography>

        </Box>

    );

};


/* =========================================================
   PURCHASE ORDER DETAILS
========================================================= */

const PurchaseOrderDetails = () => {


    const navigate = useNavigate();


    const {
        id
    } = useParams();


    /* =====================================================
       STATE
    ===================================================== */

    const [
        item,
        setItem
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    /* =====================================================
       LOAD PURCHASE ORDER
    ===================================================== */

    const loadPurchaseOrder = async () => {

        if (!id) {

            setError(
                "Purchase Order ID is missing."
            );

            setLoading(false);

            return;

        }


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


            const purchaseOrder =
                data?.data ??
                data?.purchaseOrder ??
                data;


            if (!purchaseOrder) {

                throw new Error(
                    "Purchase Order not found."
                );

            }


            setItem(purchaseOrder);


        } catch (err) {

            console.error(
                "LOAD PURCHASE ORDER ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.title ||

                err?.message ||

                "Failed to load Purchase Order."

            );


            setItem(null);

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
       BACK
    ===================================================== */

    const handleBack = () => {

        navigate("/purchase-orders");

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = () => {

        if (!item) {

            return;

        }


        const purchaseOrderId =

            item.PurchaseOrderId ??
            item.purchaseOrderId;


        navigate(
            `/purchase-orders/edit/${purchaseOrderId}`
        );

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
       ERROR
    ===================================================== */

    if (error) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >

                    {error}

                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >

                    Back to Purchase Orders

                </Button>

            </Box>

        );

    }


    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const purchaseOrderId =

        item?.PurchaseOrderId ??
        item?.purchaseOrderId ??
        "-";


    const purchaseOrderNumber =

        item?.PurchaseOrderNumber ??
        item?.purchaseOrderNumber ??
        "-";


    const sellerId =

        item?.SellerId ??
        item?.sellerId ??
        "-";


    const supplierId =

        item?.SupplierId ??
        item?.supplierId ??
        "-";


    const orderDate =

        item?.OrderDate ??
        item?.orderDate;


    const expectedDeliveryDate =

        item?.ExpectedDeliveryDate ??
        item?.expectedDeliveryDate;


    const status =

        item?.Status ??
        item?.status ??
        "";


    const totalAmount =

        item?.TotalAmount ??
        item?.totalAmount ??
        0;


    const remarks =

        item?.Remarks ??
        item?.remarks ??
        "";


    const createdDate =

        item?.CreatedDate ??
        item?.createdDate;


    const updatedDate =

        item?.UpdatedDate ??
        item?.updatedDate;


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

                        Purchase Order Details

                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        {purchaseOrderNumber}

                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >

                        Back

                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >

                        Edit

                    </Button>

                </Stack>

            </Stack>


            {/* =================================================
               DETAILS CARD
            ================================================= */}

            <Card>

                <CardContent>


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
                                sm: "1fr 1fr",
                                md: "1fr 1fr 1fr"
                            },
                            gap: 3
                        }}
                    >

                        <DetailItem
                            label="Purchase Order ID"
                            value={purchaseOrderId}
                        />


                        <DetailItem
                            label="Purchase Order Number"
                            value={purchaseOrderNumber}
                        />


                        <DetailItem
                            label="Seller ID"
                            value={sellerId}
                        />


                        <DetailItem
                            label="Supplier ID"
                            value={supplierId}
                        />


                        <DetailItem
                            label="Order Date"
                            value={formatDate(orderDate)}
                        />


                        <DetailItem
                            label="Expected Delivery Date"
                            value={formatDate(
                                expectedDeliveryDate
                            )}
                        />


                        <Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 0.5 }}
                            >

                                Status

                            </Typography>


                            <Chip
                                label={
                                    status || "Unknown"
                                }
                                color={
                                    getStatusColor(status)
                                }
                                size="small"
                            />

                        </Box>


                        <DetailItem
                            label="Total Amount"
                            value={formatCurrency(
                                totalAmount
                            )}
                        />


                        <DetailItem
                            label="Created Date"
                            value={formatDate(
                                createdDate
                            )}
                        />


                        <DetailItem
                            label="Updated Date"
                            value={formatDate(
                                updatedDate
                            )}
                        />

                    </Box>


                    <Divider
                        sx={{ my: 3 }}
                    />


                    {/* =========================================
                       REMARKS
                    ========================================= */}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.5 }}
                    >

                        Remarks

                    </Typography>


                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word"
                        }}
                    >

                        {remarks || "-"}

                    </Typography>


                </CardContent>

            </Card>

        </Box>

    );

};


export default PurchaseOrderDetails;

