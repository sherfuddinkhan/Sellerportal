import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Box,Chip,Divider,Grid,IconButton,Paper,Stack,Typography} from "@mui/material";
import {Clear,Search} from "@mui/icons-material";

//======================================================
// InventoryReportSearch
//======================================================

const InventoryReportSearch = ({
  value = "",
  searchTerm = "",
  onSearch,
  onChange,
  loading = false,
  placeholder = "Search inventory reports...",
}) => {

  //====================================================
  // Search State
  //====================================================

  const initialValue =
    value || searchTerm || "";

  const [localSearch, setLocalSearch] =
    useState(initialValue);

  //====================================================
  // Sync With Parent
  //====================================================

  useEffect(() => {

    setLocalSearch(
      value || searchTerm || ""
    );

  }, [
    value,
    searchTerm,
  ]);

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch = (
    event
  ) => {

    const nextValue =
      event?.target?.value ?? "";

    setLocalSearch(
      nextValue
    );

    if (
      typeof onChange ===
      "function"
    ) {
      onChange(
        nextValue
      );

      return;
    }

    if (
      typeof onSearch ===
      "function"
    ) {
      onSearch(
        nextValue
      );
    }

  };

  //====================================================
  // Submit Search
  //====================================================

  const handleSubmit = () => {

    if (
      typeof onSearch ===
      "function"
    ) {
      onSearch(
        localSearch.trim()
      );
    }

  };

  //====================================================
  // Clear Search
  //====================================================

  const handleClear = () => {

    setLocalSearch("");

    if (
      typeof onSearch ===
      "function"
    ) {
      onSearch("");
    }

    if (
      typeof onChange ===
      "function"
    ) {
      onChange("");
    }

  };

  //====================================================
  // Keyboard Handler
  //====================================================

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      handleSubmit();

    }

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <TextField
      className="inventory-report-search"
      fullWidth
      size="small"
      variant="outlined"
      label="Search Inventory Reports"
      placeholder={placeholder}
      value={localSearch}
      onChange={handleSearch}
      onKeyDown={handleKeyDown}
      disabled={loading}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip title="Search">
              <IconButton
                edge="start"
                size="small"
                onClick={handleSubmit}
                disabled={loading}
                aria-label="search inventory reports"
              >
                <Search fontSize="small" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),

        endAdornment: localSearch ? (
          <InputAdornment position="end">
            <Tooltip title="Clear search">
              <IconButton
                size="small"
                onClick={handleClear}
                disabled={loading}
                aria-label="clear inventory report search"
              >
                <Clear fontSize="small" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

InventoryReportSearch.propTypes = {
  value: PropTypes.string,

  searchTerm: PropTypes.string,

  onSearch: PropTypes.func,

  onChange: PropTypes.func,

  loading: PropTypes.bool,

  placeholder: PropTypes.string,
};

//======================================================
// Default Props
//======================================================

InventoryReportSearch.defaultProps = {
  value: "",

  searchTerm: "",

  onSearch: () => {},

  onChange: () => {},

  loading: false,

  placeholder:
    "Search inventory reports...",
    
}
export default InventoryReportSearch;