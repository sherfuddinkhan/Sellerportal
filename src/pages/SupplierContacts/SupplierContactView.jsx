import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Badge,
    Business,
    CalendarMonth,
    Edit,
    Email,
    Person,
    Phone,
    Store
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION - NODE.JS AXIOS PROXY
// =========================================================

const SUPPLIER_CONTACT_API =
    "http://localhost:5000/api/supplier-contacts";

// =========================================================
// SAFE FIELD ACCESS
// =========================================================

const getValue = (obj, ...keys) => {
    for (const key of keys) {
        const value = obj?.[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return null;
};

// =========================================================
// DATE FORMATTER
// =========================================================

const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

// =========================================================
// DETAIL ITEM
// =========================================================

const DetailItem = ({ icon, label, value }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 2,
            height: "100%",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper"
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: "action.hover",
                color: "primary.main"
            }}
        >
            {icon}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {value ?? "N/A"}
            </Typography>
        </Box>
    </Box>
);

// =========================================================
// SUPPLIER CONTACT VIEW
// =========================================================

const SupplierContactView = ({
    supplierContact,
    selectedSupplierContact
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const routeContact =
        location.state?.supplierContact ??
        location.state?.contact ??
        null;

    const initialContact =
        supplierContact ??
        selectedSupplierContact ??
        routeContact ??
        null;

    const [contact, setContact] = useState(initialContact);
    const [loading, setLoading] = useState(!initialContact);
    const [pageError, setPageError] = useState("");

    // =====================================================
    // FETCH CONTACT BY ID
    // =====================================================

    const fetchContact = useCallback(async () => {
        if (!id) {
            if (initialContact) {
                setContact(initialContact);
                setLoading(false);
                return;
            }

            setPageError("Supplier contact ID is missing.");
            setLoading(false);
            return;
        }

        // Reuse route data when it matches the requested ID.
        const existingId = getValue(
            initialContact,
            "partyContactId",
            "PartyContactId",
            "supplierContactId",
            "SupplierContactId"
        );

        if (
            initialContact &&
            String(existingId) === String(id)
        ) {
            setContact(initialContact);
            setLoading(false);
            return;
        }

        setLoading(true);
        setPageError("");

        try {
            const response = await axios.get(
                `${SUPPLIER_CONTACT_API}/${id}`
            );

            const data =
                response?.data?.data ??
                response?.data?.item ??
                response?.data;

            if (!data || typeof data !== "object") {
                throw new Error("Supplier contact was not found.");
            }

            setContact(data);
        } catch (error) {
            console.error("GET SUPPLIER CONTACT ERROR:", error);

            setPageError(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.response?.data?.detail ||
                error?.message ||
                "Failed to load supplier contact."
            );
        } finally {
            setLoading(false);
        }
    }, [id, initialContact]);

    useEffect(() => {
        fetchContact();
    }, [fetchContact]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading supplier contact...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // ERROR / NOT FOUND
    // =====================================================

    if (!contact || pageError) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/supplier-contacts")}
                    sx={{ mb: 2 }}
                >
                    Back to Supplier Contacts
                </Button>

                <Alert severity="error">
                    {pageError || "Supplier contact not found."}
                </Alert>
            </Box>
        );
    }

    // =====================================================
    // API FIELDS
    // =====================================================

    const contactId = getValue(
        contact,
        "partyContactId",
        "PartyContactId",
        "supplierContactId",
        "SupplierContactId"
    ) ?? id;

    const supplierId = getValue(
        contact,
        "supplierId",
        "SupplierId"
    );

    const contactType = getValue(
        contact,
        "contactType",
        "ContactType"
    );

    const name = getValue(
        contact,
        "name",
        "Name"
    );

    const contactName = getValue(
        contact,
        "contactName",
        "ContactName"
    ) ?? name;

    const email = getValue(
        contact,
        "email",
        "Email"
    );

    const phone = getValue(
        contact,
        "phone",
        "Phone"
    );

    const sellerId = getValue(
        contact,
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        contact,
        "customerId",
        "CustomerId"
    );

    const createdDate = getValue(
        contact,
        "createdDate",
        "CreatedDate"
    );

    const isPrimary =
        String(contactType ?? "").toUpperCase() === "PRIMARY";

    // =====================================================
    // PAGE UI
    // =====================================================

    return (
        <Box
            sx={{
                p: { xs: 2, md: 3 },
                maxWidth: 1200,
                mx: "auto"
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Supplier Contact Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View supplier contact information.
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/supplier-contacts")}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        disabled={!contactId || Number(contactId) <= 0}
                        onClick={() =>
                            navigate(`/supplier-contacts/${contactId}/edit`, {
                                state: { supplierContact: contact }
                            })
                        }
                    >
                        Edit Contact
                    </Button>
                </Box>
            </Box>

            <Paper
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3
                }}
            >
                {/* CONTACT SUMMARY */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                        flexWrap: "wrap"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 58,
                            height: 58,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            color: "primary.contrastText"
                        }}
                    >
                        <Person sx={{ fontSize: 32 }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 180 }}>
                        <Typography variant="h6" fontWeight={700}>
                            {contactName || name || "Unnamed Contact"}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {contactType || "Supplier Contact"}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                                mt: 1
                            }}
                        >
                            {isPrimary && (
                                <Chip
                                    label="Primary Contact"
                                    color="primary"
                                    size="small"
                                />
                            )}

                            {contactType && (
                                <Chip
                                    label={contactType}
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* CONTACT INFORMATION */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Contact Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Badge />}
                            label="Contact ID"
                            value={contactId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Person />}
                            label="Name"
                            value={name}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Person />}
                            label="Contact Name"
                            value={contactName}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Business />}
                            label="Contact Type"
                            value={contactType}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Email />}
                            label="Email Address"
                            value={email}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Phone />}
                            label="Phone Number"
                            value={phone}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* SELLER / CUSTOMER / SUPPLIER */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Supplier and Account Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Business />}
                            label="Supplier ID"
                            value={supplierId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Store />}
                            label="Seller ID"
                            value={sellerId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Person />}
                            label="Customer ID"
                            value={customerId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<CalendarMonth />}
                            label="Created Date"
                            value={formatDate(createdDate)}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default SupplierContactView;
