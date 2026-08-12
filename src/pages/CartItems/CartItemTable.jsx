import React from "react";

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const CartItemTable = ({
  items = [],
  onView,
  onDelete,
}) => {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
    >
      <Table
        size="small"
        stickyHeader
      >
        <TableHead>
          <TableRow>
            <TableCell>
              Cart Item ID
            </TableCell>

            <TableCell>
              Cart ID
            </TableCell>

            <TableCell>
              Product
            </TableCell>

            <TableCell>
              SKU
            </TableCell>

            <TableCell>
              Customer
            </TableCell>

            <TableCell align="right">
              Quantity
            </TableCell>

            <TableCell align="right">
              Unit Price
            </TableCell>

            <TableCell align="right">
              Total
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item, index) => {
            const id =
              item.cartItemId ||
              item.id ||
              index;

            const quantity =
              Number(
                item.quantity || 0
              );

            const unitPrice =
              Number(
                item.unitPrice || 0
              );

            const total =
              item.totalAmount ??
              quantity * unitPrice;

            return (
              <TableRow
                key={id}
                hover
              >
                <TableCell>
                  {item.cartItemId ||
                    item.id ||
                    "-"}
                </TableCell>

                <TableCell>
                  {item.cartId || "-"}
                </TableCell>

                <TableCell>
                  <Typography
                    fontWeight={600}
                  >
                    {item.productName ||
                      item.name ||
                      "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  {item.sku || "-"}
                </TableCell>

                <TableCell>
                  {item.customerName ||
                    item.userName ||
                    "-"}
                </TableCell>

                <TableCell align="right">
                  {quantity}
                </TableCell>

                <TableCell align="right">
                  ₹
                  {unitPrice.toLocaleString(
                    "en-IN"
                  )}
                </TableCell>

                <TableCell align="right">
                  ₹
                  {Number(
                    total
                  ).toLocaleString(
                    "en-IN"
                  )}
                </TableCell>

                <TableCell>
                  {item.status ||
                    "ACTIVE"}
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      onClick={() =>
                        onView(item)
                      }
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        onDelete(item)
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CartItemTable;