//======================================================
// SalesReportService.js
// Part 1A
//======================================================

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
  reports: `${API_BASE_URL}/sales-reports`,
  summary: `${API_BASE_URL}/sales-reports/summary`,
  statistics: `${API_BASE_URL}/sales-reports/statistics`,
  export: `${API_BASE_URL}/sales-reports/export`,
};

//======================================================
// Request Headers
//======================================================

const getHeaders = () => ({
  "Content-Type":
    "application/json",
  Accept:
    "application/json",
});

//======================================================
// Build Query String
//======================================================

const buildQueryString = (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
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
        if (value.length > 0) {
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
// Handle API Response
//======================================================

const handleResponse = async (
  response
) => {
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

    const error =
      new Error(message);

    error.status =
      response.status;

    error.data = data;

    throw error;
  }

  return data;
};

//======================================================
// GET Request
//======================================================

const get = async (
  url,
  options = {}
) => {
  const response =
    await fetch(url, {
      method: "GET",

      headers: {
        ...getHeaders(),
        ...(options.headers ||
          {}),
      },

      signal:
        options.signal,
    });

  return handleResponse(
    response
  );
};

//======================================================
// POST Request
//======================================================

const post = async (
  url,
  body = {},
  options = {}
) => {
  const response =
    await fetch(url, {
      method: "POST",

      headers: {
        ...getHeaders(),
        ...(options.headers ||
          {}),
      },

      body: JSON.stringify(
        body
      ),

      signal:
        options.signal,
    });

  return handleResponse(
    response
  );
};

//======================================================
// PUT Request
//======================================================

const put = async (
  url,
  body = {},
  options = {}
) => {
  const response =
    await fetch(url, {
      method: "PUT",

      headers: {
        ...getHeaders(),
        ...(options.headers ||
          {}),
      },

      body: JSON.stringify(
        body
      ),

      signal:
        options.signal,
    });

  return handleResponse(
    response
  );
};

//======================================================
// DELETE Request
//======================================================

const remove = async (
  url,
  options = {}
) => {
  const response =
    await fetch(url, {
      method: "DELETE",

      headers: {
        ...getHeaders(),
        ...(options.headers ||
          {}),
      },

      signal:
        options.signal,
    });

  return handleResponse(
    response
  );
};

//======================================================
// Get Sales Reports
//======================================================

export const getSalesReports =
  async ({
    page = 1,
    pageSize = 10,
    search = "",
    marketplace = "",
    category = "",
    status = "",
    customer = "",
    startDate = "",
    endDate = "",
    sortField = "date",
    sortDirection = "desc",
    signal,
  } = {}) => {
    const query =
      buildQueryString({
        page,
        pageSize,
        search,
        marketplace,
        category,
        status,
        customer,
        startDate,
        endDate,
        sortField,
        sortDirection,
      });

    return get(
      `${ENDPOINTS.reports}${query}`,
      {
        signal,
      }
    );
  };

//======================================================
// Get Single Sales Report
//======================================================

export const getSalesReportById =
  async (
    reportId,
    {
      signal,
    } = {}
  ) => {
    if (
      !reportId
    ) {
      throw new Error(
        "Sales report ID is required."
      );
    }

    return get(
      `${ENDPOINTS.reports}/${encodeURIComponent(
        reportId
      )}`,
      {
        signal,
      }
    );
  };

//======================================================
// Get Sales Report Summary
//======================================================

export const getSalesReportSummary =
  async ({
    startDate = "",
    endDate = "",
    marketplace = "",
    category = "",
    status = "",
    signal,
  } = {}) => {
    const query =
      buildQueryString({
        startDate,
        endDate,
        marketplace,
        category,
        status,
      });

    return get(
      `${ENDPOINTS.summary}${query}`,
      {
        signal,
      }
    );
  };

//======================================================
// Get Sales Report Statistics
//======================================================

export const getSalesReportStatistics =
  async ({
    startDate = "",
    endDate = "",
    marketplace = "",
    category = "",
    status = "",
    signal,
  } = {}) => {
    const query =
      buildQueryString({
        startDate,
        endDate,
        marketplace,
        category,
        status,
      });

    return get(
      `${ENDPOINTS.statistics}${query}`,
      {
        signal,
      }
    );
  };
//======================================================
// Create Sales Report
//======================================================

export const createSalesReport =
  async (
    reportData,
    {
      signal,
    } = {}
  ) => {
    if (
      !reportData ||
      typeof reportData !==
        "object"
    ) {
      throw new Error(
        "Sales report data is required."
      );
    }

    return post(
      ENDPOINTS.reports,
      reportData,
      {
        signal,
      }
    );
  };

//======================================================
// Update Sales Report
//======================================================

export const updateSalesReport =
  async (
    reportId,
    reportData,
    {
      signal,
    } = {}
  ) => {
    if (!reportId) {
      throw new Error(
        "Sales report ID is required."
      );
    }

    if (
      !reportData ||
      typeof reportData !==
        "object"
    ) {
      throw new Error(
        "Sales report data is required."
      );
    }

    return put(
      `${ENDPOINTS.reports}/${encodeURIComponent(
        reportId
      )}`,
      reportData,
      {
        signal,
      }
    );
  };

//======================================================
// Delete Sales Report
//======================================================

export const deleteSalesReport =
  async (
    reportId,
    {
      signal,
    } = {}
  ) => {
    if (!reportId) {
      throw new Error(
        "Sales report ID is required."
      );
    }

    return remove(
      `${ENDPOINTS.reports}/${encodeURIComponent(
        reportId
      )}`,
      {
        signal,
      }
    );
  };

//======================================================
// Bulk Delete Sales Reports
//======================================================

export const deleteSalesReports =
  async (
    reportIds = [],
    {
      signal,
    } = {}
  ) => {
    if (
      !Array.isArray(
        reportIds
      ) ||
      reportIds.length === 0
    ) {
      throw new Error(
        "At least one sales report ID is required."
      );
    }

    return post(
      `${ENDPOINTS.reports}/bulk-delete`,
      {
        ids: reportIds,
      },
      {
        signal,
      }
    );
  };

//======================================================
// Search Sales Reports
//======================================================

export const searchSalesReports =
  async (
    search = "",
    options = {}
  ) => {
    return getSalesReports({
      ...options,
      search,
    });
  };

//======================================================
// Filter Sales Reports
//======================================================

export const filterSalesReports =
  async (
    filters = {},
    options = {}
  ) => {
    return getSalesReports({
      ...options,
      ...filters,
      page: 1,
    });
  };

//======================================================
// Get Marketplace Options
//======================================================

export const getSalesReportMarketplaces =
  async ({
    signal,
  } = {}) => {
    const data =
      await get(
        `${ENDPOINTS.reports}/marketplaces`,
        {
          signal,
        }
      );

    return (
      data?.data ||
      data?.marketplaces ||
      data ||
      []
    );
  };

//======================================================
// Get Category Options
//======================================================

export const getSalesReportCategories =
  async ({
    marketplace = "",
    signal,
  } = {}) => {
    const query =
      buildQueryString({
        marketplace,
      });

    const data =
      await get(
        `${ENDPOINTS.reports}/categories${query}`,
        {
          signal,
        }
      );

    return (
      data?.data ||
      data?.categories ||
      data ||
      []
    );
  };

//======================================================
// Get Status Options
//======================================================

export const getSalesReportStatuses =
  async ({
    signal,
  } = {}) => {
    const data =
      await get(
        `${ENDPOINTS.reports}/statuses`,
        {
          signal,
        }
      );

    return (
      data?.data ||
      data?.statuses ||
      data ||
      []
    );
  };

//======================================================
// Export Sales Reports
//======================================================

export const exportSalesReports =
  async ({
    format = "csv",
    search = "",
    marketplace = "",
    category = "",
    status = "",
    customer = "",
    startDate = "",
    endDate = "",
    signal,
  } = {}) => {
    const query =
      buildQueryString({
        format,
        search,
        marketplace,
        category,
        status,
        customer,
        startDate,
        endDate,
      });

    const response =
      await fetch(
        `${ENDPOINTS.export}${query}`,
        {
          method: "GET",

          headers: {
            Accept:
              format === "pdf"
                ? "application/pdf"
                : format === "excel" ||
                  format ===
                    "xlsx"
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : "text/csv",
          },

          signal,
        }
      );

    if (!response.ok) {
      let message =
        `Export failed with status ${response.status}`;

      try {
        const data =
          await response.json();

        message =
          data?.message ||
          data?.error ||
          message;
      } catch {
        // Ignore JSON parsing
        // failure for binary
        // responses.
      }

      throw new Error(
        message
      );
    }

    return response.blob();
  };

//======================================================
// Download Exported Report
//======================================================

export const downloadSalesReport =
  async (
    options = {}
  ) => {
    const {
      format = "csv",
      fileName = "sales-report",
    } = options;

    const blob =
      await exportSalesReports(
        options
      );

    const extension =
      format === "excel" ||
      format === "xlsx"
        ? "xlsx"
        : format === "pdf"
        ? "pdf"
        : "csv";

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
      `${fileName}.${extension}`;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    document.body.removeChild(
      anchor
    );

    window.URL.revokeObjectURL(
      url
    );

    return true;
  };

//======================================================
// Default Export
//======================================================

export default {
  getSalesReports,
  getSalesReportById,
  getSalesReportSummary,
  getSalesReportStatistics,
  createSalesReport,
  updateSalesReport,
  deleteSalesReport,
  deleteSalesReports,
  searchSalesReports,
  filterSalesReports,
  getSalesReportMarketplaces,
  getSalesReportCategories,
  getSalesReportStatuses,
  exportSalesReports,
  downloadSalesReport,
};

