import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const DeleteInventoryAdjustmentDialog = ({
    open,
    adjustment,
    onClose,
    onDeleted
}) => {

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        if (!open) {
            setLoading(false);
        }

    }, [open]);


    const getId = () => {

        return (
            adjustment?.inventoryAdjustmentId ??
            adjustment?.InventoryAdjustmentId ??
            ""
        );

    };


    const handleDelete = async () => {

        const id = getId();

        if (!id) {
            return;
        }

        try {

            setLoading(true);

            await onDeleted(id);

        }
        catch (error) {

            console.error(
                "Delete Inventory Adjustment Error:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                Delete Inventory Adjustment
            </DialogTitle>


            <DialogContent>

                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    This action cannot be undone.
                </Alert>


                <Typography>
                    Are you sure you want to delete
                    this inventory adjustment?
                </Typography>


                {getId() && (

                    <Typography
                        sx={{ mt: 1 }}
                        fontWeight={600}
                    >
                        Adjustment ID: {getId()}
                    </Typography>

                )}

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
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={
                        loading ||
                        !getId()
                    }
                >
                    {loading
                        ? "Deleting..."
                        : "Delete"}
                </Button>

            </DialogActions>

        </Dialog>

    );
};

export default DeleteInventoryAdjustmentDialog;
