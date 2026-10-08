import React, { useEffect, useState } from "react";
import {
  Box, Paper, Typography, TextField, Button, FormControlLabel, Switch,
  Stack, CircularProgress, Alert
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const BrandModelForm = () => {
  const navigate = useNavigate();
  const { brandId, modelId } = useParams();
  const isEditMode = Boolean(modelId);

  const [formData, setFormData] = useState({
    brandModelId: 0,
    brandId: "",
    modelName: "",
    description: "",
    isActive: true
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!brandId || isNaN(Number(brandId))) {
      setError("Invalid Brand ID."); setLoading(false); return;
    }
    if (isEditMode && (!modelId || isNaN(Number(modelId)))) {
      setError("Invalid Brand Model ID."); setLoading(false); return;
    }
    if (isEditMode) {
      loadBrandModel();
    } else {
      setFormData((prev) => ({...prev, brandId: Number(brandId) }));
      setLoading(false);
    }
  }, [brandId, modelId]);

  // LOAD - FIXED: GET /api/Brand/:brandId/models/:modelId
  const loadBrandModel = async () => {
    try {
      setLoading(true); setError("");
      const url = `${API_URL}/Brand/${brandId}/models/${modelId}`;
      console.log("Loading Brand Model for Edit:", url);
      const response = await fetch(url, { method: "GET", headers: { Accept: "*/*" } });
      if (!response.ok) {
        let message = `Failed to load brand model (${response.status})`;
        try { const errorData = await response.json(); message = errorData?.message || message; } catch {}
        throw new Error(message);
      }
      const data = await response.json();
      const model = data?.data?? data?.brandModel?? data;
      if (!model) throw new Error("Brand model not found.");
      setFormData({
        brandModelId: model.brandModelId?? model.BrandModelId?? Number(modelId),
        brandId: model.brandId?? model.BrandId?? Number(brandId),
        modelName: model.modelName?? model.ModelName?? "",
        description: model.description?? model.Description?? "",
        isActive: model.isActive?? model.IsActive?? true
      });
    } catch (err) {
      console.error(err); setError(err.message || "Failed to load brand model.");
    } finally { setLoading(false); }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({...prev, [name]: value }));
  };
  const handleActiveChange = (event) => {
    setFormData((prev) => ({...prev, isActive: event.target.checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); setSuccess("");
    if (!formData.modelName.trim()) { setError("Model Name is required."); return; }
    try {
      setSaving(true);

      if (!isEditMode) {
        // CREATE - FIXED: POST /api/Brand/:brandId/models
        // DTO: CreateBrandModelRequest = { modelName, description, isActive }
        const payload = {
          modelName: formData.modelName.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive
        };
        console.log("Creating Brand Model:", payload);
        const response = await fetch(`${API_URL}/Brand/${brandId}/models`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "*/*" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          let message = `Failed to create brand model (${response.status})`;
          try { const errorData = await response.json(); message = errorData?.message || message; } catch {}
          throw new Error(message);
        }
        setSuccess("Brand model created successfully.");
        setTimeout(() => navigate(`/brands/${brandId}/models`), 800);
        return;
      }

      // UPDATE - FIXED: PUT /api/Brand/:brandId/models/:modelId
      const payload = {
        brandModelId: Number(formData.brandModelId),
        brandId: Number(formData.brandId || brandId),
        modelName: formData.modelName.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive
      };
      console.log("Updating Brand Model:", payload);
      const response = await fetch(`${API_URL}/Brand/${brandId}/models/${modelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        let message = `Failed to update brand model (${response.status})`;
        try { const errorData = await response.json(); message = errorData?.message || message; } catch {}
        throw new Error(message);
      }
      setSuccess("Brand model updated successfully.");
      setTimeout(() => navigate(`/brands/${brandId}/models/${modelId}`), 800);

    } catch (err) {
      console.error(err); setError(err.message || "Failed to save brand model.");
    } finally { setSaving(false); }
  };

  if (loading) {
    return (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 350 }}><CircularProgress /></Box>);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>{isEditMode? "Edit Brand Model" : "Create Brand Model"}</Typography>
          <Typography variant="body2" color="text.secondary">{isEditMode? "Update brand model information" : "Create a model for this brand"}</Typography>
        </Box>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(`/brands/${brandId}/models`)}>Back to Models</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField label="Brand ID" value={formData.brandId} fullWidth disabled />
            {isEditMode && <TextField label="Brand Model ID" value={formData.brandModelId} fullWidth disabled />}
            <TextField label="Model Name" name="modelName" value={formData.modelName} onChange={handleChange} fullWidth required />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} />
            <FormControlLabel control={<Switch checked={formData.isActive} onChange={handleActiveChange} />} label={formData.isActive? "Active" : "Inactive"} />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>{saving? "Saving..." : isEditMode? "Update Model" : "Create Model"}</Button>
              <Button variant="outlined" onClick={() => navigate(`/brands/${brandId}/models`)} disabled={saving}>Cancel</Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default BrandModelForm;