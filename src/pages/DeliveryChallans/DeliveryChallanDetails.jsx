import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    LocalShipping,
    Person,
    ReceiptLong
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const SERVER_URL = "http://localhost:5000";


const DeliveryChallanDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        deliveryChallan,
        setDeliveryChallan
    ] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "error"
        });


    // ==========================================================
    // MESSAGE
    // ==========================================================

    const showMessage = (
        message,
        severity = "error"
    ) => {

        setSnackbar({
            open: true,
            message,
            severity
        });
    };


    const closeSnackbar = () => {

        setSnackbar(
            previous => ({
                ...previous,
                open: false
            })
        );
    };


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    const formatDate = (
        value,
        includeTime = false
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

        if (includeTime) {

            return date.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
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


    // ==========================================================
    // STATUS COLOR
    // ==========================================================

    const getStatusColor = (
        status
    ) => {

        switch (
            String(status || "")
                .toLowerCase()
        ) {

            case "delivered":
                return "success";

            case "pending":
                return "warning";

            case "in transit":
                return "info";

            case "dispatched":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };


    // ==========================================================
    // GET DELIVERY CHALLAN
    //
    // React:
    // GET /api/delivery-challans/:id
    //
    // Node:
    // GET /api/delivery-challans/:id
    //
    // ASP.NET:
    // GET /api/DeliveryChallan/:id
    // ==========================================================

    const loadDeliveryChallan =
        async () => {

            try {

                setLoading(true);


                console.log(
                    "================================================"
                );

                console.log(
                    `GET /api/delivery-challans/${id}`
                );

                console.log(
                    "================================================"
                );


                const numericId =
                    Number(id);


                if (
                    !Number.isInteger(
                        numericId
                    ) ||
                    numericId <= 0
                ) {

                    throw new Error(
                        "Invalid Delivery Challan ID."
                    );
                }


                const response =
                    await fetch(
                        `${SERVER_URL}/api/delivery-challans/${numericId}`,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => null
                        );


                console.log(
                    "DELIVERY CHALLAN DETAILS RESPONSE:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        data?.error ||
                        "Failed to load delivery challan."
                    );
                }


                setDeliveryChallan(
                    data
                );

            }
            catch (error) {

                console.error(
                    "DELIVERY CHALLAN DETAILS ERROR:",
                    error
                );

                setDeliveryChallan(
                    null
                );

                showMessage(
                    error.message ||
                    "Failed to load delivery challan."
                );

            }
            finally {

                setLoading(false);
            }
        };


    // ==========================================================
    // LOAD
    // ==========================================================

    useEffect(() => {

        loadDeliveryChallan();

    }, [id]);


    // ==========================================================
    // LOADING
    // ==========================================================

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

                <CircularProgress />

            </Box>
        );
    }


    // ==========================================================
    // NOT FOUND
    // ==========================================================

    if (!deliveryChallan) {

        return (

            <Box sx={{ p: 3 }}>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/delivery-challans"
                        )
                    }
                >
                    Back to Delivery Challans
                </Button>


                <Alert
                    severity="error"
                    sx={{ mt: 3 }}
                >
                    Delivery Challan not found.
                </Alert>


                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={closeSnackbar}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                >

                    <Alert
                        severity={
                            snackbar.severity
                        }
                        variant="filled"
                        onClose={closeSnackbar}
                    >
                        {snackbar.message}
                    </Alert>

                </Snackbar>

            </Box>
        );
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

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

                    <Button
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/delivery-challans"
                            )
                        }
                        sx={{
                            mb: 1
                        }}
                    >
                        Back to Delivery Challans
                    </Button>


                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Delivery Challan Details
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {
                            deliveryChallan.challanNumber ||
                            "-"
                        }
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    color="warning"
                    startIcon={
                        <Edit />
                    }
                    onClick={() =>
                        navigate(
                            `/delivery-challans/edit/${deliveryChallan.deliveryChallanId}`
                        )
                    }
                >
                    Edit
                </Button>

            </Stack>


            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <Card
                elevation={3}
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mb: 2
                        }}
                    >

                        <ReceiptLong />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Challan Information
                        </Typography>

                    </Stack>


                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Delivery Challan ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.deliveryChallanId
                                }
                            </Typography>

                        </Grid>


                        {/* SALES ORDER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Sales Order ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.salesOrderId
                                }
                            </Typography>

                        </Grid>


                        {/* SELLER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.sellerId
                                }
                            </Typography>

                        </Grid>


                        {/* CUSTOMER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Customer ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.customerId ??
                                    "-"
                                }
                            </Typography>

                        </Grid>


                        {/* CHALLAN NUMBER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Challan Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={700}
                            >
                                {
                                    deliveryChallan.challanNumber ||
                                    "-"
                                }
                            </Typography>

                        </Grid>


                        {/* CHALLAN DATE */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Challan Date
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    formatDate(
                                        deliveryChallan.challanDate
                                    )
                                }
                            </Typography>

                        </Grid>


                        {/* STATUS */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{
                                    mb: 0.5
                                }}
                            >
                                Status
                            </Typography>

                            <Chip
                                label={
                                    deliveryChallan.status ||
                                    "N/A"
                                }
                                color={
                                    getStatusColor(
                                        deliveryChallan.status
                                    )
                                }
                            />

                        </Grid>


                        {/* CREATED DATE */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Created Date
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    formatDate(
                                        deliveryChallan.createdDate,
                                        true
                                    )
                                }
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ==================================================
                TRANSPORT INFORMATION
            ================================================== */}

            <Card
                elevation={3}
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mb: 2
                        }}
                    >

                        <LocalShipping />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Transport Information
                        </Typography>

                    </Stack>


                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* VEHICLE */}

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
                                Vehicle Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.vehicleNumber ||
                                    "-"
                                }
                            </Typography>

                        </Grid>


                        {/* DRIVER */}

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
                                Driver Name
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.driverName ||
                                    "-"
                                }
                            </Typography>

                        </Grid>


                        {/* DRIVER MOBILE */}

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
                                Driver Mobile
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.driverMobile ||
                                    "-"
                                }
                            </Typography>

                        </Grid>


                        {/* TRANSPORTER */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Transporter Name
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    deliveryChallan.transporterName ||
                                    "-"
                                }
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ==================================================
                CUSTOMER / SELLER
            ================================================== */}

            <Card
                elevation={3}
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mb: 2
                        }}
                    >

                        <Person />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Seller & Customer
                        </Typography>

                    </Stack>


                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />


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
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography
                                variant="h6"
                            >
                                {
                                    deliveryChallan.sellerId
                                }
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Customer ID
                            </Typography>

                            <Typography
                                variant="h6"
                            >
                                {
                                    deliveryChallan.customerId ??
                                    "-"
                                }
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ==================================================
                REMARKS
            ================================================== */}

            <Card
                elevation={3}
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            mb: 2
                        }}
                    >
                        Remarks
                    </Typography>


                    <Divider
                        sx={{
                            mb: 2
                        }}
                    />


                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            minHeight: 80
                        }}
                    >

                        <Typography>
                            {
                                deliveryChallan.remarks ||
                                "No remarks available."
                            }
                        </Typography>

                    </Paper>

                </CardContent>

            </Card>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={2}
                justifyContent="flex-end"
            >

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/delivery-challans"
                        )
                    }
                >
                    Back
                </Button>


                <Button
                    variant="contained"
                    color="warning"
                    startIcon={
                        <Edit />
                    }
                    onClick={() =>
                        navigate(
                            `/delivery-challans/edit/${deliveryChallan.deliveryChallanId}`
                        )
                    }
                >
                    Edit Delivery Challan
                </Button>

            </Stack>


            {/* ==================================================
                SNACKBAR
            ================================================== */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={4000}
                onClose={
                    closeSnackbar
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={
                        closeSnackbar
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


export default DeliveryChallanDetails;

