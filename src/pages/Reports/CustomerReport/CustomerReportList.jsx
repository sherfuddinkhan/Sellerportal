import React, {useCallback,useEffect,useMemo,useState,} from "react";
import {DEFAULT_CUSTOMER_REPORT_FILTERS,filterCustomers,resetCustomerReportFilters,getCustomerReportFilterCount,} from "./CustomerReportFilter";
import {normalizeCustomers,calculateCustomerStatistics,sortCustomers,} from "./CustomerReportHelpers";
import {Alert,Box,CircularProgress,Snackbar} from "@mui/material";

//======================================================
// Customer Report Components
//======================================================

import CustomerReportToolbar from "./CustomerReportToolbar";
import CustomerReportStatistics from "./CustomerReportStatistics";
import CustomerReportSearch from "./CustomerReportSearch";
import CustomerReportTable from "./CustomerReportTable";
import CustomerReportPagination from "./CustomerReportPagination";
import CustomerReportView from "./CustomerReportView";
import CustomerReportModal from "./CustomerReportModal";

//======================================================
// Service
//======================================================

import CustomerReportService from "./CustomerReportService";

//======================================================
// CSS
//======================================================

import "./CustomerReport.css";

//======================================================
// CustomerReportList Component
//======================================================

const CustomerReportList = () => {
  //====================================================
  // Customer Report Data
  //====================================================
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  //====================================================
  // Pagination
  //====================================================
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  //====================================================
  // Selected Customers
  //====================================================
  const [selectedRows, setSelectedRows] =useState([]);
  //====================================================
  // Search / Filters
  //====================================================
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    marketplace: "All",
    customerType: "All",
    dateFrom: "",
    dateTo: "",
  });
  //====================================================
  // Statistics
  //====================================================
  const [statistics, setStatistics] =
    useState({
      totalCustomers: 0,
      activeCustomers: 0,
      inactiveCustomers: 0,
      totalOrders: 0,
      totalSales: 0,
      totalPaid: 0,
      totalOutstanding: 0,
      averageOrderValue: 0,
    });

  //====================================================
  // Customer View
  //====================================================
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  //====================================================
  // Customer Modal
  //====================================================
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  //====================================================
  // Snackbar
  //====================================================
  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });
   //====================================================
  // Filter Change Handler
  //====================================================

  const handleFilterChange = useCallback(
    (name, value) => {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Reset pagination when filters change
      setPage(1);
    },
    []
  );

  //====================================================
  // Search Handler
  //====================================================
  const handleSearch = useCallback(
    (searchFilters = filters) => {
      setFilters(searchFilters);
      setPage(1);
    },
    [filters]
  );

  //====================================================
  // Clear Filters
  //====================================================

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "All",
      marketplace: "All",
      customerType: "All",
      dateFrom: "",
      dateTo: "",
    });
    setPage(1);
  }, []);
  //====================================================
  // Refresh
  //====================================================
  const handleRefresh = useCallback(() => {
    setPage((currentPage) => currentPage);
  }, []);
  //====================================================
  // Row Selection
  //====================================================
  const handleSelectionChange = useCallback(
    (selection) => {
      setSelectedRows(selection || []);
    },
    []
  );

  //====================================================
  // Page Change
  //====================================================
  const handlePageChange = useCallback(
    (newPage) => {
      setPage(newPage);
    },
    []
  );
  //====================================================
  // Page Size Change
  //====================================================
  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      setPageSize(newPageSize);
      setPage(1);
    },
    []
  );
  //====================================================
  // View Customer
  //====================================================
  const handleViewCustomer = useCallback(
    (customer) => {
      if (!customer) return;
      setSelectedCustomer(customer);
      setViewOpen(true);
    },
    []
  );
  //====================================================
  // Close Customer View
  //====================================================
  const handleCloseView = useCallback(() => {
    setSelectedCustomer(null);
    setViewOpen(false);
  }, []);
  //====================================================
  // Open Customer Modal
  //====================================================
  const handleOpenModal = useCallback(
    (customer, mode = "view") => {
      setSelectedCustomer(customer || null);
      setModalMode(mode);
      setModalOpen(true);
    },
    []
  );
  //====================================================
  // Close Customer Modal
  //====================================================
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalMode("view");
  }, []);
  //====================================================
  // Snackbar
  //====================================================
  const showSnackbar = useCallback(
    (message, severity = "success") => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );
  //====================================================
  // Close Snackbar
  //====================================================
  const handleCloseSnackbar = useCallback(
    () => {
      setSnackbar((prev) => ({
        ...prev,
        open: false,
      }));
    },
    []
  );
  //====================================================
  // Selected Customer IDs
  //====================================================
  const selectedCustomerIds = useMemo(
    () =>
      selectedRows.map((row) => {
        if ( typeof row === "object" && row !== null) 
          {
          return (
            row.customerId ??
            row.id
          );
        }

        return row;
      }),
    [selectedRows]
  );
  //====================================================
  // Filter Summary
  //====================================================
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim() !== "" ||
      filters.status !== "All" ||
      filters.marketplace !== "All" ||
      filters.customerType !== "All" ||
      filters.dateFrom !== "" ||
      filters.dateTo !== ""
    );
  }, [filters]);
    //====================================================
  // Load Customer Report
  //====================================================

  const loadCustomerReport = useCallback(
    async () => {
      try {
        setLoading(true);
        const response = await CustomerReportService.getCustomerReport({ page, pageSize,...filters,});
        // ---------------------------------------------
        // Normalize API response
        // ---------------------------------------------
        const responseData = response?.data ?? response ?? {};
        const rows = Array.isArray(responseData)  ? responseData : ( responseData.items ?? responseData.customers ?? responseData.data ??[]);
        setCustomers(rows);
        // ---------------------------------------------
        // Total Records
        // ---------------------------------------------
        const total = responseData.totalItems ?? responseData.totalCount ?? responseData.total ?? rows.length;
        setTotalItems(Number(total) || 0);
      } catch (error) {
        console.error("Customer report loading error:",error);
        setCustomers([]);
        setTotalItems(0);
        showSnackbar("Unable to load customer report.","error");
      } finally {
        setLoading(false);
      }
    },
    [ page,pageSize,filters,showSnackbar,]
  );

  //====================================================
  // Calculate Statistics
  //====================================================

  const calculatedStatistics = useMemo(() => {
    const data = customers || [];
    const totalCustomers = data.length;
    const activeCustomers = data.filter( (customer) => customer.status === "Active").length;
    const inactiveCustomers = data.filter((customer) => customer.status === "Inactive").length;
    const totalOrders = data.reduce( (total, customer) => total + Number(customer.totalOrders ?? customer.orderCount ??0),0);
    const totalSales = data.reduce( (total, customer) => total + Number( customer.totalSales ?? customer.totalAmount ?? customer.salesAmount ?? 0),0);
    const totalPaid = data.reduce( (total, customer) => total + Number( customer.totalPaid ?? customer.paidAmount ?? 0),0);
    const totalOutstanding = data.reduce( (total, customer) => total + Number( customer.totalOutstanding ?? customer.outstandingAmount ?? customer.balance ?? 0 ),0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      totalOrders,
      totalSales,
      totalPaid,
      totalOutstanding,
      averageOrderValue,
    };
  }, [customers]);

  //====================================================
  // Update Statistics
  //====================================================

  useEffect(() => {
    setStatistics(calculatedStatistics);
  }, [calculatedStatistics]);
  //====================================================
  // Load Data
  //====================================================
  useEffect(() => {
    loadCustomerReport();
  }, [loadCustomerReport]);
  //====================================================
  // Customer Detail Refresh
  //====================================================
  const refreshCustomerReport = useCallback(
    async () => { await loadCustomerReport();},
    [loadCustomerReport]
  );
  //====================================================
  // Export Excel
  //====================================================
  const handleExportExcel = useCallback(
    async () => {
      try {
        setLoading(true);
        await CustomerReportService.exportExcel({
          ...filters,
        });
        showSnackbar("Customer report exported successfully.","success");
      } catch (error) {
        console.error("Excel export error:",error);
        showSnackbar("Unable to export customer report.","error");
      } finally {
        setLoading(false);
      }
    },
    [filters,showSnackbar,]
  );
  //====================================================
  // Export PDF
  //====================================================
  const handleExportPdf = useCallback(
    async () => {
      try {
        setLoading(true);
        await CustomerReportService.exportPdf({
          ...filters,
        });
        showSnackbar("Customer report exported as PDF.","success");
      } catch (error) {
        console.error("PDF export error:",error);
        showSnackbar("Unable to export PDF.","error");
      } finally {
        setLoading(false);
      }
    },
    [ filters,showSnackbar]
  );
  //====================================================
  // Print Report
  //====================================================
  const handlePrint = useCallback(() => {
    window.print();
  }, []);
  //====================================================
  // Customer Action
  //====================================================
  const handleCustomerAction = useCallback(
    async (customer, action) => {
      if (!customer) return;
      const customerId = customer.customerId ?? customer.id;
      if (!customerId) {
        showSnackbar("Customer ID is missing.","error");
        return;
      }
      try {
        setLoading(true);
        if (action === "activate") {
          await CustomerReportService.activateCustomer(customerId);
          showSnackbar("Customer activated successfully.","success");
        }
        if (action === "deactivate") {
          await CustomerReportService.deactivateCustomer(customerId);
          showSnackbar("Customer deactivated successfully.","success");
        }
        if (action === "delete") {
          await CustomerReportService.deleteCustomer(customerId);
          showSnackbar("Customer deleted successfully.","success");
        }
        setModalOpen(false);
        await loadCustomerReport();
      } catch (error) {
        console.error("Customer action error:",error);
        showSnackbar("Unable to complete customer action.","error");
      } finally {
        setLoading(false);
      }
    },
    [loadCustomerReport,showSnackbar,]
  );
  //====================================================
  // Bulk Customer Action
  //====================================================
  const handleBulkAction = useCallback(
    async (action) => {
      if (
        selectedCustomerIds.length === 0
      ) {
        showSnackbar("Please select at least one customer.", "warning");
        return;
      }
      try {
        setLoading(true);
        if (
          action === "activate"
        ) {
          await CustomerReportService.bulkActivate(selectedCustomerIds);
          showSnackbar("Selected customers activated.","success");
        }
        if (action === "deactivate") {
          await CustomerReportService.bulkDeactivate(selectedCustomerIds);
          showSnackbar("Selected customers deactivated.","success");
        }
        if (
          action === "delete"
        ) {
          await CustomerReportService.bulkDelete(selectedCustomerIds);
          showSnackbar("Selected customers deleted.","success");
        }
        setSelectedRows([]);
        await loadCustomerReport();
      } catch (error) {
        console.error("Bulk customer action error:",error);
        showSnackbar("Unable to complete bulk action.","error");
      } finally {
        setLoading(false);
      }
    },
    [ selectedCustomerIds,loadCustomerReport,showSnackbar]
  );
    //====================================================
  // Main JSX
  //====================================================
  return (
    <Box className="customer-report-page">
      {/*================================================
          Toolbar
      =================================================*/}
      <CustomerReportToolbar
        searchText={filters.search}
        selectedRows={selectedRows}
        loading={loading}
        onRefresh={refreshCustomerReport}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        onActivateSelected={() => handleBulkAction("activate")}
        onDeactivateSelected={() => handleBulkAction("deactivate")}
        onDeleteSelected={() => handleBulkAction("delete")}
      />
      {/*================================================
          Statistics
      =================================================*/}
      <CustomerReportStatistics
        statistics={statistics}
      />
      {/*================================================
          Search & Filters
      =================================================*/}
      <CustomerReportSearch
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />
      {/*================================================
          Report Content
      =================================================*/}
      {loading ? (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/*============================================
              Empty State
          ============================================*/}
          {customers.length === 0 ? (
            <Box
              sx={{
                minHeight: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Box>
                <Box
                  component="div"
                  sx={{
                    fontSize: 48,
                    mb: 1,
                  }}
                >
                </Box>
                <Box
                  component="div"
                  sx={{
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  No customers found
                </Box>
                <Box
                  component="div"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Try changing your search or filters.
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              {/*========================================
                  Customer Table
              ========================================*/}
              <CustomerReportTable
                rows={customers}
                loading={loading}
                selectedRows={selectedRows}
                onSelectionChange={handleSelectionChange}
                onView={handleViewCustomer}
                onEdit={(customer) =>handleOpenModal(customer,"edit")}
                onActivate={(customer) => handleCustomerAction(customer,"activate")}
                onDeactivate={(customer) =>handleCustomerAction(customer,"deactivate")}
                onDelete={(customer) =>handleOpenModal(customer,"delete")}
              />
              {/*========================================
                  Pagination
              ========================================*/}
              <CustomerReportPagination
                page={page}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </>
      )}
      {/*================================================
          Customer View
      =================================================*/}
      <CustomerReportView
        open={viewOpen}
        customer={selectedCustomer}
        onClose={handleCloseView}
        onEdit={(customer) => {
          handleCloseView();
          handleOpenModal(customer,"edit");
        }}
        onDelete={(customer) => {
          handleCloseView();
          handleOpenModal(customer,"delete");
        }}
      />
      {/*================================================
          Customer Modal
      =================================================*/}
      <CustomerReportModal
        open={modalOpen}
        mode={modalMode}
        customer={selectedCustomer}
        loading={loading}
        onClose={handleCloseModal}
        onSubmit={(data) => {
          if (
            modalMode === "delete"
          ) {
            handleCustomerAction(
              selectedCustomer,
              "delete"
            );
            return;
          }
          console.log("Customer Report Modal Submit:",data);
          handleCloseModal();
        }}
      />
      {/*================================================
          Snackbar
      =================================================*/}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleCloseSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerReportList;
