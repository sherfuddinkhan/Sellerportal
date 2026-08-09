import React from "react";
import PropTypes from "prop-types";
import {Box,Grid,MenuItem,Paper,Stack,TextField,Button,InputAdornment} from "@mui/material";
import {Search,Clear} from "@mui/icons-material";

//====================================================
// Filter Options
//====================================================

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];

const RATING_OPTIONS = [
  "All",
  "5 Stars",
  "4 Stars",
  "3 Stars",
  "2 Stars",
  "1 Star",
];

const MARKETPLACE_OPTIONS = [
  "All",
  "Amazon",
  "Flipkart",
  "Meesho",
  "Shopify",
];

//====================================================
// ReviewSearch Component
//====================================================

const ReviewSearch = ({
  filters,
  onFilterChange,
  onSearch,
  onClear,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (onFilterChange) {
      onFilterChange(name, value);
    }
  };
  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };
    return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Grid container spacing={2}>
        {/* ==========================================
            Search Text
        ========================================== */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="search"
            label="Search Reviews"
            placeholder="Customer, Product, SKU..."
            value={filters.search || ""}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {/* ==========================================
            Status
        ========================================== */}

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            name="status"
            label="Status"
            value={filters.status || "All"}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map((item) => (
              <MenuItem
                key={item}
                value={item}
              >
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* ==========================================
            Rating
        ========================================== */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            name="rating"
            label="Rating"
            value={filters.rating || "All"}
            onChange={handleChange}
          >
            {RATING_OPTIONS.map((item) => (
              <MenuItem
                key={item}
                value={item}
              >
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* ==========================================
            Marketplace
        ========================================== */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            name="marketplace"
            label="Marketplace"
            value={filters.marketplace || "All"}
            onChange={handleChange}
          >
            {MARKETPLACE_OPTIONS.map((item) => (
              <MenuItem
                key={item}
                value={item}
              >
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* ==========================================
            Verified Buyer
        ========================================== */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            name="verifiedBuyer"
            label="Verified"
            value={filters.verifiedBuyer || "All"}
            onChange={handleChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Yes">Verified</MenuItem>
            <MenuItem value="No">Guest</MenuItem>
          </TextField>
        </Grid>
        {/* ==========================================
            Action Buttons
        ========================================== */}
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Clear />}
              onClick={handleClear}
            >
              Clear
            </Button>

            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};
//====================================================
// PropTypes
//====================================================
ReviewSearch.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    rating: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    marketplace: PropTypes.string,
    verifiedBuyer: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }),

  onFilterChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
};

//====================================================
// Default Props
//====================================================

ReviewSearch.defaultProps = {
  filters: {
    search: "",
    status: "All",
    rating: "All",
    marketplace: "All",
    verifiedBuyer: "All",
  },

  onFilterChange: () => {},
  onSearch: () => {},
  onClear: () => {},
};

//====================================================
// Export
//====================================================

export default ReviewSearch;