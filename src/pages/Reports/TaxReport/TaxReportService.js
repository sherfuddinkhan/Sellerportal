//======================================================
// TaxReportService.js
// Part 1A
//======================================================

//======================================================
// API Configuration
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

//======================================================
// API Endpoints
//======================================================

const TAX_REPORT_ENDPOINT =
  `${API_BASE_URL}/tax-reports`;

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
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  const query =
    searchParams.toString();

  return query
    ? `?${query}`
    : "";
};

//======================================================
// Get Authentication Token
//======================================================

const getAuthToken = () => {
  const token =
    localStorage.getItem(
      "token"
    ) ||
    localStorage.getItem(
      "accessToken"
    ) ||
    localStorage.getItem(
      "authToken"
    );

  return token;
};

//======================================================
// Build Headers
//======================================================

const buildHeaders = (
  includeJson = true
) => {
  const headers = {};

  if (includeJson) {
    headers[
      "Content-Type"
    ] = "application/json";
  }

  const token =
    getAuthToken();

  if (token) {
    headers[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  return headers;
};

//======================================================
// Handle API Response
//======================================================

const handleResponse = async (
  response
) => {
  let data = null;

  const contentType =
    response.headers.get(
      "content-type"
    );

  try {
    if (
      contentType &&
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
  } catch (error) {
    throw new Error(
      "Unable to read server response."
    );
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.msg ||
      `Request failed with status ${response.status}`;

    const apiError =
      new Error(message);

    apiError.status =
      response.status;

    apiError.data =
      data;

    throw apiError;
  }

  return data;
};

//======================================================
// Extract Report List
//======================================================

export const extractTaxReports = (
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
      response?.records
    )
  ) {
    return response.records;
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
      response?.results
    )
  ) {
    return response.results;
  }

  return [];
};

//======================================================
// GET Tax Reports
//======================================================

export const getTaxReports = async (
  params = {},
  options = {}
) => {
  const {
    signal,
  } = options;

  const queryString =
    buildQueryString(
      params
    );

  const response =
    await fetch(
      `${TAX_REPORT_ENDPOINT}${queryString}`,
      {
        method: "GET",
        headers:
          buildHeaders(false),
        signal,
      }
    );

  return handleResponse(
    response
  );
};

//======================================================
// GET Tax Reports List
//======================================================

export const fetchTaxReports = async (
  params = {},
  options = {}
) => {
  const response =
    await getTaxReports(
      params,
      options
    );

  return extractTaxReports(
    response
  );
};

//======================================================
// GET Single Tax Report
//======================================================

export const getTaxReportById =
  async (
    id,
    options = {}
  ) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Tax report ID is required."
      );
    }

    const {
      signal,
    } = options;

    const response =
      await fetch(
        `${TAX_REPORT_ENDPOINT}/${encodeURIComponent(
          id
        )}`,
        {
          method: "GET",
          headers:
            buildHeaders(false),
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

//======================================================
// CREATE Tax Report
//======================================================

export const createTaxReport =
  async (
    report,
    options = {}
  ) => {
    if (!report) {
      throw new Error(
        "Tax report data is required."
      );
    }

    const {
      signal,
    } = options;

    const response =
      await fetch(
        TAX_REPORT_ENDPOINT,
        {
          method: "POST",
          headers:
            buildHeaders(true),
          body: JSON.stringify(
            report
          ),
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

//======================================================
// UPDATE Tax Report
//======================================================

export const updateTaxReport =
  async (
    id,
    report,
    options = {}
  ) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Tax report ID is required."
      );
    }

    if (!report) {
      throw new Error(
        "Tax report data is required."
      );
    }

    const {
      signal,
    } = options;

    const response =
      await fetch(
        `${TAX_REPORT_ENDPOINT}/${encodeURIComponent(
          id
        )}`,
        {
          method: "PUT",
          headers:
            buildHeaders(true),
          body: JSON.stringify(
            report
          ),
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

//======================================================
// PATCH Tax Report
//======================================================

export const patchTaxReport =
  async (
    id,
    changes,
    options = {}
  ) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Tax report ID is required."
      );
    }

    if (!changes) {
      throw new Error(
        "Tax report changes are required."
      );
    }

    const {
      signal,
    } = options;

    const response =
      await fetch(
        `${TAX_REPORT_ENDPOINT}/${encodeURIComponent(
          id
        )}`,
        {
          method: "PATCH",
          headers:
            buildHeaders(true),
          body: JSON.stringify(
            changes
          ),
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

//======================================================
// DELETE Tax Report
//======================================================

export const deleteTaxReport =
  async (
    id,
    options = {}
  ) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "Tax report ID is required."
      );
    }

    const {
      signal,
    } = options;

    const response =
      await fetch(
        `${TAX_REPORT_ENDPOINT}/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
          headers:
            buildHeaders(false),
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

//======================================================
// Get Tax Report Summary
//======================================================

export const getTaxReportSummary =
  async (
    params = {},
    options = {}
  ) => {
    const {
      signal,
    } = options;

    const queryString =
      buildQueryString(
        params
      );

    const response =
      await fetch(
        `${TAX_REPORT_ENDPOINT}/summary${queryString}`,
        {
          method: "GET",
          headers:
            buildHeaders(false),
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

//======================================================
// Get Tax Report Statistics
//======================================================

export const getTaxReportStatistics =
  async (
    params = {},
    options = {}
  ) => {
    const {
      signal,
    } = options;

    const queryString =
      buildQueryString(
        params
      );

    const response =
      await fetch(
        `${TAX_REPORT_ENDPOINT}/statistics${queryString}`,
        {
          method: "GET",
          headers:
            buildHeaders(false),
          signal,
        }
      );

    return handleResponse(
      response
    );
  };

//======================================================
// Export Tax Report
//======================================================

export const exportTaxReport =
  async (
    params = {},
    options = {}
  ) => {
    const {
      signal,
      format = "csv",
    } = options;

    const queryString =
      buildQueryString({
        ...params,
        format,
      });

    const response =
      await fetch(
        `${TAX_REPORT_ENDPOINT}/export${queryString}`,
        {
          method: "GET",
          headers:
            buildHeaders(false),
          signal,
        }
      );

    if (!response.ok) {
      return handleResponse(
        response
      );
    }

    return response.blob();
  };

//======================================================
// Part 1A Ends Here
//======================================================