//======================================================
// SuppliesReportHelpers.js
//======================================================

//======================================================
// Safe Number
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
    Number(value);

  return Number.isFinite(
    number
  )
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

  return String(value).trim();
};

//======================================================
// Get First Available Value
//======================================================

export const getValue = (
  report,
  ...fields
) => {
  if (!report) {
    return "";
  }

  for (
    const field of fields
  ) {
    const value =
      report[field];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return "";
};

//======================================================
// Normalize Date
//======================================================

export const normalizeDate = (
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
    return toSafeString(
      value
    );
  }

  return date
    .toISOString()
    .split("T")[0];
};

//======================================================
// Format Date
//======================================================

export const formatDate = (
  value
) => {
  const normalized =
    normalizeDate(value);

  if (!normalized) {
    return "-";
  }

  const [
    year,
    month,
    day,
  ] =
    normalized.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return normalized;
  }

  return `${day}/${month}/${year}`;
};

//======================================================
// Format Number
//======================================================

export const formatNumber = (
  value,
  decimals = 2
) => {
  const number =
    toNumber(value);

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
  value
) => {
  const number =
    toNumber(value);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Normalize Supply Report
//======================================================

export const normalizeSupplyReport = (
  report = {}
) => {
  const quantity =
    toNumber(
      getValue(
        report,
        "quantity",
        "qty",
        "supplyQuantity",
        "receivedQuantity"
      )
    );

  const rate =
    toNumber(
      getValue(
        report,
        "rate",
        "unitRate",
        "price",
        "unitPrice"
      )
    );

  const amountValue =
    getValue(
      report,
      "amount",
      "totalAmount",
      "value",
      "totalValue",
      "supplyValue"
    );

  const amount =
    amountValue !== ""
      ? toNumber(
          amountValue
        )
      : quantity * rate;

  return {
    ...report,

    id:
      getValue(
        report,
        "id",
        "reportId",
        "supplyId",
        "supplyReportId"
      ),

    date:
      normalizeDate(
        getValue(
          report,
          "date",
          "supplyDate",
          "transactionDate",
          "voucherDate"
        )
      ),

    supplier:
      toSafeString(
        getValue(
          report,
          "supplier",
          "supplierName",
          "partyName",
          "vendorName"
        )
      ),

    stockItem:
      toSafeString(
        getValue(
          report,
          "stockItem",
          "stockItemName",
          "itemName",
          "item"
        )
      ),

    category:
      toSafeString(
        getValue(
          report,
          "category",
          "categoryName",
          "itemCategory"
        )
      ),

    voucherNumber:
      toSafeString(
        getValue(
          report,
          "voucherNumber",
          "voucherNo",
          "documentNumber",
          "docNo"
        )
      ),

    voucherType:
      toSafeString(
        getValue(
          report,
          "voucherType",
          "documentType",
          "docType"
        )
      ),

    warehouse:
      toSafeString(
        getValue(
          report,
          "warehouse",
          "warehouseName",
          "godown",
          "location"
        )
      ),

    quantity,

    rate,

    amount,

    status:
      toSafeString(
        getValue(
          report,
          "status",
          "state"
        )
      ),

    remarks:
      toSafeString(
        getValue(
          report,
          "remarks",
          "notes",
          "comment"
        )
      ),

    notes:
      toSafeString(
        getValue(
          report,
          "notes",
          "remarks",
          "comment"
        )
      ),
  };
};

//======================================================
// Normalize Report List
//======================================================

export const normalizeSupplyReports = (
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
    normalizeSupplyReport
  );
};

//======================================================
// Search Text
//======================================================

export const getSearchText = (
  report
) => {
  const normalized =
    normalizeSupplyReport(
      report
    );

  return [
    normalized.date,
    normalized.supplier,
    normalized.stockItem,
    normalized.category,
    normalized.voucherNumber,
    normalized.voucherType,
    normalized.warehouse,
    normalized.quantity,
    normalized.rate,
    normalized.amount,
    normalized.status,
    normalized.remarks,
    normalized.notes,
  ]
    .map(
      (value) =>
        toSafeString(
          value
        ).toLowerCase()
    )
    .join(" ");
};

//======================================================
// Search Reports
//======================================================

export const searchSupplyReports = (
  reports,
  search
) => {
  const reportList =
    normalizeSupplyReports(
      reports
    );

  const searchText =
    toSafeString(
      search
    ).toLowerCase();

  if (!searchText) {
    return reportList;
  }

  return reportList.filter(
    (report) =>
      getSearchText(
        report
      ).includes(
        searchText
      )
  );
};

//======================================================
// Date Comparison
//======================================================

const isDateWithinRange = (
  reportDate,
  startDate,
  endDate
) => {
  if (!reportDate) {
    return false;
  }

  const date =
    new Date(
      `${reportDate}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  if (startDate) {
    const start =
      new Date(
        `${startDate}T00:00:00`
      );

    if (
      date < start
    ) {
      return false;
    }
  }

  if (endDate) {
    const end =
      new Date(
        `${endDate}T23:59:59`
      );

    if (
      date > end
    ) {
      return false;
    }
  }

  return true;
};

//======================================================
// Filter Reports
//======================================================

export const filterSupplyReports = (
  reports,
  filters = {}
) => {
  const reportList =
    normalizeSupplyReports(
      reports
    );

  const {
    search = "",
    startDate = "",
    endDate = "",
    supplier = "",
    stockItem = "",
    category = "",
    warehouse = "",
    status = "",
  } = filters;

  return reportList.filter(
    (report) => {
      //================================================
      // Search
      //================================================

      if (
        search &&
        !getSearchText(
          report
        ).includes(
          toSafeString(
            search
          ).toLowerCase()
        )
      ) {
        return false;
      }

      //================================================
      // Date Range
      //================================================

      if (
        startDate ||
        endDate
      ) {
        if (
          !isDateWithinRange(
            report.date,
            startDate,
            endDate
          )
        ) {
          return false;
        }
      }

      //================================================
      // Supplier
      //================================================

      if (
        supplier &&
        !report.supplier
          .toLowerCase()
          .includes(
            toSafeString(
              supplier
            ).toLowerCase()
          )
      ) {
        return false;
      }

      //================================================
      // Stock Item
      //================================================

      if (
        stockItem &&
        !report.stockItem
          .toLowerCase()
          .includes(
            toSafeString(
              stockItem
            ).toLowerCase()
          )
      ) {
        return false;
      }

      //================================================
      // Category
      //================================================

      if (
        category &&
        !report.category
          .toLowerCase()
          .includes(
            toSafeString(
              category
            ).toLowerCase()
          )
      ) {
        return false;
      }

      //================================================
      // Warehouse
      //================================================

      if (
        warehouse &&
        !report.warehouse
          .toLowerCase()
          .includes(
            toSafeString(
              warehouse
            ).toLowerCase()
          )
      ) {
        return false;
      }

      //================================================
      // Status
      //================================================

      if (
        status &&
        report.status
          .toLowerCase() !==
          toSafeString(
            status
          ).toLowerCase()
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

export const sortSupplyReports = (
  reports,
  sortField = "date",
  sortDirection = "desc"
) => {
  const reportList =
    normalizeSupplyReports(
      reports
    );

  const direction =
    sortDirection === "asc"
      ? 1
      : -1;

  return [
    ...reportList,
  ].sort(
    (
      first,
      second
    ) => {
      let firstValue =
        first?.[
          sortField
        ];

      let secondValue =
        second?.[
          sortField
        ];

      //================================================
      // Numeric Fields
      //================================================

      if (
        [
          "quantity",
          "qty",
          "rate",
          "amount",
          "totalAmount",
        ].includes(
          sortField
        )
      ) {
        firstValue =
          toNumber(
            firstValue
          );

        secondValue =
          toNumber(
            secondValue
          );

        return (
          firstValue -
          secondValue
        ) * direction;
      }

      //================================================
      // Date Fields
      //================================================

      if (
        [
          "date",
          "supplyDate",
          "transactionDate",
          "voucherDate",
        ].includes(
          sortField
        )
      ) {
        const firstDate =
          new Date(
            firstValue ||
              0
          ).getTime();

        const secondDate =
          new Date(
            secondValue ||
              0
          ).getTime();

        return (
          firstDate -
          secondDate
        ) * direction;
      }

      //================================================
      // Text Fields
      //================================================

      firstValue =
        toSafeString(
          firstValue
        ).toLowerCase();

      secondValue =
        toSafeString(
          secondValue
        ).toLowerCase();

      return (
        firstValue.localeCompare(
          secondValue
        ) * direction
      );
    }
  );
};

//======================================================
// Paginate Reports
//======================================================

export const paginateSupplyReports = (
  reports,
  page = 0,
  rowsPerPage = 10
) => {
  const reportList =
    Array.isArray(
      reports
    )
      ? reports
      : [];

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

  const startIndex =
    safePage *
    safeRowsPerPage;

  return reportList.slice(
    startIndex,
    startIndex +
      safeRowsPerPage
  );
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateSupplyStatistics = (
  reports
) => {
  const reportList =
    normalizeSupplyReports(
      reports
    );

  const total =
    reportList.length;

  const totalQuantity =
    reportList.reduce(
      (
        totalValue,
        report
      ) =>
        totalValue +
        toNumber(
          report.quantity
        ),
      0
    );

  const totalAmount =
    reportList.reduce(
      (
        totalValue,
        report
      ) =>
        totalValue +
        toNumber(
          report.amount
        ),
      0
    );

  const totalSuppliers =
    new Set(
      reportList
        .map(
          (report) =>
            report.supplier
        )
        .filter(
          Boolean
        )
    ).size;

  const totalItems =
    new Set(
      reportList
        .map(
          (report) =>
            report.stockItem
        )
        .filter(
          Boolean
        )
    ).size;

  const averageAmount =
    total > 0
      ? totalAmount /
        total
      : 0;

  const averageQuantity =
    total > 0
      ? totalQuantity /
        total
      : 0;

  return {
    total,
    totalQuantity,
    totalAmount,
    totalSuppliers,
    totalItems,
    averageAmount,
    averageQuantity,
  };
};

//======================================================
// Clear Filters
//======================================================

export const getEmptySupplyFilters =
  () => ({
    search: "",
    startDate: "",
    endDate: "",
    supplier: "",
    stockItem: "",
    category: "",
    warehouse: "",
    status: "",
  });

//======================================================
// Check Active Filters
//======================================================

export const hasActiveSupplyFilters = (
  filters = {}
) => {
  return Object.values(
    filters
  ).some(
    (value) =>
      value !==
        undefined &&
      value !==
        null &&
      String(value).trim() !==
        ""
  );
};

//======================================================
// Export CSV
//======================================================

export const exportSupplyReportsToCSV = (
  reports
) => {
  const reportList =
    normalizeSupplyReports(
      reports
    );

  const headers = [
    "Date",
    "Supplier",
    "Stock Item",
    "Category",
    "Voucher Number",
    "Voucher Type",
    "Warehouse",
    "Quantity",
    "Rate",
    "Amount",
    "Status",
    "Remarks",
  ];

  const escapeCSV = (
    value
  ) => {
    const text =
      toSafeString(
        value
      );

    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  };

  const rows =
    reportList.map(
      (report) =>
        [
          report.date,
          report.supplier,
          report.stockItem,
          report.category,
          report.voucherNumber,
          report.voucherType,
          report.warehouse,
          report.quantity,
          report.rate,
          report.amount,
          report.status,
          report.remarks,
        ]
          .map(
            escapeCSV
          )
          .join(",")
    );

  return [
    headers
      .map(
        escapeCSV
      )
      .join(","),
    ...rows,
  ].join("\n");
};

//======================================================
// Download CSV
//======================================================

export const downloadSupplyReportsCSV = (
  reports,
  fileName = "supplies-report.csv"
) => {
  const csv =
    exportSupplyReportsToCSV(
      reports
    );

  const blob =
    new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
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

//======================================================
// Part 1A Ends Here
//======================================================