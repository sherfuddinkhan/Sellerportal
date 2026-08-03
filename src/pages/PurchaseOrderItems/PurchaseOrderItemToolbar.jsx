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



const PurchaseOrderItemToolbar = ({

    onAdd,

    onRefresh

}) => {


    return (


        <Box

            className="purchase-order-item-toolbar"

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

                title="Add Purchase Order Item"

            >


                <Button

                    variant="contained"

                    color="primary"

                    startIcon={<Add />}

                    onClick={onAdd}

                >

                    Add Item


                </Button>


            </Tooltip>





            <Tooltip

                title="Refresh Purchase Order Items"

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



export default PurchaseOrderItemToolbar;