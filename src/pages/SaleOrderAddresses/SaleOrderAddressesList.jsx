import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
    IconButton,
    Tooltip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SaleOrderAddressesTable from "./SaleOrderAddressesTable";

const API_URL = "http://localhost:5000/api/SaleOrderAddresses";

function SaleOrderAddressesList() {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getValue = (item, camelCase, pascalCase) =>
        item?.[camelCase] ?? item?.[pascalCase] ?? "";

    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            // Node proxy maps this request to:
            // GET https://localhost:7203/api/sale-order-addresses/all
            const response = await axios.get(`${API_URL}/all`, {
                headers: {
                    Accept: "*/*"
                },
                timeout: 15000
            });

            const data = response.data;

            if (Array.isArray(data)) {
                setAddresses(data);
            } else if (Array.isArray(data?.data)) {
                setAddresses(data.data);
            } else if (Array.isArray(data?.items)) {
                setAddresses(data.items);
            } else {
                setAddresses([]);
                setError("The API response did not contain a valid address list.");
            }
        } catch (err) {
            console.error("FETCH SALE ORDER ADDRESSES ERROR:", err);

            setAddresses([]);

            setError(
                err.response?.data?.message ||
                err.response?.data?.details ||
                err.message ||
                "Failed to load sale order addresses. Check that the Node.js server is running on port 5000."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const filteredAddresses = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return addresses;
        }

        return addresses.filter((address) => {
            const searchableValues = [
                getValue(address, "addressId", "AddressId"),
                getValue(address, "salesOrderId", "SalesOrderId"),
                getValue(address, "name", "Name"),
                getValue(address, "addressLine1", "AddressLine1"),
                getValue(address, "addressLine2", "AddressLine2"),
                getValue(address, "city", "City"),
                getValue(address, "state", "State"),
                getValue(address, "stateCode", "StateCode"),
                getValue(address, "countryCode", "CountryCode"),
                getValue(address, "pincode", "Pincode"),
                getValue(address, "phone", "Phone"),
                getValue(address, "email", "Email")
            ];

            return searchableValues.some((value) =>
                String(value).toLowerCase().includes(term)
            );
        });
    }, [addresses, searchTerm]);

    const getAddressId = (address) =>
        getValue(address, "addressId", "AddressId") ||
        getValue(address, "id", "Id");

    const handleCreate = () => {
        navigate("/sale-order-addresses/create");
    };

    const handleView = (address) => {
        const id = getAddressId(address);

        if (id === "" || id == null) {
            setError("Cannot view this address because its address ID is missing.");
            return;
        }

        navigate(
            `/sale-order-addresses/view/${encodeURIComponent(String(id))}`
        );
    };

    const handleEdit = (address) => {
        const id = getAddressId(address);

        if (id === "" || id == null) {
            setError("Cannot edit this address because its address ID is missing.");
            return;
        }

        navigate(
            `/sale-order-addresses/edit/${encodeURIComponent(String(id))}`
        );
    };

    const handleDelete = (address) => {
        const id = getAddressId(address);

        if (id === "" || id == null) {
            setError("Cannot delete this address because its address ID is missing.");
            return;
        }

        navigate(
            `/sale-order-addresses/delete/${encodeURIComponent(String(id))}`
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Sale Order Addresses
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage shipping, billing, and customer address information
                        linked to sales orders.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchAddresses}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        Add Address
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 2 }}
                >
                    {typeof error === "string" ? error : "An unexpected API error occurred."}
                </Alert>
            )}

            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Search addresses"
                        placeholder="Search ID, order, customer, city, phone, email..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon
                                    sx={{ mr: 1, color: "text.secondary" }}
                                />
                            )
                        }}
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        {filteredAddresses.length} of {addresses.length} addresses
                    </Typography>
                </Stack>
            </Paper>

            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 6,
                            gap: 2
                        }}
                    >
                        <CircularProgress />
                        <Typography color="text.secondary">
                            Loading sale order addresses...
                        </Typography>
                    </Box>
                ) : addresses.length === 0 ? (
                    <Box sx={{ p: 5, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>
                            No sale order addresses found
                        </Typography>

                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Add an address or refresh the list to check for records.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                        >
                            Add Address
                        </Button>
                    </Box>
                ) : filteredAddresses.length === 0 ? (
                    <Box sx={{ p: 5, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>
                            No matching addresses
                        </Typography>

                        <Typography color="text.secondary">
                            Try a different search term.
                        </Typography>
                    </Box>
                ) : (
                    <SaleOrderAddressesTable
                        addresses={filteredAddresses}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Paper>
        </Box>
    );
}

export default SaleOrderAddressesList;
