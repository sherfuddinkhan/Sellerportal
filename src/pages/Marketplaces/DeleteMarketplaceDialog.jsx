import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";

const DeleteMarketplaceDialog = ({
    open,
    onClose,
    onConfirm
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                Delete Marketplace
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete
                    this marketplace?
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteMarketplaceDialog;