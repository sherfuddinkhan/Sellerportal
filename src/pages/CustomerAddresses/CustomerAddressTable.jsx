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

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={5}
                mb={5}
            >
                <CircularProgress />
            </Box>

        );
    }


    // ============================================================
    // EMPTY
    // ============================================================

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


    // ============================================================
    // ADDRESS TYPE COLOR
    // ============================================================

    const getAddressTypeColor = (type) => {

        switch (
            type?.toLowerCase()
        ) {

            case "billing":
                return "primary";

            case "shipping":
                return "success";

            case "both":
                return "info";

            default:
                return "default";
        }
    };


    return (

        <TableContainer
            component={Paper}
        >

            <Table
                size="small"
            >

                {/* =================================================
                    HEADER
                ================================================= */}

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


                {/* =================================================
                    BODY
                ================================================= */}

                <TableBody>

                    {addresses.map(
                        (row = {}) => {

                            const id =
                                row.CustomerAddressId ??
                                row.customerAddressId ??
                                0;

                            const customerId =
                                row.CustomerId ??
                                row.customerId ??
                                0;

                            const addressType =
                                row.AddressType ??
                                row.addressType ??
                                "";

                            const addressLine1 =
                                row.AddressLine1 ??
                                row.addressLine1 ??
                                "";

                            const addressLine2 =
                                row.AddressLine2 ??
                                row.addressLine2 ??
                                "";

                            const city =
                                row.City ??
                                row.city ??
                                "";

                            const state =
                                row.State ??
                                row.state ??
                                "";

                            const country =
                                row.Country ??
                                row.country ??
                                "";

                            const postalCode =
                                row.PostalCode ??
                                row.postalCode ??
                                "";

                            const isDefault =
                                row.IsDefault ??
                                row.isDefault ??
                                false;


                            return (

                                <TableRow
                                    key={id}
                                    hover
                                >

                                    {/* =================================
                                        ID
                                    ================================= */}

                                    <TableCell>
                                        {id}
                                    </TableCell>


                                    {/* =================================
                                        CUSTOMER ID
                                    ================================= */}

                                    <TableCell>
                                        {customerId}
                                    </TableCell>


                                    {/* =================================
                                        ADDRESS TYPE
                                    ================================= */}

                                    <TableCell>

                                        <Chip
                                            label={
                                                addressType ||
                                                "-"
                                            }
                                            color={
                                                getAddressTypeColor(
                                                    addressType
                                                )
                                            }
                                            size="small"
                                        />

                                    </TableCell>


                                    {/* =================================
                                        ADDRESS
                                    ================================= */}

                                    <TableCell
                                        sx={{
                                            minWidth: 250,
                                            maxWidth: 350
                                        }}
                                    >

                                        <Typography
                                            variant="body2"
                                        >
                                            {addressLine1 || "-"}
                                        </Typography>

                                        {addressLine2 && (

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {addressLine2}
                                            </Typography>

                                        )}

                                    </TableCell>


                                    {/* =================================
                                        CITY
                                    ================================= */}

                                    <TableCell>
                                        {city || "-"}
                                    </TableCell>


                                    {/* =================================
                                        STATE
                                    ================================= */}

                                    <TableCell>
                                        {state || "-"}
                                    </TableCell>


                                    {/* =================================
                                        COUNTRY
                                    ================================= */}

                                    <TableCell>
                                        {country || "-"}
                                    </TableCell>


                                    {/* =================================
                                        POSTAL CODE
                                    ================================= */}

                                    <TableCell>
                                        {postalCode || "-"}
                                    </TableCell>


                                    {/* =================================
                                        DEFAULT
                                    ================================= */}

                                    <TableCell>

                                        <Chip
                                            label={
                                                isDefault
                                                    ? "Yes"
                                                    : "No"
                                            }
                                            color={
                                                isDefault
                                                    ? "success"
                                                    : "default"
                                            }
                                            size="small"
                                        />

                                    </TableCell>


                                    {/* =================================
                                        ACTIONS
                                    ================================= */}

                                    <TableCell
                                        align="center"
                                    >

                                        {/* VIEW */}

                                        <Tooltip
                                            title="View"
                                        >

                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() =>
                                                    onView(row)
                                                }
                                            >
                                                <Visibility />
                                            </IconButton>

                                        </Tooltip>


                                        {/* EDIT */}

                                        <Tooltip
                                            title="Edit"
                                        >

                                            <IconButton
                                                color="warning"
                                                size="small"
                                                onClick={() =>
                                                    onEdit(row)
                                                }
                                            >
                                                <Edit />
                                            </IconButton>

                                        </Tooltip>


                                        {/* DELETE */}

                                        <Tooltip
                                            title="Delete"
                                        >

                                            <IconButton
                                                color="error"
                                                size="small"
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
                        }
                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
};


export default CustomerAddressTable;