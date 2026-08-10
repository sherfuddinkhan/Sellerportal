//======================================================
// StockLedgerReportPagination.jsx
// Part 1A
//======================================================

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
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// StockLedgerReportPagination
//======================================================

const StockLedgerReportPagination = ({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 0,
  pageSizeOptions = [
    10,
    25,
    50,
    100,
  ],
  onPageChange,
  onPageSizeChange,
  disabled = false,
  showPageSize = true,
  showSummary = true,
}) => {
  //====================================================
  // Safe Values
  //====================================================

  const safePage = useMemo(() => {
    const currentPage =
      Number(page) || 1;

    if (!totalPages) {
      return 1;
    }

    return Math.min(
      Math.max(
        currentPage,
        1
      ),
      totalPages
    );
  }, [page, totalPages]);

  const safePageSize = useMemo(
    () =>
      Math.max(
        1,
        Number(pageSize) || 10
      ),
    [pageSize]
  );

  const safeTotalRecords =
    Math.max(
      0,
      Number(totalRecords) || 0
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
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback(
      (_event, nextPage) => {
        if (
          disabled ||
          typeof onPageChange !==
            "function"
        ) {
          return;
        }

        onPageChange(
          nextPage
        );
      },
      [
        disabled,
        onPageChange,
      ]
    );

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        if (
          disabled ||
          typeof onPageSizeChange !==
            "function"
        ) {
          return;
        }

        const nextPageSize =
          Number(
            event?.target?.value
          ) || 10;

        onPageSizeChange(
          nextPageSize
        );
      },
      [
        disabled,
        onPageSizeChange,
      ]
    );

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-ledger-report-pagination"
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        justifyContent="space-between"
        spacing={2}
      >
        {/*==============================================
            Record Summary
        ===============================================*/}

        {showSummary ? (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {safeTotalRecords ===
            0
              ? "No records"
              : `Showing ${range.start}-${range.end} of ${safeTotalRecords} records`}
          </Typography>
        ) : (
          <Box />
        )}

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
              Page Size
          =============================================*/}

          {showPageSize && (
            <FormControl
              size="small"
              sx={{
                minWidth: 120,
              }}
              disabled={disabled}
            >
              <InputLabel>
                Rows
              </InputLabel>

              <Select
                label="Rows"
                value={
                  safePageSize
                }
                onChange={
                  handlePageSizeChange
                }
              >
                {pageSizeOptions.map(
                  (option) => {
                    const numericOption =
                      Number(
                        option
                      );

                    return (
                      <MenuItem
                        key={
                          numericOption
                        }
                        value={
                          numericOption
                        }
                      >
                        {numericOption}
                      </MenuItem>
                    );
                  }
                )}
              </Select>
            </FormControl>
          )}

          {/*============================================
              Pagination
          =============================================*/}

          <Pagination
            count={
              Math.max(
                0,
                Number(
                  totalPages
                ) || 0
              )
            }
            page={
              safePage
            }
            onChange={
              handlePageChange
            }
            disabled={
              disabled ||
              safeTotalRecords ===
                0
            }
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Stack>

      {/*===============================================
          Part 1A Ends Here
      ================================================*/}
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockLedgerReportPagination.propTypes = {
  page:
    PropTypes.number,

  pageSize:
    PropTypes.number,

  totalRecords:
    PropTypes.number,

  totalPages:
    PropTypes.number,

  pageSizeOptions:
    PropTypes.arrayOf(
      PropTypes.number
    ),

  onPageChange:
    PropTypes.func,

  onPageSizeChange:
    PropTypes.func,

  disabled:
    PropTypes.bool,

  showPageSize:
    PropTypes.bool,

  showSummary:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportPagination.defaultProps = {
  page: 1,

  pageSize: 10,

  totalRecords: 0,

  totalPages: 0,

  pageSizeOptions: [
    10,
    25,
    50,
    100,
  ],

  onPageChange: null,

  onPageSizeChange: null,

  disabled: false,

  showPageSize: true,

  showSummary: true,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportPagination;



