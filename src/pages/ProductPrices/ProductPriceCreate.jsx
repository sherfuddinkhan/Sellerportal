import React, { useState } from "react";
import {Typography,Snackbar,Alert} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ProductPriceForm from "./ProductPriceForm";

const ProductPriceCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            await apiService.createProductPrice(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate("/product-prices");
            }, 1000);
        }
        catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                "Failed to create Product Price."
            );
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Create Product Price
            </Typography>
            <ProductPriceForm
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate("/product-prices")
                }
            />
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccess(false)
                }
            >
                <Alert severity="success">
                    Product Price created successfully.
                </Alert>
            </Snackbar>
            <Snackbar
                open={Boolean(error)}
                autoHideDuration={4000}
                onClose={() =>
                    setError("")
                }
            >
                <Alert severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </>
    );

};

export default ProductPriceCreate;