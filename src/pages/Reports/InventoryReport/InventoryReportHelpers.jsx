//======================================================
// InventoryReportHelper.js
//======================================================

//======================================================
// Safe Array
//======================================================

export const toArray = (value) => {
  return Array.isArray(value)
    ? value
    : [];
};

//======================================================
// Report ID
//======================================================

export const getReportId = (report) => {
  if (!report) {
    return "";
  }

  return (
    report.id ??
    report.reportId ??
    report.inventoryReportId ??
    report._id ??
    ""
  );
};

//======================================================
// Report Name
//======================================================

export const getReportName = (report) => {
  if (!report) {
    return "Unnamed Report";
  }

  return (
    report.reportName ??
    report.name ??
    report.title ??
    "Unnamed Report"
  );
};

//======================================================
// Report Type
//======================================================

export const getReportType = (report) => {
  if (!report) {
    return "";
  }

  return (
    report.reportType ??
    report.type ??
    report.inventoryReportType ??
    ""
  );
};

//======================================================
// Status
//======================================================

export const getReportStatus = (report) => {
  if (!report) {
    return "";
  }

  return (
    report.status ??
    report.reportStatus ??
    "inactive"
  );
};

// Alias used by table components
export const getStatus = getReportStatus;

//======================================================
// Status Color
//======================================================

export const getStatusColor = (status) => {
  const normalizedStatus = String(
    status || ""
  ).toLowerCase();

  switch (normalizedStatus) {
    case "active":
      return "success";

    case "inactive":
      return "default";

    case "draft":
      return "warning";

    case "archived":
      return "error";

    case "pending":
      return "info";

    default:
      return "default";
  }
};

//======================================================
// Total Records
//======================================================

export const getTotalRecords = (report) => {
  if (!report) {
    return 0;
  }

  return Number(
    report.totalRecords ??
      report.recordCount ??
      report.records ??
      0
  ) || 0;
};

//======================================================
// Total Stock
//======================================================

export const getTotalStock = (report) => {
  if (!report) {
    return 0;
  }

  return Number(
    report.totalStock ??
      report.stockQuantity ??
      report.quantity ??
      0
  ) || 0;
};

//======================================================
// Total Value
//======================================================

export const getTotalValue = (report) => {
  if (!report) {
    return 0;
  }

  return Number(
    report.totalValue ??
      report.inventoryValue ??
      report.stockValue ??
      0
  ) || 0;
};

//======================================================
// Created By
//======================================================

export const getCreatedBy = (report) => {
  if (!report) {
    return "-";
  }

  return (
    report.createdByName ??
    report.createdBy ??
    report.userName ??
    report.username ??
    "-"
  );
};

//======================================================
// Created Date
//======================================================

export const getCreatedDate = (report) => {
  if (!report) {
    return null;
  }

  return (
    report.createdDate ??
    report.createdAt ??
    report.creationDate ??
    null
  );
};

//======================================================
// Updated Date
//======================================================

export const getUpdatedDate = (report) => {
  if (!report) {
    return null;
  }

  return (
    report.updatedDate ??
    report.updatedAt ??
    null
  );
};

//======================================================
// Format Number
//======================================================

export const formatNumber = (
  value,
  maximumFractionDigits = 2
) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits,
    }
  ).format(number);
};

//======================================================
// Format Currency
//======================================================

export const formatCurrency = (
  value,
  currency = "INR"
) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
      }
    ).format(0);
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Format Date
//======================================================

export const formatDate = (
  value,
  options = {}
) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...options,
    }
  ).format(date);
};

//======================================================
// Format Date & Time
//======================================================

export const formatDateTime = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  ).format(date);
};

//======================================================
// Normalize Search Text
//======================================================

export const normalizeSearchText = (
  value
) => {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();
};

//======================================================
// Search Reports
//======================================================

export const searchReports = (
  reports,
  searchTerm
) => {
  const list = toArray(reports);

  const search = normalizeSearchText(
    searchTerm
  );

  if (!search) {
    return list;
  }

  return list.filter(
    (report) => {

      const searchableText = [
        getReportId(report),
        getReportName(report),
        getReportType(report),
        getReportStatus(report),
        getCreatedBy(report),
        report?.description,
      ]
        .map(normalizeSearchText)
        .join(" ");

      return searchableText.includes(
        search
      );
    }
  );
};

//======================================================
// Filter Reports
//======================================================

export const filterReports = (
  reports,
  filters = {}
) => {
  const list = toArray(reports);

  const {
    status = "",
    reportType = "",
    dateFrom = "",
    dateTo = "",
  } = filters || {};

  return list.filter(
    (report) => {

      //==============================================
      // Status
      //==============================================

      if (
        status &&
        normalizeSearchText(
          getReportStatus(report)
        ) !==
          normalizeSearchText(status)
      ) {
        return false;
      }

      //==============================================
      // Report Type
      //==============================================

      if (
        reportType &&
        normalizeSearchText(
          getReportType(report)
        ) !==
          normalizeSearchText(reportType)
      ) {
        return false;
      }

      //==============================================
      // Date Range
      //==============================================

      const reportDate =
        getCreatedDate(report);

      if (
        dateFrom ||
        dateTo
      ) {
        if (!reportDate) {
          return false;
        }

        const date =
          new Date(reportDate);

        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return false;
        }

        date.setHours(
          0,
          0,
          0,
          0
        );

        if (dateFrom) {
          const from =
            new Date(dateFrom);

          from.setHours(
            0,
            0,
            0,
            0
          );

          if (date < from) {
            return false;
          }
        }

        if (dateTo) {
          const to =
            new Date(dateTo);

          to.setHours(
            23,
            59,
            59,
            999
          );

          if (date > to) {
            return false;
          }
        }
      }

      return true;
    }
  );
};

//======================================================
// Sort Reports
//======================================================

export const sortReports = (
  reports,
  field = "createdDate",
  direction = "desc"
) => {
  const list = [
    ...toArray(reports),
  ];

  const multiplier =
    direction === "asc"
      ? 1
      : -1;

  return list.sort(
    (a, b) => {

      let valueA;
      let valueB;

      switch (field) {
        case "reportName":
          valueA =
            getReportName(a);
          valueB =
            getReportName(b);
          break;

        case "reportType":
          valueA =
            getReportType(a);
          valueB =
            getReportType(b);
          break;

        case "status":
          valueA =
            getReportStatus(a);
          valueB =
            getReportStatus(b);
          break;

        case "totalRecords":
          valueA =
            getTotalRecords(a);
          valueB =
            getTotalRecords(b);
          break;

        case "totalStock":
          valueA =
            getTotalStock(a);
          valueB =
            getTotalStock(b);
          break;

        case "totalValue":
          valueA =
            getTotalValue(a);
          valueB =
            getTotalValue(b);
          break;

        case "createdBy":
          valueA =
            getCreatedBy(a);
          valueB =
            getCreatedBy(b);
          break;

        case "createdDate":
        default:
          valueA =
            getCreatedDate(a);
          valueB =
            getCreatedDate(b);
          break;
      }

      //==============================================
      // Numeric
      //==============================================

      if (
        typeof valueA ===
          "number" ||
        typeof valueB ===
          "number"
      ) {
        return (
          (Number(valueA) -
            Number(valueB)) *
          multiplier
        );
      }

      //==============================================
      // Date
      //==============================================

      if (
        field ===
        "createdDate"
      ) {
        const dateA =
          new Date(valueA || 0)
            .getTime();

        const dateB =
          new Date(valueB || 0)
            .getTime();

        return (
          (dateA - dateB) *
          multiplier
        );
      }

      //==============================================
      // String
      //==============================================

      return (
        String(valueA ?? "")
          .localeCompare(
            String(valueB ?? ""),
            undefined,
            {
              numeric: true,
              sensitivity:
                "base",
            }
          ) *
        multiplier
      );
    }
  );
};

//======================================================
// Get Unique Report Types
//======================================================

export const getUniqueReportTypes = (
  reports
) => {
  return [
    ...new Set(
      toArray(reports)
        .map(getReportType)
        .filter(Boolean)
    ),
  ];
};

//======================================================
// Get Unique Statuses
//======================================================

export const getUniqueStatuses = (
  reports
) => {
  return [
    ...new Set(
      toArray(reports)
        .map(getReportStatus)
        .filter(Boolean)
    ),
  ];
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateStatistics = (
  reports
) => {
  const list =
    toArray(reports);

  const statistics = {
    totalReports: list.length,
    activeReports: 0,
    inactiveReports: 0,
    draftReports: 0,
    archivedReports: 0,
    totalRecords: 0,
    totalStock: 0,
    totalValue: 0,
  };

  list.forEach(
    (report) => {

      const status =
        normalizeSearchText(
          getReportStatus(report)
        );

      if (
        status === "active"
      ) {
        statistics.activeReports += 1;
      }

      if (
        status === "inactive"
      ) {
        statistics.inactiveReports += 1;
      }

      if (
        status === "draft"
      ) {
        statistics.draftReports += 1;
      }

      if (
        status === "archived"
      ) {
        statistics.archivedReports += 1;
      }

      statistics.totalRecords +=
        getTotalRecords(report);

      statistics.totalStock +=
        getTotalStock(report);

      statistics.totalValue +=
        getTotalValue(report);
    }
  );

  return statistics;
};

//======================================================
// Pagination
//======================================================

export const paginateReports = (
  reports,
  page = 1,
  rowsPerPage = 10
) => {
  const list =
    toArray(reports);

  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeRowsPerPage =
    Math.max(
      Number(rowsPerPage) || 10,
      1
    );

  const startIndex =
    (safePage - 1) *
    safeRowsPerPage;

  return {
    data: list.slice(
      startIndex,
      startIndex +
        safeRowsPerPage
    ),

    total:
      list.length,

    totalPages:
      Math.ceil(
        list.length /
          safeRowsPerPage
      ),

    page: safePage,

    rowsPerPage:
      safeRowsPerPage,

    startIndex,

    endIndex: Math.min(
      startIndex +
        safeRowsPerPage,
      list.length
    ),
  };
};

//======================================================
// Create Empty Report
//======================================================

export const createEmptyReport = () => {
  return {
    id: null,

    reportName: "",

    reportType:
      "inventory",

    status:
      "active",

    description: "",

    createdBy: "",

    totalRecords: 0,

    totalStock: 0,

    totalValue: 0,

    items: [],
  };
};

//======================================================
// Normalize Report
//======================================================

export const normalizeReport = (
  report
) => {
  if (!report) {
    return createEmptyReport();
  }

  return {
    ...report,

    id:
      getReportId(report) ||
      null,

    reportName:
      getReportName(report),

    reportType:
      getReportType(report) ||
      "inventory",

    status:
      getReportStatus(report) ||
      "inactive",

    totalRecords:
      getTotalRecords(report),

    totalStock:
      getTotalStock(report),

    totalValue:
      getTotalValue(report),

    items:
      Array.isArray(
        report.items
      )
        ? report.items
        : [],
  };
};

//======================================================
// Export Object
//======================================================

export default {
  toArray,
  getReportId,
  getReportName,
  getReportType,
  getReportStatus,
  getStatus,
  getStatusColor,
  getTotalRecords,
  getTotalStock,
  getTotalValue,
  getCreatedBy,
  getCreatedDate,
  getUpdatedDate,
  formatNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  normalizeSearchText,
  searchReports,
  filterReports,
  sortReports,
  getUniqueReportTypes,
  getUniqueStatuses,
  calculateStatistics,
  paginateReports,
  createEmptyReport,
  normalizeReport,
};