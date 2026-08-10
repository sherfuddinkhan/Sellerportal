
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
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import ReturnReportCard from "./ReturnReportCard";
import ReturnReportList from "./ReturnReportList";
import ReturnReportToolbar from "./ReturnReportToolbar";
import ReturnReportStatistics from "./ReturnReportStatistics";
import ReturnReportSearch from "./ReturnReportSearch";
import ReturnReportFilter from "./ReturnReportFilter";
import ReturnReportPagination from "./ReturnReportPagination";
import ReturnReportModal from "./ReturnReportModal";

import {
  getReturnReports,
  getReturnReportFilters,
  deleteReturnReport,
} from "./ReturnReportService";

import {
  calculateReturnReportStatistics,
  filterReturnReports,
  normalizeReturnReports,
  paginateReturnReports,
  sortReturnReports,
} from "./ReturnReportHelpers";

import "./ReturnReport.css";

//======================================================
// ReturnReportView
//======================================================

const ReturnReportView = () => {
  //====================================================
  // Data State
  //====================================================

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [initialLoading, setInitialLoading] =
    useState(true);

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
      category: "",
      status: "",
      reason: "",
      customer: "",
      startDate: "",
      endDate: "",
    });

  //====================================================
  // Filter Options
  //====================================================

  const [
    marketplaceOptions,
    setMarketplaceOptions,
  ] = useState([]);

  const [
    categoryOptions,
    setCategoryOptions,
  ] = useState([]);

  const [
    statusOptions,
    setStatusOptions,
  ] = useState([]);

  const [
    reasonOptions,
    setReasonOptions,
  ] = useState([]);

  //====================================================
  // Pagination State
  //====================================================

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

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

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("view");

  //====================================================
  // Notification State
  //====================================================

  const [notification, setNotification] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });

  //====================================================
  // Load Reports
  //====================================================

  const loadReports = useCallback(
    async () => {
      setLoading(true);

      try {
        const response =
          await getReturnReports();

        if (
          response?.success
        ) {
          setReports(
            normalizeReturnReports(
              response.reports || []
            )
          );
        } else {
          setReports([]);

          setNotification({
            open: true,
            severity: "error",
            message:
              response?.message ||
              "Unable to load return reports.",
          });
        }
      } catch (error) {
        setReports([]);

        setNotification({
          open: true,
          severity: "error",
          message:
            error?.message ||
            "Unable to load return reports.",
        });
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    []
  );

  //====================================================
  // Load Filter Options
  //====================================================

  const loadFilterOptions =
    useCallback(
      async () => {
        try {
          const response =
            await getReturnReportFilters();

          if (
            response?.success
          ) {
            setMarketplaceOptions(
              response.marketplaces ||
              []
            );

            setCategoryOptions(
              response.categories ||
              []
            );

            setStatusOptions(
              response.statuses ||
              []
            );

            setReasonOptions(
              response.reasons ||
              []
            );
          }
        } catch (error) {
          console.error(
            "Failed to load return report filters:",
            error
          );
        }
      },
      []
    );

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
  // Processed Reports
  //====================================================

  const processedReports = useMemo(() => {
    let result = filterReturnReports(
      reports,
      {
        ...filters,
        search,
      }
    );

    result = sortReturnReports(
      result,
      sortField,
      sortDirection
    );

    return result;
  }, [
    reports,
    filters,
    search,
    sortField,
    sortDirection,
  ]);

  //====================================================
  // Statistics
  //====================================================

  const statistics = useMemo(
    () =>
      calculateReturnReportStatistics(
        processedReports
      ),
    [processedReports]
  );

  //====================================================
  // Pagination
  //====================================================

  const pagination = useMemo(
    () =>
      paginateReturnReports(
        processedReports,
        page,
        pageSize
      ),
    [
      processedReports,
      page,
      pageSize,
    ]
  );

  //====================================================
  // Reset Page When Search/Filter Changes
  //====================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    filters,
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

  const handleApplyFilters =
    useCallback(
      (newFilters) => {
        setFilters({
          marketplace:
            newFilters?.marketplace ||
            "",

          category:
            newFilters?.category ||
            "",

          status:
            newFilters?.status ||
            "",

          reason:
            newFilters?.reason ||
            "",

          customer:
            newFilters?.customer ||
            "",

          startDate:
            newFilters?.startDate ||
            "",

          endDate:
            newFilters?.endDate ||
            "",
        });

        setPage(1);
      },
      []
    );

  //====================================================
  // Reset Filter Handler
  //====================================================

  const handleResetFilters =
    useCallback(() => {
      setFilters({
        marketplace: "",
        category: "",
        status: "",
        reason: "",
        customer: "",
        startDate: "",
        endDate: "",
      });

      setSearch("");
      setPage(1);
    }, []);

  //====================================================
  // Page Handler
  //====================================================

  const handlePageChange =
    useCallback(
      (newPage) => {
        setPage(newPage);
      },
      []
    );

  //====================================================
  // Page Size Handler
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (newPageSize) => {
        setPageSize(newPageSize);
        setPage(1);
      },
      []
    );

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort =
    useCallback(
      (field) => {
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
      },
      [sortField]
    );

  //====================================================
  // View Report
  //====================================================

  const handleViewReport =
    useCallback(
      (report) => {
        setSelectedReport(report);
        setModalMode("view");
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
        setSelectedReport(report);
        setModalMode("edit");
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

  //====================================================
  // Delete Report
  //====================================================

  const handleDeleteReport =
    useCallback(
      async (report) => {
        const id =
          report?.id ??
          report?.reportId ??
          report?.returnId;

        if (
          id === null ||
          id === undefined ||
          id === ""
        ) {
          setNotification({
            open: true,
            severity: "error",
            message:
              "Return report ID is missing.",
          });

          return;
        }

        setLoading(true);

        try {
          const response =
            await deleteReturnReport(
              id
            );

          if (
            response?.success
          ) {
            setReports(
              (previous) =>
                previous.filter(
                  (item) =>
                    String(
                      item?.id ??
                        item?.reportId ??
                        item?.returnId
                    ) !==
                    String(id)
                )
            );

            setNotification({
              open: true,
              severity: "success",
              message:
                response?.message ||
                "Return report deleted successfully.",
            });

            if (
              selectedReport &&
              String(
                selectedReport?.id ??
                  selectedReport?.reportId ??
                  selectedReport?.returnId
              ) === String(id)
            ) {
              handleCloseModal();
            }
          } else {
            setNotification({
              open: true,
              severity: "error",
              message:
                response?.message ||
                "Unable to delete return report.",
            });
          }
        } catch (error) {
          setNotification({
            open: true,
            severity: "error",
            message:
              error?.message ||
              "Unable to delete return report.",
          });
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
  // Notification Close
  //====================================================

  const handleNotificationClose =
    useCallback(() => {
      setNotification(
        (previous) => ({
          ...previous,
          open: false,
        })
      );
    }, []);
  //====================================================
  // Render
  //====================================================

  if (initialLoading) {
    return (
      <Box className="return-report">
        <Box className="return-report-loading">
          <Stack
            spacing={2}
            alignItems="center"
          >
            <CircularProgress />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading return reports...
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="return-report">
      {/*================================================
          Header
      =================================================*/}

      <Box className="return-report-header">
        <Box className="return-report-header-content">
          <Typography
            className="return-report-title"
            variant="h4"
          >
            Return Report
          </Typography>

          <Typography
            className="return-report-subtitle"
            variant="body2"
          >
            View, filter, search and manage
            returned orders and items.
          </Typography>
        </Box>
      </Box>

      {/*================================================
          Statistics
      =================================================*/}

      <ReturnReportStatistics
        statistics={statistics}
        loading={loading}
      />

      {/*================================================
          Toolbar
      =================================================*/}

      <ReturnReportToolbar
        loading={loading}
        totalRecords={
          processedReports.length
        }
        onRefresh={loadReports}
        onReset={handleResetFilters}
      />

      {/*================================================
          Search
      =================================================*/}

      <ReturnReportSearch
        value={search}
        loading={loading}
        onSearch={handleSearch}
      />

      {/*================================================
          Filters
      =================================================*/}

      <ReturnReportFilter
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
        reasons={reasonOptions}
        loading={loading}
        onApply={
          handleApplyFilters
        }
        onReset={
          handleResetFilters
        }
      />

      {/*================================================
          Report Content
      =================================================*/}

      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          overflow: "hidden",
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 2,
            }}
          >
            <CircularProgress
              size={24}
            />
          </Box>
        )}

        {processedReports.length ===
        0 ? (
          <Box className="return-report-empty">
            <Typography
              className="return-report-empty-title"
              variant="h6"
            >
              No Return Reports Found
            </Typography>

            <Typography
              className="return-report-empty-message"
              variant="body2"
              color="text.secondary"
            >
              No return records match the
              current search and filter
              criteria.
            </Typography>
          </Box>
        ) : (
          <ReturnReportList
            reports={
              pagination.data
            }
            loading={loading}
            sortField={sortField}
            sortDirection={
              sortDirection
            }
            onSort={handleSort}
            onView={handleViewReport}
            onEdit={handleEditReport}
            onDelete={
              handleDeleteReport
            }
          />
        )}
      </Paper>

      {/*================================================
          Pagination
      =================================================*/}

      <ReturnReportPagination
        page={pagination.page}
        pageSize={
          pagination.pageSize
        }
        totalRecords={
          pagination.totalRecords
        }
        totalPages={
          pagination.totalPages
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
          Details / Edit Modal
      =================================================*/}

      <ReturnReportModal
        open={modalOpen}
        report={selectedReport}
        mode={modalMode}
        loading={loading}
        onClose={handleCloseModal}
        onEdit={handleEditReport}
        onDelete={
          handleDeleteReport
        }
        onSave={async (
          updatedReport
        ) => {
          /*
           * Update handling can be connected
           * to updateReturnReport() from the
           * service when the edit workflow is
           * enabled.
           */

          setReports(
            (previous) =>
              previous.map(
                (item) => {
                  const itemId =
                    item?.id ??
                    item?.reportId ??
                    item?.returnId;

                  const selectedId =
                    selectedReport?.id ??
                    selectedReport?.reportId ??
                    selectedReport?.returnId;

                  if (
                    String(itemId) !==
                    String(selectedId)
                  ) {
                    return item;
                  }

                  return {
                    ...item,
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

          setNotification({
            open: true,
            severity: "success",
            message:
              "Return report updated successfully.",
          });
        }}
      />

      {/*================================================
          Notification
      =================================================*/}

      <Snackbar
        open={
          notification.open
        }
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
          variant="filled"
          onClose={
            handleNotificationClose
          }
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
// Export
//======================================================

export default ReturnReportView;


