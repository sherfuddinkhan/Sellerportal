//======================================================
// StockLedgerReportHelpers.js
//======================================================

//======================================================
// Safe Number
//======================================================

export const toNumber = (value, fallback = 0) => {
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
// Format Number
//======================================================

export const formatNumber = (
  value,
  decimals = 2
) => {
  const number = toNumber(value);

  return number.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

//======================================================
// Format Date
//======================================================

export const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return String(value);
  }
};

//======================================================
// Format Date For Input
//======================================================

export const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    return "";
  }
};

//======================================================
// First Available Value
//======================================================

const firstValue = (
  object,
  keys,
  fallback = ""
) => {
  for (const key of keys) {
    const value = object?.[key];

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      return value;
    }
  }

  return fallback;
};

//======================================================
// Normalize Stock Ledger Report
//======================================================

export const normalizeStockLedgerReport = (
  report = {}
) => {
  if (!report || typeof report !== "object") {
    return {};
  }

  const inwardQuantity = toNumber(
    firstValue(report, [
      "inwardQuantity",
      "InwardQuantity",
      "receiptQuantity",
      "ReceiptQuantity",
      "inQuantity",
      "InQuantity",
      "inward",
      "Inward",
      "receipt",
      "Receipt",
    ])
  );

  const outwardQuantity = toNumber(
    firstValue(report, [
      "outwardQuantity",
      "OutwardQuantity",
      "issueQuantity",
      "IssueQuantity",
      "outQuantity",
      "OutQuantity",
      "outward",
      "Outward",
      "issue",
      "Issue",
    ])
  );

  const closingValue = firstValue(
    report,
    [
      "closingQuantity",
      "ClosingQuantity",
      "closingStock",
      "ClosingStock",
      "balanceQuantity",
      "BalanceQuantity",
      "closing",
      "Closing",
      "balance",
      "Balance",
    ],
    null
  );

  const openingValue = firstValue(
    report,
    [
      "openingQuantity",
      "OpeningQuantity",
      "openingStock",
      "OpeningStock",
      "opening",
      "Opening",
    ],
    null
  );

  const openingQuantity =
    openingValue === null
      ? null
      : toNumber(openingValue);

  const closingQuantity =
    closingValue === null
      ? null
      : toNumber(closingValue);

  return {
    ...report,

    //==================================================
    // Identification
    //==================================================

    id: firstValue(report, [
      "id",
      "Id",
      "stockLedgerId",
      "StockLedgerId",
      "ledgerId",
      "LedgerId",
    ]),

    //==================================================
    // Date
    //==================================================

    date: firstValue(report, [
      "date",
      "Date",
      "transactionDate",
      "TransactionDate",
      "voucherDate",
      "VoucherDate",
    ]),

    //==================================================
    // Voucher
    //==================================================

    voucherNumber: firstValue(
      report,
      [
        "voucherNumber",
        "VoucherNumber",
        "voucherNo",
        "VoucherNo",
        "documentNumber",
        "DocumentNumber",
        "docNo",
        "DocNo",
      ]
    ),

    voucherType: firstValue(
      report,
      [
        "voucherType",
        "VoucherType",
        "transactionVoucherType",
        "TransactionVoucherType",
      ]
    ),

    transactionType: firstValue(
      report,
      [
        "transactionType",
        "TransactionType",
        "movementType",
        "MovementType",
        "stockMovementType",
        "StockMovementType",
      ]
    ),

    //==================================================
    // Stock Item
    //==================================================

    stockItem: firstValue(
      report,
      [
        "stockItem",
        "StockItem",
        "stockItemName",
        "StockItemName",
        "itemName",
        "ItemName",
        "productName",
        "ProductName",
      ]
    ),

    itemName: firstValue(
      report,
      [
        "itemName",
        "ItemName",
        "stockItem",
        "StockItem",
        "stockItemName",
        "StockItemName",
      ]
    ),

    stockItemId: firstValue(
      report,
      [
        "stockItemId",
        "StockItemId",
        "itemId",
        "ItemId",
        "productId",
        "ProductId",
      ]
    ),

    //==================================================
    // Location
    //==================================================

    warehouse: firstValue(
      report,
      [
        "warehouse",
        "Warehouse",
        "warehouseName",
        "WarehouseName",
      ]
    ),

    warehouseId: firstValue(
      report,
      [
        "warehouseId",
        "WarehouseId",
      ]
    ),

    godown: firstValue(
      report,
      [
        "godown",
        "Godown",
        "godownName",
        "GodownName",
        "location",
        "Location",
      ]
    ),

    godownId: firstValue(
      report,
      [
        "godownId",
        "GodownId",
        "locationId",
        "LocationId",
      ]
    ),

    //==================================================
    // Quantities
    //==================================================

    openingQuantity,

    inwardQuantity,

    outwardQuantity,

    closingQuantity,

    balanceQuantity:
      closingQuantity,

    //==================================================
    // Unit
    //==================================================

    unit: firstValue(report, [
      "unit",
      "Unit",
      "unitName",
      "UnitName",
      "uom",
      "UOM",
      "quantityUnit",
      "QuantityUnit",
    ]),

    //==================================================
    // Remarks
    //==================================================

    remarks: firstValue(
      report,
      [
        "remarks",
        "Remarks",
        "remark",
        "Remark",
        "notes",
        "Notes",
        "description",
        "Description",
      ]
    ),

    notes: firstValue(
      report,
      [
        "notes",
        "Notes",
        "remarks",
        "Remarks",
        "remark",
        "Remark",
      ]
    ),

    //==================================================
    // Status
    //==================================================

    status: firstValue(
      report,
      [
        "status",
        "Status",
        "transactionStatus",
        "TransactionStatus",
      ],
      "Pending"
    ),
  };
};

//======================================================
// Normalize Multiple Reports
//======================================================

export const normalizeStockLedgerReports = (
  reports = []
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  return reports.map(
    normalizeStockLedgerReport
  );
};

//======================================================
// Calculate Stock Balance
//======================================================

export const calculateStockBalance = (
  openingQuantity = 0,
  inwardQuantity = 0,
  outwardQuantity = 0
) => {
  return (
    toNumber(openingQuantity) +
    toNumber(inwardQuantity) -
    toNumber(outwardQuantity)
  );
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateStockLedgerStatistics = (
  reports = []
) => {
  const normalizedReports =
    normalizeStockLedgerReports(
      reports
    );

  const totalEntries =
    normalizedReports.length;

  const totalInward =
    normalizedReports.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.inwardQuantity
        ),
      0
    );

  const totalOutward =
    normalizedReports.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.outwardQuantity
        ),
      0
    );

  const totalOpening =
    normalizedReports.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.openingQuantity
        ),
      0
    );

  const totalClosing =
    normalizedReports.reduce(
      (sum, report) =>
        sum +
        toNumber(
          report.closingQuantity
        ),
      0
    );

  return {
    totalEntries,
    totalInward,
    totalOutward,
    totalOpening,
    totalClosing,
  };
};

//======================================================
// Get Status Color
//======================================================

export const getStockLedgerStatusColor = (
  status
) => {
  const normalizedStatus =
    String(
      status || ""
    )
      .trim()
      .toLowerCase();

  switch (normalizedStatus) {
    case "active":
    case "completed":
    case "complete":
    case "success":
    case "approved":
      return "success";

    case "pending":
    case "processing":
    case "draft":
      return "warning";

    case "cancelled":
    case "canceled":
    case "rejected":
    case "failed":
    case "error":
      return "error";

    case "inactive":
      return "default";

    default:
      return "info";
  }
};

//======================================================
// Get Transaction Color
//======================================================

export const getStockLedgerTransactionColor = (
  transactionType
) => {
  const type = String(
    transactionType || ""
  )
    .trim()
    .toLowerCase();

  if (
    type.includes("inward") ||
    type.includes("receipt") ||
    type.includes("purchase") ||
    type.includes("receive")
  ) {
    return "success";
  }

  if (
    type.includes("outward") ||
    type.includes("issue") ||
    type.includes("sales") ||
    type.includes("sale") ||
    type.includes("delivery")
  ) {
    return "error";
  }

  if (
    type.includes("transfer") ||
    type.includes("adjust")
  ) {
    return "warning";
  }

  return "default";
};

//======================================================
// Get Transaction Label
//======================================================

export const getStockLedgerTransactionLabel = (
  transactionType
) => {
  if (!transactionType) {
    return "-";
  }

  const value = String(
    transactionType
  )
    .trim()
    .toLowerCase();

  if (
    value.includes("inward") ||
    value.includes("receipt") ||
    value.includes("purchase") ||
    value.includes("receive")
  ) {
    return "Inward";
  }

  if (
    value.includes("outward") ||
    value.includes("issue") ||
    value.includes("sales") ||
    value.includes("sale") ||
    value.includes("delivery")
  ) {
    return "Outward";
  }

  if (
    value.includes("transfer")
  ) {
    return "Transfer";
  }

  if (
    value.includes("adjust")
  ) {
    return "Adjustment";
  }

  return String(
    transactionType
  );
};

//======================================================
// Filter Stock Ledger Reports
//======================================================

export const filterStockLedgerReports = (
  reports = [],
  filters = {},
  searchTerm = ""
) => {
  const normalizedReports =
    normalizeStockLedgerReports(
      reports
    );

  const search =
    String(searchTerm || "")
      .trim()
      .toLowerCase();

  return normalizedReports.filter(
    (report) => {
      //===============================================
      // Search
      //===============================================

      if (search) {
        const searchableText = [
          report.stockItem,
          report.itemName,
          report.voucherNumber,
          report.voucherType,
          report.transactionType,
          report.warehouse,
          report.godown,
          report.unit,
          report.remarks,
        ]
          .filter(
            (value) =>
              value !==
                null &&
              value !==
                undefined
          )
          .join(" ")
          .toLowerCase();

        if (
          !searchableText.includes(
            search
          )
        ) {
          return false;
        }
      }

      //===============================================
      // Stock Item
      //===============================================

      if (
        filters.stockItem &&
        String(
          report.stockItem
        ).toLowerCase() !==
          String(
            filters.stockItem
          ).toLowerCase()
      ) {
        return false;
      }

      //===============================================
      // Warehouse
      //===============================================

      if (
        filters.warehouse &&
        String(
          report.warehouse
        ).toLowerCase() !==
          String(
            filters.warehouse
          ).toLowerCase()
      ) {
        return false;
      }

      //===============================================
      // Godown
      //===============================================

      if (
        filters.godown &&
        String(
          report.godown
        ).toLowerCase() !==
          String(
            filters.godown
          ).toLowerCase()
      ) {
        return false;
      }

      //===============================================
      // Transaction Type
      //===============================================

      if (
        filters.transactionType &&
        String(
          report.transactionType
        ).toLowerCase() !==
          String(
            filters.transactionType
          ).toLowerCase()
      ) {
        return false;
      }

      //===============================================
      // Voucher Type
      //===============================================

      if (
        filters.voucherType &&
        String(
          report.voucherType
        ).toLowerCase() !==
          String(
            filters.voucherType
          ).toLowerCase()
      ) {
        return false;
      }

      //===============================================
      // Status
      //===============================================

      if (
        filters.status &&
        String(
          report.status
        ).toLowerCase() !==
          String(
            filters.status
          ).toLowerCase()
      ) {
        return false;
      }

      //===============================================
      // Start Date
      //===============================================

      if (
        filters.startDate
      ) {
        const reportDate =
          new Date(
            report.date
          );

        const startDate =
          new Date(
            filters.startDate
          );

        if (
          !Number.isNaN(
            reportDate.getTime()
          ) &&
          !Number.isNaN(
            startDate.getTime()
          ) &&
          reportDate <
            startDate
        ) {
          return false;
        }
      }

      //===============================================
      // End Date
      //===============================================

      if (
        filters.endDate
      ) {
        const reportDate =
          new Date(
            report.date
          );

        const endDate =
          new Date(
            filters.endDate
          );

        if (
          !Number.isNaN(
            reportDate.getTime()
          ) &&
          !Number.isNaN(
            endDate.getTime()
          )
        ) {
          endDate.setHours(
            23,
            59,
            59,
            999
          );

          if (
            reportDate >
            endDate
          ) {
            return false;
          }
        }
      }

      return true;
    }
  );
};

//======================================================
// Sort Stock Ledger Reports
//======================================================

export const sortStockLedgerReports = (
  reports = [],
  field = "date",
  direction = "desc"
) => {
  const normalizedReports =
    normalizeStockLedgerReports(
      reports
    );

  const multiplier =
    direction === "asc"
      ? 1
      : -1;

  return [
    ...normalizedReports,
  ].sort((a, b) => {
    let first = a?.[field];
    let second = b?.[field];

    if (
      field === "date"
    ) {
      first = new Date(
        first
      ).getTime();

      second = new Date(
        second
      ).getTime();

      if (
        Number.isNaN(first)
      ) {
        first = 0;
      }

      if (
        Number.isNaN(second)
      ) {
        second = 0;
      }
    }

    if (
      typeof first ===
      "number" ||
      typeof second ===
      "number"
    ) {
      return (
        (toNumber(first) -
          toNumber(second)) *
        multiplier
      );
    }

    return (
      String(
        first ?? ""
      ).localeCompare(
        String(
          second ?? ""
        ),
        undefined,
        {
          numeric: true,
          sensitivity:
            "base",
        }
      ) * multiplier
    );
  });
};

//======================================================
// Get Unique Values
//======================================================

export const getUniqueStockLedgerValues = (
  reports = [],
  field
) => {
  if (!field) {
    return [];
  }

  const values =
    normalizeStockLedgerReports(
      reports
    )
      .map(
        (report) =>
          report?.[field]
      )
      .filter(
        (value) =>
          value !==
            null &&
          value !==
            undefined &&
          value !== ""
      );

  return [
    ...new Set(
      values.map((value) =>
        String(value)
      )
    ),
  ].sort(
    (a, b) =>
      a.localeCompare(
        b,
        undefined,
        {
          numeric: true,
          sensitivity:
            "base",
        }
      )
  );
};

//======================================================
// Pagination
//======================================================

export const paginateStockLedgerReports = (
  reports = [],
  page = 1,
  pageSize = 10
) => {
  const safePage = Math.max(
    1,
    Number(page) || 1
  );

  const safePageSize =
    Math.max(
      1,
      Number(pageSize) || 10
    );

  const startIndex =
    (safePage - 1) *
    safePageSize;

  return reports.slice(
    startIndex,
    startIndex +
      safePageSize
  );
};

//======================================================
// Total Pages
//======================================================

export const getStockLedgerTotalPages = (
  totalRecords = 0,
  pageSize = 10
) => {
  const records =
    Math.max(
      0,
      Number(totalRecords) || 0
    );

  const size =
    Math.max(
      1,
      Number(pageSize) || 10
    );

  return Math.ceil(
    records / size
  );
};

//======================================================
// Export To CSV
//======================================================

export const exportStockLedgerToCSV = (
  rows = [],
  fileName = "StockLedgerReport"
) => {
  if (!Array.isArray(rows)) {
    return;
  }

  if (rows.length === 0) {
    return;
  }

  const headers =
    Object.keys(rows[0]);

  const escapeCSV = (value) => {
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

  const csvRows = [
    headers
      .map(escapeCSV)
      .join(","),
    ...rows.map((row) =>
      headers
        .map((header) =>
          escapeCSV(
            row[header]
          )
        )
        .join(",")
    ),
  ];

  const csvContent =
    csvRows.join("\r\n");

  const blob = new Blob(
    [csvContent],
    {
      type:
        "text/csv;charset=utf-8;",
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
    fileName.endsWith(".csv")
      ? fileName
      : `${fileName}.csv`;

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

//======================================================
// Build Filter Options
//======================================================

export const buildStockLedgerFilterOptions = (
  reports = []
) => {
  return {
    stockItems:
      getUniqueStockLedgerValues(
        reports,
        "stockItem"
      ),

    warehouses:
      getUniqueStockLedgerValues(
        reports,
        "warehouse"
      ),

    godowns:
      getUniqueStockLedgerValues(
        reports,
        "godown"
      ),

    transactionTypes:
      getUniqueStockLedgerValues(
        reports,
        "transactionType"
      ),

    voucherTypes:
      getUniqueStockLedgerValues(
        reports,
        "voucherType"
      ),

    statuses:
      getUniqueStockLedgerValues(
        reports,
        "status"
      ),
  };
};

//======================================================
// Part 1A Ends Here
//======================================================