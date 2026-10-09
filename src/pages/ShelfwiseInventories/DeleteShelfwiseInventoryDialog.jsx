import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Chip,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    DeleteOutline,
    Inventory2,
    WarningAmber
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getField = (record, ...keys) => {
    for (const key of keys) {
        if (
            record?.[key] !== undefined &&
            record?.[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

/* =========================================================
   GET INVENTORY ID
========================================================= */

const getInventoryId = (record) =>
    getField(
        record,
        "shelfwiseInventoryId",
        "ShelfwiseInventoryId",
        "inventoryId",
        "InventoryId",
        "id",
        "Id"
    );

/* =========================================================
   DELETE SHELFWISE INVENTORY DIALOG
========================================================= */

const DeleteShelfwiseInventoryDialog = ({
    open = false,
    onClose,
    onConfirm,
    onDelete,

    inventory,
    record,
    data,

    loading = false,
    submitting = false,

    error = ""
}) => {
    const selectedInventory =
        inventory || record || data || {};

    const itemName =
        getField(
            selectedInventory,
            "itemName",
            "ItemName",
            "productName",
            "ProductName"
        ) || "Unnamed Item";

    const itemCode =
        getField(
            selectedInventory,
            "itemCode",
            "ItemCode",
            "productCode",
            "ProductCode"
        ) || "N/A";

    const shelfName =
        getField(
            selectedInventory,
            "shelfName",
            "ShelfName"
        ) || "N/A";

    const shelfCode =
        getField(
            selectedInventory,
            "shelfCode",
            "ShelfCode"
        ) || "N/A";

    const warehouseName =
        getField(
            selectedInventory,
            "warehouseName",
            "WarehouseName"
        ) || "N/A";

    const quantity = Number(
        getField(
            selectedInventory,
            "quantity",
            "Quantity"
        )
    ) || 0;

    const availableQuantity = Number(
        getField(
            selectedInventory,
            "availableQuantity",
            "AvailableQuantity"
        )
    ) || 0;

    const reservedQuantity = Number(
        getField(
            selectedInventory,
            "reservedQuantity",
            "ReservedQuantity"
        )
    ) || 0;

    const status =
        getField(
            selectedInventory,
            "status",
            "Status"
        ) || "N/A";

    const inventoryId = getInventoryId(selectedInventory);

    const isBusy = loading || submitting;

    /* =====================================================
       HANDLERS
    ===================================================== */

    const handleClose = () => {
        if (isBusy) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    const handleConfirm = async () => {
        if (isBusy) {
            return;
        }

        const callback = onConfirm || onDelete;

        if (typeof callback !== "function") {
            return;
        }

        await callback(selectedInventory);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-shelfwise-inventory-title"
        >
            {/* Dialog title */}

            <DialogTitle
                id="delete-shelfwise-inventory-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 2
                }}
            >
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        bgcolor: "error.light",
                        color: "error.dark"
                    }}
                >
                    <DeleteOutline fontSize="large" />
                </Box>

                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Delete Inventory
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm inventory record deletion
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            {/* Dialog content */}

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <Alert
                    severity="warning"
                    icon={<WarningAmber />}
                    sx={{ mb: 3 }}
                >
                    <Typography
                        variant="body2"
                        fontWeight={600}
                    >
                        Are you sure you want to delete this
                        inventory record?
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                        This action may be irreversible. Verify the
                        inventory details before proceeding.
                    </Typography>
                </Alert>

                {/* Inventory details */}

                <Box
                    sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 2
                        }}
                    >
                        <Inventory2 color="primary" />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {itemName}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Item Code: {itemCode}
                            </Typography>
                        </Box>

                        <Chip
                            label={status}
                            size="small"
                            color={
                                String(status).toLowerCase().includes("out")
                                    ? "error"
                                    : String(status).toLowerCase().includes("low")
                                        ? "warning"
                                        : "default"
                            }
                        />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr"
                            },
                            gap: 2
                        }}
                    >
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Inventory ID
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {inventoryId !== ""
                                    ? String(inventoryId)
                                    : "N/A"}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Warehouse
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {warehouseName}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Shelf Name
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {shelfName}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Shelf Code
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {shelfCode}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Quantities */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: 1
                        }}
                    >
                        <Box sx={{ textAlign: "center" }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Total
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {quantity.toLocaleString("en-IN")}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Available
                            </Typography>

                            <Typography
                                variant="h6"
                                color="success.main"
                                fontWeight={700}
                            >
                                {availableQuantity.toLocaleString("en-IN")}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Reserved
                            </Typography>

                            <Typography
                                variant="h6"
                                color="info.main"
                                fontWeight={700}
                            >
                                {reservedQuantity.toLocaleString("en-IN")}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <Divider />

            {/* Dialog actions */}

            <DialogActions
                sx={{
                    p: 2.5,
                    gap: 1
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={isBusy}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        isBusy
                            ? <CircularProgress size={18} color="inherit" />
                            : <DeleteOutline />
                    }
                    onClick={handleConfirm}
                    disabled={
                        isBusy ||
                        (!onConfirm && !onDelete) ||
                        inventoryId === ""
                    }
                >
                    {isBusy ? "Deleting..." : "Delete Inventory"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteShelfwiseInventoryDialog;

