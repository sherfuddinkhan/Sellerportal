import React from "react";


import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";


import {
    LocalShipping,
    CheckCircle,
    PendingActions,
    Inventory
} from "@mui/icons-material";



const ShipmentStatistics = ({

    shipments = []

}) => {



    const totalShipments = shipments.length;





    const deliveredShipments = shipments.filter(

        item =>

            item.ShipmentStatus

                ?.toLowerCase() === "delivered"

    ).length;





    const pendingShipments = shipments.filter(

        item =>

            [

                "pending",

                "processing",

                "packed"

            ]

            .includes(

                item.ShipmentStatus

                    ?.toLowerCase()

            )

    ).length;





    const activeShipments = shipments.filter(

        item =>

            [

                "shipped",

                "in transit",

                "out for delivery"

            ]

            .includes(

                item.ShipmentStatus

                    ?.toLowerCase()

            )

    ).length;







    const statistics = [



        {

            title: "Total Shipments",

            value: totalShipments,

            icon: (

                <LocalShipping

                    fontSize="large"

                />

            )

        },



        {

            title: "Delivered",

            value: deliveredShipments,

            icon: (

                <CheckCircle

                    fontSize="large"

                />

            )

        },



        {

            title: "Pending",

            value: pendingShipments,

            icon: (

                <PendingActions

                    fontSize="large"

                />

            )

        },



        {

            title: "Active Shipments",

            value: activeShipments,

            icon: (

                <Inventory

                    fontSize="large"

                />

            )

        }



    ];







    return (



        <Grid



            container



            spacing={3}



            sx={{ mb: 3 }}



        >







            {



                statistics.map((stat, index) => (



                    <Grid



                        item



                        xs={12}



                        sm={6}



                        md={3}



                        key={index}



                    >







                        <Card



                            elevation={3}



                            sx={{



                                height: "100%",



                                borderRadius: 2,



                                transition: "0.3s",



                                "&:hover": {



                                    transform:

                                        "translateY(-4px)",



                                    boxShadow: 6



                                }



                            }}



                        >







                            <CardContent>







                                <Stack



                                    direction="row"



                                    justifyContent="space-between"



                                    alignItems="center"



                                >







                                    <div>







                                        <Typography



                                            variant="subtitle2"



                                            color="text.secondary"



                                        >



                                            {

                                                stat.title

                                            }



                                        </Typography>









                                        <Typography



                                            variant="h5"



                                            fontWeight="bold"



                                        >



                                            {

                                                stat.value

                                            }



                                        </Typography>







                                    </div>









                                    <Stack



                                        color="primary.main"



                                    >



                                        {

                                            stat.icon

                                        }



                                    </Stack>







                                </Stack>







                            </CardContent>







                        </Card>







                    </Grid>







                ))



            }







        </Grid>



    );

};



export default ShipmentStatistics;