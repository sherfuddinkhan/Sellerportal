import React from "react";

import {
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const CartItemCard = ({
  item,
  onView,
  onDelete,
}) => {
  const quantity =
    Number(item?.quantity || 0);

  const unitPrice =
    Number(item?.unitPrice || 0);

  const total =
    item?.totalAmount ??
    quantity * unitPrice;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {item?.productName ||
                item?.name ||
                "Product"}
            </Typography>

            <Chip
              size="small"
              label={
                item?.status ||
                "ACTIVE"
              }
            />
          </Stack>

          <Divider />

          <Typography variant="body2">
            <strong>SKU:</strong>{" "}
            {item?.sku || "-"}
          </Typography>

          <Typography variant="body2">
            <strong>Cart ID:</strong>{" "}
            {item?.cartId || "-"}
          </Typography>

          <Typography variant="body2">
            <strong>Quantity:</strong>{" "}
            {quantity}
          </Typography>

          <Typography variant="body2">
            <strong>Unit Price:</strong>{" "}
            ₹
            {unitPrice.toLocaleString(
              "en-IN"
            )}
          </Typography>

          <Typography
            variant="body1"
            fontWeight={700}
          >
            Total: ₹
            {Number(
              total
            ).toLocaleString(
              "en-IN"
            )}
          </Typography>

          <Stack
            direction="row"
            justifyContent="flex-end"
          >
            <Tooltip title="View">
              <IconButton
                onClick={() =>
                  onView(item)
                }
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() =>
                  onDelete(item)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CartItemCard;