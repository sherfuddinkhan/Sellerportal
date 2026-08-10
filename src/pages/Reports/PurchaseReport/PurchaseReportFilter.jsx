import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  CalendarMonth,
  Clear,
  FilterAlt,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

//======================================================
// PurchaseReportFilter
//======================================================

const PurchaseReportFilter = ({
  filters = {},
  marketplaces = [],
  categories = [],
  statuses = [],
  loading = false,
  onApply,
  onReset,
}) => {
  //====================================================
  // Local Filter State
  //====================================================

  const [localFilters, setLocalFilters] =
    useState({
      marketplace:
        filters?.marketplace || "",

      category:
        filters?.category || "",

      status:
        filters?.status || "",

      supplier:
        filters?.supplier || "",

      startDate:
        filters?.startDate || "",

      endDate:
        filters?.endDate || "",
    });

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      marketplace:
        filters?.marketplace || "",

      category:
        filters?.category || "",

      status:
        filters?.status || "",

      supplier:
        filters?.supplier || "",

      startDate:
        filters?.startDate || "",

      endDate:
        filters?.endDate || "",
    });
  }, [filters]);

  //====================================================
  // Generic Change Handler
  //====================================================

  const handleChange = useCallback(
    (field) => (event) => {
      setLocalFilters(
        (previous) => ({
          ...previous,
          [field]:
            event.target.value,
        })
      );
    },
    []
  );

  //====================================================
  // Apply Filters
  //====================================================

  const handleApply = useCallback(() => {
    if (loading) {
      return;
    }

    onApply?.({
      ...localFilters,
    });
  }, [
    loading,
    localFilters,
    onApply,
  ]);

  //====================================================
  // Reset Filters
  //====================================================

  const handleReset = useCallback(() => {
    const resetFilters = {
      marketplace: "",
      category: "",
      status: "",
      supplier: "",
      startDate: "",
      endDate: "",
    };

    setLocalFilters(
      resetFilters
    );

    onReset?.();
  }, [onReset]);
  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="purchase-report-filter"
      variant="outlined"
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          sm: 2,
        },
        borderRadius: 2,
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
          spacing={1}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <FilterAlt fontSize="small" />

            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Purchase Filters
            </Typography>
          </Stack>

          <Button
            size="small"
            variant="text"
            startIcon={<Clear />}
            onClick={handleReset}
            disabled={loading}
          >
            Clear
          </Button>
        </Stack>

        <Divider />

        {/*==============================================
            Filter Fields
        ==============================================*/}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* Marketplace */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Marketplace
            </InputLabel>

            <Select
              value={
                localFilters.marketplace
              }
              label="Marketplace"
              onChange={handleChange(
                "marketplace"
              )}
              disabled={loading}
            >
              <MenuItem value="">
                All Marketplaces
              </MenuItem>

              {marketplaces.map(
                (marketplace, index) => {
                  const value =
                    typeof marketplace ===
                    "object"
                      ? marketplace.value ??
                        marketplace.id ??
                        ""
                      : marketplace;

                  const label =
                    typeof marketplace ===
                    "object"
                      ? marketplace.label ??
                        marketplace.name ??
                        value
                      : marketplace;

                  return (
                    <MenuItem
                      key={`${value}-${index}`}
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>

          {/* Category */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Category
            </InputLabel>

            <Select
              value={
                localFilters.category
              }
              label="Category"
              onChange={handleChange(
                "category"
              )}
              disabled={loading}
            >
              <MenuItem value="">
                All Categories
              </MenuItem>

              {categories.map(
                (category, index) => {
                  const value =
                    typeof category ===
                    "object"
                      ? category.value ??
                        category.id ??
                        ""
                      : category;

                  const label =
                    typeof category ===
                    "object"
                      ? category.label ??
                        category.name ??
                        value
                      : category;

                  return (
                    <MenuItem
                      key={`${value}-${index}`}
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>

          {/* Status */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Status
            </InputLabel>

            <Select
              value={
                localFilters.status
              }
              label="Status"
              onChange={handleChange(
                "status"
              )}
              disabled={loading}
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>

              {statuses.map(
                (status, index) => {
                  const value =
                    typeof status ===
                    "object"
                      ? status.value ??
                        status.id ??
                        ""
                      : status;

                  const label =
                    typeof status ===
                    "object"
                      ? status.label ??
                        status.name ??
                        value
                      : status;

                  return (
                    <MenuItem
                      key={`${value}-${index}`}
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>

          {/* Supplier */}

          <TextField
            fullWidth
            size="small"
            label="Supplier"
            value={
              localFilters.supplier
            }
            onChange={handleChange(
              "supplier"
            )}
            disabled={loading}
            placeholder="Supplier name"
          />

          {/* Start Date */}

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Start Date"
            value={
              localFilters.startDate
            }
            onChange={handleChange(
              "startDate"
            )}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <CalendarMonth
                  fontSize="small"
                  sx={{
                    mr: 1,
                    color:
                      "text.secondary",
                  }}
                />
              ),
            }}
          />

          {/* End Date */}

          <TextField
            fullWidth
            size="small"
            type="date"
            label="End Date"
            value={
              localFilters.endDate
            }
            onChange={handleChange(
              "endDate"
            )}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <CalendarMonth
                  fontSize="small"
                  sx={{
                    mr: 1,
                    color:
                      "text.secondary",
                  }}
                />
              ),
            }}
          />
        </Box>

        {/*==============================================
            Actions
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            startIcon={<FilterAlt />}
            onClick={handleApply}
            disabled={loading}
          >
            Apply Filters
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportFilter.propTypes = {
  filters:
    PropTypes.object,

  marketplaces:
    PropTypes.array,

  categories:
    PropTypes.array,

  statuses:
    PropTypes.array,

  loading:
    PropTypes.bool,

  onApply:
    PropTypes.func,

  onReset:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

PurchaseReportFilter.defaultProps = {
  filters: {},

  marketplaces: [],

  categories: [],

  statuses: [],

  loading: false,

  onApply: () => {},

  onReset: () => {},
};

//======================================================
// Export
//======================================================

export default PurchaseReportFilter;

