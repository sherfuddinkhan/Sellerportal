import React, { useEffect, useState } from "react";
import {Paper,Grid,Typography,Chip,Divider,Button,CircularProgress,Box} from "@mui/material";
import {ArrowBack,Edit} from "@mui/icons-material";
import {useNavigate,useParams} from "react-router-dom";
const ProductDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    useEffect(() => {
        loadProduct();
    }, []);
    const loadProduct = async () => {
        try {
            setLoading(true);
            const response =
                await apiService.getProductById(id);
            setProduct(response.data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >
                <CircularProgress />
            </Box>
        );
    if (!product)
        return (
            <Typography>
                Product not found.
            </Typography>
        );
    return (
        <Paper sx={{ p: 4 }}>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Product Details
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        sx={{ mr: 2 }}
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(`/products/edit/${id}`)
                        }
                    >
                        Edit
                    </Button>
                </Box>
            </Grid>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Product ID
                    </Typography>
                    <Typography variant="h6">
                        {product.ProductId}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Seller ID
                    </Typography>
                    <Typography>
                        {product.SellerId}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        SKU
                    </Typography>
                    <Typography>
                        {product.SKU}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Product Name
                    </Typography>
                    <Typography>
                        {product.ProductName}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography color="text.secondary">
                        Description
                    </Typography>
                    <Typography>
                        {product.Description || "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography color="text.secondary">
                        Brand
                    </Typography>
                    <Typography>
                        {product.BrandName ||
                            product.BrandId ||
                            "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography color="text.secondary">
                        Category
                    </Typography>
                    <Typography>
                        {product.CategoryName ||
                            product.CategoryId ||
                            "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography color="text.secondary">
                        Product Type
                    </Typography>
                    <Typography>
                        {product.ProductTypeName ||
                            product.ProductTypeId ||
                            "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Barcode
                    </Typography>
                    <Typography>
                        {product.Barcode || "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        HSN Code
                    </Typography>
                    <Typography>
                        {product.HSNCode || "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography color="text.secondary">
                        Unit
                    </Typography>
                    <Typography>
                        {product.UnitOfMeasure || "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography color="text.secondary">
                        Weight
                    </Typography>
                    <Typography>
                        {product.Weight || 0}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Typography color="text.secondary">
                        Length
                    </Typography>
                    <Typography>
                        {product.Length || 0}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Typography color="text.secondary">
                        Width
                    </Typography>
                    <Typography>
                        {product.Width || 0}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Typography color="text.secondary">
                        Height
                    </Typography>
                    <Typography>
                        {product.Height || 0}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Status
                    </Typography>
                    <Typography>
                        {product.Status || "-"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Active
                    </Typography>
                    <Chip
                        label={
                            product.IsActive
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            product.IsActive
                                ? "success"
                                : "error"
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Created Date
                    </Typography>
                    <Typography>
                        {
                            product.CreatedDate?new Date(product.CreatedDate).toLocaleString():"-"
                        }
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography color="text.secondary">
                        Updated Date
                    </Typography>
                    <Typography>
                        {
                            product.UpdatedDate ? new Date(product.UpdatedDate).toLocaleString():"-"
                        }
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ProductDetails;