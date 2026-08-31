// =========================================================
// ProductTypeView.jsx
// Product Type Card View
// =========================================================

import React from "react";

import {
    Grid,
    Typography,
    Box,
} from "@mui/material";

import ProductTypeCard from "./ProductTypeCard";


// =========================================================
// PRODUCT TYPE VIEW
// =========================================================

const ProductTypeView = ({
    productTypes = [],
}) => {

    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (!Array.isArray(productTypes) ||
        productTypes.length === 0) {

        return (

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 200,
                }}
            >

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    No product types found.
                </Typography>

            </Box>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Grid
            container
            spacing={2}
        >

            {productTypes.map((item) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={
                        item.productTypeId
                    }
                >

                    <ProductTypeCard
                        productType={item}
                    />

                </Grid>

            ))}

        </Grid>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeView;
