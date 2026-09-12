// ============================================================
// ShipmentView.jsx
// Shipment Details Page
//
// React -> Node server.js -> ASP.NET Core API
// ============================================================

import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
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
    Chip,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";


// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const ShipmentView = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [shipment, setShipment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "info"
        });


    // ========================================================
    // MESSAGE
    // ========================================================

    const showMessage = useCallback(
        (
            message,
            severity = "info"
        ) => {

            setSnackbar({
                open: true,
                message,
                severity
            });

        },
        []
    );


    // ========================================================
    // ERROR MESSAGE
    // ========================================================

    const getErrorMessage = (
        err
    ) => {

        const data =
            err?.response?.data;


        if (
            typeof data === "string"
        ) {
            return data;
        }


        if (
            data?.message
        ) {
            return data.message;
        }


        if (
            data?.title
        ) {
            return data.title;
        }


        return (
            err?.message ||
            "Failed to load shipment."
        );

    };


    // ========================================================
    // GET VALUE
    // ========================================================

    const getValue = (
        data,
        camelCase,
        pascalCase
    ) => {

        return (
            data?.[camelCase] ??
            data?.[pascalCase] ??
            null
        );

    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

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
            return "-";
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


    // ========================================================
    // STATUS COLOR
    // ========================================================

    const getStatusColor = (
        status
    ) => {

        switch (
            String(
                status || ""
            )
                .toLowerCase()
                .trim()
        ) {

            case "pending":
                return "warning";

            case "dispatched":
                return "info";

            case "in transit":
                return "info";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            default:
                return "default";
        }

    };


    // ========================================================
    // LOAD SHIPMENT
    // ========================================================

    const loadShipment = useCallback(
        async () => {

            if (
                !id ||
                String(id) === ":id" ||
                isNaN(Number(id))
            ) {

                setError(
                    "Invalid Shipment ID."
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                console.log(
                    "Loading Shipment:",
                    `${SERVER_URL}/api/shipments/${id}`
                );


                const response =
                    await axios.get(
                        `${SERVER_URL}/api/shipments/${id}`
                    );


                console.log(
                    "Shipment API Response:",
                    response.data
                );


                const data =
                    response.data;


                // ------------------------------------------------
                // Support direct object or wrapped response
                // ------------------------------------------------

                const shipmentData =
                    data?.data ||
                    data?.item ||
                    data;


                if (
                    !shipmentData ||
                    typeof shipmentData !== "object"
                ) {

                    throw new Error(
                        "Shipment not found."
                    );

                }


                setShipment(
                    shipmentData
                );


            } catch (err) {

                console.error(
                    "GET shipment error:",
                    err?.response?.data ||
                    err
                );


                const message =
                    getErrorMessage(err);


                setError(
                    message
                );


                showMessage(
                    message,
                    "error"
                );


            } finally {

                setLoading(false);

            }

        },
        [
            id,
            showMessage
        ]
    );


    // ========================================================
    // LOAD ON PAGE OPEN
    // ========================================================

    useEffect(
        () => {

            loadShipment();

        },
        [
            loadShipment
        ]
    );


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <Box sx={{ p: 3 }}>

                <Card>

                    <CardContent>

                        <Alert severity="error">

                            {error}

                        </Alert>


                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mt: 3 }}
                        >

                            <Button
                                variant="outlined"
                                startIcon={
                                    <ArrowBackIcon />
                                }
                                onClick={() =>
                                    navigate(
                                        "/shipments"
                                    )
                                }
                            >

                                Back to Shipments

                            </Button>


                            <Button
                                variant="contained"
                                onClick={
                                    loadShipment
                                }
                            >

                                Retry

                            </Button>

                        </Stack>

                    </CardContent>

                </Card>

            </Box>

        );

    }


    // ========================================================
    // NO DATA
    // ========================================================

    if (!shipment) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="warning">

                    Shipment not found.

                </Alert>

            </Box>

        );

    }


    // ========================================================
    // EXTRACT VALUES
    // ========================================================

    const shipmentId =
        getValue(
            shipment,
            "shipmentId",
            "ShipmentId"
        );

    const sellerId =
        getValue(
            shipment,
            "sellerId",
            "SellerId"
        );

    const customerId =
        getValue(
            shipment,
            "customerId",
            "CustomerId"
        );

    const orderId =
        getValue(
            shipment,
            "orderId",
            "OrderId"
        );

    const courierName =
        getValue(
            shipment,
            "courierName",
            "CourierName"
        );

    const trackingNumber =
        getValue(
            shipment,
            "trackingNumber",
            "TrackingNumber"
        );

    const shipmentDate =
        getValue(
            shipment,
            "shipmentDate",
            "ShipmentDate"
        );

    const deliveryDate =
        getValue(
            shipment,
            "deliveryDate",
            "DeliveryDate"
        );

    const shipmentStatus =
        getValue(
            shipment,
            "shipmentStatus",
            "ShipmentStatus"
        );


    // ========================================================
    // RENDER
    // ========================================================

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
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    sm: "center"
                }}
                spacing={2}
                sx={{ mb: 3 }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >

                        Shipment Details

                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >

                        View shipment information

                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate(
                                "/shipments"
                            )
                        }
                    >

                        Back

                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={() =>
                            navigate(
                                `/shipments/edit/${shipmentId}`
                            )
                        }
                    >

                        Edit

                    </Button>

                </Stack>

            </Stack>


            {/* =================================================
                GENERAL INFORMATION
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >

                        General Information

                    </Typography>


                    <Divider
                        sx={{ mb: 3 }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* Shipment ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Shipment ID

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {shipmentId ?? "-"}

                            </Typography>

                        </Grid>


                        {/* Seller ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Seller ID

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {sellerId ?? "-"}

                            </Typography>

                        </Grid>


                        {/* Customer ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Customer ID

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {customerId ?? "-"}

                            </Typography>

                        </Grid>


                        {/* Order ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Order ID

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {orderId ?? "-"}

                            </Typography>

                        </Grid>


                        {/* Courier */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Courier Name

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {courierName || "-"}

                            </Typography>

                        </Grid>


                        {/* Tracking Number */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Tracking Number

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {trackingNumber || "-"}

                            </Typography>

                        </Grid>


                        {/* Status */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Shipment Status

                            </Typography>


                            <Box sx={{ mt: 0.5 }}>

                                <Chip
                                    label={
                                        shipmentStatus ||
                                        "N/A"
                                    }
                                    color={
                                        getStatusColor(
                                            shipmentStatus
                                        )
                                    }
                                />

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                SHIPMENT DATES
            ================================================= */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >

                        Shipment Dates

                    </Typography>


                    <Divider
                        sx={{ mb: 3 }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* Shipment Date */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Shipment Date

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {formatDate(
                                    shipmentDate
                                )}

                            </Typography>

                        </Grid>


                        {/* Delivery Date */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Delivery Date

                            </Typography>


                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >

                                {formatDate(
                                    deliveryDate
                                )}

                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar(
                        previous => ({
                            ...previous,
                            open: false
                        })
                    )
                }
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    onClose={() =>
                        setSnackbar(
                            previous => ({
                                ...previous,
                                open: false
                            })
                        )
                    }
                >

                    {
                        snackbar.message
                    }

                </Alert>

            </Snackbar>

        </Box>

    );

};


// ============================================================
// EXPORT
// ============================================================

export default ShipmentView;