import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";

import {
    People,
    CheckCircle,
    Cancel,
    AccountBalanceWallet
} from "@mui/icons-material";


const SellerCustomerStatistics = ({

    customers = []

}) => {


    const totalCustomers = customers.length;


    const activeCustomers = customers.filter(

        customer => customer.IsActive

    ).length;


    const inactiveCustomers =

        totalCustomers - activeCustomers;


    const totalCreditLimit = customers.reduce(

        (sum, customer) =>

            sum +

            Number(

                customer.CreditLimit || 0

            ),

        0

    );


    const statistics = [

        {

            title: "Total Customers",

            value: totalCustomers,

            icon: <People fontSize="large" />,

            color: "primary"

        },

        {

            title: "Active Customers",

            value: activeCustomers,

            icon: <CheckCircle fontSize="large" />,

            color: "success"

        },

        {

            title: "Inactive Customers",

            value: inactiveCustomers,

            icon: <Cancel fontSize="large" />,

            color: "error"

        },

        {

            title: "Credit Limit",

            value:

                `₹ ${totalCreditLimit.toLocaleString()}`,

            icon:

                <AccountBalanceWallet fontSize="large" />,

            color: "warning"

        }

    ];


    return (

        <Grid

            container

            spacing={3}

            sx={{ mb: 3 }}

        >

            {

                statistics.map((item, index) => (

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

                                borderRadius: 2,

                                height: "100%",

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

                                                item.title

                                            }

                                        </Typography>


                                        <Typography

                                            variant="h5"

                                            fontWeight="bold"

                                        >

                                            {

                                                item.value

                                            }

                                        </Typography>

                                    </div>


                                    <Stack

                                        color={

                                            `${item.color}.main`

                                        }

                                    >

                                        {

                                            item.icon

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


export default SellerCustomerStatistics;
