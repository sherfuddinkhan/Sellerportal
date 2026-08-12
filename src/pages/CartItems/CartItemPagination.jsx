import React from "react";

import {
  MenuItem,
  Select,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";

const CartItemPagination = ({
  page = 0,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        sm: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Typography variant="body2">
          Rows:
        </Typography>

        <Select
          size="small"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(
              Number(
                event.target.value
              )
            )
          }
        >
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
      </Stack>

      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(
          _event,
          newPage
        ) =>
          onPageChange(newPage)
        }
        onRowsPerPageChange={(
          event
        ) =>
          onPageSizeChange(
            Number(
              event.target.value
            )
          )
        }
        rowsPerPageOptions={[]}
      />
    </Stack>
  );
};

export default CartItemPagination;