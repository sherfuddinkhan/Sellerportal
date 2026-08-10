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

import PurchaseReportCard from "./PurchaseReportCard";
import PurchaseReportTable from "./PurchaseReportTable";

//======================================================
// PurchaseReportList
//======================================================

const PurchaseReportList = ({
  reports = [],
  loading = false,
  viewMode = "table",
  sortField = "date",
  sortDirection = "desc",
  onSort,
  onView,
  onEdit,
  onDelete,
  onRefresh,
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
  // Empty State
  //====================================================

  const isEmpty =
    !loading &&
    safeReports.length === 0;

  //====================================================
  // View Mode
  //====================================================

  const normalizedViewMode =
    viewMode === "card"
      ? "card"
      : "table";
  //====================================================
  // Render
  //====================================================

  if (isEmpty) {
    return (
      <Paper
        className="purchase-report-list"
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Box
          className="purchase-report-list-empty"
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={1}
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight={700}
            >
              No Purchase Reports
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No purchase records match
              the current search and
              filter criteria.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    );
  }

  return (
    <Box
      className="purchase-report-list"
      sx={{
        width: "100%",
      }}
    >
      {normalizedViewMode ===
      "card" ? (
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
                key={
                  report?.id ??
                  report?.reportId ??
                  report?.purchaseReportId ??
                  report?.orderNumber ??
                  index
                }
              >
                <PurchaseReportCard
                  report={report}
                  onView={onView}
                  onEdit={onEdit}
                  compact={false}
                />
              </Grid>
            )
          )}
        </Grid>
      ) : (
        <PurchaseReportTable
          reports={safeReports}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onRefresh={onRefresh}
        />
      )}
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportList.propTypes = {
  reports:
    PropTypes.array,

  loading:
    PropTypes.bool,

  viewMode:
    PropTypes.oneOf([
      "table",
      "card",
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

  onRefresh:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

PurchaseReportList.defaultProps = {
  reports: [],

  loading: false,

  viewMode: "table",

  sortField: "date",

  sortDirection: "desc",

  onSort: () => {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onRefresh: () => {},
};

//======================================================
// Export
//======================================================

export default PurchaseReportList;
