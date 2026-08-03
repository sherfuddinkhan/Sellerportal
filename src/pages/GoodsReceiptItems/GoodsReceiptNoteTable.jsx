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



const GoodsReceiptNoteTable = ({

    notes = [],

    onView,

    onEdit,

    onDelete

}) => {



    return (


        <TableContainer

            component={Paper}

            className="goods-receipt-note-table"

        >



            <Table

                stickyHeader

            >



                <TableHead>



                    <TableRow>



                        <TableCell>

                            <strong>

                                GRN ID

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                GRN Number

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Purchase Order ID

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Supplier ID

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Receipt Date

                            </strong>

                        </TableCell>





                        <TableCell>

                            <strong>

                                Status

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


                        notes.length === 0 ?



                        (



                            <TableRow>



                                <TableCell

                                    colSpan={8}

                                    align="center"

                                >



                                    <Typography

                                        color="text.secondary"

                                    >


                                        No Goods Receipt Notes Found


                                    </Typography>



                                </TableCell>



                            </TableRow>



                        )



                        :



                        (



                            notes.map((note) => (





                                <TableRow



                                    hover



                                    key={

                                        note.GoodsReceiptNoteId

                                    }



                                >







                                    <TableCell>


                                        {

                                            note.GoodsReceiptNoteId

                                        }


                                    </TableCell>







                                    <TableCell>


                                        {

                                            note.GRNNumber

                                        }


                                    </TableCell>







                                    <TableCell>


                                        {

                                            note.PurchaseOrderId

                                        }


                                    </TableCell>







                                    <TableCell>


                                        {

                                            note.SupplierId

                                        }


                                    </TableCell>







                                    <TableCell>


                                        {

                                            note.ReceiptDate

                                                ?

                                            new Date(

                                                note.ReceiptDate

                                            ).toLocaleDateString()

                                                :

                                            "-"

                                        }


                                    </TableCell>







                                    <TableCell>


                                        {

                                            note.Status

                                        }


                                    </TableCell>







                                    <TableCell align="right">


                                        {

                                            formatCurrency(

                                                note.TotalAmount

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

                                                    onView(note)

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

                                                    onEdit(note)

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

                                                    onDelete(note)

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



export default GoodsReceiptNoteTable;