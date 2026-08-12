import React, { useState } from "react";
import apiService from "../../services/apiService";
import {Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button,CircularProgress,Alert,Typography} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import apiService from "../../services/apiService";

const DeleteBrandDialog = ({open,brand,onClose,onDeleted}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleDelete = async () => {
        if (!brand) return;
        try {
            setLoading(true);
            setError("");
            await apiService.deleteBrand(brand.brandId);
            if (onDeleted) {
                onDeleted();
            }
            onClose();
        }
        catch (err) {
            console.error(err);
            setError("Unable to delete Brand.");
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <Dialog
            open={open}
            onClose={loading ? null : onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Delete Brand
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
                    Are you sure you want to delete this Brand?
                </DialogContentText>
                <Typography
                    variant="h6"
                    sx={{ mt: 2 }}
                >
                    {brand?.brandName}
                </Typography>
                <Typography
                    color="text.secondary"
                >
                    {brand?.description}
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
                    startIcon={
                        loading
                            ? <CircularProgress size={18} color="inherit" />
                            : <DeleteForeverIcon />
                    }
                    disabled={loading}
                    onClick={handleDelete}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteBrandDialog;