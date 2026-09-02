// =========================================================
// ShipmentModal.jsx
// Create / Edit Shipment
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem,
    Alert,
    Box
} from "@mui/material";

// =========================================================
// DEFAULT VALUES
// =========================================================

const initialState = {
    shipmentId: 0,
    sellerId: 6,
    customerId: 3,
    orderId: "",
    courierName: "",
    trackingNumber: "",
    shipmentDate: "",
    deliveryDate: "",
    shipmentStatus: ""
};

// =========================================================
// COMPONENT
// =========================================================

const ShipmentModal = ({
    open,
    item,
    onClose,
    onSave
}) => {

    // ---------------------------------------------------------
    // STATE
    // ---------------------------------------------------------

    const [
        formData,
        setFormData
    ] = useState(initialState);

    const [
        error,
        setError
    ] = useState("");

    // ---------------------------------------------------------
    // STATUS OPTIONS
    // ---------------------------------------------------------

    const statusOptions = [
        "Pending",
        "Processing",
        "Packed",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Returned"
    ];

    // ---------------------------------------------------------
    // GET VALUE
    // Supports camelCase + PascalCase
    // ---------------------------------------------------------

    const getValue = (
        object,
        camelCase,
        pascalCase,
        defaultValue = ""
    ) => {

        return (
            object?.[camelCase] ??
            object?.[pascalCase] ??
            defaultValue
        );
    };

    // ---------------------------------------------------------
    // FORMAT DATETIME FOR datetime-local
    // ---------------------------------------------------------

    const formatDateTimeLocal = (date) => {

        if (!date) {
            return "";
        }

        try {

            const parsedDate = new Date(date);

            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {
                return "";
            }

            const year =
                parsedDate.getFullYear();

            const month =
                String(
                    parsedDate.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    parsedDate.getDate()
                ).padStart(2, "0");

            const hours =
                String(
                    parsedDate.getHours()
                ).padStart(2, "0");

            const minutes =
                String(
                    parsedDate.getMinutes()
                ).padStart(2, "0");

            return `${year}-${month}-${day}T${hours}:${minutes}`;

        } catch {
            return "";
        }
    };

    // ---------------------------------------------------------
    // LOAD ITEM INTO FORM
    // ---------------------------------------------------------

    useEffect(() => {

        setError("");

        if (!open) {
            return;
        }

        if (item) {

            setFormData({

                shipmentId: getValue(
                    item,
                    "shipmentId",
                    "ShipmentId",
                    0
                ),

                sellerId: getValue(
                    item,
                    "sellerId",
                    "SellerId",
                    6
                ),

                customerId: getValue(
                    item,
                    "customerId",
                    "CustomerId",
                    3
                ),

                orderId: getValue(
                    item,
                    "orderId",
                    "OrderId",
                    ""
                ),

                courierName: getValue(
                    item,
                    "courierName",
                    "CourierName",
                    ""
                ),

                trackingNumber: getValue(
                    item,
                    "trackingNumber",
                    "TrackingNumber",
                    ""
                ),

                shipmentDate:
                    formatDateTimeLocal(
                        getValue(
                            item,
                            "shipmentDate",
                            "ShipmentDate",
                            ""
                        )
                    ),

                deliveryDate:
                    formatDateTimeLocal(
                        getValue(
                            item,
                            "deliveryDate",
                            "DeliveryDate",
                            ""
                        )
                    ),

                shipmentStatus: getValue(
                    item,
                    "shipmentStatus",
                    "ShipmentStatus",
                    ""
                )
            });

        } else {

            setFormData({
                ...initialState
            });
        }

    }, [item, open]);

    // ---------------------------------------------------------
    // HANDLE CHANGE
    // ---------------------------------------------------------

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setError("");
    };

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    const validateForm = () => {

        if (!formData.sellerId) {

            setError(
                "Seller ID is required."
            );

            return false;
        }

        if (!formData.customerId) {

            setError(
                "Customer ID is required."
            );

            return false;
        }

        if (!formData.orderId) {

            setError(
                "Order ID is required."
            );

            return false;
        }

        if (
            Number(formData.orderId) <= 0
        ) {

            setError(
                "Please enter a valid Order ID."
            );

            return false;
        }

        if (!formData.courierName.trim()) {

            setError(
                "Courier Name is required."
            );

            return false;
        }

        if (!formData.trackingNumber.trim()) {

            setError(
                "Tracking Number is required."
            );

            return false;
        }

        if (!formData.shipmentDate) {

            setError(
                "Shipment Date is required."
            );

            return false;
        }

        if (!formData.shipmentStatus) {

            setError(
                "Shipment Status is required."
            );

            return false;
        }

        return true;
    };

    // ---------------------------------------------------------
    // SUBMIT
    // ---------------------------------------------------------

    const handleSubmit = () => {

        setError("");

        if (!validateForm()) {
            return;
        }

        const payload = {

            // Identity column
            // 0 means database generates it
            shipmentId:
                Number(
                    formData.shipmentId || 0
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
                formData.courierName.trim(),

            trackingNumber:
                formData.trackingNumber.trim(),

            shipmentDate:
                formData.shipmentDate
                    ? new Date(
                        formData.shipmentDate
                    ).toISOString()
                    : null,

            deliveryDate:
                formData.deliveryDate
                    ? new Date(
                        formData.deliveryDate
                    ).toISOString()
                    : null,

            shipmentStatus:
                formData.shipmentStatus
        };

        console.log(
            "Shipment payload:",
            payload
        );

        onSave(payload);
    };

    // ---------------------------------------------------------
    // RESET / CLOSE
    // ---------------------------------------------------------

    const handleClose = () => {

        setError("");

        onClose();
    };

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                {
                    formData.shipmentId
                        ? "Edit Shipment"
                        : "Add Shipment"
                }

            </DialogTitle>

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2
                        }}
                    >
                        {error}
                    </Alert>

                )}

                <Grid
                    container
                    spacing={2}
                    sx={{
                        mt: 0.5
                    }}
                >

                    {/* =================================================
                        SELLER ID
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Seller ID"
                            name="sellerId"
                            type="number"
                            value={
                                formData.sellerId
                            }
                            onChange={
                                handleChange
                            }
                            disabled
                        />

                    </Grid>

                    {/* =================================================
                        CUSTOMER ID
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Customer ID"
                            name="customerId"
                            type="number"
                            value={
                                formData.customerId
                            }
                            onChange={
                                handleChange
                            }
                            disabled
                        />

                    </Grid>

                    {/* =================================================
                        ORDER ID
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Order ID"
                            name="orderId"
                            type="number"
                            value={
                                formData.orderId
                            }
                            onChange={
                                handleChange
                            }
                            helperText="Example: 2"
                        />

                    </Grid>

                    {/* =================================================
                        COURIER NAME
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Courier Name"
                            name="courierName"
                            value={
                                formData.courierName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Delhivery"
                        />

                    </Grid>

                    {/* =================================================
                        TRACKING NUMBER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Tracking Number"
                            name="trackingNumber"
                            value={
                                formData.trackingNumber
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="DLV123456789IN"
                        />

                    </Grid>

                    {/* =================================================
                        SHIPMENT DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Shipment Date"
                            name="shipmentDate"
                            type="datetime-local"
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

                    {/* =================================================
                        DELIVERY DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Delivery Date"
                            name="deliveryDate"
                            type="datetime-local"
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

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            select
                            fullWidth
                            required
                            label="Shipment Status"
                            name="shipmentStatus"
                            value={
                                formData.shipmentStatus
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {statusOptions.map(
                                status => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>

                </Grid>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {
                        formData.shipmentId
                            ? "Update"
                            : "Save"
                    }
                </Button>

            </DialogActions>

        </Dialog>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ShipmentModal;