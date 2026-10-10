// =========================================================
// ExportJobView.jsx
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    FileDownload,
    CalendarMonth,
    Inventory2
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/ExportJobs";

// =========================================================
// FIELD HELPER
// =========================================================

const getField = (data, ...fields) => {
    for (const field of fields) {
        if (data?.[field] !== undefined && data?.[field] !== null) {
            return data[field];
        }
    }

    return null;
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

// =========================================================
// FORMAT VALUE
// =========================================================

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};

// =========================================================
// STATUS CHIP
// =========================================================

const ExportJobStatus = ({ status }) => {
    const normalizedStatus = String(status ?? "Unknown")
        .trim()
        .toLowerCase();

    let color = "default";

    if (
        ["completed", "success", "successful", "done"].includes(
            normalizedStatus
        )
    ) {
        color = "success";
    } else if (
        ["pending", "queued", "scheduled"].includes(
            normalizedStatus
        )
    ) {
        color = "warning";
    } else if (
        ["failed", "error", "cancelled", "canceled"].includes(
            normalizedStatus
        )
    ) {
        color = "error";
    } else if (
        ["processing", "in progress", "running"].includes(
            normalizedStatus
        )
    ) {
        color = "info";
    }

    return (
        <Chip
            label={formatValue(status)}
            color={color}
            size="small"
            variant="outlined"
        />
    );
};

// =========================================================
// DETAIL ITEM
// =========================================================

const DetailItem = ({
    label,
    value,
    date = false
}) => (
    <Box sx={{ minWidth: 0 }}>
        <Typography
            variant="caption"
            color="text.secondary"
            sx={{
                display: "block",
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: 0.5
            }}
        >
            {label}
        </Typography>

        <Typography
            variant="body1"
            fontWeight={500}
            sx={{ overflowWrap: "anywhere" }}
        >
            {date ? formatDate(value) : formatValue(value)}
        </Typography>
    </Box>
);

// =========================================================
// EXPORT JOB VIEW
// =========================================================

const ExportJobView = ({
    jobId,
    job: initialJob = null,
    onEdit,
    onClose,
    onBack,
    apiUrl = API_URL
}) => {

    // =====================================================
    // STATE
    // =====================================================

    const [job, setJob] = useState(initialJob);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // GET JOB ID
    // =====================================================

    const resolvedJobId =
        jobId ??
        getField(
            initialJob,
            "exportJobId",
            "ExportJobId",
            "jobId",
            "JobId",
            "id",
            "Id"
        );

    // =====================================================
    // FETCH EXPORT JOB
    // =====================================================

    const fetchJob = async () => {
        if (resolvedJobId === null || resolvedJobId === undefined) {
            setError("Export Job ID is required.");
            setJob(null);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(resolvedJobId)}`
            );

            const responseData = response.data;

            const fetchedJob =
                responseData?.data ??
                responseData?.job ??
                responseData?.Job ??
                responseData;

            if (
                !fetchedJob ||
                typeof fetchedJob !== "object" ||
                Array.isArray(fetchedJob)
            ) {
                throw new Error(
                    "The API returned an invalid export job response."
                );
            }

            setJob(fetchedJob);

        } catch (err) {
            console.error(
                "GET EXPORT JOB ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load export job."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD JOB
    // =====================================================

    useEffect(() => {
        if (initialJob && resolvedJobId == null) {
            setJob(initialJob);
            return;
        }

        fetchJob();

        // Fetch again when the requested job ID changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resolvedJobId, apiUrl]);

    // =====================================================
    // ACTION HANDLERS
    // =====================================================

    const handleClose = () => {
        const callback = onClose || onBack;

        if (typeof callback === "function") {
            callback();
        }
    };

    const handleEdit = () => {
        if (typeof onEdit === "function" && job) {
            onEdit(job);
        }
    };

    // =====================================================
    // EXTRACT JOB FIELDS
    // =====================================================

    const jobNumber = getField(
        job,
        "exportJobNumber",
        "ExportJobNumber",
        "jobNumber",
        "JobNumber"
    );

    const status = getField(
        job,
        "status",
        "Status",
        "jobStatus",
        "JobStatus"
    );

    const exportType = getField(
        job,
        "exportType",
        "ExportType",
        "type",
        "Type"
    );

    const fileName = getField(
        job,
        "fileName",
        "FileName",
        "exportFileName",
        "ExportFileName"
    );

    const format = getField(
        job,
        "fileFormat",
        "FileFormat",
        "format",
        "Format"
    );

    const createdAt = getField(
        job,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getField(
        job,
        "updatedAt",
        "UpdatedAt",
        "modifiedDate",
        "ModifiedDate"
    );

    const startedAt = getField(
        job,
        "startedAt",
        "StartedAt",
        "startDate",
        "StartDate"
    );

    const completedAt = getField(
        job,
        "completedAt",
        "CompletedAt",
        "completedDate",
        "CompletedDate"
    );

    const description = getField(
        job,
        "description",
        "Description",
        "remarks",
        "Remarks"
    );

    const requestedBy = getField(
        job,
        "requestedBy",
        "RequestedBy",
        "createdBy",
        "CreatedBy"
    );

    const totalRecords = getField(
        job,
        "totalRecords",
        "TotalRecords",
        "recordCount",
        "RecordCount"
    );

    const downloadUrl = getField(
        job,
        "downloadUrl",
        "DownloadUrl",
        "fileUrl",
        "FileUrl"
    );

    const errorMessage = getField(
        job,
        "errorMessage",
        "ErrorMessage",
        "failureReason",
        "FailureReason"
    );

    // =====================================================
    // LOADING VIEW
    // =====================================================

    if (loading && !job) {
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

    // =====================================================
    // ERROR VIEW
    // =====================================================

    if (error && !job) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchJob}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={handleClose}
                >
                    Back
                </Button>
            </Box>
        );
    }

    // =====================================================
    // EMPTY VIEW
    // =====================================================

    if (!job) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    No export job details are available.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={handleClose}
                >
                    Back
                </Button>
            </Box>
        );
    }

    // =====================================================
    // MAIN VIEW
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>

            {/* ============================================= */}
            {/* TOOLBAR */}
            {/* ============================================= */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3 }}
            >
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
                        sx={{ mt: 0.5 }}
                    >
                        View export job information and processing status.
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleClose}
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={
                            loading
                                ? <CircularProgress size={16} />
                                : <Refresh />
                        }
                        onClick={fetchJob}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    {typeof onEdit === "function" && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    )}
                </Stack>
            </Stack>

            {/* ============================================= */}
            {/* ERROR / REFRESH STATUS */}
            {/* ============================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* ============================================= */}
            {/* JOB SUMMARY */}
            {/* ============================================= */}

            <Card
                variant="outlined"
                sx={{ mb: 3, borderRadius: 2 }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "action.hover"
                                }}
                            >
                                <FileDownload color="primary" />
                            </Box>

                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {formatValue(jobNumber ?? resolvedJobId)}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Export Job ID:{" "}
                                    {formatValue(
                                        getField(
                                            job,
                                            "exportJobId",
                                            "ExportJobId",
                                            "jobId",
                                            "JobId",
                                            "id",
                                            "Id"
                                        ) ?? resolvedJobId
                                    )}
                                </Typography>
                            </Box>
                        </Stack>

                        <ExportJobStatus status={status} />
                    </Stack>
                </CardContent>
            </Card>

            {/* ============================================= */}
            {/* GENERAL INFORMATION */}
            {/* ============================================= */}

            <Card
                variant="outlined"
                sx={{ mb: 3, borderRadius: 2 }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Inventory2 color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            General Information
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <DetailItem
                                label="Job Number"
                                value={jobNumber}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailItem
                                label="Export Type"
                                value={exportType}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailItem
                                label="Status"
                                value={status}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailItem
                                label="File Name"
                                value={fileName}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailItem
                                label="File Format"
                                value={format}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailItem
                                label="Total Records"
                                value={totalRecords}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <DetailItem
                                label="Requested By"
                                value={requestedBy}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DetailItem
                                label="Description"
                                value={description}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ============================================= */}
            {/* TIMESTAMPS */}
            {/* ============================================= */}

            <Card
                variant="outlined"
                sx={{ mb: 3, borderRadius: 2 }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <CalendarMonth color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Job Timeline
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <DetailItem
                                label="Created At"
                                value={createdAt}
                                date
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <DetailItem
                                label="Started At"
                                value={startedAt}
                                date
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <DetailItem
                                label="Completed At"
                                value={completedAt}
                                date
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <DetailItem
                                label="Last Updated"
                                value={updatedAt}
                                date
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ============================================= */}
            {/* FAILURE DETAILS */}
            {/* ============================================= */}

            {errorMessage && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                    >
                        Export Error
                    </Typography>

                    {formatValue(errorMessage)}
                </Alert>
            )}

            {/* ============================================= */}
            {/* DOWNLOAD */}
            {/* ============================================= */}

            {downloadUrl && (
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<FileDownload />}
                        onClick={() => {
                            window.open(
                                downloadUrl,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        }}
                    >
                        Download Export File
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ExportJobView;

