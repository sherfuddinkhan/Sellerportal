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

const ProductPriceCard = ({ productPrice }) => {

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

                        {productPrice.PriceType}

                    </Typography>

                    <Chip

                        label={
                            productPrice.IsActive
                                ? "Active"
                                : "Inactive"
                        }

                        color={
                            productPrice.IsActive
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

                            Product Price ID

                        </Typography>

                        <Typography>

                            {productPrice.ProductPriceId}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Product ID

                        </Typography>

                        <Typography>

                            {productPrice.ProductId}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Seller ID

                        </Typography>

                        <Typography>

                            {productPrice.SellerId}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Price Type

                        </Typography>

                        <Typography>

                            {productPrice.PriceType || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Price

                        </Typography>

                        <Typography>

                            {productPrice.Price ?? 0}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Currency

                        </Typography>

                        <Typography>

                            {productPrice.Currency || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Effective From

                        </Typography>

                        <Typography>

                            {productPrice.EffectiveFrom || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Effective To

                        </Typography>

                        <Typography>

                            {productPrice.EffectiveTo || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Created Date

                        </Typography>

                        <Typography>

                            {productPrice.CreatedDate || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Updated Date

                        </Typography>

                        <Typography>

                            {productPrice.UpdatedDate || "-"}

                        </Typography>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

};

export default ProductPriceCard;