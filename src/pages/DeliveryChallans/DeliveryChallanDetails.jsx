// ============================================================
// DeliveryChallanDetails.jsx
//
// Architecture:
// React
//   ↓
// Node server.js :5000
//   ↓
// ASP.NET Core :7203
//
// React endpoint:
// GET /api/delivery-challans/:id
//
// ASP.NET endpoint:
// GET /api/DeliveryChallan/:id
// ============================================================

import React, {
    useCallback,
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


// ============================================================
// NODE SERVER
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // ========================================================
    // STATE
    // ========================================================

    const [deliveryChallan, setDeliveryChallan] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "error"
        });


    // ========================================================
    // MESSAGE
    // ========================================================

    const showMessage = useCallback(
        (
            message,
            severity = "error"
        ) => {

            setSnackbar({
                open: true,
                message,
                severity
            });
        },
        []
    );


    const closeSnackbar = () => {

        setSnackbar(
            previous => ({
                ...previous,
                open: false
            })
        );
    };


    // ========================================================
    // GET VALUE
    //
    // Supports:
    //
    // deliveryChallanId
    // DeliveryChallanId
    // delivery_challan_id
    // ========================================================

    const getValue = (
        object,
        ...keys
    ) => {

        if (!object) {
            return undefined;
        }

        for (const key of keys) {

            if (
                object[key] !== undefined &&
                object[key] !== null
            ) {

                return object[key];
            }
        }

        return undefined;
    };


    // ========================================================
    // NORMALIZE API RESPONSE
    // ========================================================

   const normalizeDeliveryChallan = (responseData) => {

    if (!responseData) {
        return null;
    }

    let data = responseData;

    // Handle common API wrappers
    if (
        responseData.data &&
        typeof responseData.data === "object"
    ) {
        data = responseData.data;
    }
    else if (
        responseData.result &&
        typeof responseData.result === "object"
    ) {
        data = responseData.result;
    }
    else if (
        responseData.deliveryChallan &&
        typeof responseData.deliveryChallan === "object"
    ) {
        data = responseData.deliveryChallan;
    }

    console.log(
        "DELIVERY CHALLAN OBJECT USED FOR BINDING:",
        data
    );

    return {

        deliveryChallanId:
            getValue(
                data,
                "deliveryChallanId",
                "DeliveryChallanId",
                "deliveryChallanID",
                "DeliveryChallanID",
                "delivery_challan_id",
                "id",
                "Id"
            ),

        salesOrderId:
            getValue(
                data,
                "salesOrderId",
                "SalesOrderId",
                "salesOrderID",
                "SalesOrderID",
                "sales_order_id"
            ),

        sellerId:
            getValue(
                data,
                "sellerId",
                "SellerId",
                "sellerID",
                "SellerID",
                "seller_id"
            ),

        customerId:
            getValue(
                data,
                "customerId",
                "CustomerId",
                "customerID",
                "CustomerID",
                "customer_id"
            ),

        challanNumber:
            getValue(
                data,
                "challanNumber",
                "ChallanNumber",
                "challanNo",
                "ChallanNo",
                "challan_number",
                "number",
                "Number"
            ),

        challanDate:
            getValue(
                data,
                "challanDate",
                "ChallanDate",
                "date",
                "Date",
                "challan_date"
            ),

        vehicleNumber:
            getValue(
                data,
                "vehicleNumber",
                "VehicleNumber",
                "vehicleNo",
                "VehicleNo",
                "vehicle_number"
            ),

        driverName:
            getValue(
                data,
                "driverName",
                "DriverName",
                "driver",
                "Driver",
                "driver_name"
            ),

        driverMobile:
            getValue(
                data,
                "driverMobile",
                "DriverMobile",
                "driverPhone",
                "DriverPhone",
                "mobile",
                "Mobile",
                "driver_mobile"
            ),

        transporterName:
            getValue(
                data,
                "transporterName",
                "TransporterName",
                "transporter",
                "Transporter",
                "transporter_name"
            ),

        status:
            getValue(
                data,
                "status",
                "Status",
                "currentStatus",
                "CurrentStatus",
                "current_status"
            ),

        createdDate:
            getValue(
                data,
                "createdDate",
                "CreatedDate",
                "createdOn",
                "CreatedOn",
                "created_at",
                "created_date"
            ),

        remarks:
            getValue(
                data,
                "remarks",
                "Remarks",
                "remark",
                "Remark"
            ),

        _raw: data
    };
};


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (
        value,
        includeTime = false
    ) => {

        if (!value) {
            return "-";
        }


        const date = new Date(value);


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


    // ========================================================
    // STATUS COLOR
    // ========================================================

    const getStatusColor = (
        status
    ) => {

        switch (
            String(status || "")
                .trim()
                .toLowerCase()
        ) {

            case "delivered":
                return "success";

            case "pending":
                return "warning";

            case "in transit":
            case "in_transit":
            case "intransit":
                return "info";

            case "dispatched":
                return "info";

            case "cancelled":
            case "canceled":
                return "error";

            case "completed":
                return "success";

            default:
                return "default";
        }
    };


    // ========================================================
    // LOAD DELIVERY CHALLAN
    // ========================================================

    const loadDeliveryChallan =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setDeliveryChallan(null);


                    // ------------------------------------------------
                    // Validate ID
                    // ------------------------------------------------

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


                    // ------------------------------------------------
                    // NODE API
                    // ------------------------------------------------

                    const url =
                        `${SERVER_URL}/api/delivery-challans/${numericId}`;


                    console.log(
                        "================================================"
                    );

                    console.log(
                        "DELIVERY CHALLAN DETAILS REQUEST"
                    );

                    console.log(
                        "ID:",
                        numericId
                    );

                    console.log(
                        "URL:",
                        url
                    );

                    console.log(
                        "================================================"
                    );


                    const response =
                        await fetch(
                            url,
                            {
                                method: "GET",

                                headers: {
                                    Accept:
                                        "application/json"
                                }
                            }
                        );


                    // ------------------------------------------------
                    // Read response safely
                    // ------------------------------------------------

                    const text =
                        await response.text();


                    console.log(
                        "DELIVERY CHALLAN HTTP STATUS:",
                        response.status
                    );

                    console.log(
                        "DELIVERY CHALLAN RAW RESPONSE:",
                        text
                    );


                    let data = null;


                    if (text) {

                        try {

                            data =
                                JSON.parse(text);

                        }
                        catch (jsonError) {

                            console.error(
                                "DELIVERY CHALLAN JSON PARSE ERROR:",
                                jsonError
                            );

                            throw new Error(
                                "Server returned an invalid JSON response."
                            );
                        }
                    }


                    // ------------------------------------------------
                    // HTTP ERROR
                    // ------------------------------------------------

                    if (!response.ok) {

                        throw new Error(
                            data?.message ||
                            data?.Message ||
                            data?.error ||
                            data?.Error ||
                            `Failed to load delivery challan. HTTP ${response.status}`
                        );
                    }


                    // ------------------------------------------------
                    // Empty response
                    // ------------------------------------------------

                    if (!data) {

                        throw new Error(
                            "Delivery Challan API returned an empty response."
                        );
                    }


                    // ------------------------------------------------
                    // Normalize
                    // ------------------------------------------------

                    const normalized =
                        normalizeDeliveryChallan(
                            data
                        );


                    console.log(
                        "NORMALIZED DELIVERY CHALLAN:",
                        normalized
                    );


                    // ------------------------------------------------
                    // Validate normalized object
                    // ------------------------------------------------

                    if (!normalized) {

                        throw new Error(
                            "Unable to read Delivery Challan response."
                        );
                    }


                    // ------------------------------------------------
                    // Set state
                    // ------------------------------------------------

                    setDeliveryChallan(
                        normalized
                    );

                }
                catch (error) {

                    console.error(
                        "================================================"
                    );

                    console.error(
                        "DELIVERY CHALLAN DETAILS ERROR:",
                        error
                    );

                    console.error(
                        "================================================"
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

            },
            [
                id,
                showMessage
            ]
        );


    // ========================================================
    // LOAD ON ID CHANGE
    // ========================================================

    useEffect(
        () => {

            loadDeliveryChallan();

        },
        [
            loadDeliveryChallan
        ]
    );


    // ========================================================
    // LOADING
    // ========================================================

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


    // ========================================================
    // NOT FOUND / ERROR
    // ========================================================

    if (!deliveryChallan) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

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
                        mb: 2
                    }}
                >
                    Back to Delivery Challans
                </Button>


                <Alert
                    severity="error"
                >
                    Delivery Challan could not be loaded.
                </Alert>


                <Snackbar
                    open={
                        snackbar.open
                    }
                    autoHideDuration={5000}
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
    }


    // ========================================================
    // LOCAL VALUES
    // ========================================================

    const challanId =
        deliveryChallan.deliveryChallanId;

    const salesOrderId =
        deliveryChallan.salesOrderId;

    const sellerId =
        deliveryChallan.sellerId;

    const customerId =
        deliveryChallan.customerId;

    const challanNumber =
        deliveryChallan.challanNumber;

    const status =
        deliveryChallan.status;

    const challanDate =
        deliveryChallan.challanDate;

    const createdDate =
        deliveryChallan.createdDate;

    const vehicleNumber =
        deliveryChallan.vehicleNumber;

    const driverName =
        deliveryChallan.driverName;

    const driverMobile =
        deliveryChallan.driverMobile;

    const transporterName =
        deliveryChallan.transporterName;

    const remarks =
        deliveryChallan.remarks;


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 3
                }
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
                        variant="body1"
                        color="text.secondary"
                    >
                        Challan Number:{" "}
                        <strong>
                            {challanNumber || "-"}
                        </strong>
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
                            `/delivery-challans/edit/${challanId}`
                        )
                    }
                    disabled={
                        !challanId
                    }
                >
                    Edit Delivery Challan
                </Button>

            </Stack>


            {/* ==================================================
                CHALLAN INFORMATION
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

                        {/* DELIVERY CHALLAN ID */}

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
                                {challanId ?? "-"}
                            </Typography>

                        </Grid>


                        {/* SALES ORDER ID */}

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
                                {salesOrderId ?? "-"}
                            </Typography>

                        </Grid>


                        {/* CHALLAN NUMBER */}

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
                                Challan Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={700}
                            >
                                {challanNumber || "-"}
                            </Typography>

                        </Grid>


                        {/* STATUS */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
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
                                    status ||
                                    "N/A"
                                }
                                color={
                                    getStatusColor(
                                        status
                                    )
                                }
                            />

                        </Grid>


                        {/* CHALLAN DATE */}

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
                                Challan Date
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    formatDate(
                                        challanDate
                                    )
                                }
                            </Typography>

                        </Grid>


                        {/* CREATED DATE */}

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
                                Created Date
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {
                                    formatDate(
                                        createdDate,
                                        true
                                    )
                                }
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ==================================================
                SELLER & CUSTOMER
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

                        {/* SELLER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Seller ID
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {sellerId ?? "-"}
                                </Typography>

                            </Paper>

                        </Grid>


                        {/* CUSTOMER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Customer ID
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {customerId ?? "-"}
                                </Typography>

                            </Paper>

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
                                {vehicleNumber || "-"}
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
                                {driverName || "-"}
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
                                {driverMobile || "-"}
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
                                {transporterName || "-"}
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
                                remarks ||
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
                            `/delivery-challans/edit/${challanId}`
                        )
                    }
                    disabled={
                        !challanId
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
                autoHideDuration={5000}
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
