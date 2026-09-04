import React from "react";

import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
Grid,
Typography,
Divider
} from "@mui/material";

/* =========================================================
FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
const amount = Number(value);
if (!Number.isFinite(amount)) {
    return "₹ 0.00";
}

return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;
```

};

/* =========================================================
FORMAT QUANTITY
========================================================= */

const formatQuantity = (value) => {

```
const quantity = Number(value);

if (!Number.isFinite(quantity)) {
    return "0.00";
}

return quantity.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
```

};

/* =========================================================
PURCHASE ORDER ITEM VIEW
========================================================= */

const PurchaseOrderItemView = ({
open,
item,
onClose
}) => {

```
if (!item) {
    return null;
}


return (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
    >

        {/* =================================================
            TITLE
        ================================================= */}

        <DialogTitle>
            Purchase Order Item Details
        </DialogTitle>


        {/* =================================================
            CONTENT
        ================================================= */}

        <DialogContent dividers>

            <Grid
                container
                spacing={2}
            >

                {/* Purchase Order Item ID */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Purchase Order Item ID:
                        </strong>
                    </Typography>

                    <Typography>
                        {item.PurchaseOrderItemId ?? "-"}
                    </Typography>

                </Grid>


                {/* Purchase Order ID */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Purchase Order ID:
                        </strong>
                    </Typography>

                    <Typography>
                        {item.PurchaseOrderId ?? "-"}
                    </Typography>

                </Grid>


                {/* Product ID */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Product ID:
                        </strong>
                    </Typography>

                    <Typography>
                        {item.ProductId ?? "-"}
                    </Typography>

                </Grid>


                {/* Quantity */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Quantity:
                        </strong>
                    </Typography>

                    <Typography>
                        {formatQuantity(item.Quantity)}
                    </Typography>

                </Grid>


                {/* Unit Price */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Unit Price:
                        </strong>
                    </Typography>

                    <Typography>
                        {formatCurrency(item.UnitPrice)}
                    </Typography>

                </Grid>


                {/* Discount */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Discount:
                        </strong>
                    </Typography>

                    <Typography>
                        {formatCurrency(item.Discount)}
                    </Typography>

                </Grid>


                {/* Tax Amount */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Tax Amount:
                        </strong>
                    </Typography>

                    <Typography>
                        {formatCurrency(item.TaxAmount)}
                    </Typography>

                </Grid>


                {/* Total Amount */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Total Amount:
                        </strong>
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        {formatCurrency(item.TotalAmount)}
                    </Typography>

                </Grid>


                {/* Divider */}

                <Grid
                    item
                    xs={12}
                >

                    <Divider
                        sx={{
                            my: 2
                        }}
                    />

                </Grid>

            </Grid>

        </DialogContent>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <DialogActions>

            <Button
                variant="contained"
                onClick={onClose}
            >
                Close
            </Button>

        </DialogActions>

    </Dialog>
);
};

export default PurchaseOrderItemView;
