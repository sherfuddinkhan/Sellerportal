import React from "react";
import {Grid,Paper,Typography} from "@mui/material";

const ProductAttributeStatistics = ({
    attributes = []
}) => {
    const totalAttributes = attributes.length;
    const activeAttributes = attributes.filter(item => item.IsActive).length;
    const inactiveAttributes = totalAttributes - activeAttributes;
    const requiredAttributes = attributes.filter(item => item.IsRequired).length;
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
    return (
        <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
        >
            {
                cards.map((card, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                borderRadius: 2,
                                height: "100%"
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {card.title}
                            </Typography>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{ mt: 1 }}
                            >
                                {card.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))
            }
        </Grid>
    );
};

export default ProductAttributeStatistics;