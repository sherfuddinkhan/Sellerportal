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



const OrderSearch = ({

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



                        label="Search Orders"



                        placeholder="Search by Order Number or Status"



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



                            Order Status



                        </InputLabel>









                        <Select



                            value={statusFilter}



                            label="Order Status"



                            onChange={(e) =>



                                setStatusFilter(

                                    e.target.value

                                )



                            }



                        >







                            <MenuItem value="All">



                                All



                            </MenuItem>









                            <MenuItem value="Pending">



                                Pending



                            </MenuItem>









                            <MenuItem value="Confirmed">



                                Confirmed



                            </MenuItem>









                            <MenuItem value="Processing">



                                Processing



                            </MenuItem>









                            <MenuItem value="Packed">



                                Packed



                            </MenuItem>









                            <MenuItem value="Shipped">



                                Shipped



                            </MenuItem>









                            <MenuItem value="Delivered">



                                Delivered



                            </MenuItem>









                            <MenuItem value="Cancelled">



                                Cancelled



                            </MenuItem>









                            <MenuItem value="Returned">



                                Returned



                            </MenuItem>







                        </Select>







                    </FormControl>







                </Grid>







            </Grid>







        </Paper>



    );

};



export default OrderSearch;