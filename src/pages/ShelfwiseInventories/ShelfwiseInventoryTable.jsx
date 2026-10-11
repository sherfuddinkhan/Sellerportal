import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Typography, Box, Chip, CircularProgress, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { Visibility, Edit, Delete, Inventory2, Warehouse, Layers } from "@mui/icons-material";

const API_URL = "/api/ShelfwiseInventory"; // vite proxy to 5000

const getFieldValue = (record,...keys) => {
    for (const key of keys) {
        const value = record?.[key];
        if (value!== undefined && value!== null && value!== "") return value;
    }
    return "";
};

const formatNumber = (value) => {
    if (value === "" || value == null) return "0";
    const n = Number(value);
    return Number.isFinite(n)? n.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : String(value);
};

const getStockStatus = (record) => {
    const explicitStatus = getFieldValue(record, "status", "Status");
    if (explicitStatus!== "") {
        const low = String(explicitStatus).toLowerCase();
        if (low.includes("out")) return { label: explicitStatus, color: "error" };
        if (low.includes("low")) return { label: explicitStatus, color: "warning" };
        if (low.includes("in stock") || low.includes("active")) return { label: explicitStatus, color: "success" };
        return { label: explicitStatus, color: "info" };
    }
    const quantity = Number(getFieldValue(record, "quantity", "Quantity", "stockQuantity", "StockQuantity") || 0);
    const minimumStock = Number(getFieldValue(record, "minimumStock", "MinimumStock", "minStock", "MinStock") || 0);
    if (quantity <= 0) return { label: "Out of Stock", color: "error" };
    if (minimumStock > 0 && quantity <= minimumStock) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
};

const ShelfwiseInventoryTable = ({ inventory = [], data, loading = false, onView, onEdit, onDelete, onRefresh }) => {
    const navigate = useNavigate();
    const rows = Array.isArray(data)? data : Array.isArray(inventory)? inventory : [];
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const handleView = (row) => {
        const id = getFieldValue(row, "shelfwiseInventoryId", "ShelfwiseInventoryId", "id", "Id");
        if (onView) onView(row);
        else navigate(`/shelfwise-inventories/details/${encodeURIComponent(id)}`);
    };

    const handleEdit = (row) => {
        const id = getFieldValue(row, "shelfwiseInventoryId", "ShelfwiseInventoryId", "id", "Id");
        if (onEdit) onEdit(row);
        else navigate(`/shelfwise-inventories/${encodeURIComponent(id)}/edit`);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const row = deleteTarget;
        const id = getFieldValue(row, "shelfwiseInventoryId", "ShelfwiseInventoryId", "id", "Id");
        const sellerId = getFieldValue(row, "sellerId", "SellerId");
        const customerId = getFieldValue(row, "customerId", "CustomerId");

        if (!id) return;
        setDeleting(true);
        try {
            if (onDelete) {
                await onDelete(id, row);
            } else {
                // Use your proxy DELETE /:id/seller/:sellerId/customer/:customerId
                if (sellerId && customerId) {
                    await axios.delete(`${API_URL}/${encodeURIComponent(id)}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`);
                } else {
                    // fallback if seller/customer not in row
                    await axios.delete(`${API_URL}/${encodeURIComponent(id)}`);
                }
                onRefresh?.();
            }
            setDeleteTarget(null);
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Paper variant="outlined" sx={{ p: 5, borderRadius: 3, textAlign: "center" }}>
                <CircularProgress size={36} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Loading shelf-wise inventory...</Typography>
            </Paper>
        );
    }

    return (
        <>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, minWidth: 90 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>Item Code</TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>Warehouse</TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>Shelf</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, minWidth: 110 }}>Quantity</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, minWidth: 110 }}>Available</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, minWidth: 100 }}>Reserved</TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, minWidth: 140 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length === 0? (
                            <TableRow><TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                                <Inventory2 sx={{ fontSize: 44, color: "text.disabled", mb: 1 }} />
                                <Typography variant="subtitle1" fontWeight={600}>No inventory records found</Typography>
                                <Typography variant="body2" color="text.secondary">Check /api/ShelfwiseInventory/all - currently returns 0 rows</Typography>
                            </TableCell></TableRow>
                        ) : rows.map((row, index) => {
                            const id = getFieldValue(row, "shelfwiseInventoryId", "ShelfwiseInventoryId", "id", "Id");
                            const itemName = getFieldValue(row, "itemName", "ItemName", "productName", "ProductName");
                            const itemCode = getFieldValue(row, "itemCode", "ItemCode", "itemSkuCode", "ItemSkuCode");
                            const warehouseName = getFieldValue(row, "warehouseName", "WarehouseName", "facilityCode", "FacilityCode", "warehouseCode", "WarehouseCode");
                            const shelfName = getFieldValue(row, "shelfName", "ShelfName");
                            const shelfCode = getFieldValue(row, "shelfCode", "ShelfCode");
                            const quantity = getFieldValue(row, "quantity", "Quantity", "stockQuantity", "StockQuantity");
                            const availableQuantity = getFieldValue(row, "availableQuantity", "AvailableQuantity");
                            const reservedQuantity = getFieldValue(row, "reservedQuantity", "ReservedQuantity");
                            const stockStatus = getStockStatus(row);

                            return (
                                <TableRow key={id!== ""? id : index} hover>
                                    <TableCell><Typography variant="body2" fontWeight={600}>{id || "—"}</Typography></TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 34, height: 34, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "action.hover", color: "primary.main" }}><Inventory2 fontSize="small" /></Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="body2" fontWeight={600} sx={{ overflowWrap: "anywhere" }}>{itemName || "—"}</Typography>
                                                <Typography variant="caption" color="text.secondary">{getFieldValue(row, "categoryName", "CategoryName")}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell><Typography variant="body2">{itemCode || "—"}</Typography></TableCell>
                                    <TableCell><Stack direction="row" spacing={1} alignItems="center"><Warehouse fontSize="small" color="action" /><Typography variant="body2">{warehouseName || "—"}</Typography></Stack></TableCell>
                                    <TableCell><Stack direction="row" spacing={1} alignItems="center"><Layers fontSize="small" color="action" /><Box><Typography variant="body2" fontWeight={600}>{shelfName || "—"}</Typography><Typography variant="caption" color="text.secondary">{shelfCode}</Typography></Box></Stack></TableCell>
                                    <TableCell align="right"><Typography variant="body2" fontWeight={700}>{formatNumber(quantity)}</Typography></TableCell>
                                    <TableCell align="right"><Typography variant="body2" color="success.main" fontWeight={600}>{formatNumber(availableQuantity!== ""? availableQuantity : quantity)}</Typography></TableCell>
                                    <TableCell align="right"><Typography variant="body2" color="warning.main">{formatNumber(reservedQuantity)}</Typography></TableCell>
                                    <TableCell><Chip label={stockStatus.label} color={stockStatus.color} size="small" variant="outlined" /></TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                            <Tooltip title="View"><IconButton size="small" color="info" onClick={() => handleView(row)}><Visibility fontSize="small" /></IconButton></Tooltip>
                                            <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleEdit(row)}><Edit fontSize="small" /></IconButton></Tooltip>
                                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}><Delete fontSize="small" /></IconButton></Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* DELETE CONFIRM */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Inventory?</DialogTitle>
                <DialogContent><Typography variant="body2">Are you sure you want to delete <b>{getFieldValue(deleteTarget, "itemName", "ItemName")}</b>? This cannot be undone.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>{deleting? <CircularProgress size={18} /> : "Delete"}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ShelfwiseInventoryTable;