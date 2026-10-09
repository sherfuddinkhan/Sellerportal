import React from "react";

import {
Paper,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Typography,
Box,
Chip,
IconButton,
Tooltip,
TablePagination
} from "@mui/material";

import {
Visibility,
Edit,
Delete
} from "@mui/icons-material";

/* =========================================================
FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
const amount = Number(value);
if (!Number.isFinite(amount)) {
    return "₹ 0.00";
}

return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;
};

/* =========================================================
GET FIELD VALUE
========================================================= */

const getValue = (row, ...keys) => {
for (const key of keys) {
if (
row &&
row[key] !== undefined &&
row[key] !== null
) {
return row[key];
}
}
return "";
};

/* =========================================================
FORMAT DATE
========================================================= */

const formatDate = (value) => {
if (!value) {
return "—";
}
const date = new Date(value);
if (Number.isNaN(date.getTime())) {
    return String(value);
}

return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});
};

/* =========================================================
INVOICE TAX DETAIL TABLE
========================================================= */

const InvoiceTaxDetailTable = ({
data = [],
taxDetails,
loading = false,
page = 0,
rowsPerPage = 10,
totalCount,
onPageChange,
onRowsPerPageChange,
onView,
onEdit,
onDelete
}) => {
/* =====================================================
   DATA
===================================================== */

const rows = Array.isArray(taxDetails)
    ? taxDetails
    : Array.isArray(data)
        ? data
        : [];

const count =
    Number.isFinite(Number(totalCount)) &&
    totalCount !== undefined
        ? Number(totalCount)
        : rows.length;

/* =====================================================
   RENDER
===================================================== */

return (
    <Paper
        elevation={0}
        sx={{
            width: "100%",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden"
        }}
    >

        {/* TABLE HEADER */}

        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            p={2}
        >
            <Typography
                variant="h6"
                fontWeight={700}
            >
                Invoice Tax Details
            </Typography>

            <Chip
                label={`${count} Records`}
                color="primary"
                variant="outlined"
                size="small"
            />
        </Box>

        {/* TABLE */}

        <TableContainer>
            <Table
                size="medium"
                aria-label="Invoice tax details table"
            >
                <TableHead>
                    <TableRow
                        sx={{
                            bgcolor: "action.hover"
                        }}
                    >
                        <TableCell>
                            <strong>Tax Detail ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Invoice ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Tax Name / Code</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Tax Rate (%)</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Taxable Amount</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Tax Amount</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Created Date</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    {/* LOADING */}

                    {loading && (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                align="center"
                                sx={{ py: 5 }}
                            >
                                <Typography color="text.secondary">
                                    Loading invoice tax details...
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* EMPTY */}

                    {!loading && rows.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                align="center"
                                sx={{ py: 5 }}
                            >
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    No invoice tax details found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* ROWS */}

                    {!loading &&
                        rows.map((row, index) => {

                            const id = getValue(
                                row,
                                "invoiceTaxDetailId",
                                "InvoiceTaxDetailId",
                                "invoiceTaxDetailsId",
                                "InvoiceTaxDetailsId",
                                "id",
                                "Id"
                            );

                            const invoiceId = getValue(
                                row,
                                "invoiceId",
                                "InvoiceId",
                                "salesInvoiceId",
                                "SalesInvoiceId"
                            );

                            const taxName = getValue(
                                row,
                                "taxName",
                                "TaxName",
                                "taxType",
                                "TaxType",
                                "taxCode",
                                "TaxCode"
                            );

                            const taxRate = getValue(
                                row,
                                "taxRate",
                                "TaxRate",
                                "rate",
                                "Rate"
                            );

                            const taxableAmount = getValue(
                                row,
                                "taxableAmount",
                                "TaxableAmount",
                                "taxableValue",
                                "TaxableValue"
                            );

                            const taxAmount = getValue(
                                row,
                                "taxAmount",
                                "TaxAmount",
                                "amount",
                                "Amount"
                            );

                            const createdDate = getValue(
                                row,
                                "createdDate",
                                "CreatedDate",
                                "createdAt",
                                "CreatedAt"
                            );

                            const status = getValue(
                                row,
                                "status",
                                "Status"
                            );

                            return (
                                <TableRow
                                    hover
                                    key={
                                        id !== ""
                                            ? id
                                            : index
                                    }
                                >
                                    <TableCell>
                                        {id || "—"}
                                    </TableCell>

                                    <TableCell>
                                        {invoiceId || "—"}
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            fontWeight={500}
                                        >
                                            {taxName || "—"}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="right">
                                        {taxRate !== ""
                                            ? taxRate
                                            : "—"}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatCurrency(
                                            taxableAmount
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Typography fontWeight={600}>
                                            {formatCurrency(
                                                taxAmount
                                            )}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        {formatDate(
                                            createdDate
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {status !== "" ? (
                                            <Chip
                                                label={String(status)}
                                                size="small"
                                                color={
                                                    String(status).toLowerCase() ===
                                                    "active"
                                                        ? "success"
                                                        : String(status).toLowerCase() ===
                                                          "inactive"
                                                            ? "default"
                                                            : "primary"
                                                }
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            gap={0.5}
                                        >
                                            {/* VIEW */}

                                            {onView && (
                                                <Tooltip title="View">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                            onView(row)
                                                        }
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* EDIT */}

                                            {onEdit && (
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() =>
                                                            onEdit(row)
                                                        }
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* DELETE */}

                                            {onDelete && (
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            onDelete(row)
                                                        }
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>

        {/* PAGINATION */}

        <TablePagination
            component="div"
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) => {
                if (onPageChange) {
                    onPageChange(event, newPage);
                }
            }}
            onRowsPerPageChange={(event) => {
                if (onRowsPerPageChange) {
                    onRowsPerPageChange(event);
                }
            }}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
    </Paper>
);
};

export default InvoiceTaxDetailTable;
