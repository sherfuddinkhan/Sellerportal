// ReversePickupsList.jsx - FINAL WITH SELLER/CUSTOMER
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent,
  CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Snackbar, Typography
} from "@mui/material";
import { Add, Delete, Refresh } from "@mui/icons-material";

import ReversePickupToolbar from "./ReversePickupToolbar";
import ReversePickupStatistics from "./ReversePickupStatistics";
import ReversePickupTable from "./ReversePickupTable";

const API_URL = "http://localhost:5000/api/ReversePickup";

const getPickupId = (pickup) => pickup?.reversePickupId ?? pickup?.ReversePickupId ?? pickup?.id ?? pickup?.Id ?? null;

const extractRecords = (response) => {
  let body = response?.data ?? response;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { return []; } }
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== "object") return [];
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.Data)) return body.Data;
  if (Array.isArray(body.items)) return body.items;
  if (Array.isArray(body.Items)) return body.Items;
  return [];
};

const ReversePickupsList = () => {
  const navigate = useNavigate();
  const [reversePickups, setReversePickups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchReversePickups = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/all`, { timeout: 30000 });
      const records = extractRecords(response);
      console.log("REVERSE PICKUP RECORDS:", records);
      setReversePickups(records);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unable to fetch list.";
      setError(message);
      setReversePickups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReversePickups(); }, [fetchReversePickups]);

  const handleCreate = () => navigate("/reverse-pickups/create");

  const handleView = (pickup) => {
    const id = getPickupId(pickup);
    if (!id) return;
    navigate(`/reverse-pickups/view/${id}`);
  };

  // DIRECT to edit - no view middle step
  const handleEdit = (pickup) => {
    const id = getPickupId(pickup);
    if (!id) return;
    navigate(`/reverse-pickups/${id}/edit`, { state: { from: "/reverse-pickups", pickup } });
  };

  const handleDelete = (pickup) => {
    const id = getPickupId(pickup);
    if (!id) return;
    setDeleteTarget(pickup);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    if (deleteLoading) return;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = getPickupId(deleteTarget);
    if (!id) return;
    try {
      setDeleteLoading(true);
      const sellerId = deleteTarget?.sellerId ?? deleteTarget?.SellerId;
      const customerId = deleteTarget?.customerId ?? deleteTarget?.CustomerId;
      
      if (sellerId && customerId) {
        console.log(`DELETE ${API_URL}/${id}/seller/${sellerId}/customer/${customerId}`);
        await axios.delete(`${API_URL}/${id}/seller/${sellerId}/customer/${customerId}`, { timeout: 30000 });
      } else {
        await axios.delete(`${API_URL}/${id}`, { timeout: 30000 });
      }

      setSnackbar({ open: true, message: "Deleted successfully.", severity: "success" });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await fetchReversePickups();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || "Delete failed.", severity: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRefresh = () => fetchReversePickups();
  const handleSearch = (value) => { setSearchText(value); setPage(0); };

  const filteredReversePickups = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    if (!search) return reversePickups;
    return reversePickups.filter((pickup) => {
      const values = [
        pickup?.reversePickupId, pickup?.id,
        pickup?.reversePickupNo, pickup?.saleOrderCode, pickup?.saleOrderItemCode,
        pickup?.itemSkuCode, pickup?.trackingNo, pickup?.returnReason,
        pickup?.reversePickupStatus, pickup?.courierProviderName, pickup?.facilityCode,
        pickup?.channelName, pickup?.putawayCode,
        pickup?.sellerId, pickup?.SellerId, // <-- ADDED
        pickup?.customerId, pickup?.CustomerId, // <-- ADDED
      ];
      return values.some(v => v!=null && String(v).toLowerCase().includes(search));
    });
  }, [reversePickups, searchText]);

  const paginatedReversePickups = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredReversePickups.slice(start, start + rowsPerPage);
  }, [filteredReversePickups, page, rowsPerPage]);

  const statistics = useMemo(() => {
    const total = reversePickups.length;
    const pending = reversePickups.filter(p => String(p?.reversePickupStatus ?? "").toLowerCase() === "pending").length;
    const initiated = reversePickups.filter(p => String(p?.reversePickupStatus ?? "").toLowerCase() === "initiated").length;
    const completed = reversePickups.filter(p => String(p?.reversePickupStatus ?? "").toLowerCase() === "completed").length;
    return { total, pending, initiated, completed };
  }, [reversePickups]);

  const handleCloseSnackbar = () => setSnackbar(p => ({ ...p, open: false }));

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={600}>Reverse Pickups</Typography>
              <Typography variant="body2" color="text.secondary">Manage reverse pickup requests, returns and tracking. Seller/Customer visible in table.</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} disabled={loading}>Refresh</Button>
              <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>Create</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

      <ReversePickupStatistics reversePickups={reversePickups} statistics={statistics} />
      <ReversePickupToolbar searchText={searchText} onSearch={handleSearch} onRefresh={handleRefresh} loading={loading} />

      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
              <CircularProgress /><Typography variant="body2" color="text.secondary">Loading Reverse Pickups...</Typography>
            </Box>
          ) : (
            <ReversePickupTable
              reversePickups={paginatedReversePickups}
              loading={loading}
              error={error}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
            />
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">{filteredReversePickups.length} record(s) - Seller & Customer IDs shown in table</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button variant="outlined" size="small" disabled={page === 0} onClick={() => setPage(p => Math.max(p - 1, 0))}>Previous</Button>
          <Typography variant="body2">Page {page + 1} of {Math.max(Math.ceil(filteredReversePickups.length / rowsPerPage), 1)}</Typography>
          <Button variant="outlined" size="small" disabled={page >= Math.ceil(filteredReversePickups.length / rowsPerPage) - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} style={{ height: 36, padding: "0 8px", borderRadius: 4, border: "1px solid #ccc" }}>
            <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
        </Box>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Reverse Pickup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete?<br /><br />
            <strong>{deleteTarget?.reversePickupNo ?? `ID: ${getPickupId(deleteTarget)}`}</strong>
            <br />Seller: {deleteTarget?.sellerId} / Customer: {deleteTarget?.customerId}
            <br /><br />This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={deleteLoading}>Cancel</Button>
          <Button color="error" variant="contained" startIcon={deleteLoading ? <CircularProgress size={18} color="inherit" /> : <Delete />} onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ReversePickupsList;