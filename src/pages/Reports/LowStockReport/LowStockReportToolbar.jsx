import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Checkbox,
  Chip,
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

import {
  Visibility,
  Edit,
  Delete,
  Inventory2,
  Warning,
  ErrorOutline,
} from "@mui/icons-material";

//======================================================
// LowStockReportTable
//======================================================

const LowStockReportTable = ({
  reports = [],
  selectedRows = [],
  loading = false,
  onSelectRow,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
}) => {

  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Selected IDs
  //====================================================

  const safeSelectedRows = useMemo(
    () =>
      Array.isArray(selectedRows)
        ? selectedRows
        : [],
    [selectedRows]
  );

  //====================================================
  // Normalize Report
  //====================================================

  const normalizeReport = (
    report
  ) => {

    const currentStock =
      Number(
        report?.currentStock ??
        report?.stockQuantity ??
        report?.quantity ??
        0
      );

    const minimumStock =
      Number(
        report?.minimumStock ??
        report?.minStock ??
        report?.reorderLevel ??
        0
      );

    let severity = "normal";

    if (
      currentStock <= 0
    ) {
      severity = "critical";
    } else if (
      currentStock <
      minimumStock
    ) {
      severity = "warning";
    }

    return {
      ...report,

      id:
        report?.id ??
        report?.reportId ??
        report?.inventoryId ??
        "",

      productName:
        report?.productName ??
        report?.itemName ??
        report?.name ??
        "Unknown Product",

      productCode:
        report?.productCode ??
        report?.itemCode ??
        report?.sku ??
        "-",

      category:
        report?.categoryName ??
        report?.category ??
        "-",

      currentStock,

      minimumStock,

      reorderQuantity:
        Number(
          report?.reorderQuantity ??
          report?.reorderQty ??
          0
        ),

      unit:
        report?.unit ??
        report?.uom ??
        "Units",

      warehouse:
        report?.warehouseName ??
        report?.warehouse ??
        "-",

      status:
        report?.status ??
        (
          severity === "critical"
            ? "Out of Stock"
            : severity === "warning"
            ? "Low Stock"
            : "Stock OK"
        ),

      severity,
    };
  };

  //====================================================
  // Normalized Reports
  //====================================================

  const normalizedReports =
    useMemo(
      () =>
        safeReports.map(
          normalizeReport
        ),
      [safeReports]
    );

  //====================================================
  // Select All State
  //====================================================

  const allSelected =
    normalizedReports.length > 0 &&
    normalizedReports.every(
      (report) =>
        safeSelectedRows.includes(
          report.id
        )
    );

  const someSelected =
    normalizedReports.some(
      (report) =>
        safeSelectedRows.includes(
          report.id
        )
    ) &&
    !allSelected;

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Handlers
  //====================================================

  const handleSelectAll = (
    event
  ) => {
    if (
      typeof onSelectAll ===
      "function"
    ) {
      onSelectAll(
        event.target.checked,
        normalizedReports
      );
    }
  };

  //====================================================
  // Select Single Row
  //====================================================

  const handleSelectRow = (
    report
  ) => {
    if (
      typeof onSelectRow ===
      "function"
    ) {
      onSelectRow(
        report.id,
        report
      );
    }
  };

  //====================================================
  // View
  //====================================================

  const handleView = (
    report
  ) => {
    if (
      typeof onView ===
      "function"
    ) {
      onView(report);
    }
  };

  //====================================================
  // Edit
  //====================================================

  const handleEdit = (
    report
  ) => {
    if (
      typeof onEdit ===
      "function"
    ) {
      onEdit(report);
    }
  };

  //====================================================
  // Delete
  //====================================================

  const handleDelete = (
    report
  ) => {
    if (
      typeof onDelete ===
      "function"
    ) {
      onDelete(report);
    }
  };

  //====================================================
  // Severity Color
  //====================================================

  const getSeverityColor = (
    severity
  ) => {

    if (
      severity === "critical"
    ) {
      return "error";
    }

    if (
      severity === "warning"
    ) {
      return "warning";
    }

    return "success";
  };

  //====================================================
  // Severity Icon
  //====================================================

  const getSeverityIcon = (
    severity
  ) => {

    if (
      severity === "critical"
    ) {
      return (
        <ErrorOutline
          fontSize="small"
        />
      );
    }

    if (
      severity === "warning"
    ) {
      return (
        <Warning
          fontSize="small"
        />
      );
    }

    return (
      <Inventory2
        fontSize="small"
      />
    );
  };

  //====================================================
  // Stock Percentage
  //====================================================

  const getStockPercentage = (
    report
  ) => {

    if (
      report.minimumStock <= 0
    ) {
      return report.currentStock > 0
        ? 100
        : 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (
          report.currentStock /
          report.minimumStock
        ) * 100
      )
    );
  };

  //====================================================
  // JSX
  //====================================================

  return (
    <TableContainer
      component={Paper}
      className="low-stock-report-table-container"
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Table
        className="low-stock-report-table"
        size="small"
      >

        {/*================================================
            Table Header
        =================================================*/}

        <TableHead>
          <TableRow>

            {/*============================================
                Select All
            ============================================*/}

            <TableCell
              padding="checkbox"
            >
              <Checkbox
                checked={
                  allSelected
                }
                indeterminate={
                  someSelected
                }
                onChange={
                  handleSelectAll
                }
                disabled={
                  loading ||
                  normalizedReports.length ===
                    0
                }
                inputProps={{
                  "aria-label":
                    "Select all low stock reports",
                }}
              />
            </TableCell>

            {/*============================================
                Product
            ============================================*/}

            <TableCell>
              Product
            </TableCell>

            {/*============================================
                Category
            ============================================*/}

            <TableCell>
              Category
            </TableCell>

            {/*============================================
                Warehouse
            ============================================*/}

            <TableCell>
              Warehouse
            </TableCell>

            {/*============================================
                Current Stock
            ============================================*/}

            <TableCell align="right">
              Current Stock
            </TableCell>

            {/*============================================
                Minimum Stock
            ============================================*/}

            <TableCell align="right">
              Minimum Stock
            </TableCell>

            {/*============================================
                Stock Level
            ============================================*/}

            <TableCell
              align="center"
              sx={{
                minWidth: 120,
              }}
            >
              Stock Level
            </TableCell>

            {/*============================================
                Reorder
            ============================================*/}

            <TableCell align="right">
              Reorder Qty
            </TableCell>

            {/*============================================
                Status
            ============================================*/}

            <TableCell align="center">
              Status
            </TableCell>

            {/*============================================
                Actions
            ============================================*/}

            <TableCell
              align="center"
              sx={{
                minWidth: 130,
              }}
            >
              Actions
            </TableCell>

          </TableRow>
        </TableHead>

        {/*================================================
            Table Body
        =================================================*/}

        <TableBody>

          {normalizedReports.length ===
          0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                align="center"
              >
                <Box
                  className="low-stock-report-empty"
                  sx={{
                    py: 6,
                  }}
                >
                  <Inventory2
                    sx={{
                      fontSize: 48,
                      color:
                        "text.disabled",
                      mb: 1,
                    }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                  >
                    No Low Stock Reports
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No products currently
                    match the low stock
                    criteria.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            normalizedReports.map(
              (report) => {

                const selected =
                  safeSelectedRows.includes(
                    report.id
                  );

                const percentage =
                  getStockPercentage(
                    report
                  );

                const severityColor =
                  getSeverityColor(
                    report.severity
                  );

                return (
                  <TableRow
                    key={
                      report.id ||
                      `${report.productCode}-${report.productName}`
                    }
                    hover
                    selected={
                      selected
                    }
                    className="low-stock-report-table-row"
                  >

                    {/*======================================
                        Selection
                    ======================================*/}

                    <TableCell
                      padding="checkbox"
                    >
                      <Checkbox
                        checked={
                          selected
                        }
                        onChange={() =>
                          handleSelectRow(
                            report
                          )
                        }
                        disabled={
                          loading
                        }
                        inputProps={{
                          "aria-label":
                            `Select ${report.productName}`,
                        }}
                      />
                    </TableCell>

                    {/*======================================
                        Product
                    ======================================*/}

                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          className="low-stock-product-name"
                        >
                          {
                            report.productName
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          className="low-stock-product-code"
                        >
                          {
                            report.productCode
                          }
                        </Typography>
                      </Box>
                    </TableCell>

                    {/*======================================
                        Category
                    ======================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                      >
                        {
                          report.category
                        }
                      </Typography>
                    </TableCell>

                    {/*======================================
                        Warehouse
                    ======================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                      >
                        {
                          report.warehouse
                        }
                      </Typography>
                    </TableCell>

                    {/*======================================
                        Current Stock
                    ======================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        className={
                          report.severity ===
                          "critical"
                            ? "low-stock-quantity-critical"
                            : report.severity ===
                              "warning"
                            ? "low-stock-quantity-warning"
                            : "low-stock-quantity-normal"
                        }
                      >
                        {
                          report.currentStock
                        }{" "}
                        {
                          report.unit
                        }
                      </Typography>
                    </TableCell>

                    {/*======================================
                        Minimum Stock
                    ======================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                      >
                        {
                          report.minimumStock
                        }{" "}
                        {
                          report.unit
                        }
                      </Typography>
                    </TableCell>

                    {/*======================================
                        Stock Level
                    ======================================*/}

                    <TableCell>
                      <Box
                        className="low-stock-level"
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {Math.round(
                              percentage
                            )}
                            %
                          </Typography>
                        </Box>

                        <Box
                          className="low-stock-level-bar"
                        >
                          <Box
                            className={`low-stock-level-fill ${report.severity}`}
                            sx={{
                              width: `${percentage}%`,
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>

                    {/*======================================
                        Reorder Quantity
                    ======================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {
                          report.reorderQuantity
                        }{" "}
                        {
                          report.unit
                        }
                      </Typography>
                    </TableCell>

                    {/*======================================
                        Status
                    ======================================*/}

                    <TableCell align="center">
                      <Chip
                        size="small"
                        color={
                          severityColor
                        }
                        icon={
                          getSeverityIcon(
                            report.severity
                          )
                        }
                        label={
                          report.status
                        }
                      />
                    </TableCell>

                    {/*======================================
                        Actions
                    ======================================*/}

                    <TableCell align="center">
                      <Box
                        sx={{
                          display:
                            "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "center",
                          gap: 0.5,
                        }}
                      >

                        <Tooltip
                          title="View"
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleView(
                                report
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            <Visibility
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title="Edit"
                        >
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() =>
                              handleEdit(
                                report
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            <Edit
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title="Delete"
                        >
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(
                                report
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            <Delete
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>

                      </Box>
                    </TableCell>

                  </TableRow>
                );
              }
            )
          )}

        </TableBody>

      </Table>
    </TableContainer>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

LowStockReportTable.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  selectedRows: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),

  loading: PropTypes.bool,

  onSelectRow: PropTypes.func,

  onSelectAll: PropTypes.func,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

LowStockReportTable.defaultProps = {
  reports: [],

  selectedRows: [],

  loading: false,

  onSelectRow: () => {},

  onSelectAll: () => {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default LowStockReportTable;