import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BrandForm from "./BrandForm";

const SERVER_URL = "http://localhost:5000";

const BrandCreate = () => {
  const navigate = useNavigate();

  const handleSave = async (values) => {
    try {
      // FIX: Build full payload that your API expects
      const payload = {
        productIds: values.productIds?? [0], // required by your DTO
        brandName: values.brandName?.trim(),
        description: values.description?.trim() || "",
        brandCode: values.brandCode?.trim() || "",
        isActive: Boolean(values.isActive),
        sellerId: values.sellerId?? 0 // required by your DTO
      };

      console.log("Creating Brand Payload:", payload);

      const response = await fetch(`${SERVER_URL}/api/Brand`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);
      console.log("Brand Created Response:", data);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || data?.title || "Unable to create brand.");
      }

      alert("Brand Created Successfully.");
      navigate("/brands");
    } catch (error) {
      console.error("Create Brand Error:", error);
      alert(error.message || "Unable to Create Brand.");
    }
  };

  const handleCancel = () => navigate("/brands");

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>Create Brand</Typography>
        <BrandForm onSubmit={handleSave} onCancel={handleCancel} />
      </Paper>
    </Box>
  );
};

export default BrandCreate;
