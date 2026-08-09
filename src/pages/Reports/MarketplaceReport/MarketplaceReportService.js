//======================================================
// MarketplaceReportService.js
//======================================================

import axios from "axios";

//======================================================
// API Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "/api";

//======================================================
// API Client
//======================================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type":
      "application/json",
  },
  timeout: 30000,
});

//======================================================
// Request Interceptor
//======================================================

apiClient.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        ) ||
        localStorage.getItem(
          "accessToken"
        ) ||
        localStorage.getItem(
          "authToken"
        );

      if (token) {
        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;
      }
    } catch (error) {
      console.warn(
        "Unable to read authentication token:",
        error
      );
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

//======================================================
// Response Interceptor
//======================================================

apiClient.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    const status =
      error?.response?.status;

    if (status === 401) {
      console.warn(
        "Marketplace Report API authentication failed."
      );
    }

    return Promise.reject(error);
  }
);

//======================================================
// API Endpoints
//======================================================

const ENDPOINTS = {
  reports:
    "/marketplace-reports",

  reportById: (id) =>
    `/marketplace-reports/${id}`,

  statistics:
    "/marketplace-reports/statistics",

  marketplaces:
    "/marketplace-reports/marketplaces",

  statuses:
    "/marketplace-reports/statuses",

  categories:
    "/marketplace-reports/categories",

  export:
    "/marketplace-reports/export",
};

//======================================================
// Normalize API Response
//======================================================

const normalizeResponse = (
  response
) => {
  const data =
    response?.data;

  if (
    data &&
    typeof data ===
      "object" &&
    !Array.isArray(data)
  ) {
    return data;
  }

  return {
    data:
      Array.isArray(data)
        ? data
        : [],
  };
};

//======================================================
// Extract Report Collection
//======================================================

const extractReports = (
  response
) => {
  const data =
    normalizeResponse(
      response
    );

  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    Array.isArray(
      data.data
    )
  ) {
    return data.data;
  }

  if (
    Array.isArray(
      data.items
    )
  ) {
    return data.items;
  }

  if (
    Array.isArray(
      data.results
    )
  ) {
    return data.results;
  }

  if (
    Array.isArray(
      data.reports
    )
  ) {
    return data.reports;
  }

  return [];
};

//======================================================
// Build Query Parameters
//======================================================

const buildQueryParams = (
  params = {}
) => {
  const query = {};

  Object.entries(
    params || {}
  ).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        query[key] = value;
      }
    }
  );

  return query;
};

//======================================================
// Get Marketplace Reports
//======================================================

export const getMarketplaceReports =
  async (
    params = {}
  ) => {
    try {
      const response =
        await apiClient.get(
          ENDPOINTS.reports,
          {
            params:
              buildQueryParams(
                params
              ),
          }
        );

      return {
        ...normalizeResponse(
          response
        ),

        reports:
          extractReports(
            response
          ),
      };
    } catch (error) {
      console.error(
        "getMarketplaceReports error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Get Single Marketplace Report
//======================================================

export const getMarketplaceReport =
  async (id) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Marketplace report ID is required."
      );
    }

    try {
      const response =
        await apiClient.get(
          ENDPOINTS.reportById(
            id
          )
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      console.error(
        "getMarketplaceReport error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Part 1A Ends Here
//======================================================
//======================================================
// Create Marketplace Report
//======================================================

export const createMarketplaceReport =
  async (payload = {}) => {
    try {
      const response =
        await apiClient.post(
          ENDPOINTS.reports,
          payload
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      console.error(
        "createMarketplaceReport error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Update Marketplace Report
//======================================================

export const updateMarketplaceReport =
  async (
    id,
    payload = {}
  ) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Marketplace report ID is required."
      );
    }

    try {
      const response =
        await apiClient.put(
          ENDPOINTS.reportById(
            id
          ),
          payload
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      console.error(
        "updateMarketplaceReport error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Delete Marketplace Report
//======================================================

export const deleteMarketplaceReport =
  async (id) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Marketplace report ID is required."
      );
    }

    try {
      const response =
        await apiClient.delete(
          ENDPOINTS.reportById(
            id
          )
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      console.error(
        "deleteMarketplaceReport error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Get Marketplace Report Statistics
//======================================================

export const getMarketplaceReportStatistics =
  async (
    params = {}
  ) => {
    try {
      const response =
        await apiClient.get(
          ENDPOINTS.statistics,
          {
            params:
              buildQueryParams(
                params
              ),
          }
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      console.error(
        "getMarketplaceReportStatistics error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Get Marketplaces
//======================================================

export const getMarketplaces =
  async () => {
    try {
      const response =
        await apiClient.get(
          ENDPOINTS.marketplaces
        );

      const data =
        normalizeResponse(
          response
        );

      return (
        data.marketplaces ??
        data.data ??
        data.items ??
        []
      );
    } catch (error) {
      console.error(
        "getMarketplaces error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Get Marketplace Report Statuses
//======================================================

export const getMarketplaceReportStatuses =
  async () => {
    try {
      const response =
        await apiClient.get(
          ENDPOINTS.statuses
        );

      const data =
        normalizeResponse(
          response
        );

      return (
        data.statuses ??
        data.data ??
        data.items ??
        []
      );
    } catch (error) {
      console.error(
        "getMarketplaceReportStatuses error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Get Marketplace Report Categories
//======================================================

export const getMarketplaceReportCategories =
  async () => {
    try {
      const response =
        await apiClient.get(
          ENDPOINTS.categories
        );

      const data =
        normalizeResponse(
          response
        );

      return (
        data.categories ??
        data.data ??
        data.items ??
        []
      );
    } catch (error) {
      console.error(
        "getMarketplaceReportCategories error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// Search Marketplace Reports
//======================================================

export const searchMarketplaceReports =
  async (
    searchTerm,
    params = {}
  ) => {
    const queryParams = {
      ...params,
      search:
        searchTerm ?? "",
    };

    return getMarketplaceReports(
      queryParams
    );
  };

//======================================================
// Filter Marketplace Reports
//======================================================

export const filterMarketplaceReports =
  async (
    filters = {}
  ) => {
    return getMarketplaceReports(
      filters
    );
  };

//======================================================
// Get Marketplace Reports By Date Range
//======================================================

export const getMarketplaceReportsByDateRange =
  async (
    dateFrom,
    dateTo,
    params = {}
  ) => {
    return getMarketplaceReports({
      ...params,
      dateFrom,
      dateTo,
    });
  };

//======================================================
// Export Marketplace Reports
//======================================================

export const exportMarketplaceReports =
  async (
    params = {},
    format = "csv"
  ) => {
    try {
      const response =
        await apiClient.get(
          ENDPOINTS.export,
          {
            params:
              buildQueryParams({
                ...params,
                format,
              }),

            responseType:
              "blob",
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "exportMarketplaceReports error:",
        error
      );

      throw error;
    }
  };

//======================================================
// Download Marketplace Report File
//======================================================

export const downloadMarketplaceReport =
  async (
    params = {},
    format = "csv",
    fileName = "marketplace-report"
  ) => {
    const blob =
      await exportMarketplaceReports(
        params,
        format
      );

    if (!blob) {
      throw new Error(
        "No export data received."
      );
    }

    const mimeTypes = {
      csv:
        "text/csv;charset=utf-8;",
      excel:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xlsx:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pdf:
        "application/pdf",
    };

    const extensions = {
      csv: "csv",
      excel: "xlsx",
      xlsx: "xlsx",
      pdf: "pdf",
    };

    const safeFormat =
      String(format)
        .toLowerCase();

    const extension =
      extensions[
        safeFormat
      ] || "csv";

    const finalFileName =
      fileName
        .toLowerCase()
        .endsWith(
          `.${extension}`
        )
        ? fileName
        : `${fileName}.${extension}`;

    const fileBlob =
      blob instanceof Blob
        ? blob
        : new Blob(
            [blob],
            {
              type:
                mimeTypes[
                  safeFormat
                ] ||
                "application/octet-stream",
            }
          );

    const url =
      window.URL.createObjectURL(
        fileBlob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      finalFileName;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    window.URL.revokeObjectURL(
      url
    );

    return {
      success: true,
      fileName:
        finalFileName,
    };
  };

//======================================================
// Refresh Marketplace Report
//======================================================

export const refreshMarketplaceReports =
  async (
    params = {}
  ) => {
    return getMarketplaceReports(
      params
    );
  };

//======================================================
// Default Export
//======================================================

const MarketplaceReportService = {
  getMarketplaceReports,

  getMarketplaceReport,

  createMarketplaceReport,

  updateMarketplaceReport,

  deleteMarketplaceReport,

  getMarketplaceReportStatistics,

  getMarketplaces,

  getMarketplaceReportStatuses,

  getMarketplaceReportCategories,

  searchMarketplaceReports,

  filterMarketplaceReports,

  getMarketplaceReportsByDateRange,

  exportMarketplaceReports,

  downloadMarketplaceReport,

  refreshMarketplaceReports,
};

export default MarketplaceReportService;

