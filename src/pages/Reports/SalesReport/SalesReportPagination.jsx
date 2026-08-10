//======================================================
// SalesReportPagination.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";

import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// SalesReportPagination
//======================================================

const SalesReportPagination = ({
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

  const safeTotalRecords = Math.max(
    0,
    Number(totalRecords) || 0
  );

  const safePageSize = Math.max(
    1,
    Number(pageSize) || 10
  );

  //====================================================
  // Calculate Total Pages
  //====================================================

  const calculatedTotalPages =
    useMemo(() => {
      if (
        Number(totalPages) > 0
      ) {
        return Number(
          totalPages
        );
      }

      if (
        safeTotalRecords === 0
      ) {
        return 0;
      }

      return Math.ceil(
        safeTotalRecords /
          safePageSize
      );
    }, [
      totalPages,
      safeTotalRecords,
      safePageSize,
    ]);

  //====================================================
  // Current Page
  //====================================================

  const safePage = Math.min(
    Math.max(
      1,
      Number(page) || 1
    ),
    Math.max(
      1,
      calculatedTotalPages
    )
  );

  //====================================================
  // Record Range
  //====================================================

  const range = useMemo(() => {
    if (
      safeTotalRecords === 0
    ) {
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
      safePage *
        safePageSize,
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
  // Page Change Handler
  //====================================================

  const changePage = useCallback(
    (nextPage) => {
      if (
        loading ||
        typeof onPageChange !==
          "function"
      ) {
        return;
      }

      const targetPage =
        Math.min(
          Math.max(
            1,
            Number(nextPage) || 1
          ),
          Math.max(
            1,
            calculatedTotalPages
          )
        );

      if (
        targetPage !== safePage
      ) {
        onPageChange(
          targetPage
        );
      }
    },
    [
      loading,
      onPageChange,
      calculatedTotalPages,
      safePage,
    ]
  );

  //====================================================
  // First Page
  //====================================================

  const handleFirstPage =
    useCallback(() => {
      changePage(1);
    }, [changePage]);

  //====================================================
  // Previous Page
  //====================================================

  const handlePreviousPage =
    useCallback(() => {
      changePage(
        safePage - 1
      );
    }, [
      changePage,
      safePage,
    ]);

  //====================================================
  // Next Page
  //====================================================

  const handleNextPage =
    useCallback(() => {
      changePage(
        safePage + 1
      );
    }, [
      changePage,
      safePage,
    ]);

  //====================================================
  // Last Page
  //====================================================

  const handleLastPage =
    useCallback(() => {
      changePage(
        calculatedTotalPages
      );
    }, [
      changePage,
      calculatedTotalPages,
    ]);

  //====================================================
  // Page Size Handler
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        if (
          loading ||
          typeof onPageSizeChange !==
            "function"
        ) {
          return;
        }

        const nextPageSize =
          Math.max(
            1,
            Number(
              event.target.value
            ) || 10
          );

        onPageSizeChange(
          nextPageSize
        );
      },
      [
        loading,
        onPageSizeChange,
      ]
    );
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="sales-report-pagination"
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
        ==============================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {safeTotalRecords === 0
            ? "No records"
            : `Showing ${range.start}-${range.end} of ${safeTotalRecords} records`}
        </Typography>

        {/*==============================================
            Pagination Controls
        ==============================================*/}

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent="center"
        >
          {/*============================================
              Page Size
          =============================================*/}

          <FormControl
            size="small"
            sx={{
              minWidth: 110,
            }}
          >
            <InputLabel>
              Rows
            </InputLabel>

            <Select
              value={safePageSize}
              label="Rows"
              onChange={
                handlePageSizeChange
              }
              disabled={
                loading
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

          {/*============================================
              First Page
          =============================================*/}

          <IconButton
            size="small"
            onClick={
              handleFirstPage
            }
            disabled={
              loading ||
              safePage <= 1 ||
              calculatedTotalPages <=
                1
            }
            aria-label="First page"
          >
            <FirstPage />
          </IconButton>

          {/*============================================
              Previous Page
          =============================================*/}

          <IconButton
            size="small"
            onClick={
              handlePreviousPage
            }
            disabled={
              loading ||
              safePage <= 1
            }
            aria-label="Previous page"
          >
            <ChevronLeft />
          </IconButton>

          {/*============================================
              Current Page
          =============================================*/}

          <Typography
            variant="body2"
            sx={{
              minWidth: 70,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {calculatedTotalPages >
            0
              ? `${safePage} / ${calculatedTotalPages}`
              : "0 / 0"}
          </Typography>

          {/*============================================
              Next Page
          =============================================*/}

          <IconButton
            size="small"
            onClick={
              handleNextPage
            }
            disabled={
              loading ||
              safePage >=
                calculatedTotalPages
            }
            aria-label="Next page"
          >
            <ChevronRight />
          </IconButton>

          {/*============================================
              Last Page
          =============================================*/}

          <IconButton
            size="small"
            onClick={
              handleLastPage
            }
            disabled={
              loading ||
              safePage >=
                calculatedTotalPages ||
              calculatedTotalPages <=
                1
            }
            aria-label="Last page"
          >
            <LastPage />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportPagination.propTypes = {
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

SalesReportPagination.defaultProps = {
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

  onPageChange: null,

  onPageSizeChange: null,
};

//======================================================
// Export
//======================================================

export default SalesReportPagination;



