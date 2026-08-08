import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// DashboardReportPagination
//======================================================

const DashboardReportPagination = ({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 1,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}) => {

  //====================================================
  // Safe Values
  //====================================================

  const safePage =
    Math.max(
      1,
      Math.min(
        Number(page) || 1,
        Number(totalPages) || 1
      )
    );

  const safePageSize =
    Number(pageSize) > 0
      ? Number(pageSize)
      : 10;

  const safeTotalRecords =
    Math.max(
      0,
      Number(totalRecords) || 0
    );

  const safeTotalPages =
    Math.max(
      1,
      Number(totalPages) || 1
    );

  //====================================================
  // Record Range
  //====================================================

  const startRecord =
    safeTotalRecords === 0
      ? 0
      : (safePage - 1) *
          safePageSize +
        1;

  const endRecord =
    Math.min(
      safePage * safePageSize,
      safeTotalRecords
    );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = (
    event,
    newPage
  ) => {

    if (
      typeof onPageChange ===
      "function"
    ) {
      onPageChange(newPage);
    }
  };

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange = (
    event
  ) => {

    const newSize =
      Number(event.target.value);

    if (
      !Number.isFinite(newSize) ||
      newSize <= 0
    ) {
      return;
    }

    if (
      typeof onPageSizeChange ===
      "function"
    ) {
      onPageSizeChange(newSize);
    }
  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="dashboard-report-pagination"
      sx={{
        width: "100%",
        py: 1.5,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        justifyContent="space-between"
      >

        {/*==============================================
            Record Information
        ==============================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: {
              xs: "center",
              sm: "left",
            },
            whiteSpace: "nowrap",
          }}
        >
          {safeTotalRecords === 0
            ? "No records"
            : `Showing ${startRecord}-${endRecord} of ${safeTotalRecords} records`}
        </Typography>

        {/*==============================================
            Pagination Controls
        ==============================================*/}

        <Pagination
          count={safeTotalPages}
          page={safePage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="medium"
          showFirstButton
          showLastButton
          disabled={
            safeTotalRecords === 0
          }
        />

        {/*==============================================
            Page Size Selector
        ==============================================*/}

        <FormControl
          size="small"
          sx={{
            minWidth: 120,
            alignSelf: {
              xs: "center",
              sm: "auto",
            },
          }}
        >
          <InputLabel id="dashboard-report-page-size-label">
            Rows
          </InputLabel>

          <Select
            labelId="dashboard-report-page-size-label"
            id="dashboard-report-page-size"
            value={safePageSize}
            label="Rows"
            onChange={
              handlePageSizeChange
            }
          >

            {pageSizeOptions.map(
              (size) => (
                <MenuItem
                  key={size}
                  value={size}
                >
                  {size} / page
                </MenuItem>
              )
            )}

          </Select>
        </FormControl>

      </Stack>
    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportPagination.propTypes = {
  page: PropTypes.number,

  pageSize: PropTypes.number,

  totalRecords: PropTypes.number,

  totalPages: PropTypes.number,

  pageSizeOptions:
    PropTypes.arrayOf(
      PropTypes.number
    ),

  onPageChange:
    PropTypes.func,

  onPageSizeChange:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportPagination.defaultProps = {
  page: 1,

  pageSize: 10,

  totalRecords: 0,

  totalPages: 1,

  pageSizeOptions: [
    5,
    10,
    25,
    50,
    100,
  ],

  onPageChange: () => {},

  onPageSizeChange: () => {},
};

//======================================================
// Export
//======================================================

export default DashboardReportPagination;