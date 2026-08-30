// =========================================================
// SellerTable.jsx
// =========================================================

import React from "react";

import {
    Box,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Delete,
    Edit,
    Visibility,
} from "@mui/icons-material";

const SellerTable = ({
    sellers = [],
    onView,
    onEdit,
    onDelete,
}) => {

    if (!Array.isArray(sellers) ||
        sellers.length === 0) {

        return (

            <Box
                sx={{
                    minHeight: 250,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 4,
                }}
            >

                <Typography
                    color="text.secondary"
                >
                    No sellers found.
                </Typography>

            </Box>
        );
    }

    return (

        <TableContainer>

            <Table
                sx={{
                    minWidth: 800,
                }}
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>
                                Seller ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Seller Name
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Trade Name
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Contact Person
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Email
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Phone
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Status
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

                    {sellers.map((seller) => {

                        const sellerId =
                            seller.sellerId ??
                            seller.SellerId;

                        const sellerName =
                            seller.sellerName ??
                            seller.SellerName ??
                            "-";

                        const tradeName =
                            seller.tradeName ??
                            seller.TradeName ??
                            "-";

                        const contactPerson =
                            seller.contactPerson ??
                            seller.ContactPerson ??
                            "-";

                        const email =
                            seller.email ??
                            seller.Email ??
                            "-";

                        const phone =
                            seller.phone ??
                            seller.Phone ??
                            "-";

                        const isActive =
                            seller.isActive ??
                            seller.IsActive ??
                            false;

                        return (

                            <TableRow
                                key={sellerId}
                                hover
                            >

                                <TableCell>
                                    {sellerId}
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        {sellerName}
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    {tradeName}
                                </TableCell>

                                <TableCell>
                                    {contactPerson}
                                </TableCell>

                                <TableCell>
                                    {email}
                                </TableCell>

                                <TableCell>
                                    {phone}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        size="small"
                                        color={
                                            isActive
                                                ? "success"
                                                : "default"
                                        }
                                    />

                                </TableCell>

                                <TableCell>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "center",
                                            gap: 0.5,
                                        }}
                                    >

                                        <Tooltip title="View">

                                            <IconButton
                                                color="info"
                                                onClick={() =>
                                                    onView(
                                                        seller
                                                    )
                                                }
                                            >
                                                <Visibility />
                                            </IconButton>

                                        </Tooltip>


                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onEdit(
                                                        seller
                                                    )
                                                }
                                            >
                                                <Edit />
                                            </IconButton>

                                        </Tooltip>


                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete(
                                                        seller
                                                    )
                                                }
                                            >
                                                <Delete />
                                            </IconButton>

                                        </Tooltip>

                                    </Box>

                                </TableCell>

                            </TableRow>
                        );
                    })}

                </TableBody>

            </Table>

        </TableContainer>
    );
};

export default SellerTable;
