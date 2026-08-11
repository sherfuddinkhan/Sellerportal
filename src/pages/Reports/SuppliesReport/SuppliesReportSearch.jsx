//======================================================
// SuppliesReportSearch.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//======================================================
// SuppliesReportSearch
//======================================================

const SuppliesReportSearch = ({
  value = "",
  onChange,
  disabled = false,
}) => {
  //====================================================
  // Search Change
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
      className="supplies-report__search"
      sx={{
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        size="small"
        label="Search Supplies Reports"
        placeholder="Search supplier, item, voucher, warehouse..."
        value={value || ""}
        onChange={
          handleChange
        }
        disabled={
          disabled
        }
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                fontSize="small"
              />
            </InputAdornment>
          ),

          endAdornment:
            value ? (
              <InputAdornment position="end">
                <Tooltip
                  title="Clear search"
                >
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

export default SuppliesReportSearch;

//======================================================
// Part 1A Ends Here
//======================================================