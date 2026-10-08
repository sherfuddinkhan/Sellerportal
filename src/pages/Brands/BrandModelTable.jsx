import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, CircularProgress, Alert,
  Stack, Chip, Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const BrandModelTable = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // brand object passed from BrandTable
  const brandFromState = location.state?.brand;

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const validBrandId = brandId && /^\d+$/.test(String(brandId));

  // NORMALIZE - same fix as BrandTable
  const normalizedModels = useMemo(() => {
    return models.map((m) => ({
      brandModelId: m.brandModelId?? m.BrandModelId,
      modelName: m.modelName?? m.ModelName?? "",
      modelCode: m.modelCode?? m.ModelCode?? "",
      brandId: m.brandId?? m.BrandId?? brandId,
      description: m.description?? m.Description?? "",
      isActive: m.isActive?? m.IsActive?? true,
      brand: m.brand?? m.Brand?? brandFromState?? null, // <-- brand as OBJECT
      _raw: m // <-- keep full model object
    }));
  }, [models,brandId,brandFromState]);

  const loadBrandModels = useCallback(async () => {
    if (!validBrandId) {
      setModels([]);
      setError("Invalid Brand ID.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/Brand/${brandId}/models`, {
        headers: { Accept: "*/*" },
      });
      if (!response.ok) throw new Error(`Failed to load (${response.status})`);
      const data = await response.json();
      let modelList = [];
      if (Array.isArray(data)) modelList = data;
      else if (Array.isArray(data?.data)) modelList = data.data;
      else if (Array.isArray(data?.$values)) modelList = data.$values;
      setModels(modelList);
    } catch (err) {
      setModels([]);
      setError(err.message || "Failed to load brand models.");
    } finally {
      setLoading(false);
    }
  }, [brandId, validBrandId]);

  useEffect(() => {
    loadBrandModels();
  }, [loadBrandModels]);

  const handleDelete = async (modelId) => {
    if (!window.confirm("Delete this model?")) return;
    try {
      const res = await fetch(`${API_URL}/Brand/${brandId}/models/${modelId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      await loadBrandModels();
    } catch (err) {
      setError(err.message);
    }
  };

  // PASS AS OBJECT - NOT JUST ID
  const handleView = (model) => {
    console.log("View model object:", model._raw);
    console.log("Brand object:", model.brand);
    navigate(`/brands/${brandId}/models/${model.brandModelId}`, {
      state: { brand: model.brand?? brandFromState, model: model._raw }
    });
  };

  const handleEdit = (model) => {
    console.log("Edit model object:", model._raw);
    navigate(`/brands/${brandId}/models/${model.brandModelId}/edit`, {
      state: { brand: model.brand?? brandFromState, model: model._raw }
    });
  };

  if (!validBrandId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Invalid Brand ID.</Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate("/brands")}>Back</Button>
      </Box>
    );
  }

  if (loading) {
    return <Box sx={{ minHeight: 300, display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Brand Models {brandFromState? `- ${brandFromState.brandName?? brandFromState.BrandName}` : ""}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {brandFromState? `Brand Code: ${brandFromState.brandCode?? brandFromState.BrandCode} | ` : ""}
            Brand ID: {brandId}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/brands")}>Back to Brands</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(`/brands/${brandId}/models/new`, { state: { brand: brandFromState } })}>Add Model</Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Model Name</strong></TableCell>
                <TableCell><strong>Model Code</strong></TableCell>
                <TableCell><strong>Brand</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {normalizedModels.length === 0? (
                <TableRow><TableCell colSpan={6} align="center"><Typography sx={{ py: 4 }} color="text.secondary">No brand models found.</Typography></TableCell></TableRow>
              ) : (
                normalizedModels.map((model) => (
                  <TableRow key={model.brandModelId} hover>
                    <TableCell>{model.brandModelId}</TableCell>
                    <TableCell><Typography fontWeight={500}>{model.modelName}</Typography></TableCell>
                    <TableCell>{model.modelCode || "-"}</TableCell>
                    <TableCell>{model.brand?.brandName?? model.brand?.BrandName?? brandFromState?.brandName?? "-"}</TableCell>
                    <TableCell><Chip label={model.isActive? "Active" : "Inactive"} size="small" color={model.isActive? "success" : "default"} /></TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="View (as object)"><IconButton color="primary" onClick={() => handleView(model)}><VisibilityIcon /></IconButton></Tooltip>
                        <Tooltip title="Edit (as object)"><IconButton color="warning" onClick={() => handleEdit(model)}><EditIcon /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(model.brandModelId)}><DeleteIcon /></IconButton></Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BrandModelTable;