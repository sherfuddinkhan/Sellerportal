import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Alert, Box, Button, Chip, CircularProgress, IconButton, InputAdornment,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import { Add, Delete, Edit, Refresh, Search, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/Gatepass`;

const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.gatepasses)) return data.gatepasses;
    return [];
};

const getValue = (item, camelCase, pascalCase) => item?.[camelCase]?? item?.[pascalCase]?? "";
const getRecordId = (item) => item?.gatepassId?? item?.GatepassId?? item?.gatePassId?? item?.GatePassId?? item?.id?? item?.Id?? "";

const GatepassesList = () => {
    const navigate = useNavigate();
    const [gatepasses, setGatepasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Debounce search - THIS FIXES THE FREEZE
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // FIXED: No rowsPerPage dependency, no setPage inside fetch
    const fetchGatepasses = useCallback(async () => {
        const controller = new AbortController();
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(`${API_URL}/all`, { signal: controller.signal });
            setGatepasses(normalizeResponse(response.data));
        } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.response?.data?.message || err.message || "Failed to load Gatepasses.");
        } finally {
            setLoading(false);
        }
        return () => controller.abort();
    }, []); // <- NO rowsPerPage HERE

    useEffect(() => {
        fetchGatepasses();
    }, [fetchGatepasses]);

    const filteredGatepasses = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();
        if (!term) return gatepasses;
        return gatepasses.filter((item) => {
            return [
                getRecordId(item),
                getValue(item, "gatepassCode", "GatepassCode"),
                getValue(item, "facilityCode", "FacilityCode"),
                getValue(item, "itemSkuCode", "ItemSkuCode"),
                getValue(item, "status", "Status"),
            ].join(" ").toLowerCase().includes(term);
        });
    }, [gatepasses, debouncedSearch]);

    const visibleGatepasses = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredGatepasses.slice(start, start + rowsPerPage);
    }, [filteredGatepasses, page, rowsPerPage]);

    const handleDelete = async (item) => {
        const id = getRecordId(item);
        const sellerId = item?.sellerId?? item?.SellerId;
        const customerId = item?.customerId?? item?.CustomerId;

        if (!id ||!sellerId ||!customerId) {
            setError("Cannot delete: ID / SellerId / CustomerId missing.");
            return;
        }
        if (!window.confirm(`Delete Gatepass ${id}?`)) return;

        try {
            await axios.delete(`${API_URL}/${encodeURIComponent(id)}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`);
            setSuccess("Gatepass deleted successfully.");
            await fetchGatepasses();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed.");
        }
    };

    const renderStatus = (status) => {
        const v = String(status || "Unknown").toLowerCase();
        let color = "default";
        if (["approved", "completed", "closed"].includes(v)) color = "success";
        else if (["pending", "draft"].includes(v)) color = "warning";
        else if (["rejected", "cancelled"].includes(v)) color = "error";
        return <Chip label={String(status || "Unknown")} color={color} size="small" />;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Gatepasses</Typography>
                    <Typography variant="caption">Total: {filteredGatepasses.length}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<Refresh />} onClick={fetchGatepasses} disabled={loading}>Refresh</Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/gatepasses/create")}>Create Gatepass</Button>
                </Box>
            </Box>

            {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" onClose={() => setSuccess("")} sx={{ mb: 2 }}>{success}</Alert>}

            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField fullWidth size="small" placeholder="Search by code, facility, SKU, status..." value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
            </Paper>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell><TableCell>Code</TableCell><TableCell>Facility</TableCell><TableCell>SKU</TableCell><TableCell>Qty</TableCell><TableCell>Status</TableCell><TableCell>Created</TableCell><TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading? <TableRow><TableCell colSpan={8} align="center"><CircularProgress size={24} /></TableCell></TableRow> :
                         visibleGatepasses.length === 0? <TableRow><TableCell colSpan={8} align="center">No Gatepasses found.</TableCell></TableRow> :
                         visibleGatepasses.map((item, i) => (
                            <TableRow hover key={getRecordId(item) || i}>
                                <TableCell>{getRecordId(item)}</TableCell>
                                <TableCell>{getValue(item, "gatepassCode", "GatepassCode")}</TableCell>
                                <TableCell>{getValue(item, "facilityCode", "FacilityCode")}</TableCell>
                                <TableCell>{getValue(item, "itemSkuCode", "ItemSkuCode")}</TableCell>
                                <TableCell>{getValue(item, "quantity", "Quantity")}</TableCell>
                                <TableCell>{renderStatus(getValue(item, "status", "Status"))}</TableCell>
                                <TableCell>{getValue(item, "createdDate", "CreatedDate")? new Date(getValue(item, "createdDate", "CreatedDate")).toLocaleDateString("en-IN") : "—"}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="info" onClick={() => navigate(`/gatepasses/details/${getRecordId(item)}`)}><Visibility /></IconButton>
                                    <IconButton size="small" color="primary" onClick={() => navigate(`/gatepasses/${getRecordId(item)}/edit`)}><Edit /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(item)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination count={filteredGatepasses.length} page={page} onPageChange={(_, p) => setPage(p)}
                    rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25, 50]} />
            </TableContainer>
        </Box>
    );
};
export default GatepassesList;