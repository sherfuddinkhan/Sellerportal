//======================================================
// StockMovementReportView.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Stack,
} from "@mui/material";

//======================================================
// Components
//======================================================

import StockMovementReportCard from "./StockMovementReportCard";
import StockMovementReportToolbar from "./StockMovementReportToolbar";
import StockMovementReportStatistics from "./StockMovementReportStatistics";
import StockMovementReportSearch from "./StockMovementReportSearch";
import StockMovementReportFilter from "./StockMovementReportFilter";
import StockMovementReportList from "./StockMovementReportList";
import StockMovementReportPagination from "./StockMovementReportPagination";
import StockMovementReportModal from "./StockMovementReportModal";
import StockMovementReportExport from "./StockMovementReportExport";
import StockMovementReportChart from "./StockMovementReportChart";

//======================================================
// Helpers
//======================================================

import {
  filterStockMovementReports,
  normalizeStockMovementReports,
  sortStockMovementReports,
  getStockMovementTotalPages,
} from "./StockMovementReportHelpers";

//======================================================
// Service
//======================================================

import {
  getStockMovementReports,
} from "./StockMovementReportService";

//======================================================
// CSS
//======================================================

import "./StockMovementReport.css";

//======================================================
// Default Filters
//======================================================

const DEFAULT_FILTERS = {
  stockItem: "",
  warehouse: "",
  godown: "",
  movementType: "",
  voucherType: "",
  status: "",
  startDate: "",
  endDate: "",
};

//======================================================
// Default Sort
//======================================================

const DEFAULT_SORT = {
  field: "date",
  direction: "desc",
};

//======================================================
// StockMovementReportView
//======================================================

const StockMovementReportView = ({
  initialReports = [],
  autoLoad = true,
}) => {
  //====================================================
  // Reports
  //====================================================

  const [reports, setReports] =
    useState(
      normalizeStockMovementReports(
        initialReports
      )
    );

  //====================================================
  // Loading
  //====================================================

  const [loading, setLoading] =
    useState(false);

  //====================================================
  // Error
  //====================================================

  const [error, setError] =
    useState("");

  //====================================================
  // Search
  //====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  //====================================================
  // Filters
  //====================================================

  const [filters, setFilters] =
    useState(
      DEFAULT_FILTERS
    );

  //====================================================
  // Sort
  //====================================================

  const [sortConfig, setSortConfig] =
    useState(
      DEFAULT_SORT
    );

  //====================================================
  // Pagination
  //====================================================

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  //====================================================
  // Selected Report
  //====================================================

  const [selectedReport, setSelectedReport] =
    useState(null);

  //====================================================
  // Details Modal
  //====================================================

  const [modalOpen, setModalOpen] =
    useState(false);

  //====================================================
  // Export Modal
  //====================================================

  const [exportOpen, setExportOpen] =
    useState(false);

  //====================================================
  // Snackbar
  //====================================================

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity: "success",
    });

  //====================================================
  // Load Reports
  //====================================================

  const loadReports =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await getStockMovementReports();

          const records =
            Array.isArray(
              response?.data
            )
              ? response.data
              : Array.isArray(
                    response
                  )
                ? response
                : [];

          setReports(
            normalizeStockMovementReports(
              records
            )
          );
        } catch (requestError) {
          const message =
            requestError?.message ||
            "Unable to load Stock Movement Report.";

          setError(message);

          setSnackbar({
            open: true,
            message,
            severity: "error",
          });
        } finally {
          setLoading(false);
        }
      },
      []
    );

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {
    if (
      autoLoad &&
      initialReports.length === 0
    ) {
      loadReports();
    }
  }, [
    autoLoad,
    initialReports.length,
    loadReports,
  ]);

  //====================================================
  // Filter Reports
  //====================================================

  const filteredReports =
    useMemo(() => {
      return filterStockMovementReports(
        reports,
        filters,
        searchTerm
      );
    }, [
      reports,
      filters,
      searchTerm,
    ]);

  //====================================================
  // Sort Reports
  //====================================================

  const sortedReports =
    useMemo(() => {
      return sortStockMovementReports(
        filteredReports,
        sortConfig.field,
        sortConfig.direction
      );
    }, [
      filteredReports,
      sortConfig,
    ]);

  //====================================================
  // Total Pages
  //====================================================

  const totalPages =
    useMemo(() => {
      return getStockMovementTotalPages(
        sortedReports.length,
        pageSize
      );
    }, [
      sortedReports.length,
      pageSize,
    ]);

  //====================================================
  // Current Page Reports
  //====================================================

  const paginatedReports =
    useMemo(() => {
      const startIndex =
        (page - 1) *
        pageSize;

      return sortedReports.slice(
        startIndex,
        startIndex + pageSize
      );
    }, [
      sortedReports,
      page,
      pageSize,
    ]);

  //====================================================
  // Reset Page
  //====================================================

  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    filters,
    pageSize,
  ]);

  //====================================================
  // Validate Page
  //====================================================

  useEffect(() => {
    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      setPage(totalPages);
    }
  }, [
    page,
    totalPages,
  ]);

  //====================================================
  // Search Handler
  //====================================================

  const handleSearchChange =
    useCallback(
      (value) => {
        setSearchTerm(
          value ?? ""
        );
      },
      []
    );

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilterChange =
    useCallback(
      (
        field,
        value
      ) => {
        setFilters(
          (previous) => ({
            ...previous,
            [field]:
              value ?? "",
          })
        );
      },
      []
    );

  //====================================================
  // Complete Filters Handler
  //====================================================

  const handleFiltersChange =
    useCallback(
      (nextFilters) => {
        setFilters({
          ...DEFAULT_FILTERS,
          ...(nextFilters || {}),
        });
      },
      []
    );

  //====================================================
  // Clear Filters
  //====================================================

  const handleClearFilters =
    useCallback(() => {
      setFilters(
        DEFAULT_FILTERS
      );

      setSearchTerm("");

      setPage(1);
    }, []);

  //====================================================
  // Sort Handler
  //====================================================

  const handleSortChange =
    useCallback(
      (
        field,
        direction
      ) => {
        setSortConfig({
          field:
            field || "date",

          direction:
            direction === "asc"
              ? "asc"
              : "desc",
        });
      },
      []
    );

  //====================================================
  // Page Handler
  //====================================================

  const handlePageChange =
    useCallback(
      (nextPage) => {
        const safePage =
          Math.max(
            1,
            Number(nextPage) || 1
          );

        setPage(
          Math.min(
            safePage,
            Math.max(
              1,
              totalPages
            )
          )
        );
      },
      [totalPages]
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

  const handleView =
    useCallback(
      (report) => {
        setSelectedReport(
          report
        );

        setModalOpen(true);
      },
      []
    );

  //====================================================
  // Close Report Modal
  //====================================================

  const handleCloseModal =
    useCallback(() => {
      setModalOpen(false);

      setSelectedReport(
        null
      );
    }, []);

  //====================================================
  // Open Export
  //====================================================

  const handleOpenExport =
    useCallback(() => {
      setExportOpen(true);
    }, []);

  //====================================================
  // Close Export
  //====================================================

  const handleCloseExport =
    useCallback(() => {
      setExportOpen(false);
    }, []);

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    useCallback(() => {
      loadReports();
    }, [
      loadReports,
    ]);

  //====================================================
  // Snackbar Close
  //====================================================

  const handleSnackbarClose =
    useCallback(() => {
      setSnackbar(
        (previous) => ({
          ...previous,
          open: false,
        })
      );
    }, []);

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-movement-report"
    >
      <Stack spacing={2}>

        {/*==============================================
            Error
        ===============================================*/}

        {error && (
          <Alert
            severity="error"
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {/*==============================================
            Toolbar
        ===============================================*/}

        <StockMovementReportToolbar
          onRefresh={
            handleRefresh
          }
          onExport={
            handleOpenExport
          }
          loading={loading}
          exporting={false}
        />

        {/*==============================================
            Statistics
        ===============================================*/}

        <StockMovementReportStatistics
          reports={
            filteredReports
          }
          loading={loading}
        />

        {/*==============================================
            Chart
        ===============================================*/}

        <StockMovementReportChart
          reports={
            filteredReports
          }
          loading={loading}
        />

        {/*==============================================
            Search
        ===============================================*/}

        <StockMovementReportSearch
          value={searchTerm}
          searchTerm={searchTerm}
          onChange={
            handleSearchChange
          }
          onSearch={
            handleSearchChange
          }
          disabled={loading}
        />

        {/*==============================================
            Filters
        ===============================================*/}

        <StockMovementReportFilter
          filters={filters}
          value={filters}
          onChange={
            handleFilterChange
          }
          onFiltersChange={
            handleFiltersChange
          }
          onClear={
            handleClearFilters
          }
          disabled={loading}
        />

        {/*==============================================
            Report List
        ===============================================*/}

        <StockMovementReportCard>
          {loading ? (
            <Box
              className="stock-movement-report__loading"
            >
              <CircularProgress />
            </Box>
          ) : (
            <StockMovementReportList
              reports={
                paginatedReports
              }
              onView={
                handleView
              }
              onEdit={
                handleView
              }
              onSort={
                handleSortChange
              }
            />
          )}
        </StockMovementReportCard>

        {/*==============================================
            Pagination
        ===============================================*/}

        <StockMovementReportPagination
          page={page}
          currentPage={page}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={
            sortedReports.length
          }
          total={
            sortedReports.length
          }
          onPageChange={
            handlePageChange
          }
          onPageSizeChange={
            handlePageSizeChange
          }
          disabled={loading}
        />

      </Stack>

      {/*==============================================
          Details Modal
      ===============================================*/}

      <StockMovementReportModal
        open={modalOpen}
        onClose={
          handleCloseModal
        }
        report={
          selectedReport
        }
        data={
          selectedReport
        }
      />

      {/*==============================================
          Export Modal
      ===============================================*/}

      <StockMovementReportExport
        open={exportOpen}
        onClose={
          handleCloseExport
        }
        reports={
          filteredReports
        }
        data={
          filteredReports
        }
      />

      {/*==============================================
          Snackbar
      ===============================================*/}

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={4000}
        onClose={
          handleSnackbarClose
        }
      >
        <Alert
          severity={
            snackbar.severity
          }
          onClose={
            handleSnackbarClose
          }
          variant="filled"
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportView.propTypes = {
  initialReports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  autoLoad:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

StockMovementReportView.defaultProps = {
  initialReports: [],
  autoLoad: true,
};

//======================================================
// Export
//======================================================

export default StockMovementReportView;

//======================================================
// Part 1A Ends Here
//======================================================