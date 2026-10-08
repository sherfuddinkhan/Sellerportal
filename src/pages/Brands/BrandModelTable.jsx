import React, { useCallback, useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const BrandModelTable = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const validBrandId = brandId && /^\d+$/.test(String(brandId));

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
        method: "GET",
        headers: { Accept: "*/*" },
      });
      if (!response.ok) throw new Error(`Failed to load brand models (${response.status})`);
      const data = await response.json();
      let modelList = [];
      if (Array.isArray(data)) modelList = data;
      else if (Array.isArray(data?.data)) modelList = data.data;
      else if (Array.isArray(data?.$values)) modelList = data.$values;
      setModels(modelList);
    } catch (err) {
      console.error(err);
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
    if (!modelId) return;
    if (!window.confirm("Delete this model?")) return;
    try {
      const response = await fetch(`${API_URL}/Brand/${brandId}/models/${modelId}`, {
        method: "DELETE",
        headers: { Accept: "*/*" },
      });
      if (!response.ok) throw new Error(`Failed to delete (${response.status})`);
      await loadBrandModels();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!validBrandId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Invalid Brand ID.</Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate("/brands")}>
          Back to Brands
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Brand Models</Typography>
          <Typography variant="body2" color="text.secondary">Models belonging to this brand</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}><strong>Brand ID:</strong> {brandId}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/brands")}>Back to Brands</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(`/brands/${brandId}/models/new`)}>Add Model</Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>brandModelId</strong></TableCell>
                <TableCell><strong>Model Name</strong></TableCell>
                <TableCell><strong>Brand ID</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.length === 0? (
                <TableRow><TableCell colSpan={6} align="center"><Typography color="text.secondary" sx={{ py: 4 }}>No brand models found.</Typography></TableCell></TableRow>
              ) : (
                models.map((model) => {
                  const mId = model.brandModelId?? model.BrandModelId;
                  return (
                    <TableRow key={mId} hover>
                      <TableCell>{mId}</TableCell>
                      <TableCell><Typography fontWeight={500}>{model.modelName?? model.ModelName}</Typography></TableCell>
                      <TableCell>{model.brandId?? model.BrandId?? brandId}</TableCell>
                      <TableCell>{model.description?? model.Description?? "-"}</TableCell>
                      <TableCell><Chip label={(model.isActive?? model.IsActive)? "Active" : "Inactive"} size="small" color={(model.isActive?? model.IsActive)? "success" : "default"} /></TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="View"><IconButton color="primary" onClick={() => navigate(`/brands/${brandId}/models/${mId}`)}><VisibilityIcon /></IconButton></Tooltip>
                          <Tooltip title="Edit"><IconButton color="warning" onClick={() => navigate(`/brands/${brandId}/models/${mId}/edit`)}><EditIcon /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(mId)}><DeleteIcon /></IconButton></Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BrandModelTable;