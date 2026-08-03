import React from "react";


import {

    Box,

    Button,

    Tooltip

} from "@mui/material";


import {

    Add,

    Refresh

} from "@mui/icons-material";



const StockLedgerToolbar = ({

    onAdd,

    onRefresh

}) => {



    return (



        <Box



            className="stock-ledger-toolbar"



            sx={{



                display:"flex",



                justifyContent:"space-between",



                alignItems:"center",



                flexWrap:"wrap",



                gap:2,



                mb:3



            }}



        >






            <Tooltip



                title="Create Stock Ledger Entry"



            >



                <Button



                    variant="contained"



                    color="primary"



                    startIcon={<Add />}



                    onClick={onAdd}



                >



                    Add Stock Entry



                </Button>





            </Tooltip>









            <Tooltip



                title="Refresh Stock Ledger"



            >



                <Button



                    variant="outlined"



                    color="secondary"



                    startIcon={<Refresh />}



                    onClick={onRefresh}



                >



                    Refresh



                </Button>





            </Tooltip>







        </Box>



    );


};



export default StockLedgerToolbar;