import React from "react";


import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";


import {
    AssignmentReturn,
    PendingActions,
    CheckCircle,
    Cancel
} from "@mui/icons-material";



const CustomerReturnStatistics = ({

    returns = []

}) => {



    const totalReturns = returns.length;





    const pendingReturns = returns.filter(

        item =>

            item.Status

                ?.toLowerCase() === "pending"

    ).length;





    const completedReturns = returns.filter(

        item =>

            [

                "completed",

                "approved"

            ]

            .includes(

                item.Status

                    ?.toLowerCase()

            )

    ).length;





    const cancelledReturns = returns.filter(

        item =>

            [

                "cancelled",

                "rejected"

            ]

            .includes(

                item.Status

                    ?.toLowerCase()

            )

    ).length;







    const statistics = [



        {

            title: "Total Returns",

            value: totalReturns,

            icon: (

                <AssignmentReturn

                    fontSize="large"

                />

            )

        },



        {

            title: "Pending",

            value: pendingReturns,

            icon: (

                <PendingActions

                    fontSize="large"

                />

            )

        },



        {

            title: "Completed",

            value: completedReturns,

            icon: (

                <CheckCircle

                    fontSize="large"

                />

            )

        },



        {

            title: "Cancelled",

            value: cancelledReturns,

            icon: (

                <Cancel

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



export default CustomerReturnStatistics;