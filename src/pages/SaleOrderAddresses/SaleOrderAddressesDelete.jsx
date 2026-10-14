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
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const API_URL = "http://localhost:5000/api/sale-order-addresses";

function SaleOrderAddressesDelete() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [address, setAddress] = useState(null);
    const [recordId, setRecordId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const getValue = (item, camel, pascal, fallback = "—") =>
        item?.[camel] ?? item?.[pascal] ?? fallback;

    // Only use an actual numeric database primary key.
    const getDatabaseId = (item) => {
        const candidates = [
            item?.id,
            item?.Id,
            item?.saleOrderAddressId,
            item?.SaleOrderAddressId,
            item?.saleOrderAddressesId,
            item?.SaleOrderAddressesId,
            item?.addressRecordId,
            item?.AddressRecordId
        ];

        for (const value of candidates) {
            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== "" &&
                /^\d+$/.test(String(value).trim())
            ) {
                return Number(value);
            }
        }

        return null;
    };

    const fetchAddress = useCallback(async () => {
        setLoading(true);
        setError("");
        setAddress(null);
        setRecordId(null);

        try {
            const requestedId = decodeURIComponent(id || "").trim();

            // Fetch all records through the Node proxy.
            const response = await axios.get(`${API_URL}/all`);

            const data = response.data;
            const addresses = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.items)
                        ? data.items
                        : [];

            // Match the string business ID or the numeric database ID.
            const found = addresses.find((item) => {
                const businessId = getValue(item, "addressId", "AddressId", "");
                const databaseId = getDatabaseId(item);

                return (
                    String(businessId).trim().toLowerCase() ===
                        requestedId.toLowerCase() ||
                    (databaseId !== null &&
                        String(databaseId) === requestedId)
                );
            });

            if (!found) {
                setError(
                    `Address "${requestedId}" was not found in ${API_URL}/all.`
                );
                return;
            }

            setAddress(found);
            setRecordId(getDatabaseId(found));
        } catch (err) {
            console.error(
                "LOAD SALE ORDER ADDRESS ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load the sale order address."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);

    const handleDelete = async () => {
        if (!address) return;

        if (recordId === null) {
            setError(
                "Cannot delete this address because /all did not return its numeric database primary key. Do not use SalesOrderId as the address ID. Update the API to expose the address record's primary key."
            );
            return;
        }

        setDeleting(true);
        setError("");

        try {
            // ASP.NET DELETE endpoint expects a numeric database ID.
            await axios.delete(`${API_URL}/${recordId}`);

            navigate("/sale-order-addresses", { replace: true });
        } catch (err) {
            console.error(
                "DELETE SALE ORDER ADDRESS ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete the sale order address."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Typography variant="h4" fontWeight={700}>
                    Delete Sale Order Address
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/sale-order-addresses")}
                >
                    Back to List
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!address ? (
                <Paper sx={{ p: 3 }}>
                    <Typography>
                        No address found for ID "{id}".
                    </Typography>
                    <Button
                        sx={{ mt: 2 }}
                        onClick={fetchAddress}
                        variant="outlined"
                    >
                        Retry
                    </Button>
                </Paper>
            ) : (
                <Paper sx={{ p: 4 }}>
                    <Alert
                        severity="warning"
                        icon={<WarningAmberIcon />}
                        sx={{ mb: 3 }}
                    >
                        Are you sure you want to delete this sale order address?
                        This action cannot be undone.
                    </Alert>

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Address ID:{" "}
                        {getValue(address, "addressId", "AddressId")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Database ID: {recordId ?? "Not returned by API"}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography>
                        Sales Order ID:{" "}
                        {getValue(address, "salesOrderId", "SalesOrderId")}
                    </Typography>

                    <Typography>
                        Name: {getValue(address, "name", "Name")}
                    </Typography>

                    <Typography>
                        Address Line 1:{" "}
                        {getValue(address, "addressLine1", "AddressLine1")}
                    </Typography>

                    <Typography>
                        Address Line 2:{" "}
                        {getValue(address, "addressLine2", "AddressLine2")}
                    </Typography>

                    <Typography>
                        City: {getValue(address, "city", "City")}
                    </Typography>

                    <Typography>
                        State: {getValue(address, "state", "State")}
                    </Typography>

                    <Typography>
                        Pincode: {getValue(address, "pincode", "Pincode")}
                    </Typography>

                    <Typography>
                        Phone: {getValue(address, "phone", "Phone")}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="flex-end"
                        spacing={2}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/sale-order-addresses")}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            disabled={deleting || recordId === null}
                        >
                            {deleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </Stack>
                </Paper>
            )}
        </Box>
    );
}

export default SaleOrderAddressesDelete;
