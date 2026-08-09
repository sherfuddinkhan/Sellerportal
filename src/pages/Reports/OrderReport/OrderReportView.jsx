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

import OrderReportToolbar from "./OrderReportToolbar";
import OrderReportStatistics from "./OrderReportStatistics";
import OrderReportSearch from "./OrderReportSearch";
import OrderReportFilter from "./OrderReportFilter";
import OrderReportTable from "./OrderReportTable";
import OrderReportPagination from "./OrderReportPagination";
import OrderReportModal from "./OrderReportModal";
import OrderReportExport from "./OrderReportExport";

import {
  getOrderReports,
  getOrderReportStatistics,
  getOrderStatuses,
  getOrderChannels,
} from "./OrderReportService";

import {
  filterOrderReports,
  searchOrderReports,
  sortOrderReports,
  calculateOrderStatistics,
} from "./OrderReportHelpers";

//======================================================
// OrderReportView
//======================================================

const OrderReportView = ({
  initialFilters = {},
  initialPage = 1,
  initialPageSize = 10,
}) => {
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
      status: "",
      channel: "",
      paymentStatus: "",
      fulfillmentStatus: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      ...initialFilters,
    });

  //====================================================
  // Pagination
  //====================================================

  const [page, setPage] =
    useState(
      Number(initialPage) || 1
    );

  const [pageSize, setPageSize] =
    useState(
      Number(initialPageSize) || 10
    );

  //====================================================
  // Sorting
  //====================================================

  const [sortBy, setSortBy] =
    useState("orderDate");

  const [sortOrder, setSortOrder] =
    useState("desc");

  //====================================================
  // Modal
  //====================================================

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("view");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  //====================================================
  // Filter Options
  //====================================================

  const [statuses, setStatuses] =
    useState([]);

  const [channels, setChannels] =
    useState([]);

  //====================================================
  // Load Order Reports
  //====================================================

  const loadOrderReports =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getOrderReports();

        const data =
          response?.reports ??
          response?.data ??
          response?.items ??
          response?.results ??
          [];

        setReports(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (loadError) {
        console.error(
          "OrderReportView load error:",
          loadError
        );

        setError(
          loadError?.response?.data
            ?.message ??
            loadError?.message ??
            "Unable to load order reports."
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
          statusData,
          channelData,
        ] = await Promise.all([
          getOrderStatuses(),
          getOrderChannels(),
        ]);

        setStatuses(
          Array.isArray(statusData)
            ? statusData
            : []
        );

        setChannels(
          Array.isArray(channelData)
            ? channelData
            : []
        );
      } catch (optionError) {
        console.warn(
          "Unable to load order report filter options:",
          optionError
        );
      }
    }, []);

  //====================================================
  // Initial Data Load
  //====================================================

  useEffect(() => {
    loadOrderReports();
    loadFilterOptions();
  }, [
    loadOrderReports,
    loadFilterOptions,
  ]);

  //====================================================
  // Process Reports
  //====================================================

  const processedReports =
    useMemo(() => {
      let result =
        filterOrderReports(
          reports,
          filters
        );

      result =
        searchOrderReports(
          result,
          searchTerm
        );

      result =
        sortOrderReports(
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
  // Statistics
  //====================================================

  const statistics =
    useMemo(
      () =>
        calculateOrderStatistics(
          processedReports
        ),
      [processedReports]
    );

  //====================================================
  // Pagination Calculation
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
  // Keep Current Page Valid
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
  // Paginated Data
  //====================================================

  const paginatedReports =
    useMemo(() => {
      const startIndex =
        (page - 1) *
        pageSize;

      return processedReports.slice(
        startIndex,
        startIndex + pageSize
      );
    }, [
      processedReports,
      page,
      pageSize,
    ]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
  //====================================================
  // Search Handler
  //====================================================

  const handleSearch =
    useCallback((value) => {
      setSearchTerm(
        value ?? ""
      );

      setPage(1);
    }, []);

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
      (nextFilters = {}) => {
        setFilters({
          status: "",
          channel: "",
          paymentStatus: "",
          fulfillmentStatus: "",
          dateFrom: "",
          dateTo: "",
          minAmount: "",
          maxAmount: "",
          ...nextFilters,
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
        status: "",
        channel: "",
        paymentStatus: "",
        fulfillmentStatus: "",
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
          Number(nextPageSize) || 10
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort =
    useCallback(
      (
        column,
        direction = "desc"
      ) => {
        setSortBy(
          column || "orderDate"
        );

        setSortOrder(
          direction
        );

        setPage(1);
      },
      []
    );

  //====================================================
  // View Order
  //====================================================

  const handleView =
    useCallback((order) => {
      setSelectedOrder(
        order
      );

      setModalMode("view");
      setModalOpen(true);
    }, []);

  //====================================================
  // Edit Order
  //====================================================

  const handleEdit =
    useCallback((order) => {
      setSelectedOrder(
        order
      );

      setModalMode("edit");
      setModalOpen(true);
    }, []);

  //====================================================
  // Create Order
  //====================================================

  const handleAdd =
    useCallback(() => {
      setSelectedOrder(null);

      setModalMode("create");
      setModalOpen(true);
    }, []);

  //====================================================
  // Close Modal
  //====================================================

  const handleCloseModal =
    useCallback(() => {
      setModalOpen(false);
      setSelectedOrder(null);
    }, []);

  //====================================================
  // Saved
  //====================================================

  const handleSaved =
    useCallback(async () => {
      await loadOrderReports();

      setModalOpen(false);
      setSelectedOrder(null);
    }, [
      loadOrderReports,
    ]);

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh =
    useCallback(async () => {
      await loadOrderReports();
    }, [
      loadOrderReports,
    ]);

  //====================================================
  // Export
  //====================================================

  const handleExport =
    useCallback(
      ({
        format,
        data,
      }) => {
        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {
          setError(
            "There are no order records to export."
          );

          return;
        }

        if (
          format !== "csv"
        ) {
          setError(
            `${format?.toUpperCase() || "This"} export is not configured yet.`
          );

          return;
        }

        try {
          const headers =
            Object.keys(
              data[0]
            );

          const escapeCsvValue =
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

          const csvRows = [
            headers
              .map(
                escapeCsvValue
              )
              .join(","),
          ];

          data.forEach(
            (row) => {
              csvRows.push(
                headers
                  .map(
                    (header) =>
                      escapeCsvValue(
                        row[
                          header
                        ]
                      )
                  )
                  .join(",")
              );
            }
          );

          const blob =
            new Blob(
              [csvRows.join("\n")],
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
            "order-report.csv";

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
        } catch (exportError) {
          console.error(
            "Order report export error:",
            exportError
          );

          setError(
            "Unable to export order report."
          );
        }
      },
      []
    );

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="order-report-view"
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
            Error Message
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

        <OrderReportToolbar
          loading={loading}
          onAdd={handleAdd}
          onRefresh={
            handleRefresh
          }
        />

        {/*================================================
            Statistics
        =================================================*/}

        <OrderReportStatistics
          statistics={
            statistics
          }
          loading={loading}
        />

        {/*================================================
            Search
        =================================================*/}

        <OrderReportSearch
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

        <OrderReportFilter
          filters={filters}
          statuses={statuses}
          channels={channels}
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
          sx={{
            display: "flex",
            justifyContent:
              "flex-end",
          }}
        >
          <OrderReportExport
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
            Order Report Table
        =================================================*/}

        {loading ? (
          <Box
            className="order-report-loading"
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <OrderReportTable
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
            onSort={
              handleSort
            }
          />
        )}

        {/*================================================
            Pagination
        =================================================*/}

        <OrderReportPagination
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

        <OrderReportModal
          open={modalOpen}
          mode={modalMode}
          order={
            selectedOrder
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

OrderReportView.propTypes = {
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

OrderReportView.defaultProps = {
  initialFilters: {},

  initialPage: 1,

  initialPageSize: 10,
};

//======================================================
// Export
//======================================================

export default OrderReportView;

