import React from "react";
import {Grid,Card,CardContent,Typography,Stack} from "@mui/material";
import {Payments,CurrencyRupee,AccountBalance,Today} from "@mui/icons-material";

const CustomerPaymentStatistics = ({
    payments = []
}) => {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce(
        (sum, item) =>
            sum + Number(item.Amount || 0),
        0
    );
    const bankPayments = payments.filter(
        item =>
            item.PaymentMode?.toLowerCase().includes("bank")
    ).length;
    const todayPayments = payments.filter(item => {
        if (!item.PaymentDate)
            return false;
        const paymentDate =
            new Date(item.PaymentDate);
        const today =
            new Date();
        return (
            paymentDate.getDate() === today.getDate()
            &&
            paymentDate.getMonth() === today.getMonth()
            &&
            paymentDate.getFullYear() === today.getFullYear()
        );
    }).length;

    const statistics = [
        {
            title: "Total Payments",
            value: totalPayments,
            icon: (
                <Payments
                    fontSize="large"
                />
            )
        },
        {
            title: "Total Amount",
            value:
                `₹ ${totalAmount.toFixed(2)}`,
            icon: (
                <CurrencyRupee
                    fontSize="large"
                />
            )
        },
        {
            title: "Bank Payments",
            value: bankPayments,
            icon: (
                <AccountBalance
                    fontSize="large"
                />
            )
        },
        {

            title: "Today's Payments",

            value: todayPayments,

            icon: (

                <Today

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
                                        color="primary.main"
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
export default CustomerPaymentStatistics;