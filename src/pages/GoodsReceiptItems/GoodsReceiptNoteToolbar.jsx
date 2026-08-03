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



const GoodsReceiptNoteToolbar = ({

    onAdd,

    onRefresh

}) => {



    return (


        <Box

            className="goods-receipt-note-toolbar"

            sx={{

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: 2,

                mb: 3

            }}

        >





            <Tooltip

                title="Create New Goods Receipt Note"

            >


                <Button


                    variant="contained"


                    color="primary"


                    startIcon={<Add />}


                    onClick={onAdd}


                >


                    Add GRN


                </Button>



            </Tooltip>









            <Tooltip

                title="Refresh Goods Receipt Notes"

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



export default GoodsReceiptNoteToolbar;