import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Grid,Typography,Button,Divider,Chip} from "@mui/material";
const Row = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={4}>
            <Typography
                fontWeight="bold"
            >
                {label}
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography>
                {value || "-"}
            </Typography>
        </Grid>
    </Grid>
);

const CategoryModal = ({
    open,
    category,
    onClose
}) => {
    if (!category) return null;
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Category Details
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ mt: 2 }}>
                <Row
                    label="Category Name"
                    value={category.categoryName}
                />
                <Row
                    label="Description"
                    value={category.description}
                />
                <Row
                    label="Parent Category"
                    value={category.parentCategoryName}
                />
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    <Grid item xs={4}>
                        <Typography
                            fontWeight="bold"
                        >
                            Status
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
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

                            size="small"
                        />
                    </Grid>
                </Grid>
                <Row
                    label="Created Date"
                    value={
                        category.createdDate
                            ? new Date(category.createdDate).toLocaleString()
                            : "-"
                    }
                />
                <Row
                    label="Updated Date"
                    value={
                        category.updatedDate
                            ? new Date(category.updatedDate).toLocaleString()
                            : "-"
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryModal;