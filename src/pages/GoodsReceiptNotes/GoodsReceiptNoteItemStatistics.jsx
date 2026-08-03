import React from "react";


import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";


import {
    Inventory,
    MoveToInbox,
    Block,
    CurrencyRupee
} from "@mui/icons-material";



const GoodsReceiptNoteItemStatistics = ({

    statistics = {}

}) => {



    const cards = [


        {

            title: "Total Items",

            value:

                statistics.totalItems || 0,

            icon:

                <Inventory />

        },


        {

            title: "Received Quantity",

            value:

                statistics.totalReceived || 0,

            icon:

                <MoveToInbox />

        },


        {

            title: "Rejected Quantity",

            value:

                statistics.totalRejected || 0,

            icon:

                <Block />

        },


        {

            title: "Total Amount",

            value:

                `₹ ${Number(

                    statistics.totalAmount || 0

                ).toLocaleString(undefined, {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                })}`,

            icon:

                <CurrencyRupee />

        }


    ];







    return (



        <Grid

            container

            spacing={2}

            mb={3}

        >



            {



                cards.map((card, index) => (



                    <Grid

                        item

                        xs={12}

                        sm={6}

                        md={3}

                        key={index}

                    >




                        <Card


                            className="goods-receipt-note-item-stat-card"


                            sx={{


                                height:"100%",


                                borderRadius:3



                            }}



                        >



                            <CardContent>




                                <Typography


                                    variant="body2"


                                    color="text.secondary"


                                    display="flex"


                                    alignItems="center"


                                    gap={1}



                                >



                                    {

                                        card.icon

                                    }



                                    {

                                        card.title

                                    }



                                </Typography>







                                <Typography


                                    variant="h5"


                                    fontWeight="bold"


                                    mt={1}



                                >



                                    {

                                        card.value

                                    }



                                </Typography>






                            </CardContent>






                        </Card>





                    </Grid>





                ))



            }





        </Grid>



    );


};



export default GoodsReceiptNoteItemStatistics;