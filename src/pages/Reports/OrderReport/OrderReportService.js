// ======================================================
// OrderReportService.jsx
// ======================================================

import axios from "axios";

import {
  buildOrderReportQuery,
} from "./OrderReportHelpers";

// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "/api";

// ======================================================
// Axios Instance
// ======================================================

const orderReportApi = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
    Accept:
      "application/json",
  },
});

// ======================================================
// Request Interceptor
// ======================================================

orderReportApi.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem(
        "accessToken"
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

// ======================================================
// Response Interceptor
// ======================================================

orderReportApi.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(
      "Order Report API Error:",
      error?.response ||
        error
    );

    return Promise.reject(error);
  }
);

// ======================================================
// Endpoints
// ======================================================

const ENDPOINTS = {
  LIST:
    "/order-reports",

  SUMMARY:
    "/order-reports/summary",

  STATISTICS:
    "/order-reports/statistics",

  EXPORT:
    "/order-reports/export",

  HEALTH:
    "/order-reports/health",

  BULK_DELETE:
    "/order-reports/bulk-delete",

  BULK_ACTIVATE:
    "/order-reports/bulk-activate",

  BULK_DEACTIVATE:
    "/order-reports/bulk-deactivate",

  BULK_UPDATE:
    "/order-reports/bulk-update",
};

// ======================================================
// Normalize Response
// ======================================================

const normalizeResponse = (
  response
) => {
  if (!response) {
    return {
      success: false,
      data: [],
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      message:
        "No response received.",
    };
  }

  const data =
    response.data;

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    const items =
      data.items ??
      data.records ??
      data.results ??
      (Array.isArray(data.data)
        ? data.data
        : []);

    return {
      success:
        data.success !== undefined
          ? data.success
          : true,

      data:
        data.data ??
        items,

      items,

      total:
        data.total ??
        data.totalRecords ??
        data.count ??
        (Array.isArray(items)
          ? items.length
          : 0),

      page:
        data.page ?? 1,

      pageSize:
        data.pageSize ?? 10,

      totalPages:
        data.totalPages ?? 1,

      message:
        data.message ?? "",
    };
  }

  if (Array.isArray(data)) {
    return {
      success: true,
      data,
      items: data,
      total: data.length,
      page: 1,
      pageSize: data.length,
      totalPages: 1,
      message: "",
    };
  }

  return {
    success: true,
    data,
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    message: "",
  };
};

// ======================================================
// Normalize Error
// ======================================================

const normalizeError = (
  error
) => {
  const responseData =
    error?.response?.data;

  let message =
    "Unable to process order report request.";

  if (
    typeof responseData ===
    "string"
  ) {
    message = responseData;
  } else if (
    responseData?.message
  ) {
    message =
      responseData.message;
  } else if (
    responseData?.error
  ) {
    message =
      responseData.error;
  } else if (
    responseData?.title
  ) {
    message =
      responseData.title;
  } else if (error?.message) {
    message = error.message;
  }

  const normalized =
    new Error(message);

  normalized.status =
    error?.response?.status;

  normalized.originalError =
    error;

  return normalized;
};

// ======================================================
// Get Order Reports
// ======================================================

export const getOrderReports =
  async (params = {}) => {
    try {
      const query =
        buildOrderReportQuery(
          params
        );

      const url =
        query.length > 0
          ? `${ENDPOINTS.LIST}?${query}`
          : ENDPOINTS.LIST;

      const response =
        await orderReportApi.get(
          url
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Get Single Order Report
// ======================================================

export const getOrderReport =
  async (orderId) => {
    try {
      if (
        orderId === undefined ||
        orderId === null ||
        orderId === ""
      ) {
        throw new Error(
          "Order ID is required."
        );
      }

      const response =
        await orderReportApi.get(
          `${ENDPOINTS.LIST}/${encodeURIComponent(
            orderId
          )}`
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Alias
// ======================================================

export const getOrderReportById =
  async (orderId) => {
    return getOrderReport(
      orderId
    );
  };

// ======================================================
// Create
// ======================================================

export const createOrderReport =
  async (payload = {}) => {
    try {
      const response =
        await orderReportApi.post(
          ENDPOINTS.LIST,
          payload
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Update
// ======================================================

export const updateOrderReport =
  async (
    orderId,
    payload = {}
  ) => {
    try {
      if (
        orderId === undefined ||
        orderId === null ||
        orderId === ""
      ) {
        throw new Error(
          "Order ID is required."
        );
      }

      const response =
        await orderReportApi.put(
          `${ENDPOINTS.LIST}/${encodeURIComponent(
            orderId
          )}`,
          payload
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Delete
// ======================================================

export const deleteOrderReport =
  async (orderId) => {
    try {
      if (
        orderId === undefined ||
        orderId === null ||
        orderId === ""
      ) {
        throw new Error(
          "Order ID is required."
        );
      }

      const response =
        await orderReportApi.delete(
          `${ENDPOINTS.LIST}/${encodeURIComponent(
            orderId
          )}`
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Summary
// ======================================================

export const getOrderReportSummary =
  async (params = {}) => {
    try {
      const query =
        buildOrderReportQuery(
          params
        );

      const url =
        query.length > 0
          ? `${ENDPOINTS.SUMMARY}?${query}`
          : ENDPOINTS.SUMMARY;

      const response =
        await orderReportApi.get(
          url
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Statistics
// ======================================================

export const getOrderReportStatistics =
  async (params = {}) => {
    try {
      const query =
        buildOrderReportQuery(
          params
        );

      const url =
        query.length > 0
          ? `${ENDPOINTS.STATISTICS}?${query}`
          : ENDPOINTS.STATISTICS;

      const response =
        await orderReportApi.get(
          url
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Export
// ======================================================

export const exportOrderReport =
  async (payload = {}) => {
    try {
      const {
        format = "excel",
        fileName =
          "order-report",
        filters = {},
        reports = [],
      } = payload;

      const response =
        await orderReportApi.post(
          ENDPOINTS.EXPORT,
          {
            format,
            fileName,
            filters,
            reports,
          },
          {
            responseType: "blob",
          }
        );

      const blob =
        new Blob(
          [response.data],
          {
            type:
              response.headers[
                "content-type"
              ] ||
              "application/octet-stream",
          }
        );

      let downloadName =
        fileName;

      if (format === "excel") {
        downloadName += ".xlsx";
      } else if (
        format === "csv"
      ) {
        downloadName += ".csv";
      } else if (
        format === "pdf"
      ) {
        downloadName += ".pdf";
      } else {
        downloadName += `.${format}`;
      }

      const disposition =
        response.headers[
          "content-disposition"
        ];

      if (disposition) {
        const match =
          disposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );

        if (match?.[1]) {
          downloadName =
            match[1].replace(
              /['"]/g,
              ""
            );
        }
      }

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
        downloadName;

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
        message:
          "Order report exported successfully.",
        fileName:
          downloadName,
      };
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Search
// ======================================================

export const searchOrderReports =
  async (
    search = "",
    params = {}
  ) => {
    return getOrderReports({
      ...params,
      search,
    });
  };

// ======================================================
// Filter
// ======================================================

export const filterOrderReports =
  async (
    filters = {},
    params = {}
  ) => {
    return getOrderReports({
      ...params,
      ...filters,
    });
  };

// ======================================================
// Bulk Delete
// ======================================================

export const deleteOrderReports =
  async (orderIds = []) => {
    try {
      if (
        !Array.isArray(orderIds) ||
        orderIds.length === 0
      ) {
        throw new Error(
          "At least one order ID is required."
        );
      }

      const response =
        await orderReportApi.post(
          ENDPOINTS.BULK_DELETE,
          {
            ids: orderIds,
          }
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Bulk Activate
// ======================================================

export const activateOrderReports =
  async (orderIds = []) => {
    try {
      if (
        !Array.isArray(orderIds) ||
        orderIds.length === 0
      ) {
        throw new Error(
          "At least one order ID is required."
        );
      }

      const response =
        await orderReportApi.post(
          ENDPOINTS.BULK_ACTIVATE,
          {
            ids: orderIds,
          }
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Bulk Deactivate
// ======================================================

export const deactivateOrderReports =
  async (orderIds = []) => {
    try {
      if (
        !Array.isArray(orderIds) ||
        orderIds.length === 0
      ) {
        throw new Error(
          "At least one order ID is required."
        );
      }

      const response =
        await orderReportApi.post(
          ENDPOINTS.BULK_DEACTIVATE,
          {
            ids: orderIds,
          }
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Bulk Update
// ======================================================

export const updateOrderReports =
  async (
    orderIds = [],
    payload = {}
  ) => {
    try {
      if (
        !Array.isArray(orderIds) ||
        orderIds.length === 0
      ) {
        throw new Error(
          "At least one order ID is required."
        );
      }

      const response =
        await orderReportApi.put(
          ENDPOINTS.BULK_UPDATE,
          {
            ids: orderIds,
            ...payload,
          }
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(error);
    }
  };

// ======================================================
// Health Check
// ======================================================

export const checkOrderReportService =
  async () => {
    try {
      const response =
        await orderReportApi.get(
          ENDPOINTS.HEALTH
        );

      return (
        response.status >= 200 &&
        response.status < 300
      );
    } catch {
      return false;
    }
  };

// ======================================================
// Default Export
// ======================================================

const OrderReportService = {
  getOrderReports,

  getOrderReport,

  getOrderReportById,

  createOrderReport,

  updateOrderReport,

  deleteOrderReport,

  getOrderReportSummary,

  getOrderReportStatistics,

  getOrderChannels,

  exportOrderReport,

  searchOrderReports,

  filterOrderReports,

  deleteOrderReports,

  activateOrderReports,

  deactivateOrderReports,

  checkOrderReportService,
};


// ======================================================
// Get Order Channels
// ======================================================

export const getOrderChannels = async (
  params = {}
) => {
  try {
    const query =
      buildOrderReportQuery(params);

    const url = query
      ? `${ENDPOINTS.LIST}/channels?${query}`
      : `${ENDPOINTS.LIST}/channels`;

    const response =
      await orderReportApi.get(url);

    const normalized =
      normalizeResponse(response);

    // API may return:
    // data: [...]
    // items: [...]
    // channels: [...]

    const responseData =
      response?.data;

    const channels =
      responseData?.channels ??
      responseData?.data ??
      responseData?.items ??
      normalized.items ??
      normalized.data ??
      [];

    return {
      ...normalized,
      data: Array.isArray(channels)
        ? channels
        : [],
      items: Array.isArray(channels)
        ? channels
        : [],
    };
  } catch (error) {
    throw normalizeError(error);
  }
};
export default OrderReportService;