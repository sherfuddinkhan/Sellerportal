// ======================================================
// OrderReportHelpers.jsx
// ======================================================

// ======================================================
// Safe Value
// ======================================================

export const safeValue = (value, fallback = "") => {
  if (
    value === undefined ||
    value === null
  ) {
    return fallback;
  }

  return value;
};

// ======================================================
// Safe Number
// ======================================================

export const safeNumber = (
  value,
  fallback = 0
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

// ======================================================
// Order Number
// ======================================================

export const getOrderNumber = (order) => {
  if (!order) {
    return "";
  }

  return (
    order.orderNumber ??
    order.OrderNumber ??
    order.orderNo ??
    order.OrderNo ??
    order.orderID ??
    order.orderId ??
    order.id ??
    ""
  );
};

// ======================================================
// Order Date
// ======================================================

export const getOrderDate = (order) => {
  if (!order) {
    return "";
  }

  const value =
    order.orderDate ??
    order.OrderDate ??
    order.date ??
    order.Date ??
    order.createdDate ??
    order.CreatedDate ??
    "";

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().split("T")[0];
};

// ======================================================
// Customer Name
// ======================================================

export const getCustomerName = (order) => {
  if (!order) {
    return "";
  }

  return (
    order.customerName ??
    order.CustomerName ??
    order.customer?.name ??
    order.customer?.customerName ??
    order.Customer?.Name ??
    order.customer ??
    ""
  );
};

// ======================================================
// Channel Name
// ======================================================

export const getChannelName = (order) => {
  if (!order) {
    return "";
  }

  return (
    order.channel ??
    order.Channel ??
    order.channelName ??
    order.ChannelName ??
    order.marketplace ??
    order.Marketplace ??
    order.salesChannel ??
    order.SalesChannel ??
    ""
  );
};

// ======================================================
// Order Status
// ======================================================

export const getOrderStatus = (order) => {
  if (!order) {
    return "";
  }

  return (
    order.orderStatus ??
    order.OrderStatus ??
    order.status ??
    order.Status ??
    ""
  );
};

// ======================================================
// Payment Status
// ======================================================

export const getPaymentStatus = (order) => {
  if (!order) {
    return "";
  }

  return (
    order.paymentStatus ??
    order.PaymentStatus ??
    order.payment?.status ??
    order.Payment?.Status ??
    ""
  );
};

// ======================================================
// Fulfillment Status
// ======================================================

export const getFulfillmentStatus = (order) => {
  if (!order) {
    return "";
  }

  return (
    order.fulfillmentStatus ??
    order.FulfillmentStatus ??
    order.fulfilmentStatus ??
    order.FulfilmentStatus ??
    ""
  );
};

// ======================================================
// Quantity
// ======================================================

export const getQuantity = (order) => {
  if (!order) {
    return 0;
  }

  return safeNumber(
    order.quantity ??
      order.Quantity ??
      order.totalQuantity ??
      order.TotalQuantity ??
      order.itemsQuantity ??
      order.ItemsQuantity ??
      0
  );
};

// ======================================================
// Sales Amount
// ======================================================

export const getSalesAmount = (order) => {
  if (!order) {
    return 0;
  }

  return safeNumber(
    order.salesAmount ??
      order.SalesAmount ??
      order.totalAmount ??
      order.TotalAmount ??
      order.amount ??
      order.Amount ??
      order.netAmount ??
      order.NetAmount ??
      0
  );
};

// ======================================================
// Currency Formatter
// ======================================================

export const formatCurrency = (
  value,
  currency = "INR"
) => {
  const amount = safeNumber(value);

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
};

// ======================================================
// Number Formatter
// ======================================================

export const formatNumber = (
  value,
  decimals = 0
) => {
  const number = safeNumber(value);

  return new Intl.NumberFormat(
    "en-IN",
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }
  ).format(number);
};

// ======================================================
// Date Formatter
// ======================================================

export const formatDate = (
  value,
  options = {}
) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const defaultOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      ...defaultOptions,
      ...options,
    }
  ).format(date);
};

// ======================================================
// Status Normalizer
// ======================================================

export const normalizeStatus = (
  status
) => {
  if (
    status === undefined ||
    status === null
  ) {
    return "";
  }

  return String(status)
    .trim()
    .toLowerCase();
};

// ======================================================
// Status Color
// ======================================================

export const getStatusColor = (
  status
) => {
  const normalized =
    normalizeStatus(status);

  switch (normalized) {
    case "completed":
    case "complete":
    case "delivered":
    case "paid":
    case "success":
    case "successful":
    case "active":
    case "confirmed":
      return "success";

    case "pending":
    case "processing":
    case "packed":
    case "partially paid":
      return "warning";

    case "cancelled":
    case "canceled":
    case "failed":
    case "error":
    case "inactive":
    case "rejected":
      return "error";

    case "shipped":
    case "in transit":
      return "info";

    case "refunded":
    case "returned":
      return "secondary";

    default:
      return "default";
  }
};

// ======================================================
// Status Label
// ======================================================

export const getStatusLabel = (
  status
) => {
  if (
    status === undefined ||
    status === null ||
    status === ""
  ) {
    return "Unknown";
  }

  const value = String(status).trim();

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
};

// ======================================================
// Status Background
// ======================================================

export const getStatusBackground = (
  status
) => {
  const color =
    getStatusColor(status);

  const backgrounds = {
    success: "success.light",
    warning: "warning.light",
    error: "error.light",
    info: "info.light",
    secondary: "secondary.light",
    default: "grey.200",
  };

  return (
    backgrounds[color] ||
    backgrounds.default
  );
};

// ======================================================
// Status Text Color
// ======================================================

export const getStatusTextColor = (
  status
) => {
  const color =
    getStatusColor(status);

  const colors = {
    success: "success.dark",
    warning: "warning.dark",
    error: "error.dark",
    info: "info.dark",
    secondary: "secondary.dark",
    default: "text.primary",
  };

  return (
    colors[color] ||
    colors.default
  );
};

// ======================================================
// Order ID
// ======================================================

export const getOrderId = (order) => {
  if (!order) {
    return null;
  }

  return (
    order.id ??
    order.orderId ??
    order.orderID ??
    order.OrderId ??
    order.OrderID ??
    null
  );
};

// ======================================================
// Customer ID
// ======================================================

export const getCustomerId = (
  order
) => {
  if (!order) {
    return null;
  }

  return (
    order.customerId ??
    order.CustomerId ??
    order.customerID ??
    order.CustomerID ??
    null
  );
};

// ======================================================
// Seller ID
// ======================================================

export const getSellerId = (
  order
) => {
  if (!order) {
    return null;
  }

  return (
    order.sellerId ??
    order.SellerId ??
    order.sellerID ??
    order.SellerID ??
    null
  );
};

// ======================================================
// Product ID
// ======================================================

export const getProductId = (
  order
) => {
  if (!order) {
    return null;
  }

  return (
    order.productId ??
    order.ProductId ??
    order.productID ??
    order.ProductID ??
    null
  );
};

// ======================================================
// Search Text
// ======================================================

export const getOrderSearchText = (
  order
) => {
  if (!order) {
    return "";
  }

  return [
    getOrderNumber(order),
    getCustomerName(order),
    getChannelName(order),
    getOrderStatus(order),
    getPaymentStatus(order),
    getFulfillmentStatus(order),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

// ======================================================
// Search Orders
// ======================================================

export const searchOrders = (
  orders = [],
  search = ""
) => {
  if (!Array.isArray(orders)) {
    return [];
  }

  const query =
    String(search)
      .trim()
      .toLowerCase();

  if (!query) {
    return orders;
  }

  return orders.filter(
    (order) =>
      getOrderSearchText(
        order
      ).includes(query)
  );
};

// ======================================================
// Filter Orders
// ======================================================

export const filterOrders = (
  orders = [],
  filters = {}
) => {
  if (!Array.isArray(orders)) {
    return [];
  }

  return orders.filter(
    (order) => {
      // ----------------------------------------------
      // Status
      // ----------------------------------------------

      if (
        filters.orderStatus &&
        normalizeStatus(
          getOrderStatus(order)
        ) !==
          normalizeStatus(
            filters.orderStatus
          )
      ) {
        return false;
      }

      // ----------------------------------------------
      // Payment Status
      // ----------------------------------------------

      if (
        filters.paymentStatus &&
        normalizeStatus(
          getPaymentStatus(order)
        ) !==
          normalizeStatus(
            filters.paymentStatus
          )
      ) {
        return false;
      }

      // ----------------------------------------------
      // Fulfillment Status
      // ----------------------------------------------

      if (
        filters.fulfillmentStatus &&
        normalizeStatus(
          getFulfillmentStatus(
            order
          )
        ) !==
          normalizeStatus(
            filters.fulfillmentStatus
          )
      ) {
        return false;
      }

      // ----------------------------------------------
      // Channel
      // ----------------------------------------------

      if (
        filters.channel &&
        normalizeStatus(
          getChannelName(order)
        ) !==
          normalizeStatus(
            filters.channel
          )
      ) {
        return false;
      }

      // ----------------------------------------------
      // Customer
      // ----------------------------------------------

      if (
        filters.customerName &&
        !getCustomerName(order)
          .toString()
          .toLowerCase()
          .includes(
            String(
              filters.customerName
            ).toLowerCase()
          )
      ) {
        return false;
      }

      // ----------------------------------------------
      // Minimum Amount
      // ----------------------------------------------

      if (
        filters.minAmount !==
          undefined &&
        filters.minAmount !==
          ""
      ) {
        if (
          getSalesAmount(order) <
          Number(
            filters.minAmount
          )
        ) {
          return false;
        }
      }

      // ----------------------------------------------
      // Maximum Amount
      // ----------------------------------------------

      if (
        filters.maxAmount !==
          undefined &&
        filters.maxAmount !==
          ""
      ) {
        if (
          getSalesAmount(order) >
          Number(
            filters.maxAmount
          )
        ) {
          return false;
        }
      }

      return true;
    }
  );
};

// ======================================================
// Build Query Object
// ======================================================

export const buildOrderReportQueryObject =
  (params = {}) => {
    const query = {};

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          query[key] = value;
        }
      }
    );

    return query;
  };

// ======================================================
// Build Query String
// ======================================================

export const buildOrderReportQuery =
  (params = {}) => {
    const queryObject =
      buildOrderReportQueryObject(
        params
      );

    const searchParams =
      new URLSearchParams();

    Object.entries(
      queryObject
    ).forEach(
      ([key, value]) => {
        if (
          Array.isArray(value)
        ) {
          value.forEach(
            (item) => {
              searchParams.append(
                key,
                item
              );
            }
          );
        } else if (
          typeof value ===
          "object"
        ) {
          searchParams.append(
            key,
            JSON.stringify(value)
          );
        } else {
          searchParams.append(
            key,
            String(value)
          );
        }
      }
    );

    return searchParams.toString();
  };

// ======================================================
// Calculate Statistics
// ======================================================

export const calculateOrderStatistics =
  (orders = []) => {
    if (!Array.isArray(orders)) {
      return {
        totalOrders: 0,
        totalQuantity: 0,
        totalSales: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        paidOrders: 0,
        failedPayments: 0,
      };
    }

    let totalQuantity = 0;
    let totalSales = 0;

    let pendingOrders = 0;
    let processingOrders = 0;
    let confirmedOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    let paidOrders = 0;
    let failedPayments = 0;

    orders.forEach((order) => {
      totalQuantity +=
        getQuantity(order);

      totalSales +=
        getSalesAmount(order);

      const status =
        normalizeStatus(
          getOrderStatus(order)
        );

      switch (status) {
        case "pending":
          pendingOrders++;
          break;

        case "processing":
          processingOrders++;
          break;

        case "confirmed":
          confirmedOrders++;
          break;

        case "shipped":
          shippedOrders++;
          break;

        case "delivered":
          deliveredOrders++;
          break;

        case "cancelled":
        case "canceled":
          cancelledOrders++;
          break;

        default:
          break;
      }

      const paymentStatus =
        normalizeStatus(
          getPaymentStatus(order)
        );

      if (
        paymentStatus === "paid"
      ) {
        paidOrders++;
      }

      if (
        paymentStatus === "failed"
      ) {
        failedPayments++;
      }
    });

    return {
      totalOrders:
        orders.length,

      totalQuantity,

      totalSales,

      averageOrderValue:
        orders.length > 0
          ? totalSales /
            orders.length
          : 0,

      pendingOrders,

      processingOrders,

      confirmedOrders,

      shippedOrders,

      deliveredOrders,

      cancelledOrders,

      paidOrders,

      failedPayments,
    };
  };

// ======================================================
// Sort Orders
// ======================================================

export const sortOrders = (
  orders = [],
  field = "orderDate",
  direction = "desc"
) => {
  if (!Array.isArray(orders)) {
    return [];
  }

  const sorted = [...orders];

  sorted.sort(
    (a, b) => {
      let valueA;
      let valueB;

      switch (field) {
        case "orderNumber":
          valueA =
            getOrderNumber(a);
          valueB =
            getOrderNumber(b);
          break;

        case "orderDate":
          valueA =
            new Date(
              getOrderDate(a)
            ).getTime() || 0;

          valueB =
            new Date(
              getOrderDate(b)
            ).getTime() || 0;
          break;

        case "customerName":
          valueA =
            getCustomerName(a)
              .toString()
              .toLowerCase();

          valueB =
            getCustomerName(b)
              .toString()
              .toLowerCase();
          break;

        case "quantity":
          valueA =
            getQuantity(a);
          valueB =
            getQuantity(b);
          break;

        case "salesAmount":
          valueA =
            getSalesAmount(a);
          valueB =
            getSalesAmount(b);
          break;

        default:
          valueA =
            a?.[field] ?? "";
          valueB =
            b?.[field] ?? "";
      }

      if (valueA < valueB) {
        return direction === "asc"
          ? -1
          : 1;
      }

      if (valueA > valueB) {
        return direction === "asc"
          ? 1
          : -1;
      }

      return 0;
    }
  );

  return sorted;
};

// ======================================================
// Pagination
// ======================================================

export const paginateOrders = (
  orders = [],
  page = 1,
  pageSize = 10
) => {
  if (!Array.isArray(orders)) {
    return {
      items: [],
      page: 1,
      pageSize,
      total: 0,
      totalPages: 1,
    };
  }

  const safePage =
    Math.max(
      1,
      Number(page) || 1
    );

  const safePageSize =
    Math.max(
      1,
      Number(pageSize) || 10
    );

  const total =
    orders.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total /
          safePageSize
      )
    );

  const start =
    (safePage - 1) *
    safePageSize;

  return {
    items: orders.slice(
      start,
      start + safePageSize
    ),

    page: safePage,

    pageSize: safePageSize,

    total,

    totalPages,
  };
};

// ======================================================
// Search Order Reports
// ======================================================

export const searchOrderReports = (
  orders = [],
  search = ""
) => {
  return searchOrders(
    orders,
    search
  );
};

// ======================================================
// Filter Order Reports
// ======================================================

export const filterOrderReports = (
  orders = [],
  filters = {}
) => {
  return filterOrders(
    orders,
    filters
  );
};
// ======================================================
// Default Export
// ======================================================

const OrderReportHelpers = {
  safeValue,
  safeNumber,

  getOrderNumber,
  getOrderDate,
  getCustomerName,
  getChannelName,
  getOrderStatus,
  getPaymentStatus,
  getFulfillmentStatus,
  getQuantity,
  getSalesAmount,

  formatCurrency,
  formatNumber,
  formatDate,

  normalizeStatus,
  getStatusColor,
  getStatusLabel,
  getStatusBackground,
  getStatusTextColor,

  getOrderId,
  getCustomerId,
  getSellerId,
  getProductId,

  getOrderSearchText,

  searchOrders,
  searchOrderReports,

  filterOrders,
  filterOrderReports,

  buildOrderReportQueryObject,
  buildOrderReportQuery,

  calculateOrderStatistics,

  sortOrders,
  paginateOrders,
};

export default OrderReportHelpers;

