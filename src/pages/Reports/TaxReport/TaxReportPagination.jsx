//======================================================
// TaxReportPagination.jsx
// Part 1A
//======================================================

import React from "react";

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
// TaxReportPagination
//======================================================

const TaxReportPagination = ({
  count = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  disabled = false,
  rowsPerPageOptions = [
    10,
    25,
    50,
    100,
  ],
}) => {
  //====================================================
  // Safe Values
  //====================================================

  const totalCount =
    Number(count) > 0
      ? Number(count)
      : 0;

  const currentRowsPerPage =
    Number(rowsPerPage) > 0
      ? Number(rowsPerPage)
      : 10;

  const currentPage =
    Number(page) >= 0
      ? Number(page)
      : 0;

  //====================================================
  // Total Pages
  //====================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
          currentRowsPerPage
      )
    );

  //====================================================
  // Display Range
  //====================================================

  const startItem =
    totalCount === 0
      ? 0
      : currentPage *
          currentRowsPerPage +
        1;

  const endItem =
    totalCount === 0
      ? 0
      : Math.min(
          (currentPage + 1) *
            currentRowsPerPage,
          totalCount
        );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = (
    event,
    nextPage
  ) => {
    if (
      disabled
    ) {
      return;
    }

    if (
      typeof onPageChange ===
      "function"
    ) {
      // MUI Pagination is 1-based.
      // The View uses a 0-based page.
      onPageChange(
        event,
        nextPage - 1
      );
    }
  };

  //====================================================
  // Rows Per Page Change
  //====================================================

  const handleRowsPerPageChange =
    (event) => {
      if (
        disabled
      ) {
        return;
      }

      if (
        typeof onRowsPerPageChange ===
        "function"
      ) {
        onRowsPerPageChange(
          event
        );
      }
    };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="tax-report__pagination"
      sx={{
        width: "100%",
        py: 1,
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
            Records Information
        ===============================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace:
              "nowrap",
          }}
        >
          {totalCount === 0
            ? "No records"
            : `Showing ${startItem}-${endItem} of ${totalCount} records`}
        </Typography>

        {/*==============================================
            Controls
        ===============================================*/}

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
        >

          {/*============================================
              Rows Per Page
          =============================================*/}

          <FormControl
            size="small"
            sx={{
              minWidth: 130,
            }}
          >
            <InputLabel>
              Rows per page
            </InputLabel>

            <Select
              label="Rows per page"
              value={
                currentRowsPerPage
              }
              onChange={
                handleRowsPerPageChange
              }
              disabled={
                disabled ||
                totalCount === 0
              }
            >
              {rowsPerPageOptions.map(
                (option) => (
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    {option}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/*============================================
              Pagination
          =============================================*/}

          <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            count={
              totalPages
            }
            page={
              Math.min(
                currentPage + 1,
                totalPages
              )
            }
            onChange={
              handlePageChange
            }
            disabled={
              disabled ||
              totalCount === 0
            }
            showFirstButton
            showLastButton
          />

        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportPagination;

//======================================================
// Part 1A Ends Here
//======================================================