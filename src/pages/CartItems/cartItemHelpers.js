//======================================================
// cartItemHelpers.js
//======================================================

export const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

//======================================================
// Currency
//======================================================

export const formatCurrency = (
  value
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(toNumber(value));
};

//======================================================
// Cart Item Total
//======================================================

export const getCartItemTotal = (
  item = {}
) => {
  if (
    item.totalAmount !==
    undefined &&
    item.totalAmount !== null
  ) {
    return toNumber(
      item.totalAmount
    );
  }

  return (
    toNumber(item.quantity) *
    toNumber(item.unitPrice)
  );
};

//======================================================
// Search
//======================================================

export const filterCartItems = (
  items = [],
  search = ""
) => {
  const keyword =
    String(search)
      .trim()
      .toLowerCase();

  if (!keyword) {
    return items;
  }

  return items.filter(
    (item) => {
      const values = [
        item.cartItemId,
        item.id,
        item.cartId,
        item.productId,
        item.productName,
        item.name,
        item.sku,
        item.customerName,
        item.userName,
        item.status,
      ];

      return values.some(
        (value) =>
          String(
            value ?? ""
          )
            .toLowerCase()
            .includes(keyword)
      );
    }
  );
};

//======================================================
// Statistics
//======================================================

export const calculateCartItemStatistics = (
  items = []
) => {
  const totalItems =
    items.length;

  const totalQuantity =
    items.reduce(
      (total, item) =>
        total +
        toNumber(
          item.quantity
        ),
      0
    );

  const totalValue =
    items.reduce(
      (total, item) =>
        total +
        getCartItemTotal(item),
      0
    );

  const uniqueProducts =
    new Set(
      items.map(
        (item) =>
          item.productId ||
          item.sku ||
          item.productName
      )
    ).size;

  return {
    totalItems,
    totalQuantity,
    totalValue,
    uniqueProducts,
  };
};

//======================================================
// Normalize
//======================================================

export const normalizeCartItem = (
  item = {}
) => {
  const quantity =
    toNumber(item.quantity);

  const unitPrice =
    toNumber(item.unitPrice);

  return {
    ...item,

    cartItemId:
      item.cartItemId ||
      item.id,

    quantity,

    unitPrice,

    totalAmount:
      getCartItemTotal(item),
  };
};

export const normalizeCartItems = (
  items = []
) => {
  return items.map(
    normalizeCartItem
  );
};