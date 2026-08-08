import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import DashboardReportStatistics from "./DashboardReportStatistics";
import DashboardReportToolbar from "./DashboardReportToolbar";
import DashboardReportSearch from "./DashboardReportSearch";
import DashboardReportTable from "./DashboardReportTable";
import DashboardReportPagination from "./DashboardReportPagination";
import DashboardReportCard from "./DashboardReportCard";
import DashboardReportView from "./DashboardReportView";
import DashboardReportExport from "./DashboardReportExport";

import {
  getDashboardReports,
  getDashboardReportStatistics,
  deleteDashboardReport,
} from "./DashboardReportService";

import {
  filterDashboardReports,
  DEFAULT_DASHBOARD_REPORT_FILTERS,
} from "./DashboardReportFilter";

import {
  normalizeDashboardReports,
} from "./DashboardReportHelpers";

import "./DashboardReport.css";

//======================================================
// DashboardReportList
//======================================================

const DashboardReportList = () => {

  //====================================================
  // Main Data State
  //====================================================

  const [reports, setReports] = useState([]);

  const [statistics, setStatistics] =
    useState(null);

  //====================================================
  // Loading State
  //====================================================

  const [loading, setLoading] =
    useState(false);

  const [statisticsLoading, setStatisticsLoading] =
    useState(false);

  //====================================================
  // Error State
  //====================================================

  const [error, setError] =
    useState("");

  const [statisticsError, setStatisticsError] =
    useState("");

  //====================================================
  // Filter State
  //====================================================

  const [filters, setFilters] =
    useState({
      ...DEFAULT_DASHBOARD_REPORT_FILTERS,
    });

  //====================================================
  // Pagination State
  //====================================================

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  //====================================================
  // Selection State
  //====================================================

  const [selectedRows, setSelectedRows] =
    useState([]);

  //====================================================
  // View State
  //====================================================

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  //====================================================
  // Mobile Card State
  //====================================================

  const [mobileView, setMobileView] =
    useState(false);

  //====================================================
  // Fetch Reports
  //====================================================

  const fetchReports = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getDashboardReports({
            ...filters,
            page,
            pageSize,
          });

        const responseData =
          Array.isArray(response)
            ? response
            : response?.data ||
              response?.items ||
              response?.results ||
              [];

        const normalized =
          normalizeDashboardReports(
            responseData
          );

        setReports(normalized);

      } catch (err) {

        console.error(
          "Failed to load dashboard reports:",
          err
        );

        setError(
          err?.message ||
          "Failed to load dashboard reports."
        );

        setReports([]);

      } finally {

        setLoading(false);

      }

    },
    [
      filters,
      page,
      pageSize,
    ]
  );

  //====================================================
  // Fetch Statistics
  //====================================================

  const fetchStatistics =
    useCallback(
      async () => {

        try {

          setStatisticsLoading(true);
          setStatisticsError("");

          const response =
            await getDashboardReportStatistics(
              filters
            );

          const responseData =
            response?.data ||
            response?.result ||
            response ||
            null;

          setStatistics(
            responseData
          );

        } catch (err) {

          console.error(
            "Failed to load dashboard statistics:",
            err
          );

          setStatisticsError(
            err?.message ||
            "Failed to load dashboard statistics."
          );

        } finally {

          setStatisticsLoading(false);

        }

      },
      [filters]
    );

  //====================================================
  // Initial / Filtered Load
  //====================================================

  useEffect(() => {

    fetchReports();

  }, [fetchReports]);

  useEffect(() => {

    fetchStatistics();

  }, [fetchStatistics]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Apply Client-Side Filtering
  //====================================================

  const filteredReports = useMemo(() => {

    if (!Array.isArray(reports)) {
      return [];
    }

    try {

      return filterDashboardReports(
        reports,
        filters
      );

    } catch (err) {

      console.error(
        "Dashboard report filtering failed:",
        err
      );

      return reports;

    }

  }, [reports, filters]);

  //====================================================
  // Pagination Data
  //====================================================

  const totalRecords =
    filteredReports.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRecords / pageSize
      )
    );

  const paginatedReports =
    useMemo(() => {

      const startIndex =
        (page - 1) * pageSize;

      const endIndex =
        startIndex + pageSize;

      return filteredReports.slice(
        startIndex,
        endIndex
      );

    }, [
      filteredReports,
      page,
      pageSize,
    ]);

  //====================================================
  // Reset Page When Filters Change
  //====================================================

  useEffect(() => {

    setPage(1);

  }, [
    filters.search,
    filters.status,
    filters.reportType,
    filters.dateFrom,
    filters.dateTo,
  ]);

  //====================================================
  // Keep Page Within Valid Range
  //====================================================

  useEffect(() => {

    if (page > totalPages) {
      setPage(totalPages);
    }

  }, [
    page,
    totalPages,
  ]);

  //====================================================
  // Refresh All Data
  //====================================================

  const handleRefresh = useCallback(
    async () => {

      await Promise.all([
        fetchReports(),
        fetchStatistics(),
      ]);

      setSelectedRows([]);

    },
    [
      fetchReports,
      fetchStatistics,
    ]
  );

  //====================================================
  // Search / Filter Change
  //====================================================

  const handleFilterChange = useCallback(
    (newFilters) => {

      setFilters((previousFilters) => {

        if (
          typeof newFilters === "function"
        ) {
          return newFilters(
            previousFilters
          );
        }

        return {
          ...previousFilters,
          ...newFilters,
        };

      });

      setPage(1);

    },
    []
  );

  //====================================================
  // Reset Filters
  //====================================================

  const handleResetFilters = useCallback(
    () => {

      setFilters({
        ...DEFAULT_DASHBOARD_REPORT_FILTERS,
      });

      setPage(1);

    },
    []
  );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = useCallback(
    (newPage) => {

      const nextPage =
        Number(newPage);

      if (
        Number.isFinite(nextPage) &&
        nextPage >= 1
      ) {

        setPage(
          Math.min(
            nextPage,
            totalPages
          )
        );

      }

    },
    [totalPages]
  );

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (newPageSize) => {

        const size =
          Number(newPageSize);

        if (
          Number.isFinite(size) &&
          size > 0
        ) {

          setPageSize(size);
          setPage(1);

        }

      },
      []
    );

  //====================================================
  // Row Selection
  //====================================================

  const handleSelectionChange =
    useCallback(
      (rows) => {

        setSelectedRows(
          Array.isArray(rows)
            ? rows
            : []
        );

      },
      []
    );

  //====================================================
  // View Report
  //====================================================

  const handleView = useCallback(
    (report) => {

      if (!report) {
        return;
      }

      setSelectedReport(report);
      setViewOpen(true);

    },
    []
  );

  //====================================================
  // Close View
  //====================================================

  const handleCloseView = useCallback(
    () => {

      setViewOpen(false);

      setSelectedReport(null);

    },
    []
  );

  //====================================================
  // Delete Report
  //====================================================

  const handleDelete = useCallback(
    async (report) => {

      if (!report) {
        return;
      }

      const reportId =
        report?.id ??
        report?.reportId ??
        report?.dashboardReportId;

      if (!reportId) {

        setError(
          "Unable to delete report: report ID is missing."
        );

        return;

      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this dashboard report?"
        );

      if (!confirmed) {
        return;
      }

      try {

        setLoading(true);
        setError("");

        await deleteDashboardReport(
          reportId
        );

        setReports(
          (previousReports) =>
            previousReports.filter(
              (item) => {

                const itemId =
                  item?.id ??
                  item?.reportId ??
                  item?.dashboardReportId;

                return (
                  String(itemId) !==
                  String(reportId)
                );

              }
            )
        );

        setSelectedRows(
          (previousRows) =>
            previousRows.filter(
              (row) => {

                const rowId =
                  typeof row === "object"
                    ? row?.id ??
                      row?.reportId ??
                      row?.dashboardReportId
                    : row;

                return (
                  String(rowId) !==
                  String(reportId)
                );

              }
            )
        );

        await fetchStatistics();

      } catch (err) {

        console.error(
          "Failed to delete dashboard report:",
          err
        );

        setError(
          err?.message ||
          "Failed to delete dashboard report."
        );

      } finally {

        setLoading(false);

      }

    },
    [
      fetchStatistics,
    ]
  );

  //====================================================
  // Add Report
  //====================================================

  const handleAdd = useCallback(() => {

    // The actual add/create dialog can be
    // connected here when required.

    console.log(
      "Add Dashboard Report"
    );

  }, []);

  //====================================================
  // Mobile View Detection
  //====================================================

  useEffect(() => {

    const checkScreenSize = () => {

      setMobileView(
        window.innerWidth < 768
      );

    };

    checkScreenSize();

    window.addEventListener(
      "resize",
      checkScreenSize
    );

    return () => {

      window.removeEventListener(
        "resize",
        checkScreenSize
      );

    };

  }, []);

  //====================================================
  // Part 1B Ends Here
  //====================================================
    //====================================================
  // Render
  //====================================================

  return (
    <Box className="dashboard-report">

      {/*================================================
          Page Header
      =================================================*/}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
        >
          Dashboard Reports
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          Monitor and analyze dashboard
          report data.
        </Typography>
      </Box>

      {/*================================================
          Error Alert
      =================================================*/}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/*================================================
          Statistics
      =================================================*/}

      <Box
        sx={{
          mb: 3,
        }}
      >
        {statisticsError && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
            }}
            onClose={() =>
              setStatisticsError("")
            }
          >
            {statisticsError}
          </Alert>
        )}

        <DashboardReportStatistics
          statistics={statistics}
          loading={statisticsLoading}
          reports={reports}
        />
      </Box>

      {/*================================================
          Toolbar
      =================================================*/}

      <Box
        className="dashboard-report-toolbar"
        sx={{
          mb: 2,
        }}
      >
        <DashboardReportToolbar
          filters={filters}
          selectedRows={selectedRows}
          loading={loading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onResetFilters={
            handleResetFilters
          }
        />
      </Box>

      {/*================================================
          Search / Filter
      =================================================*/}

      <Box
        sx={{
          mb: 2,
        }}
      >
        <DashboardReportSearch
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </Box>

      {/*================================================
          Loading State
      =================================================*/}

      {loading && reports.length === 0 ? (

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 240,
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <CircularProgress />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading dashboard reports...
            </Typography>
          </Stack>
        </Box>

      ) : filteredReports.length === 0 ? (

        /*================================================
            Empty State
        =================================================*/

        <Box
          className="dashboard-report-empty"
          sx={{
            py: 6,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
          >
            No dashboard reports found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Try changing your search or
            filter criteria.
          </Typography>
        </Box>

      ) : (

        /*================================================
            Report Content
        =================================================*/

        <>
          {mobileView ? (

            /*============================================
                Mobile Cards
            ============================================*/

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(1, minmax(0, 1fr))",
                gap: 2,
              }}
            >

              {paginatedReports.map(
                (report, index) => (

                  <DashboardReportCard
                    key={
                      report?.id ??
                      report?.reportId ??
                      index
                    }
                    report={report}
                    onView={handleView}
                    onDelete={handleDelete}
                  />

                )
              )}

            </Box>

          ) : (

            /*============================================
                Desktop Table
            ============================================*/

            <Box
              className="dashboard-report-table"
            >
              <DashboardReportTable
                reports={paginatedReports}
                selectedRows={selectedRows}
                loading={loading}
                onSelectionChange={
                  handleSelectionChange
                }
                onView={handleView}
                onDelete={handleDelete}
              />
            </Box>

          )}

          {/*============================================
              Pagination
          ============================================*/}

          <Box
            className="dashboard-report-pagination"
            sx={{
              mt: 2,
            }}
          >
            <DashboardReportPagination
              page={page}
              pageSize={pageSize}
              totalRecords={totalRecords}
              totalPages={totalPages}
              onPageChange={
                handlePageChange
              }
              onPageSizeChange={
                handlePageSizeChange
              }
            />
          </Box>
        </>

      )}

      {/*================================================
          Part 2A Ends Here
      =================================================*/}
            {/*================================================
          Export
      =================================================*/}

      <Box
        className="dashboard-report-export"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <DashboardReportExport
          reports={filteredReports}
          filters={filters}
          filename="dashboard-report"
        />
      </Box>

      {/*================================================
          Selected Report View
      =================================================*/}

      {selectedReport && (
        <DashboardReportView
          open={viewOpen}
          report={selectedReport}
          onClose={handleCloseView}
        />
      )}

    </Box>
  );
};

//======================================================
// Export
//======================================================

export default DashboardReportList;