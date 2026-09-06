import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box
} from "@mui/material";


/* =========================================================
   DELETE ORDER STATUS HISTORY DIALOG
========================================================= */

const DeleteOrderStatusHistoryDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    /* =====================================================
       EMPTY ITEM
    ===================================================== */

    if (!item) {
        return null;
    }


    /* =====================================================
       NORMALIZE API FIELDS
       Supports camelCase + PascalCase
    ===================================================== */

    const historyId =
        item.orderStatusHistoryId ??
        item.OrderStatusHistoryId ??
        item.historyId ??
        item.HistoryId ??
        null;

    const sellerId =
        item.sellerId ??
        item.SellerId ??
        "-";

    const customerId =
        item.customerId ??
        item.CustomerId ??
        "-";

    const orderId =
        item.orderId ??
        item.OrderId ??
        "-";

    const status =
        item.status ??
        item.Status ??
        "";

    const remarks =
        item.remarks ??
        item.Remarks ??
        "";

    const changedOn =
        item.changedOn ??
        item.ChangedOn ??
        null;


    /* =====================================================
       FORMAT DATE TIME
    ===================================================== */

    const formatDateTime = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    /* =====================================================
       DELETE HANDLER
    ===================================================== */

    const handleDelete = () => {

        if (
            historyId === null ||
            historyId === undefined
        ) {
            return;
        }

        if (typeof onDeleted === "function") {

            onDeleted(
                historyId
            );

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    fontWeight: 700
                }}
            >
                Delete Order Status History
            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Typography
                    variant="body1"
                >
                    Are you sure you want to delete this
                    order status history record?
                </Typography>


                {/* =============================================
                    HISTORY ID
                ============================================= */}

                <Typography
                    sx={{
                        mt: 2
                    }}
                    fontWeight="bold"
                >
                    History ID:{" "}
                    {historyId ?? "-"}
                </Typography>


                {/* =============================================
                    SELLER ID
                ============================================= */}

                <Typography>
                    Seller ID:{" "}
                    {sellerId}
                </Typography>


                {/* =============================================
                    CUSTOMER ID
                ============================================= */}

                <Typography>
                    Customer ID:{" "}
                    {customerId}
                </Typography>


                {/* =============================================
                    ORDER ID
                ============================================= */}

                <Typography>
                    Order ID:{" "}
                    {orderId}
                </Typography>


                {/* =============================================
                    STATUS
                ============================================= */}

                <Typography>
                    Status:{" "}
                    {status || "-"}
                </Typography>


                {/* =============================================
                    REMARKS
                ============================================= */}

                <Typography
                    sx={{
                        mt: 1,
                        wordBreak: "break-word"
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600
                        }}
                    >
                        Remarks:
                    </Box>{" "}
                    {remarks || "-"}
                </Typography>


                {/* =============================================
                    CHANGED ON
                ============================================= */}

                <Typography
                    sx={{
                        mt: 1
                    }}
                >
                    Changed On:{" "}
                    {formatDateTime(changedOn)}
                </Typography>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

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
                    disabled={
                        historyId === null ||
                        historyId === undefined
                    }
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteOrderStatusHistoryDialog;
