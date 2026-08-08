//======================================================
// InventoryReportService.js
//======================================================

import {
  filterReports,
  searchReports,
  sortReports,
} from "./InventoryReportHelper";

//======================================================
// API Base URL
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3001";

//======================================================
// Endpoint
//======================================================

const INVENTORY_REPORT_ENDPOINT =
  `${API_BASE_URL}/api/inventory-reports`;

//======================================================
// Common Request Helper
//======================================================

const request = async (
  url,
  options = {}
) => {

  const response =
    await fetch(url, {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(options.headers || {}),
      },
    });

  let data = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {

    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};

//======================================================
// Extract Data From API Response
//======================================================

const extractReports = (
  response
) => {

  if (
    Array.isArray(response)
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.reports
    )
  ) {
    return response.reports;
  }

  if (
    Array.isArray(
      response?.data?.reports
    )
  ) {
    return response.data.reports;
  }

  return [];
};

//======================================================
// Get All Reports
//======================================================

export const getInventoryReports =
  async (
    params = {}
  ) => {

    const query =
      new URLSearchParams();

    Object.entries(params)
      .forEach(
        ([key, value]) => {

          if (
            value !==
              undefined &&
            value !== null &&
            value !== ""
          ) {
            query.set(
              key,
              value
            );
          }

        }
      );

    const queryString =
      query.toString();

    const url =
      queryString
        ? `${INVENTORY_REPORT_ENDPOINT}?${queryString}`
        : INVENTORY_REPORT_ENDPOINT;

    const response =
      await request(url);

    return {
      data:
        extractReports(
          response
        ),

      raw:
        response,
    };
  };

//======================================================
// Get Report By ID
//======================================================

export const getInventoryReportById =
  async (
    reportId
  ) => {

    if (
      reportId ===
        undefined ||
      reportId === null ||
      reportId === ""
    ) {
      throw new Error(
        "Inventory report ID is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/${encodeURIComponent(
          reportId
        )}`
      );

    return (
      response?.data ??
      response?.report ??
      response
    );
  };

//======================================================
// Create Report
//======================================================

export const createInventoryReport =
  async (
    payload
  ) => {

    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "Inventory report data is required."
      );
    }

    const response =
      await request(
        INVENTORY_REPORT_ENDPOINT,
        {
          method: "POST",

          body: JSON.stringify(
            payload
          ),
        }
      );

    return (
      response?.data ??
      response?.report ??
      response
    );
  };

//======================================================
// Update Report
//======================================================

export const updateInventoryReport =
  async (
    reportId,
    payload
  ) => {

    if (
      reportId ===
        undefined ||
      reportId === null ||
      reportId === ""
    ) {
      throw new Error(
        "Inventory report ID is required."
      );
    }

    if (
      !payload ||
      typeof payload !==
        "object"
    ) {
      throw new Error(
        "Inventory report data is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/${encodeURIComponent(
          reportId
        )}`,
        {
          method: "PUT",

          body: JSON.stringify(
            payload
          ),
        }
      );

    return (
      response?.data ??
      response?.report ??
      response
    );
  };

//======================================================
// Delete Report
//======================================================

export const deleteInventoryReport =
  async (
    reportId
  ) => {

    if (
      reportId ===
        undefined ||
      reportId === null ||
      reportId === ""
    ) {
      throw new Error(
        "Inventory report ID is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/${encodeURIComponent(
          reportId
        )}`,
        {
          method: "DELETE",
        }
      );

    return response;
  };

//======================================================
// Part 1A Ends Here
//======================================================
//======================================================
// Activate Report
//======================================================

export const activateInventoryReport =
  async (
    reportId
  ) => {

    if (
      reportId ===
        undefined ||
      reportId === null ||
      reportId === ""
    ) {
      throw new Error(
        "Inventory report ID is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/${encodeURIComponent(
          reportId
        )}/activate`,
        {
          method: "PATCH",
        }
      );

    return (
      response?.data ??
      response?.report ??
      response
    );
  };

//======================================================
// Deactivate Report
//======================================================

export const deactivateInventoryReport =
  async (
    reportId
  ) => {

    if (
      reportId ===
        undefined ||
      reportId === null ||
      reportId === ""
    ) {
      throw new Error(
        "Inventory report ID is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/${encodeURIComponent(
          reportId
        )}/deactivate`,
        {
          method: "PATCH",
        }
      );

    return (
      response?.data ??
      response?.report ??
      response
    );
  };

//======================================================
// Search Reports
//======================================================

export const searchInventoryReports =
  async (
    reports,
    searchTerm
  ) => {

    return searchReports(
      reports,
      searchTerm
    );
  };

//======================================================
// Filter Reports
//======================================================

export const filterInventoryReports =
  (
    reports,
    filters
  ) => {

    return filterReports(
      reports,
      filters
    );
  };

//======================================================
// Sort Reports
//======================================================

export const sortInventoryReports =
  (
    reports,
    field,
    direction
  ) => {

    return sortReports(
      reports,
      field,
      direction
    );
  };

//======================================================
// Bulk Delete
//======================================================

export const deleteInventoryReports =
  async (
    reportIds
  ) => {

    if (
      !Array.isArray(
        reportIds
      ) ||
      reportIds.length === 0
    ) {
      throw new Error(
        "At least one inventory report ID is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/bulk-delete`,
        {
          method: "POST",

          body: JSON.stringify({
            ids: reportIds,
          }),
        }
      );

    return response;
  };

//======================================================
// Bulk Activate
//======================================================

export const activateInventoryReports =
  async (
    reportIds
  ) => {

    if (
      !Array.isArray(
        reportIds
      ) ||
      reportIds.length === 0
    ) {
      throw new Error(
        "At least one inventory report ID is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/bulk-activate`,
        {
          method: "POST",

          body: JSON.stringify({
            ids: reportIds,
          }),
        }
      );

    return response;
  };

//======================================================
// Bulk Deactivate
//======================================================

export const deactivateInventoryReports =
  async (
    reportIds
  ) => {

    if (
      !Array.isArray(
        reportIds
      ) ||
      reportIds.length === 0
    ) {
      throw new Error(
        "At least one inventory report ID is required."
      );
    }

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/bulk-deactivate`,
        {
          method: "POST",

          body: JSON.stringify({
            ids: reportIds,
          }),
        }
      );

    return response;
  };

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// Get Inventory Report Statistics
//======================================================

export const getInventoryReportStatistics =
  async () => {

    const response =
      await request(
        `${INVENTORY_REPORT_ENDPOINT}/statistics`
      );

    return (
      response?.data ??
      response?.statistics ??
      response
    );
  };

//======================================================
// Export Inventory Reports
//======================================================

export const exportInventoryReports =
  async (
    params = {}
  ) => {

    const query =
      new URLSearchParams();

    Object.entries(params)
      .forEach(
        ([key, value]) => {

          if (
            value !== undefined &&
            value !== null &&
            value !== ""
          ) {
            query.set(
              key,
              value
            );
          }

        }
      );

    const queryString =
      query.toString();

    const url =
      `${INVENTORY_REPORT_ENDPOINT}/export` +
      (
        queryString
          ? `?${queryString}`
          : ""
      );

    const response =
      await fetch(url, {
        method: "GET",
      });

    if (!response.ok) {

      throw new Error(
        `Export failed with status ${response.status}`
      );
    }

    return response.blob();
  };

//======================================================
// Download Export File
//======================================================

export const downloadInventoryReportFile =
  (
    blob,
    fileName = "inventory-reports.xlsx"
  ) => {

    if (!blob) {
      throw new Error(
        "Export file is empty."
      );
    }

    const url =
      window.URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href = url;

    anchor.download =
      fileName;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    window.URL.revokeObjectURL(
      url
    );
  };

//======================================================
// Health Check
//======================================================

export const checkInventoryReportService =
  async () => {

    try {

      await request(
        `${INVENTORY_REPORT_ENDPOINT}/health`
      );

      return true;

    } catch {
      return false;
    }
  };

//======================================================
// Service Object
//======================================================

const InventoryReportService = {

  getInventoryReports,

  getInventoryReportById,

  createInventoryReport,

  updateInventoryReport,

  deleteInventoryReport,

  activateInventoryReport,

  deactivateInventoryReport,

  searchInventoryReports,

  filterInventoryReports,

  sortInventoryReports,

  deleteInventoryReports,

  activateInventoryReports,

  deactivateInventoryReports,

  getInventoryReportStatistics,

  exportInventoryReports,

  downloadInventoryReportFile,

  checkInventoryReportService,
};

//======================================================
// Export
//======================================================

export default InventoryReportService;