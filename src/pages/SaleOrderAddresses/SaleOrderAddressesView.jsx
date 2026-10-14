import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
    Chip
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

const API_URL = "http://localhost:5000/api/SaleOrderAddresses";

function SaleOrderAddressesView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getValue = (item, camelCase, pascalCase, fallback = "—") =>
        item?.[camelCase] ?? item?.[pascalCase] ?? fallback;
const fetchAddress = useCallback(async () => {
    if (!id) {
        setAddress(null);
        setError("Address ID was not provided in the URL.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError("");

    try {
        const addressId = decodeURIComponent(id);
        let foundAddress = null;

        // First attempt: retrieve the individual address.
        try {
            const response = await axios.get(
                `${API_URL}/${encodeURIComponent(addressId)}`,
                {
                    headers: { Accept: "*/*" },
                    timeout: 15000
                }
            );

            const data = response.data;

            if (data && !Array.isArray(data) && typeof data === "object") {
                foundAddress = data;
            } else if (Array.isArray(data)) {
                foundAddress = data.find((item) =>
                    String(
                        item.addressId ??
                        item.AddressId ??
                        item.id ??
                        item.Id ??
                        ""
                    ).toLowerCase() === addressId.toLowerCase()
                );
            }
        } catch (lookupError) {
            // Fall back to the all-addresses endpoint only for 404.
            if (lookupError.response?.status !== 404) {
                throw lookupError;
            }
        }

        // Fallback: fetch all and match the string addressId.
        if (!foundAddress) {
            const response = await axios.get(API_URL, {
                headers: { Accept: "*/*" },
                timeout: 15000
            });

            const data = response.data;
            const addresses = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.items)
                        ? data.items
                        : [];

            foundAddress = addresses.find((item) => {
                const itemId =
                    item.addressId ??
                    item.AddressId ??
                    item.id ??
                    item.Id ??
                    "";

                return String(itemId).toLowerCase() ===
                    addressId.toLowerCase();
            });
        }

        if (!foundAddress) {
            setAddress(null);
            setError(
                `Sale order address "${addressId}" was not found. ` +
                "Verify the Address ID and the backend API response."
            );
            return;
        }

        setAddress(foundAddress);
    } catch (err) {
        console.error(
            "FETCH SALE ORDER ADDRESS VIEW ERROR:",
            err.response?.data || err.message
        );

        const responseData = err.response?.data;
        const message =
            typeof responseData === "string"
                ? responseData
                : responseData?.message ||
                  responseData?.title ||
                  responseData?.details ||
                  err.message;

        setAddress(null);
        setError(
            message || "Failed to retrieve sale order address."
        );
    } finally {
        setLoading(false);
    }
}, [id]);


    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);

    const handleBack = () => {
        navigate("/sale-order-addresses");
    };

    const handleEdit = () => {
        if (!id) return;

        navigate(
            `/sale-order-addresses/edit/${encodeURIComponent(decodeURIComponent(id))}`
        );
    };

    const handleDelete = () => {
        if (!id) return;

        navigate(
            `/sale-order-addresses/delete/${encodeURIComponent(decodeURIComponent(id))}`
        );
    };

    const renderDetail = (label, value) => (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
            >
                {value === null || value === undefined || value === ""
                    ? "—"
                    : String(value)}
            </Typography>
        </Box>
    );

    const fullAddress = address
        ? [
            getValue(address, "addressLine1", "AddressLine1", ""),
            getValue(address, "addressLine2", "AddressLine2", ""),
            getValue(address, "city", "City", ""),
            getValue(address, "state", "State", ""),
            getValue(address, "pincode", "Pincode", "")
        ]
            .filter((value) => String(value).trim() !== "")
            .join(", ")
        : "";

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 3
                }}
            >
                <CircularProgress />
                <Typography color="text.secondary">
                    Loading sale order address...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Sale Order Address
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        View customer, sales order, address, and geographic details.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Back to List
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchAddress}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchAddress}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {!address ? (
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Address Not Found
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        No sale order address was returned for ID "{id}".
                    </Typography>

                    <Button variant="contained" onClick={handleBack}>
                        Return to Address List
                    </Button>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    <Paper
                        elevation={2}
                        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                    >
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={2}
                        >
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ mb: 1 }}
                                >
                                    <PersonIcon color="primary" />

                                    <Typography variant="h5" fontWeight={700}>
                                        {getValue(address, "name", "Name", "Customer")}
                                    </Typography>
                                </Stack>

                                <Chip
                                    label={`Address ID: ${getValue(
                                        address,
                                        "addressId",
                                        "AddressId",
                                        id
                                    )}`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                    >
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Order and Customer Information
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    md: "repeat(3, minmax(0, 1fr))"
                                },
                                gap: 3
                            }}
                        >
                            {renderDetail(
                                "Address ID",
                                getValue(address, "addressId", "AddressId", id)
                            )}

                            {renderDetail(
                                "Sales Order ID",
                                getValue(address, "salesOrderId", "SalesOrderId")
                            )}

                            {renderDetail(
                                "Customer Name",
                                getValue(address, "name", "Name")
                            )}
                        </Box>
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <LocationOnIcon color="primary" />

                            <Typography variant="h6" fontWeight={700}>
                                Address Information
                            </Typography>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    md: "repeat(3, minmax(0, 1fr))"
                                },
                                gap: 3
                            }}
                        >
                            {renderDetail(
                                "Address Line 1",
                                getValue(address, "addressLine1", "AddressLine1")
                            )}

                            {renderDetail(
                                "Address Line 2",
                                getValue(address, "addressLine2", "AddressLine2")
                            )}

                            {renderDetail(
                                "City",
                                getValue(address, "city", "City")
                            )}

                            {renderDetail(
                                "State",
                                getValue(address, "state", "State")
                            )}

                            {renderDetail(
                                "State Code",
                                getValue(address, "stateCode", "StateCode")
                            )}

                            {renderDetail(
                                "Country Code",
                                getValue(address, "countryCode", "CountryCode")
                            )}

                            {renderDetail(
                                "Pincode",
                                getValue(address, "pincode", "Pincode")
                            )}

                            <Box sx={{ gridColumn: { md: "1 / -1" } }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mb: 0.5 }}
                                >
                                    Full Address
                                </Typography>

                                <Typography variant="body1">
                                    {fullAddress || "—"}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <ContactPhoneIcon color="primary" />

                            <Typography variant="h6" fontWeight={700}>
                                Contact Information
                            </Typography>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))"
                                },
                                gap: 3
                            }}
                        >
                            {renderDetail(
                                "Phone",
                                getValue(address, "phone", "Phone")
                            )}

                            {renderDetail(
                                "Email",
                                getValue(address, "email", "Email")
                            )}
                        </Box>
                    </Paper>

                    <Paper
                        elevation={2}
                        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                    >
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Geographic Coordinates
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))"
                                },
                                gap: 3
                            }}
                        >
                            {renderDetail(
                                "Latitude",
                                getValue(address, "latitude", "Latitude")
                            )}

                            {renderDetail(
                                "Longitude",
                                getValue(address, "longitude", "Longitude")
                            )}
                        </Box>
                    </Paper>
                </Stack>
            )}
        </Box>
    );
}

export default SaleOrderAddressesView;
