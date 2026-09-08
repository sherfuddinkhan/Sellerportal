import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import MarketplaceCard from "./MarketplaceCard";

const SERVER_URL = "http://localhost:5000";

const MarketplaceCardPage = () => {
    const [marketplaces, setMarketplaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(
                    `${SERVER_URL}/api/marketplaces`
                );

                setMarketplaces(
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.data ?? []
                );
            } catch (err) {
                setError("Unable to load marketplaces.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const deleteMarketplace = async (id) => {
        if (!window.confirm("Delete this marketplace?")) {
            return;
        }

        try {
            await axios.delete(
                `${SERVER_URL}/api/marketplaces/${id}`
            );

            setMarketplaces((prev) =>
                prev.filter(
                    (item) =>
                        (item.marketplaceId ??
                            item.MarketplaceId) !== id
                )
            );
        } catch {
            setError("Unable to delete marketplace.");
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
                Marketplace Cards
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {marketplaces.map((item) => {
                    const id =
                        item.marketplaceId ??
                        item.MarketplaceId;

                    return (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={id}
                        >
                            <MarketplaceCard
                                marketplace={item}
                                onView={(id) =>
                                    navigate(
                                        `/marketplaces/details/${id}`
                                    )
                                }
                                onEdit={(id) =>
                                    navigate(
                                        `/marketplaces/edit/${id}`
                                    )
                                }
                                onDelete={deleteMarketplace}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default MarketplaceCardPage;