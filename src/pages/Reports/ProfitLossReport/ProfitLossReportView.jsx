
import React, {useCallback,useEffect,useMemo,useState} from "react";
import {Add,Refresh} from "@mui/icons-material";
import {Alert,Box,Button,CircularProgress,Stack,Typography} from "@mui/material";
import ProfitLossReportCard from "./ProfitLossReportCard";
import ProfitLossReportList from "./ProfitLossReportList";
import ProfitLossReportTable from "./ProfitLossReportTable";
import ProfitLossReportToolbar from "./ProfitLossReportToolbar";
import ProfitLossReportStatistics from "./ProfitLossReportStatistics";
import ProfitLossReportSearch from "./ProfitLossReportSearch";
import ProfitLossReportFilter from "./ProfitLossReportFilter";
import ProfitLossReportPagination from "./ProfitLossReportPagination";
import ProfitLossReportModal from "./ProfitLossReportModal";
import ProfitLossReportExport from "./ProfitLossReportExport";
import {getProfitLossReports,getProfitLossReportSummary,deleteProfitLossReport} from "./ProfitLossReportService";
import {normalizeProfitLossReports,calculateProfitLossStatistics,filterProfitLossReports,searchProfitLossReports,sortProfitLossReports,paginateProfitLossReports} from "./ProfitLossReportHelpers";
import "./ProfitLossReport.css";

//======================================================
// ProfitLossReportView
//======================================================

const ProfitLossReportView = () => {
  //====================================================
  // Report Data
  //====================================================

  const [reports, setReports] =
    useState([]);

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
    useState({
      dateFrom: "",
      dateTo: "",
      marketplace: "",
      category: "",
      product: "",
      status: "",
      minRevenue: "",
      maxRevenue: "",
      minProfit: "",
      maxProfit: "",
    });

  //====================================================
  // Pagination
  //====================================================

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //====================================================
  // Sorting
  //====================================================

  const [sortField, setSortField] =  useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  //====================================================
  // Modal
  //====================================================

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedReport, setSelectedReport] = useState(null);

  //====================================================
  // Summary
  //====================================================

  const [summary, setSummary] = useState(null);

  //====================================================
  // Load Reports
  //====================================================

  const loadReports =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getProfitLossReports();

        const data =
          response?.items ??
          response?.data ??
          [];

        setReports(
          normalizeProfitLossReports(
            Array.isArray(data)
              ? data
              : []
          )
        );
      } catch (loadError) {
        console.error(
          "ProfitLossReportView load error:",
          loadError
        );

        setError(
          loadError?.message ||
            "Unable to load profit and loss reports."
        );

        setReports([]);
      } finally {
        setLoading(false);
      }
    }, []);

  //====================================================
  // Load Summary
  //====================================================

  const loadSummary =
    useCallback(async () => {
      try {
        const response =
          await getProfitLossReportSummary();

        setSummary(
          response?.data ??
            response
        );
      } catch (summaryError) {
        console.warn(
          "Profit and loss summary unavailable:",
          summaryError
        );

        setSummary(null);
      }
    }, []);

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {
    loadReports();
    loadSummary();
  }, [
    loadReports,
    loadSummary,
  ]);

  //====================================================
  // Search Reports
  //====================================================

  const searchedReports =
    useMemo(
      () =>
        searchProfitLossReports(
          reports,
          searchTerm
        ),
      [
        reports,
        searchTerm,
      ]
    );

  //====================================================
  // Apply Filters
  //====================================================

  const filteredReports =
    useMemo(
      () =>
        filterProfitLossReports(
          searchedReports,
          filters
        ),
      [
        searchedReports,
        filters,
      ]
    );

  //====================================================
  // Sort Reports
  //====================================================

  const sortedReports =
    useMemo(
      () =>
        sortProfitLossReports(
          filteredReports,
          sortField,
          sortDirection
        ),
      [
        filteredReports,
        sortField,
        sortDirection,
      ]
    );

  //====================================================
  // Pagination
  //====================================================

  const pagination =
    useMemo(
      () =>
        paginateProfitLossReports(
          sortedReports,
          page,
          pageSize
        ),
      [
        sortedReports,
        page,
        pageSize,
      ]
    );

  //====================================================
  // Visible Reports
  //====================================================

  const visibleReports =
    pagination.data;

  //====================================================
  // Statistics
  //====================================================

  const statistics =
    useMemo(
      () =>
        calculateProfitLossStatistics(
          filteredReports
        ),
      [filteredReports]
    );

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch =
    useCallback((value) => {
      setSearchTerm(
        typeof value ===
          "string"
          ? value
          : value?.target?.value ||
              ""
      );

      setPage(1);
    }, []);
  //====================================================
  // Filter Handler
  //====================================================

  const handleFilter =
    useCallback((nextFilters) => {
      setFilters({
        ...nextFilters,
      });

      setPage(1);
    }, []);

  //====================================================
  // Reset Filters
  //====================================================

  const handleResetFilters =
    useCallback(() => {
      setFilters({
        dateFrom: "",
        dateTo: "",
        marketplace: "",
        category: "",
        product: "",
        status: "",
        minRevenue: "",
        maxRevenue: "",
        minProfit: "",
        maxProfit: "",
      });

      setSearchTerm("");
      setPage(1);
    }, []);

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback((nextPage) => {
      setPage(
        Number(nextPage) || 1
      );
    }, []);

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback((nextPageSize) => {
      setPageSize(
        Number(nextPageSize) || 10
      );

      setPage(1);
    }, []);

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    useCallback(async () => {
      await loadReports();
      await loadSummary();
    }, [
      loadReports,
      loadSummary,
    ]);

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
  // View Report
  //====================================================

  const handleView =
    useCallback((report) => {
      setSelectedReport(report);
      setModalMode("view");
      setModalOpen(true);
    }, []);

  //====================================================
  // Edit Report
  //====================================================

  const handleEdit =
    useCallback((report) => {
      setSelectedReport(report);
      setModalMode("edit");
      setModalOpen(true);
    }, []);

  //====================================================
  // Delete Report
  //====================================================

  const handleDelete =
    useCallback(
      async (report) => {
        const reportId =
          report?.id ??
          report?.reportId ??
          report?.profitLossId ??
          report?.profitLossReportId;

        if (!reportId) {
          setError(
            "Profit and loss report ID is missing."
          );
          return;
        }

        const confirmed =
          window.confirm(
            `Delete profit and loss report ${
              report?.orderNumber ||
              report?.referenceNumber ||
              reportId
            }?`
          );

        if (!confirmed) {
          return;
        }

        setLoading(true);
        setError("");

        try {
          await deleteProfitLossReport(
            reportId
          );

          await loadReports();
          await loadSummary();
        } catch (deleteError) {
          console.error(
            "ProfitLossReport delete error:",
            deleteError
          );

          setError(
            deleteError?.message ||
              "Unable to delete profit and loss report."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        loadReports,
        loadSummary,
      ]
    );

  //====================================================
  // Modal Close
  //====================================================

  const handleModalClose =
    useCallback(() => {
      setModalOpen(false);
      setSelectedReport(null);
    }, []);

  //====================================================
  // Modal Saved
  //====================================================

  const handleModalSaved =
    useCallback(async () => {
      setModalOpen(false);
      setSelectedReport(null);

      await loadReports();
      await loadSummary();
    }, [
      loadReports,
      loadSummary,
    ]);

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort =
    useCallback(
      (
        field,
        direction
      ) => {
        setSortField(
          field || "date"
        );

        setSortDirection(
          direction || "desc"
        );
      },
      []
    );

  //====================================================
  // Marketplace Options
  //====================================================

  const marketplaceOptions =
    useMemo(() => {
      const values =
        reports
          .map(
            (report) =>
              report.marketplace
          )
          .filter(Boolean);

      return [
        ...new Set(values),
      ];
    }, [reports]);

  //====================================================
  // Category Options
  //====================================================

  const categoryOptions =
    useMemo(() => {
      const values =
        reports
          .map(
            (report) =>
              report.category
          )
          .filter(Boolean);

      return [
        ...new Set(values),
      ];
    }, [reports]);

  //====================================================
  // Status Options
  //====================================================

  const statusOptions =
    useMemo(() => {
      const values =
        reports
          .map(
            (report) =>
              report.status
          )
          .filter(Boolean);

      return [
        ...new Set(values),
      ];
    }, [reports]);

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="profit-loss-report-view"
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
      }}
    >
      <Stack spacing={2.5}>
        {/*================================================
            Header
        =================================================*/}

        <Box
          className="profit-loss-report-header"
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Profit & Loss Report
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Monitor revenue, costs,
              expenses, profit, and
              profitability margins.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
          >
            <Button
              variant="outlined"
              startIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                  />
                ) : (
                  <Refresh />
                )
              }
              onClick={
                handleRefresh
              }
              disabled={loading}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
            >
              Add Report
            </Button>
          </Stack>
        </Box>

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
            Statistics
        =================================================*/}

        <ProfitLossReportStatistics
          statistics={
            summary || statistics
          }
          loading={loading}
        />

        {/*================================================
            Toolbar
        =================================================*/}

        <ProfitLossReportToolbar
          onAdd={handleAdd}
          onRefresh={
            handleRefresh
          }
          loading={loading}
        />

        {/*================================================
            Search
        =================================================*/}

        <ProfitLossReportSearch
          value={searchTerm}
          onSearch={
            handleSearch
          }
          loading={loading}
        />

        {/*================================================
            Filter
        =================================================*/}

        <ProfitLossReportFilter
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
            handleFilter
          }
          onReset={
            handleResetFilters
          }
        />

        {/*================================================
            Export
        =================================================*/}

        <Box
          className="profit-loss-report-export"
          sx={{
            display: "flex",
            justifyContent:
              "flex-end",
          }}
        >
          <ProfitLossReportExport
            reports={
              filteredReports
            }
            filters={filters}
            loading={loading}
          />
        </Box>

        {/*================================================
            Table
        =================================================*/}

        <ProfitLossReportTable
          reports={
            visibleReports
          }
          data={
            visibleReports
          }
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={handleSort}
          sortField={
            sortField
          }
          sortDirection={
            sortDirection
          }
        />

        {/*================================================
            List
        =================================================*/}

        <ProfitLossReportList
          reports={
            visibleReports
          }
          data={
            visibleReports
          }
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/*================================================
            Cards
        =================================================*/}

        <ProfitLossReportCard
          reports={
            visibleReports
          }
          data={
            visibleReports
          }
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/*================================================
            Pagination
        =================================================*/}

        <ProfitLossReportPagination
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
            Modal
        =================================================*/}

        <ProfitLossReportModal
          open={modalOpen}
          mode={modalMode}
          report={selectedReport}
          onClose={
            handleModalClose
          }
          onSaved={
            handleModalSaved
          }
        />
      </Stack>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default ProfitLossReportView;


