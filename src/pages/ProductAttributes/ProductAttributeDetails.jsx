// =========================================================
// ProductAttributeDetails.jsx
// Product Attribute Details Page
// =========================================================

import React from "react";

import {
    Paper,
    Typography,
    Grid,
    Chip,
    Divider,
    Button,
    Box,
    Stack
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";


// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeDetails = ({
    attribute,
    onBack,
    onEdit
}) => {


    // =====================================================
    // NO ATTRIBUTE
    // =====================================================

    if (!attribute) {

        return (

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2
                }}
            >

                <Typography
                    align="center"
                    color="text.secondary"
                >
                    Product Attribute not found.
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 3
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => onBack?.()}
                    >
                        Back
                    </Button>

                </Box>

            </Paper>
        );
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

    const updatedDate =
        attribute.updatedDate ??
        attribute.UpdatedDate;


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
    // FIELD
    // =====================================================

    const DetailField = ({
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
                    mt: 0.5,
                    wordBreak: "break-word"
                }}
            >
                {value !== null &&
                value !== undefined &&
                value !== ""
                    ? value
                    : "-"
                }
            </Typography>

        </Grid>
    );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
            elevation={3}
            sx={{
                p: {
                    xs: 2,
                    md: 4
                },
                borderRadius: 2
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                spacing={2}
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Product Attribute Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        View complete product attribute information
                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => onBack?.()}
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            onEdit?.(attribute)
                        }
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>


            <Divider
                sx={{
                    mb: 3
                }}
            />


            {/* =================================================
                DETAILS
            ================================================= */}

            <Grid
                container
                spacing={3}
            >

                <DetailField
                    label="Attribute ID"
                    value={attributeId}
                />

                <DetailField
                    label="Product ID"
                    value={productId}
                />

                <DetailField
                    label="Attribute Name"
                    value={attributeName}
                />

                <DetailField
                    label="Attribute Type"
                    value={attributeType}
                />


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
                        variant="body1"
                        fontWeight={500}
                        sx={{
                            mt: 0.5,
                            p: 2,
                            borderRadius: 1,
                            bgcolor: "action.hover",
                            wordBreak: "break-word"
                        }}
                    >
                        {attributeValue || "-"}
                    </Typography>

                </Grid>


                {/* REQUIRED */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{
                            mb: 1
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
                    />

                </Grid>


                {/* STATUS */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{
                            mb: 1
                        }}
                    >
                        Status
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
                    />

                </Grid>


                {/* CREATED DATE */}

                <DetailField
                    label="Created Date"
                    value={formatDate(createdDate)}
                />


                {/* UPDATED DATE */}

                <DetailField
                    label="Updated Date"
                    value={formatDate(updatedDate)}
                />

            </Grid>

        </Paper>
    );
};


export default ProductAttributeDetails;

