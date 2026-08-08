import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Box,Chip,Divider,Grid,IconButton,Paper,Stack,Typography} from "@mui/material";
import Pagination from "@mui/material/Pagination";

//======================================================
// InventoryReportPagination
//======================================================

const InventoryReportPagination = ({
  page = 1,
  currentPage,
  rowsPerPage = 10,
  totalRecords = 0,
  totalPages,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
}) => {

  //====================================================
  // Current Page
  //====================================================

  const activePage =
    Number(currentPage ?? page) || 1;

  //====================================================
  // Total Pages
  //====================================================

  const calculatedTotalPages =
    useMemo(() => {

      if (
        Number(totalPages) > 0
      ) {
        return Number(totalPages);
      }

      const records =
        Number(totalRecords) || 0;

      const rows =
        Number(rowsPerPage) || 10;

      return Math.max(
        1,
        Math.ceil(
          records / rows
        )
      );

    }, [
      totalPages,
      totalRecords,
      rowsPerPage,
    ]);

  //====================================================
  // Display Range
  //====================================================

  const displayStart =
    totalRecords === 0
      ? 0
      : (
          (activePage - 1) *
          rowsPerPage
        ) + 1;

  const displayEnd =
    totalRecords === 0
      ? 0
      : Math.min(
          activePage *
            rowsPerPage,
          totalRecords
        );

  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = (
    event,
    newPage
  ) => {

    if (
      typeof onPageChange ===
      "function"
    ) {
      onPageChange(
        newPage
      );
    }

  };

  //====================================================
  // Rows Per Page Change
  //====================================================

  const handleRowsPerPageChange = (
    event
  ) => {

    const value =
      Number(
        event.target.value
      );

    if (
      typeof onRowsPerPageChange ===
      "function"
    ) {
      onRowsPerPageChange(
        value
      );
    }

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="inventory-report-pagination"
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
        alignItems="center"
        justifyContent="space-between"
      >

        {/*================================================
            Records Information
        =================================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          {totalRecords > 0
            ? `Showing ${displayStart}-${displayEnd} of ${totalRecords}`
            : "No records found"}
        </Typography>

        {/*================================================
            Pagination
        =================================================*/}

        <Pagination
          count={calculatedTotalPages}
          page={Math.min(
            activePage,
            calculatedTotalPages
          )}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          disabled={
            loading ||
            totalRecords === 0
          }
        />

        {/*================================================
            Rows Per Page
        =================================================*/}

        <FormControl
          size="small"
          sx={{
            minWidth: 120,
          }}
          disabled={loading}
        >
          <InputLabel id="inventory-report-rows-per-page-label">
            Rows
          </InputLabel>

          <Select
            labelId="inventory-report-rows-per-page-label"
            value={rowsPerPage}
            label="Rows"
            onChange={
              handleRowsPerPageChange
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

      </Stack>
    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

InventoryReportPagination.propTypes = {
  page: PropTypes.number,

  currentPage: PropTypes.number,

  rowsPerPage: PropTypes.number,

  totalRecords: PropTypes.number,

  totalPages: PropTypes.number,

  onPageChange: PropTypes.func,

  onRowsPerPageChange: PropTypes.func,

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

InventoryReportPagination.defaultProps = {
  page: 1,

  currentPage: undefined,

  rowsPerPage: 10,

  totalRecords: 0,

  totalPages: 0,

  onPageChange: () => {},

  onRowsPerPageChange: () => {},

  loading: false,
};

//======================================================
// Export
//======================================================

export default InventoryReportPagination;