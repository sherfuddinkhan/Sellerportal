import React, {useCallback,useEffect,useMemo,useState} from "react";
import PropTypes from "prop-types";
import {FilterAlt,RestartAlt} from "@mui/icons-material";
import {Box,Button,FormControl,InputLabel,MenuItem,Select,Stack,TextField,Typography} from "@mui/material";

//======================================================
// ReturnReportFilter
//======================================================
const ReturnReportFilter = ({
  filters = {},
  marketplaces = [],
  categories = [],
  statuses = [],
  reasons = [],
  loading = false,
  onApply,
  onReset,
}) => {
  //====================================================
  // Local Filter State
  //====================================================
  const [localFilters, setLocalFilters] = useState({
      marketplace: filters?.marketplace || "",
      category: filters?.category || "",
      status: filters?.status || "",
      reason: filters?.reason || "",
      customer: filters?.customer || "",
      startDate: filters?.startDate || "",
      endDate: filters?.endDate || "",
    });

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      marketplace: filters?.marketplace || "",
      category: filters?.category || "",
      status: filters?.status || "",
      reason: filters?.reason || "",
      customer: filters?.customer || "",
      startDate: filters?.startDate || "",
      endDate: filters?.endDate || "",
    });
  }, [filters]);

  //====================================================
  // Normalize Options
  //====================================================

  const marketplaceList = useMemo(() => Array.isArray(marketplaces) ? marketplaces : [],[marketplaces]);
  const categoryList = useMemo(() => Array.isArray(categories) ? categories : [],[categories]);
  const statusList = useMemo(() => Array.isArray(statuses)? statuses : [],[statuses]);
  const reasonList = useMemo(() => Array.isArray(reasons) ? reasons: [],[reasons]);
  //====================================================
  // Change Handler
  //====================================================
  const handleChange = useCallback(
    (field) => (event) => {
      setLocalFilters(
        (previous) => ({
          ...previous,
          [field]: event.target.value,
        })
      );
    },
    []
  );

  //====================================================
  // Apply Handler
  //====================================================

  const handleApply = useCallback(() => {
    if (onApply) {
      onApply(localFilters);
    }
  }, [localFilters,onApply,]);

  //====================================================
  // Reset Handler
  //====================================================

  const handleReset = useCallback(() => {
    const emptyFilters = {
      marketplace: "",
      category: "",
      status: "",
      reason: "",
      customer: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(emptyFilters);
    if (onReset) {
      onReset();
    }
  }, [onReset]);


  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="return-report-filter"
      sx={{
        width: "100%",
        mb: 2,
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
            <FilterAlt fontSize="small" />

            <Typography
              variant="subtitle2"
              fontWeight={700}
            >
              Filters
            </Typography>
          </Stack>

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

        {/*==============================================
            Select Filters
        ==============================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          flexWrap="wrap"
        >
          {/* Marketplace */}

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 180,
              },
              flex: 1,
            }}
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

              {marketplaceList.map(
                (option, index) => {
                  const value =
                    typeof option ===
                    "object"
                      ? option.value ??
                        option.id ??
                        option.name
                      : option;

                  const label =
                    typeof option ===
                    "object"
                      ? option.label ??
                        option.name ??
                        option.value
                      : option;

                  return (
                    <MenuItem
                      key={`marketplace-${index}-${value}`}
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
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 180,
              },
              flex: 1,
            }}
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

              {categoryList.map(
                (option, index) => {
                  const value =
                    typeof option ===
                    "object"
                      ? option.value ??
                        option.id ??
                        option.name
                      : option;

                  const label =
                    typeof option ===
                    "object"
                      ? option.label ??
                        option.name ??
                        option.value
                      : option;

                  return (
                    <MenuItem
                      key={`category-${index}-${value}`}
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
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 160,
              },
              flex: 1,
            }}
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

              {statusList.map(
                (option, index) => {
                  const value =
                    typeof option ===
                    "object"
                      ? option.value ??
                        option.id ??
                        option.name
                      : option;

                  const label =
                    typeof option ===
                    "object"
                      ? option.label ??
                        option.name ??
                        option.value
                      : option;

                  return (
                    <MenuItem
                      key={`status-${index}-${value}`}
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>

          {/* Return Reason */}

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 180,
              },
              flex: 1,
            }}
          >
            <InputLabel>
              Return Reason
            </InputLabel>

            <Select
              value={
                localFilters.reason
              }
              label="Return Reason"
              onChange={handleChange(
                "reason"
              )}
              disabled={loading}
            >
              <MenuItem value="">
                All Reasons
              </MenuItem>

              {reasonList.map(
                (option, index) => {
                  const value =
                    typeof option ===
                    "object"
                      ? option.value ??
                        option.id ??
                        option.name
                      : option;

                  const label =
                    typeof option ===
                    "object"
                      ? option.label ??
                        option.name ??
                        option.value
                      : option;

                  return (
                    <MenuItem
                      key={`reason-${index}-${value}`}
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>
        </Stack>

        {/*==============================================
            Customer + Date Filters
        ==============================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            size="small"
            label="Customer"
            value={
              localFilters.customer
            }
            onChange={handleChange(
              "customer"
            )}
            disabled={loading}
            fullWidth
          />

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
            disabled={loading}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />

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
            disabled={loading}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>

        {/*==============================================
            Apply Button
        ==============================================*/}

        <Stack
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            size="small"
            startIcon={
              <FilterAlt />
            }
            onClick={handleApply}
            disabled={loading}
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

ReturnReportFilter.propTypes = {
  filters:
    PropTypes.object,

  marketplaces:
    PropTypes.array,

  categories:
    PropTypes.array,

  statuses:
    PropTypes.array,

  reasons:
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

ReturnReportFilter.defaultProps = {
  filters: {},

  marketplaces: [],

  categories: [],

  statuses: [],

  reasons: [],

  loading: false,

  onApply: () => {},

  onReset: () => {},
};



export default ReturnReportFilter;

