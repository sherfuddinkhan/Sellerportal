import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    MenuItem,
    Chip
} from "@mui/material";

import {
    Close,
    Save,
    Edit,
    Visibility,
    Add
} from "@mui/icons-material";

/* =========================================================
   EXPORT JOBS MODAL
========================================================= */

const ExportJobsModal = ({
    open = false,
    mode = "create",
    exportJob = null,
    loading = false,
    error = "",
    onClose,
    onSave
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const initialFormData = {
        id: "",
        jobName: "",
        exportType: "",
        format: "CSV",
        status: "Pending",
        description: ""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {

        if (exportJob && (mode === "view" || mode === "edit")) {

            setFormData({
                ...initialFormData,
                ...exportJob
            });

        } else {

            setFormData(initialFormData);

        }

        setFormErrors({});

    }, [exportJob, mode, open]);

    /* =====================================================
       MODAL CONFIGURATION
    ===================================================== */

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";

    const modalTitle = isViewMode
        ? "View Export Job"
        : isEditMode
            ? "Edit Export Job"
            : "Create Export Job";

    const ModalIcon = isViewMode
        ? Visibility
        : isEditMode
            ? Edit
            : Add;

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

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

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        const errors = {};

        if (!String(formData.jobName || "").trim()) {
            errors.jobName = "Job name is required";
        }

        if (!String(formData.exportType || "").trim()) {
            errors.exportType = "Export type is required";
        }

        if (!String(formData.format || "").trim()) {
            errors.format = "Export format is required";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       HANDLE SAVE
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (isViewMode || loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (typeof onSave === "function") {
            await onSave({
                ...formData,
                jobName: String(formData.jobName).trim(),
                exportType: String(formData.exportType).trim()
            });
        }
    };

    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {

        if (loading) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       STATUS COLOR
    ===================================================== */

    const getStatusColor = (status) => {

        switch (String(status || "").toLowerCase()) {

            case "completed":
                return "success";

            case "failed":
                return "error";

            case "processing":
                return "info";

            case "pending":
                return "warning";

            default:
                return "default";
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            scroll="paper"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >

                    <ModalIcon color="primary" />

                    <Typography variant="h6" fontWeight={600}>
                        {modalTitle}
                    </Typography>

                </Box>

                <Button
                    onClick={handleClose}
                    disabled={loading}
                    color="inherit"
                    size="small"
                    sx={{ minWidth: 36 }}
                >
                    <Close />
                </Button>

            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >

                <DialogContent
                    sx={{ py: 3 }}
                >

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    {isViewMode && (
                        <Alert
                            severity="info"
                            sx={{ mb: 2 }}
                        >
                            You are viewing export job details.
                        </Alert>
                    )}

                    <Grid container spacing={2.5}>

                        {/* JOB ID */}

                        {formData.id !== "" && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Job ID"
                                    value={formData.id ?? ""}
                                    disabled
                                />
                            </Grid>
                        )}

                        {/* JOB NAME */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Job Name"
                                name="jobName"
                                value={formData.jobName ?? ""}
                                onChange={handleChange}
                                disabled={isViewMode || loading}
                                error={Boolean(formErrors.jobName)}
                                helperText={formErrors.jobName}
                                placeholder="Enter export job name"
                            />
                        </Grid>

                        {/* EXPORT TYPE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                select
                                label="Export Type"
                                name="exportType"
                                value={formData.exportType ?? ""}
                                onChange={handleChange}
                                disabled={isViewMode || loading}
                                error={Boolean(formErrors.exportType)}
                                helperText={formErrors.exportType}
                            >
                                <MenuItem value="Products">
                                    Products
                                </MenuItem>

                                <MenuItem value="Orders">
                                    Orders
                                </MenuItem>

                                <MenuItem value="Customers">
                                    Customers
                                </MenuItem>

                                <MenuItem value="Inventory">
                                    Inventory
                                </MenuItem>

                                <MenuItem value="Sales">
                                    Sales
                                </MenuItem>
                            </TextField>
                        </Grid>

                        {/* EXPORT FORMAT */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                select
                                label="Export Format"
                                name="format"
                                value={formData.format ?? "CSV"}
                                onChange={handleChange}
                                disabled={isViewMode || loading}
                                error={Boolean(formErrors.format)}
                                helperText={formErrors.format}
                            >
                                <MenuItem value="CSV">CSV</MenuItem>
                                <MenuItem value="Excel">Excel</MenuItem>
                                <MenuItem value="JSON">JSON</MenuItem>
                                <MenuItem value="XML">XML</MenuItem>
                                <MenuItem value="PDF">PDF</MenuItem>
                            </TextField>
                        </Grid>

                        {/* STATUS */}

                        {isViewMode && (
                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Status
                                    </Typography>

                                    <Chip
                                        label={formData.status || "Unknown"}
                                        color={getStatusColor(formData.status)}
                                        size="small"
                                    />
                                </Box>
                            </Grid>
                        )}

                        {/* DESCRIPTION */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Description"
                                name="description"
                                value={formData.description ?? ""}
                                onChange={handleChange}
                                disabled={isViewMode || loading}
                                placeholder="Enter description (optional)"
                            />
                        </Grid>

                    </Grid>

                </DialogContent>

                <Divider />

                {/* =================================================
                    ACTIONS
                ================================================= */}

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
                        onClick={handleClose}
                        disabled={loading}
                    >
                        {isViewMode ? "Close" : "Cancel"}
                    </Button>

                    {!isViewMode && (
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                loading
                                    ? <CircularProgress size={16} color="inherit" />
                                    : <Save />
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update"
                                    : "Create"}
                        </Button>
                    )}

                </DialogActions>

            </Box>

        </Dialog>
    );
};

export default ExportJobsModal;

