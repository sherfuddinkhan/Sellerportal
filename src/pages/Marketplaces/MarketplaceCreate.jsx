import React, { useState } from "react";
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
    Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SERVER_URL = "http://localhost:5000";

const MarketplaceCreate = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        marketplaceName: "",
        marketplaceCode: "",
        isActive: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            setLoading(true);
            setError("");

            await axios.post(
                `${SERVER_URL}/api/marketplaces`,
                form
            );

            navigate("/marketplaces");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create marketplace."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Create Marketplace
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
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Create"}
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

export default MarketplaceCreate;