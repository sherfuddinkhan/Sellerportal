import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const API_URL = "http://localhost:5000/api/manifest-packages";

// Get ID regardless of API property naming.
const getId = (record) =>
    record?.manifestPackageId ??
    record?.ManifestPackageId ??
    record?.id ??
    record?.Id;

// Support common API response formats.
const getRecords = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.$values)) return data.$values;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.$values?.$values)) {
        return data.$values.$values;
    }

    return [];
};

// Manifest Packages Table
const ManifestPackagesTable = ({
    records,
    loading,
    onView,
    onEdit,
    onDelete,
    deletingId,
}) => {
    if (!loading && records.length === 0) {
        return (
            <Box sx={{ py: 7, textAlign: "center" }}>
                <Inventory2OutlinedIcon
                    sx={{
                        fontSize: 55,
                        color: "text.disabled",
                        mb: 1,
                    }}
                />

                <Typography variant="h6" fontWeight={600}>
                    No Manifest Packages Found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Create a new manifest package to get started.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            "& th": {
                                fontWeight: 700,
                                bgcolor: "action.hover",
                                whiteSpace: "nowrap",
                            },
                        }}
                    >
                        <TableCell>ID</TableCell>
                        <TableCell>Manifest Package</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {records.map((record, index) => {
                        const id = getId(record);

                        const name =
                            record?.manifestPackageName ??
                            record?.ManifestPackageName ??
                            record?.packageName ??
                            record?.PackageName ??
                            record?.name ??
                            record?.Name ??
                            "Manifest Package";

                        const status =
                            record?.status ??
                            record?.Status ??
                            record?.manifestPackageStatus ??
                            record?.ManifestPackageStatus ??
                            "";

                        const isDeleting = deletingId === id;

                        return (
                            <TableRow key={id ?? index} hover>
                                <TableCell>{id ?? "—"}</TableCell>

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >
                                        {name}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    {status ? (
                                        <Chip
                                            label={String(status)}
                                            size="small"
                                            color={
                                                String(status).toLowerCase() ===
                                                "active"
                                                    ? "success"
                                                    : "default"
                                            }
                                            variant="outlined"
                                        />
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        justifyContent="center"
                                        flexWrap="wrap"
                                        useFlexGap
                                    >
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<VisibilityIcon />}
                                            disabled={
                                                id == null ||
                                                deletingId != null
                                            }
                                            onClick={() => onView(record)}
                                        >
                                            View
                                        </Button>

                                        <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            disabled={
                                                id == null ||
                                                deletingId != null
                                            }
                                            onClick={() => onEdit(record)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            startIcon={
                                                isDeleting ? (
                                                    <CircularProgress
                                                        size={16}
                                                        color="inherit"
                                                    />
                                                ) : (
                                                    <DeleteIcon />
                                                )
                                            }
                                            disabled={
                                                id == null ||
                                                deletingId != null ||
                                                loading
                                            }
                                            onClick={() => onDelete(record)}
                                        >
                                            {isDeleting
                                                ? "Deleting..."
                                                : "Delete"}
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// Main Manifest Packages List
const ManifestPackagesList = () => {
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState("");

    // Fetch manifest packages
    const fetchManifestPackages = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`${API_URL}/all`);
            const result = getRecords(response.data);

            setRecords(result);
        } catch (err) {
            console.error("FETCH ERROR:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
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

    // View record
    const handleView = (record) => {
        const id = getId(record);

        if (id != null) {
            navigate(`/manifest-packages/view/${id}`);
        }
    };

    // Edit record
    const handleEdit = (record) => {
        const id = getId(record);

        if (id != null) {
            navigate(`/manifest-packages/${id}/edit`);
        }
    };

    // Create record
    const handleCreate = () => {
        navigate("/manifest-packages/create");
    };

    // Open delete confirmation
    const handleDeleteClick = (record) => {
        setSelectedRecord(record);
        setDeleteError("");
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation
    const handleDeleteCancel = () => {
        if (deletingId != null) return;

        setDeleteDialogOpen(false);
        setSelectedRecord(null);
        setDeleteError("");
    };

    // Delete record
    const handleDeleteConfirm = async () => {
        const id = getId(selectedRecord);

        if (id == null) {
            setDeleteError(
                "Unable to identify the selected manifest package."
            );
            return;
        }

        setDeletingId(id);
        setDeleteError("");

        try {
            await axios.delete(`${API_URL}/${id}`);

            setRecords((previous) =>
                previous.filter((record) => getId(record) !== id)
            );

            setDeleteDialogOpen(false);
            setSelectedRecord(null);
        } catch (err) {
            console.error("DELETE ERROR:", err);

            setDeleteError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete the manifest package."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                }}
            >
                {/* Page Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "stretch",
                        sm: "center",
                    }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Manifest Packages
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View and manage shipping manifest packages.
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchManifestPackages}
                            disabled={loading || deletingId != null}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            disabled={deletingId != null}
                        >
                            Create
                        </Button>
                    </Stack>
                </Stack>

                {/* Error Message */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={fetchManifestPackages}
                                disabled={loading}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* Loading Indicator */}
                {loading && records.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <CircularProgress />

                        <Typography
                            sx={{ mt: 2 }}
                            color="text.secondary"
                        >
                            Loading manifest packages...
                        </Typography>
                    </Box>
                ) : (
                    <ManifestPackagesTable
                        records={records}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        deletingId={deletingId}
                    />
                )}

                {/* Refresh Indicator */}
                {loading && records.length > 0 && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            mt: 2,
                            textAlign: "center",
                        }}
                    >
                        Refreshing manifest packages...
                    </Typography>
                )}

                {/* Record Count */}
                {!loading && !error && records.length > 0 && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        Total manifest packages: {records.length}
                    </Typography>
                )}
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    Delete Manifest Package
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this manifest
                        package? This action cannot be undone.
                    </DialogContentText>

                    {deleteError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {deleteError}
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={deletingId != null}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteConfirm}
                        disabled={deletingId != null}
                        startIcon={
                            deletingId != null ? (
                                <CircularProgress
                                    size={16}
                                    color="inherit"
                                />
                            ) : (
                                <DeleteIcon />
                            )
                        }
                    >
                        {deletingId != null
                            ? "Deleting..."
                            : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManifestPackagesList;