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
  ArrowDownward,
  ArrowUpward,
  CheckCircle,
  Delete,
  Edit,
  Visibility,
  Block,
} from "@mui/icons-material";
import {
  getReportId,
  getReportName,
  getReportType,
  getStatus,
  getStatusColor,
  getTotalRecords,
  getTotalStock,
  getTotalValue,
  getCreatedBy,
  getCreatedDate,
  formatNumber,
  formatCurrency,
  formatDate,
} from "./InventoryReportHelper";

//======================================================
// InventoryReportTable
//======================================================

const InventoryReportTable = ({
  reports = [],
  selectedRows = [],
  loading = false,
  sortField = "createdDate",
  sortDirection = "desc",
  onSort,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}) => {

  //====================================================
  // Report ID
  //====================================================

  const getReportId = (
    report
  ) =>
    report?.id ??
    report?.reportId ??
    report?.inventoryReportId ??
    "";

  //====================================================
  // Report Name
  //====================================================

  const getReportName = (
    report
  ) =>
    report?.reportName ||
    report?.name ||
    report?.title ||
    "Inventory Report";

  //====================================================
  // Report Type
  //====================================================

  const getReportType = (
    report
  ) =>
    report?.reportType ||
    report?.type ||
    "Inventory";

  //====================================================
  // Status
  //====================================================

  const getStatus = (
    report
  ) =>
    report?.status ||
    report?.reportStatus ||
    "Active";

  //====================================================
  // Created By
  //====================================================

  const getCreatedBy = (
    report
  ) =>
    report?.createdByName ||
    report?.createdBy ||
    report?.ownerName ||
    report?.owner ||
    "System";

  //====================================================
  // Created Date
  //====================================================

  const getCreatedDate = (
    report
  ) =>
    report?.createdDate ||
    report?.createdAt ||
    "";

  //====================================================
  // Total Records
  //====================================================

  const getTotalRecords = (
    report
  ) =>
    Number(
      report?.totalRecords ??
      report?.recordCount ??
      report?.records ??
      0
    ) || 0;

  //====================================================
  // Total Stock
  //====================================================

  const getTotalStock = (
    report
  ) =>
    Number(
      report?.totalStock ??
      report?.stockQuantity ??
      report?.quantity ??
      0
    ) || 0;

  //====================================================
  // Total Value
  //====================================================

  const getTotalValue = (
    report
  ) =>
    Number(
      report?.totalValue ??
      report?.inventoryValue ??
      report?.stockValue ??
      0
    ) || 0;

  //====================================================
  // Format Number
  //====================================================

  const formatNumber = (
    value
  ) =>
    Number(value).toLocaleString(
      "en-IN"
    );

  //====================================================
  // Format Currency
  //====================================================

  const formatCurrency = (
    value
  ) =>
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      Number(value) || 0
    );

  //====================================================
  // Format Date
  //====================================================

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
      return String(value);
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  //====================================================
  // Status Color
  //====================================================

  const getStatusColor = (
    status
  ) => {

    switch (
      String(status)
        .toLowerCase()
    ) {

      case "active":
        return "success";

      case "inactive":
        return "warning";

      case "draft":
        return "default";

      case "archived":
        return "secondary";

      case "deleted":
        return "error";

      default:
        return "primary";
    }

  };

  //====================================================
  // Selected IDs
  //====================================================

  const selectedIds = useMemo(
    () =>
      selectedRows.map(
        (row) =>
          String(
            getReportId(row)
          )
      ),
    [selectedRows]
  );

  //====================================================
  // Current Page IDs
  //====================================================

  const currentPageIds = useMemo(
    () =>
      reports
        .map(
          (report) =>
            String(
              getReportId(report)
            )
        )
        .filter(Boolean),
    [reports]
  );

  //====================================================
  // All Current Rows Selected
  //====================================================

  const allSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every(
      (id) =>
        selectedIds.includes(id)
    );

  //====================================================
  // Some Rows Selected
  //====================================================

  const someSelected =
    currentPageIds.some(
      (id) =>
        selectedIds.includes(id)
    ) &&
    !allSelected;

  //====================================================
  // Select All Handler
  //====================================================

  const handleSelectAll = (
    event
  ) => {

    if (
      typeof onSelectionChange !==
      "function"
    ) {
      return;
    }

    if (
      event.target.checked
    ) {

      const selected =
        reports.filter(
          (report) =>
            selectedIds.includes(
              String(
                getReportId(report)
              )
            )
        );

      const mergedRows = [
        ...selectedRows,
        ...reports.filter(
          (report) =>
            !selectedIds.includes(
              String(
                getReportId(report)
              )
            )
        ),
      ];

      onSelectionChange(
        mergedRows
      );

    } else {

      const currentIds =
        new Set(
          currentPageIds
        );

      onSelectionChange(
        selectedRows.filter(
          (row) =>
            !currentIds.has(
              String(
                getReportId(row)
              )
            )
        )
      );

    }

  };

  //====================================================
  // Row Selection Handler
  //====================================================

  const handleRowSelection = (
    report,
    checked
  ) => {

    if (
      typeof onSelectionChange !==
      "function"
    ) {
      return;
    }

    const reportId =
      String(
        getReportId(report)
      );

    if (checked) {

      if (
        selectedIds.includes(
          reportId
        )
      ) {
        return;
      }

      onSelectionChange([
        ...selectedRows,
        report,
      ]);

    } else {

      onSelectionChange(
        selectedRows.filter(
          (row) =>
            String(
              getReportId(row)
            ) !== reportId
        )
      );

    }

  };

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
      return null;
    }

    return sortDirection ===
      "asc" ? (
      <ArrowUpward
        fontSize="inherit"
        sx={{
          ml: 0.5,
          verticalAlign:
            "middle",
        }}
      />
    ) : (
      <ArrowDownward
        fontSize="inherit"
        sx={{
          ml: 0.5,
          verticalAlign:
            "middle",
        }}
      />
    );

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================

    //====================================================
  // JSX
  //====================================================

  return (
    <TableContainer
      component={Paper}
      className="inventory-report-table"
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        stickyHeader
        sx={{
          minWidth: 1100,
        }}
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
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleSelectAll}
                disabled={
                  loading ||
                  reports.length === 0
                }
                inputProps={{
                  "aria-label":
                    "select all inventory reports",
                }}
              />
            </TableCell>

            {/*============================================
                Report Name
            ============================================*/}

            <TableCell>
              <Box
                component="span"
                onClick={() =>
                  handleSort("reportName")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Report Name
                {renderSortIcon(
                  "reportName"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Report Type
            ============================================*/}

            <TableCell>
              <Box
                component="span"
                onClick={() =>
                  handleSort("reportType")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Report Type
                {renderSortIcon(
                  "reportType"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Status
            ============================================*/}

            <TableCell>
              <Box
                component="span"
                onClick={() =>
                  handleSort("status")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Status
                {renderSortIcon(
                  "status"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Records
            ============================================*/}

            <TableCell align="right">
              <Box
                component="span"
                onClick={() =>
                  handleSort("totalRecords")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Records
                {renderSortIcon(
                  "totalRecords"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Stock Quantity
            ============================================*/}

            <TableCell align="right">
              <Box
                component="span"
                onClick={() =>
                  handleSort("totalStock")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Stock Quantity
                {renderSortIcon(
                  "totalStock"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Stock Value
            ============================================*/}

            <TableCell align="right">
              <Box
                component="span"
                onClick={() =>
                  handleSort("totalValue")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Stock Value
                {renderSortIcon(
                  "totalValue"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Created By
            ============================================*/}

            <TableCell>
              <Box
                component="span"
                onClick={() =>
                  handleSort("createdBy")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Created By
                {renderSortIcon(
                  "createdBy"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Created Date
            ============================================*/}

            <TableCell>
              <Box
                component="span"
                onClick={() =>
                  handleSort("createdDate")
                }
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                Created Date
                {renderSortIcon(
                  "createdDate"
                )}
              </Box>
            </TableCell>

            {/*============================================
                Actions
            ============================================*/}

            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
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

          {/*==============================================
              Empty State
          ==============================================*/}

          {reports.length === 0 ? (

            <TableRow>

              <TableCell
                colSpan={11}
                align="center"
                sx={{
                  py: 6,
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                >
                  No inventory reports found.
                </Typography>
              </TableCell>

            </TableRow>

          ) : (

            reports.map(
              (report) => {

                const reportId =
                  getReportId(report);

                const reportIdString =
                  String(reportId);

                const status =
                  getStatus(report);

                const isSelected =
                  selectedIds.includes(
                    reportIdString
                  );

                return (
                  <TableRow
                    hover
                   key={
  reportIdString ||
  `inventory-report-${getReportName(report)}`
}
                    selected={isSelected}
                  >

                    {/*====================================
                        Selection
                    ====================================*/}

                    <TableCell
                      padding="checkbox"
                    >
                      <Checkbox
                        checked={
                          isSelected
                        }
                        onChange={(
                          event
                        ) =>
                          handleRowSelection(
                            report,
                            event.target.checked
                          )
                        }
                        disabled={loading}
                        inputProps={{
                          "aria-label":
                            `select ${getReportName(
                              report
                            )}`,
                        }}
                      />
                    </TableCell>

                    {/*====================================
                        Report Name
                    ====================================*/}

                    <TableCell>

                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {getReportName(
                          report
                        )}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        ID:{" "}
                        {reportId || "-"}
                      </Typography>

                    </TableCell>

                    {/*====================================
                        Report Type
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                      >
                        {getReportType(
                          report
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Status
                    ====================================*/}

                    <TableCell>

                      <Chip
                        label={status}
                        size="small"
                        color={
                          getStatusColor(
                            status
                          )
                        }
                        variant="outlined"
                      />

                    </TableCell>

                    {/*====================================
                        Records
                    ====================================*/}

                    <TableCell align="right">
                      {formatNumber(
                        getTotalRecords(
                          report
                        )
                      )}
                    </TableCell>

                    {/*====================================
                        Stock Quantity
                    ====================================*/}

                    <TableCell align="right">
                      {formatNumber(
                        getTotalStock(
                          report
                        )
                      )}
                    </TableCell>

                    {/*====================================
                        Stock Value
                    ====================================*/}

                    <TableCell align="right">
                      {formatCurrency(
                        getTotalValue(
                          report
                        )
                      )}
                    </TableCell>

                    {/*====================================
                        Created By
                    ====================================*/}

                    <TableCell>
                      {getCreatedBy(
                        report
                      )}
                    </TableCell>

                    {/*====================================
                        Created Date
                    ====================================*/}

                    <TableCell>
                      {formatDate(
                        getCreatedDate(
                          report
                        )
                      )}
                    </TableCell>

                    {/*====================================
                        Actions
                    ====================================*/}

                    <TableCell align="center">

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.25,
                        }}
                      >

                        {/*================================
                            View
                        =================================*/}

                        <Tooltip
                          title="View report"
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              typeof onView ===
                              "function" &&
                              onView(report)
                            }
                            disabled={loading}
                            aria-label={
                              `view ${getReportName(
                                report
                              )}`
                            }
                          >
                            <Visibility
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>

                        {/*================================
                            Edit
                        =================================*/}

                        <Tooltip
                          title="Edit report"
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              typeof onEdit ===
                              "function" &&
                              onEdit(report)
                            }
                            disabled={loading}
                            aria-label={
                              `edit ${getReportName(
                                report
                              )}`
                            }
                          >
                            <Edit
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>

                        {/*================================
                            Activate / Deactivate
                        =================================*/}

                        {String(status)
                          .toLowerCase() ===
                        "active" ? (

                          <Tooltip
                            title="Deactivate report"
                          >
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() =>
                                typeof onDeactivate ===
                                "function" &&
                                onDeactivate(
                                  report
                                )
                              }
                              disabled={loading}
                              aria-label={
                                `deactivate ${getReportName(
                                  report
                                )}`
                              }
                            >
                              <Block
                                fontSize="small"
                              />
                            </IconButton>
                          </Tooltip>

                        ) : (

                          <Tooltip
                            title="Activate report"
                          >
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                typeof onActivate ===
                                "function" &&
                                onActivate(
                                  report
                                )
                              }
                              disabled={loading}
                              aria-label={
                                `activate ${getReportName(
                                  report
                                )}`
                              }
                            >
                              <CheckCircle
                                fontSize="small"
                              />
                            </IconButton>
                          </Tooltip>

                        )}

                        {/*================================
                            Delete
                        =================================*/}

                        <Tooltip
                          title="Delete report"
                        >
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              typeof onDelete ===
                              "function" &&
                              onDelete(report)
                            }
                            disabled={loading}
                            aria-label={
                              `delete ${getReportName(
                                report
                              )}`
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

InventoryReportTable.propTypes = {
  reports: PropTypes.array,

  selectedRows: PropTypes.array,

  loading: PropTypes.bool,

  sortField: PropTypes.string,

  sortDirection: PropTypes.oneOf([
    "asc",
    "desc",
  ]),

  onSort: PropTypes.func,

  onSelectionChange:
    PropTypes.func,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,

  onActivate: PropTypes.func,

  onDeactivate:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

InventoryReportTable.defaultProps = {
  reports: [],

  selectedRows: [],

  loading: false,

  sortField: "createdDate",

  sortDirection: "desc",

  onSort: () => {},

  onSelectionChange: () => {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onActivate: () => {},

  onDeactivate: () => {},
};

//======================================================
// Export
//======================================================

export default InventoryReportTable;