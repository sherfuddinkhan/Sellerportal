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
    History,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const OrderStatusHistoryCard = ({

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







                    <History



                        color="primary"



                        fontSize="large"



                    />









                    <Chip



                        label={



                            item.Status ||

                            "N/A"



                        }



                        color={



                            getStatusColor(

                                item.Status

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





                    History #

                    {

                        item.HistoryId

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





                    <strong>Remarks:</strong>{" "}



                    {



                        item.Remarks ||

                        "-"



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Changed On:</strong>{" "}



                    {



                        item.ChangedOn



                            ? new Date(

                                item.ChangedOn

                            )

                            .toLocaleDateString()



                            : "-"



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



export default OrderStatusHistoryCard;