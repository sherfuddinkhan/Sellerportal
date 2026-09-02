// =========================================================
// ProductAttributeView.jsx
// Product Attribute Details View
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
// COMPONENT
// =========================================================

const ProductAttributeView = ({
    open,
    attribute,
    onClose
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
    // FIELD COMPONENT
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

            <Box>

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

            </Box>

        </Grid>
    );


    // =====================================================
    // RENDER
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

            <DialogTitle
                sx={{
                    fontWeight: "bold"
                }}
            >
                Product Attribute Details
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

                    {/* ATTRIBUTE ID */}

                    <Field
                        label="Attribute ID"
                        value={attributeId}
                    />


                    {/* PRODUCT ID */}

                    <Field
                        label="Product ID"
                        value={productId}
                    />


                    {/* ATTRIBUTE NAME */}

                    <Field
                        label="Attribute Name"
                        value={attributeName}
                    />


                    {/* ATTRIBUTE VALUE */}

                    <Field
                        label="Attribute Value"
                        value={attributeValue}
                    />


                    {/* ATTRIBUTE TYPE */}

                    <Field
                        label="Attribute Type"
                        value={attributeType}
                    />


                    {/* REQUIRED */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Required
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>

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

                        </Box>

                    </Grid>


                    {/* ACTIVE STATUS */}

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

                        <Box sx={{ mt: 0.5 }}>

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


                    {/* CREATED DATE */}

                    <Field
                        label="Created Date"
                        value={formatDate(createdDate)}
                    />


                    {/* UPDATED DATE */}

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


export default ProductAttributeView;
