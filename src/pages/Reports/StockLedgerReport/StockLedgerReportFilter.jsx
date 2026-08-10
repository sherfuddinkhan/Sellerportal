
//======================================================
// StockLedgerReportFilter.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

//======================================================
// Default Filters
//======================================================

const DEFAULT_FILTERS = {
  stockItem: "",
  warehouse: "",
  godown: "",
  transactionType: "",
  voucherType: "",
  status: "",
  startDate: "",
  endDate: "",
};

//======================================================
// StockLedgerReportFilter
//======================================================

const StockLedgerReportFilter = ({
  filters = DEFAULT_FILTERS,
  value = DEFAULT_FILTERS,
  disabled = false,
  stockItems = [],
  warehouses = [],
  godowns = [],
  transactionTypes = [],
  voucherTypes = [],
  statuses = [],
  onFilterChange,
  onChange,
  onClear,
}) => {
  //====================================================
  // Local Filter State
  //====================================================

  const [localFilters, setLocalFilters] =
    useState({
      ...DEFAULT_FILTERS,
      ...(filters || {}),
      ...(value || {}),
    });

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      ...DEFAULT_FILTERS,
      ...(filters || {}),
      ...(value || {}),
    });
  }, [filters, value]);

  //====================================================
  // Update Filter
  //====================================================

  const updateFilter = useCallback(
    (field, nextValue) => {
      setLocalFilters(
        (previous) => {
          const updated = {
            ...previous,
            [field]: nextValue,
          };

          if (
            typeof onFilterChange ===
            "function"
          ) {
            onFilterChange(updated);
          }

          return updated;
        }
      );
    },
    [onFilterChange]
  );

  //====================================================
  // Generic Change Handler
  //====================================================

  const handleChange = useCallback(
    (field) => (event) => {
      const nextValue =
        event?.target?.value ?? "";

      updateFilter(
        field,
        nextValue
      );

      if (
        typeof onChange ===
        "function"
      ) {
        onChange({
          target: {
            name: field,
            value: nextValue,
          },
        });
      }
    },
    [onChange, updateFilter]
  );

  //====================================================
  // Clear Filters
  //====================================================

  const handleClear = useCallback(() => {
    const clearedFilters = {
      ...DEFAULT_FILTERS,
    };

    setLocalFilters(
      clearedFilters
    );

    if (
      typeof onClear ===
      "function"
    ) {
      onClear();
      return;
    }

    if (
      typeof onFilterChange ===
      "function"
    ) {
      onFilterChange(
        clearedFilters
      );
    }
  }, [
    onClear,
    onFilterChange,
  ]);

  //====================================================
  // Normalize Select Options
  //====================================================

  const normalizeOptions = useCallback(
    (options) => {
      if (!Array.isArray(options)) {
        return [];
      }

      return options
        .map((option) => {
          if (
            typeof option ===
            "string" ||
            typeof option ===
            "number"
          ) {
            return {
              value: String(option),
              label: String(option),
            };
          }

          return {
            value: String(
              option?.value ??
                option?.id ??
                option?.code ??
                ""
            ),
            label:
              option?.label ??
              option?.name ??
              option?.title ??
              option?.value ??
              option?.code ??
              "",
          };
        })
        .filter(
          (option) =>
            option.value !== ""
        );
    },
    []
  );

  const stockItemOptions =
    normalizeOptions(
      stockItems
    );

  const warehouseOptions =
    normalizeOptions(
      warehouses
    );

  const godownOptions =
    normalizeOptions(
      godowns
    );

  const transactionOptions =
    normalizeOptions(
      transactionTypes
    );

  const voucherOptions =
    normalizeOptions(
      voucherTypes
    );

  const statusOptions =
    normalizeOptions(
      statuses
    );

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-ledger-report-filter"
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <FilterAltOutlinedIcon
            fontSize="small"
          />

          <Box
            component="span"
            sx={{
              fontWeight: 600,
            }}
          >
            Filters
          </Box>
        </Stack>

        <Grid
          container
          spacing={2}
        >
          {/*============================================
              Stock Item
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
              disabled={disabled}
            >
              <InputLabel>
                Stock Item
              </InputLabel>

              <Select
                label="Stock Item"
                value={
                  localFilters.stockItem ||
                  ""
                }
                onChange={handleChange(
                  "stockItem"
                )}
              >
                <MenuItem value="">
                  <em>All Items</em>
                </MenuItem>

                {stockItemOptions.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          {/*============================================
              Warehouse
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
              disabled={disabled}
            >
              <InputLabel>
                Warehouse
              </InputLabel>

              <Select
                label="Warehouse"
                value={
                  localFilters.warehouse ||
                  ""
                }
                onChange={handleChange(
                  "warehouse"
                )}
              >
                <MenuItem value="">
                  <em>All Warehouses</em>
                </MenuItem>

                {warehouseOptions.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          {/*============================================
              Godown
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
              disabled={disabled}
            >
              <InputLabel>
                Godown
              </InputLabel>

              <Select
                label="Godown"
                value={
                  localFilters.godown ||
                  ""
                }
                onChange={handleChange(
                  "godown"
                )}
              >
                <MenuItem value="">
                  <em>All Godowns</em>
                </MenuItem>

                {godownOptions.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          {/*============================================
              Transaction Type
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
              disabled={disabled}
            >
              <InputLabel>
                Transaction
              </InputLabel>

              <Select
                label="Transaction"
                value={
                  localFilters.transactionType ||
                  ""
                }
                onChange={handleChange(
                  "transactionType"
                )}
              >
                <MenuItem value="">
                  <em>All Transactions</em>
                </MenuItem>

                {transactionOptions.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          {/*============================================
              Voucher Type
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
              disabled={disabled}
            >
              <InputLabel>
                Voucher Type
              </InputLabel>

              <Select
                label="Voucher Type"
                value={
                  localFilters.voucherType ||
                  ""
                }
                onChange={handleChange(
                  "voucherType"
                )}
              >
                <MenuItem value="">
                  <em>All Voucher Types</em>
                </MenuItem>

                {voucherOptions.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          {/*============================================
              Status
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <FormControl
              fullWidth
              size="small"
              disabled={disabled}
            >
              <InputLabel>
                Status
              </InputLabel>

              <Select
                label="Status"
                value={
                  localFilters.status ||
                  ""
                }
                onChange={handleChange(
                  "status"
                )}
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>

                {statusOptions.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          {/*============================================
              Start Date
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={
                localFilters.startDate ||
                ""
              }
              onChange={handleChange(
                "startDate"
              )}
              disabled={disabled}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/*============================================
              End Date
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              fullWidth
              size="small"
              label="End Date"
              type="date"
              value={
                localFilters.endDate ||
                ""
              }
              onChange={handleChange(
                "endDate"
              )}
              disabled={disabled}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        {/*==============================================
            Clear Filters
        ===============================================*/}

        <Stack
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={
              <ClearOutlinedIcon />
            }
            onClick={
              handleClear
            }
            disabled={
              disabled
            }
          >
            Clear Filters
          </Button>
        </Stack>

        {/*==============================================
            Part 1A Ends Here
        ===============================================*/}
      </Stack>
    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

StockLedgerReportFilter.propTypes = {
  filters:
    PropTypes.shape({
      stockItem:
        PropTypes.string,

      warehouse:
        PropTypes.string,

      godown:
        PropTypes.string,

      transactionType:
        PropTypes.string,

      voucherType:
        PropTypes.string,

      status:
        PropTypes.string,

      startDate:
        PropTypes.string,

      endDate:
        PropTypes.string,
    }),

  value:
    PropTypes.shape({
      stockItem:
        PropTypes.string,

      warehouse:
        PropTypes.string,

      godown:
        PropTypes.string,

      transactionType:
        PropTypes.string,

      voucherType:
        PropTypes.string,

      status:
        PropTypes.string,

      startDate:
        PropTypes.string,

      endDate:
        PropTypes.string,
    }),

  disabled:
    PropTypes.bool,

  stockItems:
    PropTypes.array,

  warehouses:
    PropTypes.array,

  godowns:
    PropTypes.array,

  transactionTypes:
    PropTypes.array,

  voucherTypes:
    PropTypes.array,

  statuses:
    PropTypes.array,

  onFilterChange:
    PropTypes.func,

  onChange:
    PropTypes.func,

  onClear:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportFilter.defaultProps = {
  filters:
    DEFAULT_FILTERS,

  value:
    DEFAULT_FILTERS,

  disabled: false,

  stockItems: [],

  warehouses: [],

  godowns: [],

  transactionTypes: [],

  voucherTypes: [],

  statuses: [],

  onFilterChange:
    null,

  onChange:
    null,

  onClear:
    null,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportFilter;


