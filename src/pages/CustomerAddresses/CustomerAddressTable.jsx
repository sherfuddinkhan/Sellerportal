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


const CustomerAddressTable = ({

    addresses = [],

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



    if (addresses.length === 0) {


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

                    No Customer Addresses Found

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

                            Customer ID

                        </TableCell>



                        <TableCell>

                            Address Type

                        </TableCell>



                        <TableCell>

                            Address

                        </TableCell>



                        <TableCell>

                            City

                        </TableCell>



                        <TableCell>

                            State

                        </TableCell>



                        <TableCell>

                            Country

                        </TableCell>



                        <TableCell>

                            Postal Code

                        </TableCell>



                        <TableCell>

                            Default

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

                        addresses.map((row) => (


                            <TableRow

                                key={

                                    row.CustomerAddressId

                                }

                                hover

                            >



                                <TableCell>

                                    {

                                        row.CustomerAddressId

                                    }

                                </TableCell>



                                <TableCell>

                                    {

                                        row.CustomerId

                                    }

                                </TableCell>



                                <TableCell>

                                    {

                                        row.AddressType

                                    }

                                </TableCell>



                                <TableCell>


                                    {

                                        row.AddressLine1

                                    }


                                    {

                                        row.AddressLine2 &&

                                        <>

                                            <br />

                                            {

                                                row.AddressLine2

                                            }

                                        </>

                                    }


                                </TableCell>



                                <TableCell>

                                    {

                                        row.City ||

                                        "-"

                                    }

                                </TableCell>



                                <TableCell>

                                    {

                                        row.State ||

                                        "-"

                                    }

                                </TableCell>



                                <TableCell>

                                    {

                                        row.Country ||

                                        "-"

                                    }

                                </TableCell>



                                <TableCell>

                                    {

                                        row.PostalCode ||

                                        "-"

                                    }

                                </TableCell>



                                <TableCell>


                                    <Chip

                                        label={

                                            row.IsDefault

                                                ? "Yes"

                                                : "No"

                                        }

                                        color={

                                            row.IsDefault

                                                ? "success"

                                                : "default"

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


export default CustomerAddressTable;