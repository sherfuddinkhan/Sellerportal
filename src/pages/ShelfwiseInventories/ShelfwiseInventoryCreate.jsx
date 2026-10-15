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

  // Read the logged-in user's stored data.
  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const getSellerId = () => {
    const user = getStoredUser();

    return (
      localStorage.getItem("sellerId") ||
      user.sellerId ||
      user.SellerId ||
      user.seller?.sellerId ||
      user.seller?.SellerId ||
      ""
    );
  };

  const getCustomerId = () => {
    const user = getStoredUser();

    return (
      localStorage.getItem("customerId") ||
      user.customerId ||
      user.CustomerId ||
      user.customer?.customerId ||
      user.customer?.CustomerId ||
      ""
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.itemName.trim() ||
      !form.itemCode.trim() ||
      !form.warehouseName.trim() ||
      !form.shelfName.trim()
    ) {
      setError("Please fill all required fields *");
      return;
    }

    const sellerId = getSellerId();
    const customerId = getCustomerId();

    if (!sellerId || !customerId) {
      setError(
        "Seller ID or Customer ID is missing. Please check your login data or localStorage."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        itemId: form.itemId ? Number(form.itemId) : null,
        warehouseId: form.warehouseId
          ? Number(form.warehouseId)
          : null,
        shelfId: form.shelfId ? Number(form.shelfId) : null,
        quantity: form.quantity === "" ? 0 : Number(form.quantity),
        availableQuantity:
          form.availableQuantity === ""
            ? 0
            : Number(form.availableQuantity),
        minimumStock:
          form.minimumStock === "" ? 0 : Number(form.minimumStock),
        maximumStock:
          form.maximumStock === "" ? 0 : Number(form.maximumStock)
      };

      const response = await axios.post(
        `${API_URL}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status >= 200 && response.status < 300) {
        navigate("/shelfwise-inventories");
      }
    } catch (err) {
      console.error(
        "CREATE SHELFWISE INVENTORY ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.response?.data?.title ||
        "Failed to create inventory. Please verify the API request and form data."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Box
            sx={{
              bgcolor: "#0284c7",
              color: "#fff",
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            +
          </Box>
          Create Shelfwise Inventory
        </Typography>

        <Typography color="text.secondary">
          Enter item, warehouse, shelf, and stock details.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 2 }}>
          Item Details
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="Item Name"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="Item Code"
              name="itemCode"
              value={form.itemCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Item ID"
              type="number"
              name="itemId"
              value={form.itemId}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Category"
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography fontWeight={600} sx={{ mb: 2 }}>
          Warehouse and Shelf Details
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="Warehouse Name"
              name="warehouseName"
              value={form.warehouseName}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Warehouse ID"
              type="number"
              name="warehouseId"
              value={form.warehouseId}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="Shelf Name"
              name="shelfName"
              value={form.shelfName}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Shelf Code"
              name="shelfCode"
              value={form.shelfCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Shelf ID"
              type="number"
              name="shelfId"
              value={form.shelfId}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography fontWeight={600} sx={{ mb: 2 }}>
          Stock Details
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              label="Available Quantity"
              type="number"
              name="availableQuantity"
              value={form.availableQuantity}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              label="Minimum Stock"
              type="number"
              name="minimumStock"
              value={form.minimumStock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              label="Maximum Stock"
              type="number"
              name="maximumStock"
              value={form.maximumStock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/shelfwise-inventories")}
            disabled={loading}
          >
            CANCEL
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ bgcolor: "#0284c7" }}
          >
            {loading ? "CREATING..." : "CREATE INVENTORY"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ShelfwiseInventoryCreatePage;
