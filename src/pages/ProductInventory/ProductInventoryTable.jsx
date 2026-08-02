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
    Chip,
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


const ProductInventoryTable = ({

    inventories = [],

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



    if (inventories.length === 0) {

        return (

            <Paper sx={{ p:4 }}>

                <Typography

                    align="center"

                    color="text.secondary"

                >

                    No Inventory Records Found

                </Typography>

            </Paper>

        );

    }



    return (

        <TableContainer

            component={Paper}

        >

            <Table>


                <TableHead>


                    <TableRow>


                        <TableCell>

                            Inventory ID

                        </TableCell>


                        <TableCell>

                            Product ID

                        </TableCell>


                        <TableCell>

                            Seller ID

                        </TableCell>


                        <TableCell>

                            Warehouse ID

                        </TableCell>


                        <TableCell align="right">

                            Quantity

                        </TableCell>


                        <TableCell align="right">

                            Available

                        </TableCell>


                        <TableCell align="right">

                            Reserved

                        </TableCell>


                        <TableCell>

                            Stock Status

                        </TableCell>


                        <TableCell>

                            Active

                        </TableCell>


                        <TableCell align="center">

                            Actions

                        </TableCell>


                    </TableRow>


                </TableHead>



                <TableBody>


                    {

                        inventories.map((row)=>(


                            <TableRow

                                key={
                                    row.ProductInventoryId
                                }

                                hover

                            >


                                <TableCell>

                                    {
                                        row.ProductInventoryId
                                    }

                                </TableCell>



                                <TableCell>

                                    {
                                        row.ProductId
                                    }

                                </TableCell>



                                <TableCell>

                                    {
                                        row.SellerId
                                    }

                                </TableCell>



                                <TableCell>

                                    {
                                        row.WarehouseId || "-"
                                    }

                                </TableCell>



                                <TableCell align="right">

                                    {
                                        row.Quantity || 0
                                    }

                                </TableCell>



                                <TableCell align="right">

                                    {
                                        row.AvailableQuantity || 0
                                    }

                                </TableCell>



                                <TableCell align="right">

                                    {
                                        row.ReservedQuantity || 0
                                    }

                                </TableCell>



                                <TableCell>


                                    <Chip

                                        label={
                                            row.StockStatus || "-"
                                        }

                                        color={

                                            row.StockStatus ===
                                            "Available"

                                                ?

                                                "success"

                                                :

                                            row.StockStatus ===
                                            "Low Stock"

                                                ?

                                                "warning"

                                                :

                                                "error"

                                        }

                                        size="small"

                                    />


                                </TableCell>



                                <TableCell>


                                    <Chip

                                        label={

                                            row.IsActive

                                                ?

                                                "Active"

                                                :

                                                "Inactive"

                                        }


                                        color={

                                            row.IsActive

                                                ?

                                                "success"

                                                :

                                                "error"

                                        }


                                        size="small"

                                    />


                                </TableCell>



                                <TableCell align="center">


                                    <Tooltip title="View">


                                        <IconButton

                                            color="primary"

                                            onClick={() =>
                                                onView(row)
                                            }

                                        >

                                            <Visibility />

                                        </IconButton>


                                    </Tooltip>



                                    <Tooltip title="Edit">


                                        <IconButton

                                            color="warning"

                                            onClick={() =>
                                                onEdit(row)
                                            }

                                        >

                                            <Edit />

                                        </IconButton>


                                    </Tooltip>



                                    <Tooltip title="Delete">


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


export default ProductInventoryTable;