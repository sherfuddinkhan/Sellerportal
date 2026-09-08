import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Button,
    Stack
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const SERVER_URL = "http://localhost:5000";

const MarketplaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [marketplace, setMarketplace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(
                    `${SERVER_URL}/api/marketplaces/${id}`
                );

                setMarketplace(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Marketplace not found."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

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

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    const name =
        marketplace?.marketplaceName ??
        marketplace?.MarketplaceName ??
        "-";

    const code =
        marketplace?.marketplaceCode ??
        marketplace?.MarketplaceCode ??
        "-";

    const active =
        marketplace?.isActive ??
        marketplace?.IsActive ??
        false;

    return (
        <Box p={3}>
            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Marketplace Details
            </Typography>

            <Paper sx={{ p: 3, maxWidth: 700 }}>
                <Stack spacing={2}>
                    <Typography>
                        <strong>ID:</strong> {id}
                    </Typography>

                    <Typography>
                        <strong>Name:</strong> {name}
                    </Typography>

                    <Typography>
                        <strong>Code:</strong> {code}
                    </Typography>

                    <Box>
                        <strong>Status:</strong>{" "}
                        <Chip
                            label={
                                active
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                active
                                    ? "success"
                                    : "default"
                            }
                        />
                    </Box>

                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    `/marketplaces/edit/${id}`
                                )
                            }
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/marketplaces")
                            }
                        >
                            Back
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default MarketplaceDetails;