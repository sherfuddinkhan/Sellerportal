import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip
} from "@mui/material";



const OrderView = ({

    open,

    order,

    onClose

}) => {



    if (!order) return null;





    const Field = ({

        label,

        value

    }) => (



        <Grid



            item



            xs={12}



            md={6}



        >





            <Typography



                variant="caption"



                color="text.secondary"



            >



                {label}



            </Typography>









            <Typography



                variant="body1"



                fontWeight={500}



            >





                {



                    value || "-"



                }





            </Typography>







        </Grid>



    );







    const getStatusColor = (status) => {



        switch (

            status?.toLowerCase()

        ) {



            case "pending":

                return "warning";



            case "confirmed":

                return "info";



            case "processing":

                return "primary";



            case "packed":

                return "secondary";



            case "shipped":

                return "success";



            case "delivered":

                return "success";



            case "cancelled":

                return "error";



            case "returned":

                return "error";



            default:

                return "default";

        }



    };







    return (



        <Dialog



            open={open}



            onClose={onClose}



            fullWidth



            maxWidth="md"



        >





            <DialogTitle>



                Order Details



            </DialogTitle>







            <Divider />







            <DialogContent



                sx={{ mt: 2 }}



            >







                <Grid



                    container



                    spacing={3}



                >







                    <Field



                        label="Order ID"



                        value={

                            order.OrderId

                        }



                    />









                    <Field



                        label="Seller ID"



                        value={

                            order.SellerId

                        }



                    />









                    <Field



                        label="Customer ID"



                        value={

                            order.CustomerId

                        }



                    />









                    <Field



                        label="Order Number"



                        value={

                            order.OrderNumber

                        }



                    />









                    <Field



                        label="Order Date"



                        value={



                            order.OrderDate



                                ? new Date(

                                    order.OrderDate

                                  )

                                  .toLocaleDateString()



                                : "-"



                        }



                    />









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >



                        <Typography



                            variant="caption"



                            color="text.secondary"



                        >



                            Order Status



                        </Typography>







                        <br />







                        <Chip



                            label={



                                order.OrderStatus ||

                                "N/A"



                            }



                            color={



                                getStatusColor(

                                    order.OrderStatus

                                )



                            }



                        />





                    </Grid>









                    <Field



                        label="Total Amount"



                        value={



                            `₹ ${Number(

                                order.TotalAmount || 0

                            ).toLocaleString()}`



                        }



                    />









                    <Field



                        label="Created Date"



                        value={



                            order.CreatedDate



                                ? new Date(

                                    order.CreatedDate

                                  )

                                  .toLocaleString()



                                : "-"



                        }



                    />







                </Grid>







            </DialogContent>







            <DialogActions>







                <Button



                    variant="contained"



                    onClick={onClose}



                >



                    Close



                </Button>







            </DialogActions>







        </Dialog>



    );

};



export default OrderView;