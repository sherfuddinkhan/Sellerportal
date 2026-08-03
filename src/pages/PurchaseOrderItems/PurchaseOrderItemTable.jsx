import React from "react";


import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography
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



const PurchaseOrderItemTable = ({

    items = [],

    onView,

    onEdit,

    onDelete

}) => {



    return (


        <TableContainer

            component={Paper}

            className="purchase-order-item-table"

        >


            <Table

                stickyHeader

            >



                <TableHead>


                    <TableRow>



                        <TableCell>

                            <strong>
                                Item ID
                            </strong>

                        </TableCell>



                        <TableCell>

                            <strong>
                                Purchase Order ID
                            </strong>

                        </TableCell>



                        <TableCell>

                            <strong>
                                Product ID
                            </strong>

                        </TableCell>



                        <TableCell align="right">

                            <strong>
                                Quantity
                            </strong>

                        </TableCell>



                        <TableCell align="right">

                            <strong>
                                Unit Price
                            </strong>

                        </TableCell>



                        <TableCell align="right">

                            <strong>
                                Discount
                            </strong>

                        </TableCell>



                        <TableCell align="right">

                            <strong>
                                Tax Amount
                            </strong>

                        </TableCell>



                        <TableCell align="right">

                            <strong>
                                Total Amount
                            </strong>

                        </TableCell>



                        <TableCell align="center">

                            <strong>
                                Actions
                            </strong>

                        </TableCell>



                    </TableRow>


                </TableHead>





                <TableBody>



                    {

                        items.length === 0 ? (


                            <TableRow>


                                <TableCell

                                    colSpan={9}

                                    align="center"

                                >


                                    <Typography

                                        color="text.secondary"

                                    >

                                        No Purchase Order Items Found


                                    </Typography>


                                </TableCell>


                            </TableRow>


                        )

                        :

                        (

                            items.map((item) => (


                                <TableRow


                                    hover


                                    key={

                                        item.PurchaseOrderItemId

                                    }


                                >





                                    <TableCell>


                                        {

                                            item.PurchaseOrderItemId

                                        }


                                    </TableCell>





                                    <TableCell>


                                        {

                                            item.PurchaseOrderId

                                        }


                                    </TableCell>





                                    <TableCell>


                                        {

                                            item.ProductId

                                        }


                                    </TableCell>





                                    <TableCell align="right">


                                        {

                                            Number(

                                                item.Quantity || 0

                                            ).toFixed(2)

                                        }


                                    </TableCell>





                                    <TableCell align="right">


                                        {

                                            formatCurrency(

                                                item.UnitPrice

                                            )

                                        }


                                    </TableCell>





                                    <TableCell align="right">


                                        {

                                            formatCurrency(

                                                item.Discount

                                            )

                                        }


                                    </TableCell>





                                    <TableCell align="right">


                                        {

                                            formatCurrency(

                                                item.TaxAmount

                                            )

                                        }


                                    </TableCell>





                                    <TableCell align="right">


                                        {

                                            formatCurrency(

                                                item.TotalAmount

                                            )

                                        }


                                    </TableCell>





                                    <TableCell align="center">





                                        <Tooltip title="View">


                                            <IconButton


                                                color="primary"


                                                onClick={() =>

                                                    onView(item)

                                                }


                                            >


                                                <Visibility />


                                            </IconButton>


                                        </Tooltip>





                                        <Tooltip title="Edit">


                                            <IconButton


                                                color="warning"


                                                onClick={() =>

                                                    onEdit(item)

                                                }


                                            >


                                                <Edit />


                                            </IconButton>


                                        </Tooltip>





                                        <Tooltip title="Delete">


                                            <IconButton


                                                color="error"


                                                onClick={() =>

                                                    onDelete(item)

                                                }


                                            >


                                                <Delete />


                                            </IconButton>


                                        </Tooltip>





                                    </TableCell>




                                </TableRow>



                            ))


                        )


                    }




                </TableBody>



            </Table>



        </TableContainer>


    );


};



export default PurchaseOrderItemTable;