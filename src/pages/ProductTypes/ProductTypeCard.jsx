// =========================================================
// ProductTypeCard.jsx
// Product Type Card
// =========================================================

import React from "react";

import {
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";


// =========================================================
// PRODUCT TYPE CARD
// =========================================================

const ProductTypeCard = ({
    productType = {},
}) => {

    const {
        productTypeId,
        productTypeName,
        description,
        isActive,
    } = productType;


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Card
            elevation={2}
            sx={{
                height: "100%",

                display: "flex",

                flexDirection: "column",

                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    transform:
                        "translateY(-2px)",

                    boxShadow: 4,
                },
            }}
        >

            <CardContent
                sx={{
                    flexGrow: 1,
                }}
            >

                {/* =========================================
                    PRODUCT TYPE NAME
                ========================================= */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        wordBreak: "break-word",
                    }}
                >

                    {productTypeName || "-"}

                </Typography>


                {/* =========================================
                    DESCRIPTION
                ========================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,

                        minHeight: 48,

                        display: "-webkit-box",

                        WebkitLineClamp: 2,

                        WebkitBoxOrient: "vertical",

                        overflow: "hidden",

                        wordBreak: "break-word",
                    }}
                >

                    {description || "-"}

                </Typography>


                {/* =========================================
                    DIVIDER
                ========================================= */}

                <Divider
                    sx={{
                        mt: 2,
                    }}
                />


                {/* =========================================
                    STATUS + ID
                ========================================= */}

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    spacing={1}

                    sx={{
                        mt: 2,
                    }}

                >

                    {/* -------------------------------------
                        STATUS
                    ------------------------------------- */}

                    <Chip

                        size="small"

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


                    {/* -------------------------------------
                        PRODUCT TYPE ID
                    ------------------------------------- */}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >

                        ID: {productTypeId ?? "-"}

                    </Typography>

                </Stack>

            </CardContent>

        </Card>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeCard;
