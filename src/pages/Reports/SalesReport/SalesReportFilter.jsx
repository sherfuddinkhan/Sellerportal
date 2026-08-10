import React, {useCallback,useEffect,useState} from "react";
import PropTypes from "prop-types";
import {ClearAll,FilterAlt} from "@mui/icons-material";
import {Box,Button,FormControl,InputLabel,MenuItem,Select,Stack,TextField,Typography} from "@mui/material";

//======================================================
// SalesReportFilter
//======================================================

const SalesReportFilter = ({
  filters = {},
  marketplaces = [],
  categories = [],
  statuses = [],
  loading = false,
  disabled = false,
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

      customer:
        filters?.customer || "",

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

      customer:
        filters?.customer || "",

      startDate:
        filters?.startDate || "",

      endDate:
        filters?.endDate || "",
    });
  }, [filters]);

  //====================================================
  // Generic Filter Change
  //====================================================

  const handleChange = useCallback(
    (field) => (event) => {
      const value =
        event?.target?.value ?? "";

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

  const handleApply = useCallback(() => {
    if (
      loading ||
      disabled
    ) {
      return;
    }

    if (
      typeof onApply ===
      "function"
    ) {
      onApply({
        ...localFilters,
      });
    }
  }, [
    disabled,
    loading,
    localFilters,
    onApply,
  ]);

  //====================================================
  // Reset Filters
  //====================================================

  const handleReset = useCallback(() => {
    const emptyFilters = {
      marketplace: "",
      category: "",
      status: "",
      customer: "",
      startDate: "",
      endDate: "",
    };

    setLocalFilters(
      emptyFilters
    );

    if (
      typeof onReset ===
      "function"
    ) {
      onReset();
    }
  }, [onReset]);
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="sales-report-filter"
      sx={{
        width: "100%",
      }}
    >
      <Stack spacing={2}>
        {/*==============================================
            Filter Header
        ==============================================*/}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <FilterAlt
            fontSize="small"
            color="action"
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            Filters
          </Typography>
        </Stack>

        {/*==============================================
            Filter Fields
        ==============================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          flexWrap="wrap"
        >
          {/*============================================
              Marketplace
          =============================================*/}

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 180,
              },
            }}
            disabled={
              disabled || loading
            }
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
            >
              <MenuItem value="">
                All Marketplaces
              </MenuItem>

              {Array.isArray(
                marketplaces
              ) &&
                marketplaces.map(
                  (marketplace) => (
                    <MenuItem
                      key={
                        String(
                          marketplace
                        )
                      }
                      value={
                        marketplace
                      }
                    >
                      {marketplace}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormControl>

          {/*============================================
              Category
          =============================================*/}

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 180,
              },
            }}
            disabled={
              disabled || loading
            }
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
            >
              <MenuItem value="">
                All Categories
              </MenuItem>

              {Array.isArray(
                categories
              ) &&
                categories.map(
                  (category) => (
                    <MenuItem
                      key={
                        String(
                          category
                        )
                      }
                      value={category}
                    >
                      {category}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormControl>

          {/*============================================
              Status
          =============================================*/}

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 160,
              },
            }}
            disabled={
              disabled || loading
            }
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
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>

              {Array.isArray(
                statuses
              ) &&
                statuses.map(
                  (status) => (
                    <MenuItem
                      key={
                        String(status)
                      }
                      value={status}
                    >
                      {status}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormControl>

          {/*============================================
              Customer
          =============================================*/}

          <TextField
            size="small"
            label="Customer"
            value={
              localFilters.customer
            }
            onChange={handleChange(
              "customer"
            )}
            disabled={
              disabled || loading
            }
            sx={{
              minWidth: {
                xs: "100%",
                sm: 180,
              },
            }}
          />

          {/*============================================
              Start Date
          =============================================*/}

          <TextField
            size="small"
            label="Start Date"
            type="date"
            value={
              localFilters.startDate
            }
            onChange={handleChange(
              "startDate"
            )}
            disabled={
              disabled || loading
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              minWidth: {
                xs: "100%",
                sm: 170,
              },
            }}
          />

          {/*============================================
              End Date
          =============================================*/}

          <TextField
            size="small"
            label="End Date"
            type="date"
            value={
              localFilters.endDate
            }
            onChange={handleChange(
              "endDate"
            )}
            disabled={
              disabled || loading
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              minWidth: {
                xs: "100%",
                sm: 170,
              },
            }}
          />
        </Stack>

        {/*==============================================
            Filter Actions
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          flexWrap="wrap"
        >
          <Button
            variant="outlined"
            startIcon={
              <ClearAll />
            }
            onClick={
              handleReset
            }
            disabled={
              disabled || loading
            }
          >
            Clear
          </Button>

          <Button
            variant="contained"
            startIcon={
              <FilterAlt />
            }
            onClick={
              handleApply
            }
            disabled={
              disabled || loading
            }
          >
            Apply Filters
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportFilter.propTypes = {
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

  disabled:
    PropTypes.bool,

  onApply:
    PropTypes.func,

  onReset:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

SalesReportFilter.defaultProps = {
  filters: {},

  marketplaces: [],

  categories: [],

  statuses: [],

  loading: false,

  disabled: false,

  onApply: null,

  onReset: null,
};

export default SalesReportFilter;



