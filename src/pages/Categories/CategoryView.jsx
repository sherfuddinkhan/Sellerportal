// =========================================================
// CategoryView.jsx - CLEAN & POLISHED UI
// Category Grid View - Only Categories
// =========================================================

import React from "react";
import { Grid, Box, Typography, CircularProgress, Alert } from "@mui/material";
import CategoryCard from "./CategoryCard";

const CategoryView = ({ 
    categories = [], 
    loading = false,
    error = "",
    onView,
    onEdit,
    onViewProducts,
    onAddSubcategory,
    onToggleStatus,
    onDelete
}) => {

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ borderRadius: 2, border: "1px solid", borderColor: "error.light" }}>{error}</Alert>;
    }

    if (!categories || categories.length === 0) {
        return (
            <Box sx={{ 
                textAlign: "center", 
                p: 6, 
                border: "1px dashed", 
                borderColor: "divider", 
                borderRadius: 3, 
                bgcolor: "#f8fafc" 
            }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>No categories found</Typography>
                <Typography variant="caption" color="text.secondary">Create a new category to get started</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2.5}>
            {categories.map((category) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={category.categoryId}
                >
                    <CategoryCard
                        category={category}
                        onView={onView}
                        onEdit={onEdit}
                        onViewProducts={onViewProducts}
                        onAddSubcategory={onAddSubcategory}
                        onToggleStatus={onToggleStatus}
                        onDelete={onDelete}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default CategoryView;