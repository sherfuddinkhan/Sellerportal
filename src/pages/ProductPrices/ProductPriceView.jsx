// =========================================================
// ProductPriceView.jsx
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
} from "@mui/material";

// =========================================================
// Product Price View
// =========================================================

const ProductPriceView = ({
    open,
    productPrice,
    onClose,
}) => {

    // =====================================================
    // NO DATA
    // =====================================================

    if (!productPrice) {
        return null;
    }


    // =====================================================
    // GET VALUE
    // Supports PascalCase + camelCase
    // =====================================================

    const getValue = (
        pascalCase,
        camelCase,
        fallback = "-"
    ) => {

        const value =
            productPrice?.[pascalCase] ??
            productPrice?.[camelCase];

        return value === null ||
            value === undefined ||
            value === ""
            ? fallback
            : value;
    };


    // =====================================================
    // DATE FORMATTER
    // =====================================================

    const formatDate = (pascalCase, camelCase) => {

        const value =
            productPrice?.[pascalCase] ??
            productPrice?.[camelCase];

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString();
    };


    // =====================================================
    // ACTIVE STATUS
    // =====================================================

    const isActive =
        productPrice?.IsActive ??
        productPrice?.isActive ??
        false;


    // =====================================================
    // FIELD COMPONENT
    // =====================================================

    const Field = ({
        label,
        value,
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    mt: 0.5,
                    wordBreak: "break-word",
                }}
            >
                {value || "-"}
            </Typography>

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
                    fontWeight: "bold",
                }}
            >
                Product Price Details
            </DialogTitle>

            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2,
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* =========================================
                        PRODUCT PRICE ID
                    ========================================= */}

                    <Field
                        label="Product Price ID"
                        value={getValue(
                            "ProductPriceId",
                            "productPriceId"
                        )}
                    />


                    {/* =========================================
                        PRODUCT ID
                    ========================================= */}

                    <Field
                        label="Product ID"
                        value={getValue(
                            "ProductId",
                            "productId"
                        )}
                    />


                    {/* =========================================
                        SELLER ID
                    ========================================= */}

                    <Field
                        label="Seller ID"
                        value={getValue(
                            "SellerId",
                            "sellerId"
                        )}
                    />


                    {/* =========================================
                        PRICE TYPE
                    ========================================= */}

                    <Field
                        label="Price Type"
                        value={getValue(
                            "PriceType",
                            "priceType"
                        )}
                    />


                    {/* =========================================
                        PRICE
                    ========================================= */}

                    <Field
                        label="Price"
                        value={
                            (() => {

                                const price =
                                    productPrice?.Price ??
                                    productPrice?.price;

                                if (
                                    price === null ||
                                    price === undefined ||
                                    price === ""
                                ) {
                                    return "-";
                                }

                                const number =
                                    Number(price);

                                return Number.isNaN(number)
                                    ? "-"
                                    : `₹ ${number.toFixed(2)}`;

                            })()
                        }
                    />


                    {/* =========================================
                        CURRENCY
                    ========================================= */}

                    <Field
                        label="Currency"
                        value={getValue(
                            "Currency",
                            "currency"
                        )}
                    />


                    {/* =========================================
                        EFFECTIVE FROM
                    ========================================= */}

                    <Field
                        label="Effective From"
                        value={formatDate(
                            "EffectiveFrom",
                            "effectiveFrom"
                        )}
                    />


                    {/* =========================================
                        EFFECTIVE TO
                    ========================================= */}

                    <Field
                        label="Effective To"
                        value={formatDate(
                            "EffectiveTo",
                            "effectiveTo"
                        )}
                    />


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
                            display="block"
                            sx={{
                                mb: 1,
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


                    {/* =========================================
                        CREATED DATE
                    ========================================= */}

                    <Field
                        label="Created"
                        value={formatDate(
                            "CreatedDate",
                            "createdDate"
                        )}
                    />


                    {/* =========================================
                        UPDATED DATE
                    ========================================= */}

                    <Field
                        label="Updated"
                        value={formatDate(
                            "UpdatedDate",
                            "updatedDate"
                        )}
                    />

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
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

export default ProductPriceView;
