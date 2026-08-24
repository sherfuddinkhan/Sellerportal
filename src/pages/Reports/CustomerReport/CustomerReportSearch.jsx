import React, { useState } from "react";
import PropTypes from "prop-types";
import {Box,Button,FormControl,Grid,IconButton,InputAdornment,InputLabel,MenuItem,Select,Stack,TextField,Tooltip,} from "@mui/material";
import {Search,Clear,FilterList,} from "@mui/icons-material";
//======================================================
// Filter Options
//======================================================
const STATUS_OPTIONS = ["All","Active","Inactive",];
const MARKETPLACE_OPTIONS = ["All","Amazon","Flipkart","Meesho","Shopify","Walmart","eBay",];
const CUSTOMER_TYPE_OPTIONS = ["All","Individual","Business","Wholesale","Retail",];
//======================================================
// CustomerReportSearch Component
//======================================================
const CustomerReportSearch = ({
  filters = {},
  onFilterChange,
  onSearch,
  onClear,
}) => {
  //====================================================
  // Local Search State
  //====================================================
  const [searchText, setSearchText] = useState(filters.search || "");
  //====================================================
  // Filter Visibility
  //====================================================
  const [showFilters, setShowFilters] = useState(true);
  //====================================================
  // Current Filter Values
  //====================================================
  const status = filters.status || "All";
  const marketplace = filters.marketplace || "All";
  const customerType = filters.customerType || "All";
  const dateFrom = filters.dateFrom || "";
  const dateTo = filters.dateTo || "";
  //====================================================
  // Search Input
  //====================================================
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (onFilterChange) {
      onFilterChange("search",value);
    }
  };
  //====================================================
  // Search Submit
  //====================================================
  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch({
        ...filters,
        search: searchText,
      });
    }
  };
  //====================================================
  // Enter Key Search
  //====================================================
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  //====================================================
  // Generic Filter Change
  //====================================================
  const handleFilterChange = (name,value) => {
    if (onFilterChange) {
      onFilterChange(name,value);
    }
  };
  //====================================================
  // Clear Filters
  //====================================================
  const handleClear = () => {
    setSearchText("");
    if (onClear) {
      onClear();
    }
  };
  //====================================================
  // Toggle Filters
  //====================================================
  const handleToggleFilters = () => {
    setShowFilters((previous) => !previous);
  };
    //====================================================
  // JSX
  //====================================================
  return (
    <Box
      className="customer-report-search"
      sx={{
        mb: 3,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      {/*================================================
          Search Header
      =================================================*/}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <FilterList color="primary" />
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Customer Search & Filters
          </Box>
        </Stack>
        <Button
          size="small"
          variant="text"
          onClick={handleToggleFilters}
          startIcon={<FilterList />}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </Stack>
      {/*================================================
          Search Field
      =================================================*/}
      <Grid
        container
        spacing={2}
        alignItems="center"
      >
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
        >
          <TextField
            fullWidth
            size="small"
            label="Search Customers"
            placeholder="Search by customer name, email, phone, GSTIN..."
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <Tooltip title="Clear search">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchText("");
                        if (onFilterChange) {
                          onFilterChange(
                            "search",
                            ""
                          );
                        }
                      }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
        >
          <Stack
            direction="row"
            spacing={1}
            justifyContent={{
              xs: "stretch",
              md: "flex-end",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearchSubmit}
            >
              Search
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {/*================================================
          Advanced Filters
      =================================================*/}
      {showFilters && (
        <Grid
          container
          spacing={2}
          sx={{ mt: 0.5 }}
        >
          {/*============================================
              Status
          ============================================*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
            >
              <InputLabel>
                Status
              </InputLabel>
              <Select
                label="Status"
                value={status}
                onChange={(event) =>
                  handleFilterChange(
                    "status",
                    event.target.value
                  )
                }
              >
                {STATUS_OPTIONS.map(
                  (option) => (
                    <MenuItem
                      key={option}
                      value={option}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          {/*============================================
              Marketplace
          ============================================*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
            >
              <InputLabel>
                Marketplace
              </InputLabel>
              <Select
                label="Marketplace"
                value={marketplace}
                onChange={(event) =>
                  handleFilterChange(
                    "marketplace",
                    event.target.value
                  )
                }
              >
                {MARKETPLACE_OPTIONS.map(
                  (option) => (
                    <MenuItem
                      key={option}
                      value={option}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          {/*============================================
              Customer Type
          ============================================*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
            >
              <InputLabel>
                Customer Type
              </InputLabel>
              <Select
                label="Customer Type"
                value={customerType}
                onChange={(event) =>
                  handleFilterChange(
                    "customerType",
                    event.target.value
                  )
                }
              >
                {CUSTOMER_TYPE_OPTIONS.map(
                  (option) => (
                    <MenuItem
                      key={option}
                      value={option}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          {/*============================================
              Date From
          ============================================*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date From"
              value={dateFrom}
              onChange={(event) =>
                handleFilterChange(
                  "dateFrom",
                  event.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/*============================================
              Date To
          ============================================*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date To"
              value={dateTo}
              onChange={(event) =>
                handleFilterChange(
                  "dateTo",
                  event.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CustomerReportSearch;

//======================================================
// PropTypes
//======================================================

CustomerReportSearch.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    marketplace: PropTypes.string,
    customerType: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
  }),
  onFilterChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
};
//======================================================
// Default Props
//======================================================
CustomerReportSearch.defaultProps = {
  filters: {
    search: "",
    status: "All",
    marketplace: "All",
    customerType: "All",
    dateFrom: "",
    dateTo: "",
  },

  onFilterChange: () => {},
  onSearch: () => {},
  onClear: () => {},
};

