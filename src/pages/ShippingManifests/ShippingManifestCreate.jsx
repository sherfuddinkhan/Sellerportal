import { useState } from "react";
import axios from "axios";
import {
  Alert, Box, Button, CircularProgress,
  Paper, Snackbar, Typography
} from "@mui/material";
import { ArrowBack, LocalShipping, Refresh } from "@mui/icons-material";
import ShippingManifestForm from "./ShippingManifestForm";

const API_URL = "http://localhost:5000/api/shipping-manifests";

export default function ShippingManifestCreate({
  apiUrl = API_URL,
  onCreated,
  onCancel,
  onSuccess,
  embedded = false,
  title = "Create Shipping Manifest",
  subtitle = "Enter shipment, carrier and delivery information."
}) {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  const notify = (msg, type = "success") => setToast({ open: true, msg, type });
  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast(t => ({...t, open: false }));
  };

  const handleSubmit = async (formData) => {
    if (loading) return null;
    setLoading(true);

    const payload = {
      shippingManifestCode: formData.shippingManifestCode || `SM-${Date.now()}`,
      channel: formData.channel || "CUSTOM",
      shippingProviderCode: formData.shippingProviderCode || "",
      shippingProviderName: formData.shippingProviderName || "",
      shippingMethodCode: formData.shippingMethodCode || "",
      comments: formData.comments || "",
      status: formData.status || "CREATED",
      createdDate: new Date().toISOString(),
      thirdPartyShipping: formData.thirdPartyShipping || false,
      sellerId: Number(formData.sellerId) || 1,
      customerId: Number(formData.customerId) || 1,
      courierCode: formData.courierCode || "",
      trackingNumber: formData.trackingNumber || "",
      manifestType: formData.manifestType || "OUTBOUND"
    };

    try {
      const res = await axios.post(apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000
      });
      const manifest = res.data?.data || res.data?.Data || res.data;
      setCreated(manifest);
      notify("Shipping manifest created successfully", "success");
      onCreated?.(manifest, res);
      onSuccess?.(manifest, res);
      return manifest;
    } catch (err) {
      const data = err.response?.data;
      console.error("ERROR:", data);
      const msg = typeof data === 'string'? data : data?.message || data?.title || err.message;
      notify(msg, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS - WITH BACK ARROW
  if (created) {
    const code = created.shippingManifestCode || created.ShippingManifestCode || "Created";
    return (
      <Box>
        <Paper elevation={embedded? 0 : 2} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <LocalShipping color="success" sx={{ fontSize: 56, mb: 2 }} />
          <Typography variant="h5" fontWeight={700}>Shipping Manifest Created</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Manifest <b>{code}</b> created successfully.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
            <Button variant="contained" startIcon={<Refresh />} onClick={() => setCreated(null)}>CREATE ANOTHER</Button>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => onCancel? onCancel() : window.location.href = "/shipping-manifests"}>BACK TO LIST</Button>
          </Box>
        </Paper>
        <Snackbar open={toast.open} autoHideDuration={5000} onClose={closeToast} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert severity={toast.type} variant="filled" onClose={closeToast}>{toast.msg}</Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={embedded? 0 : 2} sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "primary.main", color: "#fff", display: "grid", placeItems: "center" }}>
              <LocalShipping />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>{title}</Typography>
              <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            </Box>
          </Box>
          {onCancel && <Button variant="outlined" startIcon={<ArrowBack />} onClick={onCancel} disabled={loading}>Back</Button>}
        </Box>

        <ShippingManifestForm mode="create" onSubmit={handleSubmit} onCancel={onCancel} loading={loading} submitLabel="Create Manifest" showReset showCancel={!!onCancel} />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">Creating manifest...</Typography>
          </Box>
        )}
      </Paper>
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={closeToast} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.type} variant="filled" onClose={closeToast}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
