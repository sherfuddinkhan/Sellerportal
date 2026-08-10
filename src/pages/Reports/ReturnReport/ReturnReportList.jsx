import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ReturnReportCard from "./ReturnReportCard";
import ReturnReportTable from "./ReturnReportTable";

//======================================================
// ReturnReportList
//======================================================

const ReturnReportList = ({
  reports = [],
  loading = false,
  viewMode = "table",
  sortField = "date",
  sortDirection = "desc",
  onSort,
  onView,
  onEdit,
  onDelete,
}) => {
  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(() => {
    return Array.isArray(reports)
      ? reports
      : [];
  }, [reports]);

  //====================================================
  // Card Click Handler
  //====================================================

  const handleCardClick =
    useCallback(
      (report) => {
        if (onView) {
          onView(report);
        }
      },
      [onView]
    );

  //====================================================
  // Empty State
  //====================================================

  if (
    !loading &&
    safeReports.length === 0
  ) {
    return (
      <Box
        className="return-report-empty"
        sx={{
          width: "100%",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
        >
          No Return Reports
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          No return records are available
          for the current selection.
        </Typography>
      </Box>
    );
  }

  //====================================================
  // Loading State
  //====================================================

  if (loading && safeReports.length === 0) {
    return (
      <Box
        className="return-report-loading"
        sx={{
          width: "100%",
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
        >
          <CircularProgress />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Loading return reports...
          </Typography>
        </Stack>
      </Box>
    );
  }
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="return-report-list"
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      {/*==============================================
          Loading Overlay
      ==============================================*/}

      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pt: 3,
            pointerEvents: "none",
            backgroundColor:
              "rgba(255,255,255,0.35)",
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}

      {/*==============================================
          Table View
      ==============================================*/}

      {viewMode === "table" ? (
        <ReturnReportTable
          reports={safeReports}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        /*============================================
            Card View
        ============================================*/

        <Grid
          container
          spacing={2}
          className="return-report-card-grid"
        >
          {safeReports.map(
            (report, index) => {
              const reportId =
                report?.id ??
                report?.reportId ??
                report?.returnId ??
                `return-${index}`;

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={String(reportId)}
                >
                  <ReturnReportCard
                    report={report}
                    loading={loading}
                    onClick={
                      handleCardClick
                    }
                  />
                </Grid>
              );
            }
          )}
        </Grid>
      )}

      {/*==============================================
          Result Count
      ==============================================*/}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 1.5,
          px: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Showing{" "}
          <strong>
            {safeReports.length}
          </strong>{" "}
          return{" "}
          {safeReports.length === 1
            ? "record"
            : "records"}
        </Typography>
      </Box>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportList.propTypes = {
  reports:
    PropTypes.array,

  loading:
    PropTypes.bool,

  viewMode:
    PropTypes.oneOf([
      "table",
      "card",
      "grid",
    ]),

  sortField:
    PropTypes.string,

  sortDirection:
    PropTypes.oneOf([
      "asc",
      "desc",
    ]),

  onSort:
    PropTypes.func,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ReturnReportList.defaultProps = {
  reports: [],

  loading: false,

  viewMode: "table",

  sortField: "date",

  sortDirection: "desc",

  onSort: () => {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default ReturnReportList;


