
//======================================================
// PurchaseReportHelpers.js
//======================================================

/**
 * Safely convert a value to a number.
 */
export const toNumber = (value, fallback = 0) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(
    String(value).replace(/,/g, "")
  );

  return Number.isFinite(number)
    ? number
    : fallback;
};

/**
 * Safely convert a value to a string.
 */
export const toString = (
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
 * Format currency.
 *
 * Default currency is INR because this
 * application is designed for the Indian
 * marketplace/seller environment.
 */
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

/**
 * Format regular numbers.
 */
export const formatNumber = (
  value,
  maximumFractionDigits = 2
) => {
  const number = toNumber(value);

  return new Intl.NumberFormat(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits,
    }
  ).format(number);
};

/**
 * Format date values.
 */
export const formatDate = (
  value,
  fallback = "—"
) => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

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
      month: "short",
      year: "numeric",
    }
  ).format(date);
};

/**
 * Convert a date into YYYY-MM-DD.
 */
export const toDateInputValue = (
  value
) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

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

/**
 * Normalize status text.
 */
export const normalizeStatus = (
  status
) => {
  const value = toString(
    status
  )
    .trim()
    .toLowerCase();

  if (!value) {
    return "completed";
  }

  return value;
};

/**
 * Return an MUI-compatible Chip color.
 */
export const getStatusColor = (
  status
) => {
  const normalized =
    normalizeStatus(status);

  switch (normalized) {
    case "completed":
    case "complete":
    case "received":
    case "approved":
    case "paid":
    case "success":
      return "success";

    case "pending":
    case "processing":
    case "in progress":
      return "warning";

    case "cancelled":
    case "canceled":
    case "rejected":
    case "failed":
    case "failure":
      return "error";

    case "draft":
      return "default";

    case "partially received":
    case "partial":
      return "info";

    default:
      return "default";
  }
};

/**
 * Get the first available value from
 * a list of possible property names.
 */
export const firstValue = (
  object,
  keys = [],
  fallback = ""
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return fallback;
  }

  for (const key of keys) {
    const value =
      object[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return fallback;
};

/**
 * Normalize a single Purchase Report.
 *
 * Supports several common API property
 * naming conventions so the UI remains
 * compatible with different backend responses.
 */
export const normalizePurchaseReport = (
  report = {}
) => {
  const source =
    report &&
    typeof report === "object"
      ? report
      : {};

  const quantity =
    toNumber(
      firstValue(source, [
        "quantity",
        "totalQuantity",
        "qty",
        "orderedQuantity",
      ])
    );

  const unitCost =
    toNumber(
      firstValue(source, [
        "unitCost",
        "unitPrice",
        "purchasePrice",
        "price",
        "rate",
      ])
    );

  const tax =
    toNumber(
      firstValue(source, [
        "tax",
        "taxAmount",
        "totalTax",
        "gst",
        "gstAmount",
      ])
    );

  const discount =
    toNumber(
      firstValue(source, [
        "discount",
        "discountAmount",
      ])
    );

  const baseAmount =
    toNumber(
      firstValue(source, [
        "baseAmount",
        "subtotal",
        "subTotal",
        "basicAmount",
      ]),
      quantity * unitCost
    );

  const explicitTotal =
    firstValue(source, [
      "totalAmount",
      "purchaseAmount",
      "grandTotal",
      "netAmount",
      "amount",
      "total",
    ]);

  const totalAmount =
    explicitTotal !== ""
      ? toNumber(
          explicitTotal
        )
      : baseAmount +
        tax -
        discount;

  return {
    ...source,

    id: firstValue(
      source,
      [
        "id",
        "reportId",
        "purchaseReportId",
        "purchaseId",
      ]
    ),

    reportId: firstValue(
      source,
      [
        "reportId",
        "id",
        "purchaseReportId",
      ]
    ),

    purchaseOrderNumber:
      firstValue(source, [
        "purchaseOrderNumber",
        "poNumber",
        "purchaseOrderNo",
        "orderNumber",
        "orderNo",
      ]),

    date: firstValue(
      source,
      [
        "date",
        "purchaseDate",
        "orderDate",
        "createdAt",
        "transactionDate",
      ]
    ),

    supplierName:
      firstValue(source, [
        "supplierName",
        "supplier",
        "vendorName",
        "vendor",
        "supplierCompanyName",
      ]),

    marketplace:
      firstValue(source, [
        "marketplace",
        "marketplaceName",
        "marketplaceType",
        "platform",
      ]),

    category:
      firstValue(source, [
        "category",
        "categoryName",
        "productCategory",
      ]),

    productName:
      firstValue(source, [
        "productName",
        "product",
        "itemName",
        "item",
        "skuName",
      ]),

    sku: firstValue(
      source,
      [
        "sku",
        "SKU",
        "productSku",
        "itemSku",
      ]
    ),

    quantity,

    unitCost,

    baseAmount,

    tax,

    discount,

    totalAmount,

    status:
      firstValue(source, [
        "status",
        "purchaseStatus",
        "orderStatus",
        "paymentStatus",
      ]) ||
      "Completed",

    notes:
      firstValue(source, [
        "notes",
        "remarks",
        "description",
      ]),
  };
};

/**
 * Normalize an array of purchase reports.
 */
export const normalizePurchaseReports = (
 reports = []
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  return reports.map(
    normalizePurchaseReport
  );
};

/**
 * Calculate Purchase Report statistics.
 */
export const calculatePurchaseReportStatistics = (
  reports = []
) => {
  const normalized =
    normalizePurchaseReports(
      reports
    );

  if (!normalized.length) {
    return {
      totalPurchases: 0,
      totalOrders: 0,
      totalQuantity: 0,
      averagePurchase: 0,
      totalTax: 0,
      totalDiscount: 0,
      highestPurchase: 0,
      lowestPurchase: 0,
    };
  }

  const totalPurchases =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.totalAmount
        ),
      0
    );

  const totalQuantity =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.quantity
        ),
      0
    );

  const totalTax =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.tax
        ),
      0
    );

  const totalDiscount =
    normalized.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.discount
        ),
      0
    );

  const amounts =
    normalized.map(
      (report) =>
        toNumber(
          report.totalAmount
        )
    );

  const highestPurchase =
    Math.max(
      ...amounts
    );

  const lowestPurchase =
    Math.min(
      ...amounts
    );

  return {
    totalPurchases,

    totalOrders:
      normalized.length,

    totalQuantity,

    averagePurchase:
      normalized.length
        ? totalPurchases /
          normalized.length
        : 0,

    totalTax,

    totalDiscount,

    highestPurchase,

    lowestPurchase,
  };
};

/**
 * Filter purchase reports.
 */
export const filterPurchaseReports = (
  reports = [],
  filters = {}
) => {
  const normalized =
    normalizePurchaseReports(
      reports
    );

  if (
    !filters ||
    typeof filters !== "object"
  ) {
    return normalized;
  }

  const {
    marketplace = "",
    category = "",
    status = "",
    supplier = "",
    startDate = "",
    endDate = "",
    search = "",
  } = filters;

  const searchText =
    toString(search)
      .trim()
      .toLowerCase();

  return normalized.filter(
    (report) => {
      const reportMarketplace =
        toString(
          report.marketplace
        ).toLowerCase();

      const reportCategory =
        toString(
          report.category
        ).toLowerCase();

      const reportStatus =
        normalizeStatus(
          report.status
        );

      const reportSupplier =
        toString(
          report.supplierName
        ).toLowerCase();

      const reportProduct =
        toString(
          report.productName
        ).toLowerCase();

      const reportPO =
        toString(
          report.purchaseOrderNumber
        ).toLowerCase();

      const matchesMarketplace =
        !marketplace ||
        reportMarketplace ===
          toString(
            marketplace
          ).toLowerCase();

      const matchesCategory =
        !category ||
        reportCategory ===
          toString(
            category
          ).toLowerCase();

      const matchesStatus =
        !status ||
        reportStatus ===
          normalizeStatus(
            status
          );

      const matchesSupplier =
        !supplier ||
        reportSupplier.includes(
          toString(
            supplier
          ).toLowerCase()
        );

      const matchesSearch =
        !searchText ||
        reportSupplier.includes(
          searchText
        ) ||
        reportProduct.includes(
          searchText
        ) ||
        reportPO.includes(
          searchText
        ) ||
        reportMarketplace.includes(
          searchText
        );

      let matchesDate = true;

      if (
        startDate ||
        endDate
      ) {
        const reportDate =
          new Date(
            report.date
          );

        if (
          Number.isNaN(
            reportDate.getTime()
          )
        ) {
          matchesDate = false;
        } else {
          if (startDate) {
            const start =
              new Date(
                `${startDate}T00:00:00`
              );

            if (
              reportDate < start
            ) {
              matchesDate = false;
            }
          }

          if (endDate) {
            const end =
              new Date(
                `${endDate}T23:59:59`
              );

            if (
              reportDate > end
            ) {
              matchesDate = false;
            }
          }
        }
      }

      return (
        matchesMarketplace &&
        matchesCategory &&
        matchesStatus &&
        matchesSupplier &&
        matchesSearch &&
        matchesDate
      );
    }
  );
};

/**
 * Search purchase reports.
 */
export const searchPurchaseReports = (
  reports = [],
  search = ""
) => {
  return filterPurchaseReports(
    reports,
    {
      search,
    }
  );
};

/**
 * Sort purchase reports.
 */
export const sortPurchaseReports = (
  reports = [],
  sortField = "date",
  sortDirection = "desc"
) => {
  const normalized =
    normalizePurchaseReports(
      reports
    );

  const direction =
    sortDirection === "asc"
      ? 1
      : -1;

  return [
    ...normalized,
  ].sort(
    (a, b) => {
      let valueA;
      let valueB;

      switch (sortField) {
        case "date":
          valueA =
            new Date(
              a.date
            ).getTime() || 0;

          valueB =
            new Date(
              b.date
            ).getTime() || 0;
          break;

        case "quantity":
          valueA =
            toNumber(
              a.quantity
            );

          valueB =
            toNumber(
              b.quantity
            );
          break;

        case "unitCost":
          valueA =
            toNumber(
              a.unitCost
            );

          valueB =
            toNumber(
              b.unitCost
            );
          break;

        case "totalAmount":
          valueA =
            toNumber(
              a.totalAmount
            );

          valueB =
            toNumber(
              b.totalAmount
            );
          break;

        case "purchaseOrderNumber":
          valueA =
            toString(
              a.purchaseOrderNumber
            ).toLowerCase();

          valueB =
            toString(
              b.purchaseOrderNumber
            ).toLowerCase();
          break;

        case "supplierName":
          valueA =
            toString(
              a.supplierName
            ).toLowerCase();

          valueB =
            toString(
              b.supplierName
            ).toLowerCase();
          break;

        case "marketplace":
          valueA =
            toString(
              a.marketplace
            ).toLowerCase();

          valueB =
            toString(
              b.marketplace
            ).toLowerCase();
          break;

        default:
          valueA =
            toString(
              a[sortField]
            ).toLowerCase();

          valueB =
            toString(
              b[sortField]
            ).toLowerCase();
      }

      if (
        valueA < valueB
      ) {
        return -1 * direction;
      }

      if (
        valueA > valueB
      ) {
        return 1 * direction;
      }

      return 0;
    }
  );
};

/**
 * Paginate an array.
 */
export const paginatePurchaseReports = (
  reports = [],
  page = 1,
  pageSize = 10
) => {
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
    Array.isArray(reports)
      ? reports.length
      : 0;

  const totalPages =
    Math.ceil(
      totalRecords /
        safePageSize
    );

  const startIndex =
    (safePage - 1) *
    safePageSize;

  return {
    data: Array.isArray(
      reports
    )
      ? reports.slice(
          startIndex,
          startIndex +
            safePageSize
        )
      : [],

    page: safePage,

    pageSize:
      safePageSize,

    totalRecords,

    totalPages,
  };
};

/**
 * Get unique values from reports.
 */
export const getUniquePurchaseReportValues = (
  reports = [],
  field
) => {
  const normalized =
    normalizePurchaseReports(
      reports
    );

  return [
    ...new Set(
      normalized
        .map(
          (report) =>
            report[field]
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
  ];
};

/**
 * Get available marketplaces.
 */
export const getPurchaseMarketplaces = (
  reports = []
) => {
  return getUniquePurchaseReportValues(
    reports,
    "marketplace"
  );
};

/**
 * Get available categories.
 */
export const getPurchaseCategories = (
  reports = []
) => {
  return getUniquePurchaseReportValues(
    reports,
    "category"
  );
};

/**
 * Get available statuses.
 */
export const getPurchaseStatuses = (
  reports = []
) => {
  return getUniquePurchaseReportValues(
    reports,
    "status"
  );
};

/**
 * Get available suppliers.
 */
export const getPurchaseSuppliers = (
  reports = []
) => {
  return getUniquePurchaseReportValues(
    reports,
    "supplierName"
  );
};

/**
 * Create CSV-safe value.
 */
export const escapeCsvValue = (
  value
) => {
  const text =
    value === null ||
    value === undefined
      ? ""
      : String(value);

  if (
    /[",\n\r]/.test(
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

/**
 * Convert purchase reports to CSV.
 */
export const purchaseReportsToCsv = (
  reports = []
) => {
  const normalized =
    normalizePurchaseReports(
      reports
    );

  const rows =
    normalized.map(
      (report, index) => ({
        "S.No":
          index + 1,

        Date:
          formatDate(
            report.date,
            ""
          ),

        "Purchase Order":
          report.purchaseOrderNumber,

        Supplier:
          report.supplierName,

        Marketplace:
          report.marketplace,

        Category:
          report.category,

        Product:
          report.productName,

        SKU:
          report.sku,

        Quantity:
          report.quantity,

        "Unit Cost":
          report.unitCost,

        Tax:
          report.tax,

        Discount:
          report.discount,

        "Total Amount":
          report.totalAmount,

        Status:
          report.status,
      })
    );

  if (!rows.length) {
    return "";
  }

  const headers =
    Object.keys(
      rows[0]
    );

  const csv = [
    headers
      .map(
        escapeCsvValue
      )
      .join(","),

    ...rows.map(
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
    ),
  ].join("\n");

  return csv;
};

/**
 * Download a text/blob file.
 */
export const downloadFile = (
  content,
  fileName,
  mimeType = "text/plain"
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
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;
  link.download =
    fileName;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );
};

/**
 * Download Purchase Report CSV.
 */
export const downloadPurchaseReportCsv = (
  reports = [],
  fileName = "purchase-report.csv"
) => {
  const csv =
    purchaseReportsToCsv(
      reports
    );

  downloadFile(
    `\uFEFF${csv}`,
    fileName.endsWith(
      ".csv"
    )
      ? fileName
      : `${fileName}.csv`,
    "text/csv;charset=utf-8;"
  );
};

/**
 * Calculate totals for an array.
 */
export const calculatePurchaseTotals = (
  reports = []
) => {
  const normalized =
    normalizePurchaseReports(
      reports
    );

  return normalized.reduce(
    (totals, report) => {
      totals.quantity +=
        toNumber(
          report.quantity
        );

      totals.baseAmount +=
        toNumber(
          report.baseAmount
        );

      totals.tax +=
        toNumber(
          report.tax
        );

      totals.discount +=
        toNumber(
          report.discount
        );

      totals.totalAmount +=
        toNumber(
          report.totalAmount
        );

      return totals;
    },
    {
      quantity: 0,
      baseAmount: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
    }
  );
};

/**
 * Create a clean export filename.
 */
export const createPurchaseReportFileName = (
  extension = "csv"
) => {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  return `purchase-report-${year}-${month}-${day}.${extension}`;
};

/**
 * Check whether filters contain
 * active values.
 */
export const hasActivePurchaseFilters = (
  filters = {}
) => {
  if (
    !filters ||
    typeof filters !==
      "object"
  ) {
    return false;
  }

  return Object.values(
    filters
  ).some(
    (value) =>
      value !==
        null &&
      value !==
        undefined &&
      String(value).trim() !==
        ""
  );
};

/**
 * Reset Purchase Report filters.
 */
export const getDefaultPurchaseReportFilters =
  () => ({
    marketplace: "",
    category: "",
    status: "",
    supplier: "",
    startDate: "",
    endDate: "",
    search: "",
  });

/**
 * Get report display label.
 */
export const getPurchaseReportLabel = (
  report = {}
) => {
  const normalized =
    normalizePurchaseReport(
      report
    );

  return (
    normalized.purchaseOrderNumber ||
    normalized.productName ||
    normalized.supplierName ||
    "Purchase Report"
  );
};

/**
 * Validate date range.
 */
export const isValidPurchaseDateRange = (
  startDate,
  endDate
) => {
  if (
    !startDate ||
    !endDate
  ) {
    return true;
  }

  const start =
    new Date(
      `${startDate}T00:00:00`
    );

  const end =
    new Date(
      `${endDate}T23:59:59`
    );

  if (
    Number.isNaN(
      start.getTime()
    ) ||
    Number.isNaN(
      end.getTime()
    )
  ) {
    return false;
  }

  return start <= end;
};
