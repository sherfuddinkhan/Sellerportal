import React from "react";

import {
    Paper,
    Grid,
    TextField,
    MenuItem
} from "@mui/material";

const ProductPriceFilters = ({

    products = [],

    currencies = [],

    productFilter,
    setProductFilter,

    currencyFilter,
    setCurrencyFilter

}) => {

    return (

        <Paper sx={{ p: 2, mb: 3 }}>

            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>

                    <TextField

                        select

                        fullWidth

                        size="small"

                        label="Product"

                        value={productFilter}

                        onChange={(e) =>

                            setProductFilter(

                                e.target.value

                            )

                        }

                    >

                        <MenuItem value="">

                            All Products

                        </MenuItem>

                        {

                            products.map(product => (

                                <MenuItem

                                    key={product.ProductId}

                                    value={product.ProductId}

                                >

                                    {

                                        product.ProductName ||

                                        product.SKU

                                    }

                                </MenuItem>

                            ))

                        }

                    </TextField>

                </Grid>

                <Grid item xs={12} md={6}>

                    <TextField

                        select

                        fullWidth

                        size="small"

                        label="Currency"

                        value={currencyFilter}

                        onChange={(e) =>

                            setCurrencyFilter(

                                e.target.value

                            )

                        }

                    >

                        <MenuItem value="">

                            All Currencies

                        </MenuItem>

                        {

                            currencies.map(currency => (

                                <MenuItem

                                    key={currency}

                                    value={currency}

                                >

                                    {currency}

                                </MenuItem>

                            ))

                        }

                    </TextField>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default ProductPriceFilters;