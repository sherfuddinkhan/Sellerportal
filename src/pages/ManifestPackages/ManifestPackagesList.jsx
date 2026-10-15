
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    CircularProgress
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import ManifestPackagesList from "./ManifestPackagesList";

const API_URL = "http://localhost:5000/api/manifest-packages";

const ManifestPackagesPage = () => {
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchManifestPackages = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`${API_URL}/all`);

            console.log("MANIFEST PACKAGES API RESPONSE:", response.data);

            const data = response.data;

            let result = [];

            if (Array.isArray(data)) {
                result = data;
            } else if (Array.isArray(data?.$values)) {
                result = data.$values;
            } else if (Array.isArray(data?.data)) {
                result = data.data;
            } else if (Array.isArray(data?.items)) {
                result = data.items;
            }

            setRecords(result);
        } catch (err) {
            console.error(
                "FETCH MANIFEST PACKAGES ERROR:",
                err.response?.data || err.message
            );

            setRecords([]);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load manifest packages."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchManifestPackages();
    }, [fetchManifestPackages]);

    const getId = (record) =>
        record?.manifestPackageId ??
        record?.ManifestPackageId ??
        record?.id ??
        record?.Id;

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Manifest Packages
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            View and manage shipping manifest packages.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchManifestPackages}
                            disabled={loading}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() =>
                                navigate("/manifest-packages/create")
                            }
                        >
                            Create
                        </Button>
                    </Stack>
                </Stack>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={fetchManifestPackages}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {loading && records.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }} color="text.secondary">
                            Loading manifest packages...
                        </Typography>
                    </Box>
                ) : (
                    <ManifestPackagesList
                        records={records}
                        loading={loading}
                        onCreate={() =>
                            navigate("/manifest-packages/create")
                        }
                        onView={(record) => {
                            const id = getId(record);

                            if (id != null) {
                                navigate(`/manifest-packages/view/${id}`);
                            }
                        }}
                        onEdit={(record) => {
                            const id = getId(record);

                            if (id != null) {
                                navigate(`/manifest-packages/${id}/edit`);
                            }
                        }}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default ManifestPackagesPage;
