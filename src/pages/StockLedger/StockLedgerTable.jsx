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

    Chip

} from "@mui/material";


import {

    Visibility,

    Edit,

    Delete

} from "@mui/icons-material";



const formatDate = (date) => {



    if(!date)

        return "-";



    return new Date(date).toLocaleDateString();



};





const formatNumber = (value) => {



    return Number(

        value || 0

    ).toFixed(2);



};







const StockLedgerTable = ({

    items = [],

    onView,

    onEdit,

    onDelete

}) => {



    return (



        <TableContainer



            component={Paper}



            className="stock-ledger-table"



            elevation={3}



        >



            <Table>





                <TableHead>





                    <TableRow>





                        <TableCell>

                            ID

                        </TableCell>



                        <TableCell>

                            Seller ID

                        </TableCell>



                        <TableCell>

                            Product ID

                        </TableCell>



                        <TableCell>

                            Warehouse ID

                        </TableCell>



                        <TableCell>

                            Transaction Type

                        </TableCell>



                        <TableCell>

                            Reference Number

                        </TableCell>



                        <TableCell

                            align="right"

                        >

                            Quantity

                        </TableCell>



                        <TableCell

                            align="right"

                        >

                            Balance Quantity

                        </TableCell>



                        <TableCell>

                            Transaction Date

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



                        items.length === 0 ?



                        (



                            <TableRow>



                                <TableCell

                                    colSpan={11}

                                    align="center"

                                >



                                    No Stock Ledger Records Found



                                </TableCell>



                            </TableRow>



                        )



                        :



                        items.map((item)=>(





                            <TableRow



                                key={

                                    item.StockLedgerId

                                }



                                hover



                            >







                                <TableCell>



                                    {

                                        item.StockLedgerId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        item.SellerId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        item.ProductId

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        item.WarehouseId

                                    }



                                </TableCell>









                                <TableCell>



                                    <Chip



                                        label={

                                            item.TransactionType

                                        }



                                        color={



                                            item.TransactionType

                                            ?.toUpperCase()

                                            === "PURCHASE"

                                            ?

                                            "success"

                                            :

                                            item.TransactionType

                                            ?.toUpperCase()

                                            === "SALE"

                                            ?

                                            "error"

                                            :

                                            "default"



                                        }



                                        size="small"



                                    />



                                </TableCell>









                                <TableCell>



                                    {

                                        item.ReferenceNumber || "-"

                                    }



                                </TableCell>









                                <TableCell

                                    align="right"

                                >



                                    {

                                        formatNumber(

                                            item.Quantity

                                        )

                                    }



                                </TableCell>









                                <TableCell

                                    align="right"

                                >



                                    {

                                        formatNumber(

                                            item.BalanceQuantity

                                        )

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        formatDate(

                                            item.TransactionDate

                                        )

                                    }



                                </TableCell>









                                <TableCell>



                                    {

                                        item.Remarks || "-"

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



                                            onClick={()=>



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



                                            onClick={()=>



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



                                            onClick={()=>



                                                onDelete(item)



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



export default StockLedgerTable;