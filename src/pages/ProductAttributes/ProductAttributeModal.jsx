import React, { useEffect, useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,TextField,FormControlLabel,Checkbox} from "@mui/material";

const ProductAttributeModal = ({
    open,
    attribute,
    onClose,
    onSave
}) => {
    const initialState = {
        ProductAttributeId: 0,
        ProductId: "",
        AttributeName: "",
        AttributeValue: "",
        AttributeType: "",
        IsRequired: false,
        IsActive: true
    };

    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
        if (attribute) {
            setFormData({
                ProductAttributeId: attribute.ProductAttributeId || 0,
                ProductId: attribute.ProductId || "",
                AttributeName: attribute.AttributeName || "",
                AttributeValue: attribute.AttributeValue || "",
                AttributeType: attribute.AttributeType || "",
                IsRequired: attribute.IsRequired || false,
                IsActive: attribute.IsActive ?? true
            });
        }
        else {
            setFormData(initialState);
        }
    }, [attribute, open]);

    const handleChange = (e) => {
        const {name,value,checked,type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };
    const handleSubmit = () => {
        if (
            !formData.ProductId ||
            !formData.AttributeName.trim()
        ) {
            alert(
                "Product ID and Attribute Name are required."
            );
            return;
        }
        onSave(formData);
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {
                    formData.ProductAttributeId
                        ? "Edit Product Attribute"
                        : "Add Product Attribute"
                }
            </DialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 0.5 }}
                >
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Product ID"
                            name="ProductId"
                            type="number"
                            value={formData.ProductId}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Attribute Name"
                            name="AttributeName"
                            value={formData.AttributeName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Attribute Value"
                            name="AttributeValue"
                            value={formData.AttributeValue}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Attribute Type"
                            name="AttributeType"
                            value={formData.AttributeType}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="IsRequired"
                                    checked={formData.IsRequired}
                                    onChange={handleChange}
                                />
                            }
                            label="Required"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="IsActive"
                                    checked={formData.IsActive}
                                    onChange={handleChange}
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    { formData.ProductAttributeId ? "Update" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ProductAttributeModal;