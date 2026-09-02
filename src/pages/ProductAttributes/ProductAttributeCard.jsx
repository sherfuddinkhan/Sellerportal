// =========================================================
// ProductAttributeCard.jsx
// Product Attribute Card
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
// COMPONENT
// =========================================================

const ProductAttributeCard = ({
    attribute
}) => {


    // =====================================================
    // NO ATTRIBUTE
    // =====================================================

    if (!attribute) {
        return null;
    }


    // =====================================================
    // SUPPORT BOTH JSON NAMING STYLES
    // =====================================================

    const attributeId =
        attribute.productAttributeId ??
        attribute.ProductAttributeId;

    const productId =
        attribute.productId ??
        attribute.ProductId;

    const attributeName =
        attribute.attributeName ??
        attribute.AttributeName;

    const attributeValue =
        attribute.attributeValue ??
        attribute.AttributeValue;

    const attributeType =
        attribute.attributeType ??
        attribute.AttributeType;

    const isRequired =
        attribute.isRequired ??
        attribute.IsRequired ??
        false;

    const isActive =
        attribute.isActive ??
        attribute.IsActive ??
        false;

    const createdDate =
        attribute.createdDate ??
        attribute.CreatedDate;


    // =====================================================
    // DATE FORMATTER
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
    // RENDER
    // =====================================================

    return (

        <Card
            elevation={3}
            sx={{
                borderRadius: 2,
                height: "100%"
            }}
        >

            <CardContent>

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
                        sx={{
                            wordBreak: "break-word"
                        }}
                    >
                        {attributeName || "Product Attribute"}
                    </Typography>


                    {/* ACTIVE STATUS */}

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
                    ATTRIBUTE INFORMATION
                ================================================= */}

                <Grid
                    container
                    spacing={2}
                >

                    {/* ATTRIBUTE ID */}

                    <Grid
                        item
                        xs={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Attribute ID
                        </Typography>

                        <Typography
                            fontWeight={500}
                        >
                            {attributeId ?? "-"}
                        </Typography>

                    </Grid>


                    {/* PRODUCT ID */}

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

                        <Typography
                            fontWeight={500}
                        >
                            {productId ?? "-"}
                        </Typography>

                    </Grid>


                    {/* ATTRIBUTE TYPE */}

                    <Grid
                        item
                        xs={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Attribute Type
                        </Typography>

                        <Typography
                            fontWeight={500}
                        >
                            {attributeType || "-"}
                        </Typography>

                    </Grid>


                    {/* REQUIRED */}

                    <Grid
                        item
                        xs={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Required
                        </Typography>

                        <Chip
                            label={
                                isRequired
                                    ? "Yes"
                                    : "No"
                            }
                            color={
                                isRequired
                                    ? "primary"
                                    : "default"
                            }
                            size="small"
                        />

                    </Grid>


                    {/* ATTRIBUTE VALUE */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Attribute Value
                        </Typography>

                        <Typography
                            fontWeight={500}
                            sx={{
                                wordBreak:
                                    "break-word",
                                mt: 0.5
                            }}
                        >
                            {attributeValue || "-"}
                        </Typography>

                    </Grid>


                    {/* CREATED DATE */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography
                            fontWeight={500}
                            sx={{
                                mt: 0.5
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


export default ProductAttributeCard;
