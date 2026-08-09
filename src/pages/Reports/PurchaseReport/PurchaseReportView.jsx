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
  Stack,
  Typography,
} from "@mui/material";

import PurchaseReportToolbar from "./PurchaseReportToolbar";
import PurchaseReportStatistics from "./PurchaseReportStatistics";
import PurchaseReportSearch from "./PurchaseReportSearch";
import PurchaseReportFilter from "./PurchaseReportFilter";
import PurchaseReportList from "./PurchaseReportList";
import PurchaseReportPagination from "./PurchaseReportPagination";
import PurchaseReportModal from "./PurchaseReportModal";
import PurchaseReportExport from "./PurchaseReportExport";

import {
  getPurchaseReports,
} from "./PurchaseReportService";

import {
  calculatePurchaseReportStatistics,
  filterPurchaseReports,
  getCategoryOptions,
  getMarketplaceOptions,
  getStatusOptions,
  getDefaultPurchaseReportFilters,
  paginateReports,
  sortPurchaseReports,
} from "./PurchaseReportHelpers";

import "./PurchaseReport.css";

//======================================================
// PurchaseReportView
//======================================================

const PurchaseReportView = ({
  initialFilters = {},
  initialPageSize = 10,
  autoLoad = true,
}) => {
  //====================================================
  // Report State
  //====================================================

  const [reports, setReports] =
    useState([]);

  //====================================================
  // Loading State
  //====================================================

  const [loading, setLoading] =
    useState(false);

  //====================================================
  // Error State
  //====================================================

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
      ...getDefaultPurchaseReportFilters(),
      ...initialFilters,
    });

  //====================================================
  // Pagination State
  //====================================================

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(initialPageSize);

  //====================================================
  // Sorting State
  //====================================================

  const [sortField, setSortField] =
    useState("date");

  const [sortDirection, setSortDirection] =
    useState("desc");

  //====================================================
  // Modal State
  //====================================================

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("view");

  const [selectedReport, setSelectedReport] =
    useState(null);

  //====================================================
  // Load Reports
  //====================================================

  const loadReports =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getPurchaseReports();

        const result =
          Array.isArray(response)
            ? response
            : response?.data ??
              response?.reports ??
              [];

        setReports(
          Array.isArray(result)
            ? result
            : []
        );
      } catch (loadError) {
        console.error(
          "PurchaseReportView load error:",
          loadError
        );

        setError(
          loadError?.message ||
            "Unable to load purchase reports."
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
    if (autoLoad) {
      loadReports();
    }
  }, [
    autoLoad,
    loadReports,
  ]);

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch =
    useCallback((value) => {
      setSearchTerm(
        value || ""
      );

      setPage(1);
    }, []);

  //====================================================
  // Filter Handler
  //====================================================

  const handleApplyFilters =
    useCallback((nextFilters) => {
      setFilters(
        (previous) => ({
          ...previous,
          ...(nextFilters || {}),
        })
      );

      setPage(1);
    }, []);

  //====================================================
  // Reset Filters
  //====================================================

  const handleResetFilters =
    useCallback(() => {
      setFilters(
        getDefaultPurchaseReportFilters()
      );

      setSearchTerm("");
      setPage(1);
    }, []);

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback((nextPage) => {
      setPage(
        Math.max(
          Number(nextPage) || 1,
          1
        )
      );
    }, []);

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback((nextPageSize) => {
      setPageSize(
        Math.max(
          Number(nextPageSize) || 10,
          1
        )
      );

      setPage(1);
    }, []);
  //====================================================
  // Sort Handler
  //====================================================

  const handleSort =
    useCallback(
      (field) => {
        setSortField(
          (previousField) => {
            if (
              previousField === field
            ) {
              setSortDirection(
                (previousDirection) =>
                  previousDirection ===
                  "asc"
                    ? "desc"
                    : "asc"
              );

              return previousField;
            }

            setSortDirection("asc");

            return field;
          }
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Open View Modal
  //====================================================

  const handleView =
    useCallback((report) => {
      setSelectedReport(report);
      setModalMode("view");
      setModalOpen(true);
    }, []);

  //====================================================
  // Open Create Modal
  //====================================================

  const handleCreate =
    useCallback(() => {
      setSelectedReport(null);
      setModalMode("create");
      setModalOpen(true);
    }, []);

  //====================================================
  // Open Edit Modal
  //====================================================

  const handleEdit =
    useCallback((report) => {
      setSelectedReport(report);
      setModalMode("edit");
      setModalOpen(true);
    }, []);

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
    }, [loading]);

  //====================================================
  // Saved Handler
  //====================================================

  const handleSaved =
    useCallback(async () => {
      await loadReports();

      setModalOpen(false);
      setSelectedReport(null);
    }, [loadReports]);

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    useCallback(() => {
      loadReports();
    }, [loadReports]);

  //====================================================
  // Filtered Reports
  //====================================================

  const filteredReports =
    useMemo(() => {
      return filterPurchaseReports(
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
  // Sorted Reports
  //====================================================

  const sortedReports =
    useMemo(() => {
      return sortPurchaseReports(
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
  // Statistics
  //====================================================

  const statistics =
    useMemo(() => {
      return calculatePurchaseReportStatistics(
        filteredReports
      );
    }, [filteredReports]);

  //====================================================
  // Pagination
  //====================================================

  const totalRecords =
    sortedReports.length;

  const totalPages =
    pageSize > 0
      ? Math.ceil(
          totalRecords / pageSize
        )
      : 0;

  const paginatedReports =
    useMemo(() => {
      return paginateReports(
        sortedReports,
        page,
        pageSize
      );
    }, [
      sortedReports,
      page,
      pageSize,
    ]);

  //====================================================
  // Filter Options
  //====================================================

  const marketplaceOptions =
    useMemo(
      () =>
        getMarketplaceOptions(
          reports
        ),
      [reports]
    );

  const categoryOptions =
    useMemo(
      () =>
        getCategoryOptions(
          reports
        ),
      [reports]
    );

  const statusOptions =
    useMemo(
      () =>
        getStatusOptions(
          reports
        ),
      [reports]
    );

  //====================================================
  // Export Complete Dataset
  //====================================================

  const exportReports =
    useMemo(() => {
      return sortedReports;
    }, [sortedReports]);

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="purchase-report"
      sx={{
        width: "100%",
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <Stack spacing={2}>
        {/*==============================================
            Page Header / Toolbar
        ==============================================*/}

        <PurchaseReportToolbar
          loading={loading}
          onCreate={handleCreate}
          onRefresh={handleRefresh}
        />

        {/*==============================================
            Page Title
        ==============================================*/}

        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Purchase Report
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Monitor purchase transactions,
            costs, suppliers, and purchase
            performance.
          </Typography>
        </Box>

        {/*==============================================
            Error
        ==============================================*/}

        {error && (
          <Alert
            severity="error"
            onClose={() =>
              setError("")
            }
            action={
              <Typography
                component="button"
                variant="body2"
                onClick={
                  handleRefresh
                }
                sx={{
                  border: 0,
                  background:
                    "transparent",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Retry
              </Typography>
            }
          >
            {error}
          </Alert>
        )}

        {/*==============================================
            Statistics
        ==============================================*/}

        <PurchaseReportStatistics
          statistics={statistics}
          reports={
            filteredReports
          }
          loading={loading}
        />

        {/*==============================================
            Search
        ==============================================*/}

        <PurchaseReportSearch
          value={searchTerm}
          onSearch={handleSearch}
          loading={loading}
        />

        {/*==============================================
            Filters
        ==============================================*/}

        <PurchaseReportFilter
          filters={filters}
          marketplaces={
            marketplaceOptions
          }
          categories={
            categoryOptions
          }
          statuses={
            statusOptions
          }
          loading={loading}
          onApply={
            handleApplyFilters
          }
          onReset={
            handleResetFilters
          }
        />

        {/*==============================================
            Export
        ==============================================*/}

        <PurchaseReportExport
          reports={exportReports}
          filters={filters}
          loading={loading}
        />

        {/*==============================================
            Report List
        ==============================================*/}

        {loading ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <Stack
              spacing={1}
              alignItems="center"
            >
              <CircularProgress />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Loading purchase reports...
              </Typography>
            </Stack>
          </Box>
        ) : (
          <PurchaseReportList
            reports={
              paginatedReports
            }
            loading={loading}
            sortField={sortField}
            sortDirection={
              sortDirection
            }
            onSort={handleSort}
            onView={handleView}
            onEdit={handleEdit}
            onRefresh={
              handleRefresh
            }
          />
        )}

        {/*==============================================
            Pagination
        ==============================================*/}

        <PurchaseReportPagination
          page={page}
          pageSize={pageSize}
          totalRecords={
            totalRecords
          }
          totalPages={
            totalPages
          }
          loading={loading}
          onPageChange={
            handlePageChange
          }
          onPageSizeChange={
            handlePageSizeChange
          }
        />

        {/*==============================================
            Modal
        ==============================================*/}

        <PurchaseReportModal
          open={modalOpen}
          mode={modalMode}
          report={selectedReport}
          onClose={
            handleCloseModal
          }
          onSaved={handleSaved}
        />
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportView.propTypes = {
  initialFilters:
    PropTypes.object,

  initialPageSize:
    PropTypes.number,

  autoLoad:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

PurchaseReportView.defaultProps = {
  initialFilters: {},

  initialPageSize: 10,

  autoLoad: true,
};
export default PurchaseReportView;
