import React from "react";
import {Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Tooltip,CircularProgress,Typography,Box,Chip} from "@mui/material";
import {Visibility,Edit,Delete} from "@mui/icons-material";
const CustomerPaymentTable = ({
    payments = [],
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
    if (payments.length === 0) {
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
                    No Customer Payments Found
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
                            ID
                        </TableCell>
                        <TableCell>
                            Invoice ID
                        </TableCell>
                        <TableCell>
                            Payment Number
                        </TableCell>
                        <TableCell>
                            Payment Date
                        </TableCell>
                        <TableCell>
                            Amount
                        </TableCell>
                        <TableCell>
                            Payment Mode
                        </TableCell>
                        <TableCell>
                            Reference Number
                        </TableCell>
                        <TableCell>
                            Remarks
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
                        payments.map((row) => (
                            <TableRow
                                key={
                                    row.CustomerPaymentId
                                }
                                hover
                            >
                                <TableCell>
                                    {
                                        row.CustomerPaymentId
                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        row.SalesInvoiceId
                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        row.PaymentNumber
                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        row.PaymentDate
                                            ? new Date(
                                                row.PaymentDate
                                              )
                                              .toLocaleDateString()

                                            : "-"

                                    }


                                </TableCell>





                                <TableCell>



                                    ₹{" "}

                                    {


                                        Number(

                                            row.Amount || 0

                                        )

                                        .toLocaleString()

                                    }



                                </TableCell>





                                <TableCell>



                                    <Chip



                                        label={

                                            row.PaymentMode ||

                                            "N/A"

                                        }



                                        size="small"



                                        color="primary"



                                    />



                                </TableCell>





                                <TableCell>


                                    {

                                        row.ReferenceNumber ||

                                        "-"

                                    }


                                </TableCell>





                                <TableCell>



                                    {

                                        row.Remarks ||

                                        "-"

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



export default CustomerPaymentTable;