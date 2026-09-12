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
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";


// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const ShipmentEdit = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState({

        shipmentId: "",

        sellerId: "",

        customerId: "",

        orderId: "",

        courierName: "",

        trackingNumber: "",

        shipmentDate: "",

        deliveryDate: "",

        shipmentStatus: "Pending"

    });


    // ========================================================
    // PAGE STATE
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================================
    // SNACKBAR
    // ========================================================

    const [snackbar, setSnackbar] =
        useState({

            open: false,

            message: "",

            severity: "info"

        });


    // ========================================================
    // SHOW MESSAGE
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


        if (
            data?.errors
        ) {

            const errors =
                data.errors;


            if (
                typeof errors === "object"
            ) {

                return Object
                    .values(errors)
                    .flat()
                    .join(" ");

            }

        }


        return (
            err?.message ||
            "Failed to process shipment."
        );

    };


    // ========================================================
    // DATE FORMAT
    // ========================================================

    const formatDateForInput = (
        value
    ) => {

        if (!value) {

            return "";

        }


        const date =
            new Date(value);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        return date
            .toISOString()
            .split("T")[0];

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


                const response =
                    await axios.get(
                        `${SERVER_URL}/api/shipments/${id}`
                    );


                const data =
                    response.data;


                const shipment =
                    data?.data ||
                    data?.item ||
                    data;


                if (!shipment) {

                    throw new Error(
                        "Shipment not found."
                    );

                }


                // =================================================
                // MAP EXACT Shipment MODEL
                // =================================================

                setFormData({

                    shipmentId:
                        shipment.ShipmentId ??
                        shipment.shipmentId ??
                        id,

                    sellerId:
                        shipment.SellerId ??
                        shipment.sellerId ??
                        "",

                    customerId:
                        shipment.CustomerId ??
                        shipment.customerId ??
                        "",

                    orderId:
                        shipment.OrderId ??
                        shipment.orderId ??
                        "",

                    courierName:
                        shipment.CourierName ??
                        shipment.courierName ??
                        "",

                    trackingNumber:
                        shipment.TrackingNumber ??
                        shipment.trackingNumber ??
                        "",

                    shipmentDate:
                        formatDateForInput(
                            shipment.ShipmentDate ??
                            shipment.shipmentDate
                        ),

                    deliveryDate:
                        formatDateForInput(
                            shipment.DeliveryDate ??
                            shipment.deliveryDate
                        ),

                    shipmentStatus:
                        shipment.ShipmentStatus ??
                        shipment.shipmentStatus ??
                        "Pending"

                });


            } catch (err) {

                console.error(
                    "GET shipment error:",
                    err?.response?.data ||
                    err
                );


                const message =
                    getErrorMessage(err);


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
            id,
            showMessage
        ]
    );


    // ========================================================
    // LOAD ON PAGE OPEN
    // ========================================================

    useEffect(() => {

        loadShipment();

    }, [
        loadShipment
    ]);


    // ========================================================
    // HANDLE CHANGE
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
            !formData.sellerId
        ) {

            showMessage(
                "Seller ID is required.",
                "error"
            );

            return false;

        }


        if (
            !formData.customerId
        ) {

            showMessage(
                "Customer ID is required.",
                "error"
            );

            return false;

        }


        if (
            !formData.orderId
        ) {

            showMessage(
                "Order ID is required.",
                "error"
            );

            return false;

        }


        if (
            !formData.shipmentStatus
        ) {

            showMessage(
                "Shipment Status is required.",
                "error"
            );

            return false;

        }


        return true;

    };


    // ========================================================
    // SAVE / UPDATE
    // ========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (
            !validateForm()
        ) {

            return;

        }


        try {

            setSaving(true);

            setError("");


            // =================================================
            // EXACT Shipment MODEL PAYLOAD
            // =================================================

            const payload = {

                shipmentId:
                    Number(
                        formData.shipmentId
                    ),

                sellerId:
                    Number(
                        formData.sellerId
                    ),

                customerId:
                    Number(
                        formData.customerId
                    ),

                orderId:
                    Number(
                        formData.orderId
                    ),

                courierName:
                    formData.courierName.trim() ||
                    null,

                trackingNumber:
                    formData.trackingNumber.trim() ||
                    null,

                shipmentDate:
                    formData.shipmentDate ||
                    null,

                deliveryDate:
                    formData.deliveryDate ||
                    null,

                shipmentStatus:
                    formData.shipmentStatus

            };


            console.log(
                "Updating Shipment:",
                payload
            );


            // =================================================
            // NODE API
            // =================================================

            await axios.put(
                `${SERVER_URL}/api/shipments/${id}`,
                payload
            );


            showMessage(
                "Shipment updated successfully.",
                "success"
            );


            // =================================================
            // GO TO VIEW PAGE
            // =================================================

            setTimeout(
                () => {

                    navigate(
                        `/shipments/${id}`
                    );

                },
                800
            );


        } catch (err) {

            console.error(
                "PUT shipment error:",
                err?.response?.data ||
                err
            );


            const message =
                getErrorMessage(err);


            setError(message);


            showMessage(
                message,
                "error"
            );


        } finally {

            setSaving(false);

        }

    };


    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {

        navigate(
            `/shipments/${id}`
        );

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

                        Edit Shipment

                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >

                        Update shipment information

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
                        variant="outlined"
                        startIcon={
                            <VisibilityIcon />
                        }
                        onClick={() =>
                            navigate(
                                `/shipments/${id}`
                            )
                        }
                    >

                        View

                    </Button>

                </Stack>

            </Stack>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={
                    handleSubmit
                }
            >

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

                                <TextField
                                    fullWidth
                                    label="Shipment ID"
                                    name="shipmentId"
                                    value={
                                        formData.shipmentId
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />

                            </Grid>


                            {/* Seller ID */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
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
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* Customer ID */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
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
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* Order ID */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Order ID"
                                    name="orderId"
                                    value={
                                        formData.orderId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* Courier Name */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Courier Name"
                                    name="courierName"
                                    value={
                                        formData.courierName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>


                            {/* Tracking Number */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Tracking Number"
                                    name="trackingNumber"
                                    value={
                                        formData.trackingNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =================================================
                    SHIPMENT DATES
                ================================================= */}

                <Card sx={{ mb: 3 }}>

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

                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Shipment Date"
                                    name="shipmentDate"
                                    value={
                                        formData.shipmentDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                            </Grid>


                            {/* Delivery Date */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Delivery Date"
                                    name="deliveryDate"
                                    value={
                                        formData.deliveryDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                            </Grid>


                            {/* Shipment Status */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    select
                                    label="Shipment Status"
                                    name="shipmentStatus"
                                    value={
                                        formData.shipmentStatus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value="Pending">
                                        Pending
                                    </MenuItem>

                                    <MenuItem value="Dispatched">
                                        Dispatched
                                    </MenuItem>

                                    <MenuItem value="In Transit">
                                        In Transit
                                    </MenuItem>

                                    <MenuItem value="Delivered">
                                        Delivered
                                    </MenuItem>

                                    <MenuItem value="Cancelled">
                                        Cancelled
                                    </MenuItem>

                                </TextField>

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                >

                    <Button
                        variant="outlined"
                        onClick={
                            handleCancel
                        }
                        disabled={
                            saving
                        }
                    >

                        Cancel

                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            saving
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : (
                                    <SaveIcon />
                                )
                        }
                        disabled={
                            saving
                        }
                    >

                        {saving
                            ? "Saving..."
                            : "Save Changes"
                        }

                    </Button>

                </Stack>

            </form>


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
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

export default ShipmentEdit;
