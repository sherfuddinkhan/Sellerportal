import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Snackbar,
    Alert,
    Button,
    Divider,
    Stack
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useNavigate } from "react-router-dom";
import CategoryForm from "./CategoryForm";

const SERVER_URL = "http://localhost:5000";

const CategoryCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const initialValues = {
        categoryName: "",
        description: "",
        parentCategoryId: null,
        isActive: true
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const response = await fetch(
                `${SERVER_URL}/api/category`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Unable to create category."
                );
            }

            setSnackbar({
                open: true,
                message: "Category created successfully.",
                severity: "success"
            });

            setTimeout(() => {
                navigate("/categories");
            }, 1000);

        } catch (err) {
            console.error("Create Category Error:", err);
            setSnackbar({
                open: true,
                message: err.message || "Unable to create Category.",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 3 } }}>
            {/* Back Navigation */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/categories")}
                sx={{ mb: 3, color: "text.secondary", textTransform: "none", fontWeight: 500 }}
            >
                Back to Categories
            </Button>

            {/* Main Form Container */}
            <Paper 
                elevation={0} 
                variant="outlined" 
                sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, borderColor: "divider" }}
            >
                {/* Main Heading */}
                <Typography variant="h5" fontWeight="600" color="text.primary" gutterBottom>
                    Create New Category
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Fill out the information below to structure your product catalog efficiently.
                </Typography>

                <Divider sx={{ mb: 4 }} />

                {/* Neatly Spaced Sections inside the Form wrapper */}
                <Stack spacing={4}>
                    {/* Section 1 Heading */}
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <InfoOutlinedIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                                Basic Information
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Provide the core details such as the category name and description.
                        </Typography>
                    </Box>

                    {/* Section 2 / Form Component */}
                    <CategoryForm
                        initialValues={initialValues}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/categories")}
                    />
                </Stack>
            </Paper>

            {/* Feedback Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoryCreate;