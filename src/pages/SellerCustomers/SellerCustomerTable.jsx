// =========================================================
// SellerCustomerTable.jsx
// =========================================================

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

import { useNavigate } from "react-router-dom";


// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerTable = ({
    customers = [],
    loading
}) => {

    const navigate = useNavigate();


    // =====================================================
    // Loading
    // =====================================================

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={5}
            >
                <CircularProgress />
            </Box>
        );

    }


    // =====================================================
    // Empty
    // =====================================================

    if (!customers || customers.length === 0) {

        return (
            <Paper sx={{ p: 4 }}>

                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Customers Found
                </Typography>

            </Paper>
        );

    }


    // =====================================================
    // Render
    // =====================================================

return (

    <TableContainer component={Paper}>

        <Table size="small">

            <TableHead>

                <TableRow>

                    <TableCell>
                        ID
                    </TableCell>

                    <TableCell>
                        Customer Code
                    </TableCell>

                    <TableCell>
                        Customer Name
                    </TableCell>

                    <TableCell>
                        Contact Person
                    </TableCell>

                    <TableCell>
                        Email
                    </TableCell>

                    <TableCell>
                        Phone
                    </TableCell>

                    <TableCell>
                        GSTIN
                    </TableCell>

                    <TableCell>
                        City
                    </TableCell>

                    <TableCell>
                        Credit Limit
                    </TableCell>

                    <TableCell>
                        Status
                    </TableCell>

                    <TableCell align="center">
                        Actions
                    </TableCell>

                </TableRow>

            </TableHead>


            <TableBody>

                {customers.map((row) => {

                    // =================================================
                    // IDs
                    // =================================================

                    const customerId =
                        row.CustomerId ??
                        row.customerId;

                    const sellerId =
                        row.SellerId ??
                        row.sellerId;


                    return (

                        <TableRow
                            key={`${sellerId}-${customerId}`}
                            hover
                        >

                            {/* =================================================
                                CUSTOMER ID
                            ================================================= */}

                            <TableCell>
                                {customerId || "-"}
                            </TableCell>


                            {/* =================================================
                                CUSTOMER CODE
                            ================================================= */}

                            <TableCell>
                                {row.CustomerCode ??
                                    row.customerCode ??
                                    "-"}
                            </TableCell>


                            {/* =================================================
                                CUSTOMER NAME
                            ================================================= */}

                            <TableCell>
                                {row.CustomerName ??
                                    row.customerName ??
                                    "-"}
                            </TableCell>


                            {/* =================================================
                                CONTACT PERSON
                            ================================================= */}

                            <TableCell>
                                {row.ContactPerson ??
                                    row.contactPerson ??
                                    "-"}
                            </TableCell>


                            {/* =================================================
                                EMAIL
                            ================================================= */}

                            <TableCell>
                                {row.Email ??
                                    row.email ??
                                    "-"}
                            </TableCell>


                            {/* =================================================
                                PHONE
                            ================================================= */}

                            <TableCell>
                                {row.Phone ??
                                    row.phone ??
                                    "-"}
                            </TableCell>


                            {/* =================================================
                                GSTIN
                            ================================================= */}

                            <TableCell>
                                {row.GSTIN ??
                                    row.gstin ??
                                    "-"}
                            </TableCell>


                            {/* =================================================
                                CITY
                            ================================================= */}

                            <TableCell>
                                {row.City ??
                                    row.city ??
                                    "-"}
                            </TableCell>


                            {/* =================================================
                                CREDIT LIMIT
                            ================================================= */}

                            <TableCell>

                                ₹{" "}

                                {Number(
                                    row.CreditLimit ??
                                    row.creditLimit ??
                                    0
                                ).toLocaleString("en-IN")}

                            </TableCell>


                            {/* =================================================
                                STATUS
                            ================================================= */}

                            <TableCell>

                                <Chip
                                    label={
                                        (
                                            row.IsActive ??
                                            row.isActive
                                        )
                                            ? "Active"
                                            : "Inactive"
                                    }
                                    color={
                                        (
                                            row.IsActive ??
                                            row.isActive
                                        )
                                            ? "success"
                                            : "error"
                                    }
                                    size="small"
                                />

                            </TableCell>


                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <TableCell align="center">

                                {/* =============================================
                                    VIEW
                                    /seller-customers/details/6/3
                                ============================================= */}

                                <Tooltip title="View">

                                    <IconButton
                                        color="primary"
                                        disabled={
                                            !sellerId ||
                                            !customerId
                                        }
                                        onClick={() => {

                                            if (
                                                !sellerId ||
                                                !customerId
                                            ) {
                                                console.error(
                                                    "Seller ID or Customer ID missing:",
                                                    row
                                                );

                                                return;
                                            }

                                            navigate(
                                                `/seller-customers/details/${sellerId}/${customerId}`
                                            );

                                        }}
                                    >

                                        <Visibility />

                                    </IconButton>

                                </Tooltip>


                                {/* =============================================
                                    EDIT
                                    /seller-customers/edit/6/3
                                ============================================= */}

                                <Tooltip title="Edit">

                                    <IconButton
                                        color="warning"
                                        disabled={
                                            !sellerId ||
                                            !customerId
                                        }
                                        onClick={() => {

                                            if (
                                                !sellerId ||
                                                !customerId
                                            ) {
                                                console.error(
                                                    "Seller ID or Customer ID missing:",
                                                    row
                                                );

                                                return;
                                            }

                                            navigate(
                                                `/seller-customers/edit/${sellerId}/${customerId}`
                                            );

                                        }}
                                    >

                                        <Edit />

                                    </IconButton>

                                </Tooltip>


                                {/* =============================================
                                    DELETE
                                    /seller-customers/delete/6/3
                                ============================================= */}

                                <Tooltip title="Delete">

                                    <IconButton
                                        color="error"
                                        disabled={
                                            !sellerId ||
                                            !customerId
                                        }
                                        onClick={() => {

                                            if (
                                                !sellerId ||
                                                !customerId
                                            ) {
                                                console.error(
                                                    "Seller ID or Customer ID missing:",
                                                    row
                                                );

                                                return;
                                            }

                                            navigate(
                                                `/seller-customers/delete/${sellerId}/${customerId}`
                                            );

                                        }}
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


export default SellerCustomerTable;
