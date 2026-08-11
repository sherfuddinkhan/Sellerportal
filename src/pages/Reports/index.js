//======================================================
// TaxReport/index.js
// Part 1A
//======================================================

//======================================================
// Main View
//======================================================

export { default as TaxReportView } from "./TaxReportView";

//======================================================
// Toolbar
//======================================================

export { default as TaxReportToolbar } from "./TaxReportToolbar";

//======================================================
// Search
//======================================================

export { default as TaxReportSearch } from "./TaxReportSearch";

//======================================================
// Filter
//======================================================

export { default as TaxReportFilter } from "./TaxReportFilter";

//======================================================
// List
//======================================================

export { default as TaxReportList } from "./TaxReportList";

//======================================================
// Table
//======================================================

export { default as TaxReportTable } from "./TaxReportTable";

//======================================================
// Statistics
//======================================================

export { default as TaxReportStatistics } from "./TaxReportStatistics";

//======================================================
// Chart
//======================================================

export { default as TaxReportChart } from "./TaxReportChart";

//======================================================
// Pagination
//======================================================

export { default as TaxReportPagination } from "./TaxReportPagination";

//======================================================
// Modal
//======================================================

export { default as TaxReportModal } from "./TaxReportModal";

//======================================================
// Export
//======================================================

export { default as TaxReportExport } from "./TaxReportExport";

//======================================================
// Service
//======================================================

export {
  getTaxReports,
  fetchTaxReports,
  getTaxReportById,
  createTaxReport,
  updateTaxReport,
  patchTaxReport,
  deleteTaxReport,
  getTaxReportSummary,
  getTaxReportStatistics,
  exportTaxReport,
} from "./TaxReportService";

//======================================================
// Helpers
//======================================================

export {
  toNumber,
  formatNumber,
  formatCurrency,
  formatDate,
  normalizeDateForInput,

  getReportDate,
  getInvoiceNumber,
  getPartyName,
  getGstin,

  getTaxableAmount,
  getCGST,
  getSGST,
  getIGST,
  getCess,

  calculateTotalTax,
  getInvoiceTotal,
  getStatus,
  getRemarks,

  normalizeTaxReport,
  normalizeTaxReports,

  searchTaxReports,
  isDateInRange,
  filterTaxReports,
  sortTaxReports,

  calculateTaxStatistics,
  paginateTaxReports,

  getTaxType,
  validateTaxFilters,

  convertTaxReportsToCsv,

  getTaxSummaryByType,
  getTaxSummaryByStatus,
  getTaxSummaryByParty,
  getTaxTypeStatistics,
  getMonthlyTaxSummary,
  getSortedMonthlyTaxSummary,
  getTopTaxParties,

  calculateTaxPercentage,
  getEffectiveTaxRate,

  validateTaxReport,
  isValidTaxReport,

  prepareTaxReports,
  preparePaginatedTaxReports,

  cloneTaxReport,
  cloneTaxReports,

  objectToArray,
} from "./TaxReportHelpers";

//======================================================
// Part 1A Ends Here
//======================================================