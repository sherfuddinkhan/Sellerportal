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
    Payments,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const CustomerPaymentCard = ({

    payment,

    onView,

    onEdit,

    onDelete

}) => {



    if (!payment) return null;





    return (



        <Card



            elevation={3}



            sx={{



                height: "100%",



                borderRadius: 2,



                transition: "0.3s",



                "&:hover": {



                    boxShadow: 8,



                    transform:

                        "translateY(-4px)"



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





                    <Payments



                        color="primary"



                        fontSize="large"



                    />








                    <Chip



                        label={



                            payment.PaymentMode ||

                            "N/A"



                        }



                        color="primary"



                        size="small"



                    />







                </Stack>









                <Typography



                    variant="h6"



                    fontWeight="bold"



                    gutterBottom



                >





                    {

                        payment.PaymentNumber

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Invoice ID:</strong>{" "}



                    {

                        payment.SalesInvoiceId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Amount:</strong>{" "}



                    ₹



                    {



                        Number(

                            payment.Amount || 0

                        ).toLocaleString()



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Payment Date:</strong>{" "}



                    {



                        payment.PaymentDate



                            ? new Date(

                                payment.PaymentDate

                              )

                              .toLocaleDateString()



                            : "-"



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Reference:</strong>{" "}



                    {

                        payment.ReferenceNumber ||

                        "-"

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Remarks:</strong>{" "}



                    {

                        payment.Remarks ||

                        "-"

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

                            onView(payment)

                        }



                    >



                        <Visibility />



                    </IconButton>





                </Tooltip>









                <Tooltip title="Edit">



                    <IconButton



                        color="warning"



                        onClick={() =>

                            onEdit(payment)

                        }



                    >



                        <Edit />



                    </IconButton>





                </Tooltip>









                <Tooltip title="Delete">



                    <IconButton



                        color="error"



                        onClick={() =>

                            onDelete(payment)

                        }



                    >



                        <Delete />



                    </IconButton>





                </Tooltip>







            </CardActions>







        </Card>



    );

};



export default CustomerPaymentCard;