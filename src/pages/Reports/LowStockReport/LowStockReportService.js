//======================================================
// LowStockReportService.js
//======================================================

import axios from "axios";

//======================================================
// API Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const LOW_STOCK_ENDPOINT =
  `${API_BASE_URL}/reports/low-stock`;

//======================================================
// Axios Client
//======================================================

const lowStockApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//======================================================
// Authorization Interceptor
//======================================================

lowStockApi.interceptors.request.use(
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
// Helper: Normalize Parameters
//======================================================

const cleanParams = (
  params = {}
) => {
  const cleaned = {};

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        cleaned[key] = value;
      }
    }
  );

  return cleaned;
};

//======================================================
// GET Low Stock Reports
//======================================================

export const getLowStockReports =
  async ({
    page = 1,
    pageSize = 10,
    ...filters
  } = {}) => {

    const params =
      cleanParams({
        page,
        pageSize,
        ...filters,
      });

    const response =
      await lowStockApi.get(
        LOW_STOCK_ENDPOINT,
        {
          params,
        }
      );

    return response;
  };

//======================================================
// GET Low Stock Report Statistics
//======================================================

export const getLowStockReportStatistics =
  async (
    filters = {}
  ) => {

    const params =
      cleanParams({
        ...filters,
      });

    const response =
      await lowStockApi.get(
        `${LOW_STOCK_ENDPOINT}/statistics`,
        {
          params,
        }
      );

    return response;
  };

//======================================================
// GET Single Low Stock Report
//======================================================

export const getLowStockReportById =
  async (
    id
  ) => {

    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Low stock report ID is required."
      );
    }

    const response =
      await lowStockApi.get(
        `${LOW_STOCK_ENDPOINT}/${id}`
      );

    return response;
  };

//======================================================
// CREATE Low Stock Report
//======================================================

export const createLowStockReport =
  async (
    report
  ) => {

    if (
      !report ||
      typeof report !==
        "object"
    ) {
      throw new Error(
        "Valid report data is required."
      );
    }

    const response =
      await lowStockApi.post(
        LOW_STOCK_ENDPOINT,
        report
      );

    return response;
  };

//======================================================
// UPDATE Low Stock Report
//======================================================

export const updateLowStockReport =
  async (
    id,
    report
  ) => {

    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Low stock report ID is required."
      );
    }

    if (
      !report ||
      typeof report !==
        "object"
    ) {
      throw new Error(
        "Valid report data is required."
      );
    }

    const response =
      await lowStockApi.put(
        `${LOW_STOCK_ENDPOINT}/${id}`,
        report
      );

    return response;
  };

//======================================================
// DELETE Single Low Stock Report
//======================================================

export const deleteLowStockReport =
  async (
    id
  ) => {

    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Low stock report ID is required."
      );
    }

    const response =
      await lowStockApi.delete(
        `${LOW_STOCK_ENDPOINT}/${id}`
      );

    return response;
  };

//======================================================
// DELETE Multiple Low Stock Reports
//======================================================

export const deleteLowStockReports =
  async (
    ids = []
  ) => {

    if (
      !Array.isArray(ids) ||
      ids.length === 0
    ) {
      throw new Error(
        "At least one report ID is required."
      );
    }

    const response =
      await lowStockApi.delete(
        LOW_STOCK_ENDPOINT,
        {
          data: {
            ids,
          },
        }
      );

    return response;
  };

//======================================================
// EXPORT Low Stock Reports
//======================================================

export const exportLowStockReports =
  async ({
    format = "xlsx",
    ...filters
  } = {}) => {

    const params =
      cleanParams({
        format,
        ...filters,
      });

    const response =
      await lowStockApi.get(
        `${LOW_STOCK_ENDPOINT}/export`,
        {
          params,
          responseType: "blob",
        }
      );

    return response;
  };

//======================================================
// DOWNLOAD Export File
//======================================================

export const downloadLowStockReport =
  async ({
    format = "xlsx",
    fileName,
    ...filters
  } = {}) => {

    const response =
      await exportLowStockReports({
        format,
        ...filters,
      });

    const blob =
      new Blob(
        [response.data],
        {
          type:
            response.headers?.[
              "content-type"
            ] ||
            "application/octet-stream",
        }
      );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      fileName ||
      `low-stock-report.${format}`;

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

    return response;
  };

//======================================================
// Refresh Report
//======================================================

export const refreshLowStockReports =
  async (
    filters = {}
  ) => {

    const [
      reportsResponse,
      statisticsResponse,
    ] = await Promise.all([
      getLowStockReports(
        filters
      ),
      getLowStockReportStatistics(
        filters
      ),
    ]);

    return {
      reports:
        reportsResponse,
      statistics:
        statisticsResponse,
    };
  };

//======================================================
// Default Export
//======================================================

const LowStockReportService = {
  getLowStockReports,
  getLowStockReportStatistics,
  getLowStockReportById,
  createLowStockReport,
  updateLowStockReport,
  deleteLowStockReport,
  deleteLowStockReports,
  exportLowStockReports,
  downloadLowStockReport,
  refreshLowStockReports,
};

export default LowStockReportService;
