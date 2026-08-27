
import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  calculateStatistics,
  filterInventoryReports,
  formatCurrency,
  formatDate,
  formatNumber,
  getCreatedBy,
  getCreatedDate,
  getReportId,
  getReportName,
  getReportStatus,
  getReportType,
  getStatusColor,
  getTotalRecords,
  getTotalStock,
  getTotalValue,
  searchReports,
  sortReports,
} from "./InventoryReportHelpers";


// ======================================================
// Inventory Report Component
// ======================================================

const InventoryReport = ({
  reports: reportsProp = [],
  loading = false,
  onRefresh,
}) => {
  // ====================================================
  // State
  // ====================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    reportType: "",
    dateFrom: "",
    dateTo: "",
  });

  const [sortField, setSortField] = useState("createdDate");

  const [sortDirection, setSortDirection] = useState("desc");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);


  // ====================================================
  // Safe Reports Array
  // ====================================================

  const reports = Array.isArray(reportsProp)
    ? reportsProp
    : [];


  // ====================================================
  // Statistics
  // ====================================================

  const statistics = useMemo(() => {
    return calculateStatistics(reports);
  }, [reports]);


  // ====================================================
  // Filter + Search + Sort
  // ====================================================

  const filteredReports = useMemo(() => {
    let result = reports;

    // Search
    if (searchTerm.trim()) {
      result = searchReports(
        result,
        searchTerm
      );
    }

    // Filters
    result = filterInventoryReports(
      result,
      filters
    );

    // Sort
    result = sortReports(
      result,
      sortField,
      sortDirection
    );

    return result;
  }, [
    reports,
    searchTerm,
    filters,
    sortField,
    sortDirection,
  ]);


  // ====================================================
  // Pagination
  // ====================================================

  const paginatedReports = useMemo(() => {
    const startIndex =
      page * rowsPerPage;

    return filteredReports.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [
    filteredReports,
    page,
    rowsPerPage,
  ]);


  // ====================================================
  // Search Change
  // ====================================================

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };


  // ====================================================
  // Filter Change
  // ====================================================

  const handleFilterChange = (field) => (event) => {
    setFilters((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));

    setPage(0);
  };


  // ====================================================
  // Clear Filters
  // ====================================================

  const handleClearFilters = () => {
    setSearchTerm("");

    setFilters({
      status: "",
      reportType: "",
      dateFrom: "",
      dateTo: "",
    });

    setPage(0);
  };


  // ====================================================
  // Sort Change
  // ====================================================

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection((previous) =>
        previous === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };


  // ====================================================
  // Page Change
  // ====================================================

  const handlePageChange = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };


  // ====================================================
  // Rows Per Page
  // ====================================================

  const handleRowsPerPageChange = (
    event
  ) => {
    setRowsPerPage(
      Number(event.target.value)
    );

    setPage(0);
  };


  // ====================================================
  // Status Style
  // ====================================================

  const getStatusStyles = (status) => {
    const color = getStatusColor(status);

    const styles = {
      success: {
        color: "success.main",
        backgroundColor: "success.light",
      },

      warning: {
        color: "warning.main",
        backgroundColor: "warning.light",
      },

      error: {
        color: "error.main",
        backgroundColor: "error.light",
      },

      info: {
        color: "info.main",
        backgroundColor: "info.light",
      },

      default: {
        color: "text.secondary",
        backgroundColor: "action.hover",
      },
    };

    return (
      styles[color] ||
      styles.default
    );
  };


  // ====================================================
  // Render
  // ====================================================

  return (
    <Box sx={{ p: 3 }}>

      {/* =================================================
          Header
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Inventory Reports
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            View, search, filter and manage
            inventory reports
          </Typography>
        </Box>

        {onRefresh && (
          <Button
            variant="contained"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </Button>
        )}
      </Box>


      {/* =================================================
          Statistics
      ================================================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Reports
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {formatNumber(
                  statistics.totalReports,
                  0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Active Reports
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {formatNumber(
                  statistics.activeReports,
                  0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Stock
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {formatNumber(
                  statistics.totalStock
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Value
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {formatCurrency(
                  statistics.totalValue
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>


      {/* =================================================
          Search & Filters
      ================================================= */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
        }}
      >

        <Grid
          container
          spacing={2}
          alignItems="center"
        >

          {/* Search */}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Reports"
              placeholder="Search by name, type, ID..."
              value={searchTerm}
              onChange={
                handleSearchChange
              }
            />
          </Grid>


          {/* Status */}

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filters.status}
              onChange={handleFilterChange(
                "status"
              )}
            >
              <MenuItem value="">
                All
              </MenuItem>

              <MenuItem value="active">
                Active
              </MenuItem>

              <MenuItem value="inactive">
                Inactive
              </MenuItem>

              <MenuItem value="draft">
                Draft
              </MenuItem>

              <MenuItem value="pending">
                Pending
              </MenuItem>

              <MenuItem value="archived">
                Archived
              </MenuItem>
            </TextField>
          </Grid>


          {/* Report Type */}

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Report Type"
              value={filters.reportType}
              onChange={handleFilterChange(
                "reportType"
              )}
              placeholder="inventory"
            />
          </Grid>


          {/* Date From */}

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="From"
              value={filters.dateFrom}
              onChange={handleFilterChange(
                "dateFrom"
              )}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>


          {/* Date To */}

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="To"
              value={filters.dateTo}
              onChange={handleFilterChange(
                "dateTo"
              )}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>


          {/* Clear */}

          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={
                handleClearFilters
              }
            >
              Clear Filters
            </Button>
          </Grid>

        </Grid>

      </Paper>


      {/* =================================================
          Results
      ================================================= */}

      <Paper>

        <TableContainer>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  <Button
                    onClick={() =>
                      handleSortChange(
                        "reportName"
                      )
                    }
                  >
                    Report Name
                  </Button>
                </TableCell>


                <TableCell>
                  <Button
                    onClick={() =>
                      handleSortChange(
                        "reportType"
                      )
                    }
                  >
                    Type
                  </Button>
                </TableCell>


                <TableCell>
                  <Button
                    onClick={() =>
                      handleSortChange(
                        "status"
                      )
                    }
                  >
                    Status
                  </Button>
                </TableCell>


                <TableCell>
                  Records
                </TableCell>


                <TableCell>
                  Stock
                </TableCell>


                <TableCell>
                  Value
                </TableCell>


                <TableCell>
                  Created By
                </TableCell>


                <TableCell>
                  Created Date
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {loading ? (

                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                  >
                    Loading inventory reports...
                  </TableCell>
                </TableRow>

              ) : paginatedReports.length === 0 ? (

                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                  >
                    No inventory reports found.
                  </TableCell>
                </TableRow>

              ) : (

                paginatedReports.map(
                  (report, index) => {

                    const status =
                      getReportStatus(
                        report
                      );

                    const statusStyles =
                      getStatusStyles(
                        status
                      );

                    return (
                      <TableRow
                        key={
                          getReportId(
                            report
                          ) ||
                          index
                        }
                        hover
                      >

                        <TableCell>
                          <Typography
                            fontWeight={600}
                          >
                            {getReportName(
                              report
                            )}
                          </Typography>
                        </TableCell>


                        <TableCell>
                          {getReportType(
                            report
                          ) || "-"}
                        </TableCell>


                        <TableCell>

                          <Box
                            component="span"
                            sx={{
                              display:
                                "inline-block",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize:
                                "0.8rem",
                              fontWeight: 600,
                              color:
                                statusStyles.color,
                              backgroundColor:
                                statusStyles.backgroundColor,
                            }}
                          >
                            {status ||
                              "Inactive"}
                          </Box>

                        </TableCell>


                        <TableCell>
                          {formatNumber(
                            getTotalRecords(
                              report
                            )
                          )}
                        </TableCell>


                        <TableCell>
                          {formatNumber(
                            getTotalStock(
                              report
                            )
                          )}
                        </TableCell>


                        <TableCell>
                          {formatCurrency(
                            getTotalValue(
                              report
                            )
                          )}
                        </TableCell>


                        <TableCell>
                          {getCreatedBy(
                            report
                          )}
                        </TableCell>


                        <TableCell>
                          {formatDate(
                            getCreatedDate(
                              report
                            )
                          )}
                        </TableCell>

                      </TableRow>
                    );
                  }
                )

              )}

            </TableBody>

          </Table>

        </TableContainer>


        {/* =================================================
            Pagination
        ================================================= */}

        <TablePagination
          component="div"
          count={
            filteredReports.length
          }
          page={page}
          onPageChange={
            handlePageChange
          }
          rowsPerPage={
            rowsPerPage
          }
          onRowsPerPageChange={
            handleRowsPerPageChange
          }
          rowsPerPageOptions={[
            5,
            10,
            25,
            50,
            100,
          ]}
        />

      </Paper>

    </Box>
  );
};


export default InventoryReport;

