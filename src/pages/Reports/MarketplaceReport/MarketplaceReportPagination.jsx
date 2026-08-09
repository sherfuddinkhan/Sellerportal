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
// MarketplaceReportPagination
//======================================================

const MarketplaceReportPagination = ({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 1,
  pageSizeOptions = [10, 25, 50, 100],
  loading = false,
  disabled = false,
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
      1,
      Number(totalPages) ||
        Math.ceil(
          safeTotalRecords /
            safePageSize
        ) ||
        1
    );

  //====================================================
  // Page Range
  //====================================================

  const startRecord = useMemo(() => {
    if (safeTotalRecords === 0) {
      return 0;
    }

    return (
      (safePage - 1) *
        safePageSize +
      1
    );
  }, [
    safePage,
    safePageSize,
    safeTotalRecords,
  ]);

  const endRecord = useMemo(() => {
    if (safeTotalRecords === 0) {
      return 0;
    }

    return Math.min(
      safePage *
        safePageSize,
      safeTotalRecords
    );
  }, [
    safePage,
    safePageSize,
    safeTotalRecords,
  ]);

  //====================================================
  // Safe Page Size Options
  //====================================================

  const safePageSizeOptions =
    useMemo(() => {
      if (
        !Array.isArray(
          pageSizeOptions
        ) ||
        pageSizeOptions.length === 0
      ) {
        return [10, 25, 50, 100];
      }

      return pageSizeOptions
        .map(
          (value) =>
            Number(value)
        )
        .filter(
          (value) =>
            Number.isFinite(
              value
            ) &&
            value > 0
        );
    }, [
      pageSizeOptions,
    ]);

  //====================================================
  // Handle Page Change
  //====================================================

  const handlePageChange =
    useCallback(
      (_, nextPage) => {
        if (
          typeof onPageChange !==
          "function"
        ) {
          return;
        }

        const normalizedPage =
          Math.min(
            Math.max(
              1,
              Number(nextPage) || 1
            ),
            safeTotalPages
          );

        onPageChange(
          normalizedPage
        );
      },
      [
        onPageChange,
        safeTotalPages,
      ]
    );

  //====================================================
  // Handle Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        if (
          typeof onPageSizeChange !==
          "function"
        ) {
          return;
        }

        const nextSize =
          Number(
            event?.target?.value
          );

        if (
          !Number.isFinite(
            nextSize
          ) ||
          nextSize <= 0
        ) {
          return;
        }

        onPageSizeChange(
          nextSize
        );
      },
      [onPageSizeChange]
    );

  //====================================================
  // Disabled State
  //====================================================

  const isDisabled =
    loading || disabled;

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="marketplace-report-pagination"
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
        {/*================================================
            Record Information
        =================================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {safeTotalRecords === 0
            ? "No records"
            : `Showing ${startRecord.toLocaleString(
                "en-IN"
              )}–${endRecord.toLocaleString(
                "en-IN"
              )} of ${safeTotalRecords.toLocaleString(
                "en-IN"
              )}`}
        </Typography>

        {/*================================================
            Pagination Controls
        =================================================*/}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          {/*==============================================
              Page Size
          ==============================================*/}

          <FormControl
            size="small"
            sx={{
              minWidth: 120,
            }}
            disabled={
              isDisabled ||
              safeTotalRecords === 0
            }
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
            >
              {safePageSizeOptions.map(
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

          {/*==============================================
              Pagination
          ==============================================*/}

          <Pagination
            page={Math.min(
              safePage,
              safeTotalPages
            )}
            count={
              safeTotalPages
            }
            onChange={
              handlePageChange
            }
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            disabled={
              isDisabled ||
              safeTotalRecords === 0
            }
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      </Stack>
    </Box>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportPagination.propTypes = {
  page: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  pageSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  totalRecords: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  totalPages: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  pageSizeOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),

  loading: PropTypes.bool,

  disabled: PropTypes.bool,

  onPageChange: PropTypes.func,

  onPageSizeChange:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportPagination.defaultProps = {
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

  disabled: false,

  onPageChange: () => {},

  onPageSizeChange: () => {},
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportPagination;