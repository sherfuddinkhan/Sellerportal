import React, { useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button,Typography,Alert,CircularProgress} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const DeleteProductDialog = ({
    open,
    product,
    onClose,
    onDeleted
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleDelete = async () => {
        if (!product) return;
        try {
            setLoading(true);
            setError("");
            await apiService.deleteProduct(product.productId);
            if (onDeleted) {
                onDeleted();
            }
            onClose();
        }
        catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                "Unable to delete Product."
            );
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Delete Product
            </DialogTitle>
            <DialogContent>
                {
                    error &&
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                }
                <DialogContentText>
                    Are you sure you want to delete this Product?
                </DialogContentText>
                <Typography
                    variant="h6"
                    sx={{ mt: 2 }}
                >
                    {product?.productName}
                </Typography>
                <Typography color="text.secondary">
                    SKU : {product?.sku}
                </Typography>
                <Typography color="text.secondary">
                    Brand : {product?.brandName}
                </Typography>
                <Typography color="text.secondary">
                    Category : {product?.categoryName}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    disabled={loading}
                    startIcon={
                        loading
                            ?
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                            :
                            <DeleteForeverIcon />
                    }
                    onClick={handleDelete}
                >
                    {
                        loading ? "Deleting..." : "Delete"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteProductDialog;