import React from "react";


import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";


import {
    Search
} from "@mui/icons-material";



const GoodsReceiptNoteSearch = ({

    searchText,

    setSearchText

}) => {



    return (



        <Box

            className="goods-receipt-note-search"

            sx={{

                mb: 3

            }}

        >



            <TextField


                fullWidth


                size="small"


                label="Search Goods Receipt Notes"


                placeholder="Search by GRN Number, Purchase Order ID, Supplier ID, Status..."


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



export default GoodsReceiptNoteSearch;