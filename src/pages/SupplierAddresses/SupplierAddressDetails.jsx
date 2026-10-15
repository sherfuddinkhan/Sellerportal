import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Box, Divider, Chip, Paper } from "@mui/material";
import { Close, EditLocationAlt, Business, LocationOn, Phone, MyLocation, Numbers, Public, LocationCity } from "@mui/icons-material";

const getFieldValue = (data,...fields) => {
    for (const field of fields) {
        if (data?.[field]!== undefined && data?.[field]!== null && String(data[field]).trim()!== "") return data[field];
    }
    return "";
};
const formatDisplay = (v) => v || "N/A";

const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, flexShrink: 0, borderRadius: 2, bgcolor: "action.hover", color: "primary.main" }}>{icon}</Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
            <Typography variant="body2" fontWeight={500} sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>{formatDisplay(value)}</Typography>
        </Box>
    </Box>
);

const SectionHeader = ({ title }) => (
    <Box sx={{ mb: 2 }}><Typography variant="subtitle1" fontWeight={700}>{title}</Typography><Divider sx={{ mt: 1 }} /></Box>
);

const SupplierAddressDetails = ({ open, onClose, supplierAddress, onEdit }) => {
    if (!supplierAddress) {
        return (
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Supplier Address Details</DialogTitle>
                <DialogContent><Typography color="text.secondary">No supplier address selected.</Typography></DialogContent>
                <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
            </Dialog>
        );
    }

    const supplierName = getFieldValue(supplierAddress, "supplierName", "SupplierName") || getFieldValue(supplierAddress?.supplier, "name", "Name");
    const supplierId = getFieldValue(supplierAddress, "supplierId", "SupplierId");
    const addressType = getFieldValue(supplierAddress, "addressType", "AddressType");
    const addressLine1 = getFieldValue(supplierAddress, "addressLine1", "AddressLine1");
    const addressLine2 = getFieldValue(supplierAddress, "addressLine2", "AddressLine2");
    const city = getFieldValue(supplierAddress, "city", "City");
    const stateCode = getFieldValue(supplierAddress, "stateCode", "StateCode", "state", "State");
    const countryCode = getFieldValue(supplierAddress, "countryCode", "CountryCode", "country", "Country");
    const pincode = getFieldValue(supplierAddress, "pincode", "Pincode", "postalCode", "PostalCode");
    const phone = getFieldValue(supplierAddress, "phone", "Phone", "phoneNumber", "PhoneNumber");
    const latitude = getFieldValue(supplierAddress, "latitude", "Latitude");
    const longitude = getFieldValue(supplierAddress, "longitude", "Longitude");
    const sellerId = getFieldValue(supplierAddress, "sellerId", "SellerId");
    const customerId = getFieldValue(supplierAddress, "customerId", "CustomerId");
    const addressId = getFieldValue(supplierAddress, "supplierAddressId", "SupplierAddressId");
    const createdDate = getFieldValue(supplierAddress, "createdDate", "CreatedDate");

    const fullAddress = [addressLine1, addressLine2, city, stateCode, countryCode, pincode].filter(Boolean).join(", ");

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
            <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 2, bgcolor: "action.hover", color: "primary.main" }}><EditLocationAlt /></Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>Supplier Address Details</Typography>
                            <Typography variant="body2" color="text.secondary">Address ID: {formatDisplay(addressId)}</Typography>
                        </Box>
                    </Box>
                    <Chip label={addressType || "N/A"} color="primary" size="small" />
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ py: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Business color="primary" fontSize="large" />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Supplier</Typography>
                            <Typography variant="h6" fontWeight={600}>{formatDisplay(supplierName || `Supplier ${supplierId}`)}</Typography>
                            <Typography variant="body2" color="text.secondary">Supplier ID: {formatDisplay(supplierId)} | Seller ID: {formatDisplay(sellerId)} | Customer ID: {formatDisplay(customerId)}</Typography>
                        </Box>
                    </Box>
                </Paper>

                <Box sx={{ mb: 3 }}>
                    <SectionHeader title="Address Information" />
                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6}><DetailItem icon={<LocationOn fontSize="small" />} label="Address Type" value={addressType} /></Grid>
                        <Grid xs={12} sm={6}><DetailItem icon={<LocationCity fontSize="small" />} label="City" value={city} /></Grid>
                        <Grid xs={12}><DetailItem icon={<LocationOn fontSize="small" />} label="Address Line 1" value={addressLine1} /></Grid>
                        <Grid xs={12}><DetailItem icon={<LocationOn fontSize="small" />} label="Address Line 2" value={addressLine2} /></Grid>
                        <Grid xs={12} sm={4}><DetailItem icon={<Public fontSize="small" />} label="Country Code" value={countryCode} /></Grid>
                        <Grid xs={12} sm={4}><DetailItem icon={<LocationCity fontSize="small" />} label="State Code" value={stateCode} /></Grid>
                        <Grid xs={12} sm={4}><DetailItem icon={<Numbers fontSize="small" />} label="Pincode" value={pincode} /></Grid>
                        <Grid xs={12}><DetailItem icon={<LocationOn fontSize="small" />} label="Complete Address" value={fullAddress} /></Grid>
                    </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <SectionHeader title="Contact & Location" />
                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6}><DetailItem icon={<Phone fontSize="small" />} label="Phone" value={phone} /></Grid>
                        <Grid xs={12} sm={3}><DetailItem icon={<MyLocation fontSize="small" />} label="Latitude" value={latitude} /></Grid>
                        <Grid xs={12} sm={3}><DetailItem icon={<MyLocation fontSize="small" />} label="Longitude" value={longitude} /></Grid>
                        <Grid xs={12} sm={6}><DetailItem icon={<Business fontSize="small" />} label="Seller ID" value={sellerId} /></Grid>
                        <Grid xs={12} sm={6}><DetailItem icon={<Business fontSize="small" />} label="Customer ID" value={customerId} /></Grid>
                        {createdDate && <Grid xs={12} sm={6}><DetailItem icon={<Numbers fontSize="small" />} label="Created Date" value={new Date(createdDate).toLocaleString()} /></Grid>}
                    </Grid>
                </Box>

                {latitude && longitude && (
                    <Box>
                        <SectionHeader title="Map" />
                        <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, overflow: "hidden" }}>
                            <iframe
                                title="map"
                                width="100%"
                                height="250"
                                style={{ border: 0, borderRadius: 8 }}
                                src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                            />
                        </Paper>
                    </Box>
                )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>Close</Button>
                {onEdit && <Button variant="contained" startIcon={<EditLocationAlt />} onClick={() => onEdit(supplierAddress)}>Edit Address</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default SupplierAddressDetails;
