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
  Paper,
  Stack,
} from "@mui/material";

import MarketplaceReportToolbar from "./MarketplaceReportToolbar";
import MarketplaceReportSearch from "./MarketplaceReportSearch";
import MarketplaceReportFilter from "./MarketplaceReportFilter";
import MarketplaceReportStatistics from "./MarketplaceReportStatistics";
import MarketplaceReportTable from "./MarketplaceReportTable";
import MarketplaceReportPagination from "./MarketplaceReportPagination";
import MarketplaceReportModal from "./MarketplaceReportModal";
import MarketplaceReportExport from "./MarketplaceReportExport";

import {
  getMarketplaceReports,
} from "./MarketplaceReportService";

//======================================================
// MarketplaceReportView
//======================================================

const MarketplaceReportView = ({
  initialFilters = {},
}) => {

  //====================================================
  // Reports State
  //====================================================

  const [reports, setReports] =
    useState([]);

  //====================================================
  // Statistics State
  //====================================================

  const [statistics, setStatistics] =
    useState({
      totalOrders: 0,
      totalSales: 0,
      totalProducts: 0,
      totalQuantity: 0,
      totalReturns: 0,
    });

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

  const [search, setSearch] =
    useState("");

  //====================================================
  // Filter State
  //====================================================

  const [filters, setFilters] =
    useState({
      marketplace: "",
      status: "",
      category: "",
      dateFrom: "",
      dateTo: "",
      ...initialFilters,
    });

  //====================================================
  // Pagination State
  //====================================================

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [totalRecords, setTotalRecords] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  //====================================================
  // Selection State
  //====================================================

  const [selectedRows, setSelectedRows] =
    useState([]);

  //====================================================
  // Filter Visibility
  //====================================================

  const [filterOpen, setFilterOpen] =
    useState(false);

  //====================================================
  // Modal State
  //====================================================

  const [modal, setModal] =
    useState({
      open: false,
      mode: "view",
      report: null,
    });

  //====================================================
  // Request Parameters
  //====================================================

  const requestParams = useMemo(
    () => ({
      page,
      pageSize,
      search: search.trim(),
      ...filters,
    }),
    [
      page,
      pageSize,
      search,
      filters,
    ]
  );

  //====================================================
  // Load Reports
  //====================================================

  const loadReports =
    useCallback(
      async (
        params = requestParams
      ) => {
        setLoading(true);
        setError("");

        try {
          const response =
            await getMarketplaceReports(
              params
            );

          const data =
            response?.data ??
            response;

          const reportList =
            Array.isArray(data)
              ? data
              : data?.reports ??
                data?.items ??
                data?.rows ??
                [];

          setReports(
            reportList
          );

          setStatistics({
            totalOrders:
              data?.statistics
                ?.totalOrders ??
              data?.totalOrders ??
              0,

            totalSales:
              data?.statistics
                ?.totalSales ??
              data?.totalSales ??
              0,

            totalProducts:
              data?.statistics
                ?.totalProducts ??
              data?.totalProducts ??
              0,

            totalQuantity:
              data?.statistics
                ?.totalQuantity ??
              data?.totalQuantity ??
              0,

            totalReturns:
              data?.statistics
                ?.totalReturns ??
              data?.totalReturns ??
              0,
          });

          const recordCount =
            Number(
              data?.totalRecords ??
              data?.totalCount ??
              data?.count ??
              reportList.length
            ) || 0;

          setTotalRecords(
            recordCount
          );

          setTotalPages(
            Number(
              data?.totalPages
            ) ||
              Math.max(
                1,
                Math.ceil(
                  recordCount /
                    pageSize
                )
              )
          );

          setSelectedRows([]);
        } catch (err) {
          console.error(
            "Failed to load marketplace reports:",
            err
          );

          setReports([]);

          setError(
            err?.response?.data
              ?.message ??
            err?.message ??
            "Failed to load marketplace reports."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        requestParams,
        pageSize,
      ]
    );

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Search Handler
  //====================================================

  const handleSearchChange =
    useCallback((value) => {
      setSearch(value ?? "");
      setPage(1);
    }, []);

  const handleSearch =
    useCallback((value) => {
      setSearch(value ?? "");
      setPage(1);
    }, []);

  //====================================================
  // Filter Handlers
  //====================================================

  const handleFilterChange =
    useCallback((nextFilters) => {
      setFilters((previous) => ({
        ...previous,
        ...nextFilters,
      }));

      setPage(1);
    }, []);

  const handleApplyFilters =
    useCallback((nextFilters) => {
      setFilters((previous) => ({
        ...previous,
        ...nextFilters,
      }));

      setPage(1);
      setFilterOpen(false);
    }, []);

  const handleResetFilters =
    useCallback(() => {
      setFilters({
        marketplace: "",
        status: "",
        category: "",
        dateFrom: "",
        dateTo: "",
      });

      setSearch("");
      setPage(1);
    }, []);

  //====================================================
  // Pagination Handlers
  //====================================================

  const handlePageChange =
    useCallback((nextPage) => {
      setPage(
        Math.max(
          1,
          Number(nextPage) || 1
        )
      );
    }, []);

  const handlePageSizeChange =
    useCallback((nextPageSize) => {
      const size =
        Number(nextPageSize) || 10;

      setPageSize(size);
      setPage(1);
    }, []);

  //====================================================
  // Selection Handlers
  //====================================================

  const handleSelectRow =
    useCallback((id) => {
      setSelectedRows((previous) => {
        if (previous.includes(id)) {
          return previous.filter(
            (rowId) => rowId !== id
          );
        }

        return [
          ...previous,
          id,
        ];
      });
    }, []);

  const handleSelectAll =
    useCallback((ids) => {
      if (!Array.isArray(ids)) {
        setSelectedRows([]);
        return;
      }

      setSelectedRows(ids);
    }, []);

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    useCallback(() => {
      loadReports();
    }, [loadReports]);

  //====================================================
  // Filter Toggle
  //====================================================

  const handleToggleFilter =
    useCallback(() => {
      setFilterOpen(
        (previous) => !previous
      );
    }, []);

  //====================================================
  // Modal Handlers
  //====================================================

  const handleView =
    useCallback((report) => {
      setModal({
        open: true,
        mode: "view",
        report,
      });
    }, []);

  const handleEdit =
    useCallback((report) => {
      setModal({
        open: true,
        mode: "edit",
        report,
      });
    }, []);

  const handleAdd =
    useCallback(() => {
      setModal({
        open: true,
        mode: "create",
        report: null,
      });
    }, []);

  const handleCloseModal =
    useCallback(() => {
      setModal({
        open: false,
        mode: "view",
        report: null,
      });
    }, []);

  const handleSaved =
    useCallback(async () => {
      handleCloseModal();
      await loadReports();
    }, [
      handleCloseModal,
      loadReports,
    ]);

  //====================================================
  // Delete Selected
  //====================================================

  const handleDeleteSelected =
    useCallback(() => {
      if (
        selectedRows.length === 0
      ) {
        return;
      }

      setError(
        "Delete action is not configured yet."
      );
    }, [selectedRows]);

  //====================================================
  // Export
  //====================================================

  const exportData = useMemo(
    () => ({
      reports,
      filters,
      search,
      totalRecords,
    }),
    [
      reports,
      filters,
      search,
      totalRecords,
    ]
  );

  //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="marketplace-report-view"
      sx={{
        width: "100%",
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      {/*================================================
          Error
      =================================================*/}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/*================================================
          Main Container
      =================================================*/}

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
          },
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>

          {/*==============================================
              Toolbar
          ==============================================*/}

          <MarketplaceReportToolbar
            selectedRows={
              selectedRows
            }
            totalRecords={
              totalRecords
            }
            loading={loading}
            onRefresh={
              handleRefresh
            }
            onAdd={handleAdd}
            onDeleteSelected={
              handleDeleteSelected
            }
            onToggleFilter={
              handleToggleFilter
            }
            filterOpen={
              filterOpen
            }
          />

          {/*==============================================
              Search
          ==============================================*/}

          <MarketplaceReportSearch
            value={search}
            onChange={
              handleSearchChange
            }
            onSearch={
              handleSearch
            }
            loading={loading}
          />

          {/*==============================================
              Filter
          ==============================================*/}

          {filterOpen && (
            <MarketplaceReportFilter
              filters={filters}
              onChange={
                handleFilterChange
              }
              onApply={
                handleApplyFilters
              }
              onReset={
                handleResetFilters
              }
              loading={loading}
            />
          )}

          {/*==============================================
              Statistics
          ==============================================*/}

          <MarketplaceReportStatistics
            statistics={
              statistics
            }
            loading={loading}
          />

          {/*==============================================
              Export
          ==============================================*/}

          <MarketplaceReportExport
            reports={reports}
            data={exportData}
            loading={loading}
          />

          {/*==============================================
              Table
          ==============================================*/}

          <MarketplaceReportTable
            reports={reports}
            selectedRows={
              selectedRows
            }
            loading={loading}
            onSelectRow={
              handleSelectRow
            }
            onSelectAll={
              handleSelectAll
            }
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleView}
          />

          {/*==============================================
              Pagination
          ==============================================*/}

          <MarketplaceReportPagination
            page={page}
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
            loading={loading}
          />

        </Stack>
      </Paper>

      {/*================================================
          Modal
      =================================================*/}

      <MarketplaceReportModal
        open={modal.open}
        mode={modal.mode}
        report={modal.report}
        onClose={
          handleCloseModal
        }
        onSaved={handleSaved}
      />

      {/*================================================
          Loading Overlay
      =================================================*/}

      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <CircularProgress
            size={28}
          />
        </Box>
      )}
    </Box>
  );

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

MarketplaceReportView.propTypes = {
  initialFilters: PropTypes.shape({
    marketplace: PropTypes.string,
    status: PropTypes.string,
    category: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
  }),
};

//======================================================
// Default Props
//======================================================

MarketplaceReportView.defaultProps = {
  initialFilters: {},
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportView;