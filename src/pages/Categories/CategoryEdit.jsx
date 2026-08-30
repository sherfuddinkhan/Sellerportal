// =========================================================
// CategoryEdit.jsx
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import CategoryForm from "./CategoryForm";

// =========================================================
// SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CategoryEdit = () => {

    const navigate = useNavigate();

    const { categoryId } =
        useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [category, setCategory] =
        useState({

            categoryName: "",

            parentCategoryId: "",

            description: "",

            isActive: true

        });

    // =====================================================
    // LOAD CATEGORY
    // =====================================================

    const loadCategory = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "GET CATEGORY:",
                categoryId
            );

            const response =
                await axios.get(

                    `${SERVER_URL}/api/Category/${categoryId}`,

                    {
                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CATEGORY DETAILS:",
                response.data
            );

            let data =
                response.data;

            // Handle wrapped response

            if (
                data &&
                data.data
            ) {

                data =
                    data.data;

            }

            if (
                data &&
                data.item
            ) {

                data =
                    data.item;

            }

            setCategory({

                categoryId:
                    data.categoryId,

                categoryName:
                    data.categoryName ||
                    "",

                parentCategoryId:
                    data.parentCategoryId ??
                    "",

                description:
                    data.description ||
                    "",

                isActive:
                    data.isActive ??
                    true

            });

        }
        catch (err) {

            console.error(
                "Category loading error:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to load category";

            setError(
                typeof message === "string"
                    ? message
                    : "Failed to load category"
            );

            setSnackbarOpen(true);

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (categoryId) {

            loadCategory();

        }

    }, [categoryId]);

    // =====================================================
    // SAVE CATEGORY
    // =====================================================

    const handleSubmit = async (
        formData
    ) => {

        try {

            setSaving(true);

            setError("");

            console.log(
                "UPDATE CATEGORY:",
                formData
            );

            const payload = {

                categoryName:
                    formData.categoryName,

                parentCategoryId:
                    formData.parentCategoryId
                        ? Number(
                            formData.parentCategoryId
                        )
                        : null,

                description:
                    formData.description,

                isActive:
                    Boolean(
                        formData.isActive
                    )

            };

            await axios.put(

                `${SERVER_URL}/api/Category/${categoryId}`,

                payload,

                {
                    headers: {

                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"

                    },

                    timeout: 30000

                }

            );

            console.log(
                "CATEGORY UPDATED"
            );

            navigate(
                "/categories"
            );

        }
        catch (err) {

            console.error(
                "Category update error:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to update category";

            setError(
                typeof message === "string"
                    ? message
                    : "Failed to update category"
            );

            setSnackbarOpen(true);

        }
        finally {

            setSaving(false);

        }

    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate(
            "/categories"
        );

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400
                }}
            >

                <CircularProgress />

            </Box>

        );

    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box>

            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    fontWeight: 600
                }}
            >

                Edit Category

            </Typography>

            <Paper
                sx={{
                    p: 3
                }}
            >

                <CategoryForm

                    initialValues={
                        category
                    }

                    loading={
                        saving
                    }

                    onSubmit={
                        handleSubmit
                    }

                    onCancel={
                        handleCancel
                    }

                />

            </Paper>

            {/* =============================================
                ERROR
            ============================================== */}

            <Snackbar

                open={
                    snackbarOpen
                }

                autoHideDuration={
                    5000
                }

                onClose={() =>
                    setSnackbarOpen(false)
                }

            >

                <Alert
                    severity="error"
                    onClose={() =>
                        setSnackbarOpen(false)
                    }

                    sx={{
                        width: "100%"
                    }}
                >

                    {error}

                </Alert>

            </Snackbar>

        </Box>

    );

};

export default CategoryEdit;
