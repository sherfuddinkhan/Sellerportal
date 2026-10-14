import React, { useEffect, useState } from "react";
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

import {
    ArrowBack,
    DeleteForever,
    WarningAmber
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/VendorItemMaster";

const getField = (item, camelCase, pascalCase, fallback = "") =>
    item?.[camelCase] ?? item?.[pascalCase] ?? fallback;

const DeleteVendorItemMasterDialog= () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadItem = async () => {
            try {
                setLoading(true);
                setError("");

                // Load available records and locate the requested item.
                const response = await axios.get(`${API_URL}/all`);

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ??
                      response.data?.items ??
                      [];

                const found = data.find((record) => {
                    const recordId = getField(
                        record,
                        "vendorItemMasterId",
                        "VendorItemMasterId",
                        getField(record, "id", "Id", null)
                    );

                    return String(recordId) === String(id);
                });

                if (!found) {
                    if (!cancelled) {
                        setError(
                            `Vendor item master with ID ${id} was not found.`
                        );
                    }
                    return;
                }

                if (!cancelled) {
                    setItem(found);
                }
            } catch (err) {
                console.error("LOAD VENDOR ITEM MASTER ERROR:", err);

                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.title ||
                        err.response?.data?.detail ||
                        err.message ||
                        "Unable to load vendor item master."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            loadItem();
        } else {
            setError("Vendor item master ID is missing.");
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleDelete = async () => {
        if (!item || deleting) return;

        const sellerId = Number(
            getField(item, "sellerId", "SellerId", 0)
        );

        const customerId = Number(
            getField(item, "customerId", "CustomerId", 0)
        );

        const itemId = Number(
            getField(
                item,
                "vendorItemMasterId",
                "VendorItemMasterId",
                id
            )
        );

        if (
            !Number.isInteger(itemId) ||
            itemId <= 0 ||
            !Number.isInteger(sellerId) ||
            sellerId <= 0 ||
            !Number.isInteger(customerId) ||
            customerId <= 0
        ) {
            setError(
                "The item ID, seller ID, or customer ID is invalid."
            );
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await axios.delete(
                `${API_URL}/${itemId}/seller/${sellerId}/customer/${customerId}`
            );

            navigate("/vendor-item-masters", {
                replace: true,
                state: {
                    successMessage:
                        "Vendor item master deleted successfully."
                }
            });
        } catch (err) {
            console.error(
                "DELETE VENDOR ITEM MASTER ERROR:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.detail ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                err.message ||
                "Failed to delete vendor item master."
            );
        } finally {
            setDeleting(false);
        }
    };

    const itemId = getField(
        item,
        "vendorItemMasterId",
        "VendorItemMasterId",
        id
    );

    const vendorId = getField(item, "vendorId", "VendorId", "—");
    const sellerId = getField(item, "sellerId", "SellerId", "—");
    const customerId = getField(item, "customerId", "CustomerId", "—");

    const vendorSkuCode = getField(
        item,
        "vendorSkuCode",
        "VendorSkuCode",
        "—"
    );

    const itemSkuCode = getField(
        item,
        "itemSkuCode",
        "ItemSkuCode",
        "—"
    );

    const itemCode = getField(item, "itemCode", "ItemCode", "—");
    const sku = getField(item, "SKU", "SKU", "—");
    const costPrice = getField(item, "costPrice", "CostPrice", "—");
    const sellingPrice = getField(
        item,
        "sellingPrice",
        "SellingPrice",
        "—"
    );

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 850,
                    mx: "auto",
                    p: { xs: 2, md: 3 },
                    borderRadius: 2
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    mb={2}
                >
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Delete Vendor Item Master
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Review the record before confirming deletion.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/vendor-item-masters")}
                        disabled={deleting}
                    >
                        Back to List
                    </Button>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {loading && (
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        py={4}
                        justifyContent="center"
                    >
                        <CircularProgress size={24} />
                        <Typography>Loading vendor item details...</Typography>
                    </Box>
                )}

                {!loading && error && !item && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {!loading && item && (
                    <>
                        <Alert
                            severity="warning"
                            icon={<WarningAmber />}
                            sx={{ mb: 3 }}
                        >
                            You are about to permanently delete this vendor
                            item master. Verify the details before proceeding.
                        </Alert>

                        <Box
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 2.5,
                                mb: 3
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                                Vendor Item Details
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1.5}>
                                <Detail label="Record ID" value={itemId} />
                                <Detail label="Vendor ID" value={vendorId} />
                                <Detail label="Seller ID" value={sellerId} />
                                <Detail label="Customer ID" value={customerId} />
                                <Detail
                                    label="Vendor SKU Code"
                                    value={vendorSkuCode}
                                />
                                <Detail
                                    label="Item SKU Code"
                                    value={itemSkuCode}
                                />
                                <Detail label="Item Code" value={itemCode} />
                                <Detail label="SKU" value={sku} />
                                <Detail
                                    label="Cost Price"
                                    value={costPrice}
                                />
                                <Detail
                                    label="Selling Price"
                                    value={sellingPrice}
                                />
                            </Stack>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Stack
                            direction={{ xs: "column-reverse", sm: "row" }}
                            justifyContent="flex-end"
                            spacing={1.5}
                        >
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate("/vendor-item-masters")
                                }
                                disabled={deleting}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={
                                    deleting ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <DeleteForever />
                                    )
                                }
                                onClick={handleDelete}
                                disabled={deleting || loading}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Confirm Delete"}
                            </Button>
                        </Stack>
                    </>
                )}
            </Paper>
        </Box>
    );
};

const Detail = ({ label, value }) => (
    <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={0.5}
    >
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 170 }}
        >
            {label}
        </Typography>

        <Typography
            variant="body2"
            fontWeight={600}
            sx={{ overflowWrap: "anywhere" }}
        >
            {value ?? "—"}
        </Typography>
    </Stack>
);

export default DeleteVendorItemMasterDialog;
