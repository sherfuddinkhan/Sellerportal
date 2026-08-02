import React from "react";

import {
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from "@mui/material";


const ProductInventoryFilters = ({

    statusFilter,

    setStatusFilter,

    quantityFilter,

    setQuantityFilter,

    inventories = []

}) => {


    const quantityOptions = [

        {
            label: "All",
            value: ""
        },

        {
            label: "Out of Stock",
            value: "out"
        },

        {
            label: "Low Stock",
            value: "low"
        },

        {
            label: "Available",
            value: "available"
        }

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

                    md={4}

                >

                    <FormControl

                        fullWidth

                    >

                        <InputLabel>

                            Status

                        </InputLabel>


                        <Select

                            value={
                                statusFilter
                            }

                            label="Status"

                            onChange={(e)=>

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

                    md={4}

                >

                    <FormControl

                        fullWidth

                    >

                        <InputLabel>

                            Stock Level

                        </InputLabel>


                        <Select

                            value={
                                quantityFilter
                            }

                            label="Stock Level"

                            onChange={(e)=>

                                setQuantityFilter(

                                    e.target.value

                                )

                            }

                        >


                            {

                                quantityOptions.map(

                                    option => (

                                        <MenuItem

                                            key={
                                                option.value
                                            }

                                            value={
                                                option.value
                                            }

                                        >

                                            {
                                                option.label
                                            }

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

                    <TextField

                        fullWidth

                        label="Filter Info"

                        value={

                            inventories.length +

                            " Records"

                        }

                        InputProps={{

                            readOnly:true

                        }}

                    />


                </Grid>


            </Grid>


        </Paper>


    );

};


export default ProductInventoryFilters;