import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert, Box, Button, CircularProgress, Divider,
    Paper, Stack, Typography
} from "@mui/material";
import { ArrowBack, Delete, LocalShipping, Refresh } from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/shipping-manifests";

const getField = (record,...keys) => {
    if (!record) return null;
    for (const key of keys) {
        const v = record[key];
        if (v!== undefined && v!== null && v!== "") return v;
    }
    return null;
};

const extractRecord = (data) => {
    if (!data || typeof data!== "object") return null;
    return data.data || data.Data || data.item || data.Item || data.record || data.Record || data;
};

const getErrorMessage = (error) => {
    const data = error?.response?.data;
    if (typeof data === "string") return data;
    if (data?.errors) return Object.values(data.errors).flat().join(" ");
    return data?.message || data?.Message || data?.title || error?.message || "Not Found";
};

export default function DeleteShippingManifestDialog() {
    const navigate = useNavigate();
    const { id } = useParams(); // id is shippingManifestCode like SM-1791975656032

    const [manifest, setManifest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const isInvalidHash = id && /^-?\d+$/.test(id) &&!id.startsWith("SM-");

    const fetchManifest = async () => {
        if (!id) { setError("Manifest ID missing"); setLoading(false); return; }
        if (isInvalidHash) {
            setError(`Invalid manifest identifier "${id}". This looks like a hash code, not a manifest code. Your list is passing wrong ID. Use shippingManifestCode like SM-1791975656032. Go back to list and fix the Delete link to use row.shippingManifestCode`);
            setLoading(false);
            return;
        }
        setLoading(true); setError("");
        try {
            const res = await axios.get(`${API_URL}/${encodeURIComponent(id)}`, { headers: { Accept: "application/json" } });
            const record = extractRecord(res.data);
            if (!record) throw new Error("Not Found");
            setManifest(record);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err) + ` (Tried: ${id})`);
            setManifest(null);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchManifest(); }, [id]);

    const handleDelete = async () => {
        if (!id || deleting) return;
        setDeleting(true); setError("");
        try {
            await axios.delete(`${API_URL}/${encodeURIComponent(id)}`);
            navigate("/shipping-manifests", { replace: true, state: { message: "Deleted" } });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally { setDeleting(false); }
    };

    if (loading) {
        return <Box sx={{ p: 3 }}><Paper sx={{ p: 5, textAlign: "center" }}><CircularProgress /><Typography sx={{ mt: 2 }}>Loading...</Typography></Paper></Box>;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 850, mx: "auto" }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/shipping-manifests")} disabled={deleting}>Back</Button>
                <Typography variant="h5" fontWeight={700}>Delete Shipping Manifest</Typography>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button size="small" startIcon={<Refresh />} onClick={fetchManifest}>Retry</Button>}>{error}</Alert>}

            {manifest && (
                <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
                    <Box sx={{ p: 3, bgcolor: "error.main", color: "#fff" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Delete sx={{ fontSize: 36 }} />
                            <Box><Typography variant="h6" fontWeight={700}>Confirm Deletion</Typography><Typography variant="body2">This action may not be reversible.</Typography></Box>
                        </Stack>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <LocalShipping color="primary" fontSize="large" />
                            <Box>
                                <Typography variant="h6" fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
                                    {getField(manifest, "shippingManifestCode", "ShippingManifestCode") || id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Manifest Code: {id}</Typography>
                            </Box>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1.5}>
                            <Typography variant="body2"><b>Channel:</b> {getField(manifest, "channel", "Channel") || "—"}</Typography>
                            <Typography variant="body2"><b>Provider:</b> {getField(manifest, "shippingProviderName", "ShippingProviderName") || "—"}</Typography>
                            <Typography variant="body2"><b>Tracking:</b> {getField(manifest, "trackingNumber", "TrackingNumber") || "—"}</Typography>
                            <Typography variant="body2"><b>Status:</b> {getField(manifest, "status", "Status") || "—"}</Typography>
                        </Stack>
                        <Divider sx={{ my: 3 }} />
                        <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/shipping-manifests")} disabled={deleting}>Cancel</Button>
                            <Button variant="contained" color="error" startIcon={deleting? <CircularProgress size={18} color="inherit"/> : <Delete />} onClick={handleDelete} disabled={deleting}>Confirm Delete</Button>
                        </Stack>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}
