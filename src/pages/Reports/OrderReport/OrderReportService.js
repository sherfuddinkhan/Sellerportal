
import axios from "axios";
import { buildOrderReportQuery} from "./OrderReportHelpers";
//======================================================
// API Configuration
//======================================================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "/api";

//======================================================
// Axios Instance
//======================================================

const orderReportApi =
  axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type":
        "application/json",
    },
  });

//======================================================
// Request Interceptor
//======================================================

orderReportApi.interceptors.request.use(
  (config) => {
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

    return config;
  },
  (error) =>
    Promise.reject(error)
);

//======================================================
// Response Interceptor
//======================================================

orderReportApi.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    console.error(
      "Order Report API Error:",
      error
    );

    return Promise.reject(
      error
    );
  }
);

//======================================================
// API Endpoints
//======================================================

const ENDPOINTS = {
  LIST:
    "/order-reports",

  CREATE:
    "/order-reports",

  UPDATE:
    "/order-reports",

  DELETE:
    "/order-reports",

  EXPORT:
    "/order-reports/export",

  SUMMARY:
    "/order-reports/summary",
};

//======================================================
// Normalize API Response
//======================================================

const normalizeResponse = (
  response
) => {
  if (!response) {
    return {
      success: false,
      data: [],
      message:
        "No response received.",
    };
  }

  const responseData =
    response.data;

  if (
    responseData &&
    typeof responseData ===
      "object"
  ) {
    return {
      success:
        responseData.success !==
        undefined
          ? responseData.success
          : true,

      data:
        responseData.data ??
        responseData.items ??
        responseData.records ??
        responseData.results ??
        responseData,

      items:
        responseData.items ??
        responseData.records ??
        responseData.results ??
        [],

      total:
        responseData.total ??
        responseData.totalRecords ??
        responseData.count ??
        0,

      page:
        responseData.page ??
        1,

      pageSize:
        responseData.pageSize ??
        10,

      totalPages:
        responseData.totalPages ??
        1,

      message:
        responseData.message ??
        "",
    };
  }

  return {
    success: true,
    data: responseData,
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    message: "",
  };
};

//======================================================
// Normalize Error
//======================================================

const normalizeError = (
  error
) => {
  const message =
    error?.response?.data
      ?.message ||
    error?.response?.data
      ?.error ||
    error?.message ||
    "Unable to process order report request.";

  return new Error(
    message
  );
};

//======================================================
// Get Order Reports
//======================================================

export const getOrderReports =
  async (
    params = {}
  ) => {
    try {
      const query =
        buildOrderReportQuery(
          params
        );

      const url = query
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
      throw normalizeError(
        error
      );
    }
  };

//======================================================
// Get Single Order Report
//======================================================

export const getOrderReport =
  async (
    orderId
  ) => {
    try {
      if (
        orderId ===
          undefined ||
        orderId === null ||
        orderId === ""
      ) {
        throw new Error(
          "Order ID is required."
        );
      }

      const response =
        await orderReportApi.get(
          `${ENDPOINTS.LIST}/${orderId}`
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(
        error
      );
    }
  };
//======================================================
// Create Order Report
//======================================================

export const createOrderReport =
  async (payload = {}) => {
    try {
      const response =
        await orderReportApi.post(
          ENDPOINTS.CREATE,
          payload
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(
        error
      );
    }
  };

//======================================================
// Update Order Report
//======================================================

export const updateOrderReport =
  async (
    orderId,
    payload = {}
  ) => {
    try {
      if (
        orderId ===
          undefined ||
        orderId === null ||
        orderId === ""
      ) {
        throw new Error(
          "Order ID is required."
        );
      }

      const response =
        await orderReportApi.put(
          `${ENDPOINTS.UPDATE}/${orderId}`,
          payload
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(
        error
      );
    }
  };

//======================================================
// Delete Order Report
//======================================================

export const deleteOrderReport =
  async (orderId) => {
    try {
      if (
        orderId ===
          undefined ||
        orderId === null ||
        orderId === ""
      ) {
        throw new Error(
          "Order ID is required."
        );
      }

      const response =
        await orderReportApi.delete(
          `${ENDPOINTS.DELETE}/${orderId}`
        );

      return normalizeResponse(
        response
      );
    } catch (error) {
      throw normalizeError(
        error
      );
    }
  };

//======================================================
// Get Order Report Summary
//======================================================

export const getOrderReportSummary =
  async (params = {}) => {
    try {
      const query =
        buildOrderReportQuery(
          params
        );

      const url = query
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
      throw normalizeError(
        error
      );
    }
  };

//======================================================
// Export Order Report
//======================================================

export const exportOrderReport =
  async (payload = {}) => {
    try {
      const {
        format = "excel",
        fileName = "order-report",
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

      const contentDisposition =
        response.headers[
          "content-disposition"
        ];

      let downloadName =
        `${fileName}.${format}`;

      if (
        contentDisposition
      ) {
        const match =
          contentDisposition.match(
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

      link.remove();

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
      throw normalizeError(
        error
      );
    }
  };

//======================================================
// Search Order Reports
//======================================================

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

//======================================================
// Filter Order Reports
//======================================================

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

//======================================================
// Default Export
//======================================================

export default {
  getOrderReports,
  getOrderReport,
  createOrderReport,
  updateOrderReport,
  deleteOrderReport,
  getOrderReportSummary,
  exportOrderReport,
  searchOrderReports,
  filterOrderReports,
};


