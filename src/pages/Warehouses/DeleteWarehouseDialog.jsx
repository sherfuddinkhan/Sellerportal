// =========================================================
// DeleteWarehouseDialog.jsx
// Delete Warehouse Confirmation Dialog
// =========================================================

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

// =========================================================
// DELETE WAREHOUSE DIALOG
// =========================================================

const DeleteWarehouseDialog = ({
    open,
    warehouse,
    onClose,
    onDeleted
}) => {

    // ---------------------------------------------------------
    // No warehouse selected
    // ---------------------------------------------------------

    if (!warehouse) {
        return null;
    }

    // ---------------------------------------------------------
    // Support PascalCase + camelCase
    // ---------------------------------------------------------

    const warehouseId =
        warehouse.WarehouseId ??
        warehouse.warehouseId ??
        0;

    const warehouseCode =
        warehouse.WarehouseCode ??
        warehouse.warehouseCode ??
        "-";

    const warehouseName =
        warehouse.WarehouseName ??
        warehouse.warehouseName ??
        "-";

    const city =
        warehouse.City ??
        warehouse.city ??
        "-";

    const state =
        warehouse.State ??
        warehouse.state ??
        "-";

    const contactPerson =
        warehouse.ContactPerson ??
        warehouse.contactPerson ??
        "-";

    const phone =
        warehouse.Phone ??
        warehouse.phone ??
        "-";

    // ---------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------

    const handleDelete = () => {

        if (!warehouseId) {
            console.error(
                "Delete Warehouse Error: Warehouse ID is missing."
            );

            return;
        }

        // API call is handled by WarehouseList.jsx
        onDeleted(warehouseId);
    };

    // =========================================================
    // RENDER
    // =========================================================

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

            <DialogTitle>
                Delete Warehouse
            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent sx={{ mt: 2 }}>

                <Typography
                    variant="body1"
                    sx={{ mb: 2 }}
                >
                    Are you sure you want to delete this warehouse?
                </Typography>

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: "grey.50",
                        border: "1px solid",
                        borderColor: "grey.200"
                    }}
                >

                    {/* Warehouse ID */}

                    <Typography
                        sx={{ mb: 1 }}
                        fontWeight="bold"
                    >
                        Warehouse ID:{" "}
                        {warehouseId}
                    </Typography>

                    {/* Warehouse Code */}

                    <Typography sx={{ mb: 1 }}>
                        <strong>Warehouse Code:</strong>{" "}
                        {warehouseCode}
                    </Typography>

                    {/* Warehouse Name */}

                    <Typography sx={{ mb: 1 }}>
                        <strong>Warehouse Name:</strong>{" "}
                        {warehouseName}
                    </Typography>

                    {/* City */}

                    <Typography sx={{ mb: 1 }}>
                        <strong>City:</strong>{" "}
                        {city}
                    </Typography>

                    {/* State */}

                    <Typography sx={{ mb: 1 }}>
                        <strong>State:</strong>{" "}
                        {state}
                    </Typography>

                    {/* Contact Person */}

                    <Typography sx={{ mb: 1 }}>
                        <strong>Contact Person:</strong>{" "}
                        {contactPerson}
                    </Typography>

                    {/* Phone */}

                    <Typography>
                        <strong>Phone:</strong>{" "}
                        {phone}
                    </Typography>

                </Box>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions sx={{ px: 3, pb: 2 }}>

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

export default DeleteWarehouseDialog;