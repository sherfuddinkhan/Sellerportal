import React, {
  useCallback,
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
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// ProfitLossReportPagination
//======================================================

const ProfitLossReportPagination = ({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 0,
  loading = false,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [
    10,
    25,
    50,
    100,
  ],
}) => {
  //====================================================
  // Calculate Pages
  //====================================================

  const calculatedTotalPages =
    totalPages > 0
      ? totalPages
      : pageSize > 0
        ? Math.ceil(
            totalRecords / pageSize
          )
        : 0;

  const currentPage = Math.min(
    Math.max(
      Number(page) || 1,
      1
    ),
    Math.max(
      calculatedTotalPages,
      1
    )
  );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange =
    useCallback(
      (nextPage) => {
        if (loading) return;

        const safePage =
          Math.min(
            Math.max(
              Number(nextPage) || 1,
              1
            ),
            Math.max(
              calculatedTotalPages,
              1
            )
          );

        if (
          safePage !==
          currentPage
        ) {
          onPageChange?.(
            safePage
          );
        }
      },
      [
        loading,
        calculatedTotalPages,
        currentPage,
        onPageChange,
      ]
    );

  //====================================================
  // Page Size Change
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        if (loading) return;

        const nextPageSize =
          Number(
            event?.target?.value
          ) || 10;

        onPageSizeChange?.(
          nextPageSize
        );
      },
      [
        loading,
        onPageSizeChange,
      ]
    );

  //====================================================
  // Navigation Helpers
  //====================================================

  const goFirst = () => {
    handlePageChange(1);
  };

  const goPrevious = () => {
    handlePageChange(
      currentPage - 1
    );
  };

  const goNext = () => {
    handlePageChange(
      currentPage + 1
    );
  };

  const goLast = () => {
    handlePageChange(
      calculatedTotalPages
    );
  };

  //====================================================
  // Record Range
  //====================================================

  const startRecord =
    totalRecords === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const endRecord =
    totalRecords === 0
      ? 0
      : Math.min(
          currentPage *
            pageSize,
          totalRecords
        );
  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="profit-loss-report-pagination"
      variant="outlined"
      sx={{
        width: "100%",
        p: 1.5,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/*==============================================
            Record Information
        ==============================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {totalRecords > 0
            ? `Showing ${startRecord}-${endRecord} of ${totalRecords}`
            : "No records"}
        </Typography>

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
            Rows
          </InputLabel>

          <Select
            value={pageSize}
            label="Rows"
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

        {/*==============================================
            Navigation
        ==============================================*/}

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
        >
          <IconButton
            size="small"
            onClick={goFirst}
            disabled={
              loading ||
              currentPage <= 1 ||
              calculatedTotalPages <= 1
            }
            title="First page"
            aria-label="First page"
          >
            <FirstPage
              fontSize="small"
            />
          </IconButton>

          <IconButton
            size="small"
            onClick={goPrevious}
            disabled={
              loading ||
              currentPage <= 1 ||
              calculatedTotalPages <= 1
            }
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft
              fontSize="small"
            />
          </IconButton>

          <Typography
            variant="body2"
            sx={{
              minWidth: 90,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Page{" "}
            {currentPage}{" "}
            of{" "}
            {Math.max(
              calculatedTotalPages,
              1
            )}
          </Typography>

          <IconButton
            size="small"
            onClick={goNext}
            disabled={
              loading ||
              currentPage >=
                calculatedTotalPages ||
              calculatedTotalPages <= 1
            }
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight
              fontSize="small"
            />
          </IconButton>

          <IconButton
            size="small"
            onClick={goLast}
            disabled={
              loading ||
              currentPage >=
                calculatedTotalPages ||
              calculatedTotalPages <= 1
            }
            title="Last page"
            aria-label="Last page"
          >
            <LastPage
              fontSize="small"
            />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

ProfitLossReportPagination.propTypes = {
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

  onPageChange:
    PropTypes.func,

  onPageSizeChange:
    PropTypes.func,

  pageSizeOptions:
    PropTypes.arrayOf(
      PropTypes.number
    ),
};

//======================================================
// Default Props
//======================================================

ProfitLossReportPagination.defaultProps = {
  page: 1,

  pageSize: 10,

  totalRecords: 0,

  totalPages: 0,

  loading: false,

  onPageChange: () => {},

  onPageSizeChange: () => {},

  pageSizeOptions: [
    10,
    25,
    50,
    100,
  ],
};



export default ProfitLossReportPagination;