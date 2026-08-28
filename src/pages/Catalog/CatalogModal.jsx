// ============================================================
// CatalogModal.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Switch,
    MenuItem,
    CircularProgress,
    Alert,
} from "@mui/material";

const initialForm = {
    productId: "",
    categoryId: "",
    brandId: "",
    catalogName: "",
    description: "",
    price: "",
    stockQuantity: "",
    isActive: true,
};

const CatalogModal = ({
    open,
    onClose,
    onSave,
    catalog = null,
    products = [],
    categories = [],
    brands = [],
}) => {
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ========================================================
    // Populate form for Add / Edit
    // ========================================================

    useEffect(() => {
        if (catalog) {
            setFormData({
                productId: catalog.productId ?? "",
                categoryId: catalog.categoryId ?? "",
                brandId: catalog.brandId ?? "",
                catalogName: catalog.catalogName ?? "",
                description: catalog.description ?? "",
                price: catalog.price ?? "",
                stockQuantity: catalog.stockQuantity ?? "",
                isActive:
                    catalog.isActive !== undefined
                        ? catalog.isActive
                        : true,
            });
        } else {
            setFormData(initialForm);
        }

        setError("");
    }, [catalog, open]);

    // ========================================================
    // Handle input
    // ========================================================

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ========================================================
    // Submit
    // ========================================================

    const handleSubmit = async () => {
        setError("");

        if (!formData.productId) {
            setError("Please select a product.");
            return;
        }

        if (!formData.catalogName.trim()) {
            setError("Catalog name is required.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                productId: Number(formData.productId),
                categoryId: formData.categoryId
                    ? Number(formData.categoryId)
                    : null,
                brandId: formData.brandId
                    ? Number(formData.brandId)
                    : null,
                price: formData.price
                    ? Number(formData.price)
                    : 0,
                stockQuantity: formData.stockQuantity
                    ? Number(formData.stockQuantity)
                    : 0,
            };

            await onSave(payload);

            setFormData(initialForm);
            onClose();
        } catch (err) {
            console.error("Catalog save error:", err);

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to save catalog."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // Close
    // ========================================================

    const handleClose = () => {
        if (!loading) {
            setFormData(initialForm);
            setError("");
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {catalog ? "Edit Catalog" : "Add Catalog"}
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mt: 0.5 }}>

                    {/* Product */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            select
                            label="Product"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="">
                                Select Product
                            </MenuItem>

                            {products.map((product) => (
                                <MenuItem
                                    key={product.productId}
                                    value={product.productId}
                                >
                                    {product.productName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Catalog Name */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Catalog Name"
                            name="catalogName"
                            value={formData.catalogName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            select
                            label="Category"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                Select Category
                            </MenuItem>

                            {categories.map((category) => (
                                <MenuItem
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.categoryName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Brand */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            select
                            label="Brand"
                            name="brandId"
                            value={formData.brandId}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                Select Brand
                            </MenuItem>

                            {brands.map((brand) => (
                                <MenuItem
                                    key={brand.brandId}
                                    value={brand.brandId}
                                >
                                    {brand.brandName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Price */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01",
                            }}
                        />
                    </Grid>

                    {/* Stock */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Stock Quantity"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                            }}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Active */}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isActive"
                                    checked={formData.isActive}
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
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={22} />
                    ) : catalog ? (
                        "Update Catalog"
                    ) : (
                        "Create Catalog"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CatalogModal;