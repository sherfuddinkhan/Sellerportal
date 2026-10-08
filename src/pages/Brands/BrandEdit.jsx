import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BrandForm from "./BrandForm";

const SERVER_URL = "http://localhost:5000";

const BrandEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // FIX 1: your route is :brandId not :id
  const { brandId, id } = useParams();
  const finalId = brandId || id; // support both

  const [brand, setBrand] = useState(location.state?.brand || null); // FIX 2: use passed state if exists
  const [loading, setLoading] = useState(!location.state?.brand);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!finalId || finalId === ":id" ||!/^\d+$/.test(String(finalId))) {
      setError(`Invalid Brand ID: ${finalId}`);
      setLoading(false);
      return;
    }
    // If we already have brand from navigate state, don't fetch again
    if (!brand) {
      loadBrand();
    }
  }, [finalId]);

  const loadBrand = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("LOAD BRAND ID:", finalId);
      // FIX 3: Capital B - /api/Brand not /api/brand (depends on your.NET route)
      const response = await fetch(`${SERVER_URL}/api/Brand/${finalId}`, {
        method: "GET",
        headers: { Accept: "application/json" }
      });
      const data = await response.json();
      console.log("GET response:", data);
      if (!response.ok) {
        throw new Error(data?.message || data?.title || `HTTP ${response.status}`);
      }
      // Normalize PascalCase / camelCase
      const normalized = {
        brandId: data.brandId?? data.BrandId?? finalId,
        brandName: data.brandName?? data.BrandName?? "",
        description: data.description?? data.Description?? "",
        isActive: data.isActive?? data.IsActive?? true
      };
      setBrand(normalized);
    } catch (err) {
      console.error("Load Brand Error:", err);
      setError(err.message || "Unable to load Brand.");
      setBrand(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setError("");
      const requestBody = {
        brandId: Number(finalId),
        brandName: values.brandName,
        brandCode: values.brandCode,
        description: values.description,
        isActive: Boolean(values.isActive)
      };
      console.log("UPDATE:", requestBody);
      const response = await fetch(`${SERVER_URL}/api/Brand/${finalId}`, {
        method: "PUT",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
      alert("Brand Updated Successfully.");
      navigate("/brands");
    } catch (err) {
      setError(err.message || "Unable to Update Brand.");
    }
  };

  const handleCancel = () => navigate("/brands");

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;
  if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;
  if (!brand) return <Box p={3}><Alert severity="warning">Brand not found.</Alert></Box>;

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>Edit Brand</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Brand ID: {brand.brandId}</Typography>
        <BrandForm initialValues={brand} onSubmit={handleUpdate} onCancel={handleCancel} />
      </Paper>
    </Box>
  );
};

export default BrandEdit;