import React, { useState } from "react";
import {
    Paper,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";
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

            console.log("Category created:", data);

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
                message:
                    err.message || "Unable to create Category.",
                severity: "error"
            });
        } finally {
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
                Create Category
            </Typography>

            <CategoryForm
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/categories")}
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

export default CategoryCreate;
