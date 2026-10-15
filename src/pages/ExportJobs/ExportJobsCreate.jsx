import React, { useState } from "react";
import axios from "axios";
import {
  Box, Paper, Grid, Typography, TextField, MenuItem,
  Button, Divider, CircularProgress, Alert, Snackbar
} from "@mui/material";
import { Save, ArrowBack, RestartAlt } from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api/export-jobs";

const initialFormData = {
  jobName: "",
  exportType: "",
  fileFormat: "CSV",
  status: "Pending",
  fileName: "",
  filePath: "",
  requestedBy: "",
  recordsCount: "",
};

const ExportJobsCreate = ({ apiBaseUrl = API_BASE_URL, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({...initialFormData });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getApiErrorMessage = (err) => {
    const data = err?.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.title) return data.title;
    if (data?.errors) return Object.values(data.errors).flat().join(" ");
    if (err?.response?.status === 400) return "Invalid export job details.";
    if (!err?.response) return "Unable to connect to server.";
    return "Failed to create export job.";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((p) => ({...p, [name]: value }));
    setFormErrors((p) => ({...p, [name]: "" }));
    setError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!String(formData.jobName || "").trim()) errors.jobName = "Job name is required.";
    if (!String(formData.exportType || "").trim()) errors.exportType = "Export type is required.";
    if (!String(formData.fileFormat || "").trim()) errors.fileFormat = "Format is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = () => {
    if (loading) return;
    setFormData({...initialFormData });
    setFormErrors({}); setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!validateForm()) return;

    const payload = {
      jobName: String(formData.jobName).trim(),
      exportType: String(formData.exportType).trim(),
      fileFormat: String(formData.fileFormat).trim(),
      status: formData.status? String(formData.status).trim() : undefined,
      fileName: formData.fileName? String(formData.fileName).trim() : undefined,
      filePath: formData.filePath? String(formData.filePath).trim() : undefined,
      requestedBy: formData.requestedBy? String(formData.requestedBy).trim() : undefined,
      recordsCount: formData.recordsCount!== ""? Number(formData.recordsCount) : undefined,
    };

    try {
      setLoading(true); setError("");
      const response = await axios.post(apiBaseUrl, payload);
      setSuccess(true);
      setFormData({...initialFormData });
      setFormErrors({});
      onSuccess?.(response.data);
    } catch (err) { setError(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ width: "100%", p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Create Export Job</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Enter the required information to create an export job.</Typography>
        </Box>
        {onCancel && <Button variant="outlined" color="inherit" startIcon={<ArrowBack />} onClick={onCancel} disabled={loading}>Back</Button>}
      </Box>

      <Divider sx={{ mb: 3 }} />
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2.5}>
          <Grid xs={12}>
            <TextField fullWidth required label="Job Name" name="jobName" value={formData.jobName} onChange={handleChange} disabled={loading} error={Boolean(formErrors.jobName)} helperText={formErrors.jobName} placeholder="e.g. Daily Products Export" />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField fullWidth required select label="Export Type" name="exportType" value={formData.exportType} onChange={handleChange} disabled={loading} error={Boolean(formErrors.exportType)} helperText={formErrors.exportType}>
              <MenuItem value="Products">Products</MenuItem><MenuItem value="Orders">Orders</MenuItem><MenuItem value="Customers">Customers</MenuItem><MenuItem value="Inventory">Inventory</MenuItem><MenuItem value="Sales">Sales</MenuItem>
            </TextField>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField fullWidth required select label="File Format" name="fileFormat" value={formData.fileFormat} onChange={handleChange} disabled={loading} error={Boolean(formErrors.fileFormat)} helperText={formErrors.fileFormat}>
              <MenuItem value="CSV">CSV</MenuItem><MenuItem value="Excel">Excel</MenuItem><MenuItem value="JSON">JSON</MenuItem><MenuItem value="XML">XML</MenuItem><MenuItem value="PDF">PDF</MenuItem>
            </TextField>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange} disabled={loading}>
              <MenuItem value="Pending">Pending</MenuItem><MenuItem value="Processing">Processing</MenuItem><MenuItem value="Completed">Completed</MenuItem><MenuItem value="Failed">Failed</MenuItem>
            </TextField>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField fullWidth label="Records Count" name="recordsCount" type="number" value={formData.recordsCount} onChange={handleChange} disabled={loading} placeholder="e.g. 1000" />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField fullWidth label="File Name" name="fileName" value={formData.fileName} onChange={handleChange} disabled={loading} placeholder="e.g. products_export.csv" />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField fullWidth label="Requested By" name="requestedBy" value={formData.requestedBy} onChange={handleChange} disabled={loading} placeholder="e.g. admin@company.com" />
          </Grid>

          <Grid xs={12}>
            <TextField fullWidth label="File Path" name="filePath" value={formData.filePath} onChange={handleChange} disabled={loading} placeholder="e.g. /exports/products_export.csv" />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 3, mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="button" variant="outlined" color="inherit" startIcon={<RestartAlt />} onClick={handleReset} disabled={loading}>Reset</Button>
          {onCancel && <Button type="button" variant="outlined" onClick={onCancel} disabled={loading}>Cancel</Button>}
          <Button type="submit" variant="contained" startIcon={loading? <CircularProgress size={18} color="inherit" /> : <Save />} disabled={loading}>
            {loading? "Creating..." : "Create Export Job"}
          </Button>
        </Box>
      </Box>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" variant="filled" onClose={() => setSuccess(false)}>Export job created successfully.</Alert>
      </Snackbar>
    </Paper>
  );
};

export default ExportJobsCreate;
