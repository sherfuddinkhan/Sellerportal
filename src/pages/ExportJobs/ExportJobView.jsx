import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

const API_URL = "http://localhost:5000/api/export-jobs";

const getField = (data, ...fields) => {
  for (const field of fields) {
    if (
      data?.[field] !== undefined &&
      data?.[field] !== null &&
      data?.[field] !== ""
    ) {
      return data[field];
    }
  }

  return null;
};

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

const ExportJobStatus = ({ status }) => {
  const normalized = String(status ?? "Unknown")
    .trim()
    .toLowerCase();

  let color = "default";

  if (
    ["completed", "success", "successful", "done", "active"].includes(
      normalized
    )
  ) {
    color = "success";
  } else if (
    ["pending", "queued", "scheduled"].includes(normalized)
  ) {
    color = "warning";
  } else if (
    ["failed", "error", "cancelled", "canceled", "inactive"].includes(
      normalized
    )
  ) {
    color = "error";
  } else if (
    ["processing", "in progress", "running"].includes(normalized)
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

const DetailItem = ({ label, value, date = false }) => (
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

const ExportJobView = ({
  jobId: suppliedJobId,
  job: initialJob = null,
  onEdit,
  onClose,
  onBack,
  apiUrl = API_URL
}) => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const resolvedJobId =
    suppliedJobId ??
    routeId ??
    getField(
      initialJob,
      "exportJobId",
      "ExportJobId",
      "id",
      "Id"
    );

  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJob = useCallback(async () => {
    if (
      resolvedJobId === null ||
      resolvedJobId === undefined ||
      resolvedJobId === ""
    ) {
      setError("Export Job ID is missing.");
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
        responseData?.result ??
        responseData;

      if (
        !fetchedJob ||
        typeof fetchedJob !== "object" ||
        Array.isArray(fetchedJob)
      ) {
        throw new Error("Invalid Export Job response.");
      }

      setJob(fetchedJob);
    } catch (err) {
      console.error(
        "GET EXPORT JOB ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.title ||
          err.message ||
          "Failed to load Export Job."
      );
    } finally {
      setLoading(false);
    }
  }, [resolvedJobId, apiUrl]);

  useEffect(() => {
    if (initialJob) {
      setJob(initialJob);
    }

    fetchJob();
  }, [fetchJob]);

  const handleBack = () => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }

    if (typeof onBack === "function") {
      onBack();
      return;
    }

    navigate("/export-jobs");
  };

  const handleEdit = () => {
    if (!job) {
      setError("Export Job details are not loaded.");
      return;
    }

    if (typeof onEdit === "function") {
      onEdit(job);
      return;
    }

    const id = getField(job, "exportJobId", "ExportJobId", "id", "Id");

    if (id === null || id === undefined) {
      setError("Cannot edit: Export Job ID was not found.");
      return;
    }

    navigate(`/export-jobs/${id}/edit`);
  };

  // Actual ExportJobs API fields
  const id = getField(job, "exportJobId", "ExportJobId", "id", "Id");

  const jobCode = getField(job, "jobCode", "JobCode");

  const exportType = getField(
    job,
    "exportJobTypeName",
    "ExportJobTypeName"
  );

  const exportColumns = getField(
    job,
    "exportColums",
    "ExportColums"
  );

  const exportFilters = getField(
    job,
    "exportFilters",
    "ExportFilters"
  );

  const scheduleTime = getField(
    job,
    "scheduleTime",
    "ScheduleTime"
  );

  const notificationEmail = getField(
    job,
    "notificationEmail",
    "NotificationEmail"
  );

  const sellerId = getField(job, "sellerId", "SellerId");
  const customerId = getField(job, "customerId", "CustomerId");
  const frequency = getField(job, "frequency", "Frequency");
  const reportName = getField(job, "reportName", "ReportName");
  const status = getField(job, "status", "Status");

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
          onClick={handleBack}
        >
          Back
        </Button>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No Export Job details are available.
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Export Job Details
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            ID: {formatValue(id ?? resolvedJobId)} •{" "}
            {formatValue(jobCode)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            variant="outlined"
            startIcon={
              loading ? (
                <CircularProgress size={16} />
              ) : (
                <Refresh />
              )
            }
            onClick={fetchJob}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary */}
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "action.hover"
                }}
              >
                <FileDownload color="primary" />
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {formatValue(reportName)}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {formatValue(exportType)}
                </Typography>
              </Box>
            </Stack>

            <ExportJobStatus status={status} />
          </Stack>
        </CardContent>
      </Card>

      {/* General information */}
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Inventory2 color="primary" />

            <Typography variant="h6" fontWeight={700}>
              General Information
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Job Code" value={jobCode} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Export Type" value={exportType} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Report Name" value={reportName} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Status" value={status} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Frequency" value={frequency} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Seller ID" value={sellerId} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Customer ID" value={customerId} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem
                label="Notification Email"
                value={notificationEmail}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Export configuration */}
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <FileDownload color="primary" />

            <Typography variant="h6" fontWeight={700}>
              Export Configuration
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DetailItem
                label="Export Columns"
                value={exportColumns}
              />
            </Grid>

            <Grid item xs={12}>
              <DetailItem
                label="Export Filters"
                value={exportFilters}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <CalendarMonth color="primary" />

            <Typography variant="h6" fontWeight={700}>
              Schedule Information
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Schedule Time"
                value={scheduleTime}
                date
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Frequency"
                value={frequency}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExportJobView;
