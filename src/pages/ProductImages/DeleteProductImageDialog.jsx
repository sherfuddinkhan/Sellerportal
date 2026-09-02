// =========================================================
// DeleteProductImageDialog.jsx
// Delete Product Image Confirmation Dialog
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box
} from "@mui/material";

// =========================================================
// DeleteProductImageDialog
// =========================================================

const DeleteProductImageDialog = ({
    open,
    image,
    onClose,
    onDeleted
}) => {

    // =====================================================
    // No Image Selected
    // =====================================================

    if (!image) {
        return null;
    }

    // =====================================================
    // Support PascalCase / camelCase
    // =====================================================

    const getValue = (
        pascalCase,
        camelCase
    ) => {
        return image?.[pascalCase] ??
               image?.[camelCase];
    };

    const productImageId = getValue(
        "ProductImageId",
        "productImageId"
    );

    const productId = getValue(
        "ProductId",
        "productId"
    );

    const imageName = getValue(
        "ImageName",
        "imageName"
    );

    const imageType = getValue(
        "ImageType",
        "imageType"
    );

    // =====================================================
    // Delete Handler
    // =====================================================

    const handleDelete = () => {

        if (!productImageId) {
            return;
        }

        if (typeof onDeleted === "function") {
            onDeleted(productImageId);
        }
    };

    // =====================================================
    // Render
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Delete Product Image
            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Typography>
                    Are you sure you want to delete this
                    product image?
                </Typography>

                {/* =============================================
                    IMAGE DETAILS
                ============================================= */}

                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "action.hover"
                    }}
                >

                    {/* IMAGE ID */}

                    <Typography
                        fontWeight="bold"
                    >
                        Image ID:{" "}
                        {productImageId ?? "-"}
                    </Typography>

                    {/* PRODUCT ID */}

                    <Typography>
                        Product ID:{" "}
                        {productId ?? "-"}
                    </Typography>

                    {/* IMAGE NAME */}

                    <Typography>
                        Image Name:{" "}
                        {imageName || "-"}
                    </Typography>

                    {/* IMAGE TYPE */}

                    <Typography>
                        Image Type:{" "}
                        {imageType || "-"}
                    </Typography>

                </Box>

                <Typography
                    color="error"
                    variant="body2"
                    sx={{
                        mt: 2
                    }}
                >
                    This action cannot be undone.
                </Typography>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!productImageId}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default DeleteProductImageDialog;
