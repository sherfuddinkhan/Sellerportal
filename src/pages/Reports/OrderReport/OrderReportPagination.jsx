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

//======================================================
// OrderReportPagination
//======================================================

const OrderReportPagination = ({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 1,
  pageSizeOptions = [10, 25, 50, 100],
  loading = false,
  onPageChange,
  onPageSizeChange,
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

  const safeTotalRecords = Math.max(
    0,
    Number(totalRecords) || 0
  );

  const safeTotalPages = Math.max(
    1,
    Number(totalPages) || 1
  );

  //====================================================
  // Display Range
  //====================================================

  const range = useMemo(() => {
    if (safeTotalRecords === 0) {
      return {
        start: 0,
        end: 0,
      };
    }

    const start =
      (safePage - 1) *
        safePageSize +
      1;

    const end = Math.min(
      safePage * safePageSize,
      safeTotalRecords
    );

    return {
      start,
      end,
    };
  }, [
    safePage,
    safePageSize,
    safeTotalRecords,
  ]);

  //====================================================
  // Previous Page
  //====================================================

  const handlePrevious = useCallback(() => {
    if (
      safePage <= 1 ||
      loading
    ) {
      return;
    }

    if (
      typeof onPageChange ===
      "function"
    ) {
      onPageChange(
        safePage - 1
      );
    }
  }, [
    safePage,
    loading,
    onPageChange,
  ]);

  //====================================================
  // Next Page
  //====================================================

  const handleNext = useCallback(() => {
    if (
      safePage >=
        safeTotalPages ||
      loading
    ) {
      return;
    }

    if (
      typeof onPageChange ===
      "function"
    ) {
      onPageChange(
        safePage + 1
      );
    }
  }, [
    safePage,
    safeTotalPages,
    loading,
    onPageChange,
  ]);

  //====================================================
  // First Page
  //====================================================

  const handleFirst = useCallback(() => {
    if (
      safePage <= 1 ||
      loading
    ) {
      return;
    }

    if (
      typeof onPageChange ===
      "function"
    ) {
      onPageChange(1);
    }
  }, [
    safePage,
    loading,
    onPageChange,
  ]);

  //====================================================
  // Last Page
  //====================================================

  const handleLast = useCallback(() => {
    if (
      safePage >=
        safeTotalPages ||
      loading
    ) {
      return;
    }

    if (
      typeof onPageChange ===
      "function"
    ) {
      onPageChange(
        safeTotalPages
      );
    }
  }, [
    safePage,
    safeTotalPages,
    loading,
    onPageChange,
  ]);

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        const nextSize =
          Number(
            event.target.value
          ) || 10;

        if (
          typeof onPageSizeChange ===
          "function"
        ) {
          onPageSizeChange(
            nextSize
          );
        }
      },
      [onPageSizeChange]
    );
  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="order-report-pagination"
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        p: {
          xs: 1.5,
          sm: 2,
        },
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
        {/*================================================
            Records Information
        =================================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Showing{" "}
          <strong>
            {range.start}
          </strong>{" "}
          to{" "}
          <strong>
            {range.end}
          </strong>{" "}
          of{" "}
          <strong>
            {safeTotalRecords}
          </strong>{" "}
          orders
        </Typography>

        {/*================================================
            Pagination Controls
        =================================================*/}

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent="center"
        >
          <button
            type="button"
            onClick={
              handleFirst
            }
            disabled={
              loading ||
              safePage <= 1
            }
            aria-label="First page"
            style={{
              border: "1px solid",
              borderColor:
                "rgba(0,0,0,0.23)",
              background:
                "transparent",
              borderRadius: 4,
              padding:
                "6px 10px",
              cursor:
                loading ||
                safePage <= 1
                  ? "default"
                  : "pointer",
            }}
          >
            «
          </button>

          <button
            type="button"
            onClick={
              handlePrevious
            }
            disabled={
              loading ||
              safePage <= 1
            }
            aria-label="Previous page"
            style={{
              border: "1px solid",
              borderColor:
                "rgba(0,0,0,0.23)",
              background:
                "transparent",
              borderRadius: 4,
              padding:
                "6px 10px",
              cursor:
                loading ||
                safePage <= 1
                  ? "default"
                  : "pointer",
            }}
          >
            ‹
          </button>

          <Box
            sx={{
              minWidth: 80,
              textAlign: "center",
              px: 1,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
            >
              {safePage} /{" "}
              {safeTotalPages}
            </Typography>
          </Box>

          <button
            type="button"
            onClick={
              handleNext
            }
            disabled={
              loading ||
              safePage >=
                safeTotalPages
            }
            aria-label="Next page"
            style={{
              border: "1px solid",
              borderColor:
                "rgba(0,0,0,0.23)",
              background:
                "transparent",
              borderRadius: 4,
              padding:
                "6px 10px",
              cursor:
                loading ||
                safePage >=
                  safeTotalPages
                  ? "default"
                  : "pointer",
            }}
          >
            ›
          </button>

          <button
            type="button"
            onClick={
              handleLast
            }
            disabled={
              loading ||
              safePage >=
                safeTotalPages
            }
            aria-label="Last page"
            style={{
              border: "1px solid",
              borderColor:
                "rgba(0,0,0,0.23)",
              background:
                "transparent",
              borderRadius: 4,
              padding:
                "6px 10px",
              cursor:
                loading ||
                safePage >=
                  safeTotalPages
                  ? "default"
                  : "pointer",
            }}
          >
            »
          </button>
        </Stack>

        {/*================================================
            Page Size
        =================================================*/}

        <FormControl
          size="small"
          sx={{
            minWidth: 140,
          }}
        >
          <InputLabel>
            Rows per page
          </InputLabel>

          <Select
            value={
              pageSizeOptions.includes(
                safePageSize
              )
                ? safePageSize
                : pageSizeOptions[0]
            }
            label="Rows per page"
            disabled={loading}
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
                  {size}
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

OrderReportPagination.propTypes = {
  page:
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

  pageSize:
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

  totalRecords:
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

  totalPages:
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

  pageSizeOptions:
    PropTypes.arrayOf(
      PropTypes.number
    ),

  loading:
    PropTypes.bool,

  onPageChange:
    PropTypes.func,

  onPageSizeChange:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

OrderReportPagination.defaultProps = {
  page: 1,

  pageSize: 10,

  totalRecords: 0,

  totalPages: 1,

  pageSizeOptions: [
    10,
    25,
    50,
    100,
  ],

  loading: false,

  onPageChange: () => {},

  onPageSizeChange: () => {},
};

//======================================================
// Export
//======================================================

export default OrderReportPagination;



