import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BrandForm from "./BrandForm";

const SERVER_URL = "http://localhost:5000";

const BrandEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brandId, id } = useParams();
  const finalId = brandId || id;

  const [brand, setBrand] = useState(location.state?.brand || null);
  const [loading, setLoading] = useState(!location.state?.brand);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!finalId ||!/^\d+$/.test(String(finalId))) {
      setError(`Invalid Brand ID: ${finalId}`);
      setLoading(false);
      return;
    }
    if (!brand) {
      loadBrand();
    } else {
      // FIX: Normalize the PASSED OBJECT also (has BrandCode, SellerId)
      setBrand(normalize(dataOrBrand = brand));
      setLoading(false);
    }
  }, [finalId]);

  const normalize = (data) => {
    return {
      brandId: data.brandId?? data.BrandId?? finalId,
      brandCode: data.brandCode?? data.BrandCode?? "", // <-- FIX ADDED
      brandName: data.brandName?? data.BrandName?? "",
      description: data.description?? data.Description?? "",
      sellerId: data.sellerId?? data.SellerId?? data.seller?.sellerId?? data.Seller?.SellerId?? 0, // <-- FIX ADDED
      seller: data.seller?? data.Seller?? null,
      logoUrl: data.logoUrl?? data.LogoUrl?? "",
      productIds: data.productIds?? data.ProductIds?? [0],
      isActive: data.isActive?? data.IsActive?? true,
      _raw: data
    };
  };

  const loadBrand = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${SERVER_URL}/api/Brand/${finalId}`, {
        headers: { Accept: "application/json" }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
      console.log("GET response has brandCode?", data.BrandCode, data.brandCode, "sellerId?", data.SellerId);
      setBrand(normalize(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setError("");
      console.log("values from BrandForm:", values);

      const requestBody = {
        brandId: Number(finalId),
        productIds: values.productIds?? [0],
        brandName: values.brandName,
        brandCode: values.brandCode, // <-- NOW HAS VALUE
        description: values.description,
        isActive: values.isActive,
        sellerId: Number(values.sellerId)?? 0 // <-- NOW HAS VALUE
      };

      console.log("UPDATE PAYLOAD:", requestBody);

      const response = await fetch(`${SERVER_URL}/api/Brand/${finalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.message || `HTTP ${response.status}`);

      alert("Brand Updated Successfully.");
      navigate("/brands");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;
  if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;
  if (!brand) return <Box p={3}><Alert severity="warning">Brand not found.</Alert></Box>;

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>Edit Brand</Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>Brand ID: {brand.brandId} | Code: {brand.brandCode} | Seller: {brand.sellerId}</Typography>
        <BrandForm initialValues={brand} onSubmit={handleUpdate} onCancel={() => navigate("/brands")} />
      </Paper>
    </Box>
  );
};

export default BrandEdit;