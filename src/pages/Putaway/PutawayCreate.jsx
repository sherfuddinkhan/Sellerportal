// =============================================================
// File: src/pages/putaways/PutawayCreate.jsx
// =============================================================

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Link,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon
} from "@mui/icons-material";

import PutawayForm from "./PutawayForm";

const API_URL = "/api/Putaway";

const DEFAULT_SELLER_ID = 6;
const DEFAULT_CUSTOMER_ID = 3;

function PutawayCreate({
    sellerId = DEFAULT_SELLER_ID,
    customerId = DEFAULT_CUSTOMER_ID
}) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError("");

        try {
            const currentSellerId = Number(sellerId);
            const currentCustomerId = Number(customerId);

            if (
                !Number.isInteger(currentSellerId) ||
                currentSellerId <= 0 ||
                !Number.isInteger(currentCustomerId) ||
                currentCustomerId <= 0
            ) {
                setError("Valid Seller ID and Customer ID are required.");
                return;
            }

            const payload = {
                putawayCode: String(
                    formData.putawayCode ?? ""
                ).trim(),

                shelfCode: String(
                    formData.shelfCode ?? ""
                ).trim(),

                itemTypeSkuCode: String(
                    formData.itemTypeSkuCode ?? ""
                ).trim(),

                putawayQuantity: Number(
                    formData.putawayQuantity ?? 0
                ),

                batchCode: String(
                    formData.batchCode ?? ""
                ).trim(),

                inventoryType: String(
                    formData.inventoryType ?? ""
                ).trim(),

                statusCode: String(
                    formData.statusCode ?? "Pending"
                ).trim(),

                facilityCode: String(
                    formData.facilityCode ?? ""
                ).trim(),

                putawayType: String(
                    formData.putawayType ?? ""
                ).trim(),

                createdBy: String(
                    formData.createdBy ?? ""
                ).trim(),

                sellerId: currentSellerId,
                customerId: currentCustomerId
            };

            if (!payload.putawayCode) {
                setError("Putaway Code is required.");
                return;
            }

            if (!payload.itemTypeSkuCode) {
                setError("Item Type SKU Code is required.");
                return;
            }

            if (
                !Number.isFinite(payload.putawayQuantity) ||
                payload.putawayQuantity <= 0
            ) {
                setError(
                    "Putaway Quantity must be greater than zero."
                );
                return;
            }

            const response = await axios.post(
                `${API_URL}/seller/${currentSellerId}/customer/${currentCustomerId}`,
                payload
            );

            if (response.status >= 200 && response.status < 300) {
                navigate("/putaways", {
                    state: {
                        message: "Putaway created successfully."
                    }
                });
            }
        } catch (err) {
            console.error(
                "Create Putaway Error:",
                err.response?.data || err.message
            );

            const responseData = err.response?.data;

            setError(
                responseData?.message ||
                responseData?.Message ||
                responseData?.title ||
                (typeof responseData === "string"
                    ? responseData
                    : null) ||
                err.message ||
                "Failed to create putaway."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                mb={2}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Create Putaway
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Create a new inventory putaway record.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/putaways")}
                    disabled={loading}
                >
                    Back to Putaways
                </Button>
            </Box>

            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </Link>

                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/putaways")}
                >
                    Putaways
                </Link>

                <Typography color="text.primary">
                    Create
                </Typography>
            </Breadcrumbs>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 3 }}
                >
                    Putaway Information
                </Typography>

                <PutawayForm
                    initialData={{
                        putawayCode: "",
                        shelfCode: "",
                        itemTypeSkuCode: "",
                        putawayQuantity: 0,
                        batchCode: "",
                        inventoryType: "",
                        statusCode: "Pending",
                        facilityCode: "",
                        putawayType: "",
                        createdBy: "",
                        sellerId: Number(sellerId),
                        customerId: Number(customerId)
                    }}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/putaways")}
                    loading={loading}
                    submitLabel="Create Putaway"
                    submitIcon={<SaveIcon />}
                />

                {loading && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                        mt={2}
                    >
                        <CircularProgress size={22} />

                        <Typography variant="body2">
                            Creating putaway...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default PutawayCreate;
