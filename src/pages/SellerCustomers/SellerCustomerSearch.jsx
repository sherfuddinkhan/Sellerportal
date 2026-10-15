import React from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
} from "@mui/material";

import {
    Search
} from "@mui/icons-material";


const SellerCustomerSearch = ({

    searchText,

    setSearchText,

    statusFilter,

    setStatusFilter

}) => {


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

                    md={8}

                >

                    <TextField

                        fullWidth

                        label="Search Customers"

                        placeholder="Search by Code, Name, Contact, Email, Phone, GSTIN, City or State"

                        value={searchText}

                        onChange={(e) =>

                            setSearchText(

                                e.target.value

                            )

                        }

                        InputProps={{

                            startAdornment: (

                                <InputAdornment

                                    position="start"

                                >

                                    <Search />

                                </InputAdornment>

                            )

                        }}

                    />

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


            </Grid>


        </Paper>

    );

};


export default SellerCustomerSearch;
