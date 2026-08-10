import React, { useCallback,useEffect,useMemo,useState} from "react";
import PropTypes from "prop-types";
import {Alert,Box,CircularProgress,Paper,Snackbar,Stack,Typography} from "@mui/material";
import LowStockReportSearch from "./LowStockReportSearch";
import LowStockReportToolbar from "./LowStockReportToolbar";
import LowStockReportStatistics from "./LowStockReportStatistics";
import LowStockReportFilter from "./LowStockReportFilter";
import LowStockReportExport from "./LowStockReportExport";
import LowStockReportModal from "./LowStockReportModal";
import LowStockReportPagination from "./LowStockReportPagination";
import LowStockReportCard from "./LowStockReportCard";
import LowStockReportTable from "./LowStockReportTable";
import {getLowStockReports,deleteLowStockReport,deleteLowStockReports,getLowStockReportStatistics} from "./LowStockReportService";

//======================================================
// LowStockReportList
//======================================================

const LowStockReportList = ({
  initialFilters = {},
  pageSize: initialPageSize = 10,
  viewMode: initialViewMode = "table",
}) => {

  //====================================================
  // State
  //====================================================

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
      search: "",
      status: "Low",
      category: "",
      warehouse: "",
      supplier: "",
      dateFrom: "",
      dateTo: "",
      minStock: "",
      maxStock: "",
      ...initialFilters,
    });

  const [appliedFilters, setAppliedFilters] =
    useState({
      search: "",
      status: "Low",
      category: "",
      warehouse: "",
      supplier: "",
      dateFrom: "",
      dateTo: "",
      minStock: "",
      maxStock: "",
      ...initialFilters,
    });

  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [statistics, setStatistics] =
    useState({
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalStock: 0,
      totalReorderQuantity: 0,
    });
  const [modal, setModal] =
    useState({
      open: false,
      mode: "",
      report: null,
    });

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Load Reports
  //====================================================

  const loadReports = useCallback(
    async () => {
      setLoading(true);
      setError("");
      try {
        const response =  await getLowStockReports({
            ...appliedFilters,
            page,
            pageSize,
          });

        const responseData = response?.data ?? response ?? {};
        const reportData = Array.isArray(responseData) ? responseData : responseData?.reports ?? responseData?.items ?? responseData?.data ?? [];
        const total = Number( responseData?.totalRecords ??  responseData?.total ?? responseData?.count ?? reportData.length);
        setReports( Array.isArray(reportData) ? reportData : [] );
        setTotalRecords( Number.isFinite(total) ? total : 0 );
      } catch (err) {
        console.error( "Failed to load low stock reports:",err);
        setReports([]);
        setTotalRecords(0);
        setError( err?.response?.data?.message ?? err?.message ?? "Failed to load low stock reports.");
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters,page,pageSize]
  );

  //====================================================
  // Load Statistics
  //====================================================

  const loadStatistics =
    useCallback(
      async () => {
        setStatisticsLoading(
          true
        );

        try {
          const response =
            await getLowStockReportStatistics(appliedFilters);
          const responseData =response?.data ??response ??{};
          const statisticsData = responseData?.statistics ?? responseData?.data ??  responseData ?? {};
          setStatistics({
            totalProducts: Number( statisticsData?.totalProducts ?? statisticsData?.totalItems ??statisticsData?.total ?? 0 ),
            lowStockProducts: Number( statisticsData?.lowStockProducts ?? statisticsData?.lowStock ?? 0 ),
            outOfStockProducts: Number( statisticsData?.outOfStockProducts ?? statisticsData?.outOfStock ?? 0 ),
            totalStock: Number( statisticsData?.totalStock ?? statisticsData?.totalQuantity ?? 0),
            totalReorderQuantity: Number( statisticsData?.totalReorderQuantity ?? statisticsData?.reorderQuantity ?? statisticsData?.reorderQty ?? 0),
          });
        } catch (err) {
          console.error("Failed to load low stock statistics:",err);
          /*
           * Statistics failure should not
           * prevent the report table from
           * being displayed.
           */
        } finally {
          setStatisticsLoading(false);
        }
      },
      [appliedFilters]
    );

  //====================================================
  // Initial / Filtered Data Load
  //====================================================

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  //====================================================
  // Apply Filters
  //====================================================

  const handleApplyFilters =
    useCallback(
      (nextFilters = filters) => {
        setAppliedFilters({
          ...nextFilters,
        });
        setPage(1);
        setSelectedRows([]);
      },[filters]
    );

  //====================================================
  // Filter Change
  //====================================================

  const handleFilterChange =
    useCallback(
      (nextFilters) => {
        setFilters(
          (previous) => ({
            ...previous,
            ...(nextFilters ?? {}),
          })
        );
      },
      []
    );

  //====================================================
  // Reset Filters
  //====================================================

  const handleResetFilters =
    useCallback(() => {
      const resetFilters = {
        search: "",
        status: "Low",
        category: "",
        warehouse: "",
        supplier: "",
        dateFrom: "",
        dateTo: "",
        minStock: "",
        maxStock: "",
      };
      setFilters(resetFilters);
      setAppliedFilters(resetFilters);
      setPage(1);
      setSelectedRows([]);
    }, []);

  //====================================================
  // Search
  //====================================================

  const handleSearch =
    useCallback(
      (searchValue) => {
        const nextFilters = {
          ...filters,
          search:
            searchValue ?? "",
        };
        setFilters(nextFilters);
        setAppliedFilters(nextFilters);
        setPage(1);
        setSelectedRows([]);
      },
      [filters]
    );

  //====================================================
  // Select Single Row
  //====================================================

  const handleSelectRow =
    useCallback(
      (id) => {
        setSelectedRows(
          (previous) => {
            if (previous.includes(id)) {
              return previous.filter(
                (item) =>
                  item !== id
              );
            }

            return [
              ...previous,
              id,
            ];
          }
        );
      },
      []
    );

  //====================================================
  // Select All
  //====================================================

  const handleSelectAll =
    useCallback(
      (
        checked,
        rows = reports
      ) => {
        if (!checked) {
          setSelectedRows([]);
          return;
        }

        const ids = (Array.isArray(rows)? rows : [])
          .map((row) => row?.id ??  row?.reportId ?? row?.inventoryId)
      .filter( (id) => id !== undefined && id !== null && id !== "");
        setSelectedRows(ids);
      },
      [reports]
    );

  //====================================================
  // View Report
  //====================================================

  const handleView =
    useCallback(
      (report) => {
        setModal({
          open: true,
          mode: "view",
          report,
        });
      },
      []
    );

  //====================================================
  // Edit Report
  //====================================================

  const handleEdit =
    useCallback(
      (report) => {
        setModal({
          open: true,
          mode: "edit",
          report,
        });
      },
      []
    );

  //====================================================
  // Delete Confirmation
  //====================================================

  const handleDelete =
    useCallback(
      (report) => {
        setModal({
          open: true,
          mode: "delete",
          report,
        });
      },
      []
    );

  //====================================================
  // Close Modal
  //====================================================

  const handleCloseModal =
    useCallback(() => {
      setModal({
        open: false,
        mode: "",
        report: null,
      });
    }, []);
    //====================================================
  // Confirm Delete
  //====================================================

  const handleConfirmDelete =
    useCallback(
      async () => {
        const report =
          modal?.report;

        if (!report) {
          return;
        }

        const id = report?.id ?? report?.reportId ?? report?.inventoryId;
        if ( id === undefined || id === null || id === "") {
          setError("Unable to delete report: report ID is missing.");
          handleCloseModal();
          return;
        }
        setLoading(true);
        setError("");
        try {
          await deleteLowStockReport(id);
          setSuccess("Low stock report deleted successfully.");
          setSelectedRows(
            (previous) =>
              previous.filter(
                (item) =>
                  item !== id
              )
          );
          handleCloseModal();
          await loadReports();
          await loadStatistics();
        } catch (err) {
          console.error("Failed to delete low stock report:",err);
          setError(err?.response?.data?.message ??err?.message ?? "Failed to delete low stock report.");
        } finally {
          setLoading(false);
        }
      },
      [modal,handleCloseModal,loadReports,loadStatistics]
    );

  //====================================================
  // Delete Selected Reports
  //====================================================

  const handleDeleteSelected =
    useCallback(
      async () => {
        if (
          selectedRows.length === 0
        ) {
          setError(
            "Please select at least one report."
          );

          return;
        }

        setLoading(true);
        setError("");

        try {
          await deleteLowStockReports(selectedRows);
          setSuccess(
            `${selectedRows.length} report${
              selectedRows.length > 1
                ? "s"
                : ""
            } deleted successfully.`
          );

          setSelectedRows([]);

          await loadReports();
          await loadStatistics();
        } catch (err) {
          console.error(
            "Failed to delete selected reports:",
            err
          );

          setError(
            err?.response?.data?.message ??
            err?.message ??
            "Failed to delete selected reports."
          );
        } finally {
          setLoading(false);
        }
      },
      [selectedRows,loadReports,loadStatistics,]
    );

  //====================================================
  // Pagination
  //====================================================

  const handlePageChange =
    useCallback(
      (nextPage) => {
        const numericPage =
          Number(nextPage);
        if (
          !Number.isFinite(
            numericPage
          ) ||
          numericPage < 1
        ) {
          return;
        }

        setPage(
          Math.floor(
            numericPage
          )
        );

        setSelectedRows([]);
      },
      []
    );

  //====================================================
  // Page Size
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (nextPageSize) => {
        const numericPageSize =
          Number(nextPageSize);

        if (
          !Number.isFinite(
            numericPageSize
          ) ||
          numericPageSize <= 0
        ) {
          return;
        }

        setPageSize(
          Math.floor(
            numericPageSize
          )
        );

        setPage(1);
        setSelectedRows([]);
      },
      []
    );

  //====================================================
  // View Mode
  //====================================================

  const handleViewModeChange =
    useCallback(
      (nextMode) => {
        if (
          nextMode !== "table" &&
          nextMode !== "card"
        ) {
          return;
        }

        setViewMode(
          nextMode
        );
      },
      []
    );

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    useCallback(async () => {
      setSelectedRows([]);
      await Promise.all([loadReports(),loadStatistics(),
      ]);
      setSuccess("Low stock report refreshed successfully.");
    }, [loadReports,loadStatistics,]);

  //====================================================
  // Close Snackbar
  //====================================================

  const handleCloseSnackbar =
    useCallback(() => {
      setSuccess("");
    }, []);

  //====================================================
  // Close Error
  //====================================================

  const handleCloseError =
    useCallback(() => {
      setError("");
    }, []);

  //====================================================
  // Pagination Calculations
  //====================================================

  const totalPages =
    useMemo(() => {
      if ( totalRecords <= 0 || pageSize <= 0) {
        return 1;
      }
      return Math.max(1, Math.ceil(totalRecords /pageSize));
    }, [totalRecords,pageSize]);

  //====================================================
  // Ensure Valid Page
  //====================================================

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page,totalPages]);

  //====================================================
  // Export Data
  //====================================================

  const exportData =
    useMemo(
      () =>
        Array.isArray(reports) ? reports : [], [reports]
    );

  //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="low-stock-report"
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
          Header
      =================================================*/}
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        spacing={2}
        sx={{
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            className="low-stock-report-title"
          >
            Low Stock Report
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            className="low-stock-report-subtitle"
          >
            Monitor products that are
            below their required stock
            levels.
          </Typography>
        </Box>
      </Stack>

      {/*================================================
          Toolbar
      =================================================*/}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <LowStockReportToolbar
          selectedCount={
            selectedRows.length
          }
          viewMode={viewMode}
          onViewModeChange={
            handleViewModeChange
          }
          onRefresh={
            handleRefresh
          }
          onDeleteSelected={
            handleDeleteSelected
          }
          loading={loading}
        />
      </Paper>

      {/*================================================
          Search
      =================================================*/}

      <LowStockReportSearch
        value={
          filters.search
        }
        onChange={
          handleSearch
        }
        onSearch={
          handleSearch
        }
        loading={loading}
      />

      {/*================================================
          Filter
      =================================================*/}

      <LowStockReportFilter
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

      {/*================================================
          Statistics
      =================================================*/}

      <LowStockReportStatistics
        statistics={
          statistics
        }
        loading={
          statisticsLoading
        }
      />

      {/*================================================
          Export
      =================================================*/}

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          mb: 2,
        }}
      >
        <LowStockReportExport
          reports={
            exportData
          }
          selectedRows={
            selectedRows
          }
          loading={
            loading
          }
        />
      </Stack>

      {/*================================================
          Error
      =================================================*/}

      {error && (
        <Alert
          severity="error"
          onClose={
            handleCloseError
          }
          sx={{
            mb: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/*================================================
          Report Content
      =================================================*/}

      {loading ? (
        <Paper
          elevation={0}
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Stack
            spacing={1.5}
            alignItems="center"
          >
            <CircularProgress
              size={32}
            />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading low stock
              reports...
            </Typography>
          </Stack>
        </Paper>
      ) : viewMode ===
        "card" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {reports.length ===
          0 ? (
            <Paper
              elevation={0}
              sx={{
                gridColumn:
                  "1 / -1",
              }}
            >
              <Box
                className="low-stock-report-empty"
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  No Low Stock Reports
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No products currently
                  match the selected
                  criteria.
                </Typography>
              </Box>
            </Paper>
          ) : (
            reports.map(
              (report) => (
                <LowStockReportCard
                  key={
                    report?.id ??
                    report?.reportId ??
                    report?.inventoryId
                  }
                  report={
                    report
                  }
                  onView={
                    handleView
                  }
                  onEdit={
                    handleEdit
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )
          )}
        </Box>
      ) : (
        <LowStockReportTable
          reports={
            reports
          }
          selectedRows={
            selectedRows
          }
          loading={
            loading
          }
          onSelectRow={
            handleSelectRow
          }
          onSelectAll={
            handleSelectAll
          }
          onView={
            handleView
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
        />
      )}

      {/*================================================
          Pagination
      =================================================*/}

      <LowStockReportPagination
        page={page}
        pageSize={
          pageSize
        }
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
        loading={
          loading
        }
      />

      {/*================================================
          Modal
      =================================================*/}

      <LowStockReportModal
        open={
          modal.open
        }
        mode={
          modal.mode
        }
        report={
          modal.report
        }
        onClose={
          handleCloseModal
        }
        onConfirmDelete={
          handleConfirmDelete
        }
        onSaved={
          async () => {
            handleCloseModal();
            await loadReports();
            await loadStatistics();
          }
        }
      />

      {/*================================================
          Success Snackbar
      =================================================*/}

      <Snackbar
        open={
          Boolean(success)
        }
        autoHideDuration={
          4000
        }
        onClose={
          handleCloseSnackbar
        }
        message={
          success
        }
      />
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

LowStockReportList.propTypes = {
  initialFilters:
    PropTypes.object,

  pageSize:
    PropTypes.number,

  viewMode:
    PropTypes.oneOf([
      "table",
      "card",
    ]),
};

//======================================================
// Default Props
//======================================================

LowStockReportList.defaultProps = {
  initialFilters: {},

  pageSize: 10,

  viewMode: "table",
};

//======================================================
// Export
//======================================================

export default LowStockReportList;