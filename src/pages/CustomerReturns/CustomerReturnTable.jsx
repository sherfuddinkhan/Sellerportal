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



const CustomerReturnTable = ({

    items = [],

    loading,

    onView,

    onEdit,

    onDelete

}) => {



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



                    No Customer Returns Found



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

                            Return ID

                        </TableCell>









                        <TableCell>

                            Invoice ID

                        </TableCell>









                        <TableCell>

                            Product ID

                        </TableCell>









                        <TableCell>

                            Return Number

                        </TableCell>









                        <TableCell>

                            Return Date

                        </TableCell>









                        <TableCell>

                            Quantity

                        </TableCell>









                        <TableCell>

                            Return Amount

                        </TableCell>









                        <TableCell>

                            Status

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

                                    row.CustomerReturnId

                                }



                                hover



                            >







                                <TableCell>



                                    {

                                        row.CustomerReturnId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        row.SalesInvoiceId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        row.ProductId

                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        row.ReturnNumber ||

                                        "-"



                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        row.ReturnDate



                                            ? new Date(

                                                row.ReturnDate

                                            )

                                            .toLocaleDateString()



                                            : "-"



                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        row.Quantity

                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        row.ReturnAmount



                                            ? `₹ ${row.ReturnAmount}`



                                            : "-"



                                    }



                                </TableCell>









                                <TableCell>







                                    <Chip



                                        label={



                                            row.Status ||

                                            "N/A"



                                        }



                                        color={



                                            getStatusColor(

                                                row.Status

                                            )



                                        }



                                        size="small"



                                    />







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



export default CustomerReturnTable;