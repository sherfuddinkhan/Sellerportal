import React, {useCallback,useEffect,useState} from "react";
import PropTypes from "prop-types";
import {Clear,Search} from "@mui/icons-material";
import {Box,IconButton,InputAdornment,TextField,Tooltip} from "@mui/material";

//======================================================
// SalesReportSearch
//======================================================

const SalesReportSearch = ({
  value = "",
  placeholder = "Search sales reports...",
  loading = false,
  disabled = false,
  debounceMs = 300,
  onChange,
  onClear,
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
    setSearchValue(
      value || ""
    );
  }, [value]);

  //====================================================
  // Search Change Handler
  //====================================================

  const handleChange = useCallback(
    (event) => {
      const nextValue =
        event.target.value;

      setSearchValue(nextValue);
    },
    []
  );

  //====================================================
  // Debounced Change
  //====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        if (
          typeof onChange ===
          "function"
        ) {
          onChange(
            searchValue
          );
        }
      }, debounceMs);

    return () =>
      clearTimeout(timer);
  }, [
    searchValue,
    debounceMs,
    onChange,
  ]);

  //====================================================
  // Clear Handler
  //====================================================

  const handleClear = useCallback(
    () => {
      setSearchValue("");

      if (
        typeof onClear ===
        "function"
      ) {
        onClear();
      }

      if (
        typeof onChange ===
        "function"
      ) {
        onChange("");
      }
    },
    [onChange, onClear]
  );

export default SalesReportSearch;
};

//======================================================
// PropTypes
//======================================================

SalesReportSearch.propTypes = {
  value:
    PropTypes.string,

  placeholder:
    PropTypes.string,

  loading:
    PropTypes.bool,

  disabled:
    PropTypes.bool,

  debounceMs:
    PropTypes.number,

  onChange:
    PropTypes.func,

  onClear:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

SalesReportSearch.defaultProps = {
  value: "",

  placeholder:
    "Search sales reports...",

  loading: false,

  disabled: false,

  debounceMs: 300,

  onChange: null,

  onClear: null,
};

export default SalesReportSearch;

