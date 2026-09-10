import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

const StockMovementDeleteDialog = ({
    open,
    movement,
    onClose,
    onConfirm,
    loading
}) => {

    const id =
        movement?.stockMovementId ??
        movement?.StockMovementId;

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
        >

            <DialogTitle>
                Delete Stock Movement
            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete
                    stock movement #{id}?

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete"}
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default StockMovementDeleteDialog;