//======================================================
// StockMovementReportHelpers.js
// Part 1A
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
// Safe String
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

  return String(value);
};

//======================================================
// Format Number
//======================================================

export const formatNumber = (
  value,
  maximumFractionDigits = 2
) => {
  const number = toNumber(value);

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
  const number = toNumber(value);

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
    return toSafeString(value);
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

//======================================================
// Format Date For Input
//======================================================

export const formatDateForInput = (
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
    const stringValue =
      String(value);

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        stringValue
      )
    ) {
      return stringValue;
    }

    return "";
  }

  return date
    .toISOString()
    .slice(0, 10);
};

//======================================================
// Get Stock Item
//======================================================

export const getStockItem = (
  report
) => {
  if (!report) {
    return "";
  }

  return (
    report.stockItem ??
    report.itemName ??
    report.stockItemName ??
    report.item ??
    ""
  );
};

//======================================================
// Get Movement Type
//======================================================

export const getMovementType = (
  report
) => {
  if (!report) {
    return "";
  }

  return (
    report.movementType ??
    report.transactionType ??
    report.movement ??
    report.type ??
    ""
  );
};

//======================================================
// Get Voucher Number
//======================================================

export const getVoucherNumber = (
  report
) => {
  if (!report) {
    return "";
  }

  return (
    report.voucherNumber ??
    report.documentNumber ??
    report.voucherNo ??
    report.docNo ??
    ""
  );
};

//======================================================
// Get Voucher Type
//======================================================

export const getVoucherType = (
  report
) => {
  if (!report) {
    return "";
  }

  return (
    report.voucherType ??
    report.documentType ??
    report.docType ??
    ""
  );
};

//======================================================
// Get Warehouse
//======================================================

export const getWarehouse = (
  report
) => {
  if (!report) {
    return "";
  }

  return (
    report.warehouse ??
    report.godown ??
    report.location ??
    report.store ??
    ""
  );
};

//======================================================
// Get Quantity
//======================================================

export const getQuantity = (
  report
) => {
  if (!report) {
    return 0;
  }

  return toNumber(
    report.quantity ??
      report.movementQuantity ??
      report.qty ??
      report.stockQuantity ??
      0
  );
};

//======================================================
// Get Rate
//======================================================

export const getRate = (
  report
) => {
  if (!report) {
    return 0;
  }

  return toNumber(
    report.rate ??
      report.unitRate ??
      report.price ??
      0
  );
};

//======================================================
// Get Amount
//======================================================

export const getAmount = (
  report
) => {
  if (!report) {
    return 0;
  }

  return toNumber(
    report.amount ??
      report.totalAmount ??
      report.value ??
      report.totalValue ??
      0
  );
};

//======================================================
// Get Status
//======================================================

export const getStatus = (
  report
) => {
  if (!report) {
    return "";
  }

  return (
    report.status ??
    report.state ??
    ""
  );
};

//======================================================
// Get Remarks
//======================================================

export const getRemarks = (
  report
) => {
  if (!report) {
    return "";
  }

  return (
    report.remarks ??
    report.notes ??
    report.comment ??
    ""
  );
};

//======================================================
// Get Movement Category
//======================================================

export const getMovementCategory = (
  report
) => {
  const movement =
    toSafeString(
      getMovementType(
        report
      )
    )
      .trim()
      .toLowerCase();

  if (
    movement.includes(
      "inward"
    ) ||
    movement.includes(
      "receipt"
    ) ||
    movement.includes(
      "purchase"
    ) ||
    movement.includes(
      "receive"
    ) ||
    movement.includes(
      "in"
    )
  ) {
    return "Inward";
  }

  if (
    movement.includes(
      "outward"
    ) ||
    movement.includes(
      "issue"
    ) ||
    movement.includes(
      "sales"
    ) ||
    movement.includes(
      "dispatch"
    ) ||
    movement.includes(
      "out"
    )
  ) {
    return "Outward";
  }

  if (
    movement.includes(
      "transfer"
    ) ||
    movement.includes(
      "stock transfer"
    )
  ) {
    return "Transfer";
  }

  if (
    movement.includes(
      "adjust"
    ) ||
    movement.includes(
      "adjustment"
    )
  ) {
    return "Adjustment";
  }

  return "Other";
};

//======================================================
// Normalize Movement Report
//======================================================

export const normalizeMovementReport = (
  report = {}
) => {
  return {
    ...report,

    date:
      report.date ??
      report.transactionDate ??
      report.voucherDate ??
      "",

    stockItem:
      getStockItem(
        report
      ),

    itemName:
      getStockItem(
        report
      ),

    movementType:
      getMovementType(
        report
      ),

    voucherNumber:
      getVoucherNumber(
        report
      ),

    documentNumber:
      report.documentNumber ??
      getVoucherNumber(
        report
      ),

    voucherType:
      getVoucherType(
        report
      ),

    warehouse:
      getWarehouse(
        report
      ),

    godown:
      report.godown ??
      getWarehouse(
        report
      ),

    quantity:
      getQuantity(
        report
      ),

    rate:
      getRate(
        report
      ),

    amount:
      getAmount(
        report
      ),

    status:
      getStatus(
        report
      ),

    remarks:
      getRemarks(
        report
      ),

    notes:
      report.notes ??
      getRemarks(
        report
      ),
  };
};

//======================================================
// Normalize Report List
//======================================================

export const normalizeMovementReports = (
  reports
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return [];
  }

  return reports.map(
    (
      report
    ) =>
      normalizeMovementReport(
        report
      )
  );
};

//======================================================
// Calculate Total Quantity
//======================================================

export const calculateTotalQuantity = (
  reports
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return 0;
  }

  return reports.reduce(
    (
      total,
      report
    ) =>
      total +
      getQuantity(
        report
      ),
    0
  );
};

//======================================================
// Calculate Total Amount
//======================================================

export const calculateTotalAmount = (
  reports
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return 0;
  }

  return reports.reduce(
    (
      total,
      report
    ) =>
      total +
      getAmount(
        report
      ),
    0
  );
};

//======================================================
// Calculate Movement Summary
//======================================================

export const calculateMovementSummary = (
  reports
) => {
  const summary = {
    total: {
      count: 0,
      quantity: 0,
      amount: 0,
    },

    inward: {
      count: 0,
      quantity: 0,
      amount: 0,
    },

    outward: {
      count: 0,
      quantity: 0,
      amount: 0,
    },

    transfer: {
      count: 0,
      quantity: 0,
      amount: 0,
    },

    adjustment: {
      count: 0,
      quantity: 0,
      amount: 0,
    },

    other: {
      count: 0,
      quantity: 0,
      amount: 0,
    },
  };

  if (
    !Array.isArray(
      reports
    )
  ) {
    return summary;
  }

  reports.forEach(
    (report) => {
      const category =
        getMovementCategory(
          report
        );

      const quantity =
        getQuantity(
          report
        );

      const amount =
        getAmount(
          report
        );

      summary.total.count += 1;

      summary.total.quantity +=
        quantity;

      summary.total.amount +=
        amount;

      const key =
        category.toLowerCase();

      if (
        summary[key]
      ) {
        summary[key].count += 1;

        summary[key].quantity +=
          quantity;

        summary[key].amount +=
          amount;
      }
    }
  );

  return summary;
};

//======================================================
// Filter Reports
//======================================================

export const filterMovementReports = (
  reports,
  filters = {}
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return [];
  }

  const search =
    toSafeString(
      filters.search
    )
      .trim()
      .toLowerCase();

  const stockItem =
    toSafeString(
      filters.stockItem
    )
      .trim()
      .toLowerCase();

  const movementType =
    toSafeString(
      filters.movementType
    )
      .trim()
      .toLowerCase();

  const warehouse =
    toSafeString(
      filters.warehouse
    )
      .trim()
      .toLowerCase();

  const status =
    toSafeString(
      filters.status
    )
      .trim()
      .toLowerCase();

  const startDate =
    filters.startDate
      ? new Date(
          filters.startDate
        )
      : null;

  const endDate =
    filters.endDate
      ? new Date(
          filters.endDate
        )
      : null;

  if (endDate) {
    endDate.setHours(
      23,
      59,
      59,
      999
    );
  }

  return reports.filter(
    (report) => {
      const normalized =
        normalizeMovementReport(
          report
        );

      //===============================================
      // Search
      //===============================================

      if (search) {
        const searchableText =
          [
            normalized.stockItem,
            normalized.itemName,
            normalized.movementType,
            normalized.voucherNumber,
            normalized.voucherType,
            normalized.warehouse,
            normalized.status,
            normalized.remarks,
          ]
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
        stockItem &&
        !toSafeString(
          normalized.stockItem
        )
          .toLowerCase()
          .includes(
            stockItem
          )
      ) {
        return false;
      }

      //===============================================
      // Movement Type
      //===============================================

      if (
        movementType &&
        !toSafeString(
          normalized.movementType
        )
          .toLowerCase()
          .includes(
            movementType
          )
      ) {
        return false;
      }

      //===============================================
      // Warehouse
      //===============================================

      if (
        warehouse &&
        !toSafeString(
          normalized.warehouse
        )
          .toLowerCase()
          .includes(
            warehouse
          )
      ) {
        return false;
      }

      //===============================================
      // Status
      //===============================================

      if (
        status &&
        !toSafeString(
          normalized.status
        )
          .toLowerCase()
          .includes(
            status
          )
      ) {
        return false;
      }

      //===============================================
      // Date Range
      //===============================================

      if (
        startDate ||
        endDate
      ) {
        const reportDate =
          new Date(
            normalized.date
          );

        if (
          Number.isNaN(
            reportDate.getTime()
          )
        ) {
          return false;
        }

        if (
          startDate &&
          reportDate <
            startDate
        ) {
          return false;
        }

        if (
          endDate &&
          reportDate >
            endDate
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

export const sortMovementReports = (
  reports,
  sortField = "date",
  sortDirection = "desc"
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return [];
  }

  const sorted = [
    ...reports,
  ];

  sorted.sort(
    (
      first,
      second
    ) => {
      const a =
        normalizeMovementReport(
          first
        );

      const b =
        normalizeMovementReport(
          second
        );

      let valueA =
        a[sortField];

      let valueB =
        b[sortField];

      if (
        sortField ===
          "quantity" ||
        sortField ===
          "rate" ||
        sortField ===
          "amount"
      ) {
        valueA =
          toNumber(
            valueA
          );

        valueB =
          toNumber(
            valueB
          );
      } else {
        valueA =
          toSafeString(
            valueA
          ).toLowerCase();

        valueB =
          toSafeString(
            valueB
          ).toLowerCase();
      }

      if (
        valueA <
        valueB
      ) {
        return sortDirection ===
          "asc"
          ? -1
          : 1;
      }

      if (
        valueA >
        valueB
      ) {
        return sortDirection ===
          "asc"
          ? 1
          : -1;
      }

      return 0;
    }
  );

  return sorted;
};

//======================================================
// Paginate Reports
//======================================================

export const paginateReports = (
  reports,
  page = 0,
  rowsPerPage = 10
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return [];
  }

  const safePage =
    Math.max(
      0,
      toNumber(page)
    );

  const safeRowsPerPage =
    Math.max(
      1,
      toNumber(
        rowsPerPage,
        10
      )
    );

  const start =
    safePage *
    safeRowsPerPage;

  const end =
    start +
    safeRowsPerPage;

  return reports.slice(
    start,
    end
  );
};

//======================================================
// Get Unique Values
//======================================================

export const getUniqueValues = (
  reports,
  field
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return [];
  }

  const values =
    reports
      .map(
        (report) => {
          const normalized =
            normalizeMovementReport(
              report
            );

          return normalized[
            field
          ];
        }
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
      values
    ),
  ].sort(
    (
      a,
      b
    ) =>
      String(a).localeCompare(
        String(b)
      )
  );
};

//======================================================
// Create Export Rows
//======================================================

export const createExportRows = (
  reports
) => {
  if (
    !Array.isArray(
      reports
    )
  ) {
    return [];
  }

  return reports.map(
    (report) => {
      const normalized =
        normalizeMovementReport(
          report
        );

      return {
        Date: formatDate(
          normalized.date
        ),

        "Stock Item":
          normalized.stockItem,

        "Movement Type":
          normalized.movementType,

        "Voucher Number":
          normalized.voucherNumber,

        "Voucher Type":
          normalized.voucherType,

        Warehouse:
          normalized.warehouse,

        Quantity:
          normalized.quantity,

        Rate:
          normalized.rate,

        Amount:
          normalized.amount,

        Status:
          normalized.status,

        Remarks:
          normalized.remarks,
      };
    }
  );
};

//======================================================
// Create CSV
//======================================================

export const createCsv = (
  reports
) => {
  const rows =
    createExportRows(
      reports
    );

  if (
    rows.length === 0
  ) {
    return "";
  }

  const headers =
    Object.keys(
      rows[0]
    );

  const escapeValue =
    (value) => {
      const stringValue =
        String(
          value ?? ""
        );

      if (
        stringValue.includes(
          ","
        ) ||
        stringValue.includes(
          '"'
        ) ||
        stringValue.includes(
          "\n"
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
        escapeValue
      )
      .join(",");

  const dataRows =
    rows.map(
      (row) =>
        headers
          .map(
            (header) =>
              escapeValue(
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

//======================================================
// Download CSV
//======================================================

export const downloadCsv = (
  csv,
  filename = "stock-movement-report.csv"
) => {
  if (!csv) {
    return false;
  }

  const blob =
    new Blob(
      [csv],
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
    filename;

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

  return true;
};

//======================================================
// Validate Report
//======================================================

export const validateMovementReport = (
  report
) => {
  const errors = {};

  if (!report) {
    return {
      valid: false,
      errors: {
        report:
          "Report data is required.",
      },
    };
  }

  const normalized =
    normalizeMovementReport(
      report
    );

  if (
    !normalized.date
  ) {
    errors.date =
      "Date is required.";
  }

  if (
    !normalized.stockItem
  ) {
    errors.stockItem =
      "Stock item is required.";
  }

  if (
    !normalized.movementType
  ) {
    errors.movementType =
      "Movement type is required.";
  }

  const quantity =
    getQuantity(
      normalized
    );

  if (
    quantity < 0
  ) {
    errors.quantity =
      "Quantity cannot be negative.";
  }

  return {
    valid:
      Object.keys(
        errors
      ).length === 0,

    errors,
  };
};

//======================================================
// Part 1A Ends Here
//======================================================