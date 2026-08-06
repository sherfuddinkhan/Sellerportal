import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Pagination,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

//======================================================
// ReviewPagination Component
//======================================================

const ReviewPagination = ({
  page = 1,
  pageSize = 10,
  totalItems = 0,

  onPageChange,
  onPageSizeChange,
}) => {

  //====================================================
  // Calculations
  //====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const startItem =
    totalItems === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endItem = Math.min(
    page * pageSize,
    totalItems
  );

  //====================================================
  // Event Handlers
  //====================================================

  const handlePageChange = (
    event,
    value
  ) => {

    if (onPageChange) {
      onPageChange(value);
    }

  };

  const handlePageSizeChange = (
    event
  ) => {

    if (onPageSizeChange) {
      onPageSizeChange(
        Number(event.target.value)
      );
    }

  };
    return (
    <Box
      sx={{
        mt: 2,
        px: 2,
        py: 1.5,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
      >

        {/*==========================================
            Records Information
        ==========================================*/}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Showing{" "}
          <strong>{startItem}</strong>
          {" "}to{" "}
          <strong>{endItem}</strong>
          {" "}of{" "}
          <strong>{totalItems}</strong>
          {" "}reviews
        </Typography>

        {/*==========================================
            Right Controls
        ==========================================*/}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          flexWrap="wrap"
        >

          {/* Page Size */}

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
              label="Rows"
              value={pageSize}
              onChange={handlePageSizeChange}
            >

              {[10, 25, 50, 100].map((size) => (

                <MenuItem
                  key={size}
                  value={size}
                >
                  {size} / page
                </MenuItem>

              ))}

            </Select>

          </FormControl>

          {/* Pagination */}

          <Pagination
            page={page}
            count={totalPages}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            onChange={handlePageChange}
          />

        </Stack>

      </Stack>

    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

ReviewPagination.propTypes = {
  page: PropTypes.number,
  pageSize: PropTypes.number,
  totalItems: PropTypes.number,

  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ReviewPagination.defaultProps = {
  page: 1,
  pageSize: 10,
  totalItems: 0,

  onPageChange: () => {},
  onPageSizeChange: () => {},
};

//======================================================
// Export
//======================================================

export default ReviewPagination;