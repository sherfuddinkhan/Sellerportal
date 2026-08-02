import React from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

const ProductPriceSearch = ({

    searchText,
    setSearchText,

    statusFilter,
    setStatusFilter,

    priceTypeFilter,
    setPriceTypeFilter,

    currencyFilter,
    setCurrencyFilter,

    productPrices = []

}) => {

    const priceTypes = [

        ...new Set(

            productPrices

                .map(item => item.PriceType)

                .filter(Boolean)

        )

    ];

    const currencies = [

        ...new Set(

            productPrices

                .map(item => item.Currency)

                .filter(Boolean)

        )

    ];

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3
            }}
        >

            <Grid
                container
                spacing={2}
            >

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField

                        fullWidth

                        label="Search Product Prices"

                        placeholder="Price Type, Product ID, Seller ID..."

                        value={searchText}

                        onChange={(e) =>

                            setSearchText(

                                e.target.value

                            )

                        }

                    />

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <FormControl fullWidth>

                        <InputLabel>

                            Status

                        </InputLabel>

                        <Select

                            value={statusFilter}

                            label="Status"

                            onChange={(e) =>

                                setStatusFilter(

                                    e.target.value

                                )

                            }

                        >

                            <MenuItem value="All">

                                All

                            </MenuItem>

                            <MenuItem value="Active">

                                Active

                            </MenuItem>

                            <MenuItem value="Inactive">

                                Inactive

                            </MenuItem>

                        </Select>

                    </FormControl>

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <FormControl fullWidth>

                        <InputLabel>

                            Price Type

                        </InputLabel>

                        <Select

                            value={priceTypeFilter}

                            label="Price Type"

                            onChange={(e) =>

                                setPriceTypeFilter(

                                    e.target.value

                                )

                            }

                        >

                            <MenuItem value="">

                                All

                            </MenuItem>

                            {

                                priceTypes.map(type => (

                                    <MenuItem

                                        key={type}

                                        value={type}

                                    >

                                        {type}

                                    </MenuItem>

                                ))

                            }

                        </Select>

                    </FormControl>

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={2}
                >

                    <FormControl fullWidth>

                        <InputLabel>

                            Currency

                        </InputLabel>

                        <Select

                            value={currencyFilter}

                            label="Currency"

                            onChange={(e) =>

                                setCurrencyFilter(

                                    e.target.value

                                )

                            }

                        >

                            <MenuItem value="">

                                All

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

                        </Select>

                    </FormControl>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default ProductPriceSearch;