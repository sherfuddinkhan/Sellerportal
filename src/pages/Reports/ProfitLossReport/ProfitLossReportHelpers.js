
//======================================================
// ProfitLossReportHelpers.js
//======================================================

//======================================================
// Number Helpers
//======================================================

export const toNumber = (
  value,
  fallback = 0
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

//======================================================
// String Helpers
//======================================================

export const toSafeString = (
  value,
  fallback = ""
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value).trim();
};

//======================================================
// Currency Formatter
//======================================================

export const formatCurrency = (
  value,
  currency = "INR"
) => {
  const amount = toNumber(value);

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
};

//======================================================
// Number Formatter
//======================================================

export const formatNumber = (
  value,
  decimals = 0
) => {
  const number = toNumber(value);

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        minimumFractionDigits:
          decimals,
        maximumFractionDigits:
          decimals,
      }
    ).format(number);
  } catch {
    return number.toFixed(
      decimals
    );
  }
};

//======================================================
// Percentage Formatter
//======================================================

export const formatPercentage = (
  value,
  decimals = 2
) => {
  return `${toNumber(value).toFixed(
    decimals
  )}%`;
};

//======================================================
// Date Formatter
//======================================================

export const formatDate = (
  value,
  fallback = "—"
) => {
  if (!value) {
    return fallback;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return fallback;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(date);
};

//======================================================
// ISO Date Formatter
//======================================================

export const formatDateForInput = (
  value
) => {
  if (!value) {
    return "";
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return value;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//======================================================
// Profit Calculation
//======================================================

export const calculateGrossProfit = (
  revenue,
  totalCost
) => {
  return (
    toNumber(revenue) -
    toNumber(totalCost)
  );
};

//======================================================
// Net Profit Calculation
//======================================================

export const calculateNetProfit = (
  grossProfit,
  operatingExpenses
) => {
  return (
    toNumber(grossProfit) -
    toNumber(operatingExpenses)
  );
};

//======================================================
// Gross Margin
//======================================================

export const calculateGrossMargin = (
  revenue,
  grossProfit
) => {
  const totalRevenue =
    toNumber(revenue);

  if (totalRevenue === 0) {
    return 0;
  }

  return (
    (toNumber(grossProfit) /
      totalRevenue) *
    100
  );
};

//======================================================
// Net Margin
//======================================================

export const calculateNetMargin = (
  revenue,
  netProfit
) => {
  const totalRevenue =
    toNumber(revenue);

  if (totalRevenue === 0) {
    return 0;
  }

  return (
    (toNumber(netProfit) /
      totalRevenue) *
    100
  );
};

//======================================================
// Profit Status
//======================================================

export const getProfitStatus = (
  profit
) => {
  const value =
    toNumber(profit);
  if (value > 0) {
    return "profit";
  }
  if (value < 0) {
    return "loss";
  }
  return "break-even";
};

//======================================================
// Profit Status Color
//======================================================

export const getProfitStatusColor = (
  profit
) => {
  const status = getProfitStatus(profit);

  if (status === "profit") {
    return "success";
  }

  if (status === "loss") {
    return "error";
  }

  return "warning";
};

//======================================================
// Generic Status Color
//======================================================

export const getStatusColor = (
  status
) => {
  const normalized = toSafeString(status).toLowerCase();
  switch (normalized) {
    case "completed":
    case "complete":
    case "success":
    case "successful":
    case "active":
    case "approved":
    case "profit":
      return "success";
    case "pending":
    case "processing":
    case "draft":
    case "warning":
      return "warning";
    case "cancelled":
    case "canceled":
    case "failed":
    case "failure":
    case "rejected":
    case "loss":
      return "error";
    default:
      return "default";
  }
};

//======================================================
// Report ID
//======================================================

export const getProfitLossId = (
  report
) => {
  if (!report) {
    return null;
  }
  return (
    report.id ??
    report.reportId ??
    report.profitLossReportId ??
    report.profitAndLossReportId ??
    report._id ??
    null
  );
};

//======================================================
// Normalize Report
//======================================================

export const normalizeProfitLossReport = (
  report = {}
) => {
  const revenue = toNumber(
    report.revenue ??
      report.totalRevenue ??
      report.salesAmount ??
      report.sales
  );

  const totalCost = toNumber(
    report.totalCost ??
      report.cost ??
      report.cogs ??
      report.costOfGoodsSold
  );

  const calculatedGrossProfit =
    calculateGrossProfit(
      revenue,
      totalCost
    );
  const grossProfit =
    report.grossProfit !==
      undefined &&
    report.grossProfit !== null &&
    report.grossProfit !== ""
      ? toNumber(
          report.grossProfit
        )
      : calculatedGrossProfit;

  const operatingExpenses =
    toNumber(
      report.operatingExpenses ??
        report.operatingExpense ??
        report.expenses ??
        report.totalExpenses
    );
  const calculatedNetProfit = calculateNetProfit(grossProfit,operatingExpenses);
  const netProfit =
    report.netProfit !==
      undefined &&
    report.netProfit !== null &&
    report.netProfit !== ""
      ? toNumber(
          report.netProfit
        )
      : calculatedNetProfit;

  return {
    ...report,

    id: getProfitLossId(
      report
    ),

    reportId:
      getProfitLossId(
        report
      ),

    date:
      report.date ??
      report.reportDate ??
      report.createdAt ??
      "",

    reportDate:
      report.reportDate ??
      report.date ??
      "",

    orderNumber:
      report.orderNumber ??
      report.orderNo ??
      report.orderID ??
      report.orderId ??
      "",

    orderNo:
      report.orderNo ??
      report.orderNumber ??
      "",

    marketplace:
      report.marketplace ??
      report.marketplaceName ??
      "",

    product:
      report.product ??
      report.productName ??
      "",

    productName:
      report.productName ??
      report.product ??
      "",

    category:
      report.category ??
      report.categoryName ??
      "",

    revenue,

    totalCost,

    grossProfit,

    operatingExpenses,

    netProfit,

    grossMargin:
      report.grossMargin ??
      calculateGrossMargin(
        revenue,
        grossProfit
      ),

    netMargin:
      report.netMargin ??
      calculateNetMargin(
        revenue,
        netProfit
      ),

    status:
      report.status ??
      "Completed",

    notes:
      report.notes ??
      "",
  };
};

//======================================================
// Normalize Reports
//======================================================

export const normalizeProfitLossReports = (
  reports = []
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  return reports.map(
    normalizeProfitLossReport
  );
};

//======================================================
// Search Report
//======================================================

export const reportMatchesSearch = (
  report,
  searchTerm
) => {
  const search =
    toSafeString(
      searchTerm
    ).toLowerCase();

  if (!search) {
    return true;
  }

  const normalized =
    normalizeProfitLossReport(
      report
    );

  const searchableText = [
    normalized.reportId,
    normalized.orderNumber,
    normalized.marketplace,
    normalized.product,
    normalized.category,
    normalized.status,
    normalized.notes,
  ]
    .map((value) =>
      toSafeString(
        value
      ).toLowerCase()
    )
    .join(" ");

  return searchableText.includes(
    search
  );
};

//======================================================
// Filter Reports
//======================================================

export const filterProfitLossReports = (
  reports = [],
  filters = {},
  searchTerm = ""
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  return reports.filter(
    (report) => {
      const item =
        normalizeProfitLossReport(
          report
        );

      if (
        searchTerm &&
        !reportMatchesSearch(
          item,
          searchTerm
        )
      ) {
        return false;
      }

      if (
        filters.dateFrom &&
        formatDateForInput(
          item.date
        ) <
          filters.dateFrom
      ) {
        return false;
      }

      if (
        filters.dateTo &&
        formatDateForInput(
          item.date
        ) >
          filters.dateTo
      ) {
        return false;
      }

      if (
        filters.marketplace &&
        toSafeString(
          item.marketplace
        ).toLowerCase() !==
          toSafeString(
            filters.marketplace
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        filters.category &&
        toSafeString(
          item.category
        ).toLowerCase() !==
          toSafeString(
            filters.category
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        filters.product &&
        !toSafeString(
          item.product
        )
          .toLowerCase()
          .includes(
            toSafeString(
              filters.product
            ).toLowerCase()
          )
      ) {
        return false;
      }

      if (
        filters.status &&
        toSafeString(
          item.status
        ).toLowerCase() !==
          toSafeString(
            filters.status
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        filters.minRevenue !==
          "" &&
        toNumber(
          item.revenue
        ) <
          toNumber(
            filters.minRevenue
          )
      ) {
        return false;
      }

      if (
        filters.maxRevenue !==
          "" &&
        toNumber(
          item.revenue
        ) >
          toNumber(
            filters.maxRevenue
          )
      ) {
        return false;
      }

      if (
        filters.minProfit !==
          "" &&
        toNumber(
          item.netProfit
        ) <
          toNumber(
            filters.minProfit
          )
      ) {
        return false;
      }

      if (
        filters.maxProfit !==
          "" &&
        toNumber(
          item.netProfit
        ) >
          toNumber(
            filters.maxProfit
          )
      ) {
        return false;
      }

      return true;
    }
  );
};

//======================================================
// Sort Reports
//======================================================

export const sortProfitLossReports = (
  reports = [],
  field = "date",
  direction = "desc"
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  const multiplier =
    direction === "asc"
      ? 1
      : -1;

  return [...reports].sort(
    (a, b) => {
      const first =
        normalizeProfitLossReport(
          a
        );

      const second =
        normalizeProfitLossReport(
          b
        );

      let firstValue =
        first[field];

      let secondValue =
        second[field];

      if (
        field === "date" ||
        field === "reportDate"
      ) {
        firstValue =
          new Date(
            firstValue || 0
          ).getTime();

        secondValue =
          new Date(
            secondValue || 0
          ).getTime();
      } else if (
        [
          "revenue",
          "totalCost",
          "grossProfit",
          "operatingExpenses",
          "netProfit",
          "grossMargin",
          "netMargin",
        ].includes(field)
      ) {
        firstValue =
          toNumber(
            firstValue
          );

        secondValue =
          toNumber(
            secondValue
          );
      } else {
        firstValue =
          toSafeString(
            firstValue
          ).toLowerCase();

        secondValue =
          toSafeString(
            secondValue
          ).toLowerCase();
      }

      if (
        firstValue <
        secondValue
      ) {
        return -1 * multiplier;
      }

      if (
        firstValue >
        secondValue
      ) {
        return 1 * multiplier;
      }

      return 0;
    }
  );
};

//======================================================
// Paginate Reports
//======================================================

export const paginateReports = (
  reports = [],
  page = 1,
  pageSize = 10
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  const safePage =
    Math.max(
      1,
      toNumber(page, 1)
    );

  const safePageSize =
    Math.max(
      1,
      toNumber(
        pageSize,
        10
      )
    );

  const start =
    (safePage - 1) *
    safePageSize;

  return reports.slice(
    start,
    start + safePageSize
  );
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateProfitLossStatistics = (
  reports = []
) => {
  const items =
    normalizeProfitLossReports(
      reports
    );

  const totalRevenue =
    items.reduce(
      (sum, item) =>
        sum +
        toNumber(
          item.revenue
        ),
      0
    );

  const totalCost =
    items.reduce(
      (sum, item) =>
        sum +
        toNumber(
          item.totalCost
        ),
      0
    );

  const grossProfit =
    items.reduce(
      (sum, item) =>
        sum +
        toNumber(
          item.grossProfit
        ),
      0
    );

  const operatingExpenses =
    items.reduce(
      (sum, item) =>
        sum +
        toNumber(
          item.operatingExpenses
        ),
      0
    );

  const netProfit =
    items.reduce(
      (sum, item) =>
        sum +
        toNumber(
          item.netProfit
        ),
      0
    );

  return {
    totalRevenue,

    totalCost,

    grossProfit,

    operatingExpenses,

    netProfit,

    grossMargin:
      calculateGrossMargin(
        totalRevenue,
        grossProfit
      ),

    netMargin:
      calculateNetMargin(
        totalRevenue,
        netProfit
      ),

    totalOrders:
      items.length,

    profitableOrders:
      items.filter(
        (item) =>
          toNumber(
            item.netProfit
          ) > 0
      ).length,

    lossMakingOrders:
      items.filter(
        (item) =>
          toNumber(
            item.netProfit
          ) < 0
      ).length,

    breakEvenOrders:
      items.filter(
        (item) =>
          toNumber(
            item.netProfit
          ) === 0
      ).length,
  };
};

//======================================================
// Extract Unique Values
//======================================================

export const getUniqueValues = (
  reports = [],
  field
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  return [
    ...new Set(
      reports
        .map((report) => {
          const normalized =
            normalizeProfitLossReport(
              report
            );

          return toSafeString(
            normalized[field]
          );
        })
        .filter(Boolean)
    ),
  ].sort(
    (a, b) =>
      a.localeCompare(b)
  );
};

//======================================================
// Marketplace List
//======================================================

export const getMarketplaceOptions = (
  reports = []
) => {
  return getUniqueValues(
    reports,
    "marketplace"
  );
};

//======================================================
// Category List
//======================================================

export const getCategoryOptions = (
  reports = []
) => {
  return getUniqueValues(
    reports,
    "category"
  );
};

//======================================================
// Status List
//======================================================

export const getStatusOptions = (
  reports = []
) => {
  return getUniqueValues(
    reports,
    "status"
  );
};

//======================================================
// Default Filters
//======================================================

export const getDefaultProfitLossFilters =
  () => ({
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

//======================================================
// Check Active Filters
//======================================================

export const hasActiveProfitLossFilters = (
  filters = {}
) => {
  return Object.values(
    filters
  ).some(
    (value) =>
      value !== "" &&
      value !== null &&
      value !== undefined
  );
};

//======================================================
// Export
//======================================================

export default {
  toNumber,
  toSafeString,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateForInput,
  calculateGrossProfit,
  calculateNetProfit,
  calculateGrossMargin,
  calculateNetMargin,
  getProfitStatus,
  getProfitStatusColor,
  getStatusColor,
  getProfitLossId,
  normalizeProfitLossReport,
  normalizeProfitLossReports,
  reportMatchesSearch,
  filterProfitLossReports,
  sortProfitLossReports,
  paginateReports,
  calculateProfitLossStatistics,
  getUniqueValues,
  getMarketplaceOptions,
  getCategoryOptions,
  getStatusOptions,
  getDefaultProfitLossFilters,
  hasActiveProfitLossFilters,
};

