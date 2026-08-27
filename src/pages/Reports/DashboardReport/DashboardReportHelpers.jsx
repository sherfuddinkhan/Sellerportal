// ======================================================
// DashboardReportHelpers.jsx
// ======================================================

// ======================================================
// Normalize Dashboard Reports
// ======================================================

export const normalizeDashboardReports = (
  reports = []
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  return reports.map((report, index) => ({
    ...report,

    dashboardReportId:
      report.dashboardReportId ??
      report.reportId ??
      report.id ??
      index + 1,

    reportName:
      report.reportName ??
      report.name ??
      "",

    reportType:
      report.reportType ??
      "",

    status:
      report.status ??
      "Active",

    description:
      report.description ??
      "",

    date:
      report.date ??
      report.reportDate ??
      report.createdDate ??
      null,

    createdDate:
      report.createdDate ??
      null,

    updatedDate:
      report.updatedDate ??
      null,
  }));
};

// ======================================================
// Filter Dashboard Reports
// ======================================================

export const filterDashboardReports = (
  reports = [],
  filters = {}
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  const {
    status = "",
    reportType = "",
    dateFrom = "",
    dateTo = "",
  } = filters;

  return reports.filter((report) => {

    if (
      status &&
      String(report.status || "").toLowerCase() !==
        status.toLowerCase()
    ) {
      return false;
    }

    if (
      reportType &&
      String(report.reportType || "").toLowerCase() !==
        reportType.toLowerCase()
    ) {
      return false;
    }

    if (dateFrom) {
      const reportDate = new Date(
        report.date ||
        report.createdDate
      );

      const fromDate = new Date(dateFrom);

      if (reportDate < fromDate) {
        return false;
      }
    }

    if (dateTo) {
      const reportDate = new Date(
        report.date ||
        report.createdDate
      );

      const toDate = new Date(dateTo);

      toDate.setHours(
        23,
        59,
        59,
        999
      );

      if (reportDate > toDate) {
        return false;
      }
    }

    return true;
  });
};

// ======================================================
// Search Dashboard Reports
// ======================================================

export const searchDashboardReports = (
  reports = [],
  searchText = ""
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  const keyword =
    String(searchText)
      .trim()
      .toLowerCase();

  if (!keyword) {
    return reports;
  }

  return reports.filter((report) => {
    return (
      String(report.reportName || "")
        .toLowerCase()
        .includes(keyword) ||

      String(report.reportType || "")
        .toLowerCase()
        .includes(keyword) ||

      String(report.status || "")
        .toLowerCase()
        .includes(keyword) ||

      String(report.description || "")
        .toLowerCase()
        .includes(keyword)
    );
  });
};

// ======================================================
// Sort Dashboard Reports
// ======================================================

export const sortDashboardReports = (
  reports = [],
  field = "createdDate",
  direction = "desc"
) => {
  if (!Array.isArray(reports)) {
    return [];
  }

  return [...reports].sort((a, b) => {

    const valueA = a?.[field] ?? "";
    const valueB = b?.[field] ?? "";

    if (valueA < valueB) {
      return direction === "asc"
        ? -1
        : 1;
    }

    if (valueA > valueB) {
      return direction === "asc"
        ? 1
        : -1;
    }

    return 0;
  });
};