//======================================================
// SalesReportHelpers.js
//======================================================

//======================================================
// Normalize Value
//======================================================

export const normalizeValue = (
  value,
  fallback = ""
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return value;
};

//======================================================
// Number Conversion
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

  const number =
    Number(
      String(value).replace(
        /,/g,
        ""
      )
    );

  return Number.isFinite(number)
    ? number
    : fallback;
};

//======================================================
// Format Number
//======================================================

export const formatNumber = (
  value,
  decimals = 0
) => {
  const number = toNumber(
    value
  );

  return new Intl.NumberFormat(
    "en-IN",
    {
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals,
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
  const number = toNumber(
    value
  );

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(number);
  } catch {
    return `₹${number.toFixed(
      2
    )}`;
  }
};

//======================================================
// Format Date
//======================================================

export const formatDate = (
  value
) => {
  if (!value) {
    return "-";
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
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};

//======================================================
// Normalize Status
//======================================================

export const normalizeStatus = (
  status
) => {
  if (
    status === null ||
    status === undefined ||
    status === ""
  ) {
    return "Pending";
  }

  return String(status)
    .trim()
    .toLowerCase();
};

//======================================================
// Display Status
//======================================================

export const displayStatus = (
  status
) => {
  const normalized =
    normalizeStatus(status);

  return normalized
    .replace(
      /[_-]+/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};

//======================================================
// Status Color
//======================================================

export const getStatusColor = (
  status
) => {
  const normalized =
    normalizeStatus(status);

  switch (normalized) {
    case "completed":
    case "complete":
    case "success":
    case "successful":
    case "paid":
    case "delivered":
    case "active":
    case "approved":
      return "success";

    case "pending":
    case "processing":
    case "in progress":
    case "in_progress":
    case "awaiting":
      return "warning";

    case "cancelled":
    case "canceled":
    case "failed":
    case "failure":
    case "rejected":
    case "returned":
    case "refunded":
      return "error";

    case "shipped":
    case "dispatched":
    case "confirmed":
    case "information":
      return "info";

    default:
      return "default";
  }
};

//======================================================
// Normalize Sales Report
//======================================================

export const normalizeSalesReport = (
 report = {}
) => {
  if (
    !report ||
    typeof report !==
      "object"
  ) {
    return {};
  }

  const quantity = toNumber(
    report.quantity ??
      report.totalQuantity ??
      report.soldQuantity ??
      report.qty ??
      0
  );

  const salesAmount =
    toNumber(
      report.salesAmount ??
        report.totalSales ??
        report.subTotal ??
        report.subtotal ??
        report.amount ??
        0
    );

  const taxAmount =
    toNumber(
      report.taxAmount ??
        report.tax ??
        report.totalTax ??
        0
    );

  const totalAmount =
    toNumber(
      report.totalAmount ??
        report.total ??
        report.grandTotal ??
        salesAmount +
          taxAmount
    );

  return {
    ...report,

    id:
      report.id ??
      report.reportId ??
      report.salesReportId ??
      null,

    reportId:
      report.reportId ??
      report.id ??
      null,

    date:
      report.date ??
      report.salesDate ??
      report.orderDate ??
      report.invoiceDate ??
      null,

    orderNumber:
      report.orderNumber ??
      report.orderNo ??
      report.order_number ??
      report.invoiceNumber ??
      report.invoiceNo ??
      report.orderId ??
      "",

    invoiceNumber:
      report.invoiceNumber ??
      report.invoiceNo ??
      "",

    customerName:
      report.customerName ??
      report.customer ??
      report.customer_name ??
      report.buyerName ??
      "",

    productName:
      report.productName ??
      report.product ??
      report.itemName ??
      report.product_name ??
      "",

    marketplace:
      report.marketplace ??
      report.marketplaceName ??
      "",

    category:
      report.category ??
      report.categoryName ??
      "",

    quantity,

    salesAmount,

    taxAmount,

    totalAmount,

    status:
      report.status ??
      report.orderStatus ??
      "Pending",
  };
};

//======================================================
// Normalize Reports
//======================================================

export const normalizeSalesReports = (
  reports = []
) => {
  if (
    !Array.isArray(reports)
  ) {
    return [];
  }

  return reports.map(
    normalizeSalesReport
  );
};

//======================================================
// Search Reports
//======================================================

export const searchSalesReports = (
  reports = [],
  searchTerm = ""
) => {
  const normalizedReports =
    normalizeSalesReports(
      reports
    );

  const search =
    String(searchTerm)
      .trim()
      .toLowerCase();

  if (!search) {
    return normalizedReports;
  }

  return normalizedReports.filter(
    (report) => {
      const searchableFields = [
        report.orderNumber,
        report.invoiceNumber,
        report.customerName,
        report.productName,
        report.marketplace,
        report.category,
        report.status,
      ];

      return searchableFields.some(
        (field) =>
          String(
            field ?? ""
          )
            .toLowerCase()
            .includes(search)
      );
    }
  );
};

//======================================================
// Filter Reports
//======================================================

export const filterSalesReports = (
  reports = [],
  filters = {}
) => {
  const normalizedReports =
    normalizeSalesReports(
      reports
    );

  return normalizedReports.filter(
    (report) => {
      const marketplace =
        filters.marketplace;

      const category =
        filters.category;

      const status =
        filters.status;

      const customer =
        filters.customer;

      const startDate =
        filters.startDate;

      const endDate =
        filters.endDate;

      if (
        marketplace &&
        String(
          report.marketplace
        ).toLowerCase() !==
          String(
            marketplace
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        category &&
        String(
          report.category
        ).toLowerCase() !==
          String(
            category
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        status &&
        normalizeStatus(
          report.status
        ) !==
          normalizeStatus(
            status
          )
      ) {
        return false;
      }

      if (
        customer &&
        !String(
          report.customerName
        )
          .toLowerCase()
          .includes(
            String(
              customer
            ).toLowerCase()
          )
      ) {
        return false;
      }

      if (
        startDate &&
        report.date
      ) {
        const reportDate =
          new Date(
            report.date
          );

        const start =
          new Date(
            startDate
          );

        if (
          reportDate <
          start
        ) {
          return false;
        }
      }

      if (
        endDate &&
        report.date
      ) {
        const reportDate =
          new Date(
            report.date
          );

        const end =
          new Date(
            endDate
          );

        end.setHours(
          23,
          59,
          59,
          999
        );

        if (
          reportDate >
          end
        ) {
          return false;
        }
      }

      return true;
    }
  );
};

//======================================================
// Sort Reports
//======================================================

export const sortSalesReports = (
  reports = [],
  field = "date",
  direction = "desc"
) => {
  const normalizedReports =
    normalizeSalesReports(
      reports
    );

  const multiplier =
    direction === "asc"
      ? 1
      : -1;

  return [
    ...normalizedReports,
  ].sort(
    (a, b) => {
      let first =
        a?.[field];

      let second =
        b?.[field];

      if (
        field ===
          "date" ||
        field ===
          "salesDate" ||
        field ===
          "orderDate"
      ) {
        first = new Date(
          first || 0
        ).getTime();

        second = new Date(
          second || 0
        ).getTime();
      } else if (
        [
          "quantity",
          "salesAmount",
          "taxAmount",
          "totalAmount",
        ].includes(field)
      ) {
        first = toNumber(
          first
        );

        second = toNumber(
          second
        );
      } else {
        first = String(
          first ?? ""
        ).toLowerCase();

        second = String(
          second ?? ""
        ).toLowerCase();
      }

      if (first < second) {
        return -1 * multiplier;
      }

      if (first > second) {
        return 1 * multiplier;
      }

      return 0;
    }
  );
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateSalesStatistics = (
  reports = []
) => {
  const normalized =
    normalizeSalesReports(
      reports
    );

  const totalSales =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.salesAmount
        ),
      0
    );

  const totalOrders =
    normalized.length;

  const totalQuantity =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.quantity
        ),
      0
    );

  const totalProducts =
    new Set(
      normalized
        .map(
          (report) =>
            report.productName
        )
        .filter(Boolean)
    ).size;

  const averageOrderValue =
    totalOrders > 0
      ? totalSales /
        totalOrders
      : 0;

  const totalTax =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.taxAmount
        ),
      0
    );

  const totalAmount =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.totalAmount
        ),
      0
    );

  return {
    totalSales,
    totalOrders,
    totalQuantity,
    totalProducts,
    averageOrderValue,
    totalTax,
    totalAmount,
  };
};

//======================================================
// Get Unique Values
//======================================================

export const getUniqueSalesValues = (
  reports = [],
  field
) => {
  if (
    !Array.isArray(reports) ||
    !field
  ) {
    return [];
  }

  return [
    ...new Set(
      reports
        .map(
          (report) =>
            normalizeSalesReport(
              report
            )?.[field]
        )
        .filter(
          (value) =>
            value !==
              null &&
            value !==
              undefined &&
            value !== ""
        )
    ),
  ].sort(
    (a, b) =>
      String(a).localeCompare(
        String(b)
      )
  );
};

//======================================================
// Escape CSV Value
//======================================================

const escapeCSVValue = (
  value
) => {
  const text =
    value === null ||
    value === undefined
      ? ""
      : String(value);

  return `"${text.replace(
    /"/g,
    '""'
  )}"`;
};

//======================================================
// Build Export Rows
//======================================================

export const buildSalesExportRows = (
  reports = []
) => {
  return normalizeSalesReports(
    reports
  ).map(
    (report) => ({
      Date: formatDate(
        report.date
      ),

      "Order Number":
        report.orderNumber ||
        "-",

      Customer:
        report.customerName ||
        "-",

      Product:
        report.productName ||
        "-",

      Marketplace:
        report.marketplace ||
        "-",

      Category:
        report.category ||
        "-",

      Quantity:
        report.quantity,

      "Sales Amount":
        report.salesAmount,

      Tax:
        report.taxAmount,

      "Total Amount":
        report.totalAmount,

      Status:
        displayStatus(
          report.status
        ),
    })
  );
};

//======================================================
// Download Blob
//======================================================

export const downloadBlob = (
  content,
  fileName,
  mimeType
) => {
  const blob =
    content instanceof Blob
      ? content
      : new Blob(
          [content],
          {
            type: mimeType,
          }
        );

  const url =
    window.URL.createObjectURL(
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

  window.URL.revokeObjectURL(
    url
  );
};

//======================================================
// Export CSV
//======================================================

export const exportSalesReportCSV = (
  reports = [],
  fileName = "sales-report"
) => {
  const rows =
    buildSalesExportRows(
      reports
    );

  if (rows.length === 0) {
    return;
  }

  const headers =
    Object.keys(
      rows[0]
    );

  const csv = [
    headers
      .map(escapeCSVValue)
      .join(","),

    ...rows.map(
      (row) =>
        headers
          .map(
            (header) =>
              escapeCSVValue(
                row[header]
              )
          )
          .join(",")
    ),
  ].join("\n");

  downloadBlob(
    `\uFEFF${csv}`,
    `${fileName}.csv`,
    "text/csv;charset=utf-8;"
  );
};

//======================================================
// Export Excel
//======================================================

export const exportSalesReportExcel = async (
  reports = [],
  fileName = "sales-report"
) => {
  const rows =
    buildSalesExportRows(
      reports
    );

  if (rows.length === 0) {
    return;
  }

  try {
    const XLSX =
      await import(
        "xlsx"
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        rows
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Sales Report"
    );

    XLSX.writeFile(
      workbook,
      `${fileName}.xlsx`
    );
  } catch (error) {
    console.error(
      "Excel export failed:",
      error
    );

    // Fallback to CSV if
    // xlsx is not installed.
    exportSalesReportCSV(
      reports,
      fileName
    );
  }
};

//======================================================
// Export PDF
//======================================================

export const exportSalesReportPDF = async (
  reports = [],
  fileName = "sales-report"
) => {
  const rows =
    buildSalesExportRows(
      reports
    );

  if (rows.length === 0) {
    return;
  }

  try {
    const jsPDFModule =
      await import(
        "jspdf"
      );

    const autoTableModule =
      await import(
        "jspdf-autotable"
      );

    const jsPDF =
      jsPDFModule.jsPDF ||
      jsPDFModule.default;

    const doc =
      new jsPDF({
        orientation:
          "landscape",
        unit: "mm",
        format: "a4",
      });

    const headers =
      Object.keys(
        rows[0]
      );

    const body =
      rows.map(
        (row) =>
          headers.map(
            (header) =>
              row[header]
          )
      );

    doc.setFontSize(16);

    doc.text(
      "Sales Report",
      14,
      15
    );

    doc.setFontSize(9);

    doc.text(
      `Generated: ${formatDate(
        new Date()
      )}`,
      14,
      21
    );

    const autoTable =
      autoTableModule.default ||
      autoTableModule;

    if (
      typeof autoTable ===
      "function"
    ) {
      autoTable(doc, {
        startY: 26,
        head: [headers],
        body,
        styles: {
          fontSize: 7,
        },
        headStyles: {
          fontStyle:
            "bold",
        },
        margin: {
          left: 10,
          right: 10,
        },
      });
    } else {
      doc.autoTable({
        startY: 26,
        head: [headers],
        body,
        styles: {
          fontSize: 7,
        },
      });
    }

    doc.save(
      `${fileName}.pdf`
    );
  } catch (error) {
    console.error(
      "PDF export failed:",
      error
    );

    // CSV fallback keeps
    // export functionality
    // available if PDF
    // dependencies are absent.
    exportSalesReportCSV(
      reports,
      fileName
    );
  }
};

//======================================================
// Pagination Helper
//======================================================

export const paginateSalesReports = (
  reports = [],
  page = 1,
  pageSize = 10
) => {
  const safeReports =
    Array.isArray(reports)
      ? reports
      : [];

  const safePageSize =
    Math.max(
      1,
      toNumber(
        pageSize,
        10
      )
    );

  const totalRecords =
    safeReports.length;

  const totalPages =
    totalRecords === 0
      ? 0
      : Math.ceil(
          totalRecords /
            safePageSize
        );

  const safePage =
    totalPages === 0
      ? 1
      : Math.min(
          Math.max(
            1,
            toNumber(
              page,
              1
            )
          ),
          totalPages
        );

  const startIndex =
    (safePage - 1) *
    safePageSize;

  const data =
    safeReports.slice(
      startIndex,
      startIndex +
        safePageSize
    );

  return {
    data,
    page: safePage,
    pageSize:
      safePageSize,
    totalRecords,
    totalPages,
  };
};

//======================================================
// Prepare Sales Reports
//======================================================

export const prepareSalesReports = (
  reports = [],
  {
    search = "",
    filters = {},
    sortField = "date",
    sortDirection = "desc",
    page = 1,
    pageSize = 10,
  } = {}
) => {
  let result =
    normalizeSalesReports(
      reports
    );

  result =
    searchSalesReports(
      result,
      search
    );

  result =
    filterSalesReports(
      result,
      filters
    );

  result =
    sortSalesReports(
      result,
      sortField,
      sortDirection
    );

  return paginateSalesReports(
    result,
    page,
    pageSize
  );
};

//======================================================
// Default Export
//======================================================

export default {
  normalizeValue,
  toNumber,
  formatNumber,
  formatCurrency,
  formatDate,
  normalizeStatus,
  displayStatus,
  getStatusColor,
  normalizeSalesReport,
  normalizeSalesReports,
  searchSalesReports,
  filterSalesReports,
  sortSalesReports,
  calculateSalesStatistics,
  getUniqueSalesValues,
  buildSalesExportRows,
  downloadBlob,
  exportSalesReportCSV,
  exportSalesReportExcel,
  exportSalesReportPDF,
  paginateSalesReports,
  prepareSalesReports,
};
