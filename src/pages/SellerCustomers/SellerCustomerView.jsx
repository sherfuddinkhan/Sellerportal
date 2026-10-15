// =========================================================
// SellerCustomerView.jsx
// Seller Customer Details Page
// =========================================================

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import { ArrowBack, Edit, Refresh } from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

// =========================================================
// CONFIGURATION
// React -> Node.js : 5000 -> ASP.NET Core : 7203
// =========================================================

const SERVER_URL = "http://localhost:5000";
const API_URL = `${SERVER_URL}/api/seller-customers`;

// =========================================================
// HELPERS
// =========================================================

const getValue = (obj, pascal, camel, fallback = "") =>
    obj?.[pascal] ?? obj?.[camel] ?? fallback;

const isTrue = (value) =>
    value === true ||
    value === 1 ||
    (
        typeof value === "string" &&
        ["true", "1", "yes", "active"].includes(
            value.trim().toLowerCase()
        )
    );

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleString("en-IN");
};

const formatCurrency = (value) => {
    const amount = Number(value ?? 0);

    return `₹ ${(
        Number.isFinite(amount) ? amount : 0
    ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// Support direct objects and common API response wrappers.
const normalizeCustomer = (responseData) => {
    let data =
        responseData?.customer ??
        responseData?.Customer ??
        responseData?.data ??
        responseData?.Data ??
        responseData;

    if (Array.isArray(data)) {
        return null;
    }

    return data && typeof data === "object" ? data : null;
};

const getCustomerId = (customer) =>
    getValue(customer, "CustomerId", "customerId",
        getValue(customer, "Id", "id", null));

const getSellerId = (customer) =>
    getValue(customer, "SellerId", "sellerId", null);

// =========================================================
// REUSABLE FIELD
// =========================================================

const Field = ({ label, value }) => (
    <Grid xs={12} sm={6}>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
        >
            {label}
        </Typography>

        <Typography
            variant="body1"
            fontWeight={500}
            sx={{ overflowWrap: "anywhere" }}
        >
            {value !== null && value !== undefined && value !== ""
                ? value
                : "-"}
        </Typography>
    </Grid>
);

// =========================================================
// SECTION CARD
// =========================================================

const SectionCard = ({ title, children }) => (
    <Card sx={{ mt: 3 }}>
        <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                {title}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                {children}
            </Grid>
        </CardContent>
    </Card>
);

// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerView = () => {
    const navigate = useNavigate();

    // Supports:
    // /seller-customers/view/:id
    // /seller-customers/details/:sellerId/:customerId
    const { sellerId, customerId, id } = useParams();

    const requestedCustomerId = customerId || id;
    const requestedSellerId = sellerId || "";

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD CUSTOMER
    // =====================================================

    const loadCustomer = useCallback(async () => {
        if (
            !requestedCustomerId ||
            !/^\d+$/.test(String(requestedCustomerId)) ||
            Number(requestedCustomerId) <= 0
        ) {
            setCustomer(null);
            setError("A valid customer ID is missing from the URL.");
            setLoading(false);
            return;
        }

        if (
            requestedSellerId &&
            (
                !/^\d+$/.test(String(requestedSellerId)) ||
                Number(requestedSellerId) <= 0
            )
        ) {
            setCustomer(null);
            setError("A valid seller ID is required.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        setCustomer(null);

        try {
            let customerData = null;

            // -------------------------------------------------
            // OPTION 1: Both sellerId and customerId are in URL
            // -------------------------------------------------

            if (requestedSellerId) {
                const url =
                    `${API_URL}/${encodeURIComponent(requestedSellerId)}` +
                    `/customers/${encodeURIComponent(requestedCustomerId)}`;

                console.log("GET SELLER CUSTOMER:", url);

                const response = await axios.get(url, {
                    headers: { Accept: "*/*" },
                    timeout: 30000,
                });

                customerData = normalizeCustomer(response.data);
            } else {
                // -------------------------------------------------
                // OPTION 2: URL only contains customer ID
                // GET /seller-customers/view/3
                //
                // Retrieve the customer list and find the matching
                // customer. Its SellerId is obtained from the record.
                // -------------------------------------------------

                const response = await axios.get(API_URL, {
                    headers: { Accept: "*/*" },
                    timeout: 30000,
                });

                const responseData = response.data;

                const list =
                    Array.isArray(responseData)
                        ? responseData
                        : responseData?.customers ??
                          responseData?.Customers ??
                          responseData?.data ??
                          responseData?.Data;

                if (!Array.isArray(list)) {
                    throw new Error(
                        "The customer list API did not return an array. " +
                        "Use the details URL containing both sellerId and customerId."
                    );
                }

                customerData = list.find(
                    (item) =>
                        String(getCustomerId(item)) ===
                        String(requestedCustomerId)
                ) ?? null;
            }

            if (!customerData) {
                throw new Error(
                    `Customer ${requestedCustomerId} was not found.`
                );
            }

            const resolvedCustomerId = getCustomerId(customerData);
            const resolvedSellerId = getSellerId(customerData);

            if (
                String(resolvedCustomerId) !==
                String(requestedCustomerId)
            ) {
                throw new Error(
                    "The API response does not match the requested customer ID."
                );
            }

            // Single-ID route needs SellerId from the returned record.
            if (!resolvedSellerId) {
                throw new Error(
                    "The customer was found, but the response does not " +
                    "contain SellerId. Check the API response or use " +
                    "/seller-customers/details/:sellerId/:customerId."
                );
            }

            // If both IDs were specified, verify the returned record.
            if (
                requestedSellerId &&
                String(resolvedSellerId) !== String(requestedSellerId)
            ) {
                throw new Error(
                    "The returned customer does not belong to the requested seller."
                );
            }

            setCustomer(customerData);
        } catch (err) {
            console.error("SELLER CUSTOMER LOAD ERROR:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                url: err.config?.url,
            });

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load seller customer."
            );
        } finally {
            setLoading(false);
        }
    }, [requestedCustomerId, requestedSellerId]);

    useEffect(() => {
        loadCustomer();
    }, [loadCustomer]);

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleBack = () => {
        navigate("/seller-customers");
    };

    const handleEdit = () => {
        const actualSellerId = getSellerId(customer);
        const actualCustomerId = getCustomerId(customer);

        if (!actualSellerId || !actualCustomerId) {
            setError("Seller ID or customer ID is unavailable for editing.");
            return;
        }

        navigate(
            `/seller-customers/edit/${actualSellerId}/${actualCustomerId}`
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <CircularProgress />
                    <Typography color="text.secondary">
                        Loading customer details...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                    Customer Details
                </Typography>

                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to Customers
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={loadCustomer}
                    >
                        Retry
                    </Button>
                </Stack>
            </Box>
        );
    }

    if (!customer) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Customer not found.
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Customers
                </Button>
            </Box>
        );
    }

    // =====================================================
    // NORMALIZE CUSTOMER FIELDS
    // =====================================================

    const CustomerId = getCustomerId(customer);
    const SellerId = getSellerId(customer);

    const CustomerCode = getValue(
        customer, "CustomerCode", "customerCode"
    );

    const CustomerName = getValue(
        customer, "CustomerName", "customerName"
    );

    const ContactPerson = getValue(
        customer, "ContactPerson", "contactPerson"
    );

    const Email = getValue(customer, "Email", "email");
    const Phone = getValue(customer, "Phone", "phone");
    const GSTIN = getValue(customer, "GSTIN", "gstin");

    const AddressLine1 = getValue(
        customer, "AddressLine1", "addressLine1"
    );

    const AddressLine2 = getValue(
        customer, "AddressLine2", "addressLine2"
    );

    const City = getValue(customer, "City", "city");
    const State = getValue(customer, "State", "state");
    const Country = getValue(customer, "Country", "country");

    const PostalCode = getValue(
        customer, "PostalCode", "postalCode"
    );

    const CreditLimit = getValue(
        customer, "CreditLimit", "creditLimit", 0
    );

    const rawIsActive = getValue(
        customer, "IsActive", "isActive", false
    );

    const IsActive = isTrue(rawIsActive);

    const CreatedDate = getValue(
        customer, "CreatedDate", "createdDate"
    );

    const UpdatedDate = getValue(
        customer, "UpdatedDate", "updatedDate"
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, pb: 5 }}>
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Customer Details
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        View seller customer information
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Seller ID: {SellerId} | Customer ID: {CustomerId}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Customer
                    </Button>
                </Stack>
            </Stack>

            {/* CUSTOMER INFORMATION */}

            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Customer Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Field label="Customer ID" value={CustomerId} />
                        <Field label="Seller ID" value={SellerId} />
                        <Field label="Customer Code" value={CustomerCode} />
                        <Field label="Customer Name" value={CustomerName} />
                        <Field label="Contact Person" value={ContactPerson} />
                        <Field label="Email" value={Email} />
                        <Field label="Phone" value={Phone} />
                        <Field label="GSTIN" value={GSTIN} />
                    </Grid>
                </CardContent>
            </Card>

            {/* ADDRESS INFORMATION */}

            <SectionCard title="Address Information">
                <Field label="Address Line 1" value={AddressLine1} />
                <Field label="Address Line 2" value={AddressLine2} />
                <Field label="City" value={City} />
                <Field label="State" value={State} />
                <Field label="Country" value={Country} />
                <Field label="Postal Code" value={PostalCode} />
            </SectionCard>

            {/* ACCOUNT INFORMATION */}

            <SectionCard title="Account Information">
                <Field
                    label="Credit Limit"
                    value={formatCurrency(CreditLimit)}
                />

                <Grid xs={12} sm={6}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 1 }}
                    >
                        Status
                    </Typography>

                    <Chip
                        label={IsActive ? "Active" : "Inactive"}
                        color={IsActive ? "success" : "error"}
                    />
                </Grid>

                <Field
                    label="Created Date"
                    value={formatDate(CreatedDate)}
                />

                <Field
                    label="Updated Date"
                    value={formatDate(UpdatedDate)}
                />
            </SectionCard>

            {/* BOTTOM ACTIONS */}

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{ mt: 3 }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Customers
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                >
                    Edit Customer
                </Button>
            </Stack>
        </Box>
    );
};

export default SellerCustomerView;
