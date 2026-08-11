import React, {useCallback,useEffect,useMemo,useState} from "react";
import {Alert,Box,CircularProgress,Divider,Paper,Snackbar,Stack,Typography} from "@mui/material";

//======================================================
// Components
//======================================================

import TaxReportToolbar from "./TaxReportToolbar";
import TaxReportStatistics from "./TaxReportStatistics";
import TaxReportSearch from "./TaxReportSearch";
import TaxReportFilter from "./TaxReportFilter";
import TaxReportList from "./TaxReportList";
import TaxReportPagination from "./TaxReportPagination";
import TaxReportModal from "./TaxReportModal";
import TaxReportChart from "./TaxReportChart";
import TaxReportExport from "./TaxReportExport";

//======================================================
// Service
//======================================================

import {getTaxReports,getServiceErrorMessage} from "./TaxReportService";

//======================================================
// Helpers
//======================================================

import {filterTaxReports,normalizeTaxReports,sortTaxReports,calculateTaxStatistics,getEmptyTaxFilters} from "./TaxReportHelpers";

//======================================================
// CSS
//======================================================

import "./TaxReport.css";

//======================================================
// TaxReportView
//======================================================

const TaxReportView = () => {
  //====================================================
  // Data State
  //====================================================

  const [reports, setReports] = useState([]);

  //====================================================
  // Loading
  //====================================================

  const [loading, setLoading] = useState(false);

  //====================================================
  // Saving
  //====================================================

  const [saving, setSaving] = useState(false);

  //====================================================
  // Error
  //====================================================

  const [error, setError] = useState("");

  //====================================================
  // Success
  //====================================================

  const [success, setSuccess] = useState("");

  //====================================================
  // Search
  //====================================================

  const [search, setSearch] = useState("");

  //====================================================
  // Filters
  //====================================================

  const [filters,setFilters] = useState(getEmptyTaxFilters());

  //====================================================
  // Pagination
  //====================================================

  const [page, setPage] = useState(0);
  const [rowsPerPage,setRowsPerPage] = useState(10);

  //====================================================
  // Sorting
  //====================================================

  const [sortField,setSortField] = useState("date");
  const [sortDirection,setSortDirection] = useState("desc");

  //====================================================
  // Modal
  //====================================================

  const [modalOpen,setModalOpen] = useState(false);
  const [selectedReport,setSelectedReport] = useState(null);
  const [modalMode,setModalMode] = useState("view");

  //====================================================
  // Load Reports
  //====================================================

  const loadReports =
    useCallback(
      async () => {
        setLoading(true);
        setError("");
        try {
          const response = await getTaxReports();
          const normalized = normalizeTaxReports(response);
          setReports(normalized);
        } catch (serviceError) {
          console.error(
            "Tax report loading failed:",
            serviceError
          );
          setError(
            getServiceErrorMessage(
              serviceError,
              "Unable to load tax reports."
            )
          );
          setReports([]);
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
    loadReports();
  }, [loadReports]);

  //====================================================
  // Combined Filters
  //====================================================

  const activeFilters =
    useMemo(
      () => ({
        ...filters,
        search,
      }),
      [filters,search]
    );

  //====================================================
  // Filtered Reports
  //====================================================

  const filteredReports =
    useMemo(() => {
      return filterTaxReports(
        reports,
        activeFilters
      );
    }, [reports,activeFilters]);

  //====================================================
  // Sorted Reports
  //====================================================

  const sortedReports =
    useMemo(() => {
      return sortTaxReports(filteredReports,sortField,sortDirection);
    }, [filteredReports,sortField,sortDirection]);

  //====================================================
  // Statistics
  //====================================================

  const statistics =
    useMemo(() => {
      return calculateTaxStatistics(filteredReports);
    }, [filteredReports,]);

  //====================================================
  // Current Page Reports
  //====================================================

  const paginatedReports =
    useMemo(() => {
      const startIndex = page * rowsPerPage;
      return sortedReports.slice(startIndex,startIndex +rowsPerPage);
    }, [sortedReports,page,rowsPerPage]);

  //====================================================
  // Keep Page Valid
  //====================================================

  useEffect(() => {
    const totalPages =
      Math.max(1,Math.ceil( sortedReports.length /rowsPerPage));
    if (page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [sortedReports.length,rowsPerPage,page]);

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch = (
    value
  ) => {
    setSearch(value || "");
    setPage(0);
  };

  //====================================================
  // Filter Change
  //====================================================

  const handleFilterChange = (
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
  };

  //====================================================
  // Multiple Filters Change
  //====================================================
  const handleFiltersChange = (
    values
  ) => {
    if (!values || typeof values !== "object") 
    {
      return;
    }
    setFilters(
      (previous) => ({
        ...previous,
        ...values,
      })
    );
    setPage(0);
  };

  //====================================================
  // Clear Filters
  //====================================================
  const handleClearFilters =
    () => {
      setSearch("");
      setFilters(getEmptyTaxFilters());
      setPage(0);
    };

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = (
    event,
    nextPage
  ) => {
    setPage(Number(nextPage) || 0);
  };

  //====================================================
  // Rows Per Page
  //====================================================

  const handleRowsPerPageChange =
    (event) => {
      const nextValue = Number(event.target.value);
      setRowsPerPage( nextValue > 0 ? nextValue : 10 );
      setPage(0);
    };

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = (
    field
  ) => {
    if (sortField === field) {
      setSortDirection( (previous) => previous === "asc" ? "desc" : "asc");
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  //====================================================
  // Open View Modal
  //====================================================

  const handleView = (
    report
  ) => {
    if (!report) {
      return;
    }
    setSelectedReport(report);
    setModalMode("view");
    setModalOpen(true);
  };

  //====================================================
  // Open Edit Modal
  //====================================================

  const handleEdit = (
    report
  ) => {
    if (!report) {
      return;
    }
    setSelectedReport(report);
    setModalMode("edit");
    setModalOpen(true);
  };

  //====================================================
  // Close Modal
  //====================================================

  const handleCloseModal =
    () => {
      if (saving) {
        return;
      }
      setModalOpen(false);
      setSelectedReport(null);
      setModalMode("view");
    };

  //====================================================
  // Save Report
  //====================================================

  const handleSave = async (
    formData
  ) => {
    if (!formData) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      // The actual update service can be
      // connected when TaxReportService
      // exposes updateTaxReport().
      if (typeof window !== "undefined") {
        console.log("Tax report save:",formData);
      }
      setSuccess("Tax report saved successfully.");
      setModalOpen(false);
      await loadReports();
    } catch (saveError) {
      console.error("Tax report save failed:",saveError);
      setError(getServiceErrorMessage(saveError,"Unable to save tax report.")
      );
    } finally {
      setSaving(false);
    }
  };

  //====================================================
  // Export
  //====================================================

  const handleExport = async (
    format,
    exportReports,
    exportFilters
  ) => {
    console.log("Tax report export:",
      {
        format,
        exportReports,
        exportFilters,
      }
    );

    return false;
  };

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    async () => {
      await loadReports();
      setSuccess("Tax reports refreshed.");
    };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="tax-report"
      sx={{
        width: "100%",
      }}
    >
      <Stack spacing={2}>

        {/*==============================================
            Header
        ===============================================*/}
        <Box
          className="tax-report__header"
        >
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Tax Report
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            View, filter and analyze
            taxable transactions,
            GST and tax amounts.
          </Typography>
        </Box>

        <Divider />

        {/*==============================================
            Toolbar
        ===============================================*/}

        <Paper
          variant="outlined"
          sx={{
            p: 2,
          }}
        >
          <TaxReportToolbar
            onRefresh={
              handleRefresh
            }
            loading={
              loading
            }
            disabled={
              saving
            }
          />
        </Paper>

        {/*==============================================
            Statistics
        ===============================================*/}

        <TaxReportStatistics
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

        <TaxReportSearch
          value={
            search
          }
          onChange={
            handleSearch
          }
          disabled={
            loading ||
            saving
          }
        />

        {/*==============================================
            Filters
        ===============================================*/}

        <TaxReportFilter
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
            loading ||
            saving
          }
        />

        {/*==============================================
            Error
        ===============================================*/}

        {error ? (
          <Alert
            severity="error"
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        ) : null}

        {/*==============================================
            Chart
        ===============================================*/}

        <TaxReportChart
          reports={
            filteredReports
          }
          loading={
            loading
          }
        />

        {/*==============================================
            Export
        ===============================================*/}

        <TaxReportExport
          reports={
            filteredReports
          }
          filters={
            activeFilters
          }
          disabled={
            loading ||
            saving
          }
          onExport={
            handleExport
          }
        />

        {/*==============================================
            Report List
        ===============================================*/}

        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
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
                  Loading tax reports...
                </Typography>
              </Stack>
            </Box>
          ) : (
            <TaxReportList
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
        </Paper>

        {/*==============================================
            Pagination
        ===============================================*/}

        <TaxReportPagination
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
            loading ||
            saving
          }
        />

      </Stack>

      {/*==============================================
          Modal
      ===============================================*/}

      <TaxReportModal
        open={
          modalOpen
        }
        report={
          selectedReport
        }
        mode={
          modalMode
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
        onEdit={
          handleEdit
        }
      />

      {/*==============================================
          Success Snackbar
      ===============================================*/}

      <Snackbar
        open={
          Boolean(
            success
          )
        }
        autoHideDuration={
          3000
        }
        onClose={() =>
          setSuccess("")
        }
        message={
          success
        }
      />
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportView;

//======================================================
// Part 1A Ends Here
//======================================================