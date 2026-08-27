// ==========================================================
// ProductPriceToolbar.jsx
// ==========================================================

import React, {
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import {
  Search,
  Refresh,
  Add,
  Clear,
} from "@mui/icons-material";

// ==========================================================
// ProductPriceToolbar Component
// ==========================================================

const ProductPriceToolbar = ({
  searchText = "",
  onSearchChange,
  onRefresh,
  onAdd,
  onClearSearch,
  loading = false,
  readOnly = false,
  placeholder = "Search product, SKU, price type, currency, status...",
}) => {
  // ========================================================
  // Search Handler
  // ========================================================

  const handleSearchChange = useCallback(
    (event) => {
      if (
        typeof onSearchChange ===
        "function"
      ) {
        onSearchChange(
          event.target.value
        );
      }
    },
    [onSearchChange]
  );

  // ========================================================
  // Clear Search
  // ========================================================

  const handleClearSearch =
    useCallback(() => {
      if (
        typeof onClearSearch ===
        "function"
      ) {
        onClearSearch();
      } else if (
        typeof onSearchChange ===
        "function"
      ) {
        onSearchChange("");
      }
    }, [
      onClearSearch,
      onSearchChange,
    ]);

  // ========================================================
  // Refresh
  // ========================================================

  const handleRefresh =
    useCallback(() => {
      if (
        typeof onRefresh ===
        "function"
      ) {
        onRefresh();
      }
    }, [onRefresh]);

  // ========================================================
  // Add Price
  // ========================================================

  const handleAdd =
    useCallback(() => {
      if (
        typeof onAdd ===
        "function"
      ) {
        onAdd();
      }
    }, [onAdd]);

  // ========================================================
  // JSX
  // ========================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        justifyContent="space-between"
      >
        {/* Search */}

        <TextField
          fullWidth
          size="small"
          label="Search Product Prices"
          placeholder={placeholder}
          value={searchText}
          onChange={
            handleSearchChange
          }
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),

            endAdornment:
              searchText ? (
                <InputAdornment position="end">
                  <Tooltip title="Clear search">
                    <IconButton
                      size="small"
                      onClick={
                        handleClearSearch
                      }
                      disabled={
                        loading
                      }
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : null,
          }}
        />

        {/* Actions */}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
        >
          {/* Refresh */}

          <Tooltip title="Refresh product prices">
            <span>
              <IconButton
                color="primary"
                onClick={
                  handleRefresh
                }
                disabled={loading}
              >
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>

          {/* Add */}

          {!readOnly && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
              disabled={loading}
            >
              Add Price
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

// ==========================================================
// PropTypes
// ==========================================================

ProductPriceToolbar.propTypes = {
  searchText:
    PropTypes.string,

  onSearchChange:
    PropTypes.func,

  onRefresh:
    PropTypes.func,

  onAdd:
    PropTypes.func,

  onClearSearch:
    PropTypes.func,

  loading:
    PropTypes.bool,

  readOnly:
    PropTypes.bool,

  placeholder:
    PropTypes.string,
};

// ==========================================================
// Default Props
// ==========================================================

ProductPriceToolbar.defaultProps = {
  searchText: "",

  onSearchChange: null,

  onRefresh: null,

  onAdd: null,

  onClearSearch: null,

  loading: false,

  readOnly: false,

  placeholder:
    "Search product, SKU, price type, currency, status...",
};

// ==========================================================
// Export
// ==========================================================

export default ProductPriceToolbar;