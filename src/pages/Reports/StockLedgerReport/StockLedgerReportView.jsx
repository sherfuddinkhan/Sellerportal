
//======================================================
// StockLedgerReportView.jsx
// Part 1A
//======================================================

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
  Paper,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// Components
//======================================================

import StockLedgerReportToolbar from "./StockLedgerReportToolbar";
import StockLedgerReportStatistics from "./StockLedgerReportStatistics";
import StockLedgerReportSearch from "./StockLedgerReportSearch";
import StockLedgerReportFilter from "./StockLedgerReportFilter";
import StockLedgerReportList from "./StockLedgerReportList";
import StockLedgerReportPagination from "./StockLedgerReportPagination";
import StockLedgerReportModal from "./StockLedgerReportModal";

//======================================================
// Service
//======================================================

import {
  getStockLedgerReports,
} from "./StockLedgerReportService";

//======================================================
// Helpers
//======================================================

import {
  normalizeStockLedgerReports,
  searchStockLedgerReports,
  filterStockLedgerReports,
  sortStockLedgerReports,
} from "./StockLedgerReportHelpers";

//======================================================
// StockLedgerReportView
//======================================================

const StockLedgerReportView = () => {
  //====================================================
  // Reports State
  //====================================================

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  //====================================================
  // Search State
  //====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  //====================================================
  // Filter State
  //====================================================

  const [filters, setFilters] =
    useState({
      stockItem: "",
      warehouse: "",
      godown: "",
      transactionType: "",
      voucherType: "",
      status: "",
      startDate: "",
      endDate: "",
    });

  //====================================================
  // Sorting State
  //====================================================

  const [sortField, setSortField] =
    useState("date");

  const [sortDirection, setSortDirection] =
    useState("desc");

  //====================================================
  // Pagination State
  //====================================================

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  //====================================================
  // Modal State
  //====================================================

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("view");

  //====================================================
  // Load Stock Ledger Reports
  //====================================================

  const loadReports =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getStockLedgerReports();

        const responseData =
          response?.data ??
          response?.reports ??
          response?.records ??
          response ??
          [];

        const reportArray =
          Array.isArray(
            responseData
          )
            ? responseData
            : [];

        const normalizedReports =
          normalizeStockLedgerReports(
            reportArray
          );

        setReports(
          normalizedReports
        );
      } catch (loadError) {
        console.error(
          "Failed to load stock ledger reports:",
          loadError
        );

        setError(
          loadError?.message ||
            "Failed to load stock ledger reports."
        );

        setReports([]);
      } finally {
        setLoading(false);
      }
    }, []);

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  //====================================================
  // Search
  //====================================================

  const searchedReports =
    useMemo(() => {
      return searchStockLedgerReports(
        reports,
        searchTerm
      );
    }, [
      reports,
      searchTerm,
    ]);

  //====================================================
  // Filter
  //====================================================

  const filteredReports =
    useMemo(() => {
      return filterStockLedgerReports(
        searchedReports,
        filters
      );
    }, [
      searchedReports,
      filters,
    ]);

  //====================================================
  // Sort
  //====================================================

  const sortedReports =
    useMemo(() => {
      return sortStockLedgerReports(
        filteredReports,
        sortField,
        sortDirection
      );
    }, [
      filteredReports,
      sortField,
      sortDirection,
    ]);

  //====================================================
  // Pagination Calculations
  //====================================================

  const totalRecords =
    sortedReports.length;

  const totalPages =
    totalRecords === 0
      ? 0
      : Math.ceil(
          totalRecords /
            pageSize
        );

  const safePage =
    totalPages === 0
      ? 1
      : Math.min(
          page,
          totalPages
        );

  //====================================================
  // Paginated Data
  //====================================================

  const paginatedReports =
    useMemo(() => {
      const startIndex =
        (safePage - 1) *
        pageSize;

      return sortedReports.slice(
        startIndex,
        startIndex +
          pageSize
      );
    }, [
      sortedReports,
      safePage,
      pageSize,
    ]);

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch =
    useCallback(
      (value) => {
        const nextValue =
          typeof value ===
          "string"
            ? value
            : value?.target?.value ||
              "";

        setSearchTerm(
          nextValue
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilterChange =
    useCallback(
      (nextFilters) => {
        setFilters(
          (previous) => ({
            ...previous,
            ...(nextFilters ||
              {}),
          })
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Clear Filters
  //====================================================

  const handleClearFilters =
    useCallback(() => {
      setFilters({
        stockItem: "",
        warehouse: "",
        godown: "",
        transactionType: "",
        voucherType: "",
        status: "",
        startDate: "",
        endDate: "",
      });

      setSearchTerm("");
      setPage(1);
    }, []);

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort =
    useCallback(
      (
        field,
        direction
      ) => {
        setSortField(
          field || "date"
        );

        setSortDirection(
          direction || "desc"
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Page Handler
  //====================================================

  const handlePageChange =
    useCallback(
      (nextPage) => {
        setPage(
          Math.max(
            1,
            Number(nextPage) ||
              1
          )
        );
      },
      []
    );

  //====================================================
  // Page Size Handler
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (nextPageSize) => {
        setPageSize(
          Math.max(
            1,
            Number(
              nextPageSize
            ) || 10
          )
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // View Report
  //====================================================

  const handleViewReport =
    useCallback(
      (report) => {
        setSelectedReport(
          report
        );

        setModalMode(
          "view"
        );

        setModalOpen(true);
      },
      []
    );

  //====================================================
  // Edit Report
  //====================================================

  const handleEditReport =
    useCallback(
      (report) => {
        setSelectedReport(
          report
        );

        setModalMode(
          "edit"
        );

        setModalOpen(true);
      },
      []
    );

  //====================================================
  // Close Modal
  //====================================================

  const handleCloseModal =
    useCallback(() => {
      if (loading) {
        return;
      }

      setModalOpen(false);
      setSelectedReport(null);
      setModalMode("view");
    }, [loading]);
//======================================================
// Refresh Handler
//======================================================

const handleRefresh =
  useCallback(async () => {
    await loadReports();
  }, [loadReports]);

//======================================================
// Report Statistics
//======================================================

const statistics =
  useMemo(() => {
    const totalEntries =
      sortedReports.length;

    const totalInward =
      sortedReports.reduce(
        (sum, report) =>
          sum +
          Number(
            report.inwardQuantity ||
              report.receiptQuantity ||
              report.inQuantity ||
              0
          ),
        0
      );

    const totalOutward =
      sortedReports.reduce(
        (sum, report) =>
          sum +
          Number(
            report.outwardQuantity ||
              report.issueQuantity ||
              report.outQuantity ||
              0
          ),
        0
      );

    const totalClosing =
      sortedReports.reduce(
        (sum, report) =>
          sum +
          Number(
            report.closingQuantity ||
              report.closingStock ||
              report.balanceQuantity ||
              0
          ),
        0
      );

    return {
      totalEntries,
      totalInward,
      totalOutward,
      totalClosing,
    };
  }, [sortedReports]);

//======================================================
// Modal Save Handler
//======================================================

const handleSaveReport =
  useCallback(
    async (updatedReport) => {
      if (!updatedReport) {
        return;
      }

      /*
       * Stock ledger reports are normally
       * generated from transactions.
       *
       * If editing is enabled later,
       * connect the update API here.
       */

      setReports(
        (previousReports) =>
          previousReports.map(
            (report) => {
              const reportId =
                report.id ??
                report.reportId;

              const updatedId =
                updatedReport.id ??
                updatedReport.reportId;

              if (
                reportId !==
                updatedId
              ) {
                return report;
              }

              return {
                ...report,
                ...updatedReport,
              };
            }
          )
      );

      setSelectedReport(
        (previous) => ({
          ...previous,
          ...updatedReport,
        })
      );

      setModalMode("view");
    },
    []
  );

//======================================================
// Delete Report Handler
//======================================================

const handleDeleteReport =
  useCallback(
    async (report) => {
      if (!report) {
        return;
      }

      /*
       * Reports are generally read-only.
       * Keep deletion disabled unless the
       * backend explicitly supports it.
       */

      console.warn(
        "Delete requested for stock ledger report:",
        report
      );
    },
    []
  );

//======================================================
// Retry Handler
//======================================================

const handleRetry =
  useCallback(() => {
    loadReports();
  }, [loadReports]);

//======================================================
// Loading State
//======================================================

if (
  loading &&
  reports.length === 0
) {
  return (
    <Box
      className="stock-ledger-report-view"
      sx={{
        width: "100%",
        minHeight: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          Loading stock ledger reports...
        </Typography>
      </Stack>
    </Box>
  );
}

//======================================================
// Main Render
//======================================================

return (
  <Box
    className="stock-ledger-report-view"
    sx={{
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    <Stack spacing={3}>
      {/*================================================
          Page Header
      =================================================*/}

      <Box>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Stock Ledger Report
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          View stock movement,
          inward quantities,
          outward quantities,
          and closing balances.
        </Typography>
      </Box>

      {/*================================================
          Error
      =================================================*/}

      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={
                handleRetry
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/*================================================
          Statistics
      =================================================*/}

      <StockLedgerReportStatistics
        reports={sortedReports}
        statistics={statistics}
        loading={loading}
      />

      {/*================================================
          Toolbar
      =================================================*/}

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 2,
        }}
      >
        <Stack spacing={2}>
          <StockLedgerReportToolbar
            reports={sortedReports}
            filteredReports={
              sortedReports
            }
            loading={loading}
            onRefresh={
              handleRefresh
            }
          />

          {/*============================================
              Search
          =============================================*/}

          <StockLedgerReportSearch
            value={searchTerm}
            searchTerm={searchTerm}
            onSearch={
              handleSearch
            }
            onChange={
              handleSearch
            }
            disabled={loading}
          />

          {/*============================================
              Filters
          =============================================*/}

          <StockLedgerReportFilter
            filters={filters}
            value={filters}
            onFilterChange={
              handleFilterChange
            }
            onChange={
              handleFilterChange
            }
            onClear={
              handleClearFilters
            }
            disabled={loading}
          />
        </Stack>
      </Paper>

      {/*================================================
          Report List
      =================================================*/}

      <Paper
        elevation={0}
        variant="outlined"
      >
        <StockLedgerReportList
          reports={
            paginatedReports
          }
          loading={loading}
          onView={
            handleViewReport
          }
          onEdit={
            handleEditReport
          }
          onDelete={
            handleDeleteReport
          }
          onSort={
            handleSort
          }
          sortField={
            sortField
          }
          sortDirection={
            sortDirection
          }
        />
      </Paper>

      {/*================================================
          Pagination
      =================================================*/}

      <StockLedgerReportPagination
        page={safePage}
        pageSize={pageSize}
        totalRecords={
          totalRecords
        }
        totalPages={
          totalPages
        }
        onPageChange={
          handlePageChange
        }
        onPageSizeChange={
          handlePageSizeChange
        }
        disabled={loading}
      />

      {/*================================================
          Report Modal
      =================================================*/}

      <StockLedgerReportModal
        open={modalOpen}
        report={selectedReport}
        mode={modalMode}
        loading={loading}
        onClose={
          handleCloseModal
        }
        onEdit={
          handleEditReport
        }
        onDelete={
          handleDeleteReport
        }
        onSave={
          handleSaveReport
        }
      />
    </Stack>
  </Box>
);

//======================================================
// Component Export
//======================================================
}
export default StockLedgerReportView;
