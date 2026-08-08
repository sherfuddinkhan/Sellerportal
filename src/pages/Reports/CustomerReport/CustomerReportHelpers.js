//======================================================
// Customer Report Helper
//======================================================

//======================================================
// Safe Number
//======================================================

export const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

//======================================================
// Safe String
//======================================================

export const toString = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
};

//======================================================
// Customer Name
//======================================================

export const getCustomerName = (
  customer
) => {

  return (
    customer?.customerName ||
    customer?.name ||
    customer?.customer_name ||
    "Unknown Customer"
  );
};

//======================================================
// Customer ID
//======================================================

export const getCustomerId = (
  customer
) => {

  return (
    customer?.customerId ??
    customer?.id ??
    customer?.customer_id ??
    ""
  );
};

//======================================================
// Email
//======================================================

export const getCustomerEmail = (
  customer
) => {

  return (
    customer?.email ||
    customer?.customerEmail ||
    customer?.customer_email ||
    ""
  );
};

//======================================================
// Phone
//======================================================

export const getCustomerPhone = (
  customer
) => {

  return (
    customer?.phone ||
    customer?.mobile ||
    customer?.mobileNumber ||
    customer?.phoneNumber ||
    ""
  );
};

//======================================================
// Marketplace
//======================================================

export const getCustomerMarketplace = (
  customer
) => {

  return (
    customer?.marketplace ||
    customer?.marketplaceName ||
    customer?.marketplaceType ||
    ""
  );
};

//======================================================
// Customer Type
//======================================================

export const getCustomerType = (
  customer
) => {

  return (
    customer?.customerType ||
    customer?.type ||
    "Individual"
  );
};

//======================================================
// Customer Status
//======================================================

export const getCustomerStatus = (
  customer
) => {

  return (
    customer?.status ||
    customer?.customerStatus ||
    "Active"
  );
};

//======================================================
// Total Orders
//======================================================

export const getTotalOrders = (
  customer
) => {

  return toNumber(
    customer?.totalOrders ??
    customer?.orderCount ??
    customer?.ordersCount ??
    0
  );
};

//======================================================
// Total Sales
//======================================================

export const getTotalSales = (
  customer
) => {

  return toNumber(
    customer?.totalSales ??
    customer?.totalAmount ??
    customer?.salesAmount ??
    customer?.totalRevenue ??
    0
  );
};

//======================================================
// Total Paid
//======================================================

export const getTotalPaid = (
  customer
) => {

  return toNumber(
    customer?.totalPaid ??
    customer?.paidAmount ??
    customer?.amountPaid ??
    0
  );
};

//======================================================
// Outstanding Amount
//======================================================

export const getOutstandingAmount = (
  customer
) => {

  return toNumber(
    customer?.totalOutstanding ??
    customer?.outstandingAmount ??
    customer?.balance ??
    customer?.pendingAmount ??
    0
  );
};

//======================================================
// Date Value
//======================================================

export const getCustomerDate = (
  customer
) => {

  return (
    customer?.createdDate ??
    customer?.createdAt ??
    customer?.created_date ??
    customer?.created_at ??
    null
  );
};

//======================================================
// Last Order Date
//======================================================

export const getLastOrderDate = (
  customer
) => {

  return (
    customer?.lastOrderDate ??
    customer?.lastOrder ??
    customer?.last_order_date ??
    null
  );
};

//======================================================
// Currency Formatter
//======================================================

export const formatCurrency = (
  value,
  currency = "INR"
) => {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(toNumber(value));
};

//======================================================
// Number Formatter
//======================================================

export const formatNumber = (
  value
) => {

  return new Intl.NumberFormat(
    "en-IN"
  ).format(toNumber(value));
};

//======================================================
// Percentage Formatter
//======================================================

export const formatPercentage = (
  value,
  decimals = 2
) => {

  return `${toNumber(value).toFixed(
    decimals
  )}%`;
};

//======================================================
// Date Formatter
//======================================================

export const formatDate = (
  value
) => {

  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

//======================================================
// Date-Time Formatter
//======================================================

export const formatDateTime = (
  value
) => {

  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

//======================================================
// Normalize Customer
//======================================================

export const normalizeCustomer = (
  customer = {}
) => {

  const totalOrders =
    getTotalOrders(customer);

  const totalSales =
    getTotalSales(customer);

  const totalPaid =
    getTotalPaid(customer);

  const outstanding =
    getOutstandingAmount(customer);

  return {
    ...customer,

    customerId:
      getCustomerId(customer),

    customerName:
      getCustomerName(customer),

    email:
      getCustomerEmail(customer),

    phone:
      getCustomerPhone(customer),

    marketplace:
      getCustomerMarketplace(customer),

    customerType:
      getCustomerType(customer),

    status:
      getCustomerStatus(customer),

    totalOrders,

    totalSales,

    totalPaid,

    totalOutstanding:
      outstanding,

    lastOrderDate:
      getLastOrderDate(customer),

    createdDate:
      getCustomerDate(customer),
  };
};

//======================================================
// Normalize Customer List
//======================================================

export const normalizeCustomers = (
  customers = []
) => {

  if (!Array.isArray(customers)) {
    return [];
  }

  return customers.map(
    normalizeCustomer
  );
};

//======================================================
// Customer Status Color
//======================================================

export const getStatusColor = (
  status
) => {

  switch (
    String(status || "")
      .toLowerCase()
  ) {

    case "active":
      return "success";

    case "inactive":
      return "warning";

    case "blocked":
      return "error";

    default:
      return "default";
  }
};

//======================================================
// Customer Status Label
//======================================================

export const getStatusLabel = (
  status
) => {

  if (!status) {
    return "Active";
  }

  return (
    String(status)
      .charAt(0)
      .toUpperCase() +
    String(status)
      .slice(1)
  );
};

//======================================================
// Sort Customers
//======================================================

export const sortCustomers = (
  customers = [],
  field = "customerName",
  direction = "asc"
) => {

  if (!Array.isArray(customers)) {
    return [];
  }

  const multiplier =
    direction === "desc"
      ? -1
      : 1;

  return [...customers].sort(
    (a, b) => {

      let valueA;
      let valueB;

      switch (field) {

        case "customerName":
          valueA =
            getCustomerName(a)
              .toLowerCase();

          valueB =
            getCustomerName(b)
              .toLowerCase();

          break;

        case "totalOrders":
          valueA =
            getTotalOrders(a);

          valueB =
            getTotalOrders(b);

          break;

        case "totalSales":
          valueA =
            getTotalSales(a);

          valueB =
            getTotalSales(b);

          break;

        case "totalPaid":
          valueA =
            getTotalPaid(a);

          valueB =
            getTotalPaid(b);

          break;

        case "outstanding":
          valueA =
            getOutstandingAmount(a);

          valueB =
            getOutstandingAmount(b);

          break;

        case "createdDate":
          valueA =
            new Date(
              getCustomerDate(a) || 0
            ).getTime();

          valueB =
            new Date(
              getCustomerDate(b) || 0
            ).getTime();

          break;

        default:
          valueA =
            toString(a?.[field])
              .toLowerCase();

          valueB =
            toString(b?.[field])
              .toLowerCase();
      }

      if (valueA < valueB) {
        return -1 * multiplier;
      }

      if (valueA > valueB) {
        return 1 * multiplier;
      }

      return 0;
    }
  );
};

//======================================================
// Calculate Customer Statistics
//======================================================

export const calculateCustomerStatistics = (
  customers = []
) => {

  const data =
    normalizeCustomers(customers);

  const totalCustomers =
    data.length;

  const activeCustomers =
    data.filter(
      (customer) =>
        String(customer.status)
          .toLowerCase() === "active"
    ).length;

  const inactiveCustomers =
    data.filter(
      (customer) =>
        String(customer.status)
          .toLowerCase() === "inactive"
    ).length;

  const blockedCustomers =
    data.filter(
      (customer) =>
        String(customer.status)
          .toLowerCase() === "blocked"
    ).length;

  const totalOrders =
    data.reduce(
      (sum, customer) =>
        sum + customer.totalOrders,
      0
    );

  const totalSales =
    data.reduce(
      (sum, customer) =>
        sum + customer.totalSales,
      0
    );

  const totalPaid =
    data.reduce(
      (sum, customer) =>
        sum + customer.totalPaid,
      0
    );

  const totalOutstanding =
    data.reduce(
      (sum, customer) =>
        sum +
        customer.totalOutstanding,
      0
    );

  const averageOrderValue =
    totalOrders > 0
      ? totalSales / totalOrders
      : 0;

  const averageCustomerValue =
    totalCustomers > 0
      ? totalSales / totalCustomers
      : 0;

  return {
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    blockedCustomers,
    totalOrders,
    totalSales,
    totalPaid,
    totalOutstanding,
    averageOrderValue,
    averageCustomerValue,
  };
};

//======================================================
// Convert Customer To Export Row
//======================================================

export const customerToExportRow = (
  customer
) => {

  const normalized =
    normalizeCustomer(customer);

  return {
    "Customer ID":
      normalized.customerId,

    "Customer Name":
      normalized.customerName,

    Email:
      normalized.email,

    Phone:
      normalized.phone,

    Type:
      normalized.customerType,

    Marketplace:
      normalized.marketplace,

    Status:
      normalized.status,

    "Total Orders":
      normalized.totalOrders,

    "Total Sales":
      normalized.totalSales,

    "Total Paid":
      normalized.totalPaid,

    Outstanding:
      normalized.totalOutstanding,

    "Last Order Date":
      formatDate(
        normalized.lastOrderDate
      ),

    "Created Date":
      formatDate(
        normalized.createdDate
      ),
  };
};

//======================================================
// Convert Customers To Export Rows
//======================================================

export const customersToExportRows = (
  customers = []
) => {

  if (!Array.isArray(customers)) {
    return [];
  }

  return customers.map(
    customerToExportRow
  );
};