//======================================================
// SuppliesReportList.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Alert,
  Box,
  Grid,
  Typography,
} from "@mui/material";

import SuppliesReportCard from "./SuppliesReportCard";

//======================================================
// SuppliesReportList
//======================================================

const SuppliesReportList = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onSort,
  sortField,
  sortDirection,
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const reportList =
    Array.isArray(reports)
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
        className="supplies-report__empty"
        sx={{
          width: "100%",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          color="text.secondary"
        >
          No supplies reports found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          Try changing the search criteria
          or filters.
        </Typography>
      </Box>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="supplies-report__list"
      sx={{
        width: "100%",
      }}
    >
      {/*==============================================
          Report Count
      ===============================================*/}

      {!loading && (
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing{" "}
            <strong>
              {reportList.length}
            </strong>{" "}
            supplies report
            {reportList.length !== 1
              ? "s"
              : ""}
          </Typography>
        </Box>
      )}

      {/*==============================================
          Loading State
      ===============================================*/}

      {loading &&
        reportList.length === 0 && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
            }}
          >
            Loading supplies reports...
          </Alert>
        )}

      {/*==============================================
          Report Cards
      ===============================================*/}

      <Grid
        container
        spacing={2}
      >
        {reportList.map(
          (
            report,
            index
          ) => {
            const reportId =
              report?.id ??
              report?.reportId ??
              report?.supplyId ??
              index;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={3}
                key={
                  reportId
                }
              >
                <SuppliesReportCard
                  report={
                    report
                  }
                  loading={
                    loading
                  }
                  onView={
                    onView
                  }
                  onEdit={
                    onEdit
                  }
                />
              </Grid>
            );
          }
        )}
      </Grid>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportList;

//======================================================
// Part 1A Ends Here
//======================================================