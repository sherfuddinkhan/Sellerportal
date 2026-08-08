//======================================================
// dashboardReportHelper.js
// Dashboard Report Utility Functions
//======================================================

//======================================================
// Get Report ID
//======================================================

export const getDashboardReportId = (report) => {
  if (!report) {
    return "";
  }

  return (
    report?.id ??
    report?.reportId ??
    report?.dashboardReportId ??
    ""
  );
};

//======================================================
// Get Report Name
//======================================================

export const getDashboardReportName = (report) => {
  if (!report) {
    return "Dashboard Report";
  }

  return (
    report?.reportName ||
    report?.name ||
    report?.title ||
    "Dashboard Report"
  );
};

//======================================================
// Get Report Type
//======================================================

export const getDashboardReportType = (report) => {
  if (!report) {
    return "Dashboard";
  }

  return (
    report?.reportType ||
    report?.type ||
    "Dashboard"
  );
};

//======================================================
// Get Report Status
//======================================================

export const getDashboardReportStatus = (report) => {
  if (!report) {
    return "Active";
  }

  return (
    report?.status ||
    report?.reportStatus ||
    "Active"
  );
};

//======================================================
// Get Created By
//======================================================

export const getDashboardReportCreatedBy = (report) => {
  if (!report) {
    return "System";
  }

  return (
    report?.createdByName ||
    report?.createdBy ||
    report?.ownerName ||
    report?.owner ||
    "System"
  );
};

//======================================================
// Get Description
//======================================================

export const getDashboardReportDescription = (report) => {
  if (!report) {
    return "";
  }

  return (
    report?.description ||
    report?.summary ||
    report?.remarks ||
    ""
  );
};

//======================================================
// Get Created Date
//======================================================

export const getDashboardReportCreatedDate = (report) => {
  if (!report) {
    return "";
  }

  return (
    report?.createdDate ||
    report?.createdAt ||
    report?.created_date ||
    ""
  );
};

//======================================================
// Get Updated Date
//======================================================

export const getDashboardReportUpdatedDate = (report) => {
  if (!report) {
    return "";
  }

  return (
    report?.updatedDate ||
    report?.updatedAt ||
    report?.updated_date ||
    ""
  );
};

//======================================================
// Get Total Records
//======================================================

export const getDashboardReportTotalRecords = (report) => {
  if (!report) {
    return 0;
  }

  const value = Number(
    report?.totalRecords ??
    report?.recordCount ??
    report?.records ??
    0
  );

  return Number.isFinite(value)
    ? value
    : 0;
};

//======================================================
// Get Total Orders
//======================================================

export const getDashboardReportTotalOrders = (report) => {
  if (!report) {
    return 0;
  }

  const value = Number(
    report?.totalOrders ??
    report?.orderCount ??
    report?.orders ??
    0
  );

  return Number.isFinite(value)
    ? value
    : 0;
};

//======================================================
// Get Total Amount
//======================================================

export const getDashboardReportTotalAmount = (report) => {
  if (!report) {
    return 0;
  }

  const value = Number(
    report?.totalAmount ??
    report?.amount ??
    report?.totalSales ??
    0
  );

  return Number.isFinite(value)
    ? value
    : 0;
};

//======================================================
// Format Number
//======================================================

export const formatDashboardReportNumber = (value) => {
  const number = Number(value);

  return (
    Number.isFinite(number)
      ? number
      : 0
  ).toLocaleString("en-IN");
};

//======================================================
// Format Currency
//======================================================

export const formatDashboardReportCurrency = (value) => {
  const number = Number(value);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(
    Number.isFinite(number)
      ? number
      : 0
  );
};

//======================================================
// Format Date
//======================================================

export const formatDashboardReportDate = (value) => {
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
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

//======================================================
// Get Status Color
//======================================================

export const getDashboardReportStatusColor = (
  status
) => {
  switch (
    String(status)
      .toLowerCase()
  ) {
    case "active":
      return "success";

    case "inactive":
      return "warning";

    case "draft":
      return "default";

    case "archived":
      return "secondary";

    case "deleted":
      return "error";

    default:
      return "primary";
  }
};

//======================================================
// Check Active Filters
//======================================================

export const hasDashboardReportFilters = (
  filters = {}
) => {
  return Boolean(
    filters?.search ||
    filters?.searchTerm ||
    filters?.status ||
    filters?.reportType ||
    filters?.dateFrom ||
    filters?.dateTo
  );
};

//======================================================
// Filter Reports
//======================================================

export const filterDashboardReports = (
  reports = [],
  filters = {}
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  const search = String(
    filters?.search ||
    filters?.searchTerm ||
    ""
  )
    .trim()
    .toLowerCase();

  const status = String(
    filters?.status || ""
  )
    .trim()
    .toLowerCase();

  const reportType = String(
    filters?.reportType || ""
  )
    .trim()
    .toLowerCase();

  return reports.filter(
    (report) => {

      const reportName =
        getDashboardReportName(
          report
        ).toLowerCase();

      const reportStatus =
        getDashboardReportStatus(
          report
        ).toLowerCase();

      const type =
        getDashboardReportType(
          report
        ).toLowerCase();

      const searchMatch =
        !search ||
        reportName.includes(search) ||
        type.includes(search) ||
        reportStatus.includes(search);

      const statusMatch =
        !status ||
        reportStatus === status;

      const typeMatch =
        !reportType ||
        type === reportType;

      return (
        searchMatch &&
        statusMatch &&
        typeMatch
      );
    }
  );
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateDashboardReportStatistics = (
  reports = []
) => {

  if (!Array.isArray(reports)) {
    return {
      totalReports: 0,
      totalRecords: 0,
      totalOrders: 0,
      totalAmount: 0,
    };
  }

  return reports.reduce(
    (statistics, report) => {

      statistics.totalReports += 1;

      statistics.totalRecords +=
        getDashboardReportTotalRecords(
          report
        );

      statistics.totalOrders +=
        getDashboardReportTotalOrders(
          report
        );

      statistics.totalAmount +=
        getDashboardReportTotalAmount(
          report
        );

      return statistics;

    },
    {
      totalReports: 0,
      totalRecords: 0,
      totalOrders: 0,
      totalAmount: 0,
    }
  );
};

//======================================================
// Sort Reports
//======================================================

export const sortDashboardReports = (
  reports = [],
  sortField = "createdDate",
  sortDirection = "desc"
) => {

  if (!Array.isArray(reports)) {
    return [];
  }

  const sorted = [
    ...reports,
  ];

  sorted.sort(
    (a, b) => {

      let valueA;
      let valueB;

      switch (sortField) {

        case "reportName":
          valueA =
            getDashboardReportName(a)
              .toLowerCase();

          valueB =
            getDashboardReportName(b)
              .toLowerCase();

          break;

        case "reportType":
          valueA =
            getDashboardReportType(a)
              .toLowerCase();

          valueB =
            getDashboardReportType(b)
              .toLowerCase();

          break;

        case "status":
          valueA =
            getDashboardReportStatus(a)
              .toLowerCase();

          valueB =
            getDashboardReportStatus(b)
              .toLowerCase();

          break;

        case "totalRecords":
          valueA =
            getDashboardReportTotalRecords(a);

          valueB =
            getDashboardReportTotalRecords(b);

          break;

        case "totalOrders":
          valueA =
            getDashboardReportTotalOrders(a);

          valueB =
            getDashboardReportTotalOrders(b);

          break;

        case "totalAmount":
          valueA =
            getDashboardReportTotalAmount(a);

          valueB =
            getDashboardReportTotalAmount(b);

          break;

        default:
          valueA =
            new Date(
              getDashboardReportCreatedDate(a)
            ).getTime() || 0;

          valueB =
            new Date(
              getDashboardReportCreatedDate(b)
            ).getTime() || 0;
      }

      if (valueA < valueB) {
        return sortDirection === "asc"
          ? -1
          : 1;
      }

      if (valueA > valueB) {
        return sortDirection === "asc"
          ? 1
          : -1;
      }

      return 0;
    }
  );

  return sorted;
};

//======================================================
// Export Report Rows
//======================================================

export const prepareDashboardReportExportData = (
  reports = []
) => {

  if (!Array.isArray(reports)) {
    return [];
  }

  return reports.map(
    (report) => ({
      ReportID:
        getDashboardReportId(report),

      ReportName:
        getDashboardReportName(report),

      ReportType:
        getDashboardReportType(report),

      Status:
        getDashboardReportStatus(report),

      TotalRecords:
        getDashboardReportTotalRecords(
          report
        ),

      TotalOrders:
        getDashboardReportTotalOrders(
          report
        ),

      TotalAmount:
        getDashboardReportTotalAmount(
          report
        ),

      CreatedBy:
        getDashboardReportCreatedBy(
          report
        ),

      CreatedDate:
        formatDashboardReportDate(
          getDashboardReportCreatedDate(
            report
          )
        ),

      UpdatedDate:
        formatDashboardReportDate(
          getDashboardReportUpdatedDate(
            report
          )
        ),
    })
  );
};

//======================================================
// Default Export
//======================================================

export default {
  getDashboardReportId,
  getDashboardReportName,
  getDashboardReportType,
  getDashboardReportStatus,
  getDashboardReportCreatedBy,
  getDashboardReportDescription,
  getDashboardReportCreatedDate,
  getDashboardReportUpdatedDate,
  getDashboardReportTotalRecords,
  getDashboardReportTotalOrders,
  getDashboardReportTotalAmount,
  formatDashboardReportNumber,
  formatDashboardReportCurrency,
  formatDashboardReportDate,
  getDashboardReportStatusColor,
  hasDashboardReportFilters,
  filterDashboardReports,
  calculateDashboardReportStatistics,
  sortDashboardReports,
  prepareDashboardReportExportData,
};