import React, { useEffect, useState } from "react";

import {
    Paper,
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

import ProductTypeForm from "./ProductTypeForm";

import apiService from "../../services/apiService";

const ProductTypeEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const [productType, setProductType] = useState({

        productTypeName: "",

        description: "",

        isActive: true

    });

    const [snackbar, setSnackbar] = useState({

        open: false,

        severity: "success",

        message: ""

    });

    useEffect(() => {

        loadProductType();

    }, []);

    const loadProductType = async () => {

        try {

            setPageLoading(true);

            const response =
                await apiService.getProductTypeById(id);

            setProductType(response.data);

        }

        catch (err) {

            console.log(err);

            setSnackbar({

                open: true,

                severity: "error",

                message: "Unable to load Product Type."

            });

        }

        finally {

            setPageLoading(false);

        }

    };

    const handleUpdate = async (values) => {

        try {

            setLoading(true);

            await apiService.updateProductType(id, values);

            setSnackbar({

                open: true,

                severity: "success",

                message: "Product Type updated successfully."

            });

            setTimeout(() => {

                navigate("/product-types");

            }, 1000);

        }

        catch (err) {

            console.log(err);

            setSnackbar({

                open: true,

                severity: "error",

                message: "Unable to update Product Type."

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

                Edit Product Type

            </Typography>

            <ProductTypeForm

                initialValues={productType}

                loading={loading}

                onSubmit={handleUpdate}

                onCancel={() =>

                    navigate("/product-types")

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

export default ProductTypeEdit;