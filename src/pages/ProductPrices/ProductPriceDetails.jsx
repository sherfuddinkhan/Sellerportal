import React, { useEffect, useState } from "react";

import {
    Paper,
    Grid,
    Typography,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Box
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import apiService from "../../services/apiService";

const ProductPriceDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [productPrice, setProductPrice] = useState(null);

    useEffect(() => {

        loadProductPrice();

    }, []);

    const loadProductPrice = async () => {

        try {

            setLoading(true);

            const response =

                await apiService.getProductPriceById(id);

            setProductPrice(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading)

        return (

            <Box

                display="flex"

                justifyContent="center"

                mt={5}

            >

                <CircularProgress />

            </Box>

        );

    if (!productPrice)

        return (

            <Typography>

                Product Price not found.

            </Typography>

        );

    return (

        <Paper sx={{ p: 4 }}>

            <Grid

                container

                justifyContent="space-between"

                alignItems="center"

                mb={3}

            >

                <Typography

                    variant="h5"

                    fontWeight="bold"

                >

                    Product Price Details

                </Typography>

                <Box>

                    <Button

                        variant="outlined"

                        startIcon={<ArrowBack />}

                        sx={{ mr: 2 }}

                        onClick={() =>

                            navigate("/product-prices")

                        }

                    >

                        Back

                    </Button>

                    <Button

                        variant="contained"

                        startIcon={<Edit />}

                        onClick={() =>

                            navigate(

                                `/product-prices/edit/${id}`

                            )

                        }

                    >

                        Edit

                    </Button>

                </Box>

            </Grid>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Product Price ID

                    </Typography>

                    <Typography variant="h6">

                        {productPrice.ProductPriceId}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Product

                    </Typography>

                    <Typography>

                        {

                            productPrice.ProductName ||

                            productPrice.ProductId

                        }

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        SKU

                    </Typography>

                    <Typography>

                        {productPrice.SKU || "-"}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Seller ID

                    </Typography>

                    <Typography>

                        {productPrice.SellerId}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Price Type

                    </Typography>

                    <Typography>

                        {productPrice.PriceType}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Price

                    </Typography>

                    <Typography>

                        ₹ {Number(productPrice.Price).toFixed(2)}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Currency

                    </Typography>

                    <Typography>

                        {productPrice.Currency}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Effective From

                    </Typography>

                    <Typography>

                        {

                            productPrice.EffectiveFrom

                                ?

                                new Date(

                                    productPrice.EffectiveFrom

                                ).toLocaleDateString()

                                :

                                "-"

                        }

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Effective To

                    </Typography>

                    <Typography>

                        {

                            productPrice.EffectiveTo

                                ?

                                new Date(

                                    productPrice.EffectiveTo

                                ).toLocaleDateString()

                                :

                                "-"

                        }

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Status

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

                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Created Date

                    </Typography>

                    <Typography>

                        {

                            productPrice.CreatedDate

                                ?

                                new Date(

                                    productPrice.CreatedDate

                                ).toLocaleString()

                                :

                                "-"

                        }

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Updated Date

                    </Typography>

                    <Typography>

                        {

                            productPrice.UpdatedDate

                                ?

                                new Date(

                                    productPrice.UpdatedDate

                                ).toLocaleString()

                                :

                                "-"

                        }

                    </Typography>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default ProductPriceDetails;