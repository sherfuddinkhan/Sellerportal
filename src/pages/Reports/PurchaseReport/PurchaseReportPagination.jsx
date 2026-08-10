import React, {
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  FirstPage,
  LastPage,
} from "@mui/icons-material";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// PurchaseReportPagination
//======================================================

const PurchaseReportPagination = ({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 0,
  loading = false,
  pageSizeOptions = [
    10,
    25,
    50,
    100,
  ],
  onPageChange,
  onPageSizeChange,
}) => {
  //====================================================
  // Safe Values
  //====================================================

  const safePage =
    Math.max(
      1,
      Number(page) || 1
    );

  const safePageSize =
    Math.max(
      1,
      Number(pageSize) || 10
    );

  const safeTotalRecords =
    Math.max(
      0,
      Number(totalRecords) || 0
    );

  const safeTotalPages =
    Math.max(
      0,
      Number(totalPages) || 0
    );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback(
      (_event, newPage) => {
        if (loading) {
          return;
        }

        if (
          newPage === safePage
        ) {
          return;
        }

        onPageChange?.(newPage);
      },
      [
        loading,
        safePage,
        onPageChange,
      ]
    );

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        if (loading) {
          return;
        }

        const newPageSize =
          Number(
            event.target.value
          );

        if (
          !newPageSize ||
          newPageSize ===
            safePageSize
        ) {
          return;
        }

        onPageSizeChange?.(
          newPageSize
        );
      },
      [
        loading,
        safePageSize,
        onPageSizeChange,
      ]
    );

  //====================================================
  // Range
  //====================================================

  const startRecord =
    safeTotalRecords === 0
      ? 0
      : (safePage - 1) *
          safePageSize +
        1;

  const endRecord =
    Math.min(
      safePage *
        safePageSize,
      safeTotalRecords
    );

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="purchase-report-pagination"
      variant="outlined"
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          sm: 2,
        },
        borderRadius: 2,
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
        >
          {safeTotalRecords === 0
            ? "No records"
            : `Showing ${startRecord}–${endRecord} of ${safeTotalRecords} records`}
        </Typography>

        {/*==============================================
            Pagination Controls
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          {safeTotalPages > 1 && (
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
              }}
            >
              <FirstPage
                fontSize="small"
                sx={{
                  color: loading
                    ? "text.disabled"
                    : "text.secondary",
                }}
              />
            </Box>
          )}

          <Pagination
            count={safeTotalPages}
            page={
              safeTotalPages > 0
                ? Math.min(
                    safePage,
                    safeTotalPages
                  )
                : 1
            }
            onChange={
              handlePageChange
            }
            disabled={loading}
            color="primary"
            shape="rounded"
            size="small"
            showFirstButton
            showLastButton
          />

          {safeTotalPages > 1 && (
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
              }}
            >
              <LastPage
                fontSize="small"
                sx={{
                  color: loading
                    ? "text.disabled"
                    : "text.secondary",
                }}
              />
            </Box>
          )}
        </Stack>

        {/*==============================================
            Page Size
        ==============================================*/}

        <FormControl
          size="small"
          sx={{
            minWidth: 120,
          }}
        >
          <InputLabel>
            Per Page
          </InputLabel>

          <Select
            value={safePageSize}
            label="Per Page"
            onChange={
              handlePageSizeChange
            }
            disabled={loading}
          >
            {pageSizeOptions.map(
              (option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option} / page
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportPagination.propTypes = {
  page:
    PropTypes.number,

  pageSize:
    PropTypes.number,

  totalRecords:
    PropTypes.number,

  totalPages:
    PropTypes.number,

  loading:
    PropTypes.bool,

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

PurchaseReportPagination.defaultProps = {
  page: 1,

  pageSize: 10,

  totalRecords: 0,

  totalPages: 0,

  loading: false,

  pageSizeOptions: [
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

export default PurchaseReportPagination;


