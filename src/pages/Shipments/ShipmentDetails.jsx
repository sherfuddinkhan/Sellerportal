// =========================================================
// ShipmentDetails.jsx
// Shipment Details Page
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography,
    Chip
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    LocalShipping
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ShipmentDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // ---------------------------------------------------------
    // STATE
    // ---------------------------------------------------------

    const [shipment, setShipment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ---------------------------------------------------------
    // GET VALUE
    // Supports camelCase + PascalCase
    // ---------------------------------------------------------

    const getValue = (
        camelCase,
        pascalCase
    ) => {

        return (
            shipment?.[camelCase] ??
            shipment?.[pascalCase] ??
            null
        );
    };

    // ---------------------------------------------------------
    // STATUS COLOR
    // ---------------------------------------------------------

    const getStatusColor = (status) => {

        switch (
            String(status || "")
                .toLowerCase()
                .trim()
        ) {

            case "pending":
                return "warning";

            case "processing":
                return "info";

            case "packed":
                return "secondary";

            case "shipped":
                return "primary";

            case "in transit":
                return "info";

            case "out for delivery":
                return "warning";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            case "returned":
                return "error";

            default:
                return "default";
        }
    };

    // ---------------------------------------------------------
    // FORMAT DATE
    // ---------------------------------------------------------

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    // ---------------------------------------------------------
    // LOAD SHIPMENT
    // ---------------------------------------------------------

    useEffect(() => {

        const loadShipment = async () => {

            if (!id) {

                setError(
                    "Shipment ID is missing."
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                setError("");

                const response = await fetch(
                    `${SERVER_URL}/api/Shipment/${id}`
                );

                if (!response.ok) {

                    if (response.status === 404) {

                        throw new Error(
                            "Shipment not found."
                        );
                    }

                    throw new Error(
                        `Failed to load shipment. Status: ${response.status}`
                    );
                }

                const data = await response.json();

                setShipment(data);

            } catch (err) {

                console.error(
                    "Shipment Details Error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load shipment."
                );

            } finally {

                setLoading(false);
            }
        };

        loadShipment();

    }, [id]);

    // ---------------------------------------------------------
    // LOADING
    // ---------------------------------------------------------

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px"
                }}
            >

                <Box
                    sx={{
                        textAlign: "center"
                    }}
                >

                    <CircularProgress />

                    <Typography
                        sx={{
                            mt: 2
                        }}
                        color="text.secondary"
                    >
                        Loading Shipment...
                    </Typography>

                </Box>

            </Box>
        );
    }

    // ---------------------------------------------------------
    // ERROR
    // ---------------------------------------------------------

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
                    onClick={() =>
                        navigate("/shipments")
                    }
                >
                    Back to Shipments
                </Button>

            </Box>
        );
    }

    // ---------------------------------------------------------
    // NO DATA
    // ---------------------------------------------------------

    if (!shipment) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Shipment details are not available.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/shipments")
                    }
                >
                    Back to Shipments
                </Button>

            </Box>
        );
    }

    // ---------------------------------------------------------
    // VALUES
    // ---------------------------------------------------------

    const shipmentId = getValue(
        "shipmentId",
        "ShipmentId"
    );

    const sellerId = getValue(
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        "customerId",
        "CustomerId"
    );

    const orderId = getValue(
        "orderId",
        "OrderId"
    );

    const courierName = getValue(
        "courierName",
        "CourierName"
    );

    const trackingNumber = getValue(
        "trackingNumber",
        "TrackingNumber"
    );

    const shipmentDate = getValue(
        "shipmentDate",
        "ShipmentDate"
    );

    const deliveryDate = getValue(
        "deliveryDate",
        "DeliveryDate"
    );

    const shipmentStatus = getValue(
        "shipmentStatus",
        "ShipmentStatus"
    );

    // ---------------------------------------------------------
    // FIELD COMPONENT
    // ---------------------------------------------------------

    const Field = ({
        label,
        value
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? value
                        : "-"
                }
            </Typography>

        </Grid>
    );

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

    return (

        <Box sx={{ p: 3 }}>

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
                    flexDirection: {
                        xs: "column",
                        md: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
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
                    >
                        View complete shipment information
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/shipments")
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/shipments/edit/${shipmentId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </Box>

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 3
                    }
                }}
            >

                {/* =================================================
                    TITLE
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3
                    }}
                >

                    <LocalShipping
                        color="primary"
                        fontSize="large"
                    />

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Shipment #{shipmentId}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Tracking:
                            {" "}
                            {trackingNumber || "-"}
                        </Typography>

                    </Box>

                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* =================================================
                    SHIPMENT INFORMATION
                ================================================= */}

                <Grid
                    container
                    spacing={3}
                >

                    <Field
                        label="Shipment ID"
                        value={shipmentId}
                    />

                    <Field
                        label="Seller ID"
                        value={sellerId}
                    />

                    <Field
                        label="Customer ID"
                        value={customerId}
                    />

                    <Field
                        label="Order ID"
                        value={orderId}
                    />

                    <Field
                        label="Courier Name"
                        value={courierName}
                    />

                    <Field
                        label="Tracking Number"
                        value={trackingNumber}
                    />

                    <Field
                        label="Shipment Date"
                        value={formatDate(shipmentDate)}
                    />

                    <Field
                        label="Delivery Date"
                        value={formatDate(deliveryDate)}
                    />

                    {/* STATUS */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{
                                mb: 0.8
                            }}
                        >
                            Shipment Status
                        </Typography>

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
                            size="small"
                        />

                    </Grid>

                </Grid>

            </Paper>

        </Box>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ShipmentDetails;

