import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Box,
    IconButton,
    Divider,
    MenuItem,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";

import {
    Close,
    Inventory2,
    Save,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    manifestId: "",
    packageId: "",
    putawayLocation: "",
    quantity: "",
    status: "Pending"
};

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...fields) => {
    for (const field of fields) {
        const value = record?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   MAP RECORD TO FORM DATA
========================================================= */

const mapRecordToForm = (record) => {
    if (!record) {
        return { ...initialFormData };
    }

    return {
        manifestId: getFieldValue(
            record,
            "manifestId",
            "ManifestId"
        ),
        packageId: getFieldValue(
            record,
            "packageId",
            "PackageId"
        ),
        putawayLocation: getFieldValue(
            record,
            "putawayLocation",
            "PutawayLocation",
            "location",
            "Location",
            "binLocation",
            "BinLocation"
        ),
        quantity: getFieldValue(
            record,
            "quantity",
            "Quantity",
            "packageQuantity",
            "PackageQuantity"
        ),
        status: getFieldValue(
            record,
            "status",
            "Status",
            "putawayStatus",
            "PutawayStatus"
        ) || "Pending"
    };
};

/* =========================================================
   MANIFEST PACKAGES PUTAWAY MODAL
========================================================= */

const ManifestPackagesPutawayModal = ({
    open = false,
    onClose,
    onSubmit,

    record = null,
    mode = "create",

    loading = false,
    error = "",

    title,

    statusOptions = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled"
    ]
}) => {
    /* -----------------------------------------------------
       FORM STATE
    ----------------------------------------------------- */

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [formErrors, setFormErrors] = useState({});

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isCreateMode = mode === "create";

    /* -----------------------------------------------------
       INITIALIZE FORM
    ----------------------------------------------------- */

    useEffect(() => {
        if (open) {
            setFormData(mapRecordToForm(record));
            setFormErrors({});
        }
    }, [open, record]);

    /* -----------------------------------------------------
       HANDLE FIELD CHANGE
    ----------------------------------------------------- */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    /* -----------------------------------------------------
       RESET FORM
    ----------------------------------------------------- */

    const handleReset = () => {
        setFormData(
            isEditMode
                ? mapRecordToForm(record)
                : { ...initialFormData }
        );

        setFormErrors({});
    };

    /* -----------------------------------------------------
       VALIDATE FORM
    ----------------------------------------------------- */

    const validateForm = () => {
        const errors = {};

        if (
            formData.manifestId === "" ||
            formData.manifestId === null
        ) {
            errors.manifestId = "Manifest ID is required.";
        }

        if (
            formData.packageId === "" ||
            formData.packageId === null
        ) {
            errors.packageId = "Package ID is required.";
        }

        if (!String(formData.putawayLocation).trim()) {
            errors.putawayLocation =
                "Putaway location is required.";
        }

        if (
            formData.quantity === "" ||
            formData.quantity === null
        ) {
            errors.quantity = "Quantity is required.";
        } else if (
            !Number.isFinite(Number(formData.quantity)) ||
            Number(formData.quantity) <= 0
        ) {
            errors.quantity =
                "Quantity must be greater than zero.";
        }

        if (!String(formData.status).trim()) {
            errors.status = "Status is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* -----------------------------------------------------
       HANDLE SUBMIT
    ----------------------------------------------------- */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isViewMode || loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const payload = {
            manifestId: formData.manifestId,
            packageId: formData.packageId,
            putawayLocation: String(
                formData.putawayLocation
            ).trim(),
            quantity: Number(formData.quantity),
            status: formData.status
        };

        if (typeof onSubmit === "function") {
            onSubmit(payload, record);
        }
    };

    /* -----------------------------------------------------
       MODAL TITLE
    ----------------------------------------------------- */

    const modalTitle =
        title ||
        (
            isViewMode
                ? "View Putaway Record"
                : isEditMode
                    ? "Edit Putaway Record"
                    : "Create Putaway Record"
        );

    /* -----------------------------------------------------
       RECORD ID
    ----------------------------------------------------- */

    const recordId = getFieldValue(
        record,
        "manifestPackagesPutawayId",
        "ManifestPackagesPutawayId",
        "manifestPackagePutawayId",
        "ManifestPackagePutawayId",
        "id",
        "Id"
    );

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            aria-labelledby="manifest-putaway-modal-title"
        >
            {/* MODAL TITLE */}

            <DialogTitle
                id="manifest-putaway-modal-title"
                sx={{ pb: 2 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 42,
                            height: 42,
                            borderRadius: 2,
                            bgcolor: "primary.light",
                            color: "primary.dark"
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {modalTitle}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {isViewMode
                                ? "Review manifest package putaway details."
                                : isEditMode
                                    ? "Update the existing putaway record."
                                    : "Enter details to create a putaway record."}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close modal"
                    >
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider />

            {/* MODAL CONTENT */}

            <DialogContent sx={{ py: 3 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {isEditMode && recordId !== "" && (
                    <Alert
                        severity="info"
                        sx={{ mb: 3 }}
                    >
                        Editing putaway record ID: {recordId}
                    </Alert>
                )}

                <Box
                    component="form"
                    id="manifest-putaway-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Grid container spacing={2.5}>
                        {/* MANIFEST ID */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Manifest ID"
                                name="manifestId"
                                type="number"
                                value={formData.manifestId}
                                onChange={handleChange}
                                error={Boolean(formErrors.manifestId)}
                                helperText={formErrors.manifestId}
                                disabled={loading || isViewMode}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        {/* PACKAGE ID */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Package ID"
                                name="packageId"
                                type="number"
                                value={formData.packageId}
                                onChange={handleChange}
                                error={Boolean(formErrors.packageId)}
                                helperText={formErrors.packageId}
                                disabled={loading || isViewMode}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        {/* PUTAWAY LOCATION */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Putaway Location"
                                name="putawayLocation"
                                placeholder="Enter bin or storage location"
                                value={formData.putawayLocation}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.putawayLocation
                                )}
                                helperText={
                                    formErrors.putawayLocation ||
                                    "Specify the destination storage location."
                                }
                                disabled={loading || isViewMode}
                            />
                        </Grid>

                        {/* QUANTITY */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                error={Boolean(formErrors.quantity)}
                                helperText={formErrors.quantity}
                                disabled={loading || isViewMode}
                                inputProps={{
                                    min: 0,
                                    step: "any"
                                }}
                            />
                        </Grid>

                        {/* STATUS */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                select
                                label="Putaway Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                error={Boolean(formErrors.status)}
                                helperText={formErrors.status}
                                disabled={loading || isViewMode}
                            >
                                {statusOptions.map((status) => (
                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* VIEW MODE INFORMATION */}

                        {isViewMode && (
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    This record is read-only.
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </DialogContent>

            <Divider />

            {/* MODAL ACTIONS */}

            <DialogActions
                sx={{
                    p: 2.5,
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >
                {!isViewMode && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>
                )}

                <Box sx={{ flex: 1 }} />

                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                >
                    {isViewMode ? "Close" : "Cancel"}
                </Button>

                {!isViewMode && (
                    <Button
                        type="submit"
                        form="manifest-putaway-form"
                        variant="contained"
                        startIcon={
                            loading
                                ? <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEditMode
                                ? "Update Record"
                                : "Create Record"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ManifestPackagesPutawayModal;

