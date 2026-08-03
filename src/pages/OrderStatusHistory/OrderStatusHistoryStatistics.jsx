import React from "react";


import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";


import {
    History,
    ListAlt,
    Update,
    TrendingUp
} from "@mui/icons-material";



const OrderStatusHistoryStatistics = ({

    history = []

}) => {



    const totalRecords = history.length;





    const uniqueStatuses = new Set(

        history

            .map(item => item.Status)

            .filter(Boolean)

    ).size;





    const latestChange = history.length

        ? history

            .sort(

                (a, b) =>

                    new Date(b.ChangedOn) -

                    new Date(a.ChangedOn)

            )[0]

        : null;





    const latestDate = latestChange?.ChangedOn

        ? new Date(

            latestChange.ChangedOn

        ).toLocaleDateString()

        : "-";





    const trackedOrders = new Set(

        history.map(

            item => item.OrderId

        )

    ).size;







    const statistics = [



        {

            title: "Total History Records",

            value: totalRecords,

            icon: (

                <History

                    fontSize="large"

                />

            )

        },



        {

            title: "Status Types",

            value: uniqueStatuses,

            icon: (

                <ListAlt

                    fontSize="large"

                />

            )

        },



        {

            title: "Latest Change",

            value: latestDate,

            icon: (

                <Update

                    fontSize="large"

                />

            )

        },



        {

            title: "Orders Tracked",

            value: trackedOrders,

            icon: (

                <TrendingUp

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



export default OrderStatusHistoryStatistics;