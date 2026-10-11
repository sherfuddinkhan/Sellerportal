import React from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Chip, IconButton, Tooltip, CircularProgress, Stack, Button
} from "@mui/material";
import { Visibility, Edit, Delete, AssignmentReturn, Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const getField = (r,...keys) => {
    for (const k of keys) {
        const v = r?.[k];
        if (v!== undefined && v!== null && v!== "") return v;
    }
    return null;
};

const getStatusConfig = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("complete")) return { label: status, color: "success" };
    if (s.includes("cancel")) return { label: status, color: "error" };
    if (s.includes("progress") || s.includes("picked") || s.includes("transit")) return { label: status, color: "info" };
    if (s.includes("pending") || s.includes("initiat")) return { label: status, color: "warning" };
    return { label: status || "Unknown", color: "default" };
};

const ReversePickupTable = ({
    reversePickups = [],
    loading = false,
    error = null,
    onEdit,
    onDelete,
    onRefresh,
}) => {
    const navigate = useNavigate();
    const sourceData = reversePickups;
    const getId = (p) => getField(p, "reversePickupId", "ReversePickupId", "id", "Id");

    if (loading && sourceData.length === 0) {
        return <Paper variant="outlined" sx={{ p: 5, textAlign: "center" }}><CircularProgress /><Typography sx={{ mt: 2 }}>Loading...</Typography></Paper>;
    }
    if (sourceData.length === 0) {
        return <Paper variant="outlined" sx={{ p: 5, textAlign: "center" }}><AssignmentReturn sx={{ fontSize: 48, color: "text.secondary" }} /><Typography>No Reverse Pickups</Typography><Button sx={{ mt: 2 }} onClick={onRefresh} startIcon={<Refresh />}>Refresh</Button></Paper>;
    }

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Pickup No</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Sale Order</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Item SKU</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Seller ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Customer ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tracking</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Facility</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sourceData.map((p, i) => {
                        const id = getId(p);
                        const status = getField(p, "reversePickupStatus", "ReversePickupStatus");
                        const statusCfg = getStatusConfig(status);
                        const sellerId = getField(p, "sellerId", "SellerId");
                        const customerId = getField(p, "customerId", "CustomerId");
                        return (
                            <TableRow key={id || i} hover>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ width: 32, height: 32, bgcolor: "action.hover", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><AssignmentReturn fontSize="small" /></Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={700}>{getField(p, "reversePickupNo", "ReversePickupNo") || "—"}</Typography>
                                            <Typography variant="caption" color="text.secondary">ID: {id}</Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell><Typography variant="body2">{getField(p, "saleOrderCode", "SaleOrderCode") || "—"}</Typography></TableCell>
                                <TableCell><Typography variant="body2" fontWeight={500}>{getField(p, "itemSkuCode", "ItemSkuCode") || "—"}</Typography></TableCell>

                                {/* SELLER ID */}
                                <TableCell>
                                    <Chip label={`S-${sellerId}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
                                </TableCell>

                                {/* CUSTOMER ID */}
                                <TableCell>
                                    <Chip label={`C-${customerId}`} size="small" color="secondary" variant="outlined" sx={{ fontWeight: 700 }} />
                                </TableCell>

                                <TableCell><Typography variant="body2" sx={{ fontFamily: "monospace" }}>{getField(p, "trackingNo", "TrackingNo") || "—"}</Typography></TableCell>
                                <TableCell>{getField(p, "facilityCode", "FacilityCode") || "—"}</TableCell>
                                <TableCell><Chip label={statusCfg.label} color={statusCfg.color} size="small" variant="outlined" sx={{ fontWeight: 600 }} /></TableCell>
                                <TableCell><Typography variant="body2">{p.createdDate? new Date(p.createdDate).toLocaleDateString("en-IN") : "—"}</Typography></TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <Tooltip title={`View ID:${id} Seller:${sellerId} Customer:${customerId}`}>
                                            <IconButton size="small" color="primary" onClick={() => navigate(`/reverse-pickups/view/${id}`)}><Visibility fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" color="info" onClick={() => onEdit?.(p)}><Edit fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title={`Delete ${id}/seller/${sellerId}/customer/${customerId}`}>
                                            <IconButton size="small" color="error" onClick={() => onDelete?.(p)}><Delete fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReversePickupTable;