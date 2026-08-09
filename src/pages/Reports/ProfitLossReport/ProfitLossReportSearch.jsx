import React, {useCallback} from "react";
import PropTypes from "prop-types";
import {Clear,Search} from "@mui/icons-material";
import {Box,IconButton,InputAdornment,TextField} from "@mui/material";

//======================================================
// ProfitLossReportSearch
//======================================================

const ProfitLossReportSearch = ({
  value = "",
  onSearch,
  loading = false,
  placeholder =
    "Search by order, product, marketplace...",
  fullWidth = true,
}) => {
  //====================================================
  // Search Change
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const nextValue =
          event?.target?.value ??
          "";

        onSearch?.(
          nextValue
        );
      },
      [onSearch]
    );

  //====================================================
  // Clear Search
  //====================================================

  const handleClear =
    useCallback(() => {
      onSearch?.("");
    }, [onSearch]);

  //====================================================
  // Search Key Handler
  //====================================================

  const handleKeyDown =
    useCallback(
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          handleClear();
        }
      },
      [handleClear]
    );
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="profit-loss-report-search"
      sx={{
        width: "100%",
      }}
    >
      <TextField
        fullWidth={fullWidth}
        size="small"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading}
        label="Search Profit & Loss Reports"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search
                fontSize="small"
              />
            </InputAdornment>
          ),

          endAdornment:
            value ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={
                    handleClear
                  }
                  disabled={loading}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <Clear
                    fontSize="small"
                  />
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
      />
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

ProfitLossReportSearch.propTypes = {
  value:
    PropTypes.string,

  onSearch:
    PropTypes.func,

  loading:
    PropTypes.bool,

  placeholder:
    PropTypes.string,

  fullWidth:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

ProfitLossReportSearch.defaultProps = {
  value: "",

  onSearch: () => {},

  loading: false,

  placeholder:
    "Search by order, product, marketplace...",

  fullWidth: true,
};

//======================================================
// Export
//======================================================

export default ProfitLossReportSearch;

