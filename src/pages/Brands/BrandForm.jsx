import React, { useState } from "react";
import {
    Box,
    TextField,
    Switch,
    FormControlLabel,
    Button
} from "@mui/material";

const BrandForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        brandName: "",
        description: "",
        isActive: true
    });

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.brandName.trim()) {
            alert("Brand Name is required.");
            return;
        }

        onSubmit(formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                mt: 3
            }}
        >

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
                control={
                    <Switch
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                    />
                }
                label="Active"
                sx={{ mt: 1 }}
            />

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3
                }}
            >

                <Button
                    type="submit"
                    variant="contained"
                >
                    Save
                </Button>

                <Button
                    type="button"
                    variant="outlined"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

            </Box>

        </Box>
    );
};

export default BrandForm;