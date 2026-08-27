// ======================================================
// DashboardReportService.js
// ======================================================

const API_BASE_URL = "https://localhost:7203/api";

// ======================================================
// Get Authorization Token
// ======================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwtToken") ||
    ""
  );
};

// ======================================================
// Request Helper
// ======================================================

const request = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    }
  );

  // ====================================================
  // Handle Empty Response
  // ====================================================

  if (response.status === 204) {
    return null;
  }

  // ====================================================
  // Read Response
  // ====================================================

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  const data =
    contentType.includes(
      "application/json"
    )
      ? await response.json()
      : await response.text();

  // ====================================================
  // Handle API Error
  // ====================================================

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.title ||
        `Request failed with status ${response.status}`
    );

    error.status =
      response.status;

    error.data = data;

    throw error;
  }

  return data;
};

// ======================================================
// Get All Dashboard Reports
// ======================================================

export const getDashboardReports =
  async () => {
    return request(
      "/DashboardReport"
    );
  };

// ======================================================
// Get Dashboard Report By ID
// ======================================================

export const getDashboardReportById =
  async (id) => {
    if (!id) {
      throw new Error(
        "Dashboard Report ID is required."
      );
    }

    return request(
      `/DashboardReport/${id}`
    );
  };

// ======================================================
// Create Dashboard Report
// ======================================================

export const createDashboardReport =
  async (data) => {
    return request(
      "/DashboardReport",
      {
        method: "POST",
        body: JSON.stringify(
          data
        ),
      }
    );
  };

// ======================================================
// Update Dashboard Report
// ======================================================

export const updateDashboardReport =
  async (
    id,
    data
  ) => {
    if (!id) {
      throw new Error(
        "Dashboard Report ID is required."
      );
    }

    return request(
      `/DashboardReport/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(
          data
        ),
      }
    );
  };

// ======================================================
// Delete Dashboard Report
// ======================================================

export const deleteDashboardReport =
  async (id) => {
    if (!id) {
      throw new Error(
        "Dashboard Report ID is required."
      );
    }

    return request(
      `/DashboardReport/${id}`,
      {
        method: "DELETE",
      }
    );
  };

// ======================================================
// Filter Dashboard Reports
// ======================================================

export const filterDashboardReports =
  async (filters = {}) => {
    const params =
      new URLSearchParams();

    if (filters.status) {
      params.append(
        "status",
        filters.status
      );
    }

    if (filters.reportType) {
      params.append(
        "reportType",
        filters.reportType
      );
    }

    if (filters.dateFrom) {
      params.append(
        "dateFrom",
        filters.dateFrom
      );
    }

    if (filters.dateTo) {
      params.append(
        "dateTo",
        filters.dateTo
      );
    }

    const query =
      params.toString();

    return request(
      `/DashboardReport${query ? `?${query}` : ""}`
    );
  };

// ======================================================
// Export Default Service
// ======================================================

const dashboardReportService = {
  getDashboardReports,
  getDashboardReportById,
  createDashboardReport,
  updateDashboardReport,
  deleteDashboardReport,
  filterDashboardReports,
};

export default dashboardReportService;