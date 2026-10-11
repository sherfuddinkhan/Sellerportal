// ReversePickupEdit.jsx - FINAL COPY PASTE
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Container,
  Stack,
  Chip
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/ReversePickup";

const getField = (r,...keys) => {
  for (const k of keys) {
    const v = r?.[k];
    if (v!== undefined && v!== null && v!== "") return v;
  }
  return "";
};

const ReversePickupEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/reverse-pickups";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/all`);
        const list = res.data?.data || res.data?.Data || res.data || [];
        const found = list.find(
          (x) => String(x.reversePickupId || x.id) === String(id)
        );
        if (!found) {
          setError(`ID ${id} not found. Available: ${list.map((x) => x.reversePickupId).join(", ")}`);
          return;
        }
        setOriginal(found);
        setForm({
          reversePickupNo: getField(found, "reversePickupNo", "ReversePickupNo"),
          saleOrderCode: getField(found, "saleOrderCode", "SaleOrderCode"),
          saleOrderItemCode: getField(found, "saleOrderItemCode", "SaleOrderItemCode"),
          itemSkuCode: getField(found, "itemSkuCode", "ItemSkuCode"),
          trackingNo: getField(found, "trackingNo", "TrackingNo"),
          returnReason: getField(found, "returnReason", "ReturnReason"),
          qcComment: getField(found, "qcComment", "QCComment"),
          reversePickupStatus: getField(found, "reversePickupStatus", "ReversePickupStatus") || "Pending",
          courierProviderName: getField(found, "courierProviderName", "CourierProviderName"),
          facilityCode: getField(found, "facilityCode", "FacilityCode"),
          channelName: getField(found, "channelName", "ChannelName"),
          putawayCode: getField(found, "putawayCode", "PutawayCode"),
        });
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm({...form, [e.target.name]: e.target.value });

  const handleCancel = () => {
    if (from.includes("/view/")) navigate(`/reverse-pickups/view/${id}`);
    else navigate("/reverse-pickups");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.saleOrderCode.trim() ||!form.itemSkuCode.trim()) {
      setError("Sale Order Code and Item SKU are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const sellerId = original.sellerId;
      const customerId = original.customerId;
      const payload = {
        reversePickupNo: form.reversePickupNo.trim() || null,
        saleOrderCode: form.saleOrderCode.trim(),
        saleOrderItemCode: form.saleOrderItemCode.trim(),
        itemSkuCode: form.itemSkuCode.trim(),
        trackingNo: form.trackingNo.trim(),
        returnReason: form.returnReason.trim(),
        qcComment: form.qcComment.trim(),
        reversePickupStatus: form.reversePickupStatus.trim(),
        courierProviderName: form.courierProviderName.trim(),
        facilityCode: form.facilityCode.trim(),
        channelName: form.channelName.trim(),
        putawayCode: form.putawayCode.trim(),
        sellerId: Number(sellerId),
        customerId: Number(customerId),
      };
      await axios.put(
        `${API_URL}/${id}/seller/${sellerId}/customer/${customerId}`,
        payload
      );
      navigate(`/reverse-pickups/view/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ p: 8, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert><Button sx={{ mt: 2 }} onClick={() => navigate("/reverse-pickups")}>Back to List</Button></Container>;
  if (!form) return null;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={handleCancel}>Back</Button>
        <Chip label={`Seller: ${original.sellerId}`} color="primary" variant="outlined" size="small" />
        <Chip label={`Customer: ${original.customerId}`} color="secondary" variant="outlined" size="small" />
      </Stack>

      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Edit Reverse Pickup - {id}</Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* SELLER & CUSTOMER READ-ONLY */}
            <Grid item xs={12} sm={6}><TextField fullWidth label="Seller ID" value={original.sellerId} disabled /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Customer ID" value={original.customerId} disabled /></Grid>

            <Grid item xs={12} sm={6}><TextField fullWidth label="Pickup No" name="reversePickupNo" value={form.reversePickupNo} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required label="Sale Order Code" name="saleOrderCode" value={form.saleOrderCode} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Sale Order Item Code" name="saleOrderItemCode" value={form.saleOrderItemCode} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required label="Item SKU" name="itemSkuCode" value={form.itemSkuCode} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Tracking No" name="trackingNo" value={form.trackingNo} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Courier Provider" name="courierProviderName" value={form.courierProviderName} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Facility Code" name="facilityCode" value={form.facilityCode} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Channel Name" name="channelName" value={form.channelName} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Putaway Code" name="putawayCode" value={form.putawayCode} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select required label="Status" name="reversePickupStatus" value={form.reversePickupStatus} onChange={handleChange}>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Initiated">Initiated</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={2} label="Return Reason" name="returnReason" value={form.returnReason} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="QC Comment" name="qcComment" value={form.qcComment} onChange={handleChange} /></Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={saving? <CircularProgress size={18} color="inherit" /> : <Save />} disabled={saving}>
              {saving? "Updating..." : "Update Pickup"}
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            PUT: /api/ReversePickup/{id}/seller/{original?.sellerId}/customer/{original?.customerId}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReversePickupEdit;