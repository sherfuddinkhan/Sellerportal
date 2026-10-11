import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box, Button, Container, Typography, Paper, Stack, Chip,
    Table, TableBody, TableCell, TableRow, TableContainer,
    CircularProgress, Alert, Grid
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/ShelfwiseInventory";

const getField = (r,...keys) => {
    for (const k of keys) {
        const v = r?.[k];
        if (v!== undefined && v!== null && v!== "") return v;
    }
    return "—";
};

const ShelfwiseInventoryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [row, setRow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`${API_URL}/all`);
                const all = res.data?.data || res.data?.Data || res.data || [];
                const found = all.find(r => String(r.shelfwiseInventoryId || r.ShelfwiseInventoryId || r.id) === String(id));
                if (found) setRow(found);
                else setError(`Record ${id} not found`);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <Box sx={{ p: 8, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>;
    if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert><Button sx={{ mt: 2 }} startIcon={<ArrowBack />} onClick={() => navigate("/shelfwise-inventories")}>Back</Button></Container>;

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                    <Button startIcon={<ArrowBack />} onClick={() => navigate("/shelfwise-inventories")} sx={{ mb: 1 }}>Back to List</Button>
                    <Typography variant="h5" fontWeight={700}>Shelfwise Inventory Details</Typography>
                    <Typography variant="body2" color="text.secondary">ID: {id}</Typography>
                </Box>
                <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/shelfwise-inventories/${id}/edit`)}>Edit</Button>
            </Stack>

            <Grid container spacing={2}>
                {/* STOCK SUMMARY TABLE */}
                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
                            <Typography fontWeight={700}>Stock Summary</Typography>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    <TableRow><TableCell sx={{ fontWeight: 600, width: 200 }}>Total Quantity</TableCell><TableCell>{getField(row, "quantity", "Quantity")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Available Quantity</TableCell><TableCell>{getField(row, "availableQuantity", "AvailableQuantity", "quantity", "Quantity")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Reserved Quantity</TableCell><TableCell>{getField(row, "reservedQuantity", "ReservedQuantity")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Status</TableCell><TableCell><Chip label={Number(getField(row, "quantity", "Quantity")) <= 0? "Out of Stock" : "In Stock"} size="small" color={Number(getField(row, "quantity", "Quantity")) <= 0? "error" : "success"} /></TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* ITEM DETAILS TABLE */}
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                        <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                            <Typography fontWeight={700}>Item Details</Typography>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell><TableCell>{getField(row, "itemName", "ItemName")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Item Code / SKU</TableCell><TableCell>{getField(row, "itemSkuCode", "ItemSkuCode", "itemCode", "ItemCode")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Category</TableCell><TableCell>{getField(row, "categoryName", "CategoryName")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Unit</TableCell><TableCell>{getField(row, "unit", "Unit")}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* WAREHOUSE & SHELF TABLE */}
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                        <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                            <Typography fontWeight={700}>Warehouse & Shelf Details</Typography>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Warehouse / Facility Code</TableCell><TableCell>{getField(row, "facilityCode", "FacilityCode", "warehouseName", "WarehouseName")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Warehouse ID</TableCell><TableCell>{getField(row, "facilityId", "FacilityId", "warehouseId", "WarehouseId")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Shelf Name</TableCell><TableCell>{getField(row, "shelfName", "ShelfName")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Shelf Code</TableCell><TableCell>{getField(row, "shelfCode", "ShelfCode")}</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ fontWeight: 600 }}>Shelf ID</TableCell><TableCell>{getField(row, "shelfId", "ShelfId")}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ShelfwiseInventoryView;