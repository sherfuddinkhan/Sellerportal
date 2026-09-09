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
    Box,
    Link
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

    const getValue = (
        pascalCase,
        camelCase
    ) => {

        return (
            image?.[pascalCase] ??
            image?.[camelCase]
        );
    };

    // =====================================================
    // Boolean Helper
    // =====================================================

    const getBooleanValue = (value) => {

        if (
            value === true ||
            value === 1 ||
            value === "1" ||
            value === "true" ||
            value === "True" ||
            value === "TRUE"
        ) {
            return true;
        }

        return false;
    };

    // =====================================================
    // Image Values
    // =====================================================

    const productImageId = getValue(
        "ProductImageId",
        "productImageId"
    );

    const sellerId = getValue(
        "SellerId",
        "sellerId"
    );

    const customerId = getValue(
        "CustomerId",
        "customerId"
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

    const imageSize = getValue(
        "ImageSize",
        "imageSize"
    );

    const imageUrl = getValue(
        "ImageUrl",
        "imageUrl"
    );

    const displayOrder = getValue(
        "DisplayOrder",
        "displayOrder"
    );

    const isPrimary = getBooleanValue(
        getValue(
            "IsPrimary",
            "isPrimary"
        )
    );

    const isActive = getBooleanValue(
        getValue(
            "IsActive",
            "isActive"
        )
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
    // Format Image Size
    // =====================================================

    const formatImageSize = (size) => {

        if (
            size === null ||
            size === undefined ||
            size === ""
        ) {
            return "-";
        }

        const numericSize = Number(size);

        if (Number.isNaN(numericSize)) {
            return size;
        }

        if (numericSize < 1024) {
            return `${numericSize} B`;
        }

        if (numericSize < 1024 * 1024) {
            return `${(
                numericSize / 1024
            ).toFixed(2)} KB`;
        }

        if (numericSize < 1024 * 1024 * 1024) {
            return `${(
                numericSize /
                (1024 * 1024)
            ).toFixed(2)} MB`;
        }

        return `${(
            numericSize /
            (1024 * 1024 * 1024)
        ).toFixed(2)} GB`;
    };

    // =====================================================
    // Date Formatter
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleString();
    };

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
                sx={{
                    display: "block",
                    mb: 0.5
                }}
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
                {
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? value
                        : "-"
                }
            </Typography>

        </Grid>
    );

    // =====================================================
    // Render
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    fontWeight: 600
                }}
            >
                Product Image Details
            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                dividers
                sx={{
                    mt: 0
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
                            sx={{
                                display: "block",
                                mb: 1
                            }}
                        >
                            Image Preview
                        </Typography>

                        {imageUrl ? (

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight: 250,
                                    p: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    backgroundColor:
                                        "background.default"
                                }}
                            >

                                <Box
                                    component="img"
                                    src={imageUrl}
                                    alt={
                                        imageName ||
                                        "Product Image"
                                    }
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

                            <Box
                                sx={{
                                    minHeight: 150,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px dashed",
                                    borderColor: "divider",
                                    borderRadius: 2
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    No image preview available.
                                </Typography>

                            </Box>

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
                        SELLER ID
                    ========================================= */}

                    <Field
                        label="Seller ID"
                        value={sellerId}
                    />

                    {/* =========================================
                        CUSTOMER ID
                    ========================================= */}

                    <Field
                        label="Customer ID"
                        value={customerId}
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
                        IMAGE SIZE
                    ========================================= */}

                    <Field
                        label="Image Size"
                        value={formatImageSize(imageSize)}
                    />

                    {/* =========================================
                        DISPLAY ORDER
                    ========================================= */}

                    <Field
                        label="Display Order"
                        value={displayOrder}
                    />

                    {/* =========================================
                        IMAGE URL
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mb: 0.5
                            }}
                        >
                            Image URL
                        </Typography>

                        {imageUrl ? (

                            <Link
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                sx={{
                                    wordBreak: "break-all"
                                }}
                            >
                                {imageUrl}
                            </Link>

                        ) : (

                            <Typography>
                                -
                            </Typography>

                        )}

                    </Grid>

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
                                size="small"
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
                                size="small"
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
                    py: 2
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