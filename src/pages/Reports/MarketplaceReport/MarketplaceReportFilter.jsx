import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import {
  Clear,
  FilterAlt,
} from "@mui/icons-material";

//======================================================
// MarketplaceReportFilter
//======================================================

const MarketplaceReportFilter = ({
  filters = {},
  loading = false,
  disabled = false,
  marketplaces = [],
  statuses = [],
  categories = [],
  onChange,
  onApply,
  onReset,
}) => {

  //====================================================
  // Default Filter Values
  //====================================================

  const defaultFilters = {
    marketplace: "",
    status: "",
    category: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    ...filters,
  };

  //====================================================
  // Local Filter State
  //====================================================

  const [localFilters, setLocalFilters] =
    useState(defaultFilters);

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      marketplace: "",
      status: "",
      category: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      ...filters,
    });
  }, [filters]);

  //====================================================
  // Handle Field Change
  //====================================================

  const handleChange =
    useCallback(
      (field) => (event) => {
        const value =
          event?.target?.value ??
          "";

        setLocalFilters(
          (previous) => ({
            ...previous,
            [field]: value,
          })
        );
      },
      []
    );

  //====================================================
  // Apply Filters
  //====================================================

  const handleApply =
    useCallback(() => {
      if (
        typeof onApply ===
        "function"
      ) {
        onApply(
          localFilters
        );
      } else if (
        typeof onChange ===
        "function"
      ) {
        onChange(
          localFilters
        );
      }
    }, [
      localFilters,
      onApply,
      onChange,
    ]);

  //====================================================
  // Reset Filters
  //====================================================

  const handleReset =
    useCallback(() => {
      const resetFilters = {
        marketplace: "",
        status: "",
        category: "",
        dateFrom: "",
        dateTo: "",
        minAmount: "",
        maxAmount: "",
      };

      setLocalFilters(
        resetFilters
      );

      if (
        typeof onReset ===
        "function"
      ) {
        onReset(
          resetFilters
        );
      } else if (
        typeof onChange ===
        "function"
      ) {
        onChange(
          resetFilters
        );
      }
    }, [
      onReset,
      onChange,
    ]);

  //====================================================
  // Normalize Select Options
  //====================================================

  const marketplaceOptions =
    Array.isArray(
      marketplaces
    )
      ? marketplaces
      : [];

  const statusOptions =
    Array.isArray(statuses)
      ? statuses
      : [];

  const categoryOptions =
    Array.isArray(categories)
      ? categories
      : [];

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Card
      className="marketplace-report-filter"
      variant="outlined"
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          p: 2,
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Stack spacing={2}>

          {/*==============================================
              Filter Header
          ==============================================*/}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <FilterAlt
                fontSize="small"
                color="primary"
              />

              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                }}
              >
                Filters
              </Box>
            </Stack>

            <Button
              size="small"
              color="inherit"
              startIcon={
                <Clear />
              }
              onClick={
                handleReset
              }
              disabled={
                loading ||
                disabled
              }
            >
              Reset
            </Button>
          </Stack>

          {/*==============================================
              Filter Fields
          ==============================================*/}

          <Grid
            container
            spacing={2}
          >
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
                disabled={
                  loading ||
                  disabled
                }
              >
                <InputLabel>
                  Marketplace
                </InputLabel>

                <Select
                  value={
                    localFilters.marketplace ??
                    ""
                  }
                  label="Marketplace"
                  onChange={
                    handleChange(
                      "marketplace"
                    )
                  }
                >
                  <MenuItem value="">
                    All Marketplaces
                  </MenuItem>

                  {marketplaceOptions.map(
                    (option, index) => {
                      const value =
                        typeof option ===
                        "object"
                          ? option.value ??
                            option.id ??
                            ""
                          : option;

                      const label =
                        typeof option ===
                        "object"
                          ? option.label ??
                            option.name ??
                            value
                          : option;

                      return (
                        <MenuItem
                          key={`marketplace-${value}-${index}`}
                          value={value}
                        >
                          {label}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </FormControl>
            </Grid>

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
                disabled={
                  loading ||
                  disabled
                }
              >
                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  value={
                    localFilters.status ??
                    ""
                  }
                  label="Status"
                  onChange={
                    handleChange(
                      "status"
                    )
                  }
                >
                  <MenuItem value="">
                    All Statuses
                  </MenuItem>

                  {statusOptions.map(
                    (option, index) => {
                      const value =
                        typeof option ===
                        "object"
                          ? option.value ??
                            option.id ??
                            ""
                          : option;

                      const label =
                        typeof option ===
                        "object"
                          ? option.label ??
                            option.name ??
                            value
                          : option;

                      return (
                        <MenuItem
                          key={`status-${value}-${index}`}
                          value={value}
                        >
                          {label}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/*============================================
                Category
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
                disabled={
                  loading ||
                  disabled
                }
              >
                <InputLabel>
                  Category
                </InputLabel>

                <Select
                  value={
                    localFilters.category ??
                    ""
                  }
                  label="Category"
                  onChange={
                    handleChange(
                      "category"
                    )
                  }
                >
                  <MenuItem value="">
                    All Categories
                  </MenuItem>

                  {categoryOptions.map(
                    (option, index) => {
                      const value =
                        typeof option ===
                        "object"
                          ? option.value ??
                            option.id ??
                            ""
                          : option;

                      const label =
                        typeof option ===
                        "object"
                          ? option.label ??
                            option.name ??
                            value
                          : option;

                      return (
                        <MenuItem
                          key={`category-${value}-${index}`}
                          value={value}
                        >
                          {label}
                        </MenuItem>
                      );
                    }
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
                value={
                  localFilters.dateFrom ??
                  ""
                }
                onChange={
                  handleChange(
                    "dateFrom"
                  )
                }
                disabled={
                  loading ||
                  disabled
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
                value={
                  localFilters.dateTo ??
                  ""
                }
                onChange={
                  handleChange(
                    "dateTo"
                  )
                }
                disabled={
                  loading ||
                  disabled
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/*============================================
                Minimum Amount
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
                type="number"
                label="Minimum Amount"
                value={
                  localFilters.minAmount ??
                  ""
                }
                onChange={
                  handleChange(
                    "minAmount"
                  )
                }
                disabled={
                  loading ||
                  disabled
                }
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/*============================================
                Maximum Amount
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
                type="number"
                label="Maximum Amount"
                value={
                  localFilters.maxAmount ??
                  ""
                }
                onChange={
                  handleChange(
                    "maxAmount"
                  )
                }
                disabled={
                  loading ||
                  disabled
                }
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/*============================================
                Apply Button
            ============================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              display="flex"
              alignItems="center"
            >
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={
                  <FilterAlt />
                }
                onClick={
                  handleApply
                }
                disabled={
                  loading ||
                  disabled
                }
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportFilter.propTypes = {
  filters: PropTypes.shape({
    marketplace: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    status: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    dateFrom: PropTypes.string,

    dateTo: PropTypes.string,

    minAmount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    maxAmount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),

  loading: PropTypes.bool,

  disabled: PropTypes.bool,

  marketplaces: PropTypes.array,

  statuses: PropTypes.array,

  categories: PropTypes.array,

  onChange: PropTypes.func,

  onApply: PropTypes.func,

  onReset: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportFilter.defaultProps = {
  filters: {},

  loading: false,

  disabled: false,

  marketplaces: [],

  statuses: [],

  categories: [],

  onChange: () => {},

  onApply: () => {},

  onReset: () => {},
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportFilter;