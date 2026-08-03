import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    CircularProgress,
    Typography,
    Box,
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const OrderTable = ({

    orders = [],

    loading,

    onView,

    onEdit,

    onDelete

}) => {



    if (loading) {


        return (


            <Box

                display="flex"

                justifyContent="center"

                mt={5}

            >


                <CircularProgress />


            </Box>


        );


    }




    if (orders.length === 0) {


        return (


            <Paper

                sx={{

                    p: 4

                }}

            >


                <Typography

                    align="center"

                    color="text.secondary"

                >


                    No Orders Found


                </Typography>


            </Paper>


        );


    }




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



        <TableContainer

            component={Paper}

        >



            <Table

                size="small"

            >



                <TableHead>



                    <TableRow>



                        <TableCell>

                            Order ID

                        </TableCell>




                        <TableCell>

                            Seller ID

                        </TableCell>




                        <TableCell>

                            Customer ID

                        </TableCell>




                        <TableCell>

                            Order Number

                        </TableCell>




                        <TableCell>

                            Order Date

                        </TableCell>




                        <TableCell>

                            Status

                        </TableCell>




                        <TableCell>

                            Total Amount

                        </TableCell>




                        <TableCell

                            align="center"

                        >

                            Actions

                        </TableCell>



                    </TableRow>



                </TableHead>





                <TableBody>





                    {


                        orders.map((row) => (



                            <TableRow



                                key={

                                    row.OrderId

                                }



                                hover



                            >






                                <TableCell>



                                    {

                                        row.OrderId

                                    }



                                </TableCell>







                                <TableCell>



                                    {

                                        row.SellerId

                                    }



                                </TableCell>







                                <TableCell>



                                    {

                                        row.CustomerId

                                    }



                                </TableCell>







                                <TableCell>



                                    {

                                        row.OrderNumber

                                    }



                                </TableCell>







                                <TableCell>



                                    {


                                        row.OrderDate



                                            ? new Date(

                                                row.OrderDate

                                              )

                                              .toLocaleDateString()



                                            : "-"



                                    }



                                </TableCell>







                                <TableCell>





                                    <Chip



                                        label={

                                            row.OrderStatus ||

                                            "N/A"

                                        }



                                        color={

                                            getStatusColor(

                                                row.OrderStatus

                                            )

                                        }



                                        size="small"



                                    />





                                </TableCell>







                                <TableCell>



                                    ₹{" "}



                                    {



                                        Number(

                                            row.TotalAmount || 0

                                        )

                                        .toLocaleString()



                                    }



                                </TableCell>







                                <TableCell

                                    align="center"

                                >







                                    <Tooltip

                                        title="View"

                                    >



                                        <IconButton



                                            color="primary"



                                            onClick={() =>

                                                onView(row)

                                            }



                                        >



                                            <Visibility />



                                        </IconButton>



                                    </Tooltip>









                                    <Tooltip

                                        title="Edit"

                                    >



                                        <IconButton



                                            color="warning"



                                            onClick={() =>

                                                onEdit(row)

                                            }



                                        >



                                            <Edit />



                                        </IconButton>



                                    </Tooltip>









                                    <Tooltip

                                        title="Delete"

                                    >



                                        <IconButton



                                            color="error"



                                            onClick={() =>

                                                onDelete(row)

                                            }



                                        >



                                            <Delete />



                                        </IconButton>



                                    </Tooltip>







                                </TableCell>







                            </TableRow>





                        ))



                    }





                </TableBody>







            </Table>







        </TableContainer>



    );

};



export default OrderTable;