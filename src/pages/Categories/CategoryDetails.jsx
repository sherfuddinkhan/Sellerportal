// =========================================================
// CategoryDetails.jsx
// =========================================================

import React, { useCallback, useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import axios from "axios";

// =========================================================
// CONFIG
// =========================================================

const API_URL = "http://localhost:5000/api";

// =========================================================
// COMPONENT
// =========================================================

const CategoryDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [category, setCategory] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD CATEGORY
    // =====================================================

    const loadCategory = useCallback(async () => {

        if (!id) {
            setError("Category ID is missing.");
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading category:",
                id
            );

            const response = await axios.get(
                `${API_URL}/categories/${id}`
            );

            console.log(
                "Category Details Response:",
                response.data
            );

            setCategory(response.data);

        } catch (err) {

            console.error(
                "Category Details Error:",
                err
            );

            if (err.response) {

                setError(
                    err.response.data?.message ||
                    err.response.data ||
                    `Failed to load category ${id}.`
                );

            } else if (err.request) {

                setError(
                    "Unable to connect to the server."
                );

            } else {

                setError(
                    err.message ||
                    "Failed to load category."
                );
            }

            setCategory(null);

        } finally {

            setLoading(false);

        }

    }, [id]);

    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {

        loadCategory();

    }, [loadCategory]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
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

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    onClick={() =>
                        navigate("/categories")
                    }
                >
                    Back to Categories
                </Button>

            </Box>
        );
    }

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!category) {

        return (
            <Box p={3}>

                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    Category not found.
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    onClick={() =>
                        navigate("/categories")
                    }
                >
                    Back to Categories
                </Button>

            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box p={3}>

            <Paper sx={{ p: 4 }}>

                {/* =================================================
                    HEADER
                ================================================= */}

                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Category Details
                    </Typography>

                    <Box>

                        <Button
                            startIcon={<ArrowBack />}
                            sx={{ mr: 2 }}
                            variant="outlined"
                            onClick={() =>
                                navigate("/categories")
                            }
                        >
                            Back
                        </Button>

                        <Button
                            startIcon={<Edit />}
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    `/categories/edit/${id}`
                                )
                            }
                        >
                            Edit
                        </Button>

                    </Box>

                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* =================================================
                    DETAILS
                ================================================= */}

                <Grid container spacing={3}>

                    {/* Category ID */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            color="text.secondary"
                        >
                            Category ID
                        </Typography>

                        <Typography variant="h6">
                            {category.categoryId}
                        </Typography>

                    </Grid>

                    {/* Category Name */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            color="text.secondary"
                        >
                            Category Name
                        </Typography>

                        <Typography variant="h6">
                            {category.categoryName}
                        </Typography>

                    </Grid>

                    {/* Parent Category */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            color="text.secondary"
                        >
                            Parent Category
                        </Typography>

                        <Typography variant="h6">
                            {category.parentCategoryName || "Root"}
                        </Typography>

                    </Grid>

                    {/* Status */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Status
                        </Typography>

                        <Chip
                            label={
                                category.isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                category.isActive
                                    ? "success"
                                    : "error"
                            }
                        />

                    </Grid>

                    {/* Description */}

                    <Grid item xs={12}>

                        <Typography
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Description
                        </Typography>

                        <Typography>
                            {category.description || "-"}
                        </Typography>

                    </Grid>

                    {/* Created Date */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography>
                            {
                                category.createdDate
                                    ? new Date(
                                        category.createdDate
                                    ).toLocaleString()
                                    : "-"
                            }
                        </Typography>

                    </Grid>

                    {/* Updated Date */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>

                        <Typography>
                            {
                                category.updatedDate
                                    ? new Date(
                                        category.updatedDate
                                    ).toLocaleString()
                                    : "-"
                            }
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

        </Box>
    );
};

export default CategoryDetails;