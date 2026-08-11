//======================================================
// StockMovementReportFilter.jsx
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
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

//======================================================
// Default Filters
//======================================================

const DEFAULT_FILTERS = {
  stockItem: "",
  warehouse: "",
  godown: "",
  movementType: "",
  voucherType: "",
  status: "",
  startDate: "",
  endDate: "",
};

//======================================================
// StockMovementReportFilter
//======================================================

const StockMovementReportFilter = ({
  filters = DEFAULT_FILTERS,
  value,
  onChange,
  onFiltersChange,
  onClear,
  disabled = false,
  defaultExpanded = true,
  showHeader = true,
  stockItems = [],
  warehouses = [],
  godowns = [],
  movementTypes = [],
  voucherTypes = [],
  statuses = [],
}) => {
  //====================================================
  // Internal Filters
  //====================================================

  const externalFilters =
    value || filters || DEFAULT_FILTERS;

  const [localFilters, setLocalFilters] =
    useState({
      ...DEFAULT_FILTERS,
      ...externalFilters,
    });

  //====================================================
  // Expanded State
  //====================================================

  const [expanded, setExpanded] =
    useState(defaultExpanded);

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      ...DEFAULT_FILTERS,
      ...(value || filters || {}),
    });
  }, [
    value,
    filters,
  ]);

  //====================================================
  // Field Change
  //====================================================

  const handleFieldChange =
    useCallback(
      (field, nextValue) => {
        const updatedFilters = {
          ...localFilters,
          [field]:
            nextValue ?? "",
        };

        setLocalFilters(
          updatedFilters
        );

        if (onChange) {
          onChange(
            field,
            nextValue ?? ""
          );
        }

        if (onFiltersChange) {
          onFiltersChange(
            updatedFilters
          );
        }
      },
      [
        localFilters,
        onChange,
        onFiltersChange,
      ]
    );

  //====================================================
  // Clear Filters
  //====================================================

  const handleClear =
    useCallback(() => {
      const clearedFilters = {
        ...DEFAULT_FILTERS,
      };

      setLocalFilters(
        clearedFilters
      );

      if (onClear) {
        onClear();
      } else {
        if (onFiltersChange) {
          onFiltersChange(
            clearedFilters
          );
        }

        if (onChange) {
          Object.keys(
            clearedFilters
          ).forEach(
            (field) => {
              onChange(
                field,
                ""
              );
            }
          );
        }
      }
    }, [
      onClear,
      onChange,
      onFiltersChange,
    ]);

  //====================================================
  // Toggle
  //====================================================

  const handleToggle =
    useCallback(() => {
      setExpanded(
        (previous) =>
          !previous
      );
    }, []);

  //====================================================
  // Select Options Helper
  //====================================================

  const normalizeOptions =
    useCallback(
      (options) => {
        if (
          !Array.isArray(
            options
          )
        ) {
          return [];
        }

        return options
          .map((option) => {
            if (
              typeof option ===
              "string"
            ) {
              return {
                value: option,
                label: option,
              };
            }

            if (
              option &&
              typeof option ===
                "object"
            ) {
              return {
                value:
                  option.value ??
                  option.id ??
                  option.code ??
                  "",
                label:
                  option.label ??
                  option.name ??
                  option.description ??
                  option.value ??
                  option.code ??
                  "",
              };
            }

            return null;
          })
          .filter(
            Boolean
          )
          .filter(
            (option) =>
              option.value !==
              ""
          );
      },
      []
    );

  //====================================================
  // Normalized Options
  //====================================================

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

  const movementTypeOptions =
    normalizeOptions(
      movementTypes
    );

  const voucherTypeOptions =
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
    <Paper
      variant="outlined"
      className="stock-movement-report__filter"
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/*==============================================
          Header
      ===============================================*/}

      {showHeader && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <FilterAltIcon
              fontSize="small"
            />

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Filters
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Refine stock movement
                records
              </Typography>
            </Box>
          </Stack>

          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={
              handleToggle
            }
            disabled={disabled}
            endIcon={
              expanded ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )
            }
          >
            {expanded
              ? "Hide"
              : "Show"}
          </Button>
        </Box>
      )}

      {/*==============================================
          Filter Content
      ===============================================*/}

      <Collapse
        in={
          showHeader
            ? expanded
            : true
        }
      >
        <Box
          sx={{
            px: 2,
            pb: 2,
          }}
        >
          <Grid
            container
            spacing={2}
          >
            {/*========================================
                Stock Item
            =========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              {stockItemOptions.length >
              0 ? (
                <FormControl
                  fullWidth
                  size="small"
                  disabled={
                    disabled
                  }
                >
                  <InputLabel>
                    Stock Item
                  </InputLabel>

                  <Select
                    value={
                      localFilters.stockItem ||
                      ""
                    }
                    label="Stock Item"
                    onChange={(event) =>
                      handleFieldChange(
                        "stockItem",
                        event.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      All Stock Items
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
                          {
                            option.label
                          }
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  label="Stock Item"
                  value={
                    localFilters.stockItem ||
                    ""
                  }
                  onChange={(event) =>
                    handleFieldChange(
                      "stockItem",
                      event.target.value
                    )
                  }
                  disabled={
                    disabled
                  }
                />
              )}
            </Grid>

            {/*========================================
                Warehouse
            =========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              {warehouseOptions.length >
              0 ? (
                <FormControl
                  fullWidth
                  size="small"
                  disabled={
                    disabled
                  }
                >
                  <InputLabel>
                    Warehouse
                  </InputLabel>

                  <Select
                    value={
                      localFilters.warehouse ||
                      ""
                    }
                    label="Warehouse"
                    onChange={(event) =>
                      handleFieldChange(
                        "warehouse",
                        event.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      All Warehouses
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
                          {
                            option.label
                          }
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  label="Warehouse"
                  value={
                    localFilters.warehouse ||
                    ""
                  }
                  onChange={(event) =>
                    handleFieldChange(
                      "warehouse",
                      event.target.value
                    )
                  }
                  disabled={
                    disabled
                  }
                />
              )}
            </Grid>

            {/*========================================
                Godown
            =========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              {godownOptions.length >
              0 ? (
                <FormControl
                  fullWidth
                  size="small"
                  disabled={
                    disabled
                  }
                >
                  <InputLabel>
                    Godown
                  </InputLabel>

                  <Select
                    value={
                      localFilters.godown ||
                      ""
                    }
                    label="Godown"
                    onChange={(event) =>
                      handleFieldChange(
                        "godown",
                        event.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      All Godowns
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
                          {
                            option.label
                          }
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  label="Godown"
                  value={
                    localFilters.godown ||
                    ""
                  }
                  onChange={(event) =>
                    handleFieldChange(
                      "godown",
                      event.target.value
                    )
                  }
                  disabled={
                    disabled
                  }
                />
              )}
            </Grid>

            {/*========================================
                Movement Type
            =========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <FormControl
                fullWidth
                size="small"
                disabled={disabled}
              >
                <InputLabel>
                  Movement Type
                </InputLabel>

                <Select
                  value={
                    localFilters.movementType ||
                    ""
                  }
                  label="Movement Type"
                  onChange={(event) =>
                    handleFieldChange(
                      "movementType",
                      event.target.value
                    )
                  }
                >
                  <MenuItem value="">
                    All Movements
                  </MenuItem>

                  {(
                    movementTypeOptions.length >
                    0
                      ? movementTypeOptions
                      : [
                          {
                            value:
                              "Inward",
                            label:
                              "Inward",
                          },
                          {
                            value:
                              "Outward",
                            label:
                              "Outward",
                          },
                          {
                            value:
                              "Transfer",
                            label:
                              "Transfer",
                          },
                          {
                            value:
                              "Adjustment",
                            label:
                              "Adjustment",
                          },
                        ]
                  ).map(
                    (option) => (
                      <MenuItem
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/*========================================
                Voucher Type
            =========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              {voucherTypeOptions.length >
              0 ? (
                <FormControl
                  fullWidth
                  size="small"
                  disabled={
                    disabled
                  }
                >
                  <InputLabel>
                    Voucher Type
                  </InputLabel>

                  <Select
                    value={
                      localFilters.voucherType ||
                      ""
                    }
                    label="Voucher Type"
                    onChange={(event) =>
                      handleFieldChange(
                        "voucherType",
                        event.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      All Voucher Types
                    </MenuItem>

                    {voucherTypeOptions.map(
                      (option) => (
                        <MenuItem
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  label="Voucher Type"
                  value={
                    localFilters.voucherType ||
                    ""
                  }
                  onChange={(event) =>
                    handleFieldChange(
                      "voucherType",
                      event.target.value
                    )
                  }
                  disabled={
                    disabled
                  }
                />
              )}
            </Grid>

            {/*========================================
                Status
            =========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
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
                  value={
                    localFilters.status ||
                    ""
                  }
                  label="Status"
                  onChange={(event) =>
                    handleFieldChange(
                      "status",
                      event.target.value
                    )
                  }
                >
                  <MenuItem value="">
                    All Statuses
                  </MenuItem>

                  {(
                    statusOptions.length >
                    0
                      ? statusOptions
                      : [
                          {
                            value:
                              "Completed",
                            label:
                              "Completed",
                          },
                          {
                            value:
                              "Pending",
                            label:
                              "Pending",
                          },
                          {
                            value:
                              "Cancelled",
                            label:
                              "Cancelled",
                          },
                        ]
                  ).map(
                    (option) => (
                      <MenuItem
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/*========================================
                Start Date
            =========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Start Date"
                value={
                  localFilters.startDate ||
                  ""
                }
                onChange={(event) =>
                  handleFieldChange(
                    "startDate",
                    event.target.value
                  )
                }
                disabled={
                  disabled
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/*========================================
                End Date
            =========================================*/}

           <Grid
  item
  xs={12}
  sm={6}
  md={4}
  lg={3}
>
  <TextField
    fullWidth
    size="small"
    type="date"
    label="End Date"
    value={
      localFilters.endDate || ""
    }
    onChange={(event) =>
      handleFieldChange(
        "endDate",
        event.target.value
      )
    }
    disabled={
      disabled
    }
    InputLabelProps={{
      shrink: true,
    }}
  />
</Grid>

            {/*========================================
                Actions
            =========================================*/}

            <Grid
              item
              xs={12}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={
                    <ClearAllIcon />
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
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportFilter.propTypes = {
  filters:
    PropTypes.object,

  value:
    PropTypes.object,

  onChange:
    PropTypes.func,

  onFiltersChange:
    PropTypes.func,

  onClear:
    PropTypes.func,

  disabled:
    PropTypes.bool,

  defaultExpanded:
    PropTypes.bool,

  showHeader:
    PropTypes.bool,

  stockItems:
    PropTypes.array,

  warehouses:
    PropTypes.array,

  godowns:
    PropTypes.array,

  movementTypes:
    PropTypes.array,

  voucherTypes:
    PropTypes.array,

  statuses:
    PropTypes.array,
};

//======================================================
// Default Props
//======================================================

StockMovementReportFilter.defaultProps = {
  filters:
    DEFAULT_FILTERS,

  value:
    undefined,

  onChange:
    undefined,

  onFiltersChange:
    undefined,

  onClear:
    undefined,

  disabled:
    false,

  defaultExpanded:
    true,

  showHeader:
    true,

  stockItems:
    [],

  warehouses:
    [],

  godowns:
    [],

  movementTypes:
    [],

  voucherTypes:
    [],

  statuses:
    [],
};

//======================================================
// Export
//======================================================

export default StockMovementReportFilter;

//======================================================
// Part 1A Ends Here
//======================================================