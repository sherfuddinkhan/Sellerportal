import React from "react";


import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";


import {
    ReceiptLong,
    CurrencyRupee,
    CheckCircle,
    PendingActions
} from "@mui/icons-material";



const GoodsReceiptNoteStatistics = ({

    statistics = {}

}) => {



    const cards = [


        {

            title: "Total GRN",

            value:

                statistics.totalGRN || 0,

            icon:

                <ReceiptLong />


        },


        {

            title: "Total Amount",

            value:

                `₹ ${Number(

                    statistics.totalAmount || 0

                ).toLocaleString(undefined, {

                    minimumFractionDigits: 2,

                    maximumFractionDigits: 2

                })}`,

            icon:

                <CurrencyRupee />


        },


        {

            title: "Completed",

            value:

                statistics.completed || 0,

            icon:

                <CheckCircle />


        },


        {

            title: "Pending",

            value:

                statistics.pending || 0,

            icon:

                <PendingActions />


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

                            className="goods-receipt-note-stat-card"

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



export default GoodsReceiptNoteStatistics;