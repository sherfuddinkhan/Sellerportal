import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import MarketplaceReportCard from "./MarketplaceReportCard";

//======================================================
// MarketplaceReportList
//======================================================

const MarketplaceReportList = ({
  reports = [],
  loading = false,
  error = "",
  onView,
  onEdit,
  emptyMessage = "No marketplace reports found.",
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
  // Handle Card Click
  //====================================================

  const handleView =
    useCallback(
      (report) => {
        if (
          typeof onView ===
          "function"
        ) {
          onView(report);
        }
      },
      [onView]
    );

  //====================================================
  // Loading Skeleton Count
  //====================================================

  const skeletonCount = 6;

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="marketplace-report-list"
      sx={{
        width: "100%",
      }}
    >
      {/*================================================
          Error
      =================================================*/}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/*================================================
          Loading State
      =================================================*/}

      {loading ? (
        <Grid
          container
          spacing={2}
        >
          {Array.from({
            length: skeletonCount,
          }).map((_, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={`loading-${index}`}
            >
              <MarketplaceReportCard
                report={{}}
                compact
              />

              <Box
                sx={{
                  position: "relative",
                  mt: -8,
                  height: 128,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <CircularProgress
                  size={24}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : safeReports.length === 0 ? (
        /*================================================
            Empty State
        =================================================*/

        <Stack
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 8,
            px: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
          >
            No Marketplace Reports
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            {emptyMessage}
          </Typography>
        </Stack>
      ) : (
        /*================================================
            Report Cards
        =================================================*/

        <Grid
          container
          spacing={2}
        >
          {safeReports.map(
            (report, index) => {
              const reportId =
                report?.id ??
                report?.reportId ??
                report?.orderId ??
                report?.orderNumber ??
                index;

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={reportId}
                >
                  <MarketplaceReportCard
                    report={report}
                    onClick={
                      handleView
                    }
                  />
                </Grid>
              );
            }
          )}
        </Grid>
      )}
    </Box>
  );

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

MarketplaceReportList.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  loading: PropTypes.bool,

  error: PropTypes.string,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  emptyMessage: PropTypes.string,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportList.defaultProps = {
  reports: [],

  loading: false,

  error: "",

  onView: () => {},

  onEdit: () => {},

  emptyMessage:
    "No marketplace reports found.",
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportList;