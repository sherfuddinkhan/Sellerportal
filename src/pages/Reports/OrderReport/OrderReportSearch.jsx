import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Clear,
  Search,
} from "@mui/icons-material";

import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

//======================================================
// OrderReportSearch
//======================================================

const OrderReportSearch = ({
  value = "",
  loading = false,
  placeholder =
    "Search by order number, customer, SKU, or channel...",
  onChange,
  onSearch,
  onClear,
}) => {
  //====================================================
  // Local Search State
  //====================================================

  const [searchValue, setSearchValue] =
    useState(value ?? "");

  //====================================================
  // Sync External Value
  //====================================================

  useEffect(() => {
    setSearchValue(
      value ?? ""
    );
  }, [value]);

  //====================================================
  // Change Handler
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const nextValue =
          event.target.value;

        setSearchValue(
          nextValue
        );

        if (
          typeof onChange ===
          "function"
        ) {
          onChange(
            nextValue
          );
        }
      },
      [onChange]
    );

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch =
    useCallback(() => {
      if (
        typeof onSearch ===
        "function"
      ) {
        onSearch(
          searchValue.trim()
        );
      }
    }, [
      onSearch,
      searchValue,
    ]);

  //====================================================
  // Key Down Handler
  //====================================================

  const handleKeyDown =
    useCallback(
      (event) => {
        if (
          event.key === "Enter"
        ) {
          event.preventDefault();

          handleSearch();
        }
      },
      [handleSearch]
    );

  //====================================================
  // Clear Handler
  //====================================================

  const handleClear =
    useCallback(() => {
      setSearchValue("");

      if (
        typeof onClear ===
        "function"
      ) {
        onClear();
        return;
      }

      if (
        typeof onChange ===
        "function"
      ) {
        onChange("");
      }

      if (
        typeof onSearch ===
        "function"
      ) {
        onSearch("");
      }
    }, [
      onClear,
      onChange,
      onSearch,
    ]);

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="order-report-search"
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        p: {
          xs: 1.5,
          sm: 2,
        },
      }}
    >
      <Stack
        spacing={1}
      >
        {/*================================================
            Search Label
        =================================================*/}

        <Typography
          variant="subtitle2"
          fontWeight={600}
        >
          Search Orders
        </Typography>

        {/*================================================
            Search Field
        =================================================*/}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={searchValue}
            placeholder={placeholder}
            disabled={loading}
            onChange={
              handleChange
            }
            onKeyDown={
              handleKeyDown
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    fontSize="small"
                    color="action"
                  />
                </InputAdornment>
              ),

              endAdornment:
                searchValue ? (
                  <InputAdornment position="end">
                    <Tooltip title="Clear search">
                      <IconButton
                        size="small"
                        onClick={
                          handleClear
                        }
                        disabled={
                          loading
                        }
                        edge="end"
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : null,
            }}
          />

          <Tooltip title="Search">
            <span>
              <IconButton
                color="primary"
                onClick={
                  handleSearch
                }
                disabled={loading}
                sx={{
                  border: 1,
                  borderColor:
                    "primary.main",
                  borderRadius: 1,
                }}
              >
                <Search />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/*================================================
            Search Hint
        =================================================*/}

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Press Enter or click the
          search button to search.
        </Typography>
      </Stack>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

OrderReportSearch.propTypes = {
  value:
    PropTypes.string,

  loading:
    PropTypes.bool,

  placeholder:
    PropTypes.string,

  onChange:
    PropTypes.func,

  onSearch:
    PropTypes.func,

  onClear:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

OrderReportSearch.defaultProps = {
  value: "",

  loading: false,

  placeholder:
    "Search by order number, customer, SKU, or channel...",

  onChange: () => {},

  onSearch: () => {},

  onClear: () => {},
};

//======================================================
// Export
//======================================================

export default OrderReportSearch;



