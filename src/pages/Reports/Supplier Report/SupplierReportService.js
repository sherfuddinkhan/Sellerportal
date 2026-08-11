//======================================================
// SuppliesReportService.js
// Part 1A
//======================================================

import axios from "axios";

import {
  normalizeSupplyReports,
} from "./SuppliesReportHelpers";

//======================================================
// API Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

//======================================================
// Axios Client
//======================================================

const api = axios.create({
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

api.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        ) ||
        localStorage.getItem(
          "accessToken"
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
    Promise.reject(
      error
    )
);

//======================================================
// Response Interceptor
//======================================================

api.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    if (
      error?.response?.status ===
      401
    ) {
      console.warn(
        "Supplies report request is unauthorized."
      );
    }

    return Promise.reject(
      error
    );
  }
);

//======================================================
// API Endpoints
//======================================================

const ENDPOINTS = {
  list:
    "/supplies-reports",

  details:
    "/supplies-reports",

  create:
    "/supplies-reports",

  update:
    "/supplies-reports",

  delete:
    "/supplies-reports",

  export:
    "/supplies-reports/export",
};

//======================================================
// Extract Response Data
//======================================================

const extractData = (
  response
) => {
  const data =
    response?.data;

  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data;
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
      data?.results
    )
  ) {
    return data.results;
  }

  return data;
};

//======================================================
// Extract Error Message
//======================================================

export const getServiceErrorMessage = (
  error,
  fallback =
    "Unable to process supplies report request."
) => {
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
    typeof error?.response
      ?.data ===
    "string"
  ) {
    return error.response
      .data;
  }

  if (
    error?.message
  ) {
    return error.message;
  }

  return fallback;
};

//======================================================
// Get Supplies Reports
//======================================================

export const getSuppliesReports =
  async (
    params = {}
  ) => {
    try {
      const response =
        await api.get(
          ENDPOINTS.list,
          {
            params,
          }
        );

      const data =
        extractData(
          response
        );

      return normalizeSupplyReports(
        Array.isArray(
          data
        )
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "getSuppliesReports failed:",
        error
      );

      throw new Error(
        getServiceErrorMessage(
          error,
          "Unable to load supplies reports."
        )
      );
    }
  };

//======================================================
// Get Supply Report By ID
//======================================================

export const getSupplyReportById =
  async (
    id
  ) => {
    if (
      id ===
        undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Supply report ID is required."
      );
    }

    try {
      const response =
        await api.get(
          `${ENDPOINTS.details}/${encodeURIComponent(
            id
          )}`
        );

      const data =
        extractData(
          response
        );

      return normalizeSupplyReports(
        [
          data,
        ]
      )[0] || null;
    } catch (error) {
      console.error(
        "getSupplyReportById failed:",
        error
      );

      throw new Error(
        getServiceErrorMessage(
          error,
          "Unable to load the supply report."
        )
      );
    }
  };

//======================================================
// Create Supply Report
//======================================================

export const createSupplyReport =
  async (
    payload
  ) => {
    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "Supply report data is required."
      );
    }

    try {
      const response =
        await api.post(
          ENDPOINTS.create,
          payload
        );

      const data =
        extractData(
          response
        );

      if (
        data &&
        !Array.isArray(
          data
        )
      ) {
        return normalizeSupplyReports(
          [data]
        )[0];
      }

      return data;
    } catch (error) {
      console.error(
        "createSupplyReport failed:",
        error
      );

      throw new Error(
        getServiceErrorMessage(
          error,
          "Unable to create supply report."
        )
      );
    }
  };

//======================================================
// Update Supply Report
//======================================================

export const updateSupplyReport =
  async (
    id,
    payload
  ) => {
    if (
      id ===
        undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Supply report ID is required."
      );
    }

    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "Supply report data is required."
      );
    }

    try {
      const response =
        await api.put(
          `${ENDPOINTS.update}/${encodeURIComponent(
            id
          )}`,
          payload
        );

      const data =
        extractData(
          response
        );

      if (
        data &&
        !Array.isArray(
          data
        )
      ) {
        return normalizeSupplyReports(
          [data]
        )[0];
      }

      return data;
    } catch (error) {
      console.error(
        "updateSupplyReport failed:",
        error
      );

      throw new Error(
        getServiceErrorMessage(
          error,
          "Unable to update supply report."
        )
      );
    }
  };

//======================================================
// Delete Supply Report
//======================================================

export const deleteSupplyReport =
  async (
    id
  ) => {
    if (
      id ===
        undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Supply report ID is required."
      );
    }

    try {
      const response =
        await api.delete(
          `${ENDPOINTS.delete}/${encodeURIComponent(
            id
          )}`
        );

      return (
        response?.data || {
          success: true,
        }
      );
    } catch (error) {
      console.error(
        "deleteSupplyReport failed:",
        error
      );

      throw new Error(
        getServiceErrorMessage(
          error,
          "Unable to delete supply report."
        )
      );
    }
  };

//======================================================
// Search Supplies Reports
//======================================================

export const searchSuppliesReports =
  async (
    search,
    filters = {}
  ) => {
    return getSuppliesReports({
      ...filters,
      search:
        search || "",
    });
  };

//======================================================
// Get Supplies Report Statistics
//======================================================

export const getSuppliesReportStatistics =
  async (
    params = {}
  ) => {
    try {
      const response =
        await api.get(
          `${ENDPOINTS.list}/statistics`,
          {
            params,
          }
        );

      const data =
        extractData(
          response
        );

      return (
        data || {
          total: 0,
          totalQuantity: 0,
          totalAmount: 0,
          totalSuppliers: 0,
          totalItems: 0,
          averageAmount: 0,
          averageQuantity: 0,
        }
      );
    } catch (error) {
      console.error(
        "getSuppliesReportStatistics failed:",
        error
      );

      throw new Error(
        getServiceErrorMessage(
          error,
          "Unable to load supply report statistics."
        )
      );
    }
  };

//======================================================
// Export Supplies Reports
//======================================================

export const exportSuppliesReports =
  async (
    params = {}
  ) => {
    try {
      const response =
        await api.get(
          ENDPOINTS.export,
          {
            params,
            responseType:
              "blob",
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "exportSuppliesReports failed:",
        error
      );

      throw new Error(
        getServiceErrorMessage(
          error,
          "Unable to export supplies reports."
        )
      );
    }
  };

//======================================================
// Download Exported Report
//======================================================

export const downloadSuppliesReport =
  async (
    params = {},
    fileName =
      "supplies-report.csv"
  ) => {
    const blob =
      await exportSuppliesReports(
        params
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

    return true;
  };

//======================================================
// Health Check
//======================================================

export const checkSuppliesReportService =
  async () => {
    try {
      await api.get(
        ENDPOINTS.list,
        {
          params: {
            limit: 1,
          },
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Supplies report service health check failed:",
        error
      );

      return false;
    }
  };

//======================================================
// Default Service Object
//======================================================

const SuppliesReportService = {
  getSuppliesReports,
  getSupplyReportById,
  createSupplyReport,
  updateSupplyReport,
  deleteSupplyReport,
  searchSuppliesReports,
  getSuppliesReportStatistics,
  exportSuppliesReports,
  downloadSuppliesReport,
  checkSuppliesReportService,
  getServiceErrorMessage,
};

//======================================================
// Export
//======================================================

export default SuppliesReportService;

//======================================================
// Part 1A Ends Here
//======================================================