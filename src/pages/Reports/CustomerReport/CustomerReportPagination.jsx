import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {Box,FormControl,InputLabel,MenuItem,Select,Stack,Typography,} from "@mui/material";
import {Pagination} from "@mui/material";

//======================================================
// Page Size Options
//======================================================
const PAGE_SIZE_OPTIONS = [10,25,50,100];
//======================================================
// CustomerReportPagination
//======================================================
const CustomerReportPagination = ({
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  //====================================================
  // Total Pages
  //====================================================
  const totalPages = useMemo(() => {
    if (!totalItems || totalItems <= 0) {
      return 1;
    }
    return Math.max(1,Math.ceil(Number(totalItems) /Number(pageSize))
    );
  }, [totalItems,pageSize]);
  //====================================================
  // Current Page
  //====================================================
  const currentPage = Math.min(Math.max(Number(page) || 1,1),totalPages);
  //====================================================
  // Result Start
  //====================================================
  const resultStart = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  //====================================================
  // Result End
  //====================================================
  const resultEnd =totalItems > 0 ? Math.min(currentPage * pageSize,totalItems): 0;
  //====================================================
  // Page Change Handler
  //====================================================
  const handlePageChange = (
    event,
    newPage
  ) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };
  //====================================================
  // Page Size Handler
  //====================================================
  const handlePageSizeChange = (
    event
  ) => {
    const newPageSize = Number(event.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="customer-report-pagination"
      sx={{
        mt: 2,
        px: 2,
        py: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
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
            Result Information
        =================================================*/}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          Showing{" "}
          <strong>{resultStart}</strong>
          {" "}to{" "}
          <strong>{resultEnd}</strong>
          {" "}of{" "}
          <strong>{totalItems}</strong>
          {" "}customers
        </Typography>

        {/*================================================
            Controls
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
              Page Size
          ==============================================*/}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Rows per page
            </Typography>
            <FormControl
              size="small"
              sx={{
                minWidth: 85,
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
              >
                {PAGE_SIZE_OPTIONS.map(
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
          {/*==============================================
              Pagination
          ==============================================*/}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

CustomerReportPagination.propTypes = {
  page: PropTypes.number,
  pageSize: PropTypes.number,
  totalItems: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};
//======================================================
// Default Props
//======================================================
CustomerReportPagination.defaultProps = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  onPageChange: () => {},
  onPageSizeChange: () => {},
};
//======================================================
// Export
//======================================================
export default CustomerReportPagination;