
import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box
} from "@mui/material";

import {
    WarningAmber
} from "@mui/icons-material";


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0.00";
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


/* =========================================================
   DISPLAY VALUE
========================================================= */

const displayValue = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return value;
};


/* =========================================================
   DELETE MARKETPLACE ORDER ITEM DIALOG
========================================================= */

const DeleteMarketplaceOrderItemDialog = ({
    open,
    onClose,
    marketplaceOrderItem,
    onDeleted
}) => {


    /* =====================================================
       HANDLE DELETE
    ===================================================== */

    const handleDelete = () => {

        const id =
            marketplaceOrderItem?.MarketplaceOrderItemId;

        if (!id) {
            return;
        }

        onDeleted?.(id);

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >

                <WarningAmber color="error" />

                Delete Marketplace Order Item

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete this
                    Marketplace Order Item?
                    This action cannot be undone.

                </DialogContentText>


                {/* =================================================
                    ITEM DETAILS
                ================================================= */}

                {marketplaceOrderItem && (

                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            backgroundColor: "background.default"
                        }}
                    >

                        {/* -----------------------------------------
                            ITEM ID
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            gutterBottom
                        >

                            <strong>
                                Marketplace Order Item ID :
                            </strong>{" "}

                            {
                                displayValue(
                                    marketplaceOrderItem
                                        .MarketplaceOrderItemId
                                )
                            }

                        </Typography>


                        {/* -----------------------------------------
                            ORDER ID
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            gutterBottom
                        >

                            <strong>
                                Marketplace Order ID :
                            </strong>{" "}

                            {
                                displayValue(
                                    marketplaceOrderItem
                                        .MarketplaceOrderId
                                )
                            }

                        </Typography>


                        {/* -----------------------------------------
                            ORDER ITEM NUMBER
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            gutterBottom
                        >

                            <strong>
                                Order Item Number :
                            </strong>{" "}

                            {
                                displayValue(
                                    marketplaceOrderItem
                                        .MarketplaceOrderItemNumber
                                )
                            }

                        </Typography>


                        {/* -----------------------------------------
                            EXTERNAL ITEM ID
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            gutterBottom
                        >

                            <strong>
                                External Item ID :
                            </strong>{" "}

                            {
                                displayValue(
                                    marketplaceOrderItem
                                        .ExternalOrderItemId
                                )
                            }

                        </Typography>


                        {/* -----------------------------------------
                            PRODUCT
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{
                                wordBreak: "break-word"
                            }}
                        >

                            <strong>
                                Product :
                            </strong>{" "}

                            {
                                displayValue(
                                    marketplaceOrderItem
                                        .ProductTitle
                                )
                            }

                        </Typography>


                        {/* -----------------------------------------
                            SKU
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            gutterBottom
                        >

                            <strong>
                                SKU :
                            </strong>{" "}

                            {
                                displayValue(
                                    marketplaceOrderItem.SKU
                                )
                            }

                        </Typography>


                        {/* -----------------------------------------
                            QUANTITY
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            gutterBottom
                        >

                            <strong>
                                Quantity :
                            </strong>{" "}

                            {
                                marketplaceOrderItem.Quantity ?? 0
                            }

                        </Typography>


                        {/* -----------------------------------------
                            TOTAL AMOUNT
                        ----------------------------------------- */}

                        <Typography
                            variant="body2"
                            fontWeight="bold"
                        >

                            <strong>
                                Total Amount :
                            </strong>{" "}

                            ₹ {
                                formatNumber(
                                    marketplaceOrderItem
                                        .TotalAmount
                                )
                            }

                        </Typography>

                    </Box>

                )}

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!marketplaceOrderItem}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    );

};


export default DeleteMarketplaceOrderItemDialog;
