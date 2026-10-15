
import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import PutawayForm, { getPutawayValue } from "./PutawayForm";

// Node.js proxy running on port 5000
const API_URL = "http://localhost:5000/api/Putaway";

export default function PutawayEdit({
    sellerId = 6,
    customerId = 3
}) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [putaway, setPutaway] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        let active = true;

        const fetchPutaway = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(
                    `${API_URL}/${id}/seller/${sellerId}/customer/${customerId}`
                );

                const result =
                    response.data?.data ??
                    response.data?.Data ??
                    response.data;

                if (active) {
                    setPutaway(result);
                }
            } catch (err) {
                console.error(
                    "Fetch Putaway Error:",
                    err.response?.data || err.message
                );

                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.title ||
                        err.message ||
                        "Failed to load putaway."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        if (id && sellerId && customerId) {
            fetchPutaway();
        } else {
            setError(
                "Putaway ID, seller ID, and customer ID are required."
            );
            setLoading(false);
        }

        return () => {
            active = false;
        };
    }, [id, sellerId, customerId]);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setError("");

        try {
            const payload = {
                putawayId: Number(
                    getPutawayValue(putaway, "putawayId", id)
                ),
                putawayCode: formData.putawayCode,
                shelfCode: formData.shelfCode,
                itemTypeSkuCode: formData.itemTypeSkuCode,
                putawayQuantity: Number(formData.putawayQuantity),
                batchCode: formData.batchCode ?? "",
                inventoryType: formData.inventoryType,
                statusCode: formData.statusCode,
                facilityCode: formData.facilityCode,
                putawayType: formData.putawayType,
                createdBy: formData.createdBy,
                sellerId: Number(sellerId),
                customerId: Number(customerId)
            };

            const response = await axios.put(
                `${API_URL}/${id}/seller/${sellerId}/customer/${customerId}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Putaway Updated:", response.data);

            navigate("/putaways");
        } catch (err) {
            console.error(
                "Update Putaway Error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to update putaway."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>
                    Loading putaway...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 3 }}
            >
                Edit Putaway
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {putaway && (
                <PutawayForm
                    initialData={putaway}
                    sellerId={sellerId}
                    customerId={customerId}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/putaways")}
                    loading={saving}
                    error={error}
                />
            )}
        </Box>
    );
}
