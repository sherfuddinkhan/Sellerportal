import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Grid,
    Typography,
    TextField,
    MenuItem,
    Button,
    Divider,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

// Replace with your actual backend API URL.
const API_BASE_URL = "https://localhost:7000/api/ExportJobs";

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
   EXPORT JOBS EDIT
========================================================= */

const ExportJobsEdit = ({
    exportJobId,
    exportJob: initialExportJob = null,
    onSuccess,
    onCancel,
    apiBaseUrl = API_BASE_URL
}) => {

    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] = useState(initialFormData);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    /* =====================================================
       GET API ERROR MESSAGE
    ===================================================== */

    const getApiErrorMessage = (err) => {

        const data = err?.response?.data;

        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.title) {
            return data.title;
        }

        if (data?.errors) {
            return Object.values(data.errors)
                .flat()
                .join(" ");
        }

        if (err?.response?.status === 404) {
            return "Export job not found.";
        }

        if (err?.response?.status === 400) {
            return "Invalid export job details. Please check your inputs.";
        }

        if (err?.response?.status === 401) {
            return "You are not authorized to perform this action.";
        }

        if (err?.response?.status === 403) {
            return "You do not have permission to update this export job.";
        }

        if (!err?.response) {
            return "Unable to connect to the server. Please check the API URL and network.";
        }

        return "Failed to process the export job request.";
    };

    /* =====================================================
       MAP API RESPONSE
    ===================================================== */

    const mapExportJobToForm = (job) => ({
        jobName: job?.jobName ?? "",
        exportType: job?.exportType ?? "",
        format: job?.format ?? "CSV",
        description: job?.description ?? ""
    });

    /* =====================================================
       FETCH EXPORT JOB
    ===================================================== */

    useEffect(() => {

        let active = true;

        const fetchExportJob = async () => {

            if (!exportJobId) {

                if (active) {
                    setError("Export job ID is required.");
                }

                return;
            }

            if (initialExportJob) {

                if (active) {
                    setFormData(
                        mapExportJobToForm(initialExportJob)
                    );
                    setError("");
                }

                return;
            }

            try {

                setFetching(true);
                setError("");

                const response = await axios.get(
                    `${apiBaseUrl}/${encodeURIComponent(exportJobId)}`
                );

                if (!active) {
                    return;
                }

                const job = response.data?.data ?? response.data;

                if (!job || typeof job !== "object") {
                    throw new Error("Invalid export job response.");
                }

                setFormData(mapExportJobToForm(job));

            } catch (err) {

                if (active) {
                    setError(getApiErrorMessage(err));
                }

            } finally {

                if (active) {
                    setFetching(false);
                }
            }
        };

        fetchExportJob();

        return () => {
            active = false;
        };

    }, [exportJobId, initialExportJob, apiBaseUrl]);

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

        setError("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        const errors = {};

        if (!String(formData.jobName || "").trim()) {
            errors.jobName = "Job name is required.";
        }

        if (!String(formData.exportType || "").trim()) {
            errors.exportType = "Export type is required.";
        }

        if (!String(formData.format || "").trim()) {
            errors.format = "Export format is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       UPDATE EXPORT JOB
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (loading || fetching) {
            return;
        }

        if (!exportJobId) {
            setError("Export job ID is required.");
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

        try {

            setLoading(true);
            setError("");

            const response = await axios.put(
                `${apiBaseUrl}/${encodeURIComponent(exportJobId)}`,
                payload
            );

            setSuccess(true);

            if (typeof onSuccess === "function") {
                onSuccess(response.data);
            }

        } catch (err) {

            setError(getApiErrorMessage(err));

        } finally {

            setLoading(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    if (fetching) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 250
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                width: "100%",
                p: { xs: 2, sm: 3 },
                borderRadius: 2
            }}
        >

            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2
                }}
            >

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Edit Export Job
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update the export job information.
                    </Typography>
                </Box>

                {onCancel && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Back
                    </Button>
                )}

            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {/* FORM */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >

                <Grid container spacing={2.5}>

                    {/* JOB NAME */}

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="Job Name"
                            name="jobName"
                            value={formData.jobName}
                            onChange={handleChange}
                            disabled={loading}
                            error={Boolean(formErrors.jobName)}
                            helperText={formErrors.jobName}
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
                            value={formData.exportType}
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

                    {/* FORMAT */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            select
                            label="Export Format"
                            name="format"
                            value={formData.format}
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
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>

                </Grid>

                <Divider sx={{ mt: 3, mb: 2 }} />

                {/* ACTIONS */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5
                    }}
                >

                    <Button
                        variant="outlined"
                        color="inherit"
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
                        disabled={loading || fetching}
                    >
                        {loading ? "Updating..." : "Update Export Job"}
                    </Button>

                </Box>

            </Box>

            {/* SUCCESS MESSAGE */}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccess(false)}
                >
                    Export job updated successfully.
                </Alert>
            </Snackbar>

        </Paper>
    );
};

export default ExportJobsEdit;

