//======================================================
// PurchaseReportService.js
//======================================================

import axios from "axios";

//======================================================
// Configuration
//======================================================

const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL ||
  "/api";

const PURCHASE_REPORT_ENDPOINT =
  `${API_BASE_URL}/purchase-reports`;

//======================================================
// Axios Client
//======================================================

const purchaseReportApi =
  axios.create({
    baseURL:
      API_BASE_URL,
    headers: {
      "Content-Type":
        "application/json",
    },
  });

//======================================================
// Request Interceptor
//======================================================

purchaseReportApi.interceptors.request.use(
  (config) => {
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

    return config;
  },
  (error) =>
    Promise.reject(error)
);

//======================================================
// Response Error Handler
//======================================================

purchaseReportApi.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    if (
      error?.response?.status ===
      401
    ) {
      // Authentication handling can
      // be added here if required.
    }

    return Promise.reject(
      error
    );
  }
);

//======================================================
// Safe Response Data
//======================================================

const getResponseData = (
  response
) => {
  if (!response) {
    return null;
  }

  return (
    response.data?.data ??
    response.data?.result ??
    response.data
  );
};

//======================================================
// Extract Report Array
//======================================================

const extractReports = (
  response
) => {
  const data =
    getResponseData(
      response
    );

  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    Array.isArray(
      data?.reports
    )
  ) {
    return data.reports;
  }

  if (
    Array.isArray(
      data?.items
    )
  ) {
    return data.items;
  }

  if (
    Array.isArray(
      data?.records
    )
  ) {
    return data.records;
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data;
  }

  return [];
};

//======================================================
// Extract Pagination
//======================================================

const extractPagination = (
  response
) => {
  const data =
    getResponseData(
      response
    ) || {};

  const pagination =
    data?.pagination ||
    data?.meta ||
    {};

  return {
    page:
      Number(
        pagination.page ??
          data.page ??
          1
      ) || 1,

    pageSize:
      Number(
        pagination.pageSize ??
          pagination.limit ??
          data.pageSize ??
          data.limit ??
          10
      ) || 10,

    totalRecords:
      Number(
        pagination.totalRecords ??
          pagination.total ??
          data.totalRecords ??
          data.total ??
          0
      ) || 0,

    totalPages:
      Number(
        pagination.totalPages ??
          data.totalPages ??
          0
      ) || 0,
  };
};

//======================================================
// Error Message
//======================================================

export const getPurchaseReportErrorMessage =
  (error) => {
    if (
      error?.response?.data
        ?.message
    ) {
      return error.response
        .data.message;
    }

    if (
      error?.response?.data
        ?.error
    ) {
      return error.response
        .data.error;
    }

    if (
      error?.message
    ) {
      return error.message;
    }

    return "Unable to process purchase report request.";
  };

//======================================================
// Get Purchase Reports
//======================================================

export const getPurchaseReports =
  async (
    params = {}
  ) => {
    try {
      const response =
        await purchaseReportApi.get(
          PURCHASE_REPORT_ENDPOINT,
          {
            params,
          }
        );

      return {
        success: true,

        reports:
          extractReports(
            response
          ),

        pagination:
          extractPagination(
            response
          ),

        statistics:
          getResponseData(
            response
          )?.statistics ||
          {},

        raw:
          response.data,
      };
    } catch (error) {
      return {
        success: false,

        reports: [],

        pagination: {
          page: 1,
          pageSize: 10,
          totalRecords: 0,
          totalPages: 0,
        },

        statistics: {},

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };

//======================================================
// Get Single Purchase Report
//======================================================

export const getPurchaseReportById =
  async (
    id
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      return {
        success: false,
        report: null,
        message:
          "Purchase report ID is required.",
      };
    }

    try {
      const response =
        await purchaseReportApi.get(
          `${PURCHASE_REPORT_ENDPOINT}/${encodeURIComponent(
            id
          )}`
        );

      return {
        success: true,

        report:
          getResponseData(
            response
          )?.report ||
          getResponseData(
            response
          ),

        raw:
          response.data,
      };
    } catch (error) {
      return {
        success: false,

        report: null,

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };
//======================================================
// Create Purchase Report
//======================================================

export const createPurchaseReport =
  async (payload = {}) => {
    try {
      const response =
        await purchaseReportApi.post(
          PURCHASE_REPORT_ENDPOINT,
          payload
        );

      return {
        success: true,

        report:
          getResponseData(
            response
          )?.report ||
          getResponseData(
            response
          ),

        message:
          response.data?.message ||
          "Purchase report created successfully.",

        raw:
          response.data,
      };
    } catch (error) {
      return {
        success: false,

        report: null,

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };

//======================================================
// Update Purchase Report
//======================================================

export const updatePurchaseReport =
  async (
    id,
    payload = {}
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      return {
        success: false,

        report: null,

        message:
          "Purchase report ID is required.",
      };
    }

    try {
      const response =
        await purchaseReportApi.put(
          `${PURCHASE_REPORT_ENDPOINT}/${encodeURIComponent(
            id
          )}`,
          payload
        );

      return {
        success: true,

        report:
          getResponseData(
            response
          )?.report ||
          getResponseData(
            response
          ),

        message:
          response.data?.message ||
          "Purchase report updated successfully.",

        raw:
          response.data,
      };
    } catch (error) {
      return {
        success: false,

        report: null,

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };

//======================================================
// Delete Purchase Report
//======================================================

export const deletePurchaseReport =
  async (
    id
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      return {
        success: false,

        message:
          "Purchase report ID is required.",
      };
    }

    try {
      const response =
        await purchaseReportApi.delete(
          `${PURCHASE_REPORT_ENDPOINT}/${encodeURIComponent(
            id
          )}`
        );

      return {
        success: true,

        message:
          response.data?.message ||
          "Purchase report deleted successfully.",

        raw:
          response.data,
      };
    } catch (error) {
      return {
        success: false,

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };

//======================================================
// Export Purchase Reports
//======================================================

export const exportPurchaseReports =
  async (
    params = {},
    format = "csv"
  ) => {
    try {
      const response =
        await purchaseReportApi.get(
          `${PURCHASE_REPORT_ENDPOINT}/export`,
          {
            params: {
              ...params,
              format,
            },

            responseType:
              "blob",
          }
        );

      return {
        success: true,

        blob:
          response.data,

        contentType:
          response.headers?.[
            "content-type"
          ],

        fileName:
          response.headers?.[
            "content-disposition"
          ] || null,

        raw:
          response,
      };
    } catch (error) {
      return {
        success: false,

        blob: null,

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };

//======================================================
// Get Purchase Report Statistics
//======================================================

export const getPurchaseReportStatistics =
  async (
    params = {}
  ) => {
    try {
      const response =
        await purchaseReportApi.get(
          `${PURCHASE_REPORT_ENDPOINT}/statistics`,
          {
            params,
          }
        );

      const data =
        getResponseData(
          response
        ) || {};

      return {
        success: true,

        statistics:
          data.statistics ||
          data,

        raw:
          response.data,
      };
    } catch (error) {
      return {
        success: false,

        statistics: {},

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };

//======================================================
// Get Purchase Report Filter Options
//======================================================

export const getPurchaseReportFilters =
  async () => {
    try {
      const response =
        await purchaseReportApi.get(
          `${PURCHASE_REPORT_ENDPOINT}/filters`
        );

      const data =
        getResponseData(
          response
        ) || {};

      return {
        success: true,

        marketplaces:
          data.marketplaces ||
          [],

        categories:
          data.categories ||
          [],

        statuses:
          data.statuses ||
          [],

        suppliers:
          data.suppliers ||
          [],

        raw:
          response.data,
      };
    } catch (error) {
      return {
        success: false,

        marketplaces: [],

        categories: [],

        statuses: [],

        suppliers: [],

        message:
          getPurchaseReportErrorMessage(
            error
          ),

        error,
      };
    }
  };

//======================================================
// Default Service Object
//======================================================

const PurchaseReportService = {
  getPurchaseReports,

  getPurchaseReportById,

  createPurchaseReport,

  updatePurchaseReport,

  deletePurchaseReport,

  exportPurchaseReports,

  getPurchaseReportStatistics,

  getPurchaseReportFilters,

  getPurchaseReportErrorMessage,
};

//======================================================
// Export
//======================================================

export default PurchaseReportService;

