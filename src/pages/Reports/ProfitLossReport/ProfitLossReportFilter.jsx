import React, {useCallback,useEffect,useState} from "react";
import PropTypes from "prop-types";
import { FilterAlt,RestartAlt} from "@mui/icons-material";
import {Box,Button,Collapse,FormControl,Grid,InputLabel,MenuItem,Paper,Select,Stack,TextField} from "@mui/material";

//======================================================
// ProfitLossReportFilter
//======================================================

const ProfitLossReportFilter = ({
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
      dateFrom:
        filters?.dateFrom || "",
      dateTo:
        filters?.dateTo || "",
      marketplace:
        filters?.marketplace || "",
      category:
        filters?.category || "",
      product:
        filters?.product || "",
      status:
        filters?.status || "",
      minRevenue:
        filters?.minRevenue || "",
      maxRevenue:
        filters?.maxRevenue || "",
      minProfit:
        filters?.minProfit || "",
      maxProfit:
        filters?.maxProfit || "",
    });

  //====================================================
  // Expanded State
  //====================================================

  const [expanded, setExpanded] = useState(false);

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      dateFrom:
        filters?.dateFrom || "",
      dateTo:
        filters?.dateTo || "",
      marketplace:
        filters?.marketplace || "",
      category:
        filters?.category || "",
      product:
        filters?.product || "",
      status:
        filters?.status || "",
      minRevenue:
        filters?.minRevenue || "",
      maxRevenue:
        filters?.maxRevenue || "",
      minProfit:
        filters?.minProfit || "",
      maxProfit:
        filters?.maxProfit || "",
    });
  }, [filters]);

  //====================================================
  // Field Change
  //====================================================

  const handleChange =
    useCallback(
      (field) =>
        (event) => {
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
      onApply?.({
        ...localFilters,
      });
    }, [
      localFilters,
      onApply,
    ]);

  //====================================================
  // Reset Filters
  //====================================================

  const handleReset =
    useCallback(() => {
      const emptyFilters = {
        dateFrom: "",
        dateTo: "",
        marketplace: "",
        category: "",
        product: "",
        status: "",
        minRevenue: "",
        maxRevenue: "",
        minProfit: "",
        maxProfit: "",
      };
      setLocalFilters(
        emptyFilters
      );
      onReset?.();
    }, [onReset]);
  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="profit-loss-report-filter"
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        p: 1.5,
      }}
    >
      {/*==============================================
          Filter Header
      ==============================================*/}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Button
          size="small"
          variant="text"
          startIcon={<FilterAlt />}
          onClick={() =>
            setExpanded(
              (previous) =>
                !previous
            )
          }
          disabled={loading}
        >
          Filters
        </Button>

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={handleApply}
            disabled={loading}
          >
            Apply
          </Button>

          <Button
            size="small"
            variant="text"
            color="inherit"
            startIcon={
              <RestartAlt />
            }
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
        </Stack>
      </Box>
      {/*==============================================
          Filter Fields
      ==============================================*/}
      <Collapse in={expanded}>
        <Box sx={{ pt: 2 }}>
          <Grid
            container
            spacing={2}
          >
            {/* Date From */}

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
                  localFilters.dateFrom
                }
                onChange={handleChange(
                  "dateFrom"
                )}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
              />
            </Grid>

            {/* Date To */}

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
                  localFilters.dateTo
                }
                onChange={handleChange(
                  "dateTo"
                )}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
              />
            </Grid>

            {/* Marketplace */}

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
                    (marketplace) => (
                      <MenuItem
                        key={marketplace}
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
            </Grid>

            {/* Category */}

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
                    (category) => (
                      <MenuItem
                        key={category}
                        value={category}
                      >
                        {category}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Product */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <TextField
                fullWidth
                size="small"
                label="Product"
                value={
                  localFilters.product
                }
                onChange={handleChange(
                  "product"
                )}
                placeholder="Product name"
                disabled={loading}
              />
            </Grid>

            {/* Status */}

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
                    (status) => (
                      <MenuItem
                        key={status}
                        value={status}
                      >
                        {status}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Minimum Revenue */}

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
                label="Min Revenue"
                value={
                  localFilters.minRevenue
                }
                onChange={handleChange(
                  "minRevenue"
                )}
                inputProps={{
                  min: 0,
                }}
                disabled={loading}
              />
            </Grid>

            {/* Maximum Revenue */}

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
                label="Max Revenue"
                value={
                  localFilters.maxRevenue
                }
                onChange={handleChange(
                  "maxRevenue"
                )}
                inputProps={{
                  min: 0,
                }}
                disabled={loading}
              />
            </Grid>

            {/* Minimum Profit */}

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
                label="Min Profit"
                value={
                  localFilters.minProfit
                }
                onChange={handleChange(
                  "minProfit"
                )}
                disabled={loading}
              />
            </Grid>

            {/* Maximum Profit */}

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
                label="Max Profit"
                value={
                  localFilters.maxProfit
                }
                onChange={handleChange(
                  "maxProfit"
                )}
                disabled={loading}
              />
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

ProfitLossReportFilter.propTypes = {
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

ProfitLossReportFilter.defaultProps = {
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

export default ProfitLossReportFilter;
