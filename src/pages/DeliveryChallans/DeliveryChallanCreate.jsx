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
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";


const SERVER_URL =
    "http://localhost:5000";


const DeliveryChallanCreate = () => {

    const navigate =
        useNavigate();


    // ==========================================================
    // FORM
    // ==========================================================

    const [formData, setFormData] =
        useState({

            salesOrderId: "",

            sellerId: "",

            customerId: "",

            challanNumber: "",

            challanDate: "",

            vehicleNumber: "",

            driverName: "",

            driverMobile: "",

            transporterName: "",

            status: "Pending",

            remarks: ""
        });


    // ==========================================================
    // SALES ORDERS
    // ==========================================================

    const [salesOrders, setSalesOrders] =
        useState([]);

    const [loadingSalesOrders, setLoadingSalesOrders] =
        useState(false);


    // ==========================================================
    // LOADING / SUBMIT
    // ==========================================================

    const [loading, setLoading] =
        useState(false);


    // ==========================================================
    // SNACKBAR
    // ==========================================================

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    // ==========================================================
    // SHOW MESSAGE
    // ==========================================================

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


    // ==========================================================
    // HANDLE CHANGE
    // ==========================================================

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


    // ==========================================================
    // LOAD SALES ORDERS
    //
    // Optional lookup.
    //
    // Node:
    // GET /api/sales-orders
    // ==========================================================

    const loadSalesOrders = async () => {

        try {

            setLoadingSalesOrders(true);


            const response =
                await fetch(
                    `${SERVER_URL}/api/sales-orders`,
                    {
                        method: "GET",

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {
                return;
            }


            const data =
                await response
                    .json()
                    .catch(
                        () => []
                    );


            const list =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];


            setSalesOrders(
                list
            );

        }
        catch (error) {

            console.error(
                "LOAD SALES ORDERS ERROR:",
                error
            );

        }
        finally {

            setLoadingSalesOrders(
                false
            );
        }
    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        loadSalesOrders();

    }, []);


    // ==========================================================
    // SUBMIT
    //
    // React:
    // POST /api/delivery-challans
    //
    // Node:
    // POST /api/delivery-challans
    //
    // ASP.NET:
    // POST /api/DeliveryChallan
    // ==========================================================

    const handleSubmit =
        async (
            event
        ) => {

            event.preventDefault();


            // --------------------------------------------------
            // VALIDATION
            // --------------------------------------------------

            if (
                !formData.salesOrderId
            ) {

                showMessage(
                    "Sales Order ID is required.",
                    "error"
                );

                return;
            }


            if (
                !formData.sellerId
            ) {

                showMessage(
                    "Seller ID is required.",
                    "error"
                );

                return;
            }


            if (
                !formData.challanNumber.trim()
            ) {

                showMessage(
                    "Challan Number is required.",
                    "error"
                );

                return;
            }


            if (
                !formData.challanDate
            ) {

                showMessage(
                    "Challan Date is required.",
                    "error"
                );

                return;
            }


            try {

                setLoading(true);


                // --------------------------------------------------
                // PAYLOAD
                // --------------------------------------------------

                const payload = {

                    salesOrderId:
                        Number(
                            formData.salesOrderId
                        ),

                    sellerId:
                        Number(
                            formData.sellerId
                        ),

                    customerId:
                        formData.customerId
                            ? Number(
                                formData.customerId
                            )
                            : null,

                    challanNumber:
                        formData.challanNumber.trim(),

                    challanDate:
                        formData.challanDate,

                    vehicleNumber:
                        formData.vehicleNumber.trim() ||
                        null,

                    driverName:
                        formData.driverName.trim() ||
                        null,

                    driverMobile:
                        formData.driverMobile.trim() ||
                        null,

                    transporterName:
                        formData.transporterName.trim() ||
                        null,

                    status:
                        formData.status,

                    remarks:
                        formData.remarks.trim() ||
                        null
                };


                console.log(
                    "================================================"
                );

                console.log(
                    "POST /api/delivery-challans"
                );

                console.log(
                    "PAYLOAD:",
                    payload
                );

                console.log(
                    "================================================"
                );


                // --------------------------------------------------
                // NODE API
                // --------------------------------------------------

                const response =
                    await fetch(
                        `${SERVER_URL}/api/delivery-challans`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => null
                        );


                console.log(
                    "CREATE RESPONSE:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        data?.error ||
                        "Failed to create delivery challan."
                    );
                }


                showMessage(
                    "Delivery Challan created successfully.",
                    "success"
                );


                // --------------------------------------------------
                // GO BACK
                // --------------------------------------------------

                setTimeout(
                    () => {

                        navigate(
                            "/delivery-challans"
                        );

                    },
                    800
                );

            }
            catch (error) {

                console.error(
                    "CREATE DELIVERY CHALLAN ERROR:",
                    error
                );


                showMessage(
                    error.message ||
                    "Failed to create delivery challan.",
                    "error"
                );

            }
            finally {

                setLoading(false);
            }
        };


    // ==========================================================
    // CANCEL
    // ==========================================================

    const handleCancel = () => {

        navigate(
            "/delivery-challans"
        );
    };


    // ==========================================================
    // UI
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
                        onClick={
                            handleCancel
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
                        Create Delivery Challan
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Create a new delivery challan
                    </Typography>

                </Box>

            </Stack>


            {/* ==================================================
                FORM
            ================================================== */}

            <Card
                elevation={3}
            >

                <CardContent
                    sx={{
                        p: 3
                    }}
                >

                    <Box
                        component="form"
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <Grid
                            container
                            spacing={3}
                        >

                            {/* ======================================
                                SALES ORDER ID
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                {salesOrders.length > 0 ? (

                                    <FormControl
                                        fullWidth
                                        required
                                    >

                                        <InputLabel>
                                            Sales Order
                                        </InputLabel>

                                        <Select
                                            name="salesOrderId"
                                            value={
                                                formData.salesOrderId
                                            }
                                            label="Sales Order"
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loadingSalesOrders
                                            }
                                        >

                                            {salesOrders.map(
                                                order => {

                                                    const orderId =
                                                        order.salesOrderId ??
                                                        order.SalesOrderId;

                                                    return (

                                                        <MenuItem
                                                            key={orderId}
                                                            value={orderId}
                                                        >
                                                            Sales Order #
                                                            {orderId}
                                                        </MenuItem>

                                                    );
                                                }
                                            )}

                                        </Select>

                                    </FormControl>

                                ) : (

                                    <TextField
                                        fullWidth
                                        required
                                        type="number"
                                        label="Sales Order ID"
                                        name="salesOrderId"
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

                                )}

                            </Grid>


                            {/* ======================================
                                SELLER ID
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
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


                            {/* ======================================
                                CUSTOMER ID
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
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
                                    helperText="Optional"
                                />

                            </Grid>


                            {/* ======================================
                                CHALLAN NUMBER
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
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
                                    placeholder="DC-2026-002"
                                />

                            </Grid>


                            {/* ======================================
                                CHALLAN DATE
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="datetime-local"
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


                            {/* ======================================
                                VEHICLE NUMBER
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
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
                                    placeholder="KA-01-AB-1234"
                                />

                            </Grid>


                            {/* ======================================
                                DRIVER NAME
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
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
                                    placeholder="Ramesh Kumar"
                                />

                            </Grid>


                            {/* ======================================
                                DRIVER MOBILE
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
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
                                    placeholder="9876543210"
                                    inputProps={{
                                        maxLength: 15
                                    }}
                                />

                            </Grid>


                            {/* ======================================
                                TRANSPORTER
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
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
                                    placeholder="Delhivery Logistics"
                                />

                            </Grid>


                            {/* ======================================
                                STATUS
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <FormControl
                                    fullWidth
                                >

                                    <InputLabel>
                                        Status
                                    </InputLabel>

                                    <Select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        label="Status"
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

                                    </Select>

                                </FormControl>

                            </Grid>


                            {/* ======================================
                                REMARKS
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    label="Remarks"
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter delivery challan remarks..."
                                />

                            </Grid>


                            {/* ======================================
                                BUTTONS
                            ====================================== */}

                            <Grid
                                item
                                xs={12}
                            >

                                <Divider
                                    sx={{
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
                                        disabled={
                                            loading
                                        }
                                    >
                                        Cancel
                                    </Button>


                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={
                                            <Save />
                                        }
                                        disabled={
                                            loading
                                        }
                                    >

                                        {loading
                                            ? "Creating..."
                                            : "Create Delivery Challan"}

                                    </Button>

                                </Stack>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>


            {/* ==================================================
                SNACKBAR
            ================================================== */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    4000
                }
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


export default DeliveryChallanCreate;

