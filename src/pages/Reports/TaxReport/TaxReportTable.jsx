//======================================================
// TaxReportTable.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

//======================================================
// Helpers
//======================================================

const formatNumber = (
  value
) => {
  const number = Number(
    value || 0
  );

  return new Intl.NumberFormat(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Format Date
//======================================================

const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN"
  );
};

//======================================================
// Status Color
//======================================================

const getStatusColor = (
  status
) => {
  const value =
    String(
      status || ""
    ).toLowerCase();

  if (
    [
      "paid",
      "approved",
      "completed",
      "active",
      "filed",
    ].includes(value)
  ) {
    return "success";
  }

  if (
    [
      "pending",
      "draft",
      "processing",
    ].includes(value)
  ) {
    return "warning";
  }

  if (
    [
      "cancelled",
      "rejected",
      "failed",
    ].includes(value)
  ) {
    return "error";
  }

  return "default";
};

//======================================================
// TaxReportTable
//======================================================

const TaxReportTable = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortField = "date",
  sortDirection = "desc",
}) => {
  //====================================================
  // Safe Reports
  //====================================================

  const reportList =
    Array.isArray(reports)
      ? reports
      : [];

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = (
    field
  ) => {
    if (
      typeof onSort ===
      "function"
    ) {
      onSort(field);
    }
  };

  //====================================================
  // Sort Icon
  //====================================================

  const renderSortIcon = (
    field
  ) => {
    if (
      sortField !== field
    ) {
      return (
        <UnfoldMoreIcon
          fontSize="small"
          sx={{
            opacity: 0.45,
          }}
        />
      );
    }

    if (
      sortDirection ===
      "asc"
    ) {
      return (
        <ArrowUpwardIcon
          fontSize="small"
        />
      );
    }

    return (
      <ArrowDownwardIcon
        fontSize="small"
      />
    );
  };

  //====================================================
  // Sortable Header
  //====================================================

  const renderHeader = (
    label,
    field,
    align = "left"
  ) => {
    return (
      <TableCell
        align={align}
        sx={{
          fontWeight: 700,
          whiteSpace:
            "nowrap",
          cursor: onSort
            ? "pointer"
            : "default",
        }}
        onClick={() =>
          handleSort(field)
        }
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems:
              "center",
            gap: 0.5,
          }}
        >
          <span>
            {label}
          </span>

          {onSort
            ? renderSortIcon(
                field
              )
            : null}
        </Box>
      </TableCell>
    );
  };

  //====================================================
  // Loading
  //====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 260,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  //====================================================
  // Empty
  //====================================================

  if (
    reportList.length ===
    0
  ) {
    return (
      <Box
        sx={{
          minHeight: 240,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          textAlign: "center",
          p: 3,
        }}
      >
        <Typography
          color="text.secondary"
        >
          No tax records available.
        </Typography>
      </Box>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="tax-report__table"
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        stickyHeader
        sx={{
          minWidth: 1450,
        }}
      >
        {/*==============================================
            Table Header
        ===============================================*/}

        <TableHead>
          <TableRow>

            {renderHeader(
              "Date",
              "date"
            )}

            {renderHeader(
              "Invoice No.",
              "invoiceNumber"
            )}

            {renderHeader(
              "Customer / Supplier",
              "partyName"
            )}

            {renderHeader(
              "GSTIN",
              "gstin"
            )}

            {renderHeader(
              "Taxable Amount",
              "taxableAmount",
              "right"
            )}

            {renderHeader(
              "CGST",
              "cgst",
              "right"
            )}

            {renderHeader(
              "SGST",
              "sgst",
              "right"
            )}

            {renderHeader(
              "IGST",
              "igst",
              "right"
            )}

            {renderHeader(
              "Cess",
              "cess",
              "right"
            )}

            {renderHeader(
              "Total Tax",
              "totalTax",
              "right"
            )}

            {renderHeader(
              "Invoice Total",
              "invoiceTotal",
              "right"
            )}

            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                whiteSpace:
                  "nowrap",
              }}
            >
              Status
            </TableCell>

            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                whiteSpace:
                  "nowrap",
              }}
            >
              Actions
            </TableCell>

          </TableRow>
        </TableHead>

        {/*==============================================
            Table Body
        ===============================================*/}

        <TableBody>
          {reportList.map(
            (
              report,
              index
            ) => {
              const rowId =
                report.id ||
                report.taxReportId ||
                report.invoiceId ||
                index;

              const date =
                report.date ||
                report.taxDate ||
                report.invoiceDate;

              const invoiceNumber =
                report.invoiceNumber ||
                report.invoiceNo ||
                report.documentNumber ||
                report.docNo ||
                "-";

              const partyName =
                report.partyName ||
                report.customerName ||
                report.supplierName ||
                report.customer ||
                report.supplier ||
                "-";

              const gstin =
                report.gstin ||
                report.customerGstin ||
                report.supplierGstin ||
                "-";

              const taxableAmount =
                report.taxableAmount ||
                report.taxableValue ||
                report.taxable ||
                0;

              const cgst =
                report.cgst ||
                report.cgstAmount ||
                0;

              const sgst =
                report.sgst ||
                report.sgstAmount ||
                0;

              const igst =
                report.igst ||
                report.igstAmount ||
                0;

              const cess =
                report.cess ||
                report.cessAmount ||
                0;

              const totalTax =
                report.totalTax ||
                report.taxAmount ||
                (
                  Number(cgst) +
                  Number(sgst) +
                  Number(igst) +
                  Number(cess)
                );

              const invoiceTotal =
                report.invoiceTotal ||
                report.totalAmount ||
                report.grandTotal ||
                0;

              const status =
                report.status ||
                report.taxStatus ||
                "Pending";

              return (
                <TableRow
                  key={rowId}
                  hover
                >

                  {/*====================================
                      Date
                  =====================================*/}

                  <TableCell
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatDate(
                      date
                    )}
                  </TableCell>

                  {/*====================================
                      Invoice Number
                  =====================================*/}

                  <TableCell
                    sx={{
                      whiteSpace:
                        "nowrap",
                      fontWeight: 600,
                    }}
                  >
                    {invoiceNumber}
                  </TableCell>

                  {/*====================================
                      Party
                  =====================================*/}

                  <TableCell
                    sx={{
                      minWidth: 180,
                    }}
                  >
                    {partyName}
                  </TableCell>

                  {/*====================================
                      GSTIN
                  =====================================*/}

                  <TableCell
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {gstin}
                  </TableCell>

                  {/*====================================
                      Taxable Amount
                  =====================================*/}

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatNumber(
                      taxableAmount
                    )}
                  </TableCell>

                  {/*====================================
                      CGST
                  =====================================*/}

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatNumber(
                      cgst
                    )}
                  </TableCell>

                  {/*====================================
                      SGST
                  =====================================*/}

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatNumber(
                      sgst
                    )}
                  </TableCell>

                  {/*====================================
                      IGST
                  =====================================*/}

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatNumber(
                      igst
                    )}
                  </TableCell>

                  {/*====================================
                      Cess
                  =====================================*/}

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatNumber(
                      cess
                    )}
                  </TableCell>

                  {/*====================================
                      Total Tax
                  =====================================*/}

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace:
                        "nowrap",
                      fontWeight: 700,
                    }}
                  >
                    {formatNumber(
                      totalTax
                    )}
                  </TableCell>

                  {/*====================================
                      Invoice Total
                  =====================================*/}

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace:
                        "nowrap",
                      fontWeight: 700,
                    }}
                  >
                    {formatNumber(
                      invoiceTotal
                    )}
                  </TableCell>

                  {/*====================================
                      Status
                  =====================================*/}

                  <TableCell
                    align="center"
                  >
                    <Chip
                      size="small"
                      label={
                        status
                      }
                      color={getStatusColor(
                        status
                      )}
                    />
                  </TableCell>

                  {/*====================================
                      Actions
                  =====================================*/}

                  <TableCell
                    align="center"
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >

                      <Tooltip
                        title="View"
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            typeof onView ===
                            "function" &&
                            onView(
                              report
                            )
                          }
                        >
                          <VisibilityIcon
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title="Edit"
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            typeof onEdit ===
                            "function" &&
                            onEdit(
                              report
                            )
                          }
                        >
                          <EditIcon
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>

                      {typeof onDelete ===
                      "function" ? (
                        <Tooltip
                          title="Delete"
                        >
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              onDelete(
                                report
                              )
                            }
                          >
                            <DeleteIcon
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>
                      ) : null}

                    </Stack>
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

//======================================================
// Export
//======================================================

export default TaxReportTable;

//======================================================
// Part 1A Ends Here
//======================================================