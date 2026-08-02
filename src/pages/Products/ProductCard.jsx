import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Stack,
    Divider
} from "@mui/material";

const ProductCard = ({ product }) => {

    return (

        <Card
            elevation={3}
            sx={{
                borderRadius: 2,
                height: "100%"
            }}
        >

            <CardContent>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >

                        {product.ProductName}

                    </Typography>

                    <Chip

                        label={
                            product.IsActive
                                ? "Active"
                                : "Inactive"
                        }

                        color={
                            product.IsActive
                                ? "success"
                                : "error"
                        }

                        size="small"

                    />

                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            SKU

                        </Typography>

                        <Typography>

                            {product.SKU}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Barcode

                        </Typography>

                        <Typography>

                            {product.Barcode || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Brand

                        </Typography>

                        <Typography>

                            {

                                product.BrandName ||

                                product.BrandId ||

                                "-"

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Category

                        </Typography>

                        <Typography>

                            {

                                product.CategoryName ||

                                product.CategoryId ||

                                "-"

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Product Type

                        </Typography>

                        <Typography>

                            {

                                product.ProductTypeName ||

                                product.ProductTypeId ||

                                "-"

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            HSN Code

                        </Typography>

                        <Typography>

                            {product.HSNCode || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Unit

                        </Typography>

                        <Typography>

                            {product.UnitOfMeasure || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Weight

                        </Typography>

                        <Typography>

                            {product.Weight || 0}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Description

                        </Typography>

                        <Typography>

                            {product.Description || "-"}

                        </Typography>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

};

export default ProductCard;