import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import BrandForm from "./BrandForm";

const SERVER_URL = "http://localhost:5000";

const BrandEdit = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD BRAND
    // =====================================================

    useEffect(() => {

        if (!id || id === ":id" || !/^\d+$/.test(id)) {
            setError(`Invalid Brand ID: ${id}`);
            setLoading(false);
            return;
        }

        loadBrand();

    }, [id]);


    const loadBrand = async () => {

        try {

            setLoading(true);
            setError("");

            console.log("=================================");
            console.log("FRONTEND - LOAD BRAND");
            console.log("Brand ID:", id);
            console.log(
                "URL:",
                `${SERVER_URL}/api/brand/${id}`
            );
            console.log("=================================");

            const response = await fetch(
                `${SERVER_URL}/api/brand/${id}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const data = await response.json();

            console.log(
                "Frontend GET response:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.title ||
                    `HTTP ${response.status}`
                );
            }

            setBrand(data);

        } catch (err) {

            console.error(
                "Load Brand Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load Brand."
            );

            setBrand(null);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // UPDATE BRAND
    // =====================================================

    const handleUpdate = async (values) => {

        try {

            setError("");

            console.log("=================================");
            console.log("FRONTEND - UPDATE BRAND");
            console.log("Brand ID:", id);
            console.log("Values:", values);
            console.log(
                "URL:",
                `${SERVER_URL}/api/brand/${id}`
            );
            console.log("=================================");

            const requestBody = {
                brandId: Number(id),
                brandName: values.brandName,
                description: values.description,
                isActive: Boolean(values.isActive)
            };

            const response = await fetch(
                `${SERVER_URL}/api/brand/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            const data = await response.json();

            console.log(
                "Frontend PUT response:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.title ||
                    `HTTP ${response.status}`
                );
            }

            alert("Brand Updated Successfully.");

            navigate("/brands");

        } catch (err) {

            console.error(
                "Update Brand Error:",
                err
            );

            setError(
                err.message ||
                "Unable to Update Brand."
            );

        }
    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {
        navigate("/brands");
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Box p={3}>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>
        );
    }


    // =====================================================
    // BRAND NOT FOUND
    // =====================================================

    if (!brand) {

        return (
            <Box p={3}>

                <Alert severity="warning">
                    Brand not found.
                </Alert>

            </Box>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <Box p={3}>

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Edit Brand
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Brand ID: {brand.brandId}
                </Typography>

                <BrandForm
                    initialValues={brand}
                    onSubmit={handleUpdate}
                    onCancel={handleCancel}
                />

            </Paper>

        </Box>
    );
};

export default BrandEdit;
