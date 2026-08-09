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
} from "@mui/material";

import MarketplaceReportToolbar from "./MarketplaceReportToolbar";
import MarketplaceReportStatistics from "./MarketplaceReportStatistics";
import MarketplaceReportSearch from "./MarketplaceReportSearch";
import MarketplaceReportFilter from "./MarketplaceReportFilter";
import MarketplaceReportTable from "./MarketplaceReportTable";
import MarketplaceReportPagination from "./MarketplaceReportPagination";
import MarketplaceReportModal from "./MarketplaceReportModal";
import MarketplaceReportExport from "./MarketplaceReportExport";

import {
  getMarketplaceReports,
  getMarketplaces,
  getMarketplaceReportStatuses,
  getMarketplaceReportCategories,
  deleteMarketplaceReport,
} from "./MarketplaceReportService";

import {
  filterMarketplaceReports,
  searchMarketplaceReports,
  sortMarketplaceReports,
  calculateMarketplaceStatistics,
} from "./MarketplaceReportHelpers";

//======================================================
// MarketplaceReportView
//======================================================

const MarketplaceReportView = ({
  initialFilters = {},
  initialPage = 1,
  initialPageSize = 10,
}) => {
  //====================================================
  // Data State
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
      marketplace: "",
      status: "",
      category: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      ...initialFilters,
    });

  //====================================================
  // Pagination State
  //====================================================

  const [page, setPage] =
    useState(initialPage);

  const [pageSize, setPageSize] =
    useState(initialPageSize);

  //====================================================
  // Sort State
  //====================================================

  const [sortBy, setSortBy] =
    useState("reportDate");

  const [sortOrder, setSortOrder] =
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
  // Filter Options
  //====================================================

  const [marketplaces, setMarketplaces] =
    useState([]);

  const [statuses, setStatuses] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  //====================================================
  // Load Reports
  //====================================================

  const loadReports =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getMarketplaceReports();

        const data =
          response?.reports ??
          response?.data ??
          response?.items ??
          [];

        setReports(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (loadError) {
        console.error(
          "MarketplaceReportView load error:",
          loadError
        );

        setError(
          loadError?.response
            ?.data?.message ??
            loadError?.message ??
            "Unable to load marketplace reports."
        );

        setReports([]);
      } finally {
        setLoading(false);
      }
    }, []);

  //====================================================
  // Load Filter Options
  //====================================================

  const loadFilterOptions =
    useCallback(async () => {
      try {
        const [
          marketplaceData,
          statusData,
          categoryData,
        ] = await Promise.all([
          getMarketplaces(),
          getMarketplaceReportStatuses(),
          getMarketplaceReportCategories(),
        ]);

        setMarketplaces(
          Array.isArray(
            marketplaceData
          )
            ? marketplaceData
            : []
        );

        setStatuses(
          Array.isArray(
            statusData
          )
            ? statusData
            : []
        );

        setCategories(
          Array.isArray(
            categoryData
          )
            ? categoryData
            : []
        );
      } catch (optionError) {
        console.warn(
          "Unable to load marketplace report filter options:",
          optionError
        );
      }
    }, []);

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {
    loadReports();
    loadFilterOptions();
  }, [
    loadReports,
    loadFilterOptions,
  ]);

  //====================================================
  // Process Reports
  //====================================================

  const processedReports =
    useMemo(() => {
      let result =
        filterMarketplaceReports(
          reports,
          filters
        );

      result =
        searchMarketplaceReports(
          result,
          searchTerm
        );

      result =
        sortMarketplaceReports(
          result,
          sortBy,
          sortOrder
        );

      return result;
    }, [
      reports,
      filters,
      searchTerm,
      sortBy,
      sortOrder,
    ]);

  //====================================================
  // Total Pages
  //====================================================

  const totalRecords =
    processedReports.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRecords /
          pageSize
      )
    );

  //====================================================
  // Keep Page Valid
  //====================================================

  useEffect(() => {
    if (
      page > totalPages
    ) {
      setPage(totalPages);
    }
  }, [
    page,
    totalPages,
  ]);

  //====================================================
  // Paginated Reports
  //====================================================

  const paginatedReports =
    useMemo(() => {
      const start =
        (page - 1) *
        pageSize;

      return processedReports.slice(
        start,
        start + pageSize
      );
    }, [
      processedReports,
      page,
      pageSize,
    ]);

  //====================================================
  // Statistics
  //====================================================

  const statistics =
    useMemo(
      () =>
        calculateMarketplaceStatistics(
          processedReports
        ),
      [processedReports]
    );

  //====================================================
  // Search
  //====================================================

  const handleSearch =
    useCallback(
      (value) => {
        setSearchTerm(
          value ?? ""
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Clear Search
  //====================================================

  const handleClearSearch =
    useCallback(() => {
      setSearchTerm("");
      setPage(1);
    }, []);

  //====================================================
  // Apply Filters
  //====================================================

  const handleApplyFilters =
    useCallback(
      (nextFilters) => {
        setFilters({
          marketplace: "",
          status: "",
          category: "",
          dateFrom: "",
          dateTo: "",
          minAmount: "",
          maxAmount: "",
          ...(nextFilters || {}),
        });

        setPage(1);
      },
      []
    );

  //====================================================
  // Reset Filters
  //====================================================

  const handleResetFilters =
    useCallback(() => {
      setFilters({
        marketplace: "",
        status: "",
        category: "",
        dateFrom: "",
        dateTo: "",
        minAmount: "",
        maxAmount: "",
      });

      setPage(1);
    }, []);

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback(
      (nextPage) => {
        setPage(
          Number(nextPage) || 1
        );
      },
      []
    );

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (nextPageSize) => {
        setPageSize(
          Number(
            nextPageSize
          ) || 10
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

        setModalMode("view");
        setModalOpen(true);
      },
      []
    );

  //====================================================
  // Edit Report
  //====================================================

  const handleEdit =
    useCallback(
      (report) => {
        setSelectedReport(
          report
        );

        setModalMode("edit");
        setModalOpen(true);
      },
      []
    );

  //====================================================
  // Add Report
  //====================================================

  const handleAdd =
    useCallback(() => {
      setSelectedReport(null);

      setModalMode("create");
      setModalOpen(true);
    }, []);

  //====================================================
  // Close Modal
  //====================================================

  const handleCloseModal =
    useCallback(() => {
      setModalOpen(false);
      setSelectedReport(null);
    }, []);

  //====================================================
  // Saved Report
  //====================================================

  const handleSaved =
    useCallback(async () => {
      await loadReports();

      setModalOpen(false);
      setSelectedReport(null);
    }, [
      loadReports,
    ]);

  //====================================================
  // Delete Report
  //====================================================

  const handleDelete =
    useCallback(
      async (report) => {
        const reportId =
          report?.id ??
          report?.reportId ??
          report?.orderId;

        if (
          reportId ===
            undefined ||
          reportId === null ||
          reportId === ""
        ) {
          setError(
            "Unable to delete report: report ID is missing."
          );

          return;
        }

        const confirmed =
          window.confirm(
            "Are you sure you want to delete this marketplace report?"
          );

        if (!confirmed) {
          return;
        }

        setLoading(true);
        setError("");

        try {
          await deleteMarketplaceReport(
            reportId
          );

          await loadReports();
        } catch (deleteError) {
          console.error(
            "Marketplace report delete error:",
            deleteError
          );

          setError(
            deleteError?.response
              ?.data?.message ??
              deleteError?.message ??
              "Unable to delete marketplace report."
          );
        } finally {
          setLoading(false);
        }
      },
      [loadReports]
    );

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    useCallback(async () => {
      await loadReports();
    }, [
      loadReports,
    ]);

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort =
    useCallback(
      (
        column,
        direction
      ) => {
        setSortBy(
          column ||
            "reportDate"
        );

        setSortOrder(
          direction ||
            "desc"
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Export Handler
  //====================================================

  const handleExport =
    useCallback(
      async ({
        format,
        data,
      }) => {
        if (
          !Array.isArray(
            data
          ) ||
          data.length === 0
        ) {
          setError(
            "There are no records to export."
          );

          return;
        }

        try {
          if (
            format === "csv"
          ) {
            const headers =
              Object.keys(
                data[0]
              );

            const escapeValue =
              (value) => {
                const text =
                  String(
                    value ?? ""
                  );

                if (
                  /[",\n]/.test(
                    text
                  )
                ) {
                  return `"${text.replace(
                    /"/g,
                    '""'
                  )}"`;
                }

                return text;
              };

            const csv = [
              headers
                .map(
                  escapeValue
                )
                .join(","),

              ...data.map(
                (row) =>
                  headers
                    .map(
                      (header) =>
                        escapeValue(
                          row[
                            header
                          ]
                        )
                    )
                    .join(",")
              ),
            ].join("\n");

            const blob =
              new Blob(
                [csv],
                {
                  type:
                    "text/csv;charset=utf-8;",
                }
              );

            const url =
              URL.createObjectURL(
                blob
              );

            const link =
              document.createElement(
                "a"
              );

            link.href = url;

            link.download =
              "marketplace-report.csv";

            document.body.appendChild(
              link
            );

            link.click();

            document.body.removeChild(
              link
            );

            URL.revokeObjectURL(
              url
            );
          }
        } catch (exportError) {
          console.error(
            "Marketplace report export error:",
            exportError
          );

          setError(
            "Unable to export marketplace report."
          );
        }
      },
      []
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
      <Stack spacing={2}>
        {/*================================================
            Error
        =================================================*/}

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

        {/*================================================
            Toolbar
        =================================================*/}

        <MarketplaceReportToolbar
          loading={loading}
          onAdd={handleAdd}
          onRefresh={
            handleRefresh
          }
        />

        {/*================================================
            Statistics
        =================================================*/}

        <MarketplaceReportStatistics
          statistics={
            statistics
          }
          loading={loading}
        />

        {/*================================================
            Search
        =================================================*/}

        <MarketplaceReportSearch
          value={searchTerm}
          loading={loading}
          onChange={
            handleSearch
          }
          onSearch={
            handleSearch
          }
          onClear={
            handleClearSearch
          }
        />

        {/*================================================
            Filters
        =================================================*/}

        <MarketplaceReportFilter
          filters={filters}
          marketplaces={
            marketplaces
          }
          statuses={statuses}
          categories={categories}
          loading={loading}
          onApply={
            handleApplyFilters
          }
          onReset={
            handleResetFilters
          }
        />

        {/*================================================
            Export
        =================================================*/}

        <Box
          display="flex"
          justifyContent="flex-end"
        >
          <MarketplaceReportExport
            reports={
              processedReports
            }
            loading={loading}
            onExport={
              handleExport
            }
          />
        </Box>

        {/*================================================
            Table
        =================================================*/}

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={250}
          >
            <CircularProgress />
          </Box>
        ) : (
          <MarketplaceReportTable
            reports={
              paginatedReports
            }
            loading={loading}
            onView={
              handleView
            }
            onEdit={
              handleEdit
            }
            onDelete={
              handleDelete
            }
            onSort={
              handleSort
          }
          />
        )}

        {/*================================================
            Pagination
        =================================================*/}

        <MarketplaceReportPagination
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

        {/*================================================
            Modal
        =================================================*/}

        <MarketplaceReportModal
          open={modalOpen}
          mode={modalMode}
          report={
            selectedReport
          }
          onClose={
            handleCloseModal
          }
          onSaved={
            handleSaved
          }
        />
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

MarketplaceReportView.propTypes = {
  initialFilters:
    PropTypes.object,

  initialPage:
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

  initialPageSize:
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
};

//======================================================
// Default Props
//======================================================

MarketplaceReportView.defaultProps = {
  initialFilters: {},

  initialPage: 1,

  initialPageSize: 10,
};

//======================================================
// Export
//======================================================

export default MarketplaceReportView;