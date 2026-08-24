import React, { useState } from "react";
import {Paper,Typography,Snackbar,Alert} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

const ProductCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const initialValues = {
        productName: "",
        sku: "",
        barcode: "",
        brandId: "",
        categoryId: "",
        productTypeId: "",
        costPrice: 0,
        sellingPrice: 0,
        stockQuantity: 0,
        reorderLevel: 0,
        unit: "",
        hsnCode: "",
        description: "",
        isActive: true
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            await apiService.createProduct(values);
            setSnackbar({
                open: true,
                severity: "success",
                message: "Product created successfully."
            });
            setTimeout(() => {
                navigate("/products");
            }, 1000);
        }
        catch (err) {
            console.log(err);
            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to create Product."
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <Paper sx={{ p: 3 }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
            >
                Create Product
            </Typography>
            <ProductForm
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate("/products")
                }
            />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ProductCreate;