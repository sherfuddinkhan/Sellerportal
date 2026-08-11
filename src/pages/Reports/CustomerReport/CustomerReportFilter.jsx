
export const DEFAULT_CUSTOMER_REPORT_FILTERS = {
  search: "",
  status: "All",
  marketplace: "All",
  customerType: "All",
  dateFrom: "",
  dateTo: "",
};

//------------------------------------------------------
// Status Options
//------------------------------------------------------

export const CUSTOMER_STATUS_OPTIONS = [
  {
    value: "All",
    label: "All Status",
  },
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
  {
    value: "Blocked",
    label: "Blocked",
  },
];

//------------------------------------------------------
// Marketplace Options
//------------------------------------------------------

export const CUSTOMER_MARKETPLACE_OPTIONS = [
  {
    value: "All",
    label: "All Marketplaces",
  },
  {
    value: "Amazon",
    label: "Amazon",
  },
  {
    value: "Flipkart",
    label: "Flipkart",
  },
  {
    value: "Meesho",
    label: "Meesho",
  },
  {
    value: "Shopify",
    label: "Shopify",
  },
  {
    value: "WooCommerce",
    label: "WooCommerce",
  },
  {
    value: "Walmart",
    label: "Walmart",
  },
  {
    value: "eBay",
    label: "eBay",
  },
];

//------------------------------------------------------
// Customer Type Options
//------------------------------------------------------

export const CUSTOMER_TYPE_OPTIONS = [
  {
    value: "All",
    label: "All Customer Types",
  },
  {
    value: "Individual",
    label: "Individual",
  },
  {
    value: "Business",
    label: "Business",
  },
  {
    value: "Wholesale",
    label: "Wholesale",
  },
  {
    value: "Retail",
    label: "Retail",
  },
];

//======================================================
// Filter Utility Functions
//======================================================

//------------------------------------------------------
// Normalize Value
//------------------------------------------------------

const normalizeValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();
};

//------------------------------------------------------
// Search Customer
//------------------------------------------------------

export const matchesCustomerSearch = (
  customer,
  searchText
) => {

  const search =
    normalizeValue(searchText);

  if (!search) {
    return true;
  }

  const searchableValues = [
    customer?.customerId,
    customer?.id,

    customer?.customerName,
    customer?.name,

    customer?.email,
    customer?.customerEmail,

    customer?.phone,
    customer?.mobile,
    customer?.mobileNumber,

    customer?.gstin,
    customer?.pan,

    customer?.marketplace,
    customer?.customerType,
  ];

  return searchableValues.some(
    (value) =>
      normalizeValue(value)
        .includes(search)
  );
};

//------------------------------------------------------
// Status Filter
//------------------------------------------------------

export const matchesCustomerStatus = (
  customer,
  status
) => {

  if (
    !status ||
    status === "All"
  ) {
    return true;
  }

  return (
    normalizeValue(
      customer?.status
    ) === normalizeValue(status)
  );
};

//------------------------------------------------------
// Marketplace Filter
//------------------------------------------------------

export const matchesCustomerMarketplace = (
  customer,
  marketplace
) => {

  if (
    !marketplace ||
    marketplace === "All"
  ) {
    return true;
  }

  return (
    normalizeValue(
      customer?.marketplace
    ) === normalizeValue(
      marketplace
    )
  );
};

//------------------------------------------------------
// Customer Type Filter
//------------------------------------------------------

export const matchesCustomerType = (
  customer,
  customerType
) => {

  if (
    !customerType ||
    customerType === "All"
  ) {
    return true;
  }
  return (normalizeValue(customer?.customerType) === normalizeValue(customerType));
};

//------------------------------------------------------
// Date Helper
//------------------------------------------------------

const getCustomerDate = (customer) => {
  return (
    customer?.createdDate ??
    customer?.createdAt ??
    customer?.lastOrderDate ??
    customer?.lastOrder ??
    null
  );
};

//------------------------------------------------------
// From Date Filter
//------------------------------------------------------

export const matchesDateFrom = (customer,dateFrom) => {
  if (!dateFrom) {
    return true;
  }
  const customerDate = getCustomerDate(customer);
  if (!customerDate) {
    return false;
  }
  const customerTime =new Date(customerDate).getTime();
  const fromTime =new Date(`${dateFrom}T00:00:00`).getTime();
  if (
    Number.isNaN(customerTime) ||
    Number.isNaN(fromTime)
  ) {
    return true;
  }
  return customerTime >= fromTime;
};

//------------------------------------------------------
// To Date Filter
//------------------------------------------------------

export const matchesDateTo = (
  customer,
  dateTo
) => {
  if (!dateTo) {
    return true;
  }
  const customerDate = getCustomerDate(customer);
  if (!customerDate) {
    return false;
  }
  const customerTime = new Date(customerDate).getTime();
  const toTime = new Date(`${dateTo}T23:59:59`).getTime();
  if (
    Number.isNaN(customerTime) ||
    Number.isNaN(toTime)
  ) {
    return true;
  }
  return customerTime <= toTime;
};

//======================================================
// Main Filter Function
//======================================================

export const filterCustomers = (
  customers = [],
  filters = {}
) => {
  if (!Array.isArray(customers)) {
    return [];
  }
  const {search = "",status = "All",marketplace = "All",customerType = "All",dateFrom = "",dateTo = "",} = filters;
  return customers.filter(
    (customer) => {
      return (
        matchesCustomerSearch(customer,search) &&
        matchesCustomerStatus(customer,status) &&
        matchesCustomerMarketplace(customer,marketplace) &&
        matchesCustomerType(customer,customerType) &&
        matchesDateFrom(customer,dateFrom) &&
        matchesDateTo(customer,dateTo)
      );
    }
  );
};

//======================================================
// Check Active Filters
//======================================================

export const hasCustomerReportFilters = (
  filters = {}
) => {

  return (
    Boolean(filters.search) ||
    Boolean( filters.status && filters.status !== "All") ||
    Boolean( filters.marketplace && filters.marketplace !== "All") ||
    Boolean( filters.customerType &&filters.customerType !== "All") ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo)
  );
};

//======================================================
// Reset Filters
//======================================================

export const resetCustomerReportFilters = () => ({
  ...DEFAULT_CUSTOMER_REPORT_FILTERS,
});

//======================================================
// Active Filter Count
//======================================================

export const getCustomerReportFilterCount = (
  filters = {}
) => {
  let count = 0;
  if (filters.search) {
    count += 1;
  }
  if (
    filters.status &&
    filters.status !== "All"
  ) {
    count += 1;
  }
  if (
    filters.marketplace &&
    filters.marketplace !== "All"
  ) {
    count += 1;
  }
  if (
    filters.customerType &&
    filters.customerType !== "All"
  ) {
    count += 1;
  }
  if (filters.dateFrom) {
    count += 1;
  }
  if (filters.dateTo) {
    count += 1;
  }
  return count;
};