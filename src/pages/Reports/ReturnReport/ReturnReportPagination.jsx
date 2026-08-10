import React, {useCallback,useMemo} from "react";
import PropTypes from "prop-types";
import {ChevronLeft,ChevronRight} from "@mui/icons-material";
import {Box,Button,FormControl,InputLabel,MenuItem,Select,Stack,Typography} from "@mui/material";

//======================================================
// ReturnReportPagination
//======================================================

const ReturnReportPagination = ({
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

  const safePage = Math.max(1,Number(page) || 1);
  const safePageSize = Math.max(1,Number(pageSize) || 10);
  const safeTotalRecords = Math.max( 0, Number(totalRecords) || 0);
  const calculatedTotalPages = Math.max( 1, Math.ceil( safeTotalRecords /safePageSize));
  const safeTotalPages = Math.max( 1, Number(totalPages) || calculatedTotalPages);

  //====================================================
  // Page Boundaries
  //====================================================

  const isFirstPage = safePage <= 1;
  const isLastPage = safePage >= safeTotalPages;

  //====================================================
  // Record Range
  //====================================================
  const range = useMemo(() => {
    if (safeTotalRecords === 0) {
      return {
        start: 0,
        end: 0,
      };
    }
    const start = (safePage - 1) * safePageSize + 1;
    const end = Math.min( safePage * safePageSize, safeTotalRecords);
    return { start, end};
  }, [ safePage,safePageSize,safeTotalRecords]);

  //====================================================
  // Previous Page
  //====================================================

  const handlePrevious =
    useCallback(() => {
      if ( loading || isFirstPage || !onPageChange) 
      {
        return;
      }
      onPageChange( safePage - 1);
    }, [
      loading,
      isFirstPage,
      onPageChange,
      safePage,
    ]);

  //====================================================
  // Next Page
  //====================================================

  const handleNext =
    useCallback(() => {
      if ( loading || isLastPage || !onPageChange) 
      {
        return;
      }
      onPageChange( safePage + 1);
    }, [loading,isLastPage,onPageChange,safePage]);

  //====================================================
  // Page Size Handler
  //====================================================

  const handlePageSizeChange =
    useCallback(
      (event) => {
        const newPageSize =
          Number(event.target.value);
        if ( loading || !newPageSize || !onPageSizeChange) 
          {
           return;
          }
        onPageSizeChange( newPageSize);
      },
      [loading,onPageSizeChange]
    );
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="return-report-pagination"
      sx={{
        width: "100%",
        mt: 2,
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
            : `Showing ${range.start}-${range.end} of ${safeTotalRecords} records`}
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
          {/* Page Size */}

          <FormControl
            size="small"
            sx={{
              minWidth: 100,
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
              disabled={
                loading ||
                safeTotalRecords === 0
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

          {/* Previous */}

          <Button
            variant="outlined"
            size="small"
            startIcon={
              <ChevronLeft />
            }
            onClick={
              handlePrevious
            }
            disabled={
              loading ||
              isFirstPage ||
              safeTotalRecords === 0
            }
          >
            Previous
          </Button>

          {/* Page Indicator */}

          <Typography
            variant="body2"
            sx={{
              minWidth: 80,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Page {safePage} of{" "}
            {safeTotalPages}
          </Typography>

          {/* Next */}

          <Button
            variant="outlined"
            size="small"
            endIcon={
              <ChevronRight />
            }
            onClick={handleNext}
            disabled={
              loading ||
              isLastPage ||
              safeTotalRecords === 0
            }
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportPagination.propTypes = {
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

ReturnReportPagination.defaultProps = {
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

export default ReturnReportPagination;


