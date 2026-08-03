import React from "react";


import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    Chip
} from "@mui/material";


import {
    LocalShipping,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const ShipmentCard = ({

    item,

    onView,

    onEdit,

    onDelete

}) => {



    if (!item) return null;







    const getStatusColor = (status) => {



        switch (

            status?.toLowerCase()

        ) {



            case "pending":

                return "warning";



            case "processing":

                return "info";



            case "packed":

                return "secondary";



            case "shipped":

                return "primary";



            case "in transit":

                return "info";



            case "out for delivery":

                return "warning";



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









    const formatDate = (date) => {



        return date



            ? new Date(date)

                .toLocaleDateString()



            : "-";



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







                    <LocalShipping



                        color="primary"



                        fontSize="large"



                    />









                    <Chip



                        label={



                            item.ShipmentStatus ||

                            "N/A"



                        }



                        color={



                            getStatusColor(

                                item.ShipmentStatus

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





                    Shipment #

                    {

                        item.ShipmentId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Order ID:</strong>{" "}



                    {

                        item.OrderId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Courier:</strong>{" "}



                    {



                        item.CourierName ||

                        "-"



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Tracking:</strong>{" "}



                    {



                        item.TrackingNumber ||

                        "-"



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Ship Date:</strong>{" "}



                    {



                        formatDate(

                            item.ShipmentDate

                        )



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Delivery Date:</strong>{" "}



                    {



                        formatDate(

                            item.DeliveryDate

                        )



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

                            onView(item)

                        }



                    >



                        <Visibility />



                    </IconButton>



                </Tooltip>









                <Tooltip title="Edit">



                    <IconButton



                        color="warning"



                        onClick={() =>

                            onEdit(item)

                        }



                    >



                        <Edit />



                    </IconButton>



                </Tooltip>









                <Tooltip title="Delete">



                    <IconButton



                        color="error"



                        onClick={() =>

                            onDelete(item)

                        }



                    >



                        <Delete />



                    </IconButton>



                </Tooltip>







            </CardActions>







        </Card>



    );

};



export default ShipmentCard;