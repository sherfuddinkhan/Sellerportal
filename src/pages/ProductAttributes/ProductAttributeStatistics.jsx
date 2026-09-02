// =========================================================
// ProductAttributeStatistics.jsx
// Product Attribute Statistics
// =========================================================

import React from "react";

import {
    Grid,
    Paper,
    Typography
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeStatistics = ({
    attributes = []
}) => {


    // =====================================================
    // TOTAL
    // =====================================================

    const totalAttributes =
        attributes.length;


    // =====================================================
    // ACTIVE
    // =====================================================

    const activeAttributes =
        attributes.filter((item) => {

            return (
                item.isActive ??
                item.IsActive ??
                false
            );

        }).length;


    // =====================================================
    // INACTIVE
    // =====================================================

    const inactiveAttributes =
        totalAttributes -
        activeAttributes;


    // =====================================================
    // REQUIRED
    // =====================================================

    const requiredAttributes =
        attributes.filter((item) => {

            return (
                item.isRequired ??
                item.IsRequired ??
                false
            );

        }).length;


    // =====================================================
    // STATISTIC CARDS
    // =====================================================

    const cards = [

        {
            title: "Total Attributes",
            value: totalAttributes
        },

        {
            title: "Active",
            value: activeAttributes
        },

        {
            title: "Inactive",
            value: inactiveAttributes
        },

        {
            title: "Required",
            value: requiredAttributes
        }

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Grid
            container
            spacing={2}
            sx={{
                mb: 3
            }}
        >

            {cards.map(
                (card) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={card.title}
                    >

                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,

                                textAlign:
                                    "center",

                                borderRadius: 2,

                                height:
                                    "100%"
                            }}
                        >

                            {/* =================================
                                TITLE
                            ================================= */}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {card.title}
                            </Typography>


                            {/* =================================
                                VALUE
                            ================================= */}

                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{
                                    mt: 1
                                }}
                            >
                                {card.value}
                            </Typography>

                        </Paper>

                    </Grid>

                )
            )}

        </Grid>
    );
};


export default ProductAttributeStatistics;
