//======================================================
// SuppliesReportView.jsx
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
  Container,
  Snackbar,
  Stack,
} from "@mui/material";

//======================================================
// Child Components
//======================================================

import SuppliesReportToolbar from "./SuppliesReportToolbar";
import SuppliesReportStatistics from "./SuppliesReportStatistics";
import SuppliesReportSearch from "./SuppliesReportSearch";
import SuppliesReportFilter from "./SuppliesReportFilter";
import SuppliesReportList from "./SuppliesReportList";
import SuppliesReportPagination from "./SuppliesReportPagination";
import SuppliesReportModal from "./SuppliesReportModal";
import SuppliesReportExport from "./SuppliesReportExport";

//======================================================
// Service
//======================================================

import {
  getSuppliesReports,
} from "./SuppliesReportService";

//======================================================
// Helpers
//======================================================

import {
  filterSuppliesReports,
  normalizeSuppliesReports,
  sortSuppliesReports,
} from "./SuppliesReportHelpers";

//======================================================
// CSS
//======================================================

import "./SuppliesReport.css";

//======================================================
// Default Filters
//======================================================

const DEFAULT_FILTERS = {
  search: "",
  startDate: "",
  endDate: "",
  supplier: "",
  stockItem: "",
  category: "",
  warehouse: "",
  status: "",
};

//======================================================
// SuppliesReportView
//======================================================

const SuppliesReportView = () => {
  //====================================================
  // State
  //====================================================

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);

  const [sortField, setSortField] =
    useState("date");

  const [sortDirection, setSortDirection] =
    useState("desc");

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("view");

  const [exportOpen, setExportOpen] =
    useState(false);

  //====================================================
  // Load Reports
  //====================================================

  const loadReports = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getSuppliesReports(
            filters
          );

        const responseData =
          Array.isArray(
            response
          )
            ? response
            : response?.data ??
              response?.reports ??
              response?.items ??
              [];

        const normalized =
          normalizeSuppliesReports(
            responseData
          );

        setReports(normalized);
      } catch (requestError) {
        console.error(
          "Failed to load supplies reports:",
          requestError
        );

        setError(
          requestError?.message ||
            "Failed to load supplies reports."
        );

        setReports([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  //====================================================
  // Filter Reports
  //====================================================

  const filteredReports = useMemo(
    () => {
      return filterSuppliesReports(
        reports,
        filters
      );
    },
    [
      reports,
      filters,
    ]
  );

  //====================================================
  // Sort Reports
  //====================================================

  const sortedReports = useMemo(
    () => {
      return sortSuppliesReports(
        filteredReports,
        sortField,
        sortDirection
      );
    },
    [
      filteredReports,
      sortField,
      sortDirection,
    ]
  );

  //====================================================
  // Pagination
  //====================================================

  const paginatedReports =
    useMemo(() => {
      const start =
        page *
        rowsPerPage;

      const end =
        start +
        rowsPerPage;

      return sortedReports.slice(
        start,
        end
      );
    }, [
      sortedReports,
      page,
      rowsPerPage,
    ]);

  //====================================================
  // Statistics
  //====================================================

  const statistics =
    useMemo(() => {
      const total =
        filteredReports.length;

      const totalQuantity =
        filteredReports.reduce(
          (
            sum,
            report
          ) =>
            sum +
            Number(
              report.quantity ||
                report.qty ||
                0
            ),
          0
        );

      const totalAmount =
        filteredReports.reduce(
          (
            sum,
            report
          ) =>
            sum +
            Number(
              report.amount ||
                report.totalAmount ||
                report.value ||
                0
            ),
          0
        );

      const totalSuppliers =
        new Set(
          filteredReports
            .map(
              (report) =>
                report.supplier ||
                report.supplierName
            )
            .filter(Boolean)
        ).size;

      return {
        total,
        totalQuantity,
        totalAmount,
        totalSuppliers,
      };
    }, [
      filteredReports,
    ]);

  //====================================================
  // Filter Change
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
            [field]: value,
          })
        );

        setPage(0);
      },
      []
    );

  //====================================================
  // Filters Change
  //====================================================

  const handleFiltersChange =
    useCallback(
      (nextFilters) => {
        setFilters(
          (previous) => ({
            ...previous,
            ...nextFilters,
          })
        );

        setPage(0);
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

      setPage(0);
    }, []);

  //====================================================
  // Search
  //====================================================

  const handleSearch =
    useCallback(
      (value) => {
        handleFilterChange(
          "search",
          value
        );
      },
      [
        handleFilterChange,
      ]
    );

  //====================================================
  // Sort
  //====================================================

  const handleSort =
    useCallback(
      (field) => {
        setPage(0);

        setSortField(
          (previousField) => {
            if (
              previousField ===
              field
            ) {
              setSortDirection(
                (
                  previousDirection
                ) =>
                  previousDirection ===
                  "asc"
                    ? "desc"
                    : "asc"
              );

              return previousField;
            }

            setSortDirection(
              "asc"
            );

            return field;
          }
        );
      },
      []
    );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback(
      (
        event,
        nextPage
      ) => {
        setPage(
          nextPage
        );
      },
      []
    );

  //====================================================
  // Rows Per Page
  //====================================================

  const handleRowsPerPageChange =
    useCallback(
      (event) => {
        const value =
          Number(
            event.target.value
          );

        setRowsPerPage(
          value
        );

        setPage(0);
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

        setModalMode(
          "view"
        );

        setModalOpen(
          true
        );
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

        setModalMode(
          "edit"
        );

        setModalOpen(
          true
        );
      },
      []
    );

  //====================================================
  // Close Modal
  //====================================================

  const handleCloseModal =
    useCallback(() => {
      if (saving) {
        return;
      }

      setModalOpen(
        false
      );

      setSelectedReport(
        null
      );

      setModalMode(
        "view"
      );
    }, [
      saving,
    ]);

  //====================================================
  // Save Report
  //====================================================

  const handleSave =
    useCallback(
      async (
        updatedReport
      ) => {
        if (!updatedReport) {
          return;
        }

        setSaving(true);
        setError("");

        try {
          //================================================
          // Update service can be added here when the
          // backend supports editing supplies reports.
          //================================================

          setReports(
            (previousReports) =>
              previousReports.map(
                (report) => {
                  const reportId =
                    report.id ??
                    report.supplyId ??
                    report.reportId;

                  const updatedId =
                    updatedReport.id ??
                    updatedReport.supplyId ??
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

          setSuccessMessage(
            "Supplies report updated successfully."
          );

          setModalOpen(
            false
          );

          setSelectedReport(
            null
          );
        } catch (saveError) {
          console.error(
            "Failed to save supplies report:",
            saveError
          );

          setError(
            saveError?.message ||
              "Failed to save supplies report."
          );
        } finally {
          setSaving(false);
        }
      },
      []
    );

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
  // Export
  //====================================================

  const handleExport =
    useCallback(() => {
      setExportOpen(
        true
      );
    }, []);

  //====================================================
  // Close Export
  //====================================================

  const handleCloseExport =
    useCallback(() => {
      setExportOpen(
        false
      );
    }, []);

  //====================================================
  // Snackbar Close
  //====================================================

  const handleCloseSnackbar =
    useCallback(() => {
      setError("");

      setSuccessMessage("");
    }, []);

  //====================================================
  // Render
  //====================================================

  return (
    <Container
      maxWidth={false}
      className="supplies-report"
    >
      <Stack
        spacing={2}
      >

        {/*==============================================
            Toolbar
        ===============================================*/}

        <SuppliesReportToolbar
          onRefresh={
            handleRefresh
          }
          onExport={
            handleExport
          }
          loading={
            loading
          }
        />

        {/*==============================================
            Statistics
        ===============================================*/}

        <SuppliesReportStatistics
          reports={
            filteredReports
          }
          statistics={
            statistics
          }
          loading={
            loading
          }
        />

        {/*==============================================
            Search
        ===============================================*/}

        <SuppliesReportSearch
          value={
            filters.search
          }
          onChange={
            handleSearch
          }
          disabled={
            loading
          }
        />

        {/*==============================================
            Filter
        ===============================================*/}

        <SuppliesReportFilter
          filters={
            filters
          }
          onChange={
            handleFilterChange
          }
          onFiltersChange={
            handleFiltersChange
          }
          onClear={
            handleClearFilters
          }
          disabled={
            loading
          }
        />

        {/*==============================================
            Loading
        ===============================================*/}

        {loading &&
        reports.length === 0 ? (
          <Box
            className="supplies-report__loading"
          >
            <CircularProgress />
          </Box>
        ) : null}

        {/*==============================================
            Error
        ===============================================*/}

        {!loading &&
        error &&
        reports.length === 0 ? (
          <Alert
            severity="error"
            action={
              <button
                type="button"
                onClick={
                  handleRefresh
                }
              >
                Retry
              </button>
            }
          >
            {error}
          </Alert>
        ) : null}

        {/*==============================================
            Report List
        ===============================================*/}

        {(!loading ||
          reports.length > 0) && (
          <SuppliesReportList
            reports={
              paginatedReports
            }
            loading={
              loading
            }
            onView={
              handleView
            }
            onEdit={
              handleEdit
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
        )}

        {/*==============================================
            Pagination
        ===============================================*/}

        <SuppliesReportPagination
          count={
            sortedReports.length
          }
          page={
            page
          }
          rowsPerPage={
            rowsPerPage
          }
          onPageChange={
            handlePageChange
          }
          onRowsPerPageChange={
            handleRowsPerPageChange
          }
          disabled={
            loading
          }
        />

      </Stack>

      {/*================================================
          Details / Edit Modal
      =================================================*/}

      <SuppliesReportModal
        open={
          modalOpen
        }
        mode={
          modalMode
        }
        report={
          selectedReport
        }
        loading={
          loading
        }
        saving={
          saving
        }
        onClose={
          handleCloseModal
        }
        onSave={
          handleSave
        }
      />

      {/*================================================
          Export Modal
      =================================================*/}

      <SuppliesReportExport
        open={
          exportOpen
        }
        reports={
          sortedReports
        }
        onClose={
          handleCloseExport
        }
      />

      {/*================================================
          Notifications
      =================================================*/}

      <Snackbar
        open={
          Boolean(
            error ||
              successMessage
          )
        }
        autoHideDuration={
          5000
        }
        onClose={
          handleCloseSnackbar
        }
      >
        <Alert
          severity={
            error
              ? "error"
              : "success"
          }
          onClose={
            handleCloseSnackbar
          }
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {error ||
            successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportView;

//======================================================
// Part 1A Ends Here
//======================================================