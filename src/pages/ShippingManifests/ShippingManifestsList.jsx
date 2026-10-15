import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Alert, Box, Button, Checkbox, CircularProgress, IconButton,
    MenuItem, Paper, Snackbar, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow,
    TextField, Tooltip, Typography
} from "@mui/material";
import { Add, Clear, Delete, Edit, Refresh, Search, Visibility } from "@mui/icons-material";
import ShippingManifestToolbar from "./ShippingManifestToolbar";
import ShippingManifestStatistics from "./ShippingManifestStatistics";

const API_URL = "http://localhost:5000/api/shipping-manifests";

const getField = (record,...keys) => {
    if (!record) return null;
    for (const key of keys) {
        const value = record[key];
        if (value!== undefined && value!== null && value!== "") return value;
    }
    return null;
};

// === FIXED: USE shippingManifestCode, NOT Id ===
const getManifestId = (manifest) =>
    getField(
        manifest,
        "shippingManifestCode",
        "ShippingManifestCode",
        "manifestCode",
        "ManifestCode"
    );

const extractRecords = (data) => {
    if (Array.isArray(data)) return data;
    if (!data || typeof data!== "object") return [];
    const candidates = [data.data, data.Data, data.items, data.Items, data.records, data.Records, data.results, data.Results, data.$values];
    for (const c of candidates) { if (Array.isArray(c)) return c; }
    return [];
};

const getErrorMessage = (error) => {
    const data = error?.response?.data;
    if (typeof data === "string") return data;
    if (data?.errors) return Object.entries(data.errors).map(([k,v])=> `${k}: ${Array.isArray(v)?v.join(", "):v}`).join(" | ");
    return data?.message || data?.Message || error.message || "An unexpected error occurred.";
};

const normalizeStatus = (value) => String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ");

const searchableFields = {
    shippingManifestCode: ["shippingManifestCode","ShippingManifestCode"],
    channel: ["channel","Channel"],
    shippingProviderCode: ["shippingProviderCode","ShippingProviderCode"],
    shippingProviderName: ["shippingProviderName","ShippingProviderName"],
    shippingMethodCode: ["shippingMethodCode","ShippingMethodCode"],
    courierCode: ["courierCode","CourierCode"],
    trackingNumber: ["trackingNumber","TrackingNumber"],
    manifestType: ["manifestType","ManifestType"],
    sellerId: ["sellerId","SellerId"],
    customerId: ["customerId","CustomerId"],
    status: ["status","Status"]
};

const ShippingManifestsList = () => {
    const navigate = useNavigate();
    const [manifests, setManifests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    const notify = useCallback((message, severity = "success") => {
        setNotification({ open: true, message, severity });
    }, []);
    const closeNotification = (_, reason) => {
        if (reason === "clickaway") return;
        setNotification((p) => ({...p, open: false }));
    };

    const fetchManifests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/all`, { headers: { Accept: "application/json" } });
            const records = extractRecords(response.data);
            setManifests(records);
        } catch (error) {
            setManifests([]);
            notify(`Failed to load: ${getErrorMessage(error)}`, "error");
        } finally { setLoading(false); }
    }, [notify]);

    useEffect(() => { fetchManifests(); }, [fetchManifests]);

    const handleCreate = () => navigate("/shipping-manifests/create");

    const handleView = (manifest) => {
        const id = getManifestId(manifest);
        if (!id) { notify("Cannot view: code missing", "error"); return; }
        navigate(`/shipping-manifests/view/${encodeURIComponent(id)}`);
    };
    const handleEdit = (manifest) => {
        const id = getManifestId(manifest);
        if (!id) { notify("Cannot edit: code missing", "error"); return; }
        navigate(`/shipping-manifests/${encodeURIComponent(id)}/edit`);
    };
    const handleDelete = (manifest) => {
        const id = getManifestId(manifest);
        if (!id) { notify("Cannot delete: code missing", "error"); return; }
        navigate(`/shipping-manifests/${encodeURIComponent(id)}/delete`);
    };

    const filteredManifests = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return manifests.filter((manifest) => {
            const status = normalizeStatus(getField(manifest, "status", "Status"));
            if (statusFilter!== "all" && status!== normalizeStatus(statusFilter)) return false;
            if (!term) return true;
            const fields = searchField === "all"? Object.values(searchableFields).flat() : searchableFields[searchField] || [];
            return fields.some((field) => {
                const value = getField(manifest, field);
                return value!= null && String(value).toLowerCase().includes(term);
            });
        });
    }, [manifests, searchTerm, searchField, statusFilter]);

    const paginatedManifests = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredManifests.slice(start, start + rowsPerPage);
    }, [filteredManifests, page, rowsPerPage]);

    useEffect(() => {
        const maxPage = Math.max(0, Math.ceil(filteredManifests.length / rowsPerPage) - 1);
        if (page > maxPage) setPage(maxPage);
    }, [filteredManifests.length, page, rowsPerPage]);

    const statistics = useMemo(() => {
        let pending=0, shipped=0, delivered=0, cancelled=0;
        manifests.forEach((m) => {
            const status = normalizeStatus(getField(m, "status", "Status"));
            if (["pending","processing","ready","packed"].includes(status)) pending++;
            else if (["shipped","in transit"].includes(status)) shipped++;
            else if (["delivered","completed"].includes(status)) delivered++;
            else if (["cancelled","canceled","failed","rejected"].includes(status)) cancelled++;
        });
        return { totalManifests: manifests.length, pendingManifests: pending, shippedManifests: shipped, deliveredManifests: delivered, cancelledManifests: cancelled };
    }, [manifests]);

    const handleClearFilters = () => { setSearchTerm(""); setSearchField("all"); setStatusFilter("all"); setPage(0); };

    const handleExport = async () => {
        if (filteredManifests.length === 0) { notify("No data to export", "warning"); return; }
        setExporting(true);
        try {
            const columns = [
                ["Shipping Manifest Code", ["shippingManifestCode","ShippingManifestCode"]],
                ["Channel", ["channel","Channel"]],
                ["Provider Code", ["shippingProviderCode","ShippingProviderCode"]],
                ["Provider Name", ["shippingProviderName","ShippingProviderName"]],
                ["Method Code", ["shippingMethodCode","ShippingMethodCode"]],
                ["Courier Code", ["courierCode","CourierCode"]],
                ["Tracking Number", ["trackingNumber","TrackingNumber"]],
                ["Manifest Type", ["manifestType","ManifestType"]],
                ["Status", ["status","Status"]],
                ["Seller ID", ["sellerId","SellerId"]],
                ["Customer ID", ["customerId","CustomerId"]],
                ["Third Party", ["thirdPartyShipping","ThirdPartyShipping"]],
                ["Created Date", ["createdDate","CreatedDate"]],
                ["Comments", ["comments","Comments"]]
            ];
            const escapeCsv = (v) => `"${String(v?? "").replace(/"/g,'""')}"`;
            const rows = [columns.map(([l])=>escapeCsv(l)).join(","),...filteredManifests.map((m)=> columns.map(([,keys])=>escapeCsv(getField(m,...keys))).join(","))];
            const blob = new Blob(["\uFEFF"+rows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href=url; link.download="shipping-manifests.csv"; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
            notify("Exported successfully");
        } catch { notify("Export failed","error"); } finally { setExporting(false); }
    };

    const renderTable = () => {
        if (loading) return <Paper sx={{ p: 5, textAlign: "center" }}><CircularProgress /><Typography sx={{ mt: 2 }}>Loading...</Typography></Paper>;
        if (paginatedManifests.length === 0) return <Paper sx={{ p: 5, textAlign: "center" }}><Typography variant="h6" color="text.secondary">No manifests found</Typography><Button sx={{ mt: 2 }} variant="contained" startIcon={<Add />} onClick={handleCreate}>Create Manifest</Button></Paper>;

        return (
            <TableContainer component={Paper} sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
                <Table size="small" sx={{ minWidth: 1200 }}>
                    <TableHead><TableRow>{["Manifest Code","Channel","Provider","Method","Courier","Tracking","Type","Status","Seller","Customer","Third Party","Actions"].map((h)=><TableCell key={h} align={h==="Actions"?"right":"left"} sx={{ fontWeight: 700 }}>{h}</TableCell>)}</TableRow></TableHead>
                    <TableBody>
                        {paginatedManifests.map((manifest, index) => {
                            const code = getManifestId(manifest);
                            const thirdParty = getField(manifest, "thirdPartyShipping","ThirdPartyShipping");
                            return (
                                <TableRow key={code?? `manifest-${index}`} hover>
                                    <TableCell><Typography fontWeight={600}>{code?? "-"}</Typography></TableCell>
                                    <TableCell>{getField(manifest,"channel","Channel")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"shippingProviderName","ShippingProviderName")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"shippingMethodCode","ShippingMethodCode")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"courierCode","CourierCode")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"trackingNumber","TrackingNumber")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"manifestType","ManifestType")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"status","Status")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"sellerId","SellerId")?? "-"}</TableCell>
                                    <TableCell>{getField(manifest,"customerId","CustomerId")?? "-"}</TableCell>
                                    <TableCell><Checkbox checked={thirdParty===true || thirdParty==="true" || thirdParty===1} disabled size="small" /></TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                            <Tooltip title="View"><IconButton size="small" color="info" onClick={()=>handleView(manifest)}><Visibility fontSize="small"/></IconButton></Tooltip>
                                            <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={()=>handleEdit(manifest)}><Edit fontSize="small"/></IconButton></Tooltip>
                                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={()=>handleDelete(manifest)}><Delete fontSize="small"/></IconButton></Tooltip>
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

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <ShippingManifestToolbar totalRecords={manifests.length} totalManifests={manifests.length} pendingManifests={statistics.pendingManifests} shippedManifests={statistics.shippedManifests} deliveredManifests={statistics.deliveredManifests} cancelledManifests={statistics.cancelledManifests} loading={loading} exporting={exporting} showFilters={showFilters} onAdd={handleCreate} onRefresh={fetchManifests} onExport={handleExport} onToggleFilters={()=>setShowFilters(p=>!p)} />
            <ShippingManifestStatistics manifests={manifests} statistics={statistics} loading={loading} />
            <Paper elevation={0} sx={{ p: 2, mb: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
                    <TextField select size="small" label="Search Field" value={searchField} onChange={(e)=>{setSearchField(e.target.value); setPage(0);}} sx={{ minWidth: { xs: "100%", md: 200 } }}>
                        <MenuItem value="all">All Fields</MenuItem><MenuItem value="shippingManifestCode">Manifest Code</MenuItem><MenuItem value="channel">Channel</MenuItem><MenuItem value="shippingProviderName">Provider Name</MenuItem><MenuItem value="trackingNumber">Tracking</MenuItem><MenuItem value="status">Status</MenuItem>
                    </TextField>
                    <TextField size="small" fullWidth placeholder="Search..." value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value); setPage(0);}} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />, endAdornment: searchTerm? <IconButton size="small" onClick={()=>{setSearchTerm(""); setPage(0);}}><Clear fontSize="small"/></IconButton> : null } }} />
                    {showFilters && <TextField select size="small" label="Status" value={statusFilter} onChange={(e)=>{setStatusFilter(e.target.value); setPage(0);}} sx={{ minWidth: 160 }}><MenuItem value="all">All Statuses</MenuItem><MenuItem value="shipped">Shipped</MenuItem><MenuItem value="delivered">Delivered</MenuItem><MenuItem value="cancelled">Cancelled</MenuItem></TextField>}
                    <Button variant="outlined" startIcon={<Clear />} onClick={handleClearFilters}>Clear</Button>
                    <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>Create</Button>
                </Stack>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}><Typography variant="caption" color="text.secondary">Showing {filteredManifests.length} of {manifests.length}</Typography><IconButton onClick={fetchManifests} disabled={loading} size="small">{loading?<CircularProgress size={18}/>:<Refresh fontSize="small"/>}</IconButton></Box>
            </Paper>
            {renderTable()}
            <Paper elevation={0} sx={{ mt: 1, border: 1, borderColor: "divider", borderRadius: 2 }}><TablePagination component="div" count={filteredManifests.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(_,p)=>setPage(p)} onRowsPerPageChange={(e)=>{setRowsPerPage(Number(e.target.value)); setPage(0);}} rowsPerPageOptions={[5,10,25,50,100]} /></Paper>
            <Snackbar open={notification.open} autoHideDuration={5000} onClose={closeNotification} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}><Alert severity={notification.severity} variant="filled" onClose={closeNotification}>{notification.message}</Alert></Snackbar>
        </Box>
    );
};

export default ShippingManifestsList;
