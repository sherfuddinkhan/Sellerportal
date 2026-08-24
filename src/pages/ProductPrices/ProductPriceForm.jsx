import React, { useEffect, useState } from "react";

import {Paper,Grid,TextField,MenuItem,Button,Switch,FormControlLabel,CircularProgress,Box} from "@mui/material";

const ProductPriceForm = ({
    initialValues,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        ProductPriceId: 0,
        ProductId: "",
        SellerId: "",
        PriceType: "Selling",
        Price: "",
        Currency: "INR",
        EffectiveFrom: "",
        EffectiveTo: "",
        IsActive: true,
        ...initialValues
    });

    // ===========================
    // Load Products
    // ===========================

    useEffect(() => {
        loadProducts();
    }, []);
    useEffect(() => {
        if (initialValues) {
            setFormData(prev => ({
                ...prev,
                ...initialValues
            }));
        }
    }, [initialValues]);

    const loadProducts = async () => {
        try {
            const response = await apiService.getProducts();
            setProducts(response.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    // ===========================
    // Change Handler
    // ===========================

    const handleChange = (e) => {

        const {name, value, checked,type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                type === "checkbox" ? checked : value
        }));
    };

    // ===========================
    // Validation
    // ===========================
    const validate = () => {
        const temp = {};
        if (!formData.ProductId)
            temp.ProductId = "Product is required.";
        if (!formData.PriceType)
            temp.PriceType = "Price Type is required.";
        if (formData.Price === "" ||
            Number(formData.Price) <= 0
        )
            temp.Price = "Price must be greater than zero.";
        if (!formData.Currency)
            temp.Currency = "Currency is required.";
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    // ===========================
    // Submit
    // ===========================

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(formData);
    }
        return (
        <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Product"
                            name="ProductId"
                            value={formData.ProductId}
                            onChange={handleChange}
                            error={!!errors.ProductId}
                            helperText={errors.ProductId}
                        >
                            {
                                products.map(product => (
                                    <MenuItem
                                        key={product.ProductId}
                                        value={product.ProductId}
                                    >
                                        {
                                            product.ProductName ||
                                            product.SKU
                                        }
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Price Type"
                            name="PriceType"
                            value={formData.PriceType}
                            onChange={handleChange}
                            error={!!errors.PriceType}
                            helperText={errors.PriceType}
                        >
                            <MenuItem value="Purchase">
                                Purchase
                            </MenuItem>
                            <MenuItem value="Selling">
                                Selling
                            </MenuItem>
                            <MenuItem value="Wholesale">
                                Wholesale
                            </MenuItem>
                            <MenuItem value="Retail">
                                Retail
                            </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Price"
                            name="Price"
                            value={formData.Price}
                            onChange={handleChange}
                            error={!!errors.Price}
                            helperText={errors.Price}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Currency"
                            name="Currency"
                            value={formData.Currency}
                            onChange={handleChange}
                            error={!!errors.Currency}
                            helperText={errors.Currency}
                        >
                            <MenuItem value="INR">
                                INR
                            </MenuItem>
                            <MenuItem value="USD">
                                USD
                            </MenuItem>
                            <MenuItem value="EUR">
                                EUR
                            </MenuItem>
                            <MenuItem value="GBP">
                                GBP
                            </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Effective From"
                            name="EffectiveFrom"
                            value={ formData.EffectiveFrom ? formData.EffectiveFrom.substring(0, 10) : "" }
                            onChange={handleChange}
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Effective To"
                            name="EffectiveTo"
                            value={ formData.EffectiveTo ? formData.EffectiveTo.substring(0, 10) : "" }
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={ formData.IsActive}
                                    onChange={handleChange}
                                    name="IsActive"
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            gap={2}
                        >
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                            >
                                {
                                    loading ? (
                                            <CircularProgress
                                                size={22}
                                                color="inherit"
                                            />
                                        )
                                        : ( "Save")
                                }
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );

};

export default ProductPriceForm;
