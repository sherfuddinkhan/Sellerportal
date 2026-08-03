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



const ShipmentTable = ({

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



                    No Shipments Found



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

                            Shipment ID

                        </TableCell>









                        <TableCell>

                            Order ID

                        </TableCell>









                        <TableCell>

                            Courier Name

                        </TableCell>









                        <TableCell>

                            Tracking Number

                        </TableCell>









                        <TableCell>

                            Shipment Date

                        </TableCell>









                        <TableCell>

                            Delivery Date

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

                                    row.ShipmentId

                                }



                                hover



                            >







                                <TableCell>



                                    {

                                        row.ShipmentId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        row.OrderId

                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        row.CourierName ||

                                        "-"



                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        row.TrackingNumber ||

                                        "-"



                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        row.ShipmentDate



                                            ? new Date(

                                                row.ShipmentDate

                                            )

                                            .toLocaleDateString()



                                            : "-"



                                    }



                                </TableCell>









                                <TableCell>



                                    {



                                        row.DeliveryDate



                                            ? new Date(

                                                row.DeliveryDate

                                            )

                                            .toLocaleDateString()



                                            : "-"



                                    }



                                </TableCell>









                                <TableCell>







                                    <Chip



                                        label={



                                            row.ShipmentStatus ||

                                            "N/A"



                                        }



                                        color={



                                            getStatusColor(

                                                row.ShipmentStatus

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



export default ShipmentTable;