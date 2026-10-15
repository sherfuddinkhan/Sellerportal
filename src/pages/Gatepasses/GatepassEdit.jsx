
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = "http://localhost:5000/api/Gatepass";

const GatepassEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        gatepassId: "",
        gatepassCode: "",
        facilityCode: "",
        itemSkuCode: "",
        quantity: 1,
        reason: "",
        status: "Created",
        createdBy: "",
        sellerId: "",
        customerId: "",
        createdDate: ""
    });

    useEffect(() => {
        const fetchGatepass = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(`${API_URL}/all`);
                const result = response.data;

                const items = Array.isArray(result)
                    ? result
                    : result?.data ??
                      result?.Data ??
                      result?.items ??
                      result?.gatepasses ??
                      result?.Gatepasses ??
                      [];

                const item = items.find(
                    (record) =>
                        String(
                            record.gatepassId ??
                            record.GatepassId ??
                            record.id ??
                            record.Id
                        ) === String(id)
                );

                if (!item) {
                    setError(`Gatepass ID ${id} was not found.`);
                    return;
                }

                setForm({
                    gatepassId: item.gatepassId ?? item.GatepassId ?? id,
                    gatepassCode: item.gatepassCode ?? item.GatepassCode ?? "",
                    facilityCode: item.facilityCode ?? item.FacilityCode ?? "",
                    itemSkuCode: item.itemSkuCode ?? item.ItemSkuCode ?? "",
                    quantity: item.quantity ?? item.Quantity ?? 1,
                    reason: item.reason ?? item.Reason ?? "",
                    status: item.status ?? item.Status ?? "Created",
                    createdBy: item.createdBy ?? item.CreatedBy ?? "",
                    sellerId: item.sellerId ?? item.SellerId ?? "",
                    customerId: item.customerId ?? item.CustomerId ?? "",
                    createdDate: item.createdDate ?? item.CreatedDate ?? ""
                });
            } catch (err) {
                console.error("Fetch Gatepass Error:", err);

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.Message ||
                    err.message ||
                    "Failed to load gatepass."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGatepass();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: name === "quantity" ? value : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const sellerId = Number(form.sellerId);
        const customerId = Number(form.customerId);
        const quantity = Number(form.quantity);

        if (
            !Number.isInteger(sellerId) ||
            sellerId <= 0 ||
            !Number.isInteger(customerId) ||
            customerId <= 0
        ) {
            setError("The gatepass does not contain valid Seller ID and Customer ID.");
            return;
        }

        if (!form.gatepassCode.trim() || !form.facilityCode.trim() ||
            !form.itemSkuCode.trim() || !Number.isFinite(quantity) || quantity <= 0) {
            setError("Enter a gatepass code, facility code, SKU code, and valid quantity.");
            return;
        }

        const payload = {
            gatepassId: Number(id),
            gatepassCode: form.gatepassCode.trim(),
            facilityCode: form.facilityCode.trim(),
            itemSkuCode: form.itemSkuCode.trim(),
            quantity,
            reason: form.reason,
            status: form.status,
            createdBy: form.createdBy,
            sellerId,
            customerId,
            createdDate: form.createdDate || null
        };

        try {
            setSaving(true);

            const response = await axios.put(
                `${API_URL}/${encodeURIComponent(id)}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`,
                payload,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            const result = response.data;

            if (result?.success === false || result?.Success === false) {
                throw new Error(
                    result.message || result.Message || "Gatepass update failed."
                );
            }

            setSuccess("Gatepass updated successfully.");

            setTimeout(() => {
                navigate("/gatepasses");
            }, 800);
        } catch (err) {
            console.error("Update Gatepass Error:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.message ||
                "Failed to update gatepass."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/gatepasses")}
                >
                    Back
                </Button>

                <Typography variant="h5" fontWeight="bold">
                    Edit Gatepass #{id}
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Card>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Gatepass Code"
                                    name="gatepassCode"
                                    value={form.gatepassCode}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Facility Code"
                                    name="facilityCode"
                                    value={form.facilityCode}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Item SKU Code"
                                    name="itemSkuCode"
                                    value={form.itemSkuCode}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Quantity"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    inputProps={{ min: 1 }}
                                    required
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    {["Created", "Pending", "Approved", "Completed", "Cancelled"].map(
                                        (status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Created By"
                                    name="createdBy"
                                    value={form.createdBy}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Reason"
                                    name="reason"
                                    value={form.reason}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Seller ID"
                                    value={form.sellerId}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Customer ID"
                                    value={form.customerId}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate("/gatepasses")}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default GatepassEdit;
