import React, { useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button,CircularProgress,Alert,Typography} from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const DeleteCategoryDialog = ({
    open,
    category,
    onClose,
    onDeleted
}) => {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleDelete = async () => {

        if (!category) return;

        try {

            setLoading(true);

            setError("");

            await apiService.deleteCategory(
                category.categoryId
            );

            if (onDeleted) {

                onDeleted();

            }

            onClose();

        }
        catch (err) {

            console.log(err);

            setError(
                err?.response?.data?.message ||
                "Unable to delete category."
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

                Delete Category

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

                    Are you sure you want to delete this Category?

                </DialogContentText>

                <Typography

                    variant="h6"

                    sx={{ mt: 2 }}

                >

                    {category?.categoryName}

                </Typography>

                <Typography

                    color="text.secondary"

                >

                    {category?.description || "-"}

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

                            ? <CircularProgress
                                size={18}
                                color="inherit"
                              />

                            : <DeleteForeverIcon />

                    }

                    onClick={handleDelete}

                >

                    {

                        loading

                            ? "Deleting..."

                            : "Delete"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteCategoryDialog;