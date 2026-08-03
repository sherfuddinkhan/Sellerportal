import React from "react";


import {

    Box,

    Pagination,

    FormControl,

    InputLabel,

    Select,

    MenuItem,

    Typography

} from "@mui/material";



const StockLedgerPagination = ({

    page,

    totalPages,

    pageSize,

    totalRecords,

    onPageChange,

    onPageSizeChange

}) => {



    const pageSizes = [

        5,

        10,

        25,

        50,

        100

    ];







    return (



        <Box



            className="stock-ledger-pagination"



            sx={{



                display:"flex",



                justifyContent:"space-between",



                alignItems:"center",



                flexWrap:"wrap",



                gap:2,



                mt:3



            }}



        >






            <Typography



                variant="body2"



                color="text.secondary"



            >



                Total Records:

                {" "}

                {

                    totalRecords

                }



            </Typography>









            <Pagination



                count={

                    totalPages || 1

                }



                page={page}



                onChange={(event,value)=>



                    onPageChange(value)



                }



                color="primary"



                showFirstButton



                showLastButton



            />









            <FormControl



                size="small"



                sx={{

                    minWidth:100

                }}



            >



                <InputLabel>

                    Rows

                </InputLabel>





                <Select



                    value={pageSize}



                    label="Rows"



                    onChange={(e)=>



                        onPageSizeChange(

                            e.target.value

                        )



                    }



                >





                    {



                        pageSizes.map((size)=>(



                            <MenuItem



                                key={size}



                                value={size}



                            >



                                {

                                    size

                                }



                            </MenuItem>





                        ))



                    }





                </Select>







            </FormControl>









        </Box>



    );


};



export default StockLedgerPagination;