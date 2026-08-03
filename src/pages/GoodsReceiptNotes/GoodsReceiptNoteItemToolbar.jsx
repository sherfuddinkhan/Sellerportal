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



const GoodsReceiptNoteItemToolbar = ({

    onAdd,

    onRefresh

}) => {



    return (



        <Box


            className="goods-receipt-note-item-toolbar"


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

                title="Create New Goods Receipt Note Item"

            >



                <Button



                    variant="contained"



                    color="primary"



                    startIcon={<Add />}



                    onClick={onAdd}



                >



                    Add GRN Item



                </Button>





            </Tooltip>









            <Tooltip

                title="Refresh Goods Receipt Note Items"

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



export default GoodsReceiptNoteItemToolbar;