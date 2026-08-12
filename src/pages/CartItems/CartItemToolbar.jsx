import React from "react";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

const CartItemToolbar = ({
  onRefresh,
  loading = false,
}) => {
  return (
    <Box className="cart-items-toolbar">
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Cart Items
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage products currently
            added to shopping carts.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </Button>
      </Stack>
    </Box>
  );
};

export default CartItemToolbar;