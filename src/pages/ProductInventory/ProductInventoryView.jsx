// =========================================================
// ProductInventoryView.jsx
// Product Inventory Details Dialog
// =========================================================

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
    Chip,
} from "@mui/material";

// =========================================================
// PRODUCT INVENTORY VIEW
// =========================================================

const ProductInventoryView = ({
    open,
    inventory,
    onClose,
}) => {

    // ---------------------------------------------------------
    // No inventory selected
    // ---------------------------------------------------------

    if (!inventory) {
        return null;
    }


    // ---------------------------------------------------------
    // Format value
    // ---------------------------------------------------------

    const formatValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return value;
    };


    // ---------------------------------------------------------
    // Format date
    // ---------------------------------------------------------

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString();
    };


    // ---------------------------------------------------------
    // Reusable field
    // ---------------------------------------------------------

    const Field = ({
        label,
        value,
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {formatValue(value)}
            </Typography>

        </Grid>
    );


    // =========================================================
    // RENDER
    // =========================================================

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
                Product Inventory Details
            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2,
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* INVENTORY ID */}

                    <Field
                        label="Inventory ID"
                        value={inventory.ProductInventoryId}
                    />


                    {/* PRODUCT ID */}

                    <Field
                        label="Product ID"
                        value={inventory.ProductId}
                    />


                    {/* SELLER ID */}

                    <Field
                        label="Seller ID"
                        value={inventory.SellerId}
                    />


                    {/* CUSTOMER ID */}

                    <Field
                        label="Customer ID"
                        value={inventory.CustomerId}
                    />


                    {/* WAREHOUSE ID */}

                    <Field
                        label="Warehouse ID"
                        value={inventory.WarehouseId}
                    />


                    {/* QUANTITY */}

                    <Field
                        label="Quantity"
                        value={inventory.Quantity}
                    />


                    {/* AVAILABLE QUANTITY */}

                    <Field
                        label="Available Quantity"
                        value={inventory.AvailableQuantity}
                    />


                    {/* RESERVED QUANTITY */}

                    <Field
                        label="Reserved Quantity"
                        value={inventory.ReservedQuantity}
                    />


                    {/* REORDER LEVEL */}

                    <Field
                        label="Reorder Level"
                        value={inventory.ReorderLevel}
                    />


                    {/* MINIMUM STOCK */}

                    <Field
                        label="Minimum Stock Level"
                        value={inventory.MinStockLevel}
                    />


                    {/* MAXIMUM STOCK */}

                    <Field
                        label="Maximum Stock Level"
                        value={inventory.MaxStockLevel}
                    />


                    {/* STOCK STATUS */}

                    <Field
                        label="Stock Status"
                        value={inventory.StockStatus}
                    />


                    {/* ACTIVE STATUS */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Active Status
                        </Typography>

                        <br />

                        <Chip
                            label={
                                inventory.IsActive
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                inventory.IsActive
                                    ? "success"
                                    : "error"
                            }
                        />

                    </Grid>


                    {/* LAST UPDATED */}

                    <Field
                        label="Last Updated"
                        value={formatDate(
                            inventory.LastUpdated
                        )}
                    />


                    {/* CREATED DATE */}

                    <Field
                        label="Created Date"
                        value={formatDate(
                            inventory.CreatedDate
                        )}
                    />


                    {/* UPDATED DATE */}

                    <Field
                        label="Updated Date"
                        value={formatDate(
                            inventory.UpdatedDate
                        )}
                    />

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                }}
            >

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


export default ProductInventoryView;

