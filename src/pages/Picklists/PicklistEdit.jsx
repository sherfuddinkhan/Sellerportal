import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PicklistForm from "./PicklistForm";

const PICKLIST_API_URL = "http://localhost:5000/api/Picklist";

function PicklistEdit() {
    const { picklistCode, id, picklistId } = useParams();
    const navigate = useNavigate();

    const identifier = picklistCode ?? id ?? picklistId;

    const [picklist, setPicklist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadPicklist() {
            if (!identifier) {
                setError("Picklist code is missing from the URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${PICKLIST_API_URL}/${encodeURIComponent(identifier)}`
                );

                if (active) {
                    const data = response.data?.data ?? response.data;

                    if (!data || Array.isArray(data)) {
                        setError("Picklist was not found.");
                    } else {
                        setPicklist(data);
                    }
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.title ||
                        "Unable to load picklist. Check the Node proxy and backend API."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadPicklist();

        return () => {
            active = false;
        };
    }, [identifier]);

    const handleSubmit = async (payload) => {
        const code = picklist?.picklistCode ?? picklist?.PicklistCode ?? identifier;

        try {
            setSaving(true);
            setError("");

            await axios.put(
                `${PICKLIST_API_URL}/${encodeURIComponent(code)}`,
                payload
            );

            navigate(`/picklists/view/${encodeURIComponent(code)}`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Unable to update picklist. Check the backend response."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/picklists")}
                sx={{ mb: 2 }}
            >
                Back to Picklists
            </Button>

            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Edit Picklist
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {picklist && (
                <PicklistForm
                    mode="edit"
                    initialData={picklist}
                    picklist={picklist}
                    loading={saving}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/picklists")}
                />
            )}
        </Box>
    );
}
export default PicklistEdit;
