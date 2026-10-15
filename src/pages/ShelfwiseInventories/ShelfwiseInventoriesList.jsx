import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, CircularProgress, Stack, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import ShelfwiseInventoryTable from "./ShelfwiseInventoryTable";

const API_URL = "http://localhost:5000/api/ShelfwiseInventory";

const ShelfwiseInventoriesList = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/all`);
            const data = res.data?.data || res.data?.Data || res.data?.items || res.data || [];
            setInventory(Array.isArray(data)? data : []);
        } catch (e) {
            setError(e.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);

    const handleView = (row) => {
        const id = row.shelfwiseInventoryId || row.ShelfwiseInventoryId || row.id || row.Id;
        navigate(`/shelfwise-inventories/view/${encodeURIComponent(id)}`); // <-- matches your route
    };

    const handleEdit = (row) => {
        const id = row.shelfwiseInventoryId || row.ShelfwiseInventoryId || row.id || row.Id;
        navigate(`/shelfwise-inventories/${encodeURIComponent(id)}/edit`); // <-- matches your route
    };

    const handleDelete = async (id, row) => {
        const sellerId = row.sellerId || row.SellerId;
        const customerId = row.customerId || row.CustomerId;
        if (sellerId && customerId) {
            await axios.delete(`${API_URL}/${encodeURIComponent(id)}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`);
        } else {
            await axios.delete(`${API_URL}/${encodeURIComponent(id)}`);
        }
        fetchInventory();
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Shelfwise Inventory</Typography>
                    <Typography variant="body2" color="text.secondary">All records from /all - {inventory.length} records</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<Refresh />} onClick={fetchInventory}>Refresh</Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/shelfwise-inventories/create")}>Add</Button>
                </Stack>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <ShelfwiseInventoryTable
                inventory={inventory}
                data={inventory}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={fetchInventory}
            />
        </Container>
    );
};

export default ShelfwiseInventoriesList;
