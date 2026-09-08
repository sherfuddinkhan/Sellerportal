
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControlLabel,
    Switch,
    Button,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const SERVER_URL = "http://localhost:5000";

const MarketplaceEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        marketplaceName: "",
        marketplaceCode: "",
        isActive: true
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(
                    `${SERVER_URL}/api/marketplaces/${id}`
                );

                const data = response.data;

                setForm({
                    marketplaceName:
                        data.marketplaceName ??
                        data.MarketplaceName ??
                        "",
                    marketplaceCode:
                        data.marketplaceCode ??
                        data.MarketplaceCode ??
                        "",
                    isActive:
                        data.isActive ??
                        data.IsActive ??
                        true
                });
            } catch (err) {
                setError(
                    "Unable to load marketplace."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await axios.put(
                `${SERVER_URL}/api/marketplaces/${id}`,
                form
            );

            navigate(`/marketplaces/details/${id}`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update marketplace."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                py={8}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Edit Marketplace
            </Typography>

            <Paper sx={{ p: 3, maxWidth: 700 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Marketplace Name"
                            name="marketplaceName"
                            value={form.marketplaceName}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Marketplace Code"
                            name="marketplaceCode"
                            value={form.marketplaceCode}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />
                            }
                            label="Active"
                        />

                        <Box display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update"}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate("/marketplaces")
                                }
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default MarketplaceEdit;