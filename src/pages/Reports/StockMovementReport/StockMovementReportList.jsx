//======================================================
// StockMovementReportList.jsx
// Part 1A
//======================================================

import React from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  Typography,
} from "@mui/material";

import StockMovementReportTable from "./StockMovementReportTable";

//======================================================
// StockMovementReportList
//======================================================

const StockMovementReportList = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortConfig,
  emptyMessage = "No stock movement records found.",
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const reportList = Array.isArray(reports)
    ? reports
    : [];

  //====================================================
  // Empty State
  //====================================================

  if (
    !loading &&
    reportList.length === 0
  ) {
    return (
      <Box
        className="stock-movement-report__empty"
        sx={{
          width: "100%",
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 3,
          boxSizing: "border-box",
        }}
      >
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 600,
          }}
        >
          <Typography
            variant="body2"
          >
            {emptyMessage}
          </Typography>
        </Alert>
      </Box>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-movement-report__list"
      sx={{
        width: "100%",
      }}
    >
      <StockMovementReportTable
        reports={reportList}
        loading={loading}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onSort={onSort}
        sortConfig={sortConfig}
      />
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportList.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  loading: PropTypes.bool,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,

  onSort: PropTypes.func,

  sortConfig: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf([
      "asc",
      "desc",
    ]),
  }),

  emptyMessage: PropTypes.string,
};

//======================================================
// Default Props
//======================================================

StockMovementReportList.defaultProps = {
  reports: [],
  loading: false,
  onView: undefined,
  onEdit: undefined,
  onDelete: undefined,
  onSort: undefined,
  sortConfig: {
    field: "date",
    direction: "desc",
  },
  emptyMessage:
    "No stock movement records found.",
};

//======================================================
// Export
//======================================================

export default StockMovementReportList;

//======================================================
// Part 1A Ends Here
//======================================================