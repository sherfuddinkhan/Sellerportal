import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Button
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";

import MarketplaceTable from "./MarketplaceTable";
import MarketplaceToolbar from "./MarketplaceToolbar";
import MarketplaceStatistics from "./MarketplaceStatistics";
import DeleteMarketplaceDialog from "./DeleteMarketplaceDialog";

const SERVER_URL = "http://localhost:5000";

const MarketplaceList = () => {
    const [marketplaces, setMarketplaces] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const loadMarketplaces = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${SERVER_URL}/api/marketplaces`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? [];

            setMarketplaces(data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to load marketplaces."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMarketplaces();
    }, []);

    useEffect(() => {
        let result = [...marketplaces];

        if (search.trim()) {
            const value = search.toLowerCase();

            result = result.filter((item) =>
                String(
                    item.marketplaceName ??
                    item.MarketplaceName ??
                    ""
                ).toLowerCase().includes(value) ||
                String(
                    item.marketplaceCode ??
                    item.MarketplaceCode ??
                    ""
                ).toLowerCase().includes(value)
            );
        }

        if (status !== "all") {
            result = result.filter((item) => {
                const active =
                    item.isActive ??
                    item.IsActive ??
                    false;

                return status === "active"
                    ? active === true
                    : active === false;
            });
        }

        setFiltered(result);
    }, [marketplaces, search, status]);

    const handleDelete = (id) => {
        setSelectedId(id);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedId) return;

        try {
            await axios.delete(
                `${SERVER_URL}/api/marketplaces/${selectedId}`
            );

            setDeleteOpen(false);
            setSelectedId(null);

            await loadMarketplaces();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete marketplace."
            );
        }
    };

    return (
        <Box p={3}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Marketplaces
                    </Typography>

                    <Typography color="text.secondary">
                        Manage marketplace integrations
                    </Typography>
                </Box>

                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadMarketplaces}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        href="/marketplaces/create"
                    >
                        Add Marketplace
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <MarketplaceStatistics
                marketplaces={marketplaces}
            />

            <MarketplaceToolbar
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    py={8}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <MarketplaceTable
                    marketplaces={filtered}
                    onDelete={handleDelete}
                />
            )}

            <DeleteMarketplaceDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
            />
        </Box>
    );
};

export default MarketplaceList;














































