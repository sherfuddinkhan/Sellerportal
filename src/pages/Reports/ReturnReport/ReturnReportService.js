//======================================================
// ReturnReportService.js
//======================================================

import axios from "axios";

//======================================================
// API Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "/api";

//======================================================
// Axios Client
//======================================================

const returnReportApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type":
      "application/json",
  },
});

//======================================================
// Request Interceptor
//======================================================

returnReportApi.interceptors.request.use(
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

returnReportApi.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";

    return Promise.reject(
      new Error(message)
    );
  }
);

//======================================================
// Normalize API Response
//======================================================

const normalizeResponse = (
  response
) => {
  const data =
    response?.data;

  if (Array.isArray(data)) {
    return {
      data,
      totalRecords:
        data.length,
      totalPages: 1,
      page: 1,
      pageSize:
        data.length || 10,
    };
  }

  const records =
    data?.data ??
    data?.records ??
    data?.items ??
    data?.results ??
    [];

  return {
    data: Array.isArray(
      records
    )
      ? records
      : [],

    totalRecords:
      Number(
        data?.totalRecords ??
          data?.totalCount ??
          data?.count ??
          records.length
      ) || 0,

    totalPages:
      Number(
        data?.totalPages ??
          0
      ) || 0,

    page:
      Number(
        data?.page ??
          1
      ) || 1,

    pageSize:
      Number(
        data?.pageSize ??
          data?.limit ??
          10
      ) || 10,
  };
};
//======================================================
// Get Return Reports
//======================================================

export const getReturnReports = async (
  params = {}
) => {
  const response =
    await returnReportApi.get(
      "/returns/reports",
      {
        params,
      }
    );

  return normalizeResponse(
    response
  );
};

//======================================================
// Get Return Report By ID
//======================================================

export const getReturnReportById =
  async (id) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Return report ID is required."
      );
    }

    const response =
      await returnReportApi.get(
        `/returns/reports/${encodeURIComponent(
          id
        )}`
      );

    return (
      response?.data?.data ??
      response?.data
    );
  };

//======================================================
// Create Return Report
//======================================================

export const createReturnReport =
  async (payload) => {
    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "Return report data is required."
      );
    }

    const response =
      await returnReportApi.post(
        "/returns/reports",
        payload
      );

    return (
      response?.data?.data ??
      response?.data
    );
  };

//======================================================
// Update Return Report
//======================================================

export const updateReturnReport =
  async (
    id,
    payload
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Return report ID is required."
      );
    }

    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "Return report data is required."
      );
    }

    const response =
      await returnReportApi.put(
        `/returns/reports/${encodeURIComponent(
          id
        )}`,
        payload
      );

    return (
      response?.data?.data ??
      response?.data
    );
  };

//======================================================
// Delete Return Report
//======================================================

export const deleteReturnReport =
  async (id) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Return report ID is required."
      );
    }

    const response =
      await returnReportApi.delete(
        `/returns/reports/${encodeURIComponent(
          id
        )}`
      );

    return (
      response?.data?.data ??
      response?.data
    );
  };

//======================================================
// Export Return Reports
//======================================================

export const exportReturnReports =
  async (
    params = {}
  ) => {
    const response =
      await returnReportApi.get(
        "/returns/reports/export",
        {
          params,
          responseType: "blob",
        }
      );

    return response.data;
  };

//======================================================
// Get Return Report Statistics
//======================================================

export const getReturnReportStatistics =
  async (
    params = {}
  ) => {
    const response =
      await returnReportApi.get(
        "/returns/reports/statistics",
        {
          params,
        }
      );

    return (
      response?.data?.data ??
      response?.data ??
      {}
    );
  };

//======================================================
// Default Service Object
//======================================================

const ReturnReportService = {
  getReturnReports,
  getReturnReportById,
  createReturnReport,
  updateReturnReport,
  deleteReturnReport,
  exportReturnReports,
  getReturnReportStatistics,
};

//======================================================
// Export
//======================================================

export default ReturnReportService;


