import React, { useEffect, useState } from "react";

import {
    Typography,
    CircularProgress,
    Box,
    Snackbar,
    Alert
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import apiService from "../../services/apiService";

import ProductPriceForm from "./ProductPriceForm";

const ProductPriceEdit = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [productPrice, setProductPrice] = useState(null);

    const [success, setSuccess] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        loadProductPrice();

    }, []);

    const loadProductPrice = async () => {

        try {

            setLoading(true);

            const response =

                await apiService.getProductPriceById(id);

            setProductPrice(response.data);

        }

        catch (err) {

            console.log(err);

            setError("Unable to load Product Price.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleUpdate = async (data) => {

        try {

            setSaving(true);

            await apiService.updateProductPrice(

                id,

                data

            );

            setSuccess(true);

            setTimeout(() => {

                navigate("/product-prices");

            }, 1000);

        }

        catch (err) {

            console.log(err);

            setError(

                err?.response?.data?.message ||

                "Failed to update Product Price."

            );

        }

        finally {

            setSaving(false);

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

    return (

        <>

            <Typography

                variant="h4"

                fontWeight="bold"

                mb={3}

            >

                Edit Product Price

            </Typography>

            <ProductPriceForm

                initialValues={productPrice}

                loading={saving}

                onSubmit={handleUpdate}

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

                    Product Price updated successfully.

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

export default ProductPriceEdit;