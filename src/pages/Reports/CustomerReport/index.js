//======================================================
// Customer Report Module
//======================================================

// Main List
export { default as CustomerReportList }
  from "./CustomerReportList";

// Search
export { default as CustomerReportSearch }
  from "./CustomerReportSearch";

// Table
export { default as CustomerReportTable }
  from "./CustomerReportTable";

// Pagination
export { default as CustomerReportPagination }
  from "./CustomerReportPagination";

// Card
export { default as CustomerReportCard }
  from "./CustomerReportCard";

// View
export { default as CustomerReportView }
  from "./CustomerReportView";

// Modal
export { default as CustomerReportModal }
  from "./CustomerReportModal";

// Statistics
export { default as CustomerReportStatistics }
  from "./CustomerReportStatistics";

// Toolbar
export { default as CustomerReportToolbar }
  from "./CustomerReportToolbar";

// Export
export { default as CustomerReportExport }
  from "./CustomerReportExport";

//======================================================
// Filter Utilities
//======================================================

export {
  DEFAULT_CUSTOMER_REPORT_FILTERS,
  CUSTOMER_STATUS_OPTIONS,
  CUSTOMER_MARKETPLACE_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,

  matchesCustomerSearch,
  matchesCustomerStatus,
  matchesCustomerMarketplace,
  matchesCustomerType,

  matchesDateFrom,
  matchesDateTo,

  filterCustomers,

  hasCustomerReportFilters,

  resetCustomerReportFilters,

  getCustomerReportFilterCount,
} from "./CustomerReportFilter";

//======================================================
// Helper Utilities
//======================================================

export {
  toNumber,
  toString,

  getCustomerName,
  getCustomerId,
  getCustomerEmail,
  getCustomerPhone,

  getCustomerMarketplace,
  getCustomerType,
  getCustomerStatus,

  getTotalOrders,
  getTotalSales,
  getTotalPaid,
  getOutstandingAmount,

  getCustomerDate,
  getLastOrderDate,

  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,

  normalizeCustomer,
  normalizeCustomers,

  getStatusColor,
  getStatusLabel,

  sortCustomers,

  calculateCustomerStatistics,

  customerToExportRow,
  customersToExportRows,
} from "./CustomerReportHelper";