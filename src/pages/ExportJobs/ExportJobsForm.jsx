import React, { useEffect, useState } from "react";
import {
  Box, Grid, TextField, MenuItem, Button, Typography, Divider, CircularProgress, Alert
} from "@mui/material";
import { Save, RestartAlt } from "@mui/icons-material";

const initialFormData = {
  jobName: "",
  exportType: "",
  fileFormat: "CSV",
  status: "Pending",
  fileName: "",
  filePath: "",
  requestedBy: "",
  recordsCount: "",
  errorMessage: ""
};

const ExportJobsForm = ({
  mode = "create",
  initialData = null,
  loading = false,
  error = "",
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const isEditMode = mode === "edit";

  const mapToForm = (data) => ({
    jobName: data?.jobName?? data?.JobName?? "",
    exportType: data?.exportType?? data?.ExportType?? "",
    fileFormat: data?.fileFormat?? data?.FileFormat?? "CSV",
    status: data?.status?? data?.Status?? "Pending",
    fileName: data?.fileName?? data?.FileName?? "",
    filePath: data?.filePath?? data?.FilePath?? "",
    requestedBy: data?.requestedBy?? data?.RequestedBy?? "",
    recordsCount: data?.recordsCount?? data?.RecordsCount?? "",
    errorMessage: data?.errorMessage?? data?.ErrorMessage?? ""
  });

  useEffect(() => {
    if (initialData && isEditMode) setFormData(mapToForm(initialData));
    else setFormData(initialFormData);
    setFormErrors({});
  }, [initialData, mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((p) => ({...p, [name]: value }));
    setFormErrors((p) => ({...p, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!String(formData.jobName || "").trim()) errors.jobName = "Job name is required";
    if (!String(formData.exportType || "").trim()) errors.exportType = "Export type is required";
    if (!String(formData.fileFormat || "").trim()) errors.fileFormat = "Format is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      errorMessage: formData.errorMessage? String(formData.errorMessage).trim() : undefined,
    };

    // remove undefined for create to keep API happy
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    if (typeof onSubmit === "function") await onSubmit(payload);
  };

  const handleReset = () => {
    if (loading) return;
    setFormData(isEditMode && initialData? mapToForm(initialData) : initialFormData);
    setFormErrors({});
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>{isEditMode? "Edit Export Job" : "Create Export Job"}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode? "Update the export job details below." : "Enter the details to create a new export job."}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <TextField fullWidth required label="Job Name" name="jobName" value={formData.jobName?? ""} onChange={handleChange} disabled={loading} error={Boolean(formErrors.jobName)} helperText={formErrors.jobName} placeholder="Enter export job name" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth required select label="Export Type" name="exportType" value={formData.exportType?? ""} onChange={handleChange} disabled={loading} error={Boolean(formErrors.exportType)} helperText={formErrors.exportType}>
            <MenuItem value="Products">Products</MenuItem><MenuItem value="Orders">Orders</MenuItem><MenuItem value="Customers">Customers</MenuItem><MenuItem value="Inventory">Inventory</MenuItem><MenuItem value="Sales">Sales</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth required select label="File Format" name="fileFormat" value={formData.fileFormat?? "CSV"} onChange={handleChange} disabled={loading} error={Boolean(formErrors.fileFormat)} helperText={formErrors.fileFormat}>
            <MenuItem value="CSV">CSV</MenuItem><MenuItem value="Excel">Excel</MenuItem><MenuItem value="JSON">JSON</MenuItem><MenuItem value="XML">XML</MenuItem><MenuItem value="PDF">PDF</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth select label="Status" name="status" value={formData.status?? "Pending"} onChange={handleChange} disabled={loading}>
            <MenuItem value="Pending">Pending</MenuItem><MenuItem value="Processing">Processing</MenuItem><MenuItem value="Completed">Completed</MenuItem><MenuItem value="Failed">Failed</MenuItem><MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Records Count" name="recordsCount" type="number" value={formData.recordsCount?? ""} onChange={handleChange} disabled={loading} placeholder="e.g. 1000" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="File Name" name="fileName" value={formData.fileName?? ""} onChange={handleChange} disabled={loading} placeholder="products_export.csv" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Requested By" name="requestedBy" value={formData.requestedBy?? ""} onChange={handleChange} disabled={loading} placeholder="admin@company.com" />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth label="File Path" name="filePath" value={formData.filePath?? ""} onChange={handleChange} disabled={loading} placeholder="/exports/products_export.csv" />
        </Grid>

        {isEditMode && (
          <Grid item xs={12}>
            <TextField fullWidth multiline minRows={2} label="Error Message" name="errorMessage" value={formData.errorMessage?? ""} onChange={handleChange} disabled={loading} />
          </Grid>
        )}
      </Grid>

      <Divider sx={{ mt: 3, mb: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap" }}>
        <Button type="button" variant="outlined" color="inherit" startIcon={<RestartAlt />} onClick={handleReset} disabled={loading}>Reset</Button>
        <Button type="button" variant="outlined" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" startIcon={loading? <CircularProgress size={18} color="inherit" /> : <Save />} disabled={loading}>
          {loading? "Saving..." : isEditMode? "Update Export Job" : "Create Export Job"}
        </Button>
      </Box>
    </Box>
  );
};

export default ExportJobsForm;