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
    Box
} from "@mui/material";


import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const OrderItemTable = ({

    items = [],

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







    if (items.length === 0) {



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



                    No Order Items Found



                </Typography>



            </Paper>



        );



    }







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

                            Item ID

                        </TableCell>









                        <TableCell>

                            Order ID

                        </TableCell>









                        <TableCell>

                            Product ID

                        </TableCell>









                        <TableCell>

                            Quantity

                        </TableCell>









                        <TableCell>

                            Unit Price

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



                        items.map((row) => (







                            <TableRow



                                key={

                                    row.OrderItemId

                                }



                                hover



                            >







                                <TableCell>



                                    {

                                        row.OrderItemId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        row.OrderId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        row.ProductId

                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        Number(

                                            row.Quantity || 0

                                        )

                                        .toFixed(2)



                                    }



                                </TableCell>









                                <TableCell>



                                    ₹{" "}



                                    {



                                        Number(

                                            row.UnitPrice || 0

                                        )

                                        .toLocaleString()



                                    }



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



export default OrderItemTable;