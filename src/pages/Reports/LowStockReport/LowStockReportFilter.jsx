import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  FilterAlt,
  FilterAltOff,
  Refresh,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

//======================================================
// LowStockReportFilter
//======================================================

const LowStockReportFilter = ({
  filters = {},
  onChange,
  onApply,
  onReset,
  loading = false,
}) => {

  //====================================================
  // Default Filter Values
  //====================================================

  const defaultFilters = useMemo(
    () => ({
      search: "",
      status: "Low",
      category: "",
      warehouse: "",
      supplier: "",
      dateFrom: "",
      dateTo: "",
      minStock: "",
      maxStock: "",
    }),
    []
  );

  //====================================================
  // Local Filter State
  //====================================================

  const [localFilters, setLocalFilters] =
    useState({
      ...defaultFilters,
      ...filters,
    });

  //====================================================
  // Expanded State
  //====================================================

  const [expanded, setExpanded] =
    useState(false);

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      ...defaultFilters,
      ...filters,
    });
  }, [
    filters,
    defaultFilters,
  ]);

  //====================================================
  // Handle Field Change
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const {
          name,
          value,
        } = event.target;

        setLocalFilters(
          (previous) => ({
            ...previous,
            [name]: value,
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
      }

      if (
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
      const resetValues = {
        ...defaultFilters,
      };

      setLocalFilters(
        resetValues
      );

      if (
        typeof onReset ===
        "function"
      ) {
        onReset(
          resetValues
        );
      }

      if (
        typeof onChange ===
        "function"
      ) {
        onChange(
          resetValues
        );
      }
    }, [
      defaultFilters,
      onReset,
      onChange,
    ]);

  //====================================================
  // Toggle Expanded
  //====================================================

  const handleToggle =
    useCallback(() => {
      setExpanded(
        (previous) =>
          !previous
      );
    }, []);

  //====================================================
  // Active Filter Count
  //====================================================

  const activeFilterCount =
    useMemo(() => {
      return Object.entries(
        localFilters
      ).filter(
        ([key, value]) => {
          if (
            key === "status" &&
            value === "Low"
          ) {
            return false;
          }

          return (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          );
        }
      ).length;
    }, [
      localFilters,
    ]);

  //====================================================
  // Status Options
  //====================================================

  const statusOptions = [
    {
      value: "Low",
      label: "Low Stock",
    },
    {
      value: "Out of Stock",
      label: "Out of Stock",
    },
    {
      value: "Stock OK",
      label: "Stock OK",
    },
    {
      value: "All",
      label: "All Statuses",
    },
  ];

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Card
      className="low-stock-report-filter"
      elevation={0}
      variant="outlined"
      sx={{
        width: "100%",
        mb: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {/*================================================
            Filter Header
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1.5}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <FilterAlt
              color="primary"
            />

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
              >
                Filters
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Refine the low stock
                report results.
              </Typography>
            </Box>

            {activeFilterCount >
              0 && (
              <Box
                sx={{
                  minWidth: 24,
                  height: 24,
                  px: 0.75,
                  borderRadius: 12,
                  bgcolor:
                    "primary.main",
                  color:
                    "primary.contrastText",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {
                  activeFilterCount
                }
              </Box>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Tooltip
              title={
                expanded
                  ? "Collapse filters"
                  : "Expand filters"
              }
            >
              <IconButton
                size="small"
                onClick={
                  handleToggle
                }
                disabled={
                  loading
                }
              >
                {expanded ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Reset filters"
            >
              <span>
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={
                    handleReset
                  }
                  disabled={
                    loading
                  }
                >
                  <FilterAltOff />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <Divider
            sx={{
              my: 2,
            }}
          />

          {/*================================================
              Filter Fields
          =================================================*/}

          <Grid
            container
            spacing={2}
          >
            {/*==============================================
                Status
            ==============================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <TextField
                fullWidth
                select
                size="small"
                label="Status"
                name="status"
                value={
                  localFilters.status ??
                  "Low"
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
              >
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
                      {
                        option.label
                      }
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            {/*==============================================
                Category
            ==============================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <TextField
                fullWidth
                size="small"
                label="Category"
                name="category"
                value={
                  localFilters.category ??
                  ""
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
                placeholder="Enter category"
              />
            </Grid>

            {/*==============================================
                Warehouse
            ==============================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <TextField
                fullWidth
                size="small"
                label="Warehouse"
                name="warehouse"
                value={
                  localFilters.warehouse ??
                  ""
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
                placeholder="Enter warehouse"
              />
            </Grid>

            {/*==============================================
                Supplier
            ==============================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <TextField
                fullWidth
                size="small"
                label="Supplier"
                name="supplier"
                value={
                  localFilters.supplier ??
                  ""
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
                placeholder="Enter supplier"
              />
            </Grid>

            {/*==============================================
                Minimum Stock
            ==============================================*/}

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
                label="Minimum Stock"
                name="minStock"
                value={
                  localFilters.minStock ??
                  ""
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/*==============================================
                Maximum Stock
            ==============================================*/}

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
                label="Maximum Stock"
                name="maxStock"
                value={
                  localFilters.maxStock ??
                  ""
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/*==============================================
                Date From
            ==============================================*/}

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
                name="dateFrom"
                value={
                  localFilters.dateFrom ??
                  ""
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/*==============================================
                Date To
            ==============================================*/}

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
                name="dateTo"
                value={
                  localFilters.dateTo ??
                  ""
                }
                onChange={
                  handleChange
                }
                disabled={
                  loading
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          {/*================================================
              Filter Actions
          =================================================*/}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="flex-end"
            spacing={1}
            sx={{
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={
                <Refresh />
              }
              onClick={
                handleReset
              }
              disabled={
                loading
              }
            >
              Reset
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={
                <FilterAlt />
              }
              onClick={
                handleApply
              }
              disabled={
                loading
              }
            >
              Apply Filters
            </Button>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

LowStockReportFilter.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    category: PropTypes.string,
    warehouse: PropTypes.string,
    supplier: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
    minStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    maxStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),

  onChange: PropTypes.func,

  onApply: PropTypes.func,

  onReset: PropTypes.func,

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

LowStockReportFilter.defaultProps = {
  filters: {
    search: "",
    status: "Low",
    category: "",
    warehouse: "",
    supplier: "",
    dateFrom: "",
    dateTo: "",
    minStock: "",
    maxStock: "",
  },

  onChange: () => {},

  onApply: () => {},

  onReset: () => {},

  loading: false,
};

//======================================================
// Export
//======================================================
}
export default LowStockReportFilter;