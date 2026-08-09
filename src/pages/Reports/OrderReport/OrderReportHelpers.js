
//======================================================
// OrderReportHelpers.js
//======================================================

//======================================================
// Safe Value
//======================================================

export const safeValue = (
  value,
  fallback = ""
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return value;
};

//======================================================
// Order Number
//======================================================

export const getOrderNumber = (
  order
) => {
  if (!order) {
    return "";
  }

  return (
    order.orderNumber ??
    order.orderNo ??
    order.orderID ??
    order.orderId ??
    order.id ??
    ""
  );
};

//======================================================
// Order Date
//======================================================

export const getOrderDate = (
  order
) => {
  if (!order) {
    return "";
  }

  return (
    order.orderDate ??
    order.date ??
    order.createdDate ??
    order.createdAt ??
    ""
  );
};

//======================================================
// Customer Name
//======================================================

export const getCustomerName = (
  order
) => {
  if (!order) {
    return "";
  }

  return (
    order.customerName ??
    order.customer ??
    order.customer_name ??
    order.buyerName ??
    order.buyer ??
    order.customer?.name ??
    ""
  );
};

//======================================================
// Channel Name
//======================================================

export const getChannelName = (
  order
) => {
  if (!order) {
    return "";
  }

  return (
    order.channel ??
    order.channelName ??
    order.marketplace ??
    order.marketplaceName ??
    order.marketplaceType ??
    order.platform ??
    ""
  );
};

//======================================================
// Quantity
//======================================================

export const getQuantity = (
  order
) => {
  if (!order) {
    return 0;
  }

  return (
    Number(
      order.quantity ??
        order.totalQuantity ??
        order.itemQuantity ??
        order.qty ??
        0
    ) || 0
  );
};

//======================================================
// Sales Amount
//======================================================

export const getSalesAmount = (
  order
) => {
  if (!order) {
    return 0;
  }

  return (
    Number(
      order.salesAmount ??
        order.totalSales ??
        order.totalAmount ??
        order.orderAmount ??
        order.grandTotal ??
        order.amount ??
        0
    ) || 0
  );
};

//======================================================
// Order Status
//======================================================

export const getOrderStatus = (
  order
) => {
  if (!order) {
    return "";
  }

  return (
    order.orderStatus ??
    order.status ??
    order.order_status ??
    ""
  );
};

//======================================================
// Payment Status
//======================================================

export const getPaymentStatus = (
  order
) => {
  if (!order) {
    return "";
  }

  return (
    order.paymentStatus ??
    order.payment_status ??
    order.payment?.status ??
    ""
  );
};

//======================================================
// Fulfillment Status
//======================================================

export const getFulfillmentStatus = (
  order
) => {
  if (!order) {
    return "";
  }

  return (
    order.fulfillmentStatus ??
    order.fulfilmentStatus ??
    order.fulfillment_status ??
    order.fulfilment_status ??
    ""
  );
};

//======================================================
// Order ID
//======================================================

export const getOrderId = (
  order
) => {
  if (!order) {
    return null;
  }

  return (
    order.id ??
    order.orderId ??
    order.orderID ??
    order.order_id ??
    null
  );
};

//======================================================
// Report Key
//======================================================

export const getReportKey = (
  order,
  index = 0
) => {
  const id =
    getOrderId(order);

  const orderNumber =
    getOrderNumber(order);

  return (
    id ??
    orderNumber ??
    `order-report-${index}`
  );
};

//======================================================
// Format Currency
//======================================================

export const formatCurrency = (
  value,
  currency = "INR"
) => {
  const amount =
    Number(value) || 0;

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toFixed(
      2
    )}`;
  }
};

//======================================================
// Format Number
//======================================================

export const formatNumber = (
  value
) => {
  return (
    Number(value) || 0
  ).toLocaleString("en-IN");
};

//======================================================
// Format Date
//======================================================

export const formatDate = (
  value
) => {
  if (!value) {
    return "N/A";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

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
      month: "2-digit",
      year: "numeric",
    }
  );
};

//======================================================
// Format Date Time
//======================================================

export const formatDateTime = (
  value
) => {
  if (!value) {
    return "N/A";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

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
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

//======================================================
// Status Color
//======================================================

export const getStatusColor = (
  status
) => {
  const normalized =
    String(
      status ?? ""
    )
      .trim()
      .toLowerCase();

  switch (normalized) {
    case "completed":
    case "complete":
    case "delivered":
    case "confirmed":
    case "paid":
    case "success":
    case "successful":
      return "success";

    case "pending":
    case "processing":
    case "partially paid":
    case "packed":
      return "warning";

    case "shipped":
    case "in transit":
      return "info";

    case "cancelled":
    case "canceled":
    case "failed":
    case "rejected":
    case "refunded":
      return "error";

    default:
      return "default";
  }
};

//======================================================
// Normalize Order
//======================================================

export const normalizeOrderReport = (
  order
) => {
  if (!order) {
    return null;
  }

  return {
    ...order,

    id: getOrderId(order),

    orderNumber:
      getOrderNumber(order),

    orderDate:
      getOrderDate(order),

    customerName:
      getCustomerName(order),

    channel:
      getChannelName(order),

    quantity:
      getQuantity(order),

    salesAmount:
      getSalesAmount(order),

    orderStatus:
      getOrderStatus(order),

    paymentStatus:
      getPaymentStatus(order),

    fulfillmentStatus:
      getFulfillmentStatus(order),
  };
};

//======================================================
// Normalize Order List
//======================================================

export const normalizeOrderReports = (
  orders
) => {
  if (
    !Array.isArray(orders)
  ) {
    return [];
  }

  return orders
    .map(
      normalizeOrderReport
    )
    .filter(Boolean);
};

//======================================================
// Calculate Statistics
//======================================================

export const calculateOrderStatistics =
  (orders = []) => {
    const safeOrders =
      normalizeOrderReports(
        orders
      );

    const totalOrders =
      safeOrders.length;

    const totalQuantity =
      safeOrders.reduce(
        (total, order) =>
          total +
          getQuantity(order),
        0
      );

    const totalSales =
      safeOrders.reduce(
        (total, order) =>
          total +
          getSalesAmount(order),
        0
      );

    const completedOrders =
      safeOrders.filter(
        (order) =>
          [
            "completed",
            "complete",
            "delivered",
          ].includes(
            String(
              getOrderStatus(
                order
              )
            ).toLowerCase()
          )
      ).length;

    const pendingOrders =
      safeOrders.filter(
        (order) =>
          String(
            getOrderStatus(
              order
            )
          ).toLowerCase() ===
          "pending"
      ).length;

    const shippedOrders =
      safeOrders.filter(
        (order) =>
          String(
            getOrderStatus(
              order
            )
          ).toLowerCase() ===
          "shipped"
      ).length;

    const completionRate =
      totalOrders > 0
        ? (completedOrders /
            totalOrders) *
          100
        : 0;

    return {
      totalOrders,
      totalQuantity,
      totalSales,
      completedOrders,
      pendingOrders,
      shippedOrders,
      completionRate,
    };
  };

//======================================================
// Filter Orders
//======================================================

export const filterOrderReports = (
  orders = [],
  filters = {}
) => {
  const safeOrders =
    normalizeOrderReports(
      orders
    );

  return safeOrders.filter(
    (order) => {
      const {
        status = "",
        channel = "",
        paymentStatus = "",
        fulfillmentStatus = "",
        dateFrom = "",
        dateTo = "",
        minAmount = "",
        maxAmount = "",
      } = filters;

      const orderStatus =
        String(
          getOrderStatus(
            order
          )
        ).toLowerCase();

      const orderChannel =
        String(
          getChannelName(
            order
          )
        ).toLowerCase();

      const orderPaymentStatus =
        String(
          getPaymentStatus(
            order
          )
        ).toLowerCase();

      const orderFulfillmentStatus =
        String(
          getFulfillmentStatus(
            order
          )
        ).toLowerCase();

      if (
        status &&
        orderStatus !==
          String(
            status
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        channel &&
        orderChannel !==
          String(
            channel
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        paymentStatus &&
        orderPaymentStatus !==
          String(
            paymentStatus
          ).toLowerCase()
      ) {
        return false;
      }

      if (
        fulfillmentStatus &&
        orderFulfillmentStatus !==
          String(
            fulfillmentStatus
          ).toLowerCase()
      ) {
        return false;
      }

      const orderDate =
        getOrderDate(order);

      if (
        dateFrom &&
        new Date(orderDate) <
          new Date(dateFrom)
      ) {
        return false;
      }

      if (
        dateTo &&
        new Date(orderDate) >
          new Date(
            `${dateTo}T23:59:59`
          )
      ) {
        return false;
      }

      const amount =
        getSalesAmount(order);

      if (
        minAmount !== "" &&
        amount <
          Number(minAmount)
      ) {
        return false;
      }

      if (
        maxAmount !== "" &&
        amount >
          Number(maxAmount)
      ) {
        return false;
      }

      return true;
    }
  );
};

//======================================================
// Search Orders
//======================================================

export const searchOrderReports = (
  orders = [],
  searchTerm = ""
) => {
  const normalizedSearch =
    String(
      searchTerm ?? ""
    )
      .trim()
      .toLowerCase();

  if (!normalizedSearch) {
    return normalizeOrderReports(
      orders
    );
  }

  return normalizeOrderReports(
    orders
  ).filter((order) => {
    const searchableValues = [
      getOrderNumber(order),
      getCustomerName(order),
      getChannelName(order),
      getOrderStatus(order),
      getPaymentStatus(order),
      getFulfillmentStatus(
        order
      ),
    ];

    return searchableValues.some(
      (value) =>
        String(
          value ?? ""
        )
          .toLowerCase()
          .includes(
            normalizedSearch
          )
    );
  });
};

//======================================================
// Sort Orders
//======================================================

export const sortOrderReports = (
  orders = [],
  field = "orderDate",
  direction = "desc"
) => {
  const sorted = [
    ...normalizeOrderReports(
      orders
    ),
  ];

  sorted.sort((a, b) => {
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
        valueA = new Date(
          getOrderDate(a)
        ).getTime();
        valueB = new Date(
          getOrderDate(b)
        ).getTime();
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

    if (
      typeof valueA ===
        "string" &&
      typeof valueB ===
        "string"
    ) {
      const comparison =
        valueA.localeCompare(
          valueB
        );

      return direction ===
        "asc"
        ? comparison
        : -comparison;
    }

    const numericA =
      Number(valueA) || 0;

    const numericB =
      Number(valueB) || 0;

    return direction ===
      "asc"
      ? numericA - numericB
      : numericB - numericA;
  });

  return sorted;
};

//======================================================
// Paginate Orders
//======================================================

export const paginateOrderReports =
  (
    orders = [],
    page = 1,
    pageSize = 10
  ) => {
    const safeOrders =
      normalizeOrderReports(
        orders
      );

    const safePage = Math.max(
      1,
      Number(page) || 1
    );

    const safePageSize =
      Math.max(
        1,
        Number(pageSize) || 10
      );

    const totalRecords =
      safeOrders.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          totalRecords /
            safePageSize
        )
      );

    const startIndex =
      (safePage - 1) *
      safePageSize;

    const endIndex =
      startIndex +
      safePageSize;

    return {
      data: safeOrders.slice(
        startIndex,
        endIndex
      ),
      page: safePage,
      pageSize:
        safePageSize,
      totalRecords,
      totalPages,
    };
  };

//======================================================
// Build Query Parameters
//======================================================

export const buildOrderReportQuery =
  (params = {}) => {
    const query =
      new URLSearchParams();

    Object.entries(
      params
    ).forEach(
      ([key, value]) => {
        if (
          value !==
            undefined &&
          value !== null &&
          value !== ""
        ) {
          query.append(
            key,
            value
          );
        }
      }
    );

    return query.toString();
  };

//======================================================
// Default Export
//======================================================

export default {
  safeValue,
  getOrderNumber,
  getOrderDate,
  getCustomerName,
  getChannelName,
  getQuantity,
  getSalesAmount,
  getOrderStatus,
  getPaymentStatus,
  getFulfillmentStatus,
  getOrderId,
  getReportKey,
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  getStatusColor,
  normalizeOrderReport,
  normalizeOrderReports,
  calculateOrderStatistics,
  filterOrderReports,
  searchOrderReports,
  sortOrderReports,
  paginateOrderReports,
  buildOrderReportQuery,
};

