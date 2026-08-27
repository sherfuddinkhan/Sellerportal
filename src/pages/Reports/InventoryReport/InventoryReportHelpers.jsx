
// ======================================================
// InventoryReportHelper.jsx
// ======================================================
// Helper functions for Inventory Reports
// ======================================================


// ======================================================
// Safe Array
// ======================================================

export const toArray = (value) => {
  return Array.isArray(value) ? value : [];
};


// ======================================================
// Safe Number
// ======================================================

export const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


// ======================================================
// Normalize Search Text
// ======================================================

export const normalizeSearchText = (value) => {
  return String(value ?? "")
    .trim()
    .toLowerCase();
};


// ======================================================
// Report ID
// ======================================================

export const getReportId = (report) => {
  if (!report) {
    return "";
  }

  return (
    report.id ??
    report.reportId ??
    report.inventoryReportId ??
    report.inventoryReportID ??
    report._id ??
    ""
  );
};


// ======================================================
// Report Name
// ======================================================

export const getReportName = (report) => {
  if (!report) {
    return "Unnamed Report";
  }

  return (
    report.reportName ??
    report.name ??
    report.title ??
    report.inventoryReportName ??
    "Unnamed Report"
  );
};


// ======================================================
// Report Type
// ======================================================

export const getReportType = (report) => {
  if (!report) {
    return "";
  }

  return (
    report.reportType ??
    report.type ??
    report.inventoryReportType ??
    report.inventoryType ??
    ""
  );
};


// ======================================================
// Report Status
// ======================================================

export const getReportStatus = (report) => {
  if (!report) {
    return "inactive";
  }

  return (
    report.status ??
    report.reportStatus ??
    report.isActive === true
      ? "active"
      : report.isActive === false
        ? "inactive"
        : "inactive"
  );
};


// ======================================================
// Status Alias
// ======================================================

export const getStatus = (report) => {
  return getReportStatus(report);
};


// ======================================================
// Status Color
// ======================================================

export const getStatusColor = (status) => {
  const normalizedStatus =
    normalizeSearchText(status);

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


// ======================================================
// Total Records
// ======================================================

export const getTotalRecords = (report) => {
  if (!report) {
    return 0;
  }

  return toNumber(
    report.totalRecords ??
      report.recordCount ??
      report.records ??
      report.totalItems ??
      report.itemCount ??
      0
  );
};


// ======================================================
// Total Stock
// ======================================================

export const getTotalStock = (report) => {
  if (!report) {
    return 0;
  }

  return toNumber(
    report.totalStock ??
      report.stockQuantity ??
      report.quantity ??
      report.totalQuantity ??
      report.availableQuantity ??
      0
  );
};


// ======================================================
// Total Value
// ======================================================

export const getTotalValue = (report) => {
  if (!report) {
    return 0;
  }

  return toNumber(
    report.totalValue ??
      report.inventoryValue ??
      report.stockValue ??
      report.totalInventoryValue ??
      report.value ??
      0
  );
};


// ======================================================
// Created By
// ======================================================

export const getCreatedBy = (report) => {
  if (!report) {
    return "-";
  }

  return (
    report.createdByName ??
    report.createdBy ??
    report.userName ??
    report.username ??
    report.createdUser ??
    "-"
  );
};


// ======================================================
// Created Date
// ======================================================

export const getCreatedDate = (report) => {
  if (!report) {
    return null;
  }

  return (
    report.createdDate ??
    report.createdAt ??
    report.creationDate ??
    report.dateCreated ??
    null
  );
};


// ======================================================
// Updated Date
// ======================================================

export const getUpdatedDate = (report) => {
  if (!report) {
    return null;
  }

  return (
    report.updatedDate ??
    report.updatedAt ??
    report.modifiedDate ??
    report.modifiedAt ??
    null
  );
};


// ======================================================
// Description
// ======================================================

export const getDescription = (report) => {
  if (!report) {
    return "";
  }

  return (
    report.description ??
    report.reportDescription ??
    ""
  );
};


// ======================================================
// Items
// ======================================================

export const getReportItems = (report) => {
  if (!report) {
    return [];
  }

  return toArray(
    report.items ??
      report.inventoryItems ??
      report.details ??
      report.records
  );
};


// ======================================================
// Format Number
// ======================================================

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


// ======================================================
// Format Currency
// ======================================================

export const formatCurrency = (
  value,
  currency = "INR"
) => {
  const number = Number(value);

  const safeNumber =
    Number.isFinite(number)
      ? number
      : 0;

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(safeNumber);
};


// ======================================================
// Format Date
// ======================================================

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


// ======================================================
// Format Date & Time
// ======================================================

export const formatDateTime = (value) => {
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


// ======================================================
// Search Reports
// ======================================================

export const searchReports = (
  reports,
  searchTerm
) => {
  const list = toArray(reports);

  const search =
    normalizeSearchText(searchTerm);

  if (!search) {
    return list;
  }

  return list.filter((report) => {
    const searchableText = [
      getReportId(report),
      getReportName(report),
      getReportType(report),
      getReportStatus(report),
      getCreatedBy(report),
      getDescription(report),
    ]
      .map(normalizeSearchText)
      .join(" ");

    return searchableText.includes(search);
  });
};


// ======================================================
// Filter Reports
// ======================================================

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

  return list.filter((report) => {

    // --------------------------------------------------
    // Status
    // --------------------------------------------------

    if (status) {
      const reportStatus =
        normalizeSearchText(
          getReportStatus(report)
        );

      const selectedStatus =
        normalizeSearchText(status);

      if (
        reportStatus !== selectedStatus
      ) {
        return false;
      }
    }


    // --------------------------------------------------
    // Report Type
    // --------------------------------------------------

    if (reportType) {
      const currentReportType =
        normalizeSearchText(
          getReportType(report)
        );

      const selectedReportType =
        normalizeSearchText(reportType);

      if (
        currentReportType !==
        selectedReportType
      ) {
        return false;
      }
    }


    // --------------------------------------------------
    // Date Filter
    // --------------------------------------------------

    if (dateFrom || dateTo) {

      const reportDate =
        getCreatedDate(report);

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


      // ----------------------------------------------
      // From Date
      // ----------------------------------------------

      if (dateFrom) {
        const from =
          new Date(dateFrom);

        if (
          Number.isNaN(
            from.getTime()
          )
        ) {
          return false;
        }

        from.setHours(
          0,
          0,
          0,
          0
        );

        date.setHours(
          0,
          0,
          0,
          0
        );

        if (date < from) {
          return false;
        }
      }


      // ----------------------------------------------
      // To Date
      // ----------------------------------------------

      if (dateTo) {
        const to =
          new Date(dateTo);

        if (
          Number.isNaN(
            to.getTime()
          )
        ) {
          return false;
        }

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
  });
};


// ======================================================
// Inventory Report Filter
// ======================================================

export const filterInventoryReports = (
  reports,
  filters = {}
) => {
  return filterReports(
    reports,
    filters
  );
};


// ======================================================
// Sort Reports
// ======================================================

export const sortReports = (
  reports,
  field = "createdDate",
  direction = "desc"
) => {
  const list = [
    ...toArray(reports),
  ];

  const multiplier =
    normalizeSearchText(direction) === "asc"
      ? 1
      : -1;

  return list.sort((a, b) => {

    let valueA;
    let valueB;

    switch (field) {

      case "id":
      case "reportId":
        valueA =
          getReportId(a);
        valueB =
          getReportId(b);
        break;

      case "reportName":
      case "name":
        valueA =
          getReportName(a);
        valueB =
          getReportName(b);
        break;

      case "reportType":
      case "type":
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

      case "updatedDate":
        valueA =
          getUpdatedDate(a);
        valueB =
          getUpdatedDate(b);
        break;

      case "createdDate":
      default:
        valueA =
          getCreatedDate(a);
        valueB =
          getCreatedDate(b);
        break;
    }


    // --------------------------------------------------
    // Numeric Values
    // --------------------------------------------------

    if (
      typeof valueA === "number" ||
      typeof valueB === "number"
    ) {
      return (
        (
          toNumber(valueA) -
          toNumber(valueB)
        ) *
        multiplier
      );
    }


    // --------------------------------------------------
    // Date Values
    // --------------------------------------------------

    if (
      field === "createdDate" ||
      field === "updatedDate"
    ) {
      const dateA =
        new Date(
          valueA || 0
        ).getTime();

      const dateB =
        new Date(
          valueB || 0
        ).getTime();

      return (
        (dateA - dateB) *
        multiplier
      );
    }


    // --------------------------------------------------
    // String Values
    // --------------------------------------------------

    return (
      String(valueA ?? "")
        .localeCompare(
          String(valueB ?? ""),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        ) *
      multiplier
    );
  });
};


// ======================================================
// Get Unique Report Types
// ======================================================

export const getUniqueReportTypes = (
  reports
) => {
  return [
    ...new Set(
      toArray(reports)
        .map(getReportType)
        .map((value) =>
          String(value ?? "").trim()
        )
        .filter(Boolean)
    ),
  ];
};


// ======================================================
// Get Unique Statuses
// ======================================================

export const getUniqueStatuses = (
  reports
) => {
  return [
    ...new Set(
      toArray(reports)
        .map(getReportStatus)
        .map((value) =>
          String(value ?? "").trim()
        )
        .filter(Boolean)
    ),
  ];
};


// ======================================================
// Calculate Statistics
// ======================================================

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

    pendingReports: 0,

    totalRecords: 0,

    totalStock: 0,

    totalValue: 0,
  };


  list.forEach((report) => {

    const status =
      normalizeSearchText(
        getReportStatus(report)
      );


    switch (status) {

      case "active":
        statistics.activeReports += 1;
        break;

      case "inactive":
        statistics.inactiveReports += 1;
        break;

      case "draft":
        statistics.draftReports += 1;
        break;

      case "archived":
        statistics.archivedReports += 1;
        break;

      case "pending":
        statistics.pendingReports += 1;
        break;

      default:
        break;
    }


    statistics.totalRecords +=
      getTotalRecords(report);

    statistics.totalStock +=
      getTotalStock(report);

    statistics.totalValue +=
      getTotalValue(report);
  });


  return statistics;
};


// ======================================================
// Pagination
// ======================================================

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

  const endIndex =
    Math.min(
      startIndex +
        safeRowsPerPage,
      list.length
    );

  return {
    data: list.slice(
      startIndex,
      endIndex
    ),

    total:
      list.length,

    totalPages:
      Math.ceil(
        list.length /
          safeRowsPerPage
      ),

    page:
      safePage,

    rowsPerPage:
      safeRowsPerPage,

    startIndex,

    endIndex,
  };
};


// ======================================================
// Create Empty Report
// ======================================================

export const createEmptyReport = () => {
  return {
    id: null,

    reportId: null,

    reportName: "",

    reportType: "inventory",

    status: "active",

    description: "",

    createdBy: "",

    createdDate: null,

    updatedDate: null,

    totalRecords: 0,

    totalStock: 0,

    totalValue: 0,

    items: [],
  };
};


// ======================================================
// Normalize Report
// ======================================================

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

    description:
      getDescription(report),

    createdBy:
      getCreatedBy(report),

    createdDate:
      getCreatedDate(report),

    updatedDate:
      getUpdatedDate(report),

    totalRecords:
      getTotalRecords(report),

    totalStock:
      getTotalStock(report),

    totalValue:
      getTotalValue(report),

    items:
      getReportItems(report),
  };
};


// ======================================================
// Normalize Reports
// ======================================================

export const normalizeReports = (
  reports
) => {
  return toArray(reports)
    .map(normalizeReport);
};


// ======================================================
// Filter + Search + Sort
// ======================================================

export const processReports = (
  reports,
  {
    searchTerm = "",
    filters = {},
    sortField = "createdDate",
    sortDirection = "desc",
  } = {}
) => {

  let result =
    normalizeReports(reports);


  // Search

  result =
    searchReports(
      result,
      searchTerm
    );


  // Filters

  result =
    filterInventoryReports(
      result,
      filters
    );


  // Sort

  result =
    sortReports(
      result,
      sortField,
      sortDirection
    );


  return result;
};


// ======================================================
// Get Report Summary
// ======================================================

export const getReportSummary = (
  report
) => {
  if (!report) {
    return {
      id: "",
      name: "Unnamed Report",
      type: "inventory",
      status: "inactive",
      records: 0,
      stock: 0,
      value: 0,
      createdBy: "-",
      createdDate: null,
    };
  }

  return {
    id:
      getReportId(report),

    name:
      getReportName(report),

    type:
      getReportType(report),

    status:
      getReportStatus(report),

    records:
      getTotalRecords(report),

    stock:
      getTotalStock(report),

    value:
      getTotalValue(report),

    createdBy:
      getCreatedBy(report),

    createdDate:
      getCreatedDate(report),
  };
};


// ======================================================
// Export Default Helper Object
// ======================================================

const InventoryReportHelper = {

  toArray,

  toNumber,

  normalizeSearchText,

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

  getDescription,

  getReportItems,

  formatNumber,

  formatCurrency,

  formatDate,

  formatDateTime,

  searchReports,

  filterReports,

  filterInventoryReports,

  sortReports,

  getUniqueReportTypes,

  getUniqueStatuses,

  calculateStatistics,

  paginateReports,

  createEmptyReport,

  normalizeReport,

  normalizeReports,

  processReports,

  getReportSummary,
};

export default InventoryReportHelper;
