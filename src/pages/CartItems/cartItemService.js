//======================================================
// cartItemService.js
//======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "";

//======================================================
// Request Helper
//======================================================

const request = async (
  endpoint,
  options = {}
) => {
  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        headers: {
          "Content-Type":
            "application/json",
          ...(options.headers || {}),
        },
        ...options,
      }
    );

  const contentType =
    response.headers.get(
      "content-type"
    );

  const data =
    contentType?.includes(
      "application/json"
    )
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data ||
        "Request failed."
    );
  }

  return data;
};

//======================================================
// Get Cart Items
//======================================================

export const getCartItems = async (
  params = {}
) => {
  const query =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
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

  const queryString =
    query.toString();

  return request(
    `/api/cart-items${
      queryString
        ? `?${queryString}`
        : ""
    }`
  );
};

//======================================================
// Get Cart Item By ID
//======================================================

export const getCartItemById = (
  cartItemId
) => {
  return request(
    `/api/cart-items/${cartItemId}`
  );
};

//======================================================
// Create Cart Item
//======================================================

export const createCartItem = (
  payload
) => {
  return request(
    "/api/cart-items",
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    }
  );
};

//======================================================
// Update Cart Item
//======================================================

export const updateCartItem = (
  cartItemId,
  payload
) => {
  return request(
    `/api/cart-items/${cartItemId}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    }
  );
};

//======================================================
// Delete Cart Item
//======================================================

export const deleteCartItem = (
  cartItemId
) => {
  return request(
    `/api/cart-items/${cartItemId}`,
    {
      method: "DELETE",
    }
  );
};

//======================================================
// Update Quantity
//======================================================

export const updateCartItemQuantity = (
  cartItemId,
  quantity
) => {
  return updateCartItem(
    cartItemId,
    {
      quantity,
    }
  );
};

//======================================================
// Export
//======================================================

export default {
  getCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  updateCartItemQuantity,
};