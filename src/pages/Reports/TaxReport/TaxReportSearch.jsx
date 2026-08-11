//======================================================
// TaxReportSearch.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

//======================================================
// TaxReportSearch
//======================================================

const TaxReportSearch = ({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Search invoice, GSTIN, customer, supplier...",
}) => {
  //====================================================
  // Change Handler
  //====================================================

  const handleChange = (
    event
  ) => {
    const nextValue =
      event.target.value;

    if (
      typeof onChange ===
      "function"
    ) {
      onChange(nextValue);
    }
  };

  //====================================================
  // Clear Search
  //====================================================

  const handleClear = () => {
    if (
      disabled
    ) {
      return;
    }

    if (
      typeof onChange ===
      "function"
    ) {
      onChange("");
    }
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="tax-report__search"
      sx={{
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        size="small"
        label="Search Tax Reports"
        placeholder={placeholder}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                fontSize="small"
                color="action"
              />
            </InputAdornment>
          ),

          endAdornment:
            value ? (
              <InputAdornment position="end">
                <Tooltip
                  title="Clear search"
                >
                  <span>
                    <IconButton
                      size="small"
                      onClick={
                        handleClear
                      }
                      disabled={
                        disabled
                      }
                      aria-label="Clear search"
                    >
                      <ClearIcon
                        fontSize="small"
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            ) : null,
        }}
      />
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportSearch;

//======================================================
// Part 1A Ends Here
//======================================================