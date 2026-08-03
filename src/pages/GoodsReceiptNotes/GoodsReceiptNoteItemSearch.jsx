import React from "react";


import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";


import {
    Search
} from "@mui/icons-material";



const GoodsReceiptNoteItemSearch = ({

    searchText,

    setSearchText

}) => {



    return (



        <Box

            className="goods-receipt-note-item-search"

            sx={{

                mb:3

            }}

        >




            <TextField



                fullWidth



                size="small"



                label="Search Goods Receipt Note Items"



                placeholder="Search by GRN Item ID, GRN ID, Product ID..."



                value={searchText}



                onChange={(e) =>

                    setSearchText(

                        e.target.value

                    )

                }



                InputProps={{



                    startAdornment:(



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



export default GoodsReceiptNoteItemSearch;