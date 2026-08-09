
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  FilterAlt,
  RestartAlt,
} from "@mui/icons-material";

import {
  Box,
  Button,
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
// OrderReportFilter
//======================================================

const OrderReportFilter = ({
  filters = {},
  statuses = [],
  channels = [],
  loading = false,
  onApply,
  onReset,
}) => {
  //====================================================
  // Local Filter State
  //====================================================

  const [localFilters, setLocalFilters] =
    useState({
      status: "",
      channel: "",
      paymentStatus: "",
      fulfillmentStatus: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      ...filters,
    });

  //====================================================
  // Sync External Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      status: "",
      channel: "",
      paymentStatus: "",
      fulfillmentStatus: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      ...filters,
    });
  }, [filters]);

  //====================================================
  // Generic Change Handler
  //====================================================

  const handleChange =
    useCallback((field, value) => {
      setLocalFilters(
        (previous) => ({
          ...previous,
          [field]: value,
        })
      );
    }, []);

  //====================================================
  // Apply Filters
  //====================================================

  const handleApply =
    useCallback(() => {
      if (
        typeof onApply ===
        "function"
      ) {
        onApply({
          ...localFilters,
        });
      }
    }, [
      localFilters,
      onApply,
    ]);

  //====================================================
  // Reset Filters
  //====================================================

  const handleReset =
    useCallback(() => {
      const resetFilters = {
        status: "",
        channel: "",
        paymentStatus: "",
        fulfillmentStatus: "",
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
        onReset();
      }
    }, [onReset]);

  //====================================================
  // Normalize Options
  //====================================================

  const normalizedStatuses =
    Array.isArray(statuses)
      ? statuses
      : [];

  const normalizedChannels =
    Array.isArray(channels)
      ? channels
      : [];
  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="order-report-filter"
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        p: {
          xs: 1.5,
          sm: 2,
        },
      }}
    >
      <Stack spacing={2}>
        {/*================================================
            Filter Header
        =================================================*/}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <FilterAlt
              color="primary"
              fontSize="small"
            />

            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Order Filters
            </Typography>
          </Stack>

          <Button
            size="small"
            variant="text"
            color="inherit"
            startIcon={
              <RestartAlt />
            }
            onClick={
              handleReset
            }
            disabled={loading}
          >
            Reset
          </Button>
        </Box>

        {/*================================================
            Filter Fields
        =================================================*/}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* Order Status */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Order Status
            </InputLabel>

            <Select
              label="Order Status"
              value={
                localFilters.status
              }
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "status",
                  event.target
                    .value
                )
              }
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>

              {normalizedStatuses.map(
                (status, index) => {
                  const value =
                    typeof status ===
                    "object"
                      ? status.value ??
                        status.id ??
                        status.code ??
                        ""
                      : status;

                  const label =
                    typeof status ===
                    "object"
                      ? status.label ??
                        status.name ??
                        status.value ??
                        ""
                      : status;

                  return (
                    <MenuItem
                      key={
                        value ||
                        index
                      }
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>

          {/* Channel */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Channel
            </InputLabel>

            <Select
              label="Channel"
              value={
                localFilters.channel
              }
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "channel",
                  event.target
                    .value
                )
              }
            >
              <MenuItem value="">
                All Channels
              </MenuItem>

              {normalizedChannels.map(
                (channel, index) => {
                  const value =
                    typeof channel ===
                    "object"
                      ? channel.value ??
                        channel.id ??
                        channel.code ??
                        ""
                      : channel;

                  const label =
                    typeof channel ===
                    "object"
                      ? channel.label ??
                        channel.name ??
                        channel.value ??
                        ""
                      : channel;

                  return (
                    <MenuItem
                      key={
                        value ||
                        index
                      }
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>

          {/* Payment Status */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Payment Status
            </InputLabel>

            <Select
              label="Payment Status"
              value={
                localFilters.paymentStatus
              }
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "paymentStatus",
                  event.target
                    .value
                )
              }
            >
              <MenuItem value="">
                All Payment Statuses
              </MenuItem>

              <MenuItem value="Paid">
                Paid
              </MenuItem>

              <MenuItem value="Pending">
                Pending
              </MenuItem>

              <MenuItem value="Failed">
                Failed
              </MenuItem>

              <MenuItem value="Refunded">
                Refunded
              </MenuItem>

              <MenuItem value="Partially Paid">
                Partially Paid
              </MenuItem>
            </Select>
          </FormControl>

          {/* Fulfillment Status */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Fulfillment Status
            </InputLabel>

            <Select
              label="Fulfillment Status"
              value={
                localFilters.fulfillmentStatus
              }
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "fulfillmentStatus",
                  event.target
                    .value
                )
              }
            >
              <MenuItem value="">
                All Fulfillment Statuses
              </MenuItem>

              <MenuItem value="Pending">
                Pending
              </MenuItem>

              <MenuItem value="Processing">
                Processing
              </MenuItem>

              <MenuItem value="Packed">
                Packed
              </MenuItem>

              <MenuItem value="Shipped">
                Shipped
              </MenuItem>

              <MenuItem value="Delivered">
                Delivered
              </MenuItem>

              <MenuItem value="Cancelled">
                Cancelled
              </MenuItem>
            </Select>
          </FormControl>

          {/* Date From */}

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date From"
            value={
              localFilters.dateFrom
            }
            disabled={loading}
            onChange={(event) =>
              handleChange(
                "dateFrom",
                event.target
                  .value
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Date To */}

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date To"
            value={
              localFilters.dateTo
            }
            disabled={loading}
            onChange={(event) =>
              handleChange(
                "dateTo",
                event.target
                  .value
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Minimum Amount */}

          <TextField
            fullWidth
            size="small"
            type="number"
            label="Minimum Amount"
            value={
              localFilters.minAmount
            }
            disabled={loading}
            onChange={(event) =>
              handleChange(
                "minAmount",
                event.target
                  .value
              )
            }
            inputProps={{
              min: 0,
              step: "0.01",
            }}
          />

          {/* Maximum Amount */}

          <TextField
            fullWidth
            size="small"
            type="number"
            label="Maximum Amount"
            value={
              localFilters.maxAmount
            }
            disabled={loading}
            onChange={(event) =>
              handleChange(
                "maxAmount",
                event.target
                  .value
              )
            }
            inputProps={{
              min: 0,
              step: "0.01",
            }}
          />
        </Box>

        {/*================================================
            Apply Button
        =================================================*/}

        <Box
          sx={{
            display: "flex",
            justifyContent: {
              xs: "stretch",
              sm: "flex-end",
            },
          }}
        >
          <Button
            variant="contained"
            startIcon={
              <FilterAlt />
            }
            onClick={
              handleApply
            }
            disabled={loading}
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 180,
              },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

OrderReportFilter.propTypes = {
  filters:
    PropTypes.object,

  statuses:
    PropTypes.array,

  channels:
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

OrderReportFilter.defaultProps = {
  filters: {},

  statuses: [],

  channels: [],

  loading: false,

  onApply: () => {},

  onReset: () => {},
};

//======================================================
// Export
//======================================================

export default OrderReportFilter;



