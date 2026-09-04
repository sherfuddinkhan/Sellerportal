import React from "react";

import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
Grid,
Typography,
Divider,
Box
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
};

/* =========================================================
FORMAT QUANTITY
========================================================= */

const formatQuantity = (value) => {
const quantity = Number(value);

if (!Number.isFinite(quantity)) {
    return "0.00";
}

return quantity.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
};

/* =========================================================
DETAIL FIELD
========================================================= */

const DetailField = ({
label,
value,
currency = false,
quantity = false
}) => {
let displayValue = value;

if (currency) {
    displayValue = formatCurrency(value);
} else if (quantity) {
    displayValue = formatQuantity(value);
} else if (
    value === null ||
    value === undefined ||
    value === ""
) {
    displayValue = "-";
}


return (
    <Box>

        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5 }}
        >
            <strong>
                {label}
            </strong>
        </Typography>

        <Typography>
            {displayValue}
        </Typography>

    </Box>
);
};

/* =========================================================
PURCHASE ORDER ITEM DETAILS
========================================================= */

const PurchaseOrderItemDetails = ({
open,
item,
onClose
}) => {
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
                spacing={3}
            >

                {/* Item ID */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <DetailField
                        label="Purchase Order Item ID:"
                        value={
                            item.PurchaseOrderItemId
                        }
                    />

                </Grid>


                {/* Purchase Order ID */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <DetailField
                        label="Purchase Order ID:"
                        value={
                            item.PurchaseOrderId
                        }
                    />

                </Grid>


                {/* Product ID */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <DetailField
                        label="Product ID:"
                        value={
                            item.ProductId
                        }
                    />

                </Grid>


                {/* Quantity */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <DetailField
                        label="Quantity:"
                        value={
                            item.Quantity
                        }
                        quantity
                    />

                </Grid>


                {/* Unit Price */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <DetailField
                        label="Unit Price:"
                        value={
                            item.UnitPrice
                        }
                        currency
                    />

                </Grid>


                {/* Discount */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <DetailField
                        label="Discount:"
                        value={
                            item.Discount
                        }
                        currency
                    />

                </Grid>


                {/* Tax Amount */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <DetailField
                        label="Tax Amount:"
                        value={
                            item.TaxAmount
                        }
                        currency
                    />

                </Grid>


                {/* Total Amount */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                        >
                            <strong>
                                Total Amount:
                            </strong>
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(
                                item.TotalAmount
                            )}
                        </Typography>

                    </Box>

                </Grid>


                {/* Divider */}

                <Grid
                    item
                    xs={12}
                >

                    <Divider
                        sx={{
                            my: 1
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

export default PurchaseOrderItemDetails;
