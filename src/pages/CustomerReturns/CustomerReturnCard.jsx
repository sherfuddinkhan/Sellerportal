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
    AssignmentReturn,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const CustomerReturnCard = ({

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



            case "approved":

                return "info";



            case "processing":

                return "primary";



            case "completed":

                return "success";



            case "rejected":

                return "error";



            case "cancelled":

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







                    <AssignmentReturn



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





                    Return #

                    {

                        item.CustomerReturnId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Return Number:</strong>{" "}



                    {



                        item.ReturnNumber ||

                        "-"



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Invoice ID:</strong>{" "}



                    {

                        item.SalesInvoiceId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Product ID:</strong>{" "}



                    {

                        item.ProductId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Quantity:</strong>{" "}



                    {

                        item.Quantity

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Amount:</strong>{" "}



                    {



                        item.ReturnAmount

                            ? `₹ ${item.ReturnAmount}`

                            : "-"



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Date:</strong>{" "}



                    {



                        formatDate(

                            item.ReturnDate

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



export default CustomerReturnCard;