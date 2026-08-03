import React from "react";


import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";


import {
    Search
} from "@mui/icons-material";



const PurchaseOrderItemSearch = ({

    searchText,

    setSearchText

}) => {


    return (


        <Box

            className="purchase-order-item-search"

            sx={{

                mb: 3

            }}

        >



            <TextField

                fullWidth

                size="small"

                label="Search Purchase Order Items"

                placeholder="Search by Item ID, Purchase Order ID, Product ID, Quantity, Price..."

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



        </Box>


    );


};



export default PurchaseOrderItemSearch;