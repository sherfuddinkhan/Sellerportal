import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography,Divider} from "@mui/material";


const DeleteProductInventoryDialog = ({
    open,
    inventory,
    onClose,
    onDeleted
}) => {

    if (!inventory) return null;
    const handleDelete = () => {
        onDeleted(
            inventory.ProductInventoryId
        );
    };


    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Delete Product Inventory
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ mt:2 }}>
                <Typography>
                    Are you sure you want to delete this inventory record?
                </Typography>
                <Typography
                    sx={{ mt:2 }}
                    fontWeight="bold"
                >
                    Product ID :
                    {" "}
                    {inventory.ProductId || "-"}
                </Typography>
                <Typography>
                    Warehouse ID :
                    {" "}
                    {inventory.WarehouseId || "-"}
                </Typography>
                <Typography>
                    Quantity :
                    {" "}
                    {inventory.Quantity || 0}
                </Typography>
                <Typography>
                    Available Quantity :
                    {" "}
                    {inventory.AvailableQuantity || 0}
                </Typography>
                <Typography>
                    Stock Status :
                    {" "}
                    {inventory.StockStatus || "-"}
                </Typography>
            </DialogContent>
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
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteProductInventoryDialog;