import React from "react";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const CartItemModal = ({
  open,
  item,
  onClose,
}) => {
  if (!item) {
    return null;
  }

  const quantity =
    Number(item.quantity || 0);

  const unitPrice =
    Number(item.unitPrice || 0);

  const total =
    item.totalAmount ??
    quantity * unitPrice;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Cart Item Details

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Divider sx={{ mb: 3 }} />

        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Cart Item ID
            </Typography>

            <Typography fontWeight={600}>
              {item.cartItemId ||
                item.id ||
                "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Cart ID
            </Typography>

            <Typography fontWeight={600}>
              {item.cartId || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Product
            </Typography>

            <Typography fontWeight={600}>
              {item.productName ||
                item.name ||
                "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              SKU
            </Typography>

            <Typography fontWeight={600}>
              {item.sku || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Customer
            </Typography>

            <Typography fontWeight={600}>
              {item.customerName ||
                item.userName ||
                "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Quantity
            </Typography>

            <Typography fontWeight={600}>
              {quantity}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Unit Price
            </Typography>

            <Typography fontWeight={600}>
              ₹
              {unitPrice.toLocaleString(
                "en-IN"
              )}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Total Amount
            </Typography>

            <Typography fontWeight={700}>
              ₹
              {Number(
                total
              ).toLocaleString(
                "en-IN"
              )}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Status
              </Typography>

              <Typography fontWeight={600}>
                {item.status ||
                  "ACTIVE"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CartItemModal;