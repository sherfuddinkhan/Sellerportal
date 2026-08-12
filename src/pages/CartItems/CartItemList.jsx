import React from "react";

import {
  Alert,
  Box,
} from "@mui/material";

import CartItemTable from "./CartItemTable";

const CartItemList = ({
  items = [],
  onView,
  onDelete,
}) => {
  if (!items.length) {
    return (
      <Alert severity="info">
        No cart items found.
      </Alert>
    );
  }

  return (
    <Box>
      <CartItemTable
        items={items}
        onView={onView}
        onDelete={onDelete}
      />
    </Box>
  );
};

export default CartItemList;