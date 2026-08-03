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
    Visibility,
    Edit,
    Delete,
    Person
} from "@mui/icons-material";


const SellerCustomerCard = ({

    customer,

    onView,

    onEdit,

    onDelete

}) => {


    if (!customer) return null;


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

                    <Person

                        color="primary"

                        fontSize="large"

                    />


                    <Chip

                        label={

                            customer.IsActive

                                ? "Active"

                                : "Inactive"

                        }

                        color={

                            customer.IsActive

                                ? "success"

                                : "error"

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

                        customer.CustomerName

                    }

                </Typography>



                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    <strong>Code:</strong>{" "}

                    {

                        customer.CustomerCode ||

                        "-"

                    }

                </Typography>



                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    <strong>Contact:</strong>{" "}

                    {

                        customer.ContactPerson ||

                        "-"

                    }

                </Typography>



                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    <strong>Email:</strong>{" "}

                    {

                        customer.Email ||

                        "-"

                    }

                </Typography>



                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    <strong>Phone:</strong>{" "}

                    {

                        customer.Phone ||

                        "-"

                    }

                </Typography>



                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    <strong>GSTIN:</strong>{" "}

                    {

                        customer.GSTIN ||

                        "-"

                    }

                </Typography>



                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    <strong>Location:</strong>{" "}

                    {

                        customer.City ||

                        "-"

                    }

                    ,

                    {" "}

                    {

                        customer.State ||

                        "-"

                    }

                </Typography>



                <Typography

                    variant="body2"

                    color="text.secondary"

                >

                    <strong>Credit Limit:</strong>{" "}

                    ₹

                    {

                        Number(

                            customer.CreditLimit || 0

                        ).toLocaleString()

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

                            onView(customer)

                        }

                    >

                        <Visibility />

                    </IconButton>


                </Tooltip>



                <Tooltip title="Edit">


                    <IconButton

                        color="warning"

                        onClick={() =>

                            onEdit(customer)

                        }

                    >

                        <Edit />

                    </IconButton>


                </Tooltip>



                <Tooltip title="Delete">


                    <IconButton

                        color="error"

                        onClick={() =>

                            onDelete(customer)

                        }

                    >

                        <Delete />

                    </IconButton>


                </Tooltip>


            </CardActions>


        </Card>

    );

};


export default SellerCustomerCard;