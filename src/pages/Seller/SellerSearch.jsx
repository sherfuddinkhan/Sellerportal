// =========================================================
// SellerSearch.jsx
// Seller Search Component
// =========================================================

import React, { useState } from "react";

import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// =========================================================
// COMPONENT
// =========================================================

const SellerSearch = ({
  value = "",
  onChange,
  onSearch,
  placeholder = "Search sellers...",
}) => {
  const [localValue, setLocalValue] = useState(value);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const newValue = event.target.value;

    setLocalValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = () => {
    if (onSearch) {
      onSearch(localValue.trim());
    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {
    setLocalValue("");

    if (onChange) {
      onChange("");
    }

    if (onSearch) {
      onSearch("");
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        label="Search Seller"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),

          endAdornment: localValue && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                aria-label="Clear seller search"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={handleSearch}
        sx={{
          minWidth: 110,
          height: 40,
          textTransform: "none",
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SellerSearch;

