//======================================================
// SuppliesReportPagination.jsx
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
// SuppliesReportPagination
//======================================================

const SuppliesReportPagination = ({
  count = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  disabled = false,
}) => {
  //====================================================
  // Total Pages
  //====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      Number(count || 0) /
        Number(rowsPerPage || 10)
    )
  );

  //====================================================
  // Current Page
  //
  // Parent View uses zero-based page indexes.
  // MUI Pagination uses one-based page numbers.
  //====================================================

  const currentPage =
    Math.min(
      Math.max(
        Number(page || 0) + 1,
        1
      ),
      totalPages
    );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = (
    event,
    nextPage
  ) => {
    if (
      typeof onPageChange !==
      "function"
    ) {
      return;
    }

    // Convert MUI's one-based page
    // back to the parent's zero-based page.
    onPageChange(
      event,
      nextPage - 1
    );
  };

  //====================================================
  // Rows Per Page Change
  //====================================================

  const handleRowsPerPageChange = (
    event
  ) => {
    if (
      typeof onRowsPerPageChange !==
      "function"
    ) {
      return;
    }

    onRowsPerPageChange(
      event
    );
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="supplies-report__pagination"
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
            Results Information
        ===============================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {count > 0
            ? `Showing ${
                Math.min(
                  page *
                    rowsPerPage +
                    1,
                  count
                )
              }–${Math.min(
                (page + 1) *
                  rowsPerPage,
                count
              )} of ${count}`
            : "No records"}
        </Typography>

        {/*==============================================
            Pagination Controls
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
            <InputLabel id="supplies-report-rows-per-page-label">
              Rows per page
            </InputLabel>

            <Select
              labelId="supplies-report-rows-per-page-label"
              value={
                Number(
                  rowsPerPage || 10
                )
              }
              label="Rows per page"
              onChange={
                handleRowsPerPageChange
              }
              disabled={
                disabled
              }
            >
              <MenuItem value={5}>
                5
              </MenuItem>

              <MenuItem value={10}>
                10
              </MenuItem>

              <MenuItem value={25}>
                25
              </MenuItem>

              <MenuItem value={50}>
                50
              </MenuItem>

              <MenuItem value={100}>
                100
              </MenuItem>
            </Select>
          </FormControl>

          {/*============================================
              Page Navigation
          =============================================*/}

          <Pagination
            count={
              totalPages
            }
            page={
              currentPage
            }
            onChange={
              handlePageChange
            }
            color="primary"
            variant="outlined"
            shape="rounded"
            size="small"
            showFirstButton
            showLastButton
            disabled={
              disabled ||
              count === 0
            }
          />
        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportPagination;

//======================================================
// Part 1A Ends Here
//======================================================