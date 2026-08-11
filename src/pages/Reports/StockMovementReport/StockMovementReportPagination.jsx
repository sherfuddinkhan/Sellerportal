//======================================================
// StockMovementReportPagination.jsx
// Part 1A
//======================================================

import React from "react";

import PropTypes from "prop-types";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TablePagination,
} from "@mui/material";

//======================================================
// StockMovementReportPagination
//======================================================

const StockMovementReportPagination = ({
  page = 0,
  rowsPerPage = 10,
  count = 0,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  disabled = false,
}) => {
  //====================================================
  // Page Change
  //====================================================

  const handlePageChange = (
    event,
    nextPage
  ) => {
    if (disabled) {
      return;
    }

    if (onPageChange) {
      onPageChange(
        event,
        nextPage
      );
    }
  };

  //====================================================
  // Rows Per Page Change
  //====================================================

  const handleRowsPerPageChange = (
    event
  ) => {
    if (disabled) {
      return;
    }

    const nextRowsPerPage =
      Number(
        event.target.value
      );

    if (onRowsPerPageChange) {
      onRowsPerPageChange(
        nextRowsPerPage
      );
    }
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-movement-report__pagination"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={1}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        sx={{
          width: {
            xs: "100%",
            sm: "auto",
          },
        }}
      >

        {/*==============================================
            Rows Per Page
        ===============================================*/}

        <FormControl
          size="small"
          sx={{
            minWidth: 130,
          }}
          disabled={disabled}
        >
          <InputLabel>
            Rows
          </InputLabel>

          <Select
            value={rowsPerPage}
            label="Rows"
            onChange={
              handleRowsPerPageChange
            }
          >
            {rowsPerPageOptions.map(
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
            Pagination
        ===============================================*/}

        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={
            rowsPerPage
          }
          onPageChange={
            handlePageChange
          }
          onRowsPerPageChange={
            handleRowsPerPageChange
          }
          rowsPerPageOptions={[]}
          labelRowsPerPage=""
          disabled={disabled}
          sx={{
            overflow: "visible",

            "& .MuiTablePagination-toolbar":
              {
                minHeight: 40,
                paddingLeft: 0,
                paddingRight: 0,
              },

            "& .MuiTablePagination-selectLabel":
              {
                display: "none",
              },

            "& .MuiTablePagination-select":
              {
                display: "none",
              },
          }}
        />

      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportPagination.propTypes = {
  page:
    PropTypes.number,

  rowsPerPage:
    PropTypes.number,

  count:
    PropTypes.number,

  onPageChange:
    PropTypes.func,

  onRowsPerPageChange:
    PropTypes.func,

  rowsPerPageOptions:
    PropTypes.arrayOf(
      PropTypes.number
    ),

  disabled:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

StockMovementReportPagination.defaultProps = {
  page: 0,

  rowsPerPage: 10,

  count: 0,

  onPageChange:
    undefined,

  onRowsPerPageChange:
    undefined,

  rowsPerPageOptions: [
    10,
    25,
    50,
    100,
  ],

  disabled: false,
};

//======================================================
// Export
//======================================================

export default StockMovementReportPagination;

//======================================================
// Part 1A Ends Here
//======================================================