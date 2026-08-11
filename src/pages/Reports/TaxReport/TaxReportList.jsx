import React from "react";
import {Box,Typography} from "@mui/material";
import TaxReportTable from "./TaxReportTable";
//======================================================
// TaxReportList
//======================================================
const TaxReportList = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortField = "date",
  sortDirection = "desc",
}) => {
  //====================================================
  // Safe Report List
  //====================================================
  const reportList = Array.isArray(reports) ? reports : [];
  //====================================================
  // Empty State
  //====================================================
  if (!loading && reportList.length === 0) {
    return (
      <Box
        className="tax-report__empty"
        sx={{
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
          >
            No Tax Reports Found
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No tax records match the
            current search or filter
            criteria.
          </Typography>
        </Box>
      </Box>
    );
  }
  //====================================================
  // Render
  //====================================================
  return (
    <Box
      className="tax-report__list"
      sx={{
        width: "100%",
      }}
    >
      <TaxReportTable
        reports={reportList}
        loading={loading}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onSort={onSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportList;

//======================================================
// Part 1A Ends Here
//======================================================