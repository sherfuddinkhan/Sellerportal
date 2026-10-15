import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";

import { ArrowBack, Save } from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api/export-jobs";

const initialFormData = {
  jobCode: "",
  exportJobTypeName: "",
  exportColums: "",
  exportFilters: "",
  scheduleTime: "",
  notificationEmail: "",
  sellerId: "",
  customerId: "",
  frequency: "DAILY",
  reportName: "",
  status: "ACTIVE"
};

const getValue = (obj, camel, pascal) =>
  obj?.[camel] ?? obj?.[pascal] ?? "";

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

const ExportJobsEdit = ({
  exportJobId: suppliedId,
  exportJob: initialExportJob = null,
  onSuccess,
  onCancel,
  apiBaseUrl = API_BASE_URL
}) => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const exportJobId = suppliedId ?? routeId;

  const [formData, setFormData] = useState(initialFormData);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getErrorMessage = (err) => {
    const data = err?.response?.data;

    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.title) return data.title;

    if (data?.errors) {
      return Object.values(data.errors).flat().join(" ");
    }

    if (err?.response?.status === 404) {
      return "Export Job not found. Check the ID and API route.";
    }

    if (err?.response?.status === 400) {
      return "Invalid Export Job data. Check the API request model.";
    }

    if (!err?.response) {
      return "Cannot connect to the server at localhost:5000.";
    }

    return "Request failed. Please try again.";
  };

  const mapJobToForm = (job) => ({
    jobCode: getValue(job, "jobCode", "JobCode"),
    exportJobTypeName: getValue(
      job,
      "exportJobTypeName",
      "ExportJobTypeName"
    ),
    exportColums: getValue(
      job,
      "exportColums",
      "ExportColums"
    ),
    exportFilters: getValue(
      job,
      "exportFilters",
      "ExportFilters"
    ),
    scheduleTime: toDateTimeLocal(
      getValue(job, "scheduleTime", "ScheduleTime")
    ),
    notificationEmail: getValue(
      job,
      "notificationEmail",
      "NotificationEmail"
    ),
    sellerId: getValue(job, "sellerId", "SellerId"),
    customerId: getValue(job, "customerId", "CustomerId"),
    frequency:
      getValue(job, "frequency", "Frequency") || "DAILY",
    reportName: getValue(job, "reportName", "ReportName"),
    status: getValue(job, "status", "Status") || "ACTIVE"
  });

  useEffect(() => {
    let active = true;

    const loadJob = async () => {
      if (!exportJobId) {
        setError("Export Job ID is missing from the route.");
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        setError("");

        let job = initialExportJob;

        if (!job) {
          const response = await axios.get(
            `${apiBaseUrl}/${encodeURIComponent(exportJobId)}`
          );

          job = response.data?.data ?? response.data?.result ?? response.data;
        }

        if (!job || typeof job !== "object") {
          throw new Error("Invalid Export Job response.");
        }

        if (active) {
          setFormData(mapJobToForm(job));
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setFetching(false);
        }
      }
    };

    loadJob();

    return () => {
      active = false;
    };
  }, [exportJobId, apiBaseUrl, initialExportJob]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    } else {
      navigate("/export-jobs");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving || fetching) return;

    if (!exportJobId) {
      setError("Export Job ID is required.");
      return;
    }

    if (!String(formData.jobCode).trim()) {
      setError("Job Code is required.");
      return;
    }

    if (!String(formData.exportJobTypeName).trim()) {
      setError("Export Type is required.");
      return;
    }

    if (!String(formData.reportName).trim()) {
      setError("Report Name is required.");
      return;
    }

    if (
      formData.notificationEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.notificationEmail
      )
    ) {
      setError("Enter a valid notification email.");
      return;
    }

    const payload = {
      jobCode: String(formData.jobCode).trim(),
      exportJobTypeName: String(
        formData.exportJobTypeName
      ).trim(),
      exportColums: formData.exportColums,
      exportFilters: formData.exportFilters,
      scheduleTime: formData.scheduleTime
        ? new Date(formData.scheduleTime).toISOString()
        : null,
      notificationEmail: formData.notificationEmail || null,
      sellerId: Number(formData.sellerId),
      customerId: Number(formData.customerId),
      frequency: formData.frequency || null,
      reportName: String(formData.reportName).trim(),
      status: formData.status || null
    };

    try {
      setSaving(true);
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
      console.error(
        "UPDATE EXPORT JOB ERROR:",
        err.response?.data || err.message
      );

      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
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
          <Typography variant="h5" fontWeight={700}>
            Edit Export Job
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Export Job ID: {exportJobId}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleCancel}
          disabled={saving}
        >
          Back
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2.5}>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Job Code"
              name="jobCode"
              value={formData.jobCode}
              onChange={handleChange}
              disabled={saving}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Export Type"
              name="exportJobTypeName"
              value={formData.exportJobTypeName}
              onChange={handleChange}
              disabled={saving}
              placeholder="e.g. SALES_ORDER_EXPORT"
            />
          </Grid>

          <Grid xs={12}>
            <TextField
              fullWidth
              required
              label="Report Name"
              name="reportName"
              value={formData.reportName}
              onChange={handleChange}
              disabled={saving}
            />
          </Grid>

          <Grid xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Export Columns"
              name="exportColums"
              value={formData.exportColums}
              onChange={handleChange}
              disabled={saving}
              helperText="Enter comma-separated column names."
            />
          </Grid>

          <Grid xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Export Filters"
              name="exportFilters"
              value={formData.exportFilters}
              onChange={handleChange}
              disabled={saving}
              helperText="Enter filters in the format supported by your API."
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Schedule Time"
              name="scheduleTime"
              value={formData.scheduleTime}
              onChange={handleChange}
              disabled={saving}
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Notification Email"
              name="notificationEmail"
              type="email"
              value={formData.notificationEmail}
              onChange={handleChange}
              disabled={saving}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Seller ID"
              name="sellerId"
              type="number"
              value={formData.sellerId}
              onChange={handleChange}
              disabled={saving}
              required
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer ID"
              name="customerId"
              type="number"
              value={formData.customerId}
              onChange={handleChange}
              disabled={saving}
              required
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              disabled={saving}
            >
              <MenuItem value="ONCE">Once</MenuItem>
              <MenuItem value="HOURLY">Hourly</MenuItem>
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
            </TextField>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={saving}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </TextField>
          </Grid>
        </Grid>

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
            variant="outlined"
            color="inherit"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={
              saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Save />
              )
            }
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Export Job"}
          </Button>
        </Box>
      </Box>

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
          Export Job updated successfully.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ExportJobsEdit;
