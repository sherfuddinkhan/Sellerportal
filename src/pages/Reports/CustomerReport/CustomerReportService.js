//======================================================
// Customer Report Service
//======================================================

import axios from "axios";

//======================================================
// API Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

//======================================================
// Axios Instance
//======================================================

const customerReportApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//======================================================
// Authentication Token
//======================================================

customerReportApi.interceptors.request.use(
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

const handleError = (error) => {
  if (error?.response) {
    const message = error.response.data?.message || error.response.data?.error || `Request failed with status ${error.response.status}`;
    throw new Error(message);
  }
  if (error?.request) {
    throw new Error("Unable to connect to the server.");
  }
  throw new Error(error?.message ||"An unexpected error occurred.");
};
//======================================================
// Extract API Data
//======================================================
const extractData = (response) => {
  return ( response?.data?.data ?? response?.data?.result ??response?.data ?? []);
};
//======================================================
// Get Customer Reports
//======================================================
export const getCustomerReports = async (
  params = {}
) => {
  try {
    const response = await customerReportApi.get(
        "/customer-reports",
        {
          params,
        }
      );
    return extractData(response);
  } catch (error) {
    handleError(error);
  }
};

//======================================================
// Get Customer Report By ID
//======================================================

export const getCustomerReportById =
  async (customerId) => {
    if (!customerId) {
      throw new Error(
        "Customer ID is required."
      );
    }
    try {
      const response = await customerReportApi.get(
          `/customer-reports/${customerId}`
        );
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Search Customer Reports
//======================================================
export const searchCustomerReports =
  async (search, params = {}) => {
    try {
      const response = await customerReportApi.get(
          "/customer-reports/search",
          {
            params: {
              ...params,
              search: search || "",
            },
          }
        );
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Create Customer
//======================================================
export const createCustomer =
  async (customerData) => {
    if (!customerData) {throw new Error("Customer data is required.");}
    try {
      const response = await customerReportApi.post("/customer-reports",customerData);
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };

//======================================================
// Update Customer
//======================================================
export const updateCustomer =
  async (
    customerId,
    customerData
  ) => {
    if (!customerId) {
        throw new Error(
        "Customer ID is required."
      );
    }
    if (!customerData) {
      throw new Error(
        "Customer data is required."
      );
    }
    try {
      const response = await customerReportApi.put(
          `/customer-reports/${customerId}`,
          customerData
        );
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Delete Customer
//======================================================
export const deleteCustomer =
  async (customerId) => {
    if (!customerId) {
      throw new Error(
        "Customer ID is required."
      );
    }
    try {
      const response = await customerReportApi.delete(
          `/customer-reports/${customerId}`
        );
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Bulk Delete Customers
//======================================================
export const deleteCustomers =
  async (customerIds = []) => {
    if (
      !Array.isArray(customerIds) ||
      customerIds.length === 0
    ) {
      throw new Error(
        "At least one customer must be selected."
      );
    }
    try {
      const response = await customerReportApi.delete(
          "/customer-reports/bulk",
          {
            data: {
              ids: customerIds,
            },
          }
        );
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Activate Customer
//======================================================
export const activateCustomer =
  async (customerId) => {
    if (!customerId) {
      throw new Error("Customer ID is required.");
    }
    try {
      const response = await customerReportApi.patch(`/customer-reports/${customerId}/activate`);
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Deactivate Customer
//======================================================
export const deactivateCustomer =
  async (customerId) => {
    if (!customerId) {
      throw new Error("Customer ID is required.");
    }
    try {
      const response = await customerReportApi.patch(`/customer-reports/${customerId}/deactivate`);
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Get Customer Statistics
//======================================================
export const getCustomerReportStatistics =
  async (params = {}) => {
    try {
      const response = await customerReportApi.get("/customer-reports/statistics",
          {
            params,
          }
        );
      return extractData(response);
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Export Customer Report
//======================================================
export const exportCustomerReport =
  async (
    params = {},
    format = "excel"
  ) => {
    try {
      const response = await customerReportApi.get("/customer-reports/export",
          {
            params: {
              ...params,
              format,
            },
            responseType: "blob",
          }
        );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };
//======================================================
// Download Exported Report
//======================================================
export const downloadCustomerReport =
  async (
    params = {},
    format = "excel",
    filename
  ) => {
    const blob = await exportCustomerReport(params,format);
    const extension = format === "pdf" ? "pdf" : format === "csv" ? "csv" : "xlsx";
    const defaultFilename = `customer-report.${extension}`;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || defaultFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  };
//======================================================
// Default Service Object
//======================================================
const CustomerReportService = {
  getCustomerReports,
  getCustomerReportById,
  searchCustomerReports,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  deleteCustomers,
  activateCustomer,
  deactivateCustomer,
  getCustomerReportStatistics,
  exportCustomerReport,
  downloadCustomerReport,
};

export default CustomerReportService;