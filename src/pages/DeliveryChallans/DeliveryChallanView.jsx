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
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

const SERVER_URL = "http://localhost:5000";

// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanView = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();

    const [deliveryChallan, setDeliveryChallan] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info"
    });

    // ========================================================
    // GET ID
    // ========================================================

    const challanId = id;

    // ========================================================
    // SHOW MESSAGE
    // ========================================================

    const showMessage = useCallback(
        (message, severity = "info") => {

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

    const getErrorMessage = (err) => {

        return (
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.title ||
            err?.message ||
            "Failed to load delivery challan."
        );

    };

    // ========================================================
    // GET DELIVERY CHALLAN
    // ========================================================

    const loadDeliveryChallan = useCallback(
        async () => {

            if (
                !challanId ||
                String(challanId) === ":id" ||
                isNaN(Number(challanId))
            ) {

                setError("Invalid Delivery Challan ID.");
                setLoading(false);

                return;
            }

            try {

                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${SERVER_URL}/api/delivery-challans/${challanId}`
                );

                const data = response.data;

                // Handle possible API response wrappers
                const challan =
                    data?.data ||
                    data?.item ||
                    data;

                setDeliveryChallan(challan);

            } catch (err) {

                console.error(
                    "GET delivery challan error:",
                    err?.response?.data || err
                );

                const message = getErrorMessage(err);

                setError(message);

                showMessage(
                    message,
                    "error"
                );

            } finally {

                setLoading(false);

            }

        },
        [
            challanId,
            showMessage
        ]
    );

    // ========================================================
    // LOAD ON PAGE OPEN
    // ========================================================

    useEffect(() => {

        loadDeliveryChallan();

    }, [
        loadDeliveryChallan
    ]);

    // ========================================================
    // HELPERS
    // ========================================================

    const getValue = (
        upper,
        lower,
        fallback = "-"
    ) => {

        const value =
            deliveryChallan?.[upper] ??
            deliveryChallan?.[lower];

        return (
            value !== null &&
            value !== undefined &&
            value !== ""
        )
            ? value
            : fallback;

    };

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
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

    const getStatus = () => {

        return (
            deliveryChallan?.CurrentStatus ??
            deliveryChallan?.currentStatus ??
            deliveryChallan?.Status ??
            deliveryChallan?.status ??
            "N/A"
        );

    };

    const getStatusColor = (status) => {

        switch (status?.toLowerCase()) {

            case "delivered":
                return "success";

            case "dispatched":
                return "info";

            case "in transit":
            case "in-transit":
                return "warning";

            case "cancelled":
            case "canceled":
                return "error";

            case "pending":
            default:
                return "default";

        }

    };

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

    if (error || !deliveryChallan) {

        return (

            <Box sx={{ p: 3 }}>

                <Card>

                    <CardContent>

                        <Alert severity="error">
                            {error || "Delivery Challan not found."}
                        </Alert>

                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mt: 3 }}
                        >

                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() =>
                                    navigate("/delivery-challans")
                                }
                            >
                                Back to Delivery Challans
                            </Button>

                            <Button
                                variant="contained"
                                onClick={loadDeliveryChallan}
                            >
                                Retry
                            </Button>

                        </Stack>

                    </CardContent>

                </Card>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                >

                    <Alert
                        severity={snackbar.severity}
                        onClose={() =>
                            setSnackbar({
                                ...snackbar,
                                open: false
                            })
                        }
                    >
                        {snackbar.message}
                    </Alert>

                </Snackbar>

            </Box>

        );

    }

    // ========================================================
    // VALUES
    // ========================================================

    const deliveryChallanId =
        getValue(
            "DeliveryChallanId",
            "deliveryChallanId"
        );

    const salesOrderId =
        getValue(
            "SalesOrderId",
            "salesOrderId"
        );

    const challanNumber =
        getValue(
            "ChallanNumber",
            "challanNumber"
        );

    const challanDate =
        deliveryChallan?.ChallanDate ??
        deliveryChallan?.challanDate;

    const vehicleNumber =
        getValue(
            "VehicleNumber",
            "vehicleNumber"
        );

    const driverName =
        getValue(
            "DriverName",
            "driverName"
        );

    const driverMobile =
        getValue(
            "DriverMobile",
            "driverMobile"
        );

    const transporterName =
        getValue(
            "TransporterName",
            "transporterName"
        );

    const currentStatus =
        getStatus();

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
                        Delivery Challan Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View complete delivery challan information
                    </Typography>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() =>
                            navigate("/delivery-challans")
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() =>
                            navigate(
                                `/delivery-challans/edit/${deliveryChallanId}`
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

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Delivery Challan ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {deliveryChallanId}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Sales Order ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {salesOrderId}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Challan Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {challanNumber}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Challan Date
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {formatDate(challanDate)}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/* =================================================
                TRANSPORT DETAILS
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Transport Details
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Vehicle Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {vehicleNumber}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Driver Name
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {driverName}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Driver Mobile
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {driverMobile}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Transporter Name
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {transporterName}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/* =================================================
                STATUS
            ================================================= */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Status
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        Current Status
                    </Typography>

                    <Box>

                        <Typography
                            component="span"
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 1,
                                bgcolor:
                                    getStatusColor(currentStatus) ===
                                    "success"
                                        ? "success.light"
                                        : getStatusColor(currentStatus) ===
                                          "error"
                                        ? "error.light"
                                        : getStatusColor(currentStatus) ===
                                          "warning"
                                        ? "warning.light"
                                        : getStatusColor(currentStatus) ===
                                          "info"
                                        ? "info.light"
                                        : "grey.200",
                                color:
                                    getStatusColor(currentStatus) ===
                                    "success"
                                        ? "success.dark"
                                        : getStatusColor(currentStatus) ===
                                          "error"
                                        ? "error.dark"
                                        : getStatusColor(currentStatus) ===
                                          "warning"
                                        ? "warning.dark"
                                        : getStatusColor(currentStatus) ===
                                          "info"
                                        ? "info.dark"
                                        : "text.primary",
                                fontWeight: 600
                            }}
                        >
                            {currentStatus}
                        </Typography>

                    </Box>

                </CardContent>

            </Card>

            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
            >

                <Alert
                    severity={snackbar.severity}
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default DeliveryChallanView;
