import React, { useState } from "react";

import {
    Paper,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import ProductTypeForm from "./ProductTypeForm";

import apiService from "../../services/apiService";

const ProductTypeCreate = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({

        open: false,

        severity: "success",

        message: ""

    });

    const initialValues = {

        productTypeName: "",

        description: "",

        isActive: true

    };

    const handleSubmit = async (values) => {

        try {

            setLoading(true);

            await apiService.createProductType(values);

            setSnackbar({

                open: true,

                severity: "success",

                message: "Product Type created successfully."

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

                message: "Unable to create Product Type."

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

                Create Product Type

            </Typography>

            <ProductTypeForm

                initialValues={initialValues}

                loading={loading}

                onSubmit={handleSubmit}

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

export default ProductTypeCreate;