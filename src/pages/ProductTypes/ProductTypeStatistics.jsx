// =========================================================
// ProductTypeStatistics.jsx
// Product Type Statistics Cards
// =========================================================

import React, {
    useMemo,
} from "react";

import {
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";


// =========================================================
// PRODUCT TYPE STATISTICS
// =========================================================

const ProductTypeStatistics = ({
    productTypes = [],
}) => {

    // =====================================================
    // ENSURE ARRAY
    // =====================================================

    const items = Array.isArray(productTypes)
        ? productTypes
        : [];


    // =====================================================
    // CALCULATE STATISTICS
    // =====================================================

    const statistics = useMemo(() => {

        const total =
            items.length;


        // -------------------------------------------------
        // ACTIVE
        // -------------------------------------------------

        const active =
            items.filter(
                (item) =>
                    Boolean(item?.isActive)
            ).length;


        // -------------------------------------------------
        // INACTIVE
        // -------------------------------------------------

        const inactive =
            total - active;


        // -------------------------------------------------
        // ADDED THIS MONTH
        // -------------------------------------------------

        const today =
            new Date();

        const currentMonth =
            today.getMonth();

        const currentYear =
            today.getFullYear();


        const thisMonth =
            items.filter((item) => {

                if (!item?.createdDate) {
                    return false;
                }


                const createdDate =
                    new Date(
                        item.createdDate
                    );


                if (
                    Number.isNaN(
                        createdDate.getTime()
                    )
                ) {
                    return false;
                }


                return (
                    createdDate.getMonth() ===
                        currentMonth &&
                    createdDate.getFullYear() ===
                        currentYear
                );

            }).length;


        return {
            total,
            active,
            inactive,
            thisMonth,
        };

    }, [items]);


    // =====================================================
    // STATISTICS CARDS
    // =====================================================

    const cards = [

        {
            title:
                "Total Product Types",

            value:
                statistics.total,
        },

        {
            title:
                "Active",

            value:
                statistics.active,
        },

        {
            title:
                "Inactive",

            value:
                statistics.inactive,
        },

        {
            title:
                "Added This Month",

            value:
                statistics.thisMonth,
        },

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Grid
            container
            spacing={2}
        >

            {cards.map(
                (card, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                    >

                        <Card
                            elevation={2}
                            sx={{
                                height: "100%",
                            }}
                        >

                            <CardContent>

                                {/* =================================
                                    TITLE
                                ================================= */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                    }}
                                >

                                    {card.title}

                                </Typography>


                                {/* =================================
                                    VALUE
                                ================================= */}

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >

                                    {card.value}

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                )
            )}

        </Grid>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeStatistics;
