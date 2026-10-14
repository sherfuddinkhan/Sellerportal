import { useEffect, useState } from "react";
import {
  Box, Grid, TextField, MenuItem, Button, Paper, Typography,
  Divider, CircularProgress, Checkbox, FormControlLabel
} from "@mui/material";
import { LocalShipping, Save, RestartAlt, ArrowBack } from "@mui/icons-material";

const initialFormData = {
  shippingManifestCode: "",
  channel: "CUSTOM",
  shippingProviderCode: "",
  shippingProviderName: "",
  shippingMethodCode: "",
  courierCode: "",
  trackingNumber: "",
  manifestType: "OUTBOUND",
  status: "CREATED",
  sellerId: "1",
  customerId: "1",
  thirdPartyShipping: false,
  comments: ""
};

export default function ShippingManifestForm({
  manifest, record, initialData, onSubmit, onCancel,
  loading = false, mode, title, submitLabel,
  showReset = true, showCancel = true
}) {
  const selectedRecord = manifest || record || initialData;
  const [formData, setFormData] = useState({...initialFormData});

  useEffect(() => {
    if (!selectedRecord) {
      setFormData({...initialFormData, shippingManifestCode: `SM-${Date.now()}`});
      return;
    }
    setFormData({
      shippingManifestCode: selectedRecord.shippingManifestCode || "",
      channel: selectedRecord.channel || "CUSTOM",
      shippingProviderCode: selectedRecord.shippingProviderCode || "",
      shippingProviderName: selectedRecord.shippingProviderName || "",
      shippingMethodCode: selectedRecord.shippingMethodCode || "",
      courierCode: selectedRecord.courierCode || "",
      trackingNumber: selectedRecord.trackingNumber || "",
      manifestType: selectedRecord.manifestType || "OUTBOUND",
      status: selectedRecord.status || "CREATED",
      sellerId: String(selectedRecord.sellerId?? 1),
      customerId: String(selectedRecord.customerId?? 1),
      thirdPartyShipping: Boolean(selectedRecord.thirdPartyShipping),
      comments: selectedRecord.comments || ""
    });
  }, [selectedRecord]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if ((name === 'sellerId' || name === 'customerId') &&!/^\d*$/.test(value)) return;
    setFormData(p => ({...p, [name]: type === "checkbox"? checked : value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      shippingManifestCode: formData.shippingManifestCode.trim(),
      channel: formData.channel,
      shippingProviderCode: formData.shippingProviderCode,
      shippingProviderName: formData.shippingProviderName,
      shippingMethodCode: formData.shippingMethodCode,
      courierCode: formData.courierCode,
      trackingNumber: formData.trackingNumber,
      manifestType: formData.manifestType,
      status: formData.status,
      sellerId: Number(formData.sellerId),
      customerId: Number(formData.customerId),
      thirdPartyShipping: formData.thirdPartyShipping,
      comments: formData.comments
    });
  };

  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <LocalShipping color="primary" /> {title || "Create Shipping Manifest"}
          </Typography>
          {showCancel && onCancel && <Button startIcon={<ArrowBack />} variant="outlined" onClick={onCancel}>Back</Button>}
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="shippingManifestCode" label="Manifest Code *" value={formData.shippingManifestCode} onChange={handleChange} required inputProps={{ maxLength: 100 }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" select name="channel" label="Channel" value={formData.channel} onChange={handleChange}><MenuItem value="CUSTOM">CUSTOM</MenuItem><MenuItem value="AMAZON">AMAZON</MenuItem><MenuItem value="FLIPKART">FLIPKART</MenuItem></TextField></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" select name="status" label="Status" value={formData.status} onChange={handleChange}><MenuItem value="CREATED">CREATED</MenuItem><MenuItem value="SHIPPED">SHIPPED</MenuItem><MenuItem value="DELIVERED">DELIVERED</MenuItem><MenuItem value="CANCELLED">CANCELLED</MenuItem></TextField></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="shippingProviderCode" label="Provider Code" value={formData.shippingProviderCode} onChange={handleChange} inputProps={{ maxLength: 500 }} /></Grid>

          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="shippingProviderName" label="Provider Name" value={formData.shippingProviderName} onChange={handleChange} inputProps={{ maxLength: 500 }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="shippingMethodCode" label="Method Code" value={formData.shippingMethodCode} onChange={handleChange} inputProps={{ maxLength: 500 }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="courierCode" label="Courier Code" value={formData.courierCode} onChange={handleChange} inputProps={{ maxLength: 500 }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="trackingNumber" label="Tracking Number" value={formData.trackingNumber} onChange={handleChange} inputProps={{ maxLength: 500 }} /></Grid>

          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" select name="manifestType" label="Manifest Type" value={formData.manifestType} onChange={handleChange}><MenuItem value="OUTBOUND">OUTBOUND</MenuItem><MenuItem value="INBOUND">INBOUND</MenuItem><MenuItem value="RETURN">RETURN</MenuItem></TextField></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="sellerId" label="Seller ID *" value={formData.sellerId} onChange={handleChange} required inputProps={{ inputMode: 'numeric', maxLength: 20 }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" name="customerId" label="Customer ID *" value={formData.customerId} onChange={handleChange} required inputProps={{ inputMode: 'numeric', maxLength: 20 }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><FormControlLabel control={<Checkbox name="thirdPartyShipping" checked={formData.thirdPartyShipping} onChange={handleChange} />} label="Third Party Shipping" /></Grid>

          <Grid item xs={12}><TextField fullWidth size="small" multiline minRows={3} name="comments" label="Comments" value={formData.comments} onChange={handleChange} inputProps={{ maxLength: 2000 }} /></Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          {showReset && <Button startIcon={<RestartAlt />} onClick={() => setFormData({...initialFormData, shippingManifestCode: `SM-${Date.now()}`})}>Reset</Button>}
          <Button type="submit" variant="contained" startIcon={loading? <CircularProgress size={18}/> : <Save />}>Create Manifest</Button>
        </Box>
      </Box>
    </Paper>
  );
}