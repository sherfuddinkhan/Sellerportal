import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    Alert
} from "@mui/material";

const SERVER_URL = "http://localhost:5000";

const DeleteBrandModelDialog = ({
    open,
    onClose,
    model,
    onDeleted
}) => {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (!model?.brandModelId) {
            setError("Brand model ID is missing.");
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/brandmodels/${model.brandModelId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "Failed to delete brand model."
                );
            }

            onDeleted?.(model.brandModelId);
            onClose();

        } catch (err) {
            console.error("Delete brand model error:", err);

            setError(
                err.message || "Unable to delete brand model."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleClose = () => {
        if (!deleting) {
            setError("");
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Delete Brand Model
            </DialogTitle>

            <DialogContent>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <DialogContentText>
                    Are you sure you want to delete the brand model{" "}
                    <strong>
                        {model?.modelName || "this model"}
                    </strong>
                    ?
                </DialogContentText>

                <DialogContentText sx={{ mt: 1 }}>
                    This action cannot be undone.
                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={handleClose}
                    disabled={deleting}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                    disabled={deleting}
                >
                    {deleting ? (
                        <>
                            <CircularProgress
                                size={20}
                                sx={{ mr: 1 }}
                            />
                            Deleting...
                        </>
                    ) : (
                        "Delete"
                    )}
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default DeleteBrandModelDialog;

