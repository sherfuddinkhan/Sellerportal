//======================================================
// DashboardReportService.js
//======================================================

import axios from "axios";

//======================================================
// API Base URL
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

//======================================================
// Axios Instance
//======================================================

const dashboardReportApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//======================================================
// Request Interceptor
//======================================================

dashboardReportApi.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwtToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

//======================================================
// Response Error Handler
//======================================================

const handleServiceError = (error) => {

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Dashboard report request failed.";

  const serviceError =
    new Error(message);

  serviceError.status =
    error?.response?.status;

  serviceError.data =
    error?.response?.data;

  return serviceError;
};

//======================================================
// Normalize API Response
//======================================================

const getResponseData = (
  response
) => {

  return (
    response?.data?.data ??
    response?.data?.result ??
    response?.data
  );
};

//======================================================
// Get Dashboard Reports
//======================================================

export const getDashboardReports = async (
  params = {}
) => {

  try {

    const response =
      await dashboardReportApi.get(
        "/dashboard-reports",
        {
          params,
        }
      );

    return getResponseData(
      response
    );

  } catch (error) {

    throw handleServiceError(
      error
    );

  }
};

//======================================================
// Get Dashboard Report By ID
//======================================================

export const getDashboardReportById =
  async (reportId) => {

    if (!reportId) {
      throw new Error(
        "Dashboard report ID is required."
      );
    }

    try {

      const response =
        await dashboardReportApi.get(
          `/dashboard-reports/${reportId}`
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Create Dashboard Report
//======================================================

export const createDashboardReport =
  async (reportData) => {

    if (!reportData) {
      throw new Error(
        "Dashboard report data is required."
      );
    }

    try {

      const response =
        await dashboardReportApi.post(
          "/dashboard-reports",
          reportData
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Update Dashboard Report
//======================================================

export const updateDashboardReport =
  async (
    reportId,
    reportData
  ) => {

    if (!reportId) {
      throw new Error(
        "Dashboard report ID is required."
      );
    }

    if (!reportData) {
      throw new Error(
        "Dashboard report data is required."
      );
    }

    try {

      const response =
        await dashboardReportApi.put(
          `/dashboard-reports/${reportId}`,
          reportData
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Delete Dashboard Report
//======================================================

export const deleteDashboardReport =
  async (reportId) => {

    if (!reportId) {
      throw new Error(
        "Dashboard report ID is required."
      );
    }

    try {

      const response =
        await dashboardReportApi.delete(
          `/dashboard-reports/${reportId}`
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Bulk Delete Dashboard Reports
//======================================================

export const bulkDeleteDashboardReports =
  async (reportIds = []) => {

    if (
      !Array.isArray(reportIds) ||
      reportIds.length === 0
    ) {
      throw new Error(
        "At least one report ID is required."
      );
    }

    try {

      const response =
        await dashboardReportApi.delete(
          "/dashboard-reports/bulk",
          {
            data: {
              ids: reportIds,
            },
          }
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Search Dashboard Reports
//======================================================

export const searchDashboardReports =
  async (
    searchTerm,
    filters = {}
  ) => {

    try {

      const params = {
        ...filters,
        search:
          searchTerm || "",
      };

      const response =
        await dashboardReportApi.get(
          "/dashboard-reports/search",
          {
            params,
          }
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Filter Dashboard Reports
//======================================================

export const filterDashboardReportsApi =
  async (filters = {}) => {

    try {

      const response =
        await dashboardReportApi.get(
          "/dashboard-reports",
          {
            params: filters,
          }
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Dashboard Report Statistics
//======================================================

export const getDashboardReportStatistics =
  async (params = {}) => {

    try {

      const response =
        await dashboardReportApi.get(
          "/dashboard-reports/statistics",
          {
            params,
          }
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Dashboard Report Count
//======================================================

export const getDashboardReportCount =
  async (params = {}) => {

    try {

      const response =
        await dashboardReportApi.get(
          "/dashboard-reports/count",
          {
            params,
          }
        );

      const data =
        getResponseData(
          response
        );

      if (
        typeof data === "number"
      ) {
        return data;
      }

      return Number(
        data?.count ??
        data?.total ??
        data?.totalReports ??
        0
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Export Dashboard Reports
//======================================================

export const exportDashboardReports =
  async (
    reportIds = [],
    format = "csv",
    filters = {}
  ) => {

    try {

      const response =
        await dashboardReportApi.get(
          "/dashboard-reports/export",
          {
            params: {
              ids:
                reportIds.join(","),

              format,

              ...filters,
            },

            responseType: "blob",
          }
        );

      return response.data;

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Activate Dashboard Report
//======================================================

export const activateDashboardReport =
  async (reportId) => {

    if (!reportId) {
      throw new Error(
        "Dashboard report ID is required."
      );
    }

    try {

      const response =
        await dashboardReportApi.patch(
          `/dashboard-reports/${reportId}/activate`
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Deactivate Dashboard Report
//======================================================

export const deactivateDashboardReport =
  async (reportId) => {

    if (!reportId) {
      throw new Error(
        "Dashboard report ID is required."
      );
    }

    try {

      const response =
        await dashboardReportApi.patch(
          `/dashboard-reports/${reportId}/deactivate`
        );

      return getResponseData(
        response
      );

    } catch (error) {

      throw handleServiceError(
        error
      );

    }
  };

//======================================================
// Default Export
//======================================================

const DashboardReportService = {
  getDashboardReports,
  getDashboardReportById,
  createDashboardReport,
  updateDashboardReport,
  deleteDashboardReport,
  bulkDeleteDashboardReports,
  searchDashboardReports,
  filterDashboardReportsApi,
  getDashboardReportStatistics,
  getDashboardReportCount,
  exportDashboardReports,
  activateDashboardReport,
  deactivateDashboardReport,
};

export default DashboardReportService;