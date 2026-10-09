import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Divider,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Save,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    jobName: "",
    exportType: "",
    format: "CSV",
    description: ""
};

/* =========================================================
   EXPORT JOBS FORM
========================================================= */

const ExportJobsForm = ({
    mode = "create",
    initialData = null,
    loading = false,
    error = "",
    onSubmit,
    onCancel
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    const isEditMode = mode === "edit";

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {

        if (initialData && isEditMode) {

            setFormData({
                ...initialFormData,
                ...initialData
            });

        } else {

            setFormData(initialFormData);

        }

        setFormErrors({});

    }, [initialData, mode]);

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
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const payload = {
            ...formData,
            jobName: String(formData.jobName).trim(),
            exportType: String(formData.exportType).trim(),
            format: String(formData.format).trim(),
            description: String(formData.description || "").trim()
        };

        if (typeof onSubmit === "function") {
            await onSubmit(payload);
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {

        if (loading) {
            return;
        }

        setFormData(
            isEditMode && initialData
                ? {
                    ...initialFormData,
                    ...initialData
                }
                : initialFormData
        );

        setFormErrors({});
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
                width: "100%"
            }}
        >

            {/* =================================================
                FORM HEADER
            ================================================= */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    {isEditMode
                        ? "Edit Export Job"
                        : "Create Export Job"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    {isEditMode
                        ? "Update the export job details below."
                        : "Enter the details to create a new export job."}
                </Typography>

            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {/* =================================================
                FORM FIELDS
            ================================================= */}

            <Grid container spacing={2.5}>

                {/* JOB NAME */}

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Job Name"
                        name="jobName"
                        value={formData.jobName ?? ""}
                        onChange={handleChange}
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                        error={Boolean(formErrors.format)}
                        helperText={formErrors.format}
                    >
                        <MenuItem value="CSV">
                            CSV
                        </MenuItem>

                        <MenuItem value="Excel">
                            Excel
                        </MenuItem>

                        <MenuItem value="JSON">
                            JSON
                        </MenuItem>

                        <MenuItem value="XML">
                            XML
                        </MenuItem>

                        <MenuItem value="PDF">
                            PDF
                        </MenuItem>
                    </TextField>
                </Grid>

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
                        disabled={loading}
                        placeholder="Enter description (optional)"
                    />
                </Grid>

            </Grid>

            {/* =================================================
                FORM ACTIONS
            ================================================= */}

            <Divider sx={{ mt: 3, mb: 2 }} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    flexWrap: "wrap"
                }}
            >

                <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    disabled={loading}
                >
                    Reset
                </Button>

                <Button
                    type="button"
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                        loading
                            ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            )
                            : <Save />
                    }
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : isEditMode
                            ? "Update Export Job"
                            : "Create Export Job"}
                </Button>

            </Box>

        </Box>
    );
};

export default ExportJobsForm;

