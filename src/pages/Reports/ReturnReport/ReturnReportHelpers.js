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
  const number = typeof value === "number" ? value : Number(String(value).replace(/,/g, "").replace(/[₹$€£]/g, "").trim());
  return Number.isFinite(number) ? number : fallback;
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
    return new Intl.NumberFormat("en-IN",
      {
        style: "currency",
        currency,
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
  maximumFractionDigits = 2
) => {
  const number = toNumber(value);
  return new Intl.NumberFormat( "en-IN",
    {
      maximumFractionDigits,
    }
  ).format(number);
};

//======================================================
// Date Formatter
//======================================================

export const formatDate = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString("en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};

//======================================================
// Status Color
//======================================================
export const getStatusColor = (
  status
) => {
  const normalized = String(status || "") .trim() .toLowerCase();
  switch (normalized) {
    case "approved":
    case "completed":
    case "complete":
    case "refunded":
    case "refund completed":
    case "received":
      return "success";
    case "pending":
    case "processing":
    case "requested":
    case "under review":
      return "warning";
    case "rejected":
    case "cancelled":
    case "canceled":
    case "failed":
      return "error";
    case "partial":
    case "partially refunded":
      return "info";
    default:
      return "default";
  }
};

//======================================================
// Normalize Return Report
//======================================================

export const normalizeReturnReport = (
 report = {}
) => {
  if ( !report || typeof report !== "object") {
    return {};
  }
  return {
    ...report,
    id: report.id ?? report.reportId ?? report.returnId ?? null,
    returnNumber: report.returnNumber ?? report.returnOrderNumber ?? report.returnNo ?? report.return_id ?? "",
    returnOrderNumber: report.returnOrderNumber ?? report.returnNumber ?? report.returnNo ?? "",
    orderNumber: report.orderNumber ?? report.orderNo ?? report.orderId ?? "",
    orderId: report.orderId ?? report.orderNumber ?? "",
    date: report.date ?? report.returnDate ?? report.returnedDate ?? report.createdAt ?? "",
    customerName: report.customerName ?? report.customer ?? report.buyerName ?? report.buyer ?? "",
    customer: report.customer ?? report.customerName ?? "",
    productName: report.productName ?? report.product ?? report.itemName ?? report.item ??  "",
    product: report.product ?? report.productName ?? "",
    quantity: toNumber(report.quantity ?? report.returnedQuantity ??report.returnQty),
    returnAmount: toNumber( report.returnAmount ?? report.totalReturnAmount ?? report.totalAmount ??report.amount),
    refundAmount:toNumber(report.refundAmount ??report.refundedAmount ??report.refund),
    reason: report.reason ?? report.returnReason ??report.reasonName ?? "",
    status: report.status ?? report.returnStatus ?? "Pending",
    marketplace: report.marketplace ?? report.marketplaceName ?? "",
    category: report.category ?? report.categoryName ?? "",
    notes: report.notes ?? report.note ?? report.remarks ?? "",
  };
};

//======================================================
// Search Return Reports
//======================================================

export const searchReturnReports = (
  reports = [],
  search = ""
) => {
  if (!Array.isArray(reports)) {
    return [];
  }
  const query = String(search || "").trim().toLowerCase();
  if (!query) {
    return reports;
  }
  return reports.filter(
    (report) => {
      const item = normalizeReturnReport(report);
      const searchableValues = [
        item.returnNumber,
        item.returnOrderNumber,
        item.orderNumber,
        item.orderId,
        item.customerName,
        item.customer,
        item.productName,
        item.product,
        item.reason,
        item.status,
        item.marketplace,
        item.category,
        item.notes,
      ];
      return searchableValues.some(
        (value) =>
          String(value ?? "").toLowerCase().includes(query)
      );
    }
  );
};

//======================================================
// Filter Return Reports
//======================================================

export const filterReturnReports = (
  reports = [],
  filters = {}
) => {
  if (!Array.isArray(reports)) {
    return [];
  }
  const {marketplace = "",category = "",status = "",reason = "",customer = "",startDate = "",endDate = "",search = ""} = filters || {};
  let result = searchReturnReports(reports,search);
  result = result.filter(
    (report) => {
      const item = normalizeReturnReport(report);
      if (
        marketplace &&
        String(item.marketplace).toLowerCase() !==
        String(marketplace).toLowerCase()
      ) {
        return false;
      }

      if (
        category &&
        String(
          item.category
        ).toLowerCase() !==
          String(
            category
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        status &&
        String(
          item.status
        ).toLowerCase() !==
          String(
            status
          ).toLowerCase()
      ) {
        return false;
      }

      if (reason && String(item.reason).toLowerCase() !== String(reason).toLowerCase()) {
        return false;
      }
      if (customer && !String(item.customerName).toLowerCase().includes( String(customer).toLowerCase())) {
        return false;
      }
      if (startDate &&item.date) {
        const reportDate = new Date(item.date);
        const fromDate = new Date(startDate);
        fromDate.setHours(0,0,0,0);
        if (reportDate <fromDate) {
          return false;
        }
      }
      if (endDate && item.date) {
        const reportDate =new Date(item.date);
        const toDate = new Date(endDate);
        toDate.setHours(23,59,59,999);
        if (reportDate >toDate) {
          return false;
        }
      }
      return true;
    }
  );
  return result;
};

//======================================================
// Sort Return Reports
//======================================================

export const sortReturnReports = (
  reports = [],
  field = "date",
  direction = "desc"
) => {
  if (!Array.isArray(reports)) {
    return [];
  }
  const multiplier = direction === "asc" ? 1  : -1;
  return [
    ...reports,
  ].sort((a, b) => {
    const first = normalizeReturnReport(a);
    const second = normalizeReturnReport(b);
    let valueA = first[field];
    let valueB = second[field];
    if (
      field === "quantity" ||
      field === "returnAmount" ||
      field === "refundAmount"
    ) {
      valueA = toNumber(valueA);
      valueB = toNumber(valueB);
    }
    if (field === "date") {
      valueA = new Date(
        valueA || 0
      ).getTime();
      valueB = new Date(valueB || 0).getTime();
    }
    if (
      valueA ===
      valueB
    ) {
      return 0;
    }
    if (
      valueA === null ||
      valueA === undefined ||
      valueA === ""
    ) {
      return 1 * multiplier;
    }
    if (
      valueB === null ||
      valueB === undefined ||
      valueB === ""
    ) {
      return -1 * multiplier;
    }
    if (
      typeof valueA === "number" &&
      typeof valueB === "number"
    ) {
      return ((valueA - valueB) *multiplier);
    }
    return String(valueA).localeCompare(String(valueB),undefined,
        {
          numeric: true,
          sensitivity:
            "base",
        }
      ) * multiplier;
  });
};

//======================================================
// Paginate Return Reports
//======================================================

export const paginateReturnReports = (
  reports = [],
  page = 1,
  pageSize = 10
) => {
  const safeReports = Array.isArray(reports) ? reports : [];
  const safePage = Math.max(1,Number(page) || 1);
  const safePageSize = Math.max(1,Number(pageSize) || 10);
  const totalRecords = safeReports.length;
  const totalPages = Math.max(1,Math.ceil(totalRecords /safePageSize));
  const currentPage = Math.min(safePage,totalPages);
  const startIndex =(currentPage - 1) *safePageSize;
  const endIndex =startIndex +safePageSize;
  return {
    data: safeReports.slice(startIndex,endIndex),
    page: currentPage,
    pageSize:safePageSize,
    totalRecords,
    totalPages,
    startIndex,
    endIndex,
  };
};

//======================================================
// Calculate Return Report Statistics
//======================================================

export const calculateReturnReportStatistics =
  (reports = []) => {
    const safeReports = Array.isArray(reports) ? reports : [];
    let totalQuantity = 0;
    let totalReturnAmount = 0;
    let totalRefundAmount = 0;
    const statusCounts = {};
    const reasonCounts = {};
    const marketplaceCounts = {};
    const categoryCounts = {};
    safeReports.forEach(
      (report) => {
        const item = normalizeReturnReport(report);
        totalQuantity += toNumber(item.quantity);
        totalReturnAmount += toNumber(item.returnAmount);
        totalRefundAmount +=toNumber(item.refundAmount);
        const status = item.status || "Pending";
        const reason = item.reason || "Not specified";
        const marketplace = item.marketplace || "Not specified";
        const category = item.category || "Not specified";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        marketplaceCounts[marketplace] = (marketplaceCounts[marketplace] || 0) + 1;
        categoryCounts[category] =(categoryCounts[category] || 0) + 1;
      }
    );
    return {
      totalReturns: safeReports.length,
      totalReturnCount:safeReports.length,
      returnCount: safeReports.length,
      totalQuantity,
      returnedQuantity:
      totalQuantity,
      totalReturnAmount,
      returnAmount:totalReturnAmount,
      totalRefundAmount,
      refundAmount:totalRefundAmount,
      averageReturnAmount:safeReports.length ? totalReturnAmount /safeReports.length : 0,
      averageRefundAmount:safeReports.length ? totalRefundAmount / safeReports.length: 0,
      statusCounts,
      reasonCounts,
      marketplaceCounts,
      categoryCounts,
    };
  };

//======================================================
// Get Unique Filter Values
//======================================================

export const getUniqueReturnReportValues =
  (
    reports = [],
    field
  ) => {
    if (!Array.isArray(reports) || !field) {
      return [];
    }
    const values = reports.map((report) => normalizeReturnReport(report)[field]).filter((value) =>value !==null && value !== undefined && value !== "");
    return [
      ...new Set(values.map((value) =>String(value))),
    ].sort((a, b) =>a.localeCompare(b,undefined,
          {
            numeric: true,
            sensitivity:
              "base",
          }
        )
    );
  };

//======================================================
// Convert Reports to CSV
//======================================================

export const returnReportsToCSV = (
  reports = []
) => {
  const safeReports = Array.isArray(reports)? reports : [];
  const headers = [
    "Return Number",
    "Date",
    "Order Number",
    "Customer",
    "Marketplace",
    "Category",
    "Product",
    "Quantity",
    "Return Amount",
    "Refund Amount",
    "Reason",
    "Status",
  ];

  const rows = safeReports.map( (report) => {
  const item = normalizeReturnReport( report);
  return [item.returnNumber,item.date,item.orderNumber,item.customerName,item.marketplace,item.category,item.productName,item.quantity,item.returnAmount,item.refundAmount,item.reason,item.status,];
      }
    );

  const escapeCSV = (
    value
  ) => {
    const text = String( value ?? "");
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

  return [headers.map(escapeCSV).join(","),
    ...rows.map((row) => row .map(escapeCSV).join(",")),
  ].join("\n");
};

//======================================================
// Download CSV
//======================================================

export const downloadReturnReportsCSV =
  (
    reports = [],
    fileName = "return-report"
  ) => {
    const csv = returnReportsToCSV(reports);
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;",});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

//======================================================
// Export Default Object
//======================================================

const ReturnReportHelpers = {
  toNumber,
  formatCurrency,
  formatNumber,
  formatDate,
  getStatusColor,
  normalizeReturnReport,
  searchReturnReports,
  filterReturnReports,
  sortReturnReports,
  paginateReturnReports,
  calculateReturnReportStatistics,
  getUniqueReturnReportValues,
  returnReportsToCSV,
  downloadReturnReportsCSV,
};

export default ReturnReportHelpers;

