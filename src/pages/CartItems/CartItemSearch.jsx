import React from "react";

import {
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const CartItemSearch = ({
  value = "",
  onChange,
}) => {
  return (
    <TextField
      fullWidth
      size="small"
      label="Search Cart Items"
      placeholder="Search by product, SKU, customer or cart..."
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CartItemSearch;