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



const OrderStatusHistoryTable = ({

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



                    No Order Status History Found



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

                            History ID

                        </TableCell>









                        <TableCell>

                            Order ID

                        </TableCell>









                        <TableCell>

                            Status

                        </TableCell>









                        <TableCell>

                            Remarks

                        </TableCell>









                        <TableCell>

                            Changed On

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

                                    row.HistoryId

                                }



                                hover



                            >







                                <TableCell>



                                    {

                                        row.HistoryId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        row.OrderId

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









                                <TableCell>







                                    {



                                        row.Remarks ||

                                        "-"



                                    }







                                </TableCell>









                                <TableCell>







                                    {



                                        row.ChangedOn



                                            ? new Date(

                                                row.ChangedOn

                                            )

                                            .toLocaleString()



                                            : "-"



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



export default OrderStatusHistoryTable;