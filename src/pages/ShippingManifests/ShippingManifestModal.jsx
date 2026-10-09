import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Box,
    Divider,
    CircularProgress,
    IconButton,
    InputAdornment
} from "@mui/material";

import {
    Close,
    LocalShipping,
    Save,
    Inventory2,
    Person,
    LocationOn,
    CalendarMonth,
    ReceiptLong
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPERS
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

const toInputDate = (value) => {
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
   DEFAULT FORM VALUES
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
    totalItems: 0,
    totalQuantity: 0,
    totalPackages: 0,
    totalWeight: "",
    weightUnit: "kg",
    shippingCost: 0,
    status: "Pending",
    notes: ""
};

/* =========================================================
   FORM FIELD CONFIGURATION
========================================================= */

const sections = [
    {
        title: "Manifest Information",
        icon: <ReceiptLong />,
        fields: [
            {
                name: "manifestNumber",
                label: "Manifest Number",
                required: true
            },
            {
                name: "orderNumber",
                label: "Order Number",
                required: true
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    "Pending",
                    "Processing",
                    "Ready",
                    "Packed",
                    "Shipped",
                    "In Transit",
                    "Delivered",
                    "Cancelled"
                ],
                required: true
            }
        ]
    },
    {
        title: "Customer and Carrier",
        icon: <Person />,
        fields: [
            {
                name: "customerName",
                label: "Customer Name",
                required: true
            },
            {
                name: "carrierName",
                label: "Carrier Name"
            },
            {
                name: "trackingNumber",
                label: "Tracking Number"
            },
            {
                name: "vehicleNumber",
                label: "Vehicle Number"
            },
            {
                name: "driverName",
                label: "Driver Name"
            },
            {
                name: "driverContact",
                label: "Driver Contact",
                type: "tel"
            }
        ]
    },
    {
        title: "Shipment Dates",
        icon: <CalendarMonth />,
        fields: [
            {
                name: "shipmentDate",
                label: "Shipment Date",
                type: "date"
            },
            {
                name: "expectedDeliveryDate",
                label: "Expected Delivery Date",
                type: "date"
            },
            {
                name: "actualDeliveryDate",
                label: "Actual Delivery Date",
                type: "date"
            }
        ]
    },
    {
        title: "Shipment Locations",
        icon: <LocationOn />,
        fields: [
            {
                name: "origin",
                label: "Origin"
            },
            {
                name: "destination",
                label: "Destination"
            }
        ]
    },
    {
        title: "Package and Weight Details",
        icon: <Inventory2 />,
        fields: [
            {
                name: "totalItems",
                label: "Total Items",
                type: "number",
                min: 0
            },
            {
                name: "totalQuantity",
                label: "Total Quantity",
                type: "number",
                min: 0
            },
            {
                name: "totalPackages",
                label: "Total Packages",
                type: "number",
                min: 0
            },
            {
                name: "totalWeight",
                label: "Total Weight",
                type: "number",
                min: 0
            },
            {
                name: "weightUnit",
                label: "Weight Unit",
                type: "select",
                options: ["kg", "g", "lb", "ton"]
            },
            {
                name: "shippingCost",
                label: "Shipping Cost (₹)",
                type: "number",
                min: 0
            }
        ]
    }
];

/* =========================================================
   COMPONENT
========================================================= */

const ShippingManifestModal = ({
    open = false,
    onClose,
    onSubmit,
    onSave,
    manifest = null,
    record = null,
    initialData = null,
    loading = false,
    saving = false,
    mode,
    title
}) => {
    const selectedRecord = manifest || record || initialData;

    const isEdit = mode
        ? mode.toLowerCase() === "edit"
        : Boolean(selectedRecord);

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const isBusy = loading || saving;

    /* =====================================================
       POPULATE FORM
    ===================================================== */

    useEffect(() => {
        if (!open) return;

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
            shipmentDate: toInputDate(
                getField(
                    selectedRecord,
                    "shipmentDate",
                    "ShipmentDate"
                )
            ),
            expectedDeliveryDate: toInputDate(
                getField(
                    selectedRecord,
                    "expectedDeliveryDate",
                    "ExpectedDeliveryDate"
                )
            ),
            actualDeliveryDate: toInputDate(
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
            totalItems: getField(
                selectedRecord,
                "totalItems",
                "TotalItems"
            ) ?? 0,
            totalQuantity: getField(
                selectedRecord,
                "totalQuantity",
                "TotalQuantity"
            ) ?? 0,
            totalPackages: getField(
                selectedRecord,
                "totalPackages",
                "TotalPackages"
            ) ?? 0,
            totalWeight: getField(
                selectedRecord,
                "totalWeight",
                "TotalWeight"
            ),
            weightUnit: getField(
                selectedRecord,
                "weightUnit",
                "WeightUnit"
            ) || "kg",
            shippingCost: getField(
                selectedRecord,
                "shippingCost",
                "ShippingCost"
            ) ?? 0,
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
    }, [open, selectedRecord]);

    /* =====================================================
       HANDLE INPUT CHANGE
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
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const nextErrors = {};

        if (!String(formData.manifestNumber ?? "").trim()) {
            nextErrors.manifestNumber =
                "Manifest number is required.";
        }

        if (!String(formData.orderNumber ?? "").trim()) {
            nextErrors.orderNumber =
                "Order number is required.";
        }

        if (!String(formData.customerName ?? "").trim()) {
            nextErrors.customerName =
                "Customer name is required.";
        }

        if (!String(formData.status ?? "").trim()) {
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
                value !== null &&
                value !== undefined &&
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

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isBusy || !validateForm()) return;

        const payload = {
            ...formData,
            manifestNumber: String(formData.manifestNumber).trim(),
            orderNumber: String(formData.orderNumber).trim(),
            customerName: String(formData.customerName).trim(),
            totalItems: Number(formData.totalItems || 0),
            totalQuantity: Number(formData.totalQuantity || 0),
            totalPackages: Number(formData.totalPackages || 0),
            totalWeight:
                formData.totalWeight === ""
                    ? null
                    : Number(formData.totalWeight),
            shippingCost: Number(formData.shippingCost || 0),
            carrierName: String(formData.carrierName || "").trim(),
            trackingNumber: String(formData.trackingNumber || "").trim(),
            vehicleNumber: String(formData.vehicleNumber || "").trim(),
            driverName: String(formData.driverName || "").trim(),
            driverContact: String(formData.driverContact || "").trim(),
            origin: String(formData.origin || "").trim(),
            destination: String(formData.destination || "").trim(),
            notes: String(formData.notes || "").trim()
        };

        const submitHandler = onSubmit || onSave;

        if (typeof submitHandler === "function") {
            submitHandler(payload);
        }
    };

    /* =====================================================
       RENDER FIELD
    ===================================================== */

    const renderField = (field) => {
        const value = formData[field.name] ?? "";

        return (
            <Grid
                item
                xs={12}
                sm={6}
                md={field.name === "status" ? 6 : 4}
                key={field.name}
            >
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    name={field.name}
                    label={field.label}
                    value={value}
                    onChange={handleChange}
                    required={Boolean(field.required)}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name] || " "}
                    disabled={isBusy}
                    type={
                        field.type === "date"
                            ? "date"
                            : field.type === "number"
                                ? "number"
                                : field.type === "tel"
                                    ? "tel"
                                    : "text"
                    }
                    select={field.type === "select"}
                    InputLabelProps={
                        field.type === "date"
                            ? { shrink: true }
                            : undefined
                    }
                    inputProps={
                        field.type === "number"
                            ? {
                                min: field.min ?? 0,
                                step: "any"
                            }
                            : undefined
                    }
                >
                    {field.type === "select" &&
                        field.options.map((option) => (
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
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={isBusy ? undefined : onClose}
            fullWidth
            maxWidth="lg"
            scroll="paper"
            aria-labelledby="shipping-manifest-modal-title"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <DialogTitle
                    id="shipping-manifest-modal-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        pb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                borderRadius: 2,
                                width: 42,
                                height: 42
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
                                {isEdit
                                    ? "Update the shipment details below."
                                    : "Enter the details to create a shipping manifest."}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={onClose}
                        disabled={isBusy}
                        aria-label="Close dialog"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent
                    sx={{
                        p: { xs: 2, sm: 3 },
                        minHeight: 200
                    }}
                >
                    {loading ? (
                        <Box
                            sx={{
                                minHeight: 220,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                gap: 2
                            }}
                        >
                            <CircularProgress />

                            <Typography color="text.secondary">
                                Loading shipping manifest...
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {sections.map((section, index) => (
                                <Box
                                    key={section.title}
                                    sx={{ mb: 3 }}
                                >
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
                                                color: "primary.main",
                                                display: "flex"
                                            }}
                                        >
                                            {section.icon}
                                        </Box>

                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={700}
                                        >
                                            {section.title}
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        {section.fields.map(renderField)}
                                    </Grid>

                                    {index < sections.length - 1 && (
                                        <Divider sx={{ mt: 2.5 }} />
                                    )}
                                </Box>
                            ))}

                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                name="notes"
                                label="Notes / Remarks"
                                value={formData.notes}
                                onChange={handleChange}
                                disabled={isBusy}
                                placeholder="Enter additional shipment information..."
                            />
                        </Box>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={onClose}
                        disabled={isBusy}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            isBusy
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={isBusy}
                    >
                        {isBusy
                            ? "Saving..."
                            : isEdit
                                ? "Update Manifest"
                                : "Create Manifest"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ShippingManifestModal;

