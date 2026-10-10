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
    Divider,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    Download,
    Description,
    CalendarMonth,
    CheckCircle,
    PendingActions
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

// Replace with your actual backend endpoint.
const API_BASE_URL = "https://localhost:7000/api/ExportJobs";

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

/* =========================================================
   FORMAT VALUE
========================================================= */

const formatValue = (value) => {

    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return String(value);
};

/* =========================================================
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    switch (String(status || "").toLowerCase()) {

        case "completed":
        case "success":
            return "success";

        case "failed":
        case "error":
            return "error";

        case "processing":
        case "in progress":
            return "info";

        case "pending":
        case "queued":
            return "warning";

        default:
            return "default";
    }
};

/* =========================================================
   GET STATUS ICON
========================================================= */

const getStatusIcon = (status) => {

    switch (String(status || "").toLowerCase()) {

        case "completed":
        case "success":
            return <CheckCircle fontSize="small" />;

        case "failed":
        case "error":
            return <ErrorOutline fontSize="small" />;

        case "pending":
        case "queued":
        case "processing":
        case "in progress":
            return <PendingActions fontSize="small" />;

        default:
            return <WorkOutline fontSize="small" />;
    }
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value,
    icon: Icon
}) => (

    <Box sx={{ minWidth: 0 }}>

        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1 }}
        >

            {Icon && (
                <Icon
                    fontSize="small"
                    color="action"
                />
            )}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                {label}
            </Typography>

        </Stack>

        <Typography
            variant="body1"
            fontWeight={500}
            sx={{
                overflowWrap: "anywhere"
            }}
        >
            {formatValue(value)}
        </Typography>

    </Box>
);

/* =========================================================
   EXPORT JOBS DETAILS
========================================================= */

const ExportJobsDetails = ({
    exportJobId,
    exportJob: initialExportJob = null,
    apiBaseUrl = API_BASE_URL,
    onBack,
    onEdit,
    onDownload
}) => {

    /* =====================================================
       STATE
    ===================================================== */

    const [exportJob, setExportJob] = useState(
        initialExportJob
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       API ERROR MESSAGE
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

        if (err?.response?.status === 404) {
            return "Export job not found.";
        }

        if (err?.response?.status === 401) {
            return "You are not authorized to view this export job.";
        }

        if (err?.response?.status === 403) {
            return "You do not have permission to view this export job.";
        }

        if (!err?.response) {
            return "Unable to connect to the server.";
        }

        return "Failed to load export job details.";
    };

    /* =====================================================
       FETCH EXPORT JOB DETAILS
    ===================================================== */

    const fetchExportJobDetails = async () => {

        if (!exportJobId) {
            setError("Export job ID is required.");
            setExportJob(null);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${apiBaseUrl}/${encodeURIComponent(exportJobId)}`
            );

            const job = response.data?.data ?? response.data;

            if (!job || typeof job !== "object") {
                throw new Error("Invalid export job response.");
            }

            setExportJob(job);

        } catch (err) {

            setError(getApiErrorMessage(err));

        } finally {

            setLoading(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        let active = true;

        const loadDetails = async () => {

            if (!exportJobId) {
                setExportJob(null);
                setError("Export job ID is required.");
                return;
            }

            try {

                setLoading(true);
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

                setExportJob(job);

            } catch (err) {

                if (active) {
                    setError(getApiErrorMessage(err));
                    setExportJob(null);
                }

            } finally {

                if (active) {
                    setLoading(false);
                }
            }
        };

        loadDetails();

        return () => {
            active = false;
        };

    }, [exportJobId, apiBaseUrl]);

    /* =====================================================
       RENDER LOADING
    ===================================================== */

    if (loading && !exportJob) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    /* =====================================================
       RENDER ERROR
    ===================================================== */

    if (error && !exportJob) {

        return (
            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2 }}
            >

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={fetchExportJobDetails}
                        disabled={loading}
                    >
                        Retry
                    </Button>

                </Stack>

            </Paper>
        );
    }

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!exportJob) {
        return (
            <Alert severity="info">
                No export job details available.
            </Alert>
        );
    }

    /* =====================================================
       EXTRACT DISPLAY VALUES
    ===================================================== */

    const status = exportJob.status ?? exportJob.jobStatus;

    const jobId =
        exportJob.id ??
        exportJob.exportJobId ??
        exportJob.jobId;

    const jobName =
        exportJob.jobName ??
        exportJob.name;

    const exportType =
        exportJob.exportType ??
        exportJob.type;

    const fileName =
        exportJob.fileName ??
        exportJob.outputFileName;

    const createdAt =
        exportJob.createdAt ??
        exportJob.createdDate;

    const updatedAt =
        exportJob.updatedAt ??
        exportJob.modifiedDate;

    const completedAt =
        exportJob.completedAt ??
        exportJob.completedDate;

    const downloadUrl =
        exportJob.downloadUrl ??
        exportJob.fileUrl;

    /* =====================================================
       RENDER DETAILS
    ===================================================== */

    return (

        <Box sx={{ width: "100%" }}>

            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >

                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={onBack}
                        sx={{ minWidth: 42 }}
                    >
                        <ArrowBack />
                    </Button>

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Export Job Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View export job information and status.
                        </Typography>

                    </Box>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                >

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchExportJobDetails}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    {onEdit && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => onEdit(exportJob)}
                        >
                            Edit
                        </Button>
                    )}

                    {onDownload && (
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => onDownload(exportJob)}
                            disabled={
                                String(status || "").toLowerCase() !== "completed"
                            }
                        >
                            Download
                        </Button>
                    )}

                    {!onDownload && downloadUrl && (
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            component="a"
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            disabled={
                                String(status || "").toLowerCase() !== "completed"
                            }
                        >
                            Download
                        </Button>
                    )}

                </Stack>

            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* STATUS CARD */}

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2
                }}
            >

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >

                    <Box>

                        <Typography
                            variant="overline"
                            color="text.secondary"
                        >
                            Export Job
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            {formatValue(jobName)}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Job ID: {formatValue(jobId)}
                        </Typography>

                    </Box>

                    <Chip
                        icon={getStatusIcon(status)}
                        label={formatValue(status || "Unknown")}
                        color={getStatusColor(status)}
                        variant="outlined"
                    />

                </Stack>

            </Paper>

            {/* GENERAL INFORMATION */}

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2.5 }}
                >
                    General Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Job ID"
                            value={jobId}
                            icon={WorkOutline}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Job Name"
                            value={jobName}
                            icon={Description}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Export Type"
                            value={exportType}
                            icon={WorkOutline}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Export Format"
                            value={exportJob.format ?? exportJob.fileFormat}
                            icon={Description}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="File Name"
                            value={fileName}
                            icon={Description}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Record Count"
                            value={
                                exportJob.recordCount ??
                                exportJob.totalRecords
                            }
                            icon={WorkOutline}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DetailItem
                            label="Description"
                            value={exportJob.description}
                            icon={Description}
                        />
                    </Grid>

                </Grid>

            </Paper>

            {/* TIMESTAMPS */}

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2.5 }}
                >
                    Job Timeline
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Created At"
                            value={formatDate(createdAt)}
                            icon={CalendarMonth}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Last Updated"
                            value={formatDate(updatedAt)}
                            icon={CalendarMonth}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                            label="Completed At"
                            value={formatDate(completedAt)}
                            icon={CheckCircle}
                        />
                    </Grid>

                </Grid>

            </Paper>

            {/* ERROR DETAILS */}

            {(exportJob.errorMessage || exportJob.failureReason) && (

                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        borderColor: "error.light"
                    }}
                >

                    <Typography
                        variant="h6"
                        color="error"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Error Details
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Alert severity="error">
                        {exportJob.errorMessage || exportJob.failureReason}
                    </Alert>

                </Paper>
            )}

        </Box>
    );
};

export default ExportJobsDetails;

