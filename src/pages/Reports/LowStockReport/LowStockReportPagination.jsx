import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import Pagination from "@mui/material/Pagination";

//======================================================
// LowStockReportPagination
//======================================================

const LowStockReportPagination = ({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  loading = false,
}) => {

  //====================================================
  // Safe Values
  //====================================================

  const safePage = Math.max(
    1,
    Number(page) || 1
  );

  const safePageSize = Math.max(
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
      1,
      Number(totalPages) || 1
    );

  //====================================================
  // Page Range
  //====================================================

  const range = useMemo(() => {
    if (
      safeTotalRecords === 0
    ) {
      return {
        from: 0,
        to: 0,
      };
    }

    const from =
      (safePage - 1) *
        safePageSize +
      1;

    const to = Math.min(
      safePage *
        safePageSize,
      safeTotalRecords
    );

    return {
      from,
      to,
    };
  }, [
    safePage,
    safePageSize,
    safeTotalRecords,
  ]);

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback(
      (_event, value) => {
        if (
          typeof onPageChange ===
          "function"
        ) {
          onPageChange(value);
        }
      },
      [onPageChange]
    );

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        const value =
          Number(
            event.target.value
          );

        if (
          !Number.isFinite(value) ||
          value <= 0
        ) {
          return;
        }

        if (
          typeof onPageSizeChange ===
          "function"
        ) {
          onPageSizeChange(value);
        }
      },
      [onPageSizeChange]
    );

  //====================================================
  // Page Size Options
  //====================================================

  const pageSizeOptions = [
    5,
    10,
    25,
    50,
    100,
  ];

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Paper
      className="low-stock-report-pagination"
      elevation={0}
      variant="outlined"
      sx={{
        mt: 2,
        p: 1.5,
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        justifyContent="space-between"
      >
        {/*================================================
            Records Information
        =================================================*/}

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {safeTotalRecords === 0
              ? "No records"
              : `Showing ${range.from}-${range.to} of ${safeTotalRecords} records`}
          </Typography>
        </Box>

        {/*================================================
            Pagination Controls
        =================================================*/}

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
          {/*==============================================
              Rows Per Page
          ==============================================*/}

          <FormControl
            size="small"
            sx={{
              minWidth: 120,
            }}
            disabled={loading}
          >
            <InputLabel>
              Rows
            </InputLabel>

            <Select
              value={
                safePageSize
              }
              label="Rows"
              onChange={
                handlePageSizeChange
              }
            >
              {pageSizeOptions.map(
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

          {/*==============================================
              Page Navigation
          ==============================================*/}

          <Pagination
            count={
              safeTotalPages
            }
            page={
              Math.min(
                safePage,
                safeTotalPages
              )
            }
            onChange={
              handlePageChange
            }
            color="primary"
            shape="rounded"
            size="small"
            disabled={
              loading ||
              safeTotalRecords === 0
            }
            showFirstButton
            showLastButton
          />
        </Stack>
      </Stack>
    </Paper>
  );

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

LowStockReportPagination.propTypes = {
  page: PropTypes.number,

  pageSize: PropTypes.number,

  totalRecords: PropTypes.number,

  totalPages: PropTypes.number,

  onPageChange: PropTypes.func,

  onPageSizeChange: PropTypes.func,

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

LowStockReportPagination.defaultProps = {
  page: 1,

  pageSize: 10,

  totalRecords: 0,

  totalPages: 1,

  onPageChange: () => {},

  onPageSizeChange: () => {},

  loading: false,
};

//======================================================
// Export
//======================================================
}
export default LowStockReportPagination;