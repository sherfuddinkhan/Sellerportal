
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
    InputAdornment
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import PutawayTable from "./PutawayTable";
import PutawayDelete from "./PutawayDelete";
import { getPutawayValue } from "./PutawayForm";

// =====================================================
// CONFIGURATION
// =====================================================

const API_URL = "http://localhost:5000/api/Putaway";

// =====================================================
// EXTRACT ALL PUTAWAY RECORDS
// Supports:
// { data: [...] }
// { Data: [...] }
// { success: true, data: [...] }
// =====================================================

function extractRows(responseData) {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (!responseData || typeof responseData !== "object") {
        return [];
    }

    const candidates = [
        responseData.data,
        responseData.Data,
        responseData.items,
        responseData.Items,
        responseData.records,
        responseData.Records,
        responseData.results,
        responseData.Results
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }

        if (candidate && typeof candidate === "object") {
            const nestedRows = extractRows(candidate);

            if (nestedRows.length > 0) {
                return nestedRows;
            }
        }
    }

    return [];
}

// =====================================================
// PUTAWAY LIST
// =====================================================

export default function PutawayList() {
    const navigate = useNavigate();

    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [search, setSearch] = React.useState("");

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [selectedPutaway, setSelectedPutaway] = React.useState(null);

    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [deleteError, setDeleteError] = React.useState("");

    const [notification, setNotification] = React.useState("");

    // =================================================
    // FETCH ALL PUTAWAYS
    // Node:    http://localhost:5000/api/Putaway/all
    // ASP.NET: https://localhost:7203/api/Putaway/all
    // =================================================

    const fetchPutaways = React.useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const url = `${API_URL}/all`;

            console.log("Fetching all Putaways:", url);

            const response = await axios.get(url);

            console.log("Putaway API Status:", response.status);
            console.log("Putaway API Response:", response.data);

            const data = extractRows(response.data);

            setRows(data);
            setPage(0);

            if (data.length === 0) {
                console.warn("The Putaway API returned no records.");
            }
        } catch (err) {
            console.error(
                "Fetch All Putaways Error:",
                err.response?.data || err.message
            );

            setRows([]);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to fetch all Putaway records."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchPutaways();
    }, [fetchPutaways]);

    // =================================================
    // SEARCH
    // =================================================

    const filteredRows = React.useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return rows;
        }

        const fields = [
            "putawayCode",
            "shelfCode",
            "itemTypeSkuCode",
            "batchCode",
            "inventoryType",
            "statusCode",
            "facilityCode",
            "putawayType",
            "createdBy",
            "sellerId",
            "customerId"
        ];

        return rows.filter((row) => {
            const matchesField = fields.some((key) =>
                String(getPutawayValue(row, key, ""))
                    .toLowerCase()
                    .includes(term)
            );

            const id = String(
                getPutawayValue(
                    row,
                    "putawayId",
                    getPutawayValue(row, "id", "")
                )
            );

            return matchesField || id.includes(term);
        });
    }, [rows, search]);

    // =================================================
    // PAGINATION
    // =================================================

    const pageRows = React.useMemo(() => {
        const start = page * rowsPerPage;

        return filteredRows.slice(start, start + rowsPerPage);
    }, [filteredRows, page, rowsPerPage]);

    // =================================================
    // VIEW
    // Navigate to a full page, not a popup
    // Route: /putaways/view/:id
    // =================================================

    const handleView = (row) => {
        const id = getPutawayValue(
            row,
            "putawayId",
            getPutawayValue(row, "id", "")
        );

        if (!id) {
            setError("Putaway ID is missing.");
            return;
        }

        navigate(`/putaways/view/${id}`);
    };

    // =================================================
    // EDIT
    // Route: /putaways/:id/edit
    // =================================================

    const handleEdit = (row) => {
        const id = getPutawayValue(
            row,
            "putawayId",
            getPutawayValue(row, "id", "")
        );

        if (!id) {
            setError("Putaway ID is missing.");
            return;
        }

        navigate(`/putaways/${id}/edit`);
    };

    // =================================================
    // OPEN DELETE DIALOG
    // =================================================

    const handleDeleteOpen = (row) => {
        setSelectedPutaway(row);
        setDeleteError("");
        setDeleteOpen(true);
    };

    // =================================================
    // DELETE PUTAWAY
    // Node proxy: localhost:5000
    // =================================================

    const handleDelete = async () => {
        const id = getPutawayValue(
            selectedPutaway,
            "putawayId",
            getPutawayValue(selectedPutaway, "id", "")
        );

        const sellerId = getPutawayValue(
            selectedPutaway,
            "sellerId",
            ""
        );

        const customerId = getPutawayValue(
            selectedPutaway,
            "customerId",
            ""
        );

        if (id === "" || id == null) {
            setDeleteError("Putaway ID is missing.");
            return;
        }

        if (
            sellerId === "" ||
            sellerId == null ||
            customerId === "" ||
            customerId == null
        ) {
            setDeleteError(
                "Seller ID or Customer ID is missing from the selected record."
            );
            return;
        }

        setDeleteLoading(true);
        setDeleteError("");

        try {
            const url =
                `${API_URL}/${id}/seller/${sellerId}/customer/${customerId}`;

            console.log("Deleting Putaway:", url);

            const response = await axios.delete(url);

            console.log("Delete Putaway Response:", response.data);

            setDeleteOpen(false);
            setSelectedPutaway(null);
            setNotification("Putaway deleted successfully.");

            await fetchPutaways();
        } catch (err) {
            console.error(
                "Delete Putaway Error:",
                err.response?.data || err.message
            );

            setDeleteError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete Putaway."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // =================================================
    // UI
    // =================================================

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
                    <Typography variant="h5" fontWeight={700}>
                        Putaway Management
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Manage all warehouse putaway records across sellers
                        and customers.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchPutaways}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/putaways/create")}
                    >
                        Create Putaway
                    </Button>
                </Stack>
            </Stack>

            {/* SEARCH */}

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Search putaways"
                        placeholder="Code, SKU, shelf, batch, seller, customer..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(0);
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Total: {filteredRows.length}
                    </Typography>
                </Stack>
            </Paper>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* TABLE */}

            {loading ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                    <CircularProgress />

                    <Typography sx={{ mt: 2 }}>
                        Loading all putaway records...
                    </Typography>
                </Box>
            ) : (
                <PutawayTable
                    rows={pageRows}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={filteredRows.length}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                        setPage(0);
                    }}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                />
            )}

            {/* DELETE DIALOG ONLY */}
            {/* View no longer opens a popup. */}

            <PutawayDelete
                open={deleteOpen}
                putaway={selectedPutaway}
                loading={deleteLoading}
                error={deleteError}
                onCancel={() => {
                    if (!deleteLoading) {
                        setDeleteOpen(false);
                        setDeleteError("");
                        setSelectedPutaway(null);
                    }
                }}
                onConfirm={handleDelete}
            />

            {/* NOTIFICATION */}

            <Snackbar
                open={Boolean(notification)}
                autoHideDuration={4000}
                onClose={() => setNotification("")}
                message={notification}
            />
        </Box>
    );
}