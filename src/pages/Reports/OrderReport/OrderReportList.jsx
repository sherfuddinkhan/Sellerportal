import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import OrderReportCard from "./OrderReportCard";

//======================================================
// OrderReportList
//======================================================

const OrderReportList = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSelect,
  emptyMessage = "No order reports found.",
}) => {
  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Handle Selection
  //====================================================

  const handleSelect =
    (report) => {
      if (
        typeof onSelect ===
        "function"
      ) {
        onSelect(report);
      }
    };

  //====================================================
  // Handle View
  //====================================================

  const handleView =
    (report) => {
      if (
        typeof onView ===
        "function"
      ) {
        onView(report);
      }
    };

  //====================================================
  // Handle Edit
  //====================================================

  const handleEdit =
    (report) => {
      if (
        typeof onEdit ===
        "function"
      ) {
        onEdit(report);
      }
    };

  //====================================================
  // Handle Delete
  //====================================================

  const handleDelete =
    (report) => {
      if (
        typeof onDelete ===
        "function"
      ) {
        onDelete(report);
      }
    };

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Grid
        container
        spacing={2}
      >
        {[1, 2, 3, 4].map(
          (item) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              key={item}
            >
              <Paper
                variant="outlined"
                sx={{
                  minHeight: 300,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  spacing={2}
                >
                  <Box
                    sx={{
                      height: 24,
                      width: "60%",
                      bgcolor:
                        "action.hover",
                      borderRadius: 1,
                    }}
                  />

                  <Box
                    sx={{
                      height: 18,
                      width: "80%",
                      bgcolor:
                        "action.hover",
                      borderRadius: 1,
                    }}
                  />

                  <Box
                    sx={{
                      height: 18,
                      width: "70%",
                      bgcolor:
                        "action.hover",
                      borderRadius: 1,
                    }}
                  />

                  <Box
                    sx={{
                      height: 18,
                      width: "50%",
                      bgcolor:
                        "action.hover",
                      borderRadius: 1,
                    }}
                  />

                  <Box
                    sx={{
                      height: 40,
                      width: "100%",
                      bgcolor:
                        "action.hover",
                      borderRadius: 1,
                    }}
                  />
                </Stack>
              </Paper>
            </Grid>
          )
        )}
      </Grid>
    );
  }

  //====================================================
  // Empty State
  //====================================================

  if (
    safeReports.length === 0
  ) {
    return (
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: 220,
          borderRadius: 2,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          p: 3,
        }}
      >
        <Stack
          spacing={1}
          alignItems="center"
          textAlign="center"
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            No Order Reports
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {emptyMessage}
          </Typography>
        </Stack>
      </Paper>
    );
  }

  //====================================================
  // Part 1A Ends Here
  //====================================================
  //====================================================
  // Render Report Cards
  //====================================================

  return (
    <Box
      className="order-report-list"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {safeReports.map(
          (report, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              key={
                report?.id ??
                report?.orderId ??
                report?.reportId ??
                index
              }
            >
              <OrderReportCard
                order={report}
                loading={loading}
                onClick={() =>
                  handleSelect(
                    report
                  )
                }
                onView={() =>
                  handleView(
                    report
                  )
                }
              />
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

OrderReportList.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  loading:
    PropTypes.bool,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,

  onSelect:
    PropTypes.func,

  emptyMessage:
    PropTypes.string,
};

//======================================================
// Default Props
//======================================================

OrderReportList.defaultProps = {
  reports: [],

  loading: false,

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onSelect: () => {},

  emptyMessage:
    "No order reports found.",
};

//======================================================
// Export
//======================================================
export default OrderReportList;
