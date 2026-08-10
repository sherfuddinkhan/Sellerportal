
//======================================================
// SalesReportView.jsx
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
} from "@mui/material";

import SalesReportCard from "./SalesReportCard";
import SalesReportList from "./SalesReportList";
import SalesReportTable from "./SalesReportTable";
import SalesReportToolbar from "./SalesReportToolbar";
import SalesReportStatistics from "./SalesReportStatistics";
import SalesReportSearch from "./SalesReportSearch";
import SalesReportFilter from "./SalesReportFilter";
import SalesReportPagination from "./SalesReportPagination";
import SalesReportModal from "./SalesReportModal";
import SalesReportExport from "./SalesReportExport";

import SalesReportService from "./SalesReportService";

import {
  calculateSalesReportStatistics,
  filterSalesReports,
  getUniqueSalesReportValues,
  paginateSalesReports,
  sortSalesReports,
} from "./SalesReportHelpers";

import "./SalesReport.css";

//======================================================
// SalesReportView
//======================================================

const SalesReportView = ({
  initialReports = [],
  autoLoad = true,
}) => {
  //====================================================
  // State
  //====================================================

  const [reports, setReports] =
    useState(
      Array.isArray(initialReports)
        ? initialReports
        : []
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filters, setFilters] =
    useState({
      marketplace: "",
      category: "",
      status: "",
      customer: "",
      startDate: "",
      endDate: "",
    });

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [sortField, setSortField] =
    useState("date");

  const [sortDirection, setSortDirection] =
    useState("desc");

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("view");

  //====================================================
  // Load Reports
  //====================================================

  const loadReports =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await SalesReportService.getSalesReports();

        const data =
          Array.isArray(response)
            ? response
            : response?.data || [];

        setReports(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (loadError) {
        setError(
          loadError?.message ||
            "Unable to load sales reports."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {
    if (
      autoLoad &&
      reports.length === 0
    ) {
      loadReports();
    }
  }, [
    autoLoad,
    loadReports,
    reports.length,
  ]);

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch = useCallback(
    (value) => {
      setSearch(value || "");
      setPage(1);
    },
    []
  );

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilter = useCallback(
    (value) => {
      setFilters(
        value || {}
      );
      setPage(1);
    },
    []
  );

  //====================================================
  // Reset Filter
  //====================================================

  const handleResetFilter =
    useCallback(() => {
      setFilters({
        marketplace: "",
        category: "",
        status: "",
        customer: "",
        startDate: "",
        endDate: "",
      });

      setSearch("");
      setPage(1);
    }, []);
  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = useCallback(
    (field) => {
      if (!field) {
        return;
      }

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
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback((newPage) => {
      setPage(
        Math.max(
          1,
          Number(newPage) || 1
        )
      );
    }, []);

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (newPageSize) => {
        const safePageSize =
          Math.max(
            1,
            Number(newPageSize) ||
              10
          );

        setPageSize(
          safePageSize
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Open Report
  //====================================================

  const handleViewReport =
    useCallback((report) => {
      setSelectedReport(
        report
      );

      setModalMode("view");
      setModalOpen(true);
    }, []);

  //====================================================
  // Edit Report
  //====================================================

  const handleEditReport =
    useCallback((report) => {
      setSelectedReport(
        report
      );

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
  // Delete Report
  //====================================================

  const handleDeleteReport =
    useCallback(
      async (report) => {
        if (!report) {
          return;
        }

        const id =
          report.id ??
          report.reportId ??
          report.salesReportId;

        if (
          id === null ||
          id === undefined ||
          id === ""
        ) {
          setError(
            "Sales report ID is missing."
          );

          return;
        }

        setLoading(true);
        setError("");

        try {
          await SalesReportService.deleteSalesReport(
            id
          );

          setReports(
            (previous) =>
              previous.filter(
                (item) => {
                  const itemId =
                    item.id ??
                    item.reportId ??
                    item.salesReportId;

                  return (
                    String(itemId) !==
                    String(id)
                  );
                }
              )
          );

          handleCloseModal();
        } catch (deleteError) {
          setError(
            deleteError?.message ||
              "Unable to delete sales report."
          );
        } finally {
          setLoading(false);
        }
      },
      [handleCloseModal]
    );

  //====================================================
  // Save Report
  //====================================================

  const handleSaveReport =
    useCallback(
      async (payload) => {
        if (!payload) {
          return;
        }

        const id =
          selectedReport?.id ??
          selectedReport?.reportId ??
          selectedReport?.salesReportId;

        setLoading(true);
        setError("");

        try {
          let savedReport;

          if (
            id !== null &&
            id !== undefined &&
            id !== ""
          ) {
            savedReport =
              await SalesReportService.updateSalesReport(
                id,
                payload
              );
          } else {
            savedReport =
              await SalesReportService.createSalesReport(
                payload
              );
          }

          const updatedReport =
            savedReport?.data ??
            savedReport;

          if (
            id !== null &&
            id !== undefined &&
            id !== ""
          ) {
            setReports(
              (previous) =>
                previous.map(
                  (item) => {
                    const itemId =
                      item.id ??
                      item.reportId ??
                      item.salesReportId;

                    return String(
                      itemId
                    ) ===
                      String(id)
                      ? {
                          ...item,
                          ...updatedReport,
                        }
                      : item;
                  }
                )
            );
          } else {
            setReports(
              (previous) => [
                updatedReport,
                ...previous,
              ]
            );
          }

          handleCloseModal();
        } catch (saveError) {
          setError(
            saveError?.message ||
              "Unable to save sales report."
          );

          throw saveError;
        } finally {
          setLoading(false);
        }
      },
      [
        selectedReport,
        handleCloseModal,
      ]
    );

  //====================================================
  // Filtered Reports
  //====================================================

  const filteredReports =
    useMemo(() => {
      return filterSalesReports(
        reports,
        {
          ...filters,
          search,
        }
      );
    }, [
      reports,
      filters,
      search,
    ]);

  //====================================================
  // Sorted Reports
  //====================================================

  const sortedReports =
    useMemo(() => {
      return sortSalesReports(
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
  // Paginated Reports
  //====================================================

  const pagination =
    useMemo(() => {
      return paginateSalesReports(
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
  // Statistics
  //====================================================

  const statistics =
    useMemo(() => {
      return calculateSalesReportStatistics(
        filteredReports
      );
    }, [
      filteredReports,
    ]);

  //====================================================
  // Filter Options
  //====================================================

  const marketplaces =
    useMemo(
      () =>
        getUniqueSalesReportValues(
          reports,
          "marketplace"
        ),
      [reports]
    );

  const categories =
    useMemo(
      () =>
        getUniqueSalesReportValues(
          reports,
          "category"
        ),
      [reports]
    );

  const statuses =
    useMemo(
      () =>
        getUniqueSalesReportValues(
          reports,
          "status"
        ),
      [reports]
    );
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="sales-report"
      sx={{
        width: "100%",
      }}
    >
      <Stack spacing={2}>
        {/*==============================================
            Error Message
        ==============================================*/}

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
            Statistics
        ==============================================*/}

        <SalesReportStatistics
          statistics={statistics}
          loading={loading}
        />

        {/*==============================================
            Toolbar
        ==============================================*/}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor:
              "divider",
          }}
        >
          <SalesReportToolbar
            loading={loading}
            onRefresh={
              loadReports
            }
            onReset={
              handleResetFilter
            }
          />
        </Paper>

        {/*==============================================
            Search
        ==============================================*/}

        <SalesReportSearch
          value={search}
          loading={loading}
          onChange={
            handleSearch
          }
        />

        {/*==============================================
            Filters
        ==============================================*/}

        <SalesReportFilter
          filters={filters}
          marketplaces={
            marketplaces
          }
          categories={
            categories
          }
          statuses={statuses}
          loading={loading}
          onApply={
            handleFilter
          }
          onReset={
            handleResetFilter
          }
        />

        {/*==============================================
            Loading
        ==============================================*/}

        {loading &&
          reports.length ===
            0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                minHeight: 180,
              }}
            >
              <CircularProgress />
            </Box>
          )}

        {/*==============================================
            Report Content
        ==============================================*/}

        {!(
          loading &&
          reports.length ===
            0
        ) && (
          <>
            {/* Desktop / Table View */}

            <Paper
              elevation={0}
              sx={{
                width: "100%",
                overflow: "hidden",
                border:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >
              <SalesReportTable
                reports={
                  pagination.data
                }
                loading={
                  loading
                }
                sortField={
                  sortField
                }
                sortDirection={
                  sortDirection
                }
                onSort={
                  handleSort
                }
                onView={
                  handleViewReport
                }
                onEdit={
                  handleEditReport
                }
                onDelete={
                  handleDeleteReport
                }
              />
            </Paper>

            {/* Mobile / List View */}

            <Box
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                },
              }}
            >
              <SalesReportList
                reports={
                  pagination.data
                }
                loading={
                  loading
                }
                onView={
                  handleViewReport
                }
                onEdit={
                  handleEditReport
                }
                onDelete={
                  handleDeleteReport
                }
              />
            </Box>

            {/* Pagination */}

            <SalesReportPagination
              page={
                pagination.page
              }
              pageSize={
                pagination.pageSize
              }
              totalRecords={
                pagination.totalRecords
              }
              totalPages={
                pagination.totalPages
              }
              loading={
                loading
              }
              onPageChange={
                handlePageChange
              }
              onPageSizeChange={
                handlePageSizeChange
              }
            />
          </>
        )}

        {/*==============================================
            Export
        ==============================================*/}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "flex-end",
          }}
        >
          <SalesReportExport
            reports={reports}
            filteredReports={
              filteredReports
            }
            loading={loading}
          />
        </Box>

        {/*==============================================
            Report Modal
        ==============================================*/}

        <SalesReportModal
          open={modalOpen}
          report={
            selectedReport
          }
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
};

//======================================================
// Export
//======================================================

export default SalesReportView;




