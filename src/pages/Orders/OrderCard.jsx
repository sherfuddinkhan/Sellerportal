import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    ShoppingCart,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const OrderCard = ({

    order,

    onView,

    onEdit,

    onDelete

}) => {



    if (!order) return null;





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



        <Card



            elevation={3}



            sx={{



                height: "100%",



                borderRadius: 2,



                transition: "0.3s",



                "&:hover": {



                    transform:

                        "translateY(-4px)",



                    boxShadow: 8



                }



            }}



        >







            <CardContent>







                <Stack



                    direction="row"



                    justifyContent="space-between"



                    alignItems="center"



                    mb={2}



                >





                    <ShoppingCart



                        color="primary"



                        fontSize="large"



                    />









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



                        size="small"



                    />







                </Stack>









                <Typography



                    variant="h6"



                    fontWeight="bold"



                    gutterBottom



                >





                    {

                        order.OrderNumber

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Order ID:</strong>{" "}



                    {

                        order.OrderId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Customer ID:</strong>{" "}



                    {

                        order.CustomerId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Order Date:</strong>{" "}



                    {



                        order.OrderDate



                            ? new Date(

                                order.OrderDate

                              )

                              .toLocaleDateString()



                            : "-"



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Total Amount:</strong>{" "}



                    ₹



                    {



                        Number(

                            order.TotalAmount || 0

                        )

                        .toLocaleString()



                    }





                </Typography>







            </CardContent>







            <Divider />







            <CardActions



                sx={{



                    justifyContent:

                        "flex-end"



                }}



            >







                <Tooltip title="View">



                    <IconButton



                        color="primary"



                        onClick={() =>

                            onView(order)

                        }



                    >



                        <Visibility />



                    </IconButton>



                </Tooltip>









                <Tooltip title="Edit">



                    <IconButton



                        color="warning"



                        onClick={() =>

                            onEdit(order)

                        }



                    >



                        <Edit />



                    </IconButton>



                </Tooltip>









                <Tooltip title="Delete">



                    <IconButton



                        color="error"



                        onClick={() =>

                            onDelete(order)

                        }



                    >



                        <Delete />



                    </IconButton>



                </Tooltip>







            </CardActions>







        </Card>



    );

};



export default OrderCard;