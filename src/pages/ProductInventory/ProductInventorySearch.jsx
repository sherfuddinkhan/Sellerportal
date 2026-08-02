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


const ProductInventorySearch = ({

    searchText,

    setSearchText,

    stockStatusFilter,

    setStockStatusFilter,

    warehouseFilter,

    setWarehouseFilter,

    inventories = []

}) => {


    const warehouses = [

        ...new Set(

            inventories

                .map(item => item.WarehouseId)

                .filter(Boolean)

        )

    ];


    const stockStatuses = [

        ...new Set(

            inventories

                .map(item => item.StockStatus)

                .filter(Boolean)

        )

    ];



    return (

        <Paper

            elevation={2}

            sx={{

                p:2,

                mb:3

            }}

        >

            <Grid

                container

                spacing={2}

            >


                <Grid

                    item

                    xs={12}

                    md={5}

                >

                    <TextField

                        fullWidth

                        label="Search Inventory"

                        placeholder="Product ID, Seller ID, Warehouse..."

                        value={searchText}

                        onChange={(e)=>

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

                    <FormControl

                        fullWidth

                    >

                        <InputLabel>

                            Stock Status

                        </InputLabel>


                        <Select

                            value={
                                stockStatusFilter
                            }

                            label="Stock Status"

                            onChange={(e)=>

                                setStockStatusFilter(

                                    e.target.value

                                )

                            }

                        >

                            <MenuItem value="">

                                All

                            </MenuItem>


                            {

                                stockStatuses.map(

                                    status => (

                                        <MenuItem

                                            key={status}

                                            value={status}

                                        >

                                            {status}

                                        </MenuItem>

                                    )

                                )

                            }


                        </Select>


                    </FormControl>


                </Grid>



                <Grid

                    item

                    xs={12}

                    md={4}

                >

                    <FormControl

                        fullWidth

                    >

                        <InputLabel>

                            Warehouse

                        </InputLabel>


                        <Select

                            value={
                                warehouseFilter
                            }

                            label="Warehouse"

                            onChange={(e)=>

                                setWarehouseFilter(

                                    e.target.value

                                )

                            }

                        >

                            <MenuItem value="">

                                All

                            </MenuItem>


                            {

                                warehouses.map(

                                    warehouse => (

                                        <MenuItem

                                            key={warehouse}

                                            value={warehouse}

                                        >

                                            {warehouse}

                                        </MenuItem>

                                    )

                                )

                            }


                        </Select>


                    </FormControl>


                </Grid>


            </Grid>


        </Paper>

    );

};


export default ProductInventorySearch;