import React from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

const money = value =>
    Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

const InvoiceCharges = ({
    charges = []
}) => {

    const rows = Array.isArray(charges)
        ? charges
        : [];

    if (rows.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                borderLeft: "1px solid #222",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222"
            }}
        >
            <Box sx={{ p: 1 }}>
                <Typography
                    variant="subtitle2"
                    fontWeight={800}
                >
                    ADDITIONAL CHARGES
                </Typography>
            </Box>

            <Table
                size="small"
                sx={{
                    "& th, & td": {
                        border: "1px solid #222"
                    }
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Charge
                        </TableCell>

                        <TableCell>
                            Type
                        </TableCell>

                        <TableCell align="right">
                            Amount
                        </TableCell>

                        <TableCell align="right">
                            Tax %
                        </TableCell>

                        <TableCell align="right">
                            Tax Amount
                        </TableCell>

                        <TableCell align="right">
                            Total
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((charge, index) => (
                        <TableRow
                            key={
                                charge?.SalesInvoiceAdditionalChargeId ??
                                charge?.salesInvoiceAdditionalChargeId ??
                                index
                            }
                        >
                            <TableCell>
                                {charge?.ChargeName ??
                                    charge?.chargeName ??
                                    "N/A"}
                            </TableCell>

                            <TableCell>
                                {charge?.ChargeType ??
                                    charge?.chargeType ??
                                    "N/A"}
                            </TableCell>

                            <TableCell align="right">
                                ₹{money(
                                    charge?.Amount ??
                                    charge?.amount
                                )}
                            </TableCell>

                            <TableCell align="right">
                                {charge?.TaxPercentage ??
                                    charge?.taxPercentage ??
                                    0}%
                            </TableCell>

                            <TableCell align="right">
                                ₹{money(
                                    charge?.TaxAmount ??
                                    charge?.taxAmount
                                )}
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{ fontWeight: 700 }}
                            >
                                ₹{money(
                                    charge?.TotalAmount ??
                                    charge?.totalAmount
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default InvoiceCharges;