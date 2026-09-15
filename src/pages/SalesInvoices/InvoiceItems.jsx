import React from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
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

const InvoiceItems = ({
    items = []
}) => {

    const rows = Array.isArray(items)
        ? items
        : [];

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
                    PRODUCT DETAILS
                </Typography>
            </Box>

            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        "& th, & td": {
                            border: "1px solid #222",
                            verticalAlign: "top"
                        }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>

                            <TableCell>
                                Description
                            </TableCell>

                            <TableCell>
                                HSN
                            </TableCell>

                            <TableCell>
                                Qty
                            </TableCell>

                            <TableCell>
                                UOM
                            </TableCell>

                            <TableCell>
                                Rate
                            </TableCell>

                            <TableCell>
                                Discount
                            </TableCell>

                            <TableCell>
                                GST %
                            </TableCell>

                            <TableCell>
                                Tax
                            </TableCell>

                            <TableCell>
                                Amount
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    align="center"
                                >
                                    No invoice items
                                </TableCell>
                            </TableRow>
                        )}

                        {rows.map((item, index) => {

                            const description =
                                item?.Description ??
                                item?.description ??
                                item?.Product?.ProductName ??
                                item?.product?.productName ??
                                "N/A";

                            const quantity =
                                item?.Quantity ??
                                item?.quantity ??
                                0;

                            const uom =
                                item?.Uom ??
                                item?.uom ??
                                "N/A";

                            const rate =
                                item?.UnitPrice ??
                                item?.unitPrice ??
                                item?.QuantityAmount ??
                                item?.quantityAmount ??
                                0;

                            const discount =
                                item?.Discount ??
                                item?.discount ??
                                item?.InvoiceDiscountAmount ??
                                item?.invoiceDiscountAmount ??
                                0;

                            const gst =
                                item?.GstPer ??
                                item?.gstPer ??
                                item?.GSTPer ??
                                item?.gstPercentage ??
                                0;

                            const tax =
                                item?.TaxAmount ??
                                item?.taxAmount ??
                                0;

                            const total =
                                item?.TotalAmount ??
                                item?.totalAmount ??
                                item?.AfterGSTAmount ??
                                item?.afterGSTAmount ??
                                0;

                            return (
                                <TableRow
                                    key={
                                        item?.SalesInvoiceItemId ??
                                        item?.salesInvoiceItemId ??
                                        index
                                    }
                                >
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {description}
                                        </Typography>

                                        {item?.Remarks && (
                                            <Typography
                                                variant="caption"
                                                display="block"
                                            >
                                                {item.Remarks}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {item?.Hsncode ??
                                            item?.hsncode ??
                                            "N/A"}
                                    </TableCell>

                                    <TableCell>
                                        {quantity}
                                    </TableCell>

                                    <TableCell>
                                        {uom}
                                    </TableCell>

                                    <TableCell align="right">
                                        ₹{money(rate)}
                                    </TableCell>

                                    <TableCell align="right">
                                        ₹{money(discount)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {gst}%
                                    </TableCell>

                                    <TableCell align="right">
                                        ₹{money(tax)}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 700
                                        }}
                                    >
                                        ₹{money(total)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default InvoiceItems;