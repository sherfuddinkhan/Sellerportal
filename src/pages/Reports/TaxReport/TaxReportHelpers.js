//======================================================
// TaxReportHelpers.js
// Part 1A
//======================================================

//======================================================
// Safe Number
//======================================================

export const toNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

//======================================================
// Format Number
//======================================================

export const formatNumber = (
  value,
  decimals = 2
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals,
    }
  ).format(
    toNumber(value)
  );
};

//======================================================
// Format Currency
//======================================================

export const formatCurrency = (
  value
) => {
  return `₹ ${formatNumber(value)}`;
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

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-IN"
  );
};

//======================================================
// Normalize Date For Input
//======================================================

export const normalizeDateForInput = (
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

//======================================================
// Get Date Value
//======================================================

export const getReportDate = (
  report
) => {
  return (
    report?.date ??
    report?.taxDate ??
    report?.invoiceDate ??
    report?.documentDate ??
    ""
  );
};

//======================================================
// Get Invoice Number
//======================================================

export const getInvoiceNumber = (
  report
) => {
  return (
    report?.invoiceNumber ??
    report?.invoiceNo ??
    report?.documentNumber ??
    report?.docNo ??
    report?.voucherNumber ??
    ""
  );
};

//======================================================
// Get Party Name
//======================================================

export const getPartyName = (
  report
) => {
  return (
    report?.partyName ??
    report?.customerName ??
    report?.supplierName ??
    report?.customer ??
    report?.supplier ??
    report?.party ??
    ""
  );
};

//======================================================
// Get GSTIN
//======================================================

export const getGstin = (
  report
) => {
  return (
    report?.gstin ??
    report?.GSTIN ??
    report?.customerGstin ??
    report?.supplierGstin ??
    report?.customerGSTIN ??
    report?.supplierGSTIN ??
    ""
  );
};

//======================================================
// Get Taxable Amount
//======================================================

export const getTaxableAmount = (
  report
) => {
  return toNumber(
    report?.taxableAmount ??
      report?.taxableValue ??
      report?.taxable ??
      report?.taxableAmt ??
      0
  );
};

//======================================================
// Get CGST
//======================================================

export const getCGST = (
  report
) => {
  return toNumber(
    report?.cgst ??
      report?.cgstAmount ??
      report?.CGST ??
      report?.CGSTAmount ??
      0
  );
};

//======================================================
// Get SGST
//======================================================

export const getSGST = (
  report
) => {
  return toNumber(
    report?.sgst ??
      report?.sgstAmount ??
      report?.SGST ??
      report?.SGSTAmount ??
      0
  );
};

//======================================================
// Get IGST
//======================================================

export const getIGST = (
  report
) => {
  return toNumber(
    report?.igst ??
      report?.igstAmount ??
      report?.IGST ??
      report?.IGSTAmount ??
      0
  );
};

//======================================================
// Get Cess
//======================================================

export const getCess = (
  report
) => {
  return toNumber(
    report?.cess ??
      report?.cessAmount ??
      report?.Cess ??
      report?.CessAmount ??
      0
  );
};

//======================================================
// Calculate Total Tax
//======================================================

export const calculateTotalTax = (
  report
) => {
  const existingTotal =
    report?.totalTax ??
    report?.taxAmount ??
    report?.totalTaxAmount;

  if (
    existingTotal !==
      undefined &&
    existingTotal !== null &&
    existingTotal !== ""
  ) {
    return toNumber(
      existingTotal
    );
  }

  return (
    getCGST(report) +
    getSGST(report) +
    getIGST(report) +
    getCess(report)
  );
};

//======================================================
// Get Invoice Total
//======================================================

export const getInvoiceTotal = (
  report
) => {
  return toNumber(
    report?.invoiceTotal ??
      report?.totalAmount ??
      report?.grandTotal ??
      report?.invoiceValue ??
      report?.total ??
      0
  );
};

//======================================================
// Get Status
//======================================================

export const getStatus = (
  report
) => {
  return (
    report?.status ??
    report?.taxStatus ??
    report?.invoiceStatus ??
    "Pending"
  );
};

//======================================================
// Get Remarks
//======================================================

export const getRemarks = (
  report
) => {
  return (
    report?.remarks ??
    report?.notes ??
    report?.description ??
    ""
  );
};

//======================================================
// Normalize Tax Report
//======================================================

export const normalizeTaxReport = (
  report
) => {
  if (!report) {
    return null;
  }

  const cgst =
    getCGST(report);

  const sgst =
    getSGST(report);

  const igst =
    getIGST(report);

  const cess =
    getCess(report);

  return {
    ...report,

    date:
      getReportDate(report),

    invoiceNumber:
      getInvoiceNumber(report),

    partyName:
      getPartyName(report),

    gstin:
      getGstin(report),

    taxableAmount:
      getTaxableAmount(report),

    cgst,

    sgst,

    igst,

    cess,

    totalTax:
      calculateTotalTax(
        report
      ),

    invoiceTotal:
      getInvoiceTotal(
        report
      ),

    status:
      getStatus(report),

    remarks:
      getRemarks(report),
  };
};

//======================================================
// Normalize Tax Reports
//======================================================

export const normalizeTaxReports = (
  reports
) => {
  if (
    !Array.isArray(reports)
  ) {
    return [];
  }

  return reports
    .map(
      normalizeTaxReport
    )
    .filter(Boolean);
};

//======================================================
// Search Tax Reports
//======================================================

export const searchTaxReports = (
  reports,
  searchValue
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  const search =
    String(
      searchValue || ""
    )
      .trim()
      .toLowerCase();

  if (!search) {
    return list;
  }

  return list.filter(
    (report) => {
      const searchableText =
        [
          report.invoiceNumber,
          report.partyName,
          report.gstin,
          report.status,
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

      return searchableText.includes(
        search
      );
    }
  );
};

//======================================================
// Date Comparison
//======================================================

export const isDateInRange = (
  reportDate,
  startDate,
  endDate
) => {
  if (
    !startDate &&
    !endDate
  ) {
    return true;
  }

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

  if (startDate) {
    const start =
      new Date(startDate);

    if (
      Number.isNaN(
        start.getTime()
      )
    ) {
      return false;
    }

    start.setHours(
      0,
      0,
      0,
      0
    );

    if (date < start) {
      return false;
    }
  }

  if (endDate) {
    const end =
      new Date(endDate);

    if (
      Number.isNaN(
        end.getTime()
      )
    ) {
      return false;
    }

    end.setHours(
      23,
      59,
      59,
      999
    );

    if (date > end) {
      return false;
    }
  }

  return true;
};

//======================================================
// Filter Tax Reports
//======================================================

export const filterTaxReports = (
  reports,
  filters = {}
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  const {
    startDate = "",
    endDate = "",
    taxType = "all",
    status = "all",
    partyType = "all",
  } = filters || {};

  return list.filter(
    (report) => {
      //===============================================
      // Date Filter
      //===============================================

      if (
        !isDateInRange(
          report.date,
          startDate,
          endDate
        )
      ) {
        return false;
      }

      //===============================================
      // Status Filter
      //===============================================

      if (
        status !== "all" &&
        String(
          report.status || ""
        ).toLowerCase() !==
          String(
            status
          ).toLowerCase()
      ) {
        return false;
      }

      //===============================================
      // Party Type Filter
      //===============================================

      if (
        partyType !== "all"
      ) {
        const reportPartyType =
          String(
            report.partyType ??
              (
                report.customerName
                  ? "customer"
                  : report.supplierName
                  ? "supplier"
                  : ""
              )
          ).toLowerCase();

        if (
          reportPartyType !==
          String(
            partyType
          ).toLowerCase()
        ) {
          return false;
        }
      }

      //===============================================
      // Tax Type Filter
      //===============================================

      if (
        taxType !== "all"
      ) {
        const taxValue =
          String(
            taxType
          ).toLowerCase();

        if (
          taxValue ===
          "cgst" &&
          getCGST(report) <= 0
        ) {
          return false;
        }

        if (
          taxValue ===
          "sgst" &&
          getSGST(report) <= 0
        ) {
          return false;
        }

        if (
          taxValue ===
          "igst" &&
          getIGST(report) <= 0
        ) {
          return false;
        }

        if (
          taxValue ===
          "cess" &&
          getCess(report) <= 0
        ) {
          return false;
        }
      }

      return true;
    }
  );
};

//======================================================
// Sort Tax Reports
//======================================================

export const sortTaxReports = (
  reports,
  sortField = "date",
  sortDirection = "desc"
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  const direction =
    sortDirection === "asc"
      ? 1
      : -1;

  return [
    ...list,
  ].sort(
    (a, b) => {
      let valueA;
      let valueB;

      switch (
        sortField
      ) {
        case "date":
          valueA =
            new Date(
              a.date || 0
            ).getTime();

          valueB =
            new Date(
              b.date || 0
            ).getTime();
          break;

        case "invoiceNumber":
          valueA =
            String(
              a.invoiceNumber ||
                ""
            ).toLowerCase();

          valueB =
            String(
              b.invoiceNumber ||
                ""
            ).toLowerCase();
          break;

        case "partyName":
          valueA =
            String(
              a.partyName ||
                ""
            ).toLowerCase();

          valueB =
            String(
              b.partyName ||
                ""
            ).toLowerCase();
          break;

        case "gstin":
          valueA =
            String(
              a.gstin || ""
            ).toLowerCase();

          valueB =
            String(
              b.gstin || ""
            ).toLowerCase();
          break;

        case "taxableAmount":
          valueA =
            getTaxableAmount(
              a
            );

          valueB =
            getTaxableAmount(
              b
            );
          break;

        case "cgst":
          valueA =
            getCGST(a);

          valueB =
            getCGST(b);
          break;

        case "sgst":
          valueA =
            getSGST(a);

          valueB =
            getSGST(b);
          break;

        case "igst":
          valueA =
            getIGST(a);

          valueB =
            getIGST(b);
          break;

        case "cess":
          valueA =
            getCess(a);

          valueB =
            getCess(b);
          break;

        case "totalTax":
          valueA =
            calculateTotalTax(
              a
            );

          valueB =
            calculateTotalTax(
              b
            );
          break;

        case "invoiceTotal":
          valueA =
            getInvoiceTotal(
              a
            );

          valueB =
            getInvoiceTotal(
              b
            );
          break;

        case "status":
          valueA =
            String(
              a.status || ""
            ).toLowerCase();

          valueB =
            String(
              b.status || ""
            ).toLowerCase();
          break;

        default:
          valueA = String(
            a?.[sortField] ??
              ""
          ).toLowerCase();

          valueB = String(
            b?.[sortField] ??
              ""
          ).toLowerCase();
      }

      if (
        valueA <
        valueB
      ) {
        return -1 *
          direction;
      }

      if (
        valueA >
        valueB
      ) {
        return 1 *
          direction;
      }

      return 0;
    }
  );
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateTaxStatistics = (
  reports
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  const statistics =
    list.reduce(
      (total, report) => {
        total.totalReports += 1;

        total.taxableAmount +=
          getTaxableAmount(
            report
          );

        total.cgst +=
          getCGST(report);

        total.sgst +=
          getSGST(report);

        total.igst +=
          getIGST(report);

        total.cess +=
          getCess(report);

        total.totalTax +=
          calculateTotalTax(
            report
          );

        total.invoiceTotal +=
          getInvoiceTotal(
            report
          );

        return total;
      },
      {
        totalReports: 0,
        taxableAmount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        cess: 0,
        totalTax: 0,
        invoiceTotal: 0,
      }
    );

  return statistics;
};

//======================================================
// Paginate Reports
//======================================================

export const paginateTaxReports = (
  reports,
  page = 0,
  rowsPerPage = 10
) => {
  const list =
    Array.isArray(reports)
      ? reports
      : [];

  const safePage =
    Math.max(
      0,
      Number(page) || 0
    );

  const safeRows =
    Math.max(
      1,
      Number(rowsPerPage) ||
        10
    );

  const start =
    safePage *
    safeRows;

  return list.slice(
    start,
    start + safeRows
  );
};

//======================================================
// Get Tax Type
//======================================================

export const getTaxType = (
  report
) => {
  const cgst =
    getCGST(report);

  const sgst =
    getSGST(report);

  const igst =
    getIGST(report);

  const cess =
    getCess(report);

  if (
    igst > 0
  ) {
    return "IGST";
  }

  if (
    cgst > 0 &&
    sgst > 0
  ) {
    return "CGST + SGST";
  }

  if (
    cess > 0
  ) {
    return "Cess";
  }

  return "Other";
};

//======================================================
// Validate Filters
//======================================================

export const validateTaxFilters = (
  filters = {}
) => {
  const errors = {};

  if (
    filters.startDate &&
    filters.endDate
  ) {
    const start =
      new Date(
        filters.startDate
      );

    const end =
      new Date(
        filters.endDate
      );

    if (
      !Number.isNaN(
        start.getTime()
      ) &&
      !Number.isNaN(
        end.getTime()
      ) &&
      start > end
    ) {
      errors.endDate =
        "End date cannot be earlier than start date.";
    }
  }

  return errors;
};

//======================================================
// Export CSV
//======================================================

export const convertTaxReportsToCsv =
  (reports) => {
    const list =
      normalizeTaxReports(
        reports
      );

    const headers = [
      "Date",
      "Invoice Number",
      "Party Name",
      "GSTIN",
      "Taxable Amount",
      "CGST",
      "SGST",
      "IGST",
      "Cess",
      "Total Tax",
      "Invoice Total",
      "Status",
      "Remarks",
    ];

    const escapeValue =
      (value) => {
        const text =
          value ===
            null ||
          value ===
            undefined
            ? ""
            : String(value);

        return `"${text.replace(
          /"/g,
          '""'
        )}"`;
      };

    const rows =
      list.map(
        (report) => [
          formatDate(
            report.date
          ),
          report.invoiceNumber,
          report.partyName,
          report.gstin,
          formatNumber(
            report.taxableAmount
          ),
          formatNumber(
            report.cgst
          ),
          formatNumber(
            report.sgst
          ),
          formatNumber(
            report.igst
          ),
          formatNumber(
            report.cess
          ),
          formatNumber(
            report.totalTax
          ),
          formatNumber(
            report.invoiceTotal
          ),
          report.status,
          report.remarks,
        ]
      );

    return [
      headers,
      ...rows,
    ]
      .map(
        (row) =>
          row
            .map(
              escapeValue
            )
            .join(",")
      )
      .join("\r\n");
  };

//======================================================
// Part 1A Ends Here
//======================================================
//======================================================
// Part 1B Starts Here
//======================================================

//======================================================
// Get Tax Summary By Type
//======================================================

export const getTaxSummaryByType = (
  reports
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  return {
    cgst: list.reduce(
      (total, report) =>
        total + getCGST(report),
      0
    ),

    sgst: list.reduce(
      (total, report) =>
        total + getSGST(report),
      0
    ),

    igst: list.reduce(
      (total, report) =>
        total + getIGST(report),
      0
    ),

    cess: list.reduce(
      (total, report) =>
        total + getCess(report),
      0
    ),
  };
};

//======================================================
// Get Tax Summary By Status
//======================================================

export const getTaxSummaryByStatus = (
  reports
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  return list.reduce(
    (summary, report) => {
      const status =
        String(
          report.status ||
            "Pending"
        ).trim();

      if (
        !summary[status]
      ) {
        summary[status] = {
          count: 0,
          taxableAmount: 0,
          totalTax: 0,
          invoiceTotal: 0,
        };
      }

      summary[status].count += 1;

      summary[
        status
      ].taxableAmount +=
        getTaxableAmount(
          report
        );

      summary[
        status
      ].totalTax +=
        calculateTotalTax(
          report
        );

      summary[
        status
      ].invoiceTotal +=
        getInvoiceTotal(
          report
        );

      return summary;
    },
    {}
  );
};

//======================================================
// Get Tax Summary By Party
//======================================================

export const getTaxSummaryByParty = (
  reports
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  return list.reduce(
    (summary, report) => {
      const party =
        report.partyName ||
        "Unknown";

      if (
        !summary[party]
      ) {
        summary[party] = {
          partyName: party,
          gstin:
            report.gstin || "",
          count: 0,
          taxableAmount: 0,
          totalTax: 0,
          invoiceTotal: 0,
        };
      }

      summary[
        party
      ].count += 1;

      summary[
        party
      ].taxableAmount +=
        getTaxableAmount(
          report
        );

      summary[
        party
      ].totalTax +=
        calculateTotalTax(
          report
        );

      summary[
        party
      ].invoiceTotal +=
        getInvoiceTotal(
          report
        );

      return summary;
    },
    {}
  );
};

//======================================================
// Get Tax Type Statistics
//======================================================

export const getTaxTypeStatistics = (
  reports
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  return list.reduce(
    (summary, report) => {
      const type =
        getTaxType(report);

      if (
        !summary[type]
      ) {
        summary[type] = {
          count: 0,
          taxableAmount: 0,
          taxAmount: 0,
        };
      }

      summary[
        type
      ].count += 1;

      summary[
        type
      ].taxableAmount +=
        getTaxableAmount(
          report
        );

      summary[
        type
      ].taxAmount +=
        calculateTotalTax(
          report
        );

      return summary;
    },
    {}
  );
};

//======================================================
// Get Monthly Tax Summary
//======================================================

export const getMonthlyTaxSummary = (
  reports
) => {
  const list =
    normalizeTaxReports(
      reports
    );

  return list.reduce(
    (summary, report) => {
      if (!report.date) {
        return summary;
      }

      const date =
        new Date(
          report.date
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return summary;
      }

      const year =
        date.getFullYear();

      const month =
        String(
          date.getMonth() + 1
        ).padStart(2, "0");

      const key =
        `${year}-${month}`;

      if (
        !summary[key]
      ) {
        summary[key] = {
          month: key,
          count: 0,
          taxableAmount: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          cess: 0,
          totalTax: 0,
          invoiceTotal: 0,
        };
      }

      summary[key].count += 1;

      summary[
        key
      ].taxableAmount +=
        getTaxableAmount(
          report
        );

      summary[key].cgst +=
        getCGST(report);

      summary[key].sgst +=
        getSGST(report);

      summary[key].igst +=
        getIGST(report);

      summary[key].cess +=
        getCess(report);

      summary[
        key
      ].totalTax +=
        calculateTotalTax(
          report
        );

      summary[
        key
      ].invoiceTotal +=
        getInvoiceTotal(
          report
        );

      return summary;
    },
    {}
  );
};

//======================================================
// Convert Object To Array
//======================================================

export const objectToArray = (
  object
) => {
  if (
    !object ||
    typeof object !==
      "object" ||
    Array.isArray(object)
  ) {
    return [];
  }

  return Object.values(
    object
  );
};

//======================================================
// Get Sorted Monthly Summary
//======================================================

export const getSortedMonthlyTaxSummary = (
  reports
) => {
  const summary =
    getMonthlyTaxSummary(
      reports
    );

  return objectToArray(
    summary
  ).sort(
    (a, b) =>
      a.month.localeCompare(
        b.month
      )
  );
};

//======================================================
// Get Top Tax Parties
//======================================================

export const getTopTaxParties = (
  reports,
  limit = 10
) => {
  const summary =
    getTaxSummaryByParty(
      reports
    );

  return objectToArray(
    summary
  )
    .sort(
      (a, b) =>
        b.totalTax -
        a.totalTax
    )
    .slice(
      0,
      Math.max(
        1,
        Number(limit) || 10
      )
    );
};

//======================================================
// Calculate Tax Percentage
//======================================================

export const calculateTaxPercentage = (
  taxAmount,
  taxableAmount
) => {
  const tax =
    toNumber(taxAmount);

  const taxable =
    toNumber(
      taxableAmount
    );

  if (
    taxable === 0
  ) {
    return 0;
  }

  return (
    (tax / taxable) *
    100
  );
};

//======================================================
// Get Effective Tax Rate
//======================================================

export const getEffectiveTaxRate = (
  report
) => {
  return calculateTaxPercentage(
    calculateTotalTax(
      report
    ),
    getTaxableAmount(
      report
    )
  );
};

//======================================================
// Validate Tax Report
//======================================================

export const validateTaxReport = (
  report
) => {
  const errors = {};

  if (!report) {
    errors.report =
      "Tax report is required.";

    return errors;
  }

  if (
    !getReportDate(report)
  ) {
    errors.date =
      "Date is required.";
  }

  if (
    !getInvoiceNumber(
      report
    )
  ) {
    errors.invoiceNumber =
      "Invoice number is required.";
  }

  if (
    getTaxableAmount(
      report
    ) < 0
  ) {
    errors.taxableAmount =
      "Taxable amount cannot be negative.";
  }

  if (
    getCGST(report) < 0
  ) {
    errors.cgst =
      "CGST cannot be negative.";
  }

  if (
    getSGST(report) < 0
  ) {
    errors.sgst =
      "SGST cannot be negative.";
  }

  if (
    getIGST(report) < 0
  ) {
    errors.igst =
      "IGST cannot be negative.";
  }

  if (
    getCess(report) < 0
  ) {
    errors.cess =
      "Cess cannot be negative.";
  }

  if (
    getInvoiceTotal(
      report
    ) < 0
  ) {
    errors.invoiceTotal =
      "Invoice total cannot be negative.";
  }

  return errors;
};

//======================================================
// Check Valid Tax Report
//======================================================

export const isValidTaxReport = (
  report
) => {
  return (
    Object.keys(
      validateTaxReport(
        report
      )
    ).length === 0
  );
};

//======================================================
// Apply Tax Report Filters + Search + Sort
//======================================================

export const prepareTaxReports = (
  reports,
  {
    search = "",
    filters = {},
    sortField = "date",
    sortDirection = "desc",
  } = {}
) => {
  let result =
    normalizeTaxReports(
      reports
    );

  // Search
  result =
    searchTaxReports(
      result,
      search
    );

  // Filters
  result =
    filterTaxReports(
      result,
      filters
    );

  // Sort
  result =
    sortTaxReports(
      result,
      sortField,
      sortDirection
    );

  return result;
};

//======================================================
// Prepare Paginated Tax Reports
//======================================================

export const preparePaginatedTaxReports = (
  reports,
  options = {}
) => {
  const {
    search = "",
    filters = {},
    sortField = "date",
    sortDirection = "desc",
    page = 0,
    rowsPerPage = 10,
  } = options;

  const prepared =
    prepareTaxReports(
      reports,
      {
        search,
        filters,
        sortField,
        sortDirection,
      }
    );

  return {
    records:
      paginateTaxReports(
        prepared,
        page,
        rowsPerPage
      ),

    total:
      prepared.length,

    statistics:
      calculateTaxStatistics(
        prepared
      ),
  };
};

//======================================================
// Clone Tax Report
//======================================================

export const cloneTaxReport = (
  report
) => {
  if (!report) {
    return null;
  }

  return {
    ...normalizeTaxReport(
      report
    ),
  };
};

//======================================================
// Clone Tax Reports
//======================================================

export const cloneTaxReports = (
  reports
) => {
  return normalizeTaxReports(
    reports
  ).map(
    (report) => ({
      ...report,
    })
  );
};

//======================================================
// Part 1B Ends Here
//======================================================