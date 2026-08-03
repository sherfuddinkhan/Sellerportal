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



const GoodsReceiptNoteItemTable = ({

    items = [],

    onView,

    onEdit,

    onDelete

}) => {



    return (



        <TableContainer

            component={Paper}

            className="goods-receipt-note-item-table"

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

                                GRN ID

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Product ID

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Received Qty

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Accepted Qty

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Rejected Qty

                            </strong>

                        </TableCell>





                        <TableCell align="right">

                            <strong>

                                Unit Price

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



                        items.length === 0 ?



                        (



                            <TableRow>



                                <TableCell

                                    colSpan={10}

                                    align="center"

                                >



                                    <Typography

                                        color="text.secondary"

                                    >


                                        No Goods Receipt Note Items Found


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

                                        item.GoodsReceiptNoteItemId

                                    }



                                >








                                    <TableCell>


                                        {

                                            item.GoodsReceiptNoteItemId

                                        }


                                    </TableCell>








                                    <TableCell>


                                        {

                                            item.GoodsReceiptNoteId

                                        }


                                    </TableCell>








                                    <TableCell>


                                        {

                                            item.ProductId

                                        }


                                    </TableCell>








                                    <TableCell>


                                        {

                                            item.ReceivedQuantity

                                        }


                                    </TableCell>








                                    <TableCell>


                                        {

                                            item.AcceptedQuantity

                                        }


                                    </TableCell>








                                    <TableCell>


                                        {

                                            item.RejectedQuantity

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







                                        <Tooltip

                                            title="View"

                                        >



                                            <IconButton


                                                color="primary"


                                                onClick={() =>

                                                    onView(item)

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

                                                    onEdit(item)

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



export default GoodsReceiptNoteItemTable;