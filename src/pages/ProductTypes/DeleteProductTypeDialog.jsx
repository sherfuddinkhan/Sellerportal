import React, { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Alert,
    CircularProgress
} from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import apiService from "../../services/apiService";

const DeleteProductTypeDialog = ({
    open,
    productType,
    onClose,
    onDeleted
}) => {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleDelete = async () => {

        if (!productType) return;

        try {

            setLoading(true);

            setError("");

            await apiService.deleteProductType(
                productType.productTypeId
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

                "Unable to delete Product Type."

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

                Delete Product Type

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

                    Are you sure you want to delete this Product Type?

                </DialogContentText>

                <Typography

                    variant="h6"

                    sx={{ mt: 2 }}

                >

                    {productType?.productTypeName}

                </Typography>

                <Typography color="text.secondary">

                    {productType?.description || "-"}

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

                        loading

                            ?

                            "Deleting..."

                            :

                            "Delete"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteProductTypeDialog;