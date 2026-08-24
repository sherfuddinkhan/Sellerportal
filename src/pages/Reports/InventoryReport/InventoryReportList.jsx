import React, {useCallback,useEffect,useMemo,useState} from "react";
import {Alert,Box,CircularProgress,Snackbar} from "@mui/material";

//======================================================
// Inventory Report Components
//======================================================

import InventoryReportSearch from "./InventoryReportSearch";
import InventoryReportToolbar from "./InventoryReportToolbar";
import InventoryReportStatistics from "./InventoryReportStatistics";
import InventoryReportTable from "./InventoryReportTable";
import InventoryReportPagination from "./InventoryReportPagination";
import InventoryReportCard from "./InventoryReportCard";
import InventoryReportView from "./InventoryReportView";
import InventoryReportModal from "./InventoryReportModal";

//======================================================
// Inventory Report Service
//======================================================

import InventoryReportService from "./InventoryReportService";

//======================================================
// Inventory Report Helper
//======================================================

import {filterInventoryReports,sortInventoryReports} from "./inventoryReportHelpers";

//======================================================
// InventoryReportList
//======================================================

const InventoryReportList = () => {

  //====================================================
  // Data State
  //====================================================

  const [reports, setReports] = useState([]);

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
      status: "",
      reportType: "",
      dateFrom: "",
      dateTo: "",
    });

  //====================================================
  // Pagination State
  //====================================================

  const [page, setPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  //====================================================
  // Sorting State
  //====================================================

  const [sortField, setSortField] =
    useState("createdDate");

  const [sortDirection, setSortDirection] =
    useState("desc");

  //====================================================
  // Selection State
  //====================================================

  const [selectedRows, setSelectedRows] =
    useState([]);

  //====================================================
  // Modal State
  //====================================================

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("add");

  const [selectedReport, setSelectedReport] =
    useState(null);

  //====================================================
  // View State
  //====================================================

  const [viewOpen, setViewOpen] =
    useState(false);

  const [viewReport, setViewReport] =
    useState(null);

  //====================================================
  // Notification State
  //====================================================

  const [notification, setNotification] =
    useState({
      open: false,
      message: "",
      severity: "success",
    });

  //====================================================
  // Load Reports
  //====================================================

  const loadReports = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await InventoryReportService
            .getInventoryReports();

        const data =
          Array.isArray(response)
            ? response
            : response?.items ||
              response?.data ||
              response?.reports ||
              [];

        setReports(data);

      } catch (serviceError) {

        console.error(
          "Failed to load inventory reports:",
          serviceError
        );

        setError(
          serviceError?.message ||
          "Failed to load inventory reports."
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

  }, [
    loadReports,
  ]);

  //====================================================
  // Filtered Reports
  //====================================================

  const filteredReports =
    useMemo(() => {

      return filterInventoryReports(
        reports,
        {
          ...filters,
          search: searchTerm,
        }
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

      return sortInventoryReports(
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
  // Pagination
  //====================================================

  const totalRecords =
    sortedReports.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRecords /
        rowsPerPage
      )
    );

  const paginatedReports =
    useMemo(() => {

      const startIndex =
        (page - 1) *
        rowsPerPage;

      const endIndex =
        startIndex +
        rowsPerPage;

      return sortedReports.slice(
        startIndex,
        endIndex
      );

    }, [
      sortedReports,
      page,
      rowsPerPage,
    ]);

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
  // Search Handler
  //====================================================

  const handleSearch = (
    value
  ) => {

    setSearchTerm(
      value || ""
    );

    setPage(1);

  };

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilter = (
    newFilters
  ) => {

    setFilters(
      newFilters || {}
    );

    setPage(1);

  };

  //====================================================
  // Reset Filters
  //====================================================

  const handleResetFilters = () => {

    setSearchTerm("");

    setFilters({
      status: "",
      reportType: "",
      dateFrom: "",
      dateTo: "",
    });

    setPage(1);

  };

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh = () => {

    setSelectedRows([]);

    loadReports();

  };

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = (
    newPage
  ) => {

    setPage(
      Number(newPage) || 1
    );

  };

  //====================================================
  // Rows Per Page
  //====================================================

  const handleRowsPerPageChange = (
    value
  ) => {

    setRowsPerPage(
      Number(value) || 10
    );

    setPage(1);

  };

  //====================================================
  // Sort
  //====================================================

  const handleSort = (
    field
  ) => {

    if (
      sortField === field
    ) {

      setSortDirection(
        (previous) =>
          previous === "asc"
            ? "desc"
            : "asc"
      );

    } else {

      setSortField(field);

      setSortDirection("asc");

    }

  };

  //====================================================
  // Selection
  //====================================================

  const handleSelectionChange = (
    rows
  ) => {

    setSelectedRows(
      Array.isArray(rows)
        ? rows
        : []
    );

  };

  //====================================================
  // Add Report
  //====================================================

  const handleAdd = () => {

    setSelectedReport(null);

    setModalMode("add");

    setModalOpen(true);

  };

  //====================================================
  // Edit Report
  //====================================================

  const handleEdit = (
    report
  ) => {

    setSelectedReport(
      report
    );

    setModalMode("edit");

    setModalOpen(true);

  };

  //====================================================
  // View Report
  //====================================================

  const handleView = (
    report
  ) => {

    setViewReport(
      report
    );

    setViewOpen(true);

  };

  //====================================================
  // Close Modal
  //====================================================

  const handleCloseModal = () => {

    setModalOpen(false);

    setSelectedReport(null);

  };

  //====================================================
  // Close View
  //====================================================

  const handleCloseView = () => {

    setViewOpen(false);

    setViewReport(null);

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Save Report
  //====================================================

  const handleSubmitReport = async (
    formData,
    existingReport = null
  ) => {

    try {

      setLoading(true);
      setError("");

      if (existingReport) {

        const reportId =
          existingReport?.id ??
          existingReport?.reportId ??
          existingReport?.inventoryReportId;

        if (!reportId) {
          throw new Error(
            "Inventory report ID is missing."
          );
        }

        await InventoryReportService
          .updateInventoryReport(
            reportId,
            formData
          );

        setNotification({
          open: true,
          message:
            "Inventory report updated successfully.",
          severity: "success",
        });

      } else {

        await InventoryReportService
          .createInventoryReport(
            formData
          );

        setNotification({
          open: true,
          message:
            "Inventory report created successfully.",
          severity: "success",
        });

      }

      handleCloseModal();

      await loadReports();

    } catch (serviceError) {

      console.error(
        "Failed to save inventory report:",
        serviceError
      );

      setError(
        serviceError?.message ||
        "Failed to save inventory report."
      );

      setNotification({
        open: true,
        message:
          serviceError?.message ||
          "Failed to save inventory report.",
        severity: "error",
      });

    } finally {

      setLoading(false);

    }

  };

  //====================================================
  // Delete Report
  //====================================================

  const handleDelete = async (
    report
  ) => {

    const reportId =
      report?.id ??
      report?.reportId ??
      report?.inventoryReportId;

    if (!reportId) {

      setNotification({
        open: true,
        message:
          "Inventory report ID is missing.",
        severity: "error",
      });

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this inventory report?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      await InventoryReportService
        .deleteInventoryReport(
          reportId
        );

      setSelectedRows(
        (previous) =>
          previous.filter(
            (row) =>
              String(
                row?.id ??
                row?.reportId ??
                row?.inventoryReportId
              ) !==
              String(reportId)
          )
      );

      setNotification({
        open: true,
        message:
          "Inventory report deleted successfully.",
        severity: "success",
      });

      await loadReports();

    } catch (serviceError) {

      console.error(
        "Failed to delete inventory report:",
        serviceError
      );

      setNotification({
        open: true,
        message:
          serviceError?.message ||
          "Failed to delete inventory report.",
        severity: "error",
      });

    } finally {

      setLoading(false);

    }

  };

  //====================================================
  // Bulk Delete
  //====================================================

  const handleBulkDelete = async () => {

    if (
      selectedRows.length === 0
    ) {

      setNotification({
        open: true,
        message:
          "Please select at least one inventory report.",
        severity: "warning",
      });

      return;
    }

    const reportIds =
      selectedRows
        .map(
          (row) =>
            row?.id ??
            row?.reportId ??
            row?.inventoryReportId
        )
        .filter(Boolean);

    if (
      reportIds.length === 0
    ) {

      setNotification({
        open: true,
        message:
          "No valid inventory report IDs were selected.",
        severity: "error",
      });

      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${reportIds.length} selected inventory report(s)?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      await InventoryReportService
        .bulkDeleteInventoryReports(
          reportIds
        );

      setSelectedRows([]);

      setNotification({
        open: true,
        message:
          "Selected inventory reports deleted successfully.",
        severity: "success",
      });

      await loadReports();

    } catch (serviceError) {

      console.error(
        "Failed to delete selected inventory reports:",
        serviceError
      );

      setNotification({
        open: true,
        message:
          serviceError?.message ||
          "Failed to delete selected inventory reports.",
        severity: "error",
      });

    } finally {

      setLoading(false);

    }

  };

  //====================================================
  // Activate Report
  //====================================================

  const handleActivate = async (
    report
  ) => {

    const reportId =
      report?.id ??
      report?.reportId ??
      report?.inventoryReportId;

    if (!reportId) {
      return;
    }

    try {

      setLoading(true);

      await InventoryReportService
        .activateInventoryReport(
          reportId
        );

      setNotification({
        open: true,
        message:
          "Inventory report activated successfully.",
        severity: "success",
      });

      await loadReports();

    } catch (serviceError) {

      console.error(
        "Failed to activate inventory report:",
        serviceError
      );

      setNotification({
        open: true,
        message:
          serviceError?.message ||
          "Failed to activate inventory report.",
        severity: "error",
      });

    } finally {

      setLoading(false);

    }

  };

  //====================================================
  // Deactivate Report
  //====================================================

  const handleDeactivate = async (
    report
  ) => {

    const reportId =
      report?.id ??
      report?.reportId ??
      report?.inventoryReportId;

    if (!reportId) {
      return;
    }

    try {

      setLoading(true);

      await InventoryReportService
        .deactivateInventoryReport(
          reportId
        );

      setNotification({
        open: true,
        message:
          "Inventory report deactivated successfully.",
        severity: "success",
      });

      await loadReports();

    } catch (serviceError) {

      console.error(
        "Failed to deactivate inventory report:",
        serviceError
      );

      setNotification({
        open: true,
        message:
          serviceError?.message ||
          "Failed to deactivate inventory report.",
        severity: "error",
      });

    } finally {

      setLoading(false);

    }

  };

  //====================================================
  // Notification Close
  //====================================================

  const handleNotificationClose = (
    event,
    reason
  ) => {

    if (
      reason === "clickaway"
    ) {
      return;
    }

    setNotification(
      (previous) => ({
        ...previous,
        open: false,
      })
    );

  };

  //====================================================
  // Main JSX
  //====================================================

  return (
    <Box
      className="inventory-report"
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
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/*================================================
          Search
      =================================================*/}

      <Box sx={{ mb: 2 }}>
        <InventoryReportSearch
          value={searchTerm}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onChange={handleSearch}
          loading={loading}
        />
      </Box>

      {/*================================================
          Toolbar
      =================================================*/}

      <Box sx={{ mb: 2 }}>
        <InventoryReportToolbar
          filters={filters}
          selectedRows={selectedRows}
          loading={loading}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
          onResetFilters={handleResetFilters}
          onDeleteSelected={handleBulkDelete}
        />
      </Box>

      {/*================================================
          Statistics
      =================================================*/}

      <Box sx={{ mb: 2 }}>
        <InventoryReportStatistics
          reports={filteredReports}
          loading={loading}
        />
      </Box>

      {/*================================================
          Table / Loading
      =================================================*/}

      {loading && reports.length === 0 ? (

        <Box
          sx={{
            minHeight: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>

      ) : (

        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >

          <InventoryReportTable
            reports={paginatedReports}
            selectedRows={selectedRows}
            loading={loading}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectionChange={
              handleSelectionChange
            }
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActivate={handleActivate}
            onDeactivate={
              handleDeactivate
            }
          />

        </Box>
      )}

      {/*================================================
          Mobile Cards
      =================================================*/}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          mt: 2,
        }}
      >

        {paginatedReports.map(
          (report) => (

            <InventoryReportCard
              key={
                report?.id ??
                report?.reportId ??
                report?.inventoryReportId
              }
              report={report}
              selected={
                selectedRows.some(
                  (row) =>
                    String(
                      row?.id ??
                      row?.reportId ??
                      row?.inventoryReportId
                    ) ===
                    String(
                      report?.id ??
                      report?.reportId ??
                      report?.inventoryReportId
                    )
                )
              }
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
              onDeactivate={
                handleDeactivate
              }
            />

          )
        )}

      </Box>

      {/*================================================
          Pagination
      =================================================*/}

      <Box sx={{ mt: 2 }}>
        <InventoryReportPagination
          page={page}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRowsPerPageChange={
            handleRowsPerPageChange
          }
          loading={loading}
        />
      </Box>

      {/*================================================
          Modal
      =================================================*/}

      <InventoryReportModal
        open={modalOpen}
        mode={modalMode}
        report={selectedReport}
        loading={loading}
        error={error}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReport}
      />

      {/*================================================
          View
      =================================================*/}

      <InventoryReportView
        open={viewOpen}
        report={viewReport}
        onClose={handleCloseView}
      />

      {/*================================================
          Snackbar
      =================================================*/}

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={
          handleNotificationClose
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={
            notification.severity
          }
          onClose={
            handleNotificationClose
          }
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

InventoryReportList.propTypes = {};

//======================================================
// Default Props
//======================================================

InventoryReportList.defaultProps = {};

//======================================================
// Export
//======================================================

export default InventoryReportList;