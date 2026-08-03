import React from "react";


import {
    Paper,
    Grid,
    TextField,
    InputAdornment
} from "@mui/material";


import {
    Search
} from "@mui/icons-material";



const OrderItemSearch = ({

    searchText,

    setSearchText

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



                >







                    <TextField



                        fullWidth



                        label="Search Order Items"



                        placeholder="Search by Order ID or Product ID"



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







            </Grid>







        </Paper>



    );

};



export default OrderItemSearch;