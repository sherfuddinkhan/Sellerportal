import React, { useEffect, useState } from "react";
import {Paper,Typography,CircularProgress,Box,Snackbar,Alert} from "@mui/material";
import {useNavigate,useParams} from "react-router-dom";
import ProductForm from "./ProductForm";

const ProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });
    useEffect(() => {
        loadProduct();
    }, []);
    const loadProduct = async () => {
        try {
            setPageLoading(true);
            const response = await apiService.getProductById(id);
            setProduct(response.data);
        }
        catch (err) {
            console.log(err);
            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to load Product."
            });
        }
        finally {
            setPageLoading(false);
        }
    };
    const handleUpdate = async (values) => {
        try {
            setLoading(true);
            await apiService.updateProduct(id, values);
            setSnackbar({
                open: true,
                severity: "success",
                message: "Product updated successfully."
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
                message: "Unable to update Product."
            });
        }
        finally {
            setLoading(false);
        }
    };
    if (pageLoading)
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >
                <CircularProgress />
            </Box>
        );
    return (
        <Paper sx={{ p: 3 }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
            >
                Edit Product
            </Typography>
            <ProductForm
                initialValues={product}
                loading={loading}
                onSubmit={handleUpdate}
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

export default ProductEdit;