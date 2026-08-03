import React from "react";


import {

    TextField,

    InputAdornment,

    IconButton,

    Box

} from "@mui/material";


import {

    Search,

    Clear

} from "@mui/icons-material";



const StockLedgerSearch = ({

    searchText,

    setSearchText

}) => {



    const handleClear = () => {



        setSearchText("");



    };







    return (



        <Box



            className="stock-ledger-search"



            sx={{



                mb:3,



                width:"100%"



            }}



        >





            <TextField



                fullWidth



                variant="outlined"



                placeholder="Search by Product, Warehouse, Transaction Type or Reference Number"



                value={searchText}



                onChange={(e)=>



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



                    ),



                    endAdornment:



                        searchText && (



                            <InputAdornment

                                position="end"

                            >



                                <IconButton



                                    onClick={handleClear}



                                >



                                    <Clear />



                                </IconButton>



                            </InputAdornment>



                        )



                }}



            />







        </Box>



    );


};



export default StockLedgerSearch;