import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
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
  Delete,
  Visibility,
} from "@mui/icons-material";

//======================================================
// DashboardReportTable
//======================================================

const DashboardReportTable = ({
  reports = [],
  selectedRows = [],
  loading = false,
  onSelectionChange,
  onView,
  onDelete,
}) => {

  //====================================================
  // Normalize Reports
  //====================================================

  const normalizedReports = useMemo(() => {

    if (!Array.isArray(reports)) {
      return [];
    }

    return reports;

  }, [reports]);

  //====================================================
  // Get Report ID
  //====================================================

  const getReportId = (report) => {

    return (
      report?.id ??
      report?.reportId ??
      report?.dashboardReportId ??
      ""
    );

  };

  //====================================================
  // Get Report Name
  //====================================================

  const getReportName = (report) => {

    return (
      report?.reportName ||
      report?.name ||
      report?.title ||
      "Dashboard Report"
    );

  };

  //====================================================
  // Get Report Type
  //====================================================

  const getReportType = (report) => {

    return (
      report?.reportType ||
      report?.type ||
      "Dashboard"
    );

  };

  //====================================================
  // Get Status
  //====================================================

  const getStatus = (report) => {

    return (
      report?.status ||
      report?.reportStatus ||
      "Active"
    );

  };

  //====================================================
  // Get Owner
  //====================================================

  const getOwner = (report) => {

    return (
      report?.createdByName ||
      report?.createdBy ||
      report?.ownerName ||
      report?.owner ||
      "System"
    );

  };

  //====================================================
  // Get Total Records
  //====================================================

  const getTotalRecords = (report) => {

    const value =
      Number(
        report?.totalRecords ??
        report?.recordCount ??
        report?.records ??
        0
      );

    return Number.isFinite(value)
      ? value
      : 0;

  };

  //====================================================
  // Get Total Amount
  //====================================================

  const getTotalAmount = (report) => {

    const value =
      Number(
        report?.totalAmount ??
        report?.amount ??
        report?.totalSales ??
        0
      );

    return Number.isFinite(value)
      ? value
      : 0;

  };

  //====================================================
  // Format Currency
  //====================================================

  const formatCurrency = (value) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      Number.isFinite(value)
        ? value
        : 0
    );

  };

  //====================================================
  // Format Date
  //====================================================

  const formatDate = (value) => {

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
  // Get Status Color
  //====================================================

  const getStatusColor = (status) => {

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
  // Selection Check
  //====================================================

  const isSelected = (report) => {

    const reportId =
      getReportId(report);

    return selectedRows.some(
      (row) => {

        const selectedId =
          typeof row === "object"
            ? getReportId(row)
            : row;

        return (
          String(selectedId) ===
          String(reportId)
        );

      }
    );

  };

  //====================================================
  // Toggle Row Selection
  //====================================================

  const handleRowSelection = (
    report
  ) => {

    const reportId =
      getReportId(report);

    if (!reportId) {
      return;
    }

    const alreadySelected =
      isSelected(report);

    let nextSelection;

    if (alreadySelected) {

      nextSelection =
        selectedRows.filter(
          (row) => {

            const selectedId =
              typeof row === "object"
                ? getReportId(row)
                : row;

            return (
              String(selectedId) !==
              String(reportId)
            );

          }
        );

    } else {

      nextSelection = [
        ...selectedRows,
        reportId,
      ];

    }

    if (
      typeof onSelectionChange ===
      "function"
    ) {
      onSelectionChange(
        nextSelection
      );
    }

  };

  //====================================================
  // View Handler
  //====================================================

  const handleView = (report) => {

    if (
      typeof onView === "function"
    ) {
      onView(report);
    }

  };

  //====================================================
  // Delete Handler
  //====================================================

  const handleDelete = (report) => {

    if (
      typeof onDelete === "function"
    ) {
      onDelete(report);
    }

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
      variant="outlined"
      className="dashboard-report-table-container"
      sx={{
        width: "100%",
        overflowX: "auto",
        borderRadius: 2,
      }}
    >
      <Table
        size="small"
        stickyHeader
        aria-label="Dashboard reports table"
      >

        {/*================================================
            Table Header
        =================================================*/}

        <TableHead>
          <TableRow>

            <TableCell
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              #
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                minWidth: 180,
                whiteSpace: "nowrap",
              }}
            >
              Report Name
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                minWidth: 130,
                whiteSpace: "nowrap",
              }}
            >
              Report Type
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Status
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Records
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Amount
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                minWidth: 130,
                whiteSpace: "nowrap",
              }}
            >
              Created By
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Created Date
            </TableCell>

            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
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

          {loading && (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    py: 3,
                  }}
                >
                  Loading dashboard reports...
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            normalizedReports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      py: 4,
                    }}
                  >
                    No dashboard reports found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

          {!loading &&
            normalizedReports.map(
              (report, index) => {

                const reportId =
                  getReportId(report);

                const reportName =
                  getReportName(report);

                const reportType =
                  getReportType(report);

                const status =
                  getStatus(report);

                const owner =
                  getOwner(report);

                const totalRecords =
                  getTotalRecords(report);

                const totalAmount =
                  getTotalAmount(report);

                const createdDate =
                  report?.createdDate ||
                  report?.createdAt ||
                  report?.created_date ||
                  "";

                return (
                  <TableRow
                    hover
                    key={
                      reportId ||
                      `dashboard-report-${index}`
                    }
                    selected={
                      isSelected(report)
                    }
                    sx={{
                      cursor: reportId
                        ? "pointer"
                        : "default",
                    }}
                    onClick={() =>
                      handleRowSelection(
                        report
                      )
                    }
                  >

                    {/*====================================
                        Row Number
                    ====================================*/}

                    <TableCell>
                      {index + 1}
                    </TableCell>

                    {/*====================================
                        Report Name
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        title={reportName}
                      >
                        {reportName}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Report Type
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {reportType}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Status
                    ====================================*/}

                    <TableCell>
                      <Chip
                        label={status}
                        color={
                          getStatusColor(
                            status
                          )
                        }
                        size="small"
                      />
                    </TableCell>

                    {/*====================================
                        Records
                    ====================================*/}

                    <TableCell>
                      {totalRecords.toLocaleString(
                        "en-IN"
                      )}
                    </TableCell>

                    {/*====================================
                        Amount
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {formatCurrency(
                          totalAmount
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Owner
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        title={owner}
                      >
                        {owner}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Created Date
                    ====================================*/}

                    <TableCell>
                      {formatDate(
                        createdDate
                      )}
                    </TableCell>

                    {/*====================================
                        Actions
                    ====================================*/}

                    <TableCell
                      align="center"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >

                      <Tooltip title="View Report">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleView(
                              report
                            )
                          }
                          aria-label={
                            `View ${reportName}`
                          }
                        >
                          <Visibility
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Report">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDelete(
                              report
                            )
                          }
                          disabled={!reportId}
                          aria-label={
                            `Delete ${reportName}`
                          }
                        >
                          <Delete
                            fontSize="small"
                          />
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

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

DashboardReportTable.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  selectedRows: PropTypes.array,

  loading: PropTypes.bool,

  onSelectionChange:
    PropTypes.func,

  onView:
    PropTypes.func,

  onDelete:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportTable.defaultProps = {
  reports: [],

  selectedRows: [],

  loading: false,

  onSelectionChange: () => {},

  onView: () => {},

  onDelete: () => {},
};
}
//======================================================
// Export
//======================================================

export default DashboardReportTable;