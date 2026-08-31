// =========================================================
// DeleteProductTypeDialog.jsx
//
// React → Node server.js → ASP.NET Core API
//
// DELETE /api/product-types/:id
// =========================================================

import React, {
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";


// =========================================================
// NODE SERVER URL
// =========================================================

const NODE_API_URL = "http://localhost:5000";


// =========================================================
// DELETE PRODUCT TYPE DIALOG
// =========================================================

const DeleteProductTypeDialog = ({
    open,
    productType,
    onClose,
    onDeleted,
}) => {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // DELETE PRODUCT TYPE
    // =====================================================

    const handleDelete = async () => {

        if (!productType) {
            return;
        }


        const productTypeId =
            productType.productTypeId;


        try {

            setLoading(true);

            setError("");


            // =============================================
            // DEBUG
            // =============================================

            console.log(
                "Deleting Product Type:",
                productTypeId
            );


            // =============================================
            // REACT → NODE
            // =============================================

            const response =
                await axios.delete(

                    `${NODE_API_URL}/api/product-types/${productTypeId}`,

                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }

                );


            // =============================================
            // DEBUG RESPONSE
            // =============================================

            console.log(
                "Delete Product Type Response:",
                response.data
            );


            // =============================================
            // NOTIFY PARENT
            // =============================================

            if (onDeleted) {

                await onDeleted();

            }


            // =============================================
            // CLOSE DIALOG
            // =============================================

            onClose();

        }
        catch (err) {

            console.error(
                "Delete Product Type Error:",
                err
            );


            // =============================================
            // BACKEND ERROR MESSAGE
            // =============================================

            let message =
                "Unable to delete Product Type.";


            if (
                err?.response?.data?.message
            ) {

                message =
                    err.response.data.message;

            }
            else if (
                err?.response?.data?.title
            ) {

                message =
                    err.response.data.title;

            }
            else if (
                err?.message
            ) {

                message =
                    err.message;

            }


            setError(message);

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {

        if (loading) {
            return;
        }

        setError("");

        onClose();

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog

            open={open}

            onClose={
                loading
                    ? undefined
                    : handleClose
            }

            maxWidth="sm"

            fullWidth

        >

            {/* =============================================
                TITLE
            ============================================= */}

            <DialogTitle
                sx={{
                    fontWeight: "bold",
                }}
            >

                Delete Product Type

            </DialogTitle>


            {/* =============================================
                CONTENT
            ============================================= */}

            <DialogContent>

                {/* =========================================
                    ERROR
                ========================================= */}

                {
                    error && (

                        <Alert
                            severity="error"
                            sx={{
                                mb: 2,
                            }}
                        >

                            {
                                error
                            }

                        </Alert>

                    )
                }


                {/* =========================================
                    CONFIRMATION
                ========================================= */}

                <DialogContentText>

                    Are you sure you want to delete this
                    Product Type?

                </DialogContentText>


                {/* =========================================
                    PRODUCT TYPE NAME
                ========================================= */}

                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                        mt: 2,
                    }}
                >

                    {
                        productType?.productTypeName ||
                        "-"
                    }

                </Typography>


                {/* =========================================
                    DESCRIPTION
                ========================================= */}

                <Typography
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >

                    {
                        productType?.description ||
                        "-"
                    }

                </Typography>


                {/* =========================================
                    ID
                ========================================= */}

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mt: 1,
                    }}
                >

                    Product Type ID:{" "}

                    {
                        productType?.productTypeId ||
                        "-"
                    }

                </Typography>

            </DialogContent>


            {/* =============================================
                ACTIONS
            ============================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                }}
            >

                <Button

                    onClick={handleClose}

                    disabled={loading}

                >

                    Cancel

                </Button>


                <Button

                    color="error"

                    variant="contained"

                    disabled={
                        loading ||
                        !productType
                    }

                    startIcon={

                        loading ? (

                            <CircularProgress
                                size={18}
                                color="inherit"
                            />

                        ) : (

                            <DeleteForeverIcon />

                        )

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


// =========================================================
// EXPORT
// =========================================================

export default DeleteProductTypeDialog;
