import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Paper,
  Divider,
  Alert
} from "@mui/material";

const API_URL = "/api/ShelfwiseInventory";

const ShelfwiseInventoryCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    itemName: "",
    itemCode: "",
    itemId: "",
    categoryName: "",
    warehouseName: "",
    warehouseId: "",
    shelfName: "",
    shelfCode: "",
    shelfId: "",
    quantity: "",
    availableQuantity: "",
    minimumStock: "",
    maximumStock: "",
    unit: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.itemName || !form.itemCode || !form.warehouseName || !form.shelfName) {
      setError("Please fill all required fields *");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(API_URL, form);
      navigate("/shelfwise-inventories");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} display="flex" alignItems="center" gap={1}>
          <Box sx={{ bgcolor: "#0284c7", color: "#fff", width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>+</Box>
          Create Shelfwise Inventory
        </Typography>
        <Typography color="text.secondary">Enter item, warehouse, shelf, and stock details.</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 2 }}>Item Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><TextField fullWidth label="Item Name *" name="itemName" value={form.itemName} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Item Code *" name="itemCode" value={form.itemCode} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Item ID" name="itemId" value={form.itemId} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Category" name="categoryName" value={form.categoryName} onChange={handleChange} /></Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography fontWeight={600} sx={{ mb: 2 }}>Warehouse and Shelf Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><TextField fullWidth label="Warehouse Name *" name="warehouseName" value={form.warehouseName} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Warehouse ID" name="warehouseId" value={form.warehouseId} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Shelf Name *" name="shelfName" value={form.shelfName} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Shelf Code" name="shelfCode" value={form.shelfCode} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Shelf ID" name="shelfId" value={form.shelfId} onChange={handleChange} /></Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography fontWeight={600} sx={{ mb: 2 }}>Stock Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><TextField fullWidth label="Quantity" type="number" name="quantity" value={form.quantity} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={3}><TextField fullWidth label="Available Quantity" type="number" name="availableQuantity" value={form.availableQuantity} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={3}><TextField fullWidth label="Minimum Stock" type="number" name="minimumStock" value={form.minimumStock} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={3}><TextField fullWidth label="Unit" name="unit" value={form.unit} onChange={handleChange} /></Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate("/shelfwise-inventories")}>CANCEL</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ bgcolor: "#0284c7" }}>
            {loading ? "CREATING..." : "CREATE INVENTORY"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ShelfwiseInventoryCreatePage;