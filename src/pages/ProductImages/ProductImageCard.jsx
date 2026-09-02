
// =========================================================
// ProductImageCard.jsx
// Product Image Card
// =========================================================

import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Stack,
    Divider,
    Box
} from "@mui/material";

// =========================================================
// ProductImageCard
// =========================================================

const ProductImageCard = ({
    image
}) => {

    // =====================================================
    // No Image
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

    const imageUrl = getValue(
        "ImageUrl",
        "imageUrl"
    );

    const imageName = getValue(
        "ImageName",
        "imageName"
    );

    const imageType = getValue(
        "ImageType",
        "imageType"
    );

    const isPrimary = Boolean(
        getValue(
            "IsPrimary",
            "isPrimary"
        )
    );

    const isActive = Boolean(
        getValue(
            "IsActive",
            "isActive"
        )
    );

    const createdDate = getValue(
        "CreatedDate",
        "createdDate"
    );

    // =====================================================
    // Format Date
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
        <Card
            elevation={3}
            sx={{
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >

            <CardContent
                sx={{
                    flexGrow: 1
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        mb: 2
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Image #{productImageId ?? "-"}
                    </Typography>

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

                </Stack>

                <Divider
                    sx={{
                        mb: 2
                    }}
                />

                {/* =================================================
                    DETAILS
                ================================================= */}

                <Grid
                    container
                    spacing={2}
                >

                    {/* =============================================
                        IMAGE PREVIEW
                    ============================================= */}

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
                                    mt: 1,
                                    width: "100%",
                                    height: 160,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
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
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
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
                                    mt: 1,
                                    height: 160,
                                    borderRadius: 2,
                                    border: "1px dashed",
                                    borderColor: "divider",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                >
                                    No image available
                                </Typography>
                            </Box>

                        )}

                    </Grid>

                    {/* =============================================
                        PRODUCT ID
                    ============================================= */}

                    <Grid
                        item
                        xs={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography>
                            {productId ?? "-"}
                        </Typography>
                    </Grid>

                    {/* =============================================
                        IMAGE TYPE
                    ============================================= */}

                    <Grid
                        item
                        xs={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Type
                        </Typography>

                        <Typography>
                            {imageType || "-"}
                        </Typography>
                    </Grid>

                    {/* =============================================
                        IMAGE NAME
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Name
                        </Typography>

                        <Typography
                            sx={{
                                wordBreak: "break-word"
                            }}
                        >
                            {imageName || "-"}
                        </Typography>
                    </Grid>

                    {/* =============================================
                        IMAGE URL
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image URL
                        </Typography>

                        <Typography
                            sx={{
                                wordBreak: "break-all"
                            }}
                        >
                            {imageUrl || "-"}
                        </Typography>
                    </Grid>

                    {/* =============================================
                        PRIMARY IMAGE
                    ============================================= */}

                    <Grid
                        item
                        xs={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Primary Image
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>
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

                    {/* =============================================
                        CREATED DATE
                    ============================================= */}

                    <Grid
                        item
                        xs={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography
                            sx={{
                                wordBreak: "break-word"
                            }}
                        >
                            {formatDate(createdDate)}
                        </Typography>
                    </Grid>

                </Grid>

            </CardContent>

        </Card>
    );
};

export default ProductImageCard;
