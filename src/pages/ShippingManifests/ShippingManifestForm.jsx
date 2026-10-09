import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Paper,
    Typography,
    Divider,
    Stack,
    CircularProgress
} from "@mui/material";

import {
    LocalShipping,
    Inventory2,
    Person,
    LocationOn,
    CalendarMonth,
    Save,
    RestartAlt,
    ArrowBack
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return "";

    for (const key of keys) {
        const value = record[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatDateForInput = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value).slice(0, 10);
    }

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
};

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    manifestNumber: "",
    orderNumber: "",
    customerName: "",
    carrierName: "",
    trackingNumber: "",
    vehicleNumber: "",
    driverName: "",
    driverContact: "",
    shipmentDate: "",
    expectedDeliveryDate: "",
    actualDeliveryDate: "",
    origin: "",
    destination: "",
    totalItems: "0",
    totalQuantity: "0",
    totalPackages: "0",
    totalWeight: "",
    weightUnit: "kg",
    shippingCost: "0",
    status: "Pending",
    notes: ""
};

/* =========================================================
   FIELD CONFIGURATION
========================================================= */

const statusOptions = [
    "Pending",
    "Processing",
    "Ready",
    "Packed",
    "Shipped",
    "In Transit",
    "Delivered",
    "Cancelled"
];

const weightUnitOptions = [
    "kg",
    "g",
    "lb",
    "ton"
];

/* =========================================================
   COMPONENT
========================================================= */

const ShippingManifestForm = ({
    manifest = null,
    record = null,
    initialData = null,
    onSubmit,
    onSave,
    onCancel,
    onReset,
    loading = false,
    saving = false,
    mode,
    title,
    submitLabel,
    showReset = true,
    showCancel = true,
    disabled = false
}) => {
    const selectedRecord = manifest || record || initialData;

    const isEdit = mode
        ? mode.toLowerCase() === "edit"
        : Boolean(selectedRecord);

    const isBusy = loading || saving || disabled;

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [errors, setErrors] = useState({});

    /* =====================================================
       LOAD FORM DATA
    ===================================================== */

    useEffect(() => {
        if (!selectedRecord) {
            setFormData({ ...initialFormData });
            setErrors({});
            return;
        }

        setFormData({
            manifestNumber: getField(
                selectedRecord,
                "manifestNumber",
                "ManifestNumber",
                "manifestNo",
                "ManifestNo"
            ),
            orderNumber: getField(
                selectedRecord,
                "orderNumber",
                "OrderNumber",
                "orderNo",
                "OrderNo"
            ),
            customerName: getField(
                selectedRecord,
                "customerName",
                "CustomerName",
                "consigneeName",
                "ConsigneeName"
            ),
            carrierName: getField(
                selectedRecord,
                "carrierName",
                "CarrierName"
            ),
            trackingNumber: getField(
                selectedRecord,
                "trackingNumber",
                "TrackingNumber"
            ),
            vehicleNumber: getField(
                selectedRecord,
                "vehicleNumber",
                "VehicleNumber"
            ),
            driverName: getField(
                selectedRecord,
                "driverName",
                "DriverName"
            ),
            driverContact: getField(
                selectedRecord,
                "driverContact",
                "DriverContact"
            ),
            shipmentDate: formatDateForInput(
                getField(
                    selectedRecord,
                    "shipmentDate",
                    "ShipmentDate"
                )
            ),
            expectedDeliveryDate: formatDateForInput(
                getField(
                    selectedRecord,
                    "expectedDeliveryDate",
                    "ExpectedDeliveryDate"
                )
            ),
            actualDeliveryDate: formatDateForInput(
                getField(
                    selectedRecord,
                    "actualDeliveryDate",
                    "ActualDeliveryDate"
                )
            ),
            origin: getField(
                selectedRecord,
                "origin",
                "Origin"
            ),
            destination: getField(
                selectedRecord,
                "destination",
                "Destination"
            ),
            totalItems: String(
                getField(
                    selectedRecord,
                    "totalItems",
                    "TotalItems"
                ) ?? 0
            ),
            totalQuantity: String(
                getField(
                    selectedRecord,
                    "totalQuantity",
                    "TotalQuantity"
                ) ?? 0
            ),
            totalPackages: String(
                getField(
                    selectedRecord,
                    "totalPackages",
                    "TotalPackages"
                ) ?? 0
            ),
            totalWeight: String(
                getField(
                    selectedRecord,
                    "totalWeight",
                    "TotalWeight"
                ) ?? ""
            ),
            weightUnit: getField(
                selectedRecord,
                "weightUnit",
                "WeightUnit"
            ) || "kg",
            shippingCost: String(
                getField(
                    selectedRecord,
                    "shippingCost",
                    "ShippingCost"
                ) ?? 0
            ),
            status: getField(
                selectedRecord,
                "status",
                "Status"
            ) || "Pending",
            notes: getField(
                selectedRecord,
                "notes",
                "Notes",
                "remarks",
                "Remarks"
            )
        });

        setErrors({});
    }, [selectedRecord]);

    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setErrors({});

        if (typeof onReset === "function") {
            onReset();
            return;
        }

        if (selectedRecord) {
            setFormData({
                ...initialFormData,
                manifestNumber: getField(
                    selectedRecord,
                    "manifestNumber",
                    "ManifestNumber",
                    "manifestNo",
                    "ManifestNo"
                ),
                orderNumber: getField(
                    selectedRecord,
                    "orderNumber",
                    "OrderNumber",
                    "orderNo",
                    "OrderNo"
                ),
                customerName: getField(
                    selectedRecord,
                    "customerName",
                    "CustomerName",
                    "consigneeName",
                    "ConsigneeName"
                ),
                carrierName: getField(
                    selectedRecord,
                    "carrierName",
                    "CarrierName"
                ),
                trackingNumber: getField(
                    selectedRecord,
                    "trackingNumber",
                    "TrackingNumber"
                ),
                vehicleNumber: getField(
                    selectedRecord,
                    "vehicleNumber",
                    "VehicleNumber"
                ),
                driverName: getField(
                    selectedRecord,
                    "driverName",
                    "DriverName"
                ),
                driverContact: getField(
                    selectedRecord,
                    "driverContact",
                    "DriverContact"
                ),
                shipmentDate: formatDateForInput(
                    getField(
                        selectedRecord,
                        "shipmentDate",
                        "ShipmentDate"
                    )
                ),
                expectedDeliveryDate: formatDateForInput(
                    getField(
                        selectedRecord,
                        "expectedDeliveryDate",
                        "ExpectedDeliveryDate"
                    )
                ),
                actualDeliveryDate: formatDateForInput(
                    getField(
                        selectedRecord,
                        "actualDeliveryDate",
                        "ActualDeliveryDate"
                    )
                ),
                origin: getField(
                    selectedRecord,
                    "origin",
                    "Origin"
                ),
                destination: getField(
                    selectedRecord,
                    "destination",
                    "Destination"
                ),
                totalItems: String(
                    getField(
                        selectedRecord,
                        "totalItems",
                        "TotalItems"
                    ) ?? 0
                ),
                totalQuantity: String(
                    getField(
                        selectedRecord,
                        "totalQuantity",
                        "TotalQuantity"
                    ) ?? 0
                ),
                totalPackages: String(
                    getField(
                        selectedRecord,
                        "totalPackages",
                        "TotalPackages"
                    ) ?? 0
                ),
                totalWeight: String(
                    getField(
                        selectedRecord,
                        "totalWeight",
                        "TotalWeight"
                    ) ?? ""
                ),
                weightUnit: getField(
                    selectedRecord,
                    "weightUnit",
                    "WeightUnit"
                ) || "kg",
                shippingCost: String(
                    getField(
                        selectedRecord,
                        "shippingCost",
                        "ShippingCost"
                    ) ?? 0
                ),
                status: getField(
                    selectedRecord,
                    "status",
                    "Status"
                ) || "Pending",
                notes: getField(
                    selectedRecord,
                    "notes",
                    "Notes",
                    "remarks",
                    "Remarks"
                )
            });

            return;
        }

        setFormData({ ...initialFormData });
    };

    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = () => {
        const nextErrors = {};

        if (!String(formData.manifestNumber).trim()) {
            nextErrors.manifestNumber =
                "Manifest number is required.";
        }

        if (!String(formData.orderNumber).trim()) {
            nextErrors.orderNumber =
                "Order number is required.";
        }

        if (!String(formData.customerName).trim()) {
            nextErrors.customerName =
                "Customer name is required.";
        }

        if (!String(formData.status).trim()) {
            nextErrors.status = "Status is required.";
        }

        const numericFields = [
            "totalItems",
            "totalQuantity",
            "totalPackages",
            "totalWeight",
            "shippingCost"
        ];

        numericFields.forEach((field) => {
            const value = formData[field];

            if (
                value !== "" &&
                (!Number.isFinite(Number(value)) ||
                    Number(value) < 0)
            ) {
                nextErrors[field] =
                    "Enter a valid non-negative number.";
            }
        });

        if (
            formData.shipmentDate &&
            formData.expectedDeliveryDate &&
            formData.expectedDeliveryDate < formData.shipmentDate
        ) {
            nextErrors.expectedDeliveryDate =
                "Expected delivery cannot be before shipment.";
        }

        if (
            formData.shipmentDate &&
            formData.actualDeliveryDate &&
            formData.actualDeliveryDate < formData.shipmentDate
        ) {
            nextErrors.actualDeliveryDate =
                "Actual delivery cannot be before shipment.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isBusy || !validateForm()) {
            return;
        }

        const payload = {
            ...formData,
            manifestNumber: String(
                formData.manifestNumber
            ).trim(),
            orderNumber: String(
                formData.orderNumber
            ).trim(),
            customerName: String(
                formData.customerName
            ).trim(),
            totalItems: Number(formData.totalItems || 0),
            totalQuantity: Number(formData.totalQuantity || 0),
            totalPackages: Number(formData.totalPackages || 0),
            totalWeight:
                formData.totalWeight === ""
                    ? null
                    : Number(formData.totalWeight),
            shippingCost: Number(formData.shippingCost || 0)
        };

        const submitHandler = onSubmit || onSave;

        if (typeof submitHandler === "function") {
            submitHandler(payload);
        }
    };

    /* =====================================================
       TEXT FIELD RENDERER
    ===================================================== */

    const renderTextField = ({
        name,
        label,
        type = "text",
        required = false,
        options = [],
        multiline = false,
        min,
        max,
        md = 4,
        helperText
    }) => (
        <Grid item xs={12} sm={6} md={md} key={name}>
            <TextField
                fullWidth
                size="small"
                name={name}
                label={label}
                type={type}
                value={formData[name] ?? ""}
                onChange={handleChange}
                required={required}
                select={type === "select"}
                multiline={multiline}
                minRows={multiline ? 3 : undefined}
                disabled={isBusy}
                error={Boolean(errors[name])}
                helperText={errors[name] || helperText || " "}
                InputLabelProps={
                    type === "date"
                        ? { shrink: true }
                        : undefined
                }
                inputProps={
                    type === "number"
                        ? {
                            min: min ?? 0,
                            max,
                            step: "any"
                        }
                        : undefined
                }
            >
                {type === "select" &&
                    options.map((option) => (
                        <MenuItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
            </TextField>
        </Grid>
    );

    /* =====================================================
       SECTION HEADER
    ===================================================== */

    const SectionHeader = ({ icon, children }) => (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    color: "primary.main"
                }}
            >
                {icon}
            </Box>

            <Typography
                variant="subtitle1"
                fontWeight={700}
            >
                {children}
            </Typography>
        </Box>
    );

    /* =====================================================
       RENDER FORM
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden"
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* HEADER */}

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                borderRadius: 2
                            }}
                        >
                            <LocalShipping />
                        </Box>

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {title ||
                                    (isEdit
                                        ? "Edit Shipping Manifest"
                                        : "Create Shipping Manifest")}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Enter the shipping, carrier, delivery,
                                and package details.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Divider />

                {/* MANIFEST DETAILS */}

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <SectionHeader icon={<LocalShipping />}>
                        Manifest Information
                    </SectionHeader>

                    <Grid container spacing={2}>
                        {renderTextField({
                            name: "manifestNumber",
                            label: "Manifest Number",
                            required: true
                        })}

                        {renderTextField({
                            name: "orderNumber",
                            label: "Order Number",
                            required: true
                        })}

                        {renderTextField({
                            name: "status",
                            label: "Status",
                            type: "select",
                            options: statusOptions,
                            required: true
                        })}
                    </Grid>
                </Box>

                <Divider />

                {/* CUSTOMER AND CARRIER */}

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <SectionHeader icon={<Person />}>
                        Customer and Carrier Details
                    </SectionHeader>

                    <Grid container spacing={2}>
                        {renderTextField({
                            name: "customerName",
                            label: "Customer Name",
                            required: true
                        })}

                        {renderTextField({
                            name: "carrierName",
                            label: "Carrier Name"
                        })}

                        {renderTextField({
                            name: "trackingNumber",
                            label: "Tracking Number"
                        })}

                        {renderTextField({
                            name: "vehicleNumber",
                            label: "Vehicle Number"
                        })}

                        {renderTextField({
                            name: "driverName",
                            label: "Driver Name"
                        })}

                        {renderTextField({
                            name: "driverContact",
                            label: "Driver Contact",
                            type: "tel"
                        })}
                    </Grid>
                </Box>

                <Divider />

                {/* DATES */}

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <SectionHeader icon={<CalendarMonth />}>
                        Shipment and Delivery Dates
                    </SectionHeader>

                    <Grid container spacing={2}>
                        {renderTextField({
                            name: "shipmentDate",
                            label: "Shipment Date",
                            type: "date"
                        })}

                        {renderTextField({
                            name: "expectedDeliveryDate",
                            label: "Expected Delivery Date",
                            type: "date"
                        })}

                        {renderTextField({
                            name: "actualDeliveryDate",
                            label: "Actual Delivery Date",
                            type: "date"
                        })}
                    </Grid>
                </Box>

                <Divider />

                {/* LOCATIONS */}

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <SectionHeader icon={<LocationOn />}>
                        Shipment Locations
                    </SectionHeader>

                    <Grid container spacing={2}>
                        {renderTextField({
                            name: "origin",
                            label: "Origin"
                        })}

                        {renderTextField({
                            name: "destination",
                            label: "Destination"
                        })}
                    </Grid>
                </Box>

                <Divider />

                {/* PACKAGES */}

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <SectionHeader icon={<Inventory2 />}>
                        Package and Weight Details
                    </SectionHeader>

                    <Grid container spacing={2}>
                        {renderTextField({
                            name: "totalItems",
                            label: "Total Items",
                            type: "number",
                            min: 0
                        })}

                        {renderTextField({
                            name: "totalQuantity",
                            label: "Total Quantity",
                            type: "number",
                            min: 0
                        })}

                        {renderTextField({
                            name: "totalPackages",
                            label: "Total Packages",
                            type: "number",
                            min: 0
                        })}

                        {renderTextField({
                            name: "totalWeight",
                            label: "Total Weight",
                            type: "number",
                            min: 0
                        })}

                        {renderTextField({
                            name: "weightUnit",
                            label: "Weight Unit",
                            type: "select",
                            options: weightUnitOptions
                        })}

                        {renderTextField({
                            name: "shippingCost",
                            label: "Shipping Cost (₹)",
                            type: "number",
                            min: 0
                        })}
                    </Grid>
                </Box>

                <Divider />

                {/* NOTES */}

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Additional Notes
                    </Typography>

                    <Grid container spacing={2}>
                        {renderTextField({
                            name: "notes",
                            label: "Notes / Remarks",
                            multiline: true,
                            md: 12
                        })}
                    </Grid>
                </Box>

                <Divider />

                {/* ACTIONS */}

                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={isBusy || !showCancel}
                        sx={{
                            visibility: showCancel ? "visible" : "hidden"
                        }}
                    >
                        Cancel
                    </Button>

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                    >
                        {showReset && (
                            <Button
                                variant="outlined"
                                startIcon={<RestartAlt />}
                                onClick={handleReset}
                                disabled={isBusy}
                            >
                                Reset
                            </Button>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                isBusy
                                    ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    )
                                    : <Save />
                            }
                            disabled={isBusy}
                        >
                            {isBusy
                                ? "Saving..."
                                : submitLabel ||
                                    (isEdit
                                        ? "Update Manifest"
                                        : "Create Manifest")}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};

export default ShippingManifestForm;

