import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button,
    Grid,
    Typography,
    Divider,
    Box,
    Chip,
    Card,
    CardContent,
    CircularProgress,
    Container,
    IconButton
} from "@mui/material";
import {
    Business,
    Person,
    LocationOn,
    Public,
    ArrowBack
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api";
// If you call.NET directly use: https://localhost:7203/api

const getFieldValue = (item,...fields) => {
    for (const field of fields) {
        if (item?.[field]!== undefined && item?.[field]!== null && item?.[field]!== "") {
            return item[field];
        }
    }
    return "";
};

const getSafeValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
};

const formatDate = (value) => {
    if (!value) return "N/A";
    try { return new Date(value).toLocaleString(); }
    catch { return String(value); }
};

const AddressField = ({ label, value }) => (
    <Grid item xs={12} sm={6}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight={500} sx={{ overflowWrap: "anywhere", mt: 0.5 }}>
            {getSafeValue(value)}
        </Typography>
    </Grid>
);

const SupplierAddressViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplierAddress, setSupplierAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/SupplierAddress/${id}`);
                setSupplierAddress(res.data?.data || res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    if (!supplierAddress) {
        return (
            <Container>
                <Typography mt={5}>No supplier address found</Typography>
                <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />}>Back</Button>
            </Container>
        );
    }

    const supplierAddressId = getFieldValue(supplierAddress, "supplierAddressId", "SupplierAddressId", "id");
    const supplierId = getFieldValue(supplierAddress, "supplierId", "SupplierId");
    const supplierName = getFieldValue(supplierAddress, "supplierName", "SupplierName") ||
        getFieldValue(supplierAddress?.supplier || supplierAddress?.Supplier, "supplierName", "SupplierName", "name", "Name");
    const contactPerson = getFieldValue(supplierAddress, "contactPerson", "ContactPerson");
    const addressType = getFieldValue(supplierAddress, "addressType", "AddressType");
    const addressLine1 = getFieldValue(supplierAddress, "addressLine1", "AddressLine1");
    const addressLine2 = getFieldValue(supplierAddress, "addressLine2", "AddressLine2");
    const city = getFieldValue(supplierAddress, "city", "City");
    const state = getFieldValue(supplierAddress, "state", "State");
    const postalCode = getFieldValue(supplierAddress, "postalCode", "PostalCode");
    const country = getFieldValue(supplierAddress, "country", "Country");
    const phone = getFieldValue(supplierAddress, "phoneNumber", "PhoneNumber");
    const email = getFieldValue(supplierAddress, "emailAddress", "EmailAddress", "email", "Email");
    const website = getFieldValue(supplierAddress, "website", "Website");
    const gstNumber = getFieldValue(supplierAddress, "gstNumber", "GSTNumber");
    const taxNumber = getFieldValue(supplierAddress, "taxNumber", "TaxNumber");
    const createdAt = getFieldValue(supplierAddress, "createdAt", "CreatedAt");
    const updatedAt = getFieldValue(supplierAddress, "updatedAt", "UpdatedAt");
    const statusRaw = getFieldValue(supplierAddress, "status", "Status", "isActive", "IsActive");
    const isActive = statusRaw === true || String(statusRaw).toLowerCase() === "active" || String(statusRaw).toLowerCase() === "true";

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
                <Typography variant="h5" fontWeight={700}>Supplier Address Details</Typography>
                <Chip label={isActive? "Active" : "Inactive"} color={isActive? "success" : "default"} size="small" sx={{ ml: 2 }} />
            </Box>

            <Card>
                <CardContent>
                    <Box mb={3}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Business color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>Supplier Information</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <AddressField label="Supplier Address ID" value={supplierAddressId} />
                            <AddressField label="Supplier ID" value={supplierId} />
                            <AddressField label="Supplier Name" value={supplierName} />
                            <AddressField label="Contact Person" value={contactPerson} />
                            <AddressField label="Address Type" value={addressType} />
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box mb={3}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <LocationOn color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>Address Information</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <AddressField label="Address Line 1" value={addressLine1} />
                            <AddressField label="Address Line 2" value={addressLine2} />
                            <AddressField label="City" value={city} />
                            <AddressField label="State" value={state} />
                            <AddressField label="Postal Code" value={postalCode} />
                            <AddressField label="Country" value={country} />
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box mb={3}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Person color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>Contact Information</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <AddressField label="Phone Number" value={phone} />
                            <AddressField label="Email Address" value={email} />
                            <AddressField label="Website" value={website} />
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Public color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>Additional Information</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <AddressField label="GST Number" value={gstNumber} />
                            <AddressField label="Tax Number" value={taxNumber} />
                            <AddressField label="Created At" value={formatDate(createdAt)} />
                            <AddressField label="Updated At" value={formatDate(updatedAt)} />
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Box mt={3} display="flex" gap={2}>
                <Button variant="contained" onClick={() => navigate(-1)}>Back to List</Button>
                <Button variant="outlined" onClick={() => navigate(`/supplier-addresses/${supplierAddressId}/edit`)}>Edit</Button>
            </Box>
        </Container>
    );
};

export default SupplierAddressViewPage;