//======================================================
// StockMovementReportService.js
// Part 1A
//======================================================

import {
  normalizeMovementReport,
  normalizeMovementReports,
} from "./StockMovementReportHelpers";

//======================================================
// Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "/api";

//======================================================
// API Endpoints
//======================================================

const ENDPOINTS = {
  list: `${API_BASE_URL}/stock-movement-reports`,

  details: (id) =>
    `${API_BASE_URL}/stock-movement-reports/${id}`,

  create: `${API_BASE_URL}/stock-movement-reports`,

  update: (id) =>
    `${API_BASE_URL}/stock-movement-reports/${id}`,

  delete: (id) =>
    `${API_BASE_URL}/stock-movement-reports/${id}`,

  export: `${API_BASE_URL}/stock-movement-reports/export`,
};

//======================================================
// Build Query String
//======================================================

const buildQueryString = (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  Object.entries(
    params
  ).forEach(
    ([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return;
      }

      if (
        Array.isArray(value)
      ) {
        if (
          value.length > 0
        ) {
          searchParams.set(
            key,
            value.join(",")
          );
        }

        return;
      }

      searchParams.set(
        key,
        String(value)
      );
    }
  );

  const query =
    searchParams.toString();

  return query
    ? `?${query}`
    : "";
};

//======================================================
// Parse Response
//======================================================

const parseResponse = async (
  response
) => {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data;

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    data =
      await response.json();
  } else {
    const text =
      await response.text();

    try {
      data =
        text
          ? JSON.parse(text)
          : null;
    } catch {
      data = text;
    }
  }

  if (
    !response.ok
  ) {
    const message =
      typeof data ===
        "object" &&
      data !== null
        ? data.message ||
          data.error ||
          data.title
        : data;

    throw new Error(
      message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
};

//======================================================
// Extract Report Array
//======================================================

const extractReports = (
  response
) => {
  if (
    Array.isArray(
      response
    )
  ) {
    return response;
  }

  if (
    !response ||
    typeof response !==
      "object"
  ) {
    return [];
  }

  if (
    Array.isArray(
      response.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response.reports
    )
  ) {
    return response.reports;
  }

  if (
    Array.isArray(
      response.items
    )
  ) {
    return response.items;
  }

  if (
    Array.isArray(
      response.results
    )
  ) {
    return response.results;
  }

  return [];
};

//======================================================
// Extract Single Report
//======================================================

const extractReport = (
  response
) => {
  if (
    !response
  ) {
    return null;
  }

  if (
    response.data &&
    !Array.isArray(
      response.data
    )
  ) {
    return response.data;
  }

  if (
    response.report
  ) {
    return response.report;
  }

  if (
    response.item
  ) {
    return response.item;
  }

  return response;
};

//======================================================
// Request Headers
//======================================================

const getHeaders = (
  additionalHeaders = {}
) => {
  const token =
    localStorage.getItem(
      "token"
    ) ||
    localStorage.getItem(
      "accessToken"
    );

  const headers = {
    Accept:
      "application/json",
    "Content-Type":
      "application/json",
    ...additionalHeaders,
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  return headers;
};

//======================================================
// Get Stock Movement Reports
//======================================================

export const getStockMovementReports =
  async (
    filters = {}
  ) => {
    const query =
      buildQueryString(
        filters
      );

    const response =
      await fetch(
        `${ENDPOINTS.list}${query}`,
        {
          method: "GET",
          headers:
            getHeaders(),
        }
      );

    const data =
      await parseResponse(
        response
      );

    return {
      data:
        normalizeMovementReports(
          extractReports(
            data
          )
        ),

      raw: data,
    };
  };

//======================================================
// Get Single Stock Movement Report
//======================================================

export const getStockMovementReport =
  async (
    id
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Stock movement report ID is required."
      );
    }

    const response =
      await fetch(
        ENDPOINTS.details(
          encodeURIComponent(
            id
          )
        ),
        {
          method: "GET",
          headers:
            getHeaders(),
        }
      );

    const data =
      await parseResponse(
        response
      );

    const report =
      extractReport(
        data
      );

    return {
      data:
        report
          ? normalizeMovementReport(
              report
            )
          : null,

      raw: data,
    };
  };

//======================================================
// Create Stock Movement Report
//======================================================

export const createStockMovementReport =
  async (
    report
  ) => {
    if (
      !report ||
      typeof report !==
        "object"
    ) {
      throw new Error(
        "Stock movement report data is required."
      );
    }

    const payload =
      normalizeMovementReport(
        report
      );

    const response =
      await fetch(
        ENDPOINTS.create,
        {
          method: "POST",
          headers:
            getHeaders(),
          body:
            JSON.stringify(
              payload
            ),
        }
      );

    const data =
      await parseResponse(
        response
      );

    const createdReport =
      extractReport(
        data
      );

    return {
      data:
        createdReport
          ? normalizeMovementReport(
              createdReport
            )
          : null,

      raw: data,
    };
  };

//======================================================
// Update Stock Movement Report
//======================================================

export const updateStockMovementReport =
  async (
    id,
    report
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Stock movement report ID is required."
      );
    }

    if (
      !report ||
      typeof report !==
        "object"
    ) {
      throw new Error(
        "Stock movement report data is required."
      );
    }

    const payload =
      normalizeMovementReport(
        report
      );

    const response =
      await fetch(
        ENDPOINTS.update(
          encodeURIComponent(
            id
          )
        ),
        {
          method: "PUT",
          headers:
            getHeaders(),
          body:
            JSON.stringify(
              payload
            ),
        }
      );

    const data =
      await parseResponse(
        response
      );

    const updatedReport =
      extractReport(
        data
      );

    return {
      data:
        updatedReport
          ? normalizeMovementReport(
              updatedReport
            )
          : null,

      raw: data,
    };
  };

//======================================================
// Delete Stock Movement Report
//======================================================

export const deleteStockMovementReport =
  async (
    id
  ) => {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      throw new Error(
        "Stock movement report ID is required."
      );
    }

    const response =
      await fetch(
        ENDPOINTS.delete(
          encodeURIComponent(
            id
          )
        ),
        {
          method: "DELETE",
          headers:
            getHeaders(),
        }
      );

    const data =
      await parseResponse(
        response
      );

    return {
      success: true,
      data,
      raw: data,
    };
  };

//======================================================
// Get Reports By Date Range
//======================================================

export const getStockMovementReportsByDate =
  async (
    startDate,
    endDate,
    additionalFilters = {}
  ) => {
    const filters = {
      ...additionalFilters,
      startDate,
      endDate,
    };

    return getStockMovementReports(
      filters
    );
  };

//======================================================
// Get Reports By Stock Item
//======================================================

export const getStockMovementReportsByItem =
  async (
    stockItem,
    additionalFilters = {}
  ) => {
    if (
      !stockItem
    ) {
      throw new Error(
        "Stock item is required."
      );
    }

    return getStockMovementReports(
      {
        ...additionalFilters,
        stockItem,
      }
    );
  };

//======================================================
// Get Reports By Warehouse
//======================================================

export const getStockMovementReportsByWarehouse =
  async (
    warehouse,
    additionalFilters = {}
  ) => {
    if (
      !warehouse
    ) {
      throw new Error(
        "Warehouse is required."
      );
    }

    return getStockMovementReports(
      {
        ...additionalFilters,
        warehouse,
      }
    );
  };

//======================================================
// Export Stock Movement Report
//======================================================

export const exportStockMovementReport =
  async (
    reports,
    format = "csv"
  ) => {
    if (
      !Array.isArray(
        reports
      )
    ) {
      throw new Error(
        "Reports must be an array."
      );
    }

    const payload = {
      format,
      reports:
        normalizeMovementReports(
          reports
        ),
    };

    const response =
      await fetch(
        ENDPOINTS.export,
        {
          method: "POST",
          headers:
            getHeaders(),
          body:
            JSON.stringify(
              payload
            ),
        }
      );

    return parseResponse(
      response
    );
  };

//======================================================
// Get API URL
//======================================================

export const getStockMovementReportApiUrl =
  () => {
    return ENDPOINTS.list;
  };

//======================================================
// Default Service Object
//======================================================

const StockMovementReportService = {
  getStockMovementReports,

  getStockMovementReport,

  createStockMovementReport,

  updateStockMovementReport,

  deleteStockMovementReport,

  getStockMovementReportsByDate,

  getStockMovementReportsByItem,

  getStockMovementReportsByWarehouse,

  exportStockMovementReport,

  getStockMovementReportApiUrl,
};

//======================================================
// Export
//======================================================

export default StockMovementReportService;

//======================================================
// Part 1A Ends Here
//======================================================