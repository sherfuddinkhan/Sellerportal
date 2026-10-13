
import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon
} from "@mui/icons-material";

import { getPutawayValue } from "./PutawayForm";

const API_URL = "http://localhost:5000/api/Putaway";

export default function PutawayView({
    sellerId = 6,
    customerId = 3
}) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [putaway, setPutaway] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
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
                    "Fetch Putaway Details Error:",
                    err.response?.data || err.message
                );

                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.title ||
                        err.message ||
                        "Failed to load putaway details."
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
            setError("Putaway ID, seller ID, and customer ID are required.");
            setLoading(false);
        }

        return () => {
            active = false;
        };
    }, [id, sellerId, customerId]);

    const fields = [
        ["Putaway ID", "putawayId"],
        ["Putaway Code", "putawayCode"],
        ["Shelf Code", "shelfCode"],
        ["Item / SKU Code", "itemTypeSkuCode"],
        ["Putaway Quantity", "putawayQuantity"],
        ["Batch Code", "batchCode"],
        ["Inventory Type", "inventoryType"],
        ["Status", "statusCode"],
        ["Facility Code", "facilityCode"],
        ["Putaway Type", "putawayType"],
        ["Created By", "createdBy"],
        ["Seller ID", "sellerId"],
        ["Customer ID", "customerId"],
        ["Created Date", "createdDate"],
        ["Updated Date", "updatedDate"]
    ];

    const formatValue = (key) => {
        const value = getPutawayValue(putaway, key, "—");

        if (
            ["createdDate", "updatedDate"].includes(key) &&
            value !== "—" &&
            value
        ) {
            const date = new Date(value);

            return Number.isNaN(date.getTime())
                ? String(value)
                : date.toLocaleString();
        }

        return value === null || value === undefined || value === ""
            ? "—"
            : String(value);
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>
                    Loading putaway details...
                </Typography>
            </Box>
        );
    }

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
                    <Typography variant="h5" fontWeight={600}>
                        Putaway Details
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        View the complete details of this putaway record.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/putaways")}
                    >
                        Back to List
                    </Button>

                    {putaway && (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/putaways/${id}/edit`)}
                        >
                            Edit
                        </Button>
                    )}
                </Stack>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => navigate("/putaways")}
                        >
                            Back
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {putaway && (
                <Card variant="outlined">
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            General Information
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            {fields.map(([label, key]) => (
                                <Grid item xs={12} sm={6} md={4} key={key}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        sx={{ mb: 0.5 }}
                                    >
                                        {label}
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        fontWeight={500}
                                        sx={{ overflowWrap: "anywhere" }}
                                    >
                                        {formatValue(key)}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}