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
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";

//======================================================
// PurchaseReportSearch
//======================================================

const PurchaseReportSearch = ({
  value = "",
  onSearch,
  loading = false,
  placeholder = "Search purchase reports...",
  debounceDelay = 300,
}) => {
  //====================================================
  // Local Search State
  //====================================================

  const [searchValue, setSearchValue] =
    useState(value || "");

  //====================================================
  // Sync External Value
  //====================================================

  useEffect(() => {
    setSearchValue(value || "");
  }, [value]);

  //====================================================
  // Debounced Search
  //====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        onSearch?.(searchValue.trim());
      }
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [
    searchValue,
    debounceDelay,
    loading,
    onSearch,
  ]);

  //====================================================
  // Change Handler
  //====================================================

  const handleChange = useCallback(
    (event) => {
      setSearchValue(
        event.target.value
      );
    },
    []
  );

  //====================================================
  // Clear Handler
  //====================================================

  const handleClear = useCallback(() => {
    setSearchValue("");

    onSearch?.("");
  }, [onSearch]);
  //====================================================
  // Submit Handler
  //====================================================

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      onSearch?.(
        searchValue.trim()
      );
    },
    [
      loading,
      onSearch,
      searchValue,
    ]
  );

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="purchase-report-search"
      variant="outlined"
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        p: 1.5,
        borderRadius: 2,
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={loading}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),

          endAdornment:
            searchValue ? (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    disabled={loading}
                    edge="end"
                    aria-label="Clear search"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
        }}
        inputProps={{
          "aria-label":
            "Search purchase reports",
        }}
      />
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportSearch.propTypes = {
  value:
    PropTypes.string,

  onSearch:
    PropTypes.func,

  loading:
    PropTypes.bool,

  placeholder:
    PropTypes.string,

  debounceDelay:
    PropTypes.number,
};

//======================================================
// Default Props
//======================================================

PurchaseReportSearch.defaultProps = {
  value: "",

  onSearch: () => {},

  loading: false,

  placeholder:
    "Search purchase reports...",

  debounceDelay: 300,
};

//======================================================
// Export
//======================================================

export default PurchaseReportSearch;


