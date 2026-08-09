//======================================================
// LowStockReportHelper.js
//======================================================

//======================================================
// Get Report ID
//======================================================

export const getLowStockReportId = (
  report
) =>
  report?.id ??
  report?.reportId ??
  report?.inventoryId ??
  report?.inventoryID ??
  null;

//======================================================
// Get Product Name
//======================================================

export const getProductName = (
  report
) =>
  report?.productName ??
  report?.itemName ??
  report?.name ??
  "";

//======================================================
// Get Product Code / SKU
//======================================================

export const getProductCode = (
  report
) =>
  report?.productCode ??
  report?.itemCode ??
  report?.sku ??
  "";

//======================================================
// Get Category
//======================================================

export const getCategory = (
  report
) =>
  report?.categoryName ??
  report?.category ??
  "";

//======================================================
// Get Warehouse
//======================================================

export const getWarehouse = (
  report
) =>
  report?.warehouseName ??
  report?.warehouse ??
  "";

//======================================================
// Get Supplier
//======================================================

export const getSupplier = (
  report
) =>
  report?.supplierName ??
  report?.supplier ??
  "";

//======================================================
// Get Current Stock
//======================================================

export const getCurrentStock = (
  report
) =>
  Number(
    report?.currentStock ??
    report?.stockQuantity ??
    report?.quantity ??
    0
  ) || 0;

//======================================================
// Get Minimum Stock
//======================================================

export const getMinimumStock = (
  report
) =>
  Number(
    report?.minimumStock ??
    report?.minStock ??
    report?.reorderLevel ??
    0
  ) || 0;

//======================================================
// Get Reorder Quantity
//======================================================

export const getReorderQuantity = (
  report
) =>
  Number(
    report?.reorderQuantity ??
    report?.reorderQty ??
    0
  ) || 0;

//======================================================
// Get Unit
//======================================================

export const getUnit = (
  report
) =>
  report?.unit ??
  report?.uom ??
  "Units";

//======================================================
// Calculate Stock Status
//======================================================

export const getStockStatus = (
  report
) => {
  const currentStock =
    getCurrentStock(report);

  const minimumStock =
    getMinimumStock(report);

  if (currentStock <= 0) {
    return "Out of Stock";
  }

  if (
    currentStock <
    minimumStock
  ) {
    return "Low Stock";
  }

  return "Stock OK";
};

//======================================================
// Check Low Stock
//======================================================

export const isLowStock = (
  report
) =>
  getCurrentStock(report) > 0 &&
  getCurrentStock(report) <
    getMinimumStock(report);

//======================================================
// Check Out Of Stock
//======================================================

export const isOutOfStock = (
  report
) =>
  getCurrentStock(report) <= 0;

//======================================================
// Calculate Stock Difference
//======================================================

export const getStockDifference = (
  report
) =>
  getCurrentStock(report) -
  getMinimumStock(report);

//======================================================
// Calculate Shortage Quantity
//======================================================

export const getShortageQuantity = (
  report
) =>
  Math.max(
    0,
    getMinimumStock(report) -
      getCurrentStock(report)
  );

//======================================================
// Format Number
//======================================================

export const formatNumber = (
  value
) => {
  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return "0";
  }

  return numericValue.toLocaleString(
    "en-IN"
  );
};

//======================================================
// Format Date
//======================================================

export const formatDate = (
  value
) => {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-IN"
  );
};

//======================================================
// Normalize Report
//======================================================

export const normalizeLowStockReport = (
  report = {}
) => ({
  ...report,

  id:
    getLowStockReportId(
      report
    ),

  productName:
    getProductName(report),

  productCode:
    getProductCode(report),

  category:
    getCategory(report),

  warehouse:
    getWarehouse(report),

  supplierName:
    getSupplier(report),

  currentStock:
    getCurrentStock(report),

  minimumStock:
    getMinimumStock(report),

  reorderQuantity:
    getReorderQuantity(report),

  unit:
    getUnit(report),

  status:
    getStockStatus(report),

  shortageQuantity:
    getShortageQuantity(
      report
    ),
});

//======================================================
// Normalize Report List
//======================================================

export const normalizeLowStockReports = (
  reports = []
) =>
  Array.isArray(reports)
    ? reports.map(
        normalizeLowStockReport
      )
    : [];

//======================================================
// Calculate Statistics
//======================================================

export const calculateLowStockStatistics = (
  reports = []
) => {
  const list =
    normalizeLowStockReports(
      reports
    );

  return {
    totalProducts:
      list.length,

    lowStockProducts:
      list.filter(
        isLowStock
      ).length,

    outOfStockProducts:
      list.filter(
        isOutOfStock
      ).length,

    totalStock:
      list.reduce(
        (
          total,
          report
        ) =>
          total +
          getCurrentStock(
            report
          ),
        0
      ),

    totalReorderQuantity:
      list.reduce(
        (
          total,
          report
        ) =>
          total +
          getReorderQuantity(
            report
          ),
        0
      ),
  };
};

//======================================================
// Build Filter Object
//======================================================

export const buildLowStockFilters = (
  filters = {},
  search = ""
) => ({
  search:
    String(
      search ?? ""
    ).trim(),

  status:
    filters?.status ??
    "Low",

  category:
    String(
      filters?.category ??
      ""
    ).trim(),

  warehouse:
    String(
      filters?.warehouse ??
      ""
    ).trim(),

  supplier:
    String(
      filters?.supplier ??
      ""
    ).trim(),

  dateFrom:
    filters?.dateFrom ??
    "",

  dateTo:
    filters?.dateTo ??
    "",

  minStock:
    filters?.minStock ??
    "",

  maxStock:
    filters?.maxStock ??
    "",
});

//======================================================
// Filter Reports Locally
//======================================================

export const filterLowStockReports = (
  reports = [],
  filters = {},
  search = ""
) => {
  const list =
    normalizeLowStockReports(
      reports
    );

  const searchText =
    String(
      search ?? ""
    )
      .trim()
      .toLowerCase();

  return list.filter(
    (report) => {
      const matchesSearch =
        !searchText ||
        [
          report.productName,
          report.productCode,
          report.category,
          report.warehouse,
          report.supplierName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(
            searchText
          );

      const matchesStatus =
        !filters?.status ||
        filters.status ===
          "All" ||
        (
          filters.status ===
            "Low" &&
          report.status ===
            "Low Stock"
        ) ||
        (
          filters.status ===
            "OutOfStock" &&
          report.status ===
            "Out of Stock"
        ) ||
        (
          filters.status ===
            "OK" &&
          report.status ===
            "Stock OK"
        );

      const matchesCategory =
        !filters?.category ||
        report.category
          .toLowerCase()
          .includes(
            String(
              filters.category
            ).toLowerCase()
          );

      const matchesWarehouse =
        !filters?.warehouse ||
        report.warehouse
          .toLowerCase()
          .includes(
            String(
              filters.warehouse
            ).toLowerCase()
          );

      const matchesSupplier =
        !filters?.supplier ||
        report.supplierName
          .toLowerCase()
          .includes(
            String(
              filters.supplier
            ).toLowerCase()
          );

      const matchesMinStock =
        filters?.minStock ===
          "" ||
        report.currentStock >=
          Number(
            filters.minStock
          );

      const matchesMaxStock =
        filters?.maxStock ===
          "" ||
        report.currentStock <=
          Number(
            filters.maxStock
          );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesWarehouse &&
        matchesSupplier &&
        matchesMinStock &&
        matchesMaxStock
      );
    }
  );
};

//======================================================
// Default Export
//======================================================

export default {
  getLowStockReportId,
  getProductName,
  getProductCode,
  getCategory,
  getWarehouse,
  getSupplier,
  getCurrentStock,
  getMinimumStock,
  getReorderQuantity,
  getUnit,
  getStockStatus,
  isLowStock,
  isOutOfStock,
  getStockDifference,
  getShortageQuantity,
  formatNumber,
  formatDate,
  normalizeLowStockReport,
  normalizeLowStockReports,
  calculateLowStockStatistics,
  buildLowStockFilters,
  filterLowStockReports,
};