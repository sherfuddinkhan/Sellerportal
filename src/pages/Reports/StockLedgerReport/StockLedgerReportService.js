//======================================================
// StockLedgerReportService.js
// Part 1A
//======================================================

import axios from "axios";

//======================================================
// API Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const STOCK_LEDGER_ENDPOINT =
  `${API_BASE_URL}/stock-ledger`;

//======================================================
// Axios Instance
//======================================================

const stockLedgerApi = axios.create({
  baseURL:
    STOCK_LEDGER_ENDPOINT,

  headers: {
    "Content-Type":
      "application/json",
  },

  timeout: 30000,
});

//======================================================
// Request Interceptor
//======================================================

stockLedgerApi.interceptors.request.use(
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
          "jwtToken"
        );

      if (token) {
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

stockLedgerApi.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    if (
      error?.response?.status ===
      401
    ) {
      console.warn(
        "Stock Ledger API authentication expired."
      );
    }

    return Promise.reject(
      normalizeApiError(error)
    );
  }
);

//======================================================
// Normalize API Error
//======================================================

export const normalizeApiError = (
  error
) => {
  if (!error) {
    return new Error(
      "Unknown Stock Ledger API error."
    );
  }

  if (error instanceof Error) {
    return error;
  }

  const responseData =
    error?.response?.data;

  const message =
    responseData?.message ||
    responseData?.error ||
    responseData?.title ||
    error?.message ||
    "Stock Ledger API request failed.";

  const normalizedError =
    new Error(message);

  normalizedError.status =
    error?.response?.status;

  normalizedError.data =
    responseData;

  normalizedError.originalError =
    error;

  return normalizedError;
};

//======================================================
// Extract API Data
//======================================================

export const extractApiData = (
  response
) => {
  const data =
    response?.data;

  if (
    data === null ||
    data === undefined
  ) {
    return null;
  }

  // Common API response formats

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "data"
    )
  ) {
    return data.data;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "result"
    )
  ) {
    return data.result;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "records"
    )
  ) {
    return data.records;
  }

  return data;
};

//======================================================
// Extract Records
//======================================================

export const extractRecords = (
  response
) => {
  const data =
    extractApiData(response);

  if (
    Array.isArray(data)
  ) {
    return data;
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
      data?.rows
    )
  ) {
    return data.rows;
  }

  if (
    Array.isArray(
      data?.records
    )
  ) {
    return data.records;
  }

  return [];
};

//======================================================
// Get Stock Ledger Reports
//======================================================

export const getStockLedgerReports =
  async (
    params = {}
  ) => {
    try {
      const response =
        await stockLedgerApi.get(
          "",
          {
            params,
          }
        );

      return {
        data:
          extractRecords(
            response
          ),

        pagination:
          extractPagination(
            response
          ),

        raw:
          response?.data,
      };
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Get Stock Ledger Report By ID
//======================================================

export const getStockLedgerReportById =
  async (
    id
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Stock Ledger Report ID is required."
      );
    }

    try {
      const response =
        await stockLedgerApi.get(
          `/${encodeURIComponent(
            id
          )}`
        );

      return extractApiData(
        response
      );
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Create Stock Ledger Report
//======================================================

export const createStockLedgerReport =
  async (
    payload = {}
  ) => {
    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "A valid Stock Ledger payload is required."
      );
    }

    try {
      const response =
        await stockLedgerApi.post(
          "",
          payload
        );

      return extractApiData(
        response
      );
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Update Stock Ledger Report
//======================================================

export const updateStockLedgerReport =
  async (
    id,
    payload = {}
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Stock Ledger Report ID is required."
      );
    }

    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "A valid Stock Ledger payload is required."
      );
    }

    try {
      const response =
        await stockLedgerApi.put(
          `/${encodeURIComponent(
            id
          )}`,
          payload
        );

      return extractApiData(
        response
      );
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Delete Stock Ledger Report
//======================================================

export const deleteStockLedgerReport =
  async (
    id
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Stock Ledger Report ID is required."
      );
    }

    try {
      const response =
        await stockLedgerApi.delete(
          `/${encodeURIComponent(
            id
          )}`
        );

      return extractApiData(
        response
      );
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Search Stock Ledger Reports
//======================================================

export const searchStockLedgerReports =
  async (
    searchTerm = "",
    params = {}
  ) => {
    try {
      const response =
        await stockLedgerApi.get(
          "/search",
          {
            params: {
              ...params,
              search:
                searchTerm,
            },
          }
        );

      return {
        data:
          extractRecords(
            response
          ),

        pagination:
          extractPagination(
            response
          ),

        raw:
          response?.data,
      };
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Get Stock Ledger Statistics
//======================================================

export const getStockLedgerStatistics =
  async (
    params = {}
  ) => {
    try {
      const response =
        await stockLedgerApi.get(
          "/statistics",
          {
            params,
          }
        );

      return (
        extractApiData(
          response
        ) || {}
      );
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Get Filter Options
//======================================================

export const getStockLedgerFilterOptions =
  async (
    params = {}
  ) => {
    try {
      const response =
        await stockLedgerApi.get(
          "/filter-options",
          {
            params,
          }
        );

      return (
        extractApiData(
          response
        ) || {}
      );
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Pagination Helper
//======================================================

export const extractPagination = (
  response
) => {
  const data =
    response?.data;

  const pagination =
    data?.pagination ||
    data?.meta ||
    {};

  return {
    page:
      pagination.page ??
      pagination.currentPage ??
      1,

    pageSize:
      pagination.pageSize ??
      pagination.limit ??
      10,

    total:
      pagination.total ??
      pagination.totalRecords ??
      0,

    totalPages:
      pagination.totalPages ??
      0,
  };
};

//======================================================
// Get Stock Ledger Summary
//======================================================

export const getStockLedgerSummary =
  async (
    params = {}
  ) => {
    try {
      const response =
        await stockLedgerApi.get(
          "/summary",
          {
            params,
          }
        );

      return (
        extractApiData(
          response
        ) || {}
      );
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Export Stock Ledger Report
//======================================================

export const exportStockLedgerReport =
  async (
    params = {}
  ) => {
    try {
      const response =
        await stockLedgerApi.get(
          "/export",
          {
            params,
            responseType:
              "blob",
          }
        );

      return response.data;
    } catch (error) {
      throw normalizeApiError(
        error
      );
    }
  };

//======================================================
// Part 1A Ends Here
//======================================================