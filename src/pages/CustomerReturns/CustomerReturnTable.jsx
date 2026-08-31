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
        sx={{
            width: "100%",
            overflowX: "auto",
        }}
    >

        <Table
            size="small"
            sx={{
                minWidth: 1100,
            }}
        >

            {/* =====================================================
                TABLE HEADER
            ===================================================== */}

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


            {/* =====================================================
                TABLE BODY
            ===================================================== */}

            <TableBody>

                {items.map((row) => {

                    // =================================================
                    // SUPPORT BOTH PascalCase AND camelCase
                    // =================================================

                    const returnId =
                        row.CustomerReturnId ??
                        row.customerReturnId;

                    const invoiceId =
                        row.SalesInvoiceId ??
                        row.salesInvoiceId;

                    const productId =
                        row.ProductId ??
                        row.productId;

                    const returnNumber =
                        row.ReturnNumber ??
                        row.returnNumber;

                    const returnDate =
                        row.ReturnDate ??
                        row.returnDate;

                    const quantity =
                        row.Quantity ??
                        row.quantity ??
                        0;

                    const returnAmount =
                        row.ReturnAmount ??
                        row.returnAmount ??
                        0;

                    const status =
                        row.Status ??
                        row.status ??
                        "N/A";


                    return (

                        <TableRow
                            key={returnId}
                            hover
                        >

                            {/* =================================================
                                RETURN ID
                            ================================================= */}

                            <TableCell>

                                {returnId}

                            </TableCell>


                            {/* =================================================
                                INVOICE ID
                            ================================================= */}

                            <TableCell>

                                {invoiceId}

                            </TableCell>


                            {/* =================================================
                                PRODUCT ID
                            ================================================= */}

                            <TableCell>

                                {productId}

                            </TableCell>


                            {/* =================================================
                                RETURN NUMBER
                            ================================================= */}

                            <TableCell>

                                {returnNumber || "-"}

                            </TableCell>


                            {/* =================================================
                                RETURN DATE
                            ================================================= */}

                            <TableCell>

                                {returnDate

                                    ? new Date(
                                        returnDate
                                    ).toLocaleDateString(
                                        "en-IN"
                                    )

                                    : "-"

                                }

                            </TableCell>


                            {/* =================================================
                                QUANTITY
                            ================================================= */}

                            <TableCell>

                                {quantity}

                            </TableCell>


                            {/* =================================================
                                RETURN AMOUNT
                            ================================================= */}

                            <TableCell>

                                ₹{" "}

                                {Number(
                                    returnAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </TableCell>


                            {/* =================================================
                                STATUS
                            ================================================= */}

                            <TableCell>

                                <Chip

                                    label={status}

                                    color={
                                        getStatusColor(
                                            status
                                        )
                                    }

                                    size="small"

                                />

                            </TableCell>


                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <TableCell
                                align="center"
                            >

                                {/* =============================================
                                    VIEW
                                ============================================= */}

                                <Tooltip
                                    title="View Return"
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


                                {/* =============================================
                                    EDIT
                                ============================================= */}

                                <Tooltip
                                    title="Edit Return"
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


                                {/* =============================================
                                    DELETE
                                ============================================= */}

                                <Tooltip
                                    title="Delete Return"
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

                    );

                })}

            </TableBody>

        </Table>

    </TableContainer>

);

};



export default CustomerReturnTable;