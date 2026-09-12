import React, {
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
    TextField,
    Typography
} from "@mui/material";


// ============================================================
// API
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanEdit = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    const [formData, setFormData] =
        useState({
            deliveryChallanId: 0,
            salesOrderId: "",
            challanNumber: "",
            challanDate: "",
            vehicleNumber: "",
            driverName: "",
            driverMobile: "",
            transporterName: "",
            currentStatus: ""
        });


    // ========================================================
    // VALIDATE ID
    // ========================================================

    useEffect(() => {

        if (
            !id ||
            id === ":id" ||
            isNaN(Number(id))
        ) {

            setError(
                "Invalid Delivery Challan ID."
            );

            setLoading(false);

            return;
        }

        loadDeliveryChallan();

    }, [id]);


    // ========================================================
    // GET DELIVERY CHALLAN
    //
    // React:
    // GET /api/delivery-challans/:id
    //
    // Node:
    // GET /api/delivery-challans/:id
    //
    // ASP.NET:
    // GET /api/DeliveryChallan/{id}
    // ========================================================

    const loadDeliveryChallan = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "GET DELIVERY CHALLAN:",
                `${SERVER_URL}/api/delivery-challans/${id}`
            );


            const response =
                await axios.get(
                    `${SERVER_URL}/api/delivery-challans/${id}`
                );


            const data =
                response.data;


            console.log(
                "DELIVERY CHALLAN RESPONSE:",
                data
            );


            setFormData({

                deliveryChallanId:
                    data.deliveryChallanId ??
                    data.DeliveryChallanId ??
                    Number(id),

                salesOrderId:
                    data.salesOrderId ??
                    data.SalesOrderId ??
                    "",

                challanNumber:
                    data.challanNumber ??
                    data.ChallanNumber ??
                    "",

                challanDate:
                    formatDateForInput(
                        data.challanDate ??
                        data.ChallanDate
                    ),

                vehicleNumber:
                    data.vehicleNumber ??
                    data.VehicleNumber ??
                    "",

                driverName:
                    data.driverName ??
                    data.DriverName ??
                    "",

                driverMobile:
                    data.driverMobile ??
                    data.DriverMobile ??
                    "",

                transporterName:
                    data.transporterName ??
                    data.TransporterName ??
                    "",

                currentStatus:
                    data.currentStatus ??
                    data.CurrentStatus ??
                    data.status ??
                    data.Status ??
                    ""
            });

        }
        catch (err) {

            console.error(
                "LOAD DELIVERY CHALLAN ERROR:",
                err
            );


            const message =
                getErrorMessage(
                    err,
                    "Failed to load Delivery Challan."
                );


            setError(message);

        }
        finally {

            setLoading(false);
        }
    };


    // ========================================================
    // DATE FORMAT
    // ========================================================

    const formatDateForInput = (
        dateValue
    ) => {

        if (!dateValue) {
            return "";
        }


        try {

            const date =
                new Date(dateValue);


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return "";
            }


            return date
                .toISOString()
                .split("T")[0];

        }
        catch {

            return "";
        }
    };


    // ========================================================
    // ERROR MESSAGE
    // ========================================================

    const getErrorMessage = (
        err,
        fallback
    ) => {

        const data =
            err?.response?.data;


        if (
            typeof data === "string" &&
            data.trim()
        ) {

            return data;
        }


        if (data?.message) {

            return data.message;
        }


        if (data?.title) {

            return data.title;
        }


        if (data?.error) {

            return data.error;
        }


        if (data?.errors) {

            if (
                typeof data.errors ===
                "string"
            ) {

                return data.errors;
            }


            try {

                return JSON.stringify(
                    data.errors
                );

            }
            catch {

                return fallback;
            }
        }


        if (err?.message) {

            return err.message;
        }


        return fallback;
    };


    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {

        if (
            !formData.challanNumber ||
            !formData.challanNumber.trim()
        ) {

            showMessage(
                "Challan Number is required.",
                "error"
            );

            return false;
        }


        if (!formData.challanDate) {

            showMessage(
                "Challan Date is required.",
                "error"
            );

            return false;
        }


        if (
            formData.driverMobile &&
            !/^[0-9]{10}$/.test(
                formData.driverMobile.trim()
            )
        ) {

            showMessage(
                "Driver Mobile must contain exactly 10 digits.",
                "error"
            );

            return false;
        }


        return true;
    };


    // ========================================================
    // SNACKBAR
    // ========================================================

    const showMessage = (
        message,
        severity = "success"
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


    // ========================================================
    // UPDATE DELIVERY CHALLAN
    //
    // React:
    // PUT /api/delivery-challans/:id
    //
    // Node:
    // PUT /api/delivery-challans/:id
    //
    // ASP.NET:
    // PUT /api/DeliveryChallan/{id}
    // ========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        try {

            setSaving(true);

            setError("");


            const payload = {

                deliveryChallanId:
                    Number(
                        formData.deliveryChallanId
                    ),

                salesOrderId:
                    formData.salesOrderId
                        ? Number(
                            formData.salesOrderId
                        )
                        : null,

                challanNumber:
                    formData.challanNumber
                        .trim(),

                challanDate:
                    formData.challanDate,

                vehicleNumber:
                    formData.vehicleNumber
                        .trim() || null,

                driverName:
                    formData.driverName
                        .trim() || null,

                driverMobile:
                    formData.driverMobile
                        .trim() || null,

                transporterName:
                    formData.transporterName
                        .trim() || null,

                currentStatus:
                    formData.currentStatus
                        .trim() || null
            };


            console.log(
                "PUT DELIVERY CHALLAN:",
                payload
            );


            const response =
                await axios.put(
                    `${SERVER_URL}/api/delivery-challans/${id}`,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        }
                    }
                );


            console.log(
                "UPDATE DELIVERY CHALLAN RESPONSE:",
                response.data
            );


            showMessage(
                "Delivery Challan updated successfully.",
                "success"
            );


            setTimeout(() => {

                navigate(
                    `/delivery-challans/${id}`
                );

            }, 700);

        }
        catch (err) {

            console.error(
                "UPDATE DELIVERY CHALLAN ERROR:",
                err
            );


            const message =
                getErrorMessage(
                    err,
                    "Failed to update Delivery Challan."
                );


            setError(message);


            showMessage(
                message,
                "error"
            );

        }
        finally {

            setSaving(false);
        }
    };


    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {

        navigate(
            `/delivery-challans/${id}`
        );
    };


    // ========================================================
    // LOADING
    // ========================================================

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

                <CircularProgress />

            </Box>
        );
    }


    // ========================================================
    // INVALID / LOAD ERROR
    // ========================================================

    if (
        error &&
        !formData.deliveryChallanId
    ) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert severity="error">
                    {error}
                </Alert>


                <Button
                    sx={{
                        mt: 2
                    }}
                    variant="outlined"
                    onClick={() =>
                        navigate(
                            "/delivery-challans"
                        )
                    }
                >
                    Back to Delivery Challans
                </Button>

            </Box>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
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
                        Edit Delivery Challan
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update Delivery Challan details
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Cancel
                </Button>

            </Box>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
                >
                    {error}
                </Alert>
            )}


            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={
                    handleSubmit
                }
            >

                <Card>

                    <CardContent>

                        {/* ======================================
                            GENERAL INFORMATION
                        ====================================== */}

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 2
                            }}
                        >
                            General Information
                        </Typography>


                        <Divider
                            sx={{
                                mb: 3
                            }}
                        />


                        <Grid
                            container
                            spacing={3}
                        >

                            {/* Delivery Challan ID */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Delivery Challan ID"
                                    value={
                                        formData.deliveryChallanId
                                    }
                                    disabled
                                />

                            </Grid>


                            {/* Sales Order ID */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Sales Order ID"
                                    name="salesOrderId"
                                    type="number"
                                    value={
                                        formData.salesOrderId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* Challan Number */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Challan Number"
                                    name="challanNumber"
                                    value={
                                        formData.challanNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>


                            {/* Challan Date */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Challan Date"
                                    name="challanDate"
                                    value={
                                        formData.challanDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                            </Grid>

                        </Grid>


                        {/* ======================================
                            TRANSPORT DETAILS
                        ====================================== */}

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mt: 4,
                                mb: 2
                            }}
                        >
                            Transport Details
                        </Typography>


                        <Divider
                            sx={{
                                mb: 3
                            }}
                        />


                        <Grid
                            container
                            spacing={3}
                        >

                            {/* Vehicle Number */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Vehicle Number"
                                    name="vehicleNumber"
                                    value={
                                        formData.vehicleNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. AP39AB1234"
                                />

                            </Grid>


                            {/* Driver Name */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Driver Name"
                                    name="driverName"
                                    value={
                                        formData.driverName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>


                            {/* Driver Mobile */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Driver Mobile"
                                    name="driverMobile"
                                    value={
                                        formData.driverMobile
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        maxLength: 10,
                                        inputMode: "numeric"
                                    }}
                                />

                            </Grid>


                            {/* Transporter Name */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Transporter Name"
                                    name="transporterName"
                                    value={
                                        formData.transporterName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>


                            {/* Current Status */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Current Status"
                                    name="currentStatus"
                                    value={
                                        formData.currentStatus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                        </Grid>


                        {/* ======================================
                            ACTIONS
                        ====================================== */}

                        <Divider
                            sx={{
                                mt: 4,
                                mb: 3
                            }}
                        />


                        <Stack
                            direction={{
                                xs: "column-reverse",
                                sm: "row"
                            }}
                            spacing={2}
                            justifyContent="flex-end"
                        >

                            <Button
                                variant="outlined"
                                onClick={
                                    handleCancel
                                }
                                disabled={saving}
                                fullWidth={{
                                    xs: true,
                                    sm: false
                                }}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                                fullWidth={{
                                    xs: true,
                                    sm: false
                                }}
                            >

                                {saving ? (

                                    <>

                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                mr: 1
                                            }}
                                        />

                                        Saving...

                                    </>

                                ) : (

                                    "Save Changes"

                                )}

                            </Button>

                        </Stack>

                    </CardContent>

                </Card>

            </form>


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
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={
                        closeSnackbar
                    }
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    sx={{
                        width: "100%"
                    }}
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default DeliveryChallanEdit;

