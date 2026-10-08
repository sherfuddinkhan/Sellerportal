import React, { useEffect, useState } from "react";
import { Box, TextField, Switch, FormControlLabel, Button, Typography, Paper, Chip, Stack } from "@mui/material";

const BrandForm = ({ initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    brandCode: "",
    brandName: "",
    description: "",
    isActive: true,
    sellerId: 0,
    seller: null, // <-- FULL SELLER OBJECT
    productIds: [0]
  });

  useEffect(() => {
    if (initialValues) {
      console.log("BrandForm received OBJECT:", initialValues);

      // Normalize - handles both camelCase and PascalCase + _raw object
      const raw = initialValues._raw || initialValues;

      setFormData({
        brandCode: raw.brandCode?? raw.BrandCode?? initialValues.brandCode?? "",
        brandName: raw.brandName?? raw.BrandName?? initialValues.brandName?? "",
        description: raw.description?? raw.Description?? initialValues.description?? "",
        isActive: raw.isActive?? raw.IsActive?? initialValues.isActive?? true,
        // sellerId as FETCHED OBJECT, not selective
        sellerId: raw.sellerId?? raw.SellerId?? raw.seller?.sellerId?? raw.Seller?.SellerId?? initialValues.sellerId?? 0,
        seller: raw.seller?? raw.Seller?? initialValues.seller?? null, // <-- OBJECT
        productIds: raw.productIds?? raw.ProductIds?? initialValues.productIds?? [0]
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({...prev, [name]: checked }));
    } else if (name === "sellerId") {
      // sellerId is now fetched, not editable - but keep handler
      setFormData((prev) => ({...prev, sellerId: Number(value) || 0 }));
    } else {
      setFormData((prev) => ({...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.brandCode.trim()) {
      alert("Brand Code required");
      return;
    }
    if (!formData.brandName.trim()) {
      alert("Brand Name required");
      return;
    }

    const payload = {
      productIds: formData.productIds,
      brandName: formData.brandName.trim(),
      brandCode: formData.brandCode.trim(), // <-- FIXED
      description: formData.description.trim(),
      isActive: Boolean(formData.isActive),
      sellerId: Number(formData.sellerId), // <-- FROM OBJECT
      seller: formData.seller // <-- PASS FULL OBJECT ALSO
    };

    console.log("BrandForm FINAL PAYLOAD (with seller object):", payload);
    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        required
        label="Brand Code"
        name="brandCode"
        value={formData.brandCode}
        onChange={handleChange}
        margin="normal"
        placeholder="Ex: RLM"
      />

      <TextField
        fullWidth
        required
        label="Brand Name"
        name="brandName"
        value={formData.brandName}
        onChange={handleChange}
        margin="normal"
        placeholder="Ex: Realme"
      />

      {/* SELLER AS FETCHED OBJECT - NOT SELECTIVE */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: "#fafafa" }}>
        <Typography variant="subtitle2" gutterBottom>
          Seller Info (Fetched Object - Not Selectable)
        </Typography>

        {formData.seller? (
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} alignItems="center" flexWrap="wrap">
            <Chip label={`ID: ${formData.seller.sellerId?? formData.seller.SellerId?? formData.sellerId}`} color="primary" size="small" />
            <Chip label={formData.seller.sellerName?? formData.seller.SellerName?? formData.seller.name?? "Seller"} size="small" />
            <Typography variant="body2" color="text.secondary">
              {formData.seller.email?? formData.seller.Email?? ""}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            No seller object - using sellerId: {formData.sellerId || 0}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Seller ID (Fetched from Brand Object)"
          name="sellerId"
          type="number"
          value={formData.sellerId}
          onChange={handleChange}
          margin="normal"
          disabled // <-- NOT SELECTIVE, FETCHED
          helperText="SellerId comes from brand object (_raw), not from dropdown selection"
        />
      </Paper>

      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />

      <FormControlLabel
        control={
          <Switch
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
        }
        label={formData.isActive? "Active" : "Inactive"}
        sx={{ mt: 2, display: "block" }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
        productIds will be sent as [0] | seller as object: {formData.seller? "YES" : `ID ${formData.sellerId}`}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button type="submit" variant="contained">
          {initialValues? "Update (with object)" : "Create"}
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default BrandForm;