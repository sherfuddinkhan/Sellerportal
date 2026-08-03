import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    Button,
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


const formatCurrency = (value) =>

    `₹ ${Number(value || 0).toLocaleString(undefined, {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    })}`;



const formatDate = (value) =>

    value

        ? new Date(value).toLocaleDateString()

        : "-";



const getStatusColor = (status) => {


    switch ((status || "").toLowerCase()) {


        case "completed":

            return "success";


        case "processing":

            return "info";


        case "pending":

            return "warning";


        case "cancelled":

            return "error";


        default:

            return "default";


    }

};




const PurchaseOrderCard = ({

    item,

    onView,

    onEdit,

    onDelete

}) => {


    return (


        <Card

            className="purchase-order-card"

            sx={{

                height: "100%",

                borderRadius: 2

            }}

        >




            <CardContent>




                <Typography

                    variant="h6"

                    fontWeight="bold"

                    gutterBottom

                >

                    {

                        item.PurchaseOrderNumber

                    }


                </Typography>





                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    Purchase Order ID :

                    {" "}

                    {item.PurchaseOrderId}


                </Typography>





                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    Seller ID :

                    {" "}

                    {item.SellerId}


                </Typography>





                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    Supplier ID :

                    {" "}

                    {item.SupplierId}


                </Typography>





                <Divider

                    sx={{ my: 2 }}

                />





                <Stack spacing={1}>




                    <Typography

                        variant="body2"

                    >

                        <strong>

                            Order Date:

                        </strong>

                        {" "}

                        {

                            formatDate(
                                item.OrderDate
                            )

                        }


                    </Typography>





                    <Typography

                        variant="body2"

                    >

                        <strong>

                            Expected Delivery:

                        </strong>

                        {" "}

                        {

                            formatDate(
                                item.ExpectedDeliveryDate
                            )

                        }


                    </Typography>





                    <Typography

                        variant="body2"

                    >

                        <strong>

                            Status:

                        </strong>


                    </Typography>




                    <Chip

                        label={

                            item.Status || "-"

                        }

                        color={

                            getStatusColor(
                                item.Status
                            )

                        }

                        size="small"

                    />





                    <Typography

                        variant="body1"

                        fontWeight="bold"

                    >

                        Total Amount:

                        {" "}

                        {

                            formatCurrency(
                                item.TotalAmount
                            )

                        }


                    </Typography>





                    <Typography

                        variant="body2"

                    >

                        <strong>

                            Remarks:

                        </strong>

                        {" "}

                        {

                            item.Remarks || "-"

                        }


                    </Typography>





                </Stack>




            </CardContent>





            <CardActions

                sx={{

                    justifyContent: "space-between",

                    px: 2,

                    pb: 2

                }}

            >




                <Button

                    size="small"

                    startIcon={<Visibility />}

                    onClick={() =>
                        onView(item)
                    }

                >

                    View


                </Button>





                <Button

                    size="small"

                    color="warning"

                    startIcon={<Edit />}

                    onClick={() =>
                        onEdit(item)
                    }

                >

                    Edit


                </Button>





                <Button

                    size="small"

                    color="error"

                    startIcon={<Delete />}

                    onClick={() =>
                        onDelete(item)
                    }

                >

                    Delete


                </Button>




            </CardActions>





        </Card>


    );


};



export default PurchaseOrderCard;