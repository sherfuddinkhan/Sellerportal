//======================================================
// Marketplace Report Helpers
//======================================================

/**
 * Safely convert a value to a number.
 */
export const toNumber = (
  value,
  fallback = 0
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

/**
 * Safely convert a value to a string.
 */
export const toStringValue = (
  value,
  fallback = ""
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value);
};

/**
 * Get marketplace name.
 */
export const getMarketplaceName = (
  report = {}
) =>
  report?.marketplaceName ??
  report?.marketplace ??
  report?.channelName ??
  report?.channel ??
  "—";

/**
 * Get order number.
 */
export const getOrderNumber = (
  report = {}
) =>
  report?.orderNumber ??
  report?.orderNo ??
  report?.orderId ??
  "—";

/**
 * Get product name.
 */
export const getProductName = (
  report = {}
) =>
  report?.productName ??
  report?.itemName ??
  report?.product ??
  report?.name ??
  "—";

/**
 * Get SKU.
 */
export const getSku = (
  report = {}
) =>
  report?.sku ??
  report?.productCode ??
  report?.itemCode ??
  "—";

/**
 * Get report ID.
 */
export const getReportId = (
  report = {}
) =>
  report?.id ??
  report?.reportId ??
  report?.orderId ??
  report?.orderNumber ??
  null;

/**
 * Get quantity.
 */
export const getQuantity = (
  report = {}
) =>
  toNumber(
    report?.quantity ??
      report?.qty ??
      report?.totalQuantity ??
      0
  );

/**
 * Get sales amount.
 */
export const getSalesAmount = (
  report = {}
) =>
  toNumber(
    report?.salesAmount ??
      report?.totalSales ??
      report?.totalAmount ??
      report?.orderAmount ??
      report?.amount ??
      report?.total ??
      0
  );

/**
 * Get order status.
 */
export const getStatus = (
  report = {}
) =>
  report?.status ??
  report?.orderStatus ??
  report?.paymentStatus ??
  "—";

/**
 * Get shipment status.
 */
export const getShipmentStatus = (
  report = {}
) =>
  report?.shipmentStatus ??
  report?.shippingStatus ??
  report?.deliveryStatus ??
  "—";

/**
 * Get category.
 */
export const getCategory = (
  report = {}
) =>
  report?.category ??
  report?.categoryName ??
  "—";

/**
 * Get report date.
 */
export const getReportDate = (
  report = {}
) =>
  report?.reportDate ??
  report?.orderDate ??
  report?.date ??
  "—";

/**
 * Format number using Indian numbering.
 */
export const formatNumber = (
  value,
  options = {}
) => {
  const number = toNumber(value);

  return number.toLocaleString(
    "en-IN",
    options
  );
};

/**
 * Format currency in INR.
 */
export const formatCurrency = (
  value,
  options = {}
) => {
  const number = toNumber(value);

  return number.toLocaleString(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }
  );
};

/**
 * Format date.
 */
export const formatDate = (
  value
) => {
  if (!value) {
    return "—";
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
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};

/**
 * Normalize status.
 */
export const normalizeStatus = (
  value
) =>
  String(
    value ?? ""
  )
    .trim()
    .toLowerCase();

/**
 * Get MUI status color.
 */
export const getStatusColor = (
  status
) => {
  const normalized =
    normalizeStatus(status);

  if (
    [
      "cancelled",
      "canceled",
      "failed",
      "rejected",
      "returned",
      "refunded",
    ].includes(normalized)
  ) {
    return "error";
  }

  if (
    [
      "pending",
      "processing",
      "packed",
      "on hold",
    ].includes(normalized)
  ) {
    return "warning";
  }

  if (
    [
      "completed",
      "delivered",
      "confirmed",
      "paid",
      "success",
      "shipped",
    ].includes(normalized)
  ) {
    return "success";
  }

  return "default";
};

/**
 * Get shipment status color.
 */
export const getShipmentStatusColor = (
  status
) => {
  const normalized =
    normalizeStatus(status);

  if (
    [
      "cancelled",
      "canceled",
      "failed",
      "returned",
    ].includes(normalized)
  ) {
    return "error";
  }

  if (
    [
      "pending",
      "processing",
      "packed",
    ].includes(normalized)
  ) {
    return "warning";
  }

  if (
    [
      "shipped",
      "delivered",
      "completed",
    ].includes(normalized)
  ) {
    return "success";
  }

  return "default";
};

/**
 * Normalize one marketplace report.
 */
export const normalizeMarketplaceReport = (
  report = {},
  index = 0
) => ({
  ...report,

  id:
    getReportId(report) ??
    index,

  marketplace:
    getMarketplaceName(report),

  orderNumber:
    getOrderNumber(report),

  productName:
    getProductName(report),

  sku:
    getSku(report),

  quantity:
    getQuantity(report),

  salesAmount:
    getSalesAmount(report),

  status:
    getStatus(report),

  shipmentStatus:
    getShipmentStatus(report),

  category:
    getCategory(report),

  reportDate:
    getReportDate(report),
});

/**
 * Normalize a report collection.
 */
export const normalizeMarketplaceReports = (
  reports
) => {
  if (
    !Array.isArray(reports)
  ) {
    return [];
  }

  return reports.map(
    (
      report,
      index
    ) =>
      normalizeMarketplaceReport(
        report,
        index
      )
  );
};

/**
 * Calculate marketplace statistics.
 */
export const calculateMarketplaceStatistics = (
  reports
) => {
  const normalizedReports =
    normalizeMarketplaceReports(
      reports
    );

  const totalOrders =
    normalizedReports.length;

  const totalSales =
    normalizedReports.reduce(
      (total, report) =>
        total +
        getSalesAmount(
          report
        ),
      0
    );

  const totalQuantity =
    normalizedReports.reduce(
      (total, report) =>
        total +
        getQuantity(
          report
        ),
      0
    );

  const totalProducts =
    new Set(
      normalizedReports
        .map(
          (report) =>
            getSku(report)
        )
        .filter(
          (sku) =>
            sku !== "—" &&
            sku !== ""
        )
    ).size;

  const totalReturns =
    normalizedReports.filter(
      (report) =>
        [
          "returned",
          "refunded",
        ].includes(
          normalizeStatus(
            getStatus(report)
          )
        )
    ).length;

  return {
    totalOrders,
    totalSales,
    totalQuantity,
    totalProducts,
    totalReturns,
  };
};

/**
 * Filter marketplace reports.
 */
export const filterMarketplaceReports = (
  reports,
  filters = {}
) => {
  const normalizedReports =
    normalizeMarketplaceReports(
      reports
    );

  const {
    marketplace = "",
    status = "",
    category = "",
    dateFrom = "",
    dateTo = "",
    minAmount = "",
    maxAmount = "",
  } = filters;

  const normalizedMarketplace =
    String(
      marketplace
    )
      .trim()
      .toLowerCase();

  const normalizedStatus =
    String(status)
      .trim()
      .toLowerCase();

  const normalizedCategory =
    String(category)
      .trim()
      .toLowerCase();

  const minimumAmount =
    minAmount === ""
      ? null
      : toNumber(
          minAmount,
          null
        );

  const maximumAmount =
    maxAmount === ""
      ? null
      : toNumber(
          maxAmount,
          null
        );

  return normalizedReports.filter(
    (report) => {
      const reportMarketplace =
        String(
          getMarketplaceName(
            report
          )
        )
          .trim()
          .toLowerCase();

      const reportStatus =
        normalizeStatus(
          getStatus(report)
        );

      const reportCategory =
        String(
          getCategory(report)
        )
          .trim()
          .toLowerCase();

      const reportAmount =
        getSalesAmount(
          report
        );

      if (
        normalizedMarketplace &&
        reportMarketplace !==
          normalizedMarketplace
      ) {
        return false;
      }

      if (
        normalizedStatus &&
        reportStatus !==
          normalizedStatus
      ) {
        return false;
      }

      if (
        normalizedCategory &&
        reportCategory !==
          normalizedCategory
      ) {
        return false;
      }

      if (
        minimumAmount !== null &&
        reportAmount <
          minimumAmount
      ) {
        return false;
      }

      if (
        maximumAmount !== null &&
        reportAmount >
          maximumAmount
      ) {
        return false;
      }

      if (
        dateFrom ||
        dateTo
      ) {
        const reportDate =
          new Date(
            getReportDate(
              report
            )
          );

        if (
          Number.isNaN(
            reportDate.getTime()
          )
        ) {
          return false;
        }

        if (dateFrom) {
          const fromDate =
            new Date(
              `${dateFrom}T00:00:00`
            );

          if (
            reportDate <
            fromDate
          ) {
            return false;
          }
        }

        if (dateTo) {
          const toDate =
            new Date(
              `${dateTo}T23:59:59`
            );

          if (
            reportDate >
            toDate
          ) {
            return false;
          }
        }
      }

      return true;
    }
  );
};

/**
 * Search marketplace reports.
 */
export const searchMarketplaceReports = (
  reports,
  searchTerm = ""
) => {
  const normalizedSearch =
    String(
      searchTerm ?? ""
    )
      .trim()
      .toLowerCase();

  if (!normalizedSearch) {
    return normalizeMarketplaceReports(
      reports
    );
  }

  return normalizeMarketplaceReports(
    reports
  ).filter(
    (report) => {
      const searchableText =
        [
          getMarketplaceName(
            report
          ),
          getOrderNumber(
            report
          ),
          getProductName(
            report
          ),
          getSku(report),
          getCategory(
            report
          ),
          getStatus(report),
          getShipmentStatus(
            report
          ),
        ]
          .join(" ")
          .toLowerCase();

      return searchableText.includes(
        normalizedSearch
      );
    }
  );
};

/**
 * Sort marketplace reports.
 */
export const sortMarketplaceReports = (
  reports,
  sortBy = "reportDate",
  sortOrder = "desc"
) => {
  const normalizedReports =
    normalizeMarketplaceReports(
      reports
    );

  const multiplier =
    sortOrder === "asc"
      ? 1
      : -1;

  return [
    ...normalizedReports,
  ].sort(
    (a, b) => {
      let valueA;
      let valueB;

      switch (sortBy) {
        case "marketplace":
          valueA =
            getMarketplaceName(
              a
            ).toLowerCase();
          valueB =
            getMarketplaceName(
              b
            ).toLowerCase();
          break;

        case "orderNumber":
          valueA =
            getOrderNumber(a)
              .toString()
              .toLowerCase();
          valueB =
            getOrderNumber(b)
              .toString()
              .toLowerCase();
          break;

        case "quantity":
          valueA =
            getQuantity(a);
          valueB =
            getQuantity(b);
          break;

        case "salesAmount":
          valueA =
            getSalesAmount(a);
          valueB =
            getSalesAmount(b);
          break;

        case "status":
          valueA =
            getStatus(a)
              .toString()
              .toLowerCase();
          valueB =
            getStatus(b)
              .toString()
              .toLowerCase();
          break;

        case "reportDate":
        default:
          valueA =
            new Date(
              getReportDate(a)
            ).getTime() || 0;

          valueB =
            new Date(
              getReportDate(b)
            ).getTime() || 0;
          break;
      }

      if (
        valueA <
        valueB
      ) {
        return -1 * multiplier;
      }

      if (
        valueA >
        valueB
      ) {
        return 1 * multiplier;
      }

      return 0;
    }
  );
};

/**
 * Paginate reports.
 */
export const paginateReports = (
  reports,
  page = 1,
  pageSize = 10
) => {
  const safeReports =
    Array.isArray(reports)
      ? reports
      : [];

  const safePage =
    Math.max(
      1,
      toNumber(page, 1)
    );

  const safePageSize =
    Math.max(
      1,
      toNumber(pageSize, 10)
    );

  const totalRecords =
    safeReports.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRecords /
          safePageSize
      )
    );

  const currentPage =
    Math.min(
      safePage,
      totalPages
    );

  const startIndex =
    (currentPage - 1) *
    safePageSize;

  return {
    data:
      safeReports.slice(
        startIndex,
        startIndex +
          safePageSize
      ),

    page: currentPage,

    pageSize: safePageSize,

    totalRecords,

    totalPages,

    startRecord:
      totalRecords === 0
        ? 0
        : startIndex + 1,

    endRecord:
      Math.min(
        startIndex +
          safePageSize,
        totalRecords
      ),
  };
};

/**
 * Convert reports to CSV rows.
 */
export const reportsToCsvRows = (
  reports
) =>
  normalizeMarketplaceReports(
    reports
  ).map(
    (report, index) => ({
      "S.No":
        index + 1,

      Marketplace:
        getMarketplaceName(
          report
        ),

      "Order Number":
        getOrderNumber(
          report
        ),

      "Product Name":
        getProductName(
          report
        ),

      SKU:
        getSku(report),

      Quantity:
        getQuantity(
          report
        ),

      "Sales Amount":
        getSalesAmount(
          report
        ),

      Status:
        getStatus(report),

      "Shipment Status":
        getShipmentStatus(
          report
        ),

      Category:
        getCategory(report),

      Date:
        getReportDate(
          report
        ),
    })
  );

/**
 * Convert reports into export-ready data.
 */
export const prepareMarketplaceExportData = (
  reports
) =>
  reportsToCsvRows(
    reports
  );

/**
 * Build a CSV string.
 */
export const buildCsv = (
  rows
) => {
  if (
    !Array.isArray(rows) ||
    rows.length === 0
  ) {
    return "";
  }

  const headers =
    Object.keys(
      rows[0]
    );

  const escapeCsvValue =
    (value) => {
      const stringValue =
        String(
          value ?? ""
        );

      if (
        /[",\n]/.test(
          stringValue
        )
      ) {
        return `"${stringValue.replace(
          /"/g,
          '""'
        )}"`;
      }

      return stringValue;
    };

  const headerRow =
    headers
      .map(
        escapeCsvValue
      )
      .join(",");

  const dataRows =
    rows.map(
      (row) =>
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

  return [
    headerRow,
    ...dataRows,
  ].join("\n");
};

/**
 * Download a text file.
 */
export const downloadFile = (
  content,
  fileName,
  mimeType = "text/plain"
) => {
  const blob =
    new Blob(
      [content],
      {
        type: mimeType,
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      "a"
    );

  anchor.href = url;
  anchor.download =
    fileName;

  document.body.appendChild(
    anchor
  );

  anchor.click();

  document.body.removeChild(
    anchor
  );

  URL.revokeObjectURL(
    url
  );
};

/**
 * Export marketplace reports as CSV.
 */
export const exportMarketplaceReportsCsv =
  (
    reports,
    fileName = "marketplace-report"
  ) => {
    const rows =
      prepareMarketplaceExportData(
        reports
      );

    const csv =
      buildCsv(rows);

    if (!csv) {
      return false;
    }

    const finalFileName =
      fileName
        .toLowerCase()
        .endsWith(".csv")
        ? fileName
        : `${fileName}.csv`;

    downloadFile(
      csv,
      finalFileName,
      "text/csv;charset=utf-8;"
    );

    return true;
  };

//======================================================
// Default Export
//======================================================

const MarketplaceReportHelpers = {
  toNumber,
  toStringValue,
  getMarketplaceName,
  getOrderNumber,
  getProductName,
  getSku,
  getReportId,
  getQuantity,
  getSalesAmount,
  getStatus,
  getShipmentStatus,
  getCategory,
  getReportDate,
  formatNumber,
  formatCurrency,
  formatDate,
  normalizeStatus,
  getStatusColor,
  getShipmentStatusColor,
  normalizeMarketplaceReport,
  normalizeMarketplaceReports,
  calculateMarketplaceStatistics,
  filterMarketplaceReports,
  searchMarketplaceReports,
  sortMarketplaceReports,
  paginateReports,
  reportsToCsvRows,
  prepareMarketplaceExportData,
  buildCsv,
  downloadFile,
  exportMarketplaceReportsCsv,
};

export default MarketplaceReportHelpers;