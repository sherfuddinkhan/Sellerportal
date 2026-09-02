// =========================================================
// ProductImageView.jsx
// View Product Image Details
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip,
    Box
} from "@mui/material";

// =========================================================
// ProductImageView
// =========================================================

const ProductImageView = ({
    open,
    image,
    onClose
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

    const getValue = (pascalCase, camelCase) => {
        return image?.[pascalCase] ?? image?.[camelCase];
    };

    // =====================================================
    // Image Values
    // =====================================================

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

    const imageUrl = getValue(
        "ImageUrl",
        "imageUrl"
    );

    const isPrimary = getValue(
        "IsPrimary",
        "isPrimary"
    );

    const isActive = getValue(
        "IsActive",
        "isActive"
    );

    const createdDate = getValue(
        "CreatedDate",
        "createdDate"
    );

    const updatedDate = getValue(
        "UpdatedDate",
        "updatedDate"
    );

    // =====================================================
    // Field Component
    // =====================================================

    const Field = ({
        label,
        value
    }) => (
        <Grid
            item
            xs={12}
            md={6}
        >
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {value ?? "-"}
            </Typography>
        </Grid>
    );

    // =====================================================
    // Date Formatter
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString();
    };

    // =====================================================
    // Render
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Product Image Details
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

                <Grid
                    container
                    spacing={3}
                >

                    {/* =========================================
                        IMAGE PREVIEW
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Preview
                        </Typography>

                        {imageUrl ? (
                            <Box
                                sx={{
                                    mt: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight: 150,
                                    p: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2
                                }}
                            >
                                <Box
                                    component="img"
                                    src={imageUrl}
                                    alt={imageName || "Product Image"}
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: 300,
                                        objectFit: "contain",
                                        borderRadius: 2
                                    }}
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />
                            </Box>
                        ) : (
                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 2
                                }}
                            >
                                No image preview available.
                            </Typography>
                        )}
                    </Grid>

                    {/* =========================================
                        PRODUCT IMAGE ID
                    ========================================= */}

                    <Field
                        label="Product Image ID"
                        value={productImageId}
                    />

                    {/* =========================================
                        PRODUCT ID
                    ========================================= */}

                    <Field
                        label="Product ID"
                        value={productId}
                    />

                    {/* =========================================
                        IMAGE NAME
                    ========================================= */}

                    <Field
                        label="Image Name"
                        value={imageName}
                    />

                    {/* =========================================
                        IMAGE TYPE
                    ========================================= */}

                    <Field
                        label="Image Type"
                        value={imageType}
                    />

                    {/* =========================================
                        IMAGE URL
                    ========================================= */}

                    <Field
                        label="Image URL"
                        value={imageUrl}
                    />

                    {/* =========================================
                        PRIMARY IMAGE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Primary Image
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label={
                                    isPrimary
                                        ? "Yes"
                                        : "No"
                                }
                                color={
                                    isPrimary
                                        ? "success"
                                        : "default"
                                }
                            />
                        </Box>
                    </Grid>

                    {/* =========================================
                        STATUS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label={
                                    isActive
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    isActive
                                        ? "success"
                                        : "error"
                                }
                            />
                        </Box>
                    </Grid>

                    {/* =========================================
                        CREATED DATE
                    ========================================= */}

                    <Field
                        label="Created Date"
                        value={formatDate(createdDate)}
                    />

                    {/* =========================================
                        UPDATED DATE
                    ========================================= */}

                    <Field
                        label="Updated Date"
                        value={formatDate(updatedDate)}
                    />

                </Grid>

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
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default ProductImageView;
