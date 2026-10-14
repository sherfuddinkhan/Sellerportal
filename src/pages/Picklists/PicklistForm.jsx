import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import Add from "@mui/icons-material/Add";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Delete from "@mui/icons-material/Delete";
import Inventory2 from "@mui/icons-material/Inventory2";
import Save from "@mui/icons-material/Save";

const DEFAULT_DESTINATIONS = [
    "INVOICING",
    "BENGALURU",
    "CHENNAI",
    "HYDERABAD",
    "MUMBAI",
    "DELHI"
];

const createEmptyForm = () => ({
    picklistCode: "",
    destination: "BENGALURU",
    shippingPackageCodes: "",
    sellerId: "6",
    customerId: "3"
});

const getField = (object, fields, fallback = "") => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        if (
            object[field] !== undefined &&
            object[field] !== null
        ) {
            return object[field];
        }
    }

    return fallback;
};

const getPicklistCode = (picklist) =>
    getField(picklist, [
        "picklistCode",
        "PicklistCode",
        "pickListCode",
        "PickListCode"
    ]);

const getPackageCodes = (picklist) => {
    const raw = getField(picklist, [
        "shippingPackageCodes",
        "ShippingPackageCodes"
    ]);

    if (Array.isArray(raw)) {
        return raw.join("\n");
    }

    if (typeof raw !== "string" || !raw.trim()) {
        return "";
    }

    try {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
            return parsed.join("\n");
        }
    } catch {
        // A single package code may be stored as plain text.
    }

    return raw;
};

const PicklistForm = ({
    picklist = null,
    initialData = null,
    mode = "create",
    destinations = DEFAULT_DESTINATIONS,
    statuses,
    loading = false,
    error = "",
    onSubmit,
    onCancel,
    onBack,
    title,
    showPicklistNumber = true,
    showStatus = false,
    showItems = true,
    readOnly = false
}) => {
    const source = initialData || picklist;
    const normalizedMode = String(mode).toLowerCase();

    const isEditMode = normalizedMode === "edit";

    const isReadOnly =
        readOnly ||
        normalizedMode === "view" ||
        normalizedMode === "details";

    // Backward compatibility: if a parent passes statuses,
    // use them as destination options only when destinations
    // were not explicitly supplied.
    const destinationOptions =
        destinations !== DEFAULT_DESTINATIONS
            ? destinations
            : Array.isArray(statuses)
                ? statuses
                : DEFAULT_DESTINATIONS;

    const [formData, setFormData] = useState(createEmptyForm);
    const [localError, setLocalError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!source) {
            setFormData(createEmptyForm());
            setLocalError("");
            return;
        }

        setFormData({
            picklistCode: getPicklistCode(source),
            destination: getField(
                source,
                ["destination", "Destination"],
                "BENGALURU"
            ),
            shippingPackageCodes: getPackageCodes(source),
            sellerId: String(
                getField(source, ["sellerId", "SellerId"], "6")
            ),
            customerId: String(
                getField(source, ["customerId", "CustomerId"], "3")
            )
        });

        setLocalError("");
    }, [source]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setLocalError("");
    };

    const handleAddPackage = () => {
        setFormData((previous) => ({
            ...previous,
            shippingPackageCodes: previous.shippingPackageCodes
                ? `${previous.shippingPackageCodes}\n`
                : ""
        }));
    };

    const handleRemovePackage = (indexToRemove) => {
        const codes = formData.shippingPackageCodes
            .split(/[\n,;]+/)
            .map((code) => code.trim())
            .filter(Boolean);

        setFormData((previous) => ({
            ...previous,
            shippingPackageCodes: codes
                .filter((_, index) => index !== indexToRemove)
                .join("\n")
        }));
    };

    const packageCodes = formData.shippingPackageCodes
        .split(/[\n,;]+/)
        .map((code) => code.trim())
        .filter(Boolean);

    const validateForm = () => {
        if (!isEditMode && !formData.picklistCode.trim()) {
            setLocalError("Picklist code is required.");
            return false;
        }

        if (!formData.destination.trim()) {
            setLocalError("Destination is required.");
            return false;
        }

        if (
            !Number.isInteger(Number(formData.sellerId)) ||
            Number(formData.sellerId) <= 0
        ) {
            setLocalError("Enter a valid Seller ID.");
            return false;
        }

        if (
            !Number.isInteger(Number(formData.customerId)) ||
            Number(formData.customerId) <= 0
        ) {
            setLocalError("Enter a valid Customer ID.");
            return false;
        }

        if (packageCodes.length === 0) {
            setLocalError("Enter at least one shipping package code.");
            return false;
        }

        setLocalError("");
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isReadOnly || loading || submitting) {
            return;
        }

        if (typeof onSubmit !== "function") {
            setLocalError("Submit handler is not configured.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        const payload = {
            picklistCode: formData.picklistCode.trim(),
            destination: formData.destination.trim(),
            shippingPackageCodes: JSON.stringify([
                ...new Set(packageCodes)
            ]),
            sellerId: Number(formData.sellerId),
            customerId: Number(formData.customerId)
        };

        // Preserve the original picklist code during editing.
        if (isEditMode && source) {
            payload.picklistCode = getPicklistCode(source);
        }

        setSubmitting(true);
        setLocalError("");

        try {
            await onSubmit(payload, {
                mode: isEditMode ? "edit" : "create",
                id: payload.picklistCode
            });
        } catch (submitError) {
            setLocalError(
                submitError?.response?.data?.message ||
                submitError?.response?.data?.title ||
                submitError?.message ||
                "Unable to save the picklist."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const isBusy = loading || submitting;

    const formTitle =
        title ||
        (isReadOnly
            ? "Picklist Details"
            : isEditMode
                ? "Edit Picklist"
                : "Create Picklist");

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <IconButton
                        onClick={onBack || onCancel}
                        aria-label="Go back"
                        disabled={isBusy}
                    >
                        <ArrowBack />
                    </IconButton>

                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            {formTitle}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {isReadOnly
                                ? "Review picklist and package information."
                                : isEditMode
                                    ? "Update the picklist details below."
                                    : "Enter the details to create a picklist."}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            {(error || localError) && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setLocalError("")}
                >
                    {localError || error}
                </Alert>
            )}

            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2.5 }}
                    >
                        Picklist Information
                    </Typography>

                    <Grid container spacing={2.5}>
                        {showPicklistNumber && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required={!isEditMode}
                                    label="Picklist Code"
                                    name="picklistCode"
                                    value={formData.picklistCode}
                                    onChange={handleChange}
                                    disabled={
                                        isReadOnly ||
                                        isBusy ||
                                        isEditMode
                                    }
                                    placeholder="e.g. PL-TN-0003"
                                    helperText={
                                        isEditMode
                                            ? "The existing picklist code is preserved."
                                            : "Enter a unique picklist code."
                                    }
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Destination"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                disabled={isReadOnly || isBusy}
                            >
                                {destinationOptions.map((item) => {
                                    const value =
                                        typeof item === "string"
                                            ? item
                                            : item.value;

                                    const label =
                                        typeof item === "string"
                                            ? item
                                            : item.label;

                                    return (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    );
                                })}

                                {/* Preserve existing destination values */}
                                {!destinationOptions.some((item) =>
                                    (typeof item === "string"
                                        ? item
                                        : item.value) === formData.destination
                                ) && formData.destination && (
                                    <MenuItem value={formData.destination}>
                                        {formData.destination}
                                    </MenuItem>
                                )}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seller ID"
                                name="sellerId"
                                value={formData.sellerId}
                                onChange={handleChange}
                                disabled={isReadOnly || isBusy}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Customer ID"
                                name="customerId"
                                value={formData.customerId}
                                onChange={handleChange}
                                disabled={isReadOnly || isBusy}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {showItems && (
                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            justifyContent="space-between"
                            spacing={2}
                            sx={{ mb: 2.5 }}
                        >
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Shipping Packages
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Enter one package code per line.
                                </Typography>
                            </Box>

                            {!isReadOnly && (
                                <Button
                                    type="button"
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleAddPackage}
                                    disabled={isBusy}
                                >
                                    Add Package Line
                                </Button>
                            )}
                        </Stack>

                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label="Shipping Package Codes"
                            name="shippingPackageCodes"
                            value={formData.shippingPackageCodes}
                            onChange={handleChange}
                            disabled={isReadOnly || isBusy}
                            placeholder={"SP-20\nSP-21"}
                            helperText="Separate package codes with new lines, commas, or semicolons."
                        />

                        {packageCodes.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />

                                <Typography
                                    variant="subtitle2"
                                    sx={{ mb: 1 }}
                                >
                                    Package preview ({packageCodes.length})
                                </Typography>

                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    gap={1}
                                >
                                    {packageCodes.map((code, index) => (
                                        <Box
                                            key={`${code}-${index}`}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5
                                            }}
                                        >
                                            <Chip
                                                label={code}
                                                variant="outlined"
                                            />

                                            {!isReadOnly && (
                                                <IconButton
                                                    type="button"
                                                    size="small"
                                                    color="error"
                                                    aria-label={`Remove ${code}`}
                                                    onClick={() =>
                                                        handleRemovePackage(index)
                                                    }
                                                    disabled={isBusy}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                justifyContent="flex-end"
                spacing={1.5}
            >
                <Button
                    type="button"
                    variant="outlined"
                    onClick={onCancel || onBack}
                    disabled={isBusy}
                >
                    {isReadOnly ? "Back" : "Cancel"}
                </Button>

                {!isReadOnly && (
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
                            : isEditMode
                                ? "Update Picklist"
                                : "Create Picklist"}
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default PicklistForm;
