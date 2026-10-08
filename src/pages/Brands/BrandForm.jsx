import React, { useEffect, useState } from "react";
import { Box, TextField, Switch, FormControlLabel, Button } from "@mui/material";

const BrandForm = ({ initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    brandCode: "",
    brandName: "",
    description: "",
    isActive: true
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        brandCode: initialValues.brandCode?? initialValues.BrandCode?? "",
        brandName: initialValues.brandName?? initialValues.BrandName?? "",
        description: initialValues.description?? initialValues.Description?? "",
        isActive: initialValues.isActive?? initialValues.IsActive?? true
      });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((prev) => ({
    ...prev,
      [name]: type === "checkbox"? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.brandCode.trim()) { alert("Brand Code is required."); return; }
    if (!formData.brandName.trim()) { alert("Brand Name is required."); return; }
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

      <TextField
        fullWidth
        required
        label="Brand Code"
        name="brandCode"
        placeholder="Ex: RLM, SMSG, APL"
        value={formData.brandCode}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        required
        label="Brand Name"
        name="brandName"
        value={formData.brandName}
        onChange={handleChange}
        margin="normal"
      />

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
        control={<Switch name="isActive" checked={formData.isActive} onChange={handleChange} />}
        label={formData.isActive? "Active" : "Inactive"}
        sx={{ mt: 1 }}
      />

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button type="submit" variant="contained">{initialValues? "Update" : "Save"}</Button>
        <Button type="button" variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default BrandForm;