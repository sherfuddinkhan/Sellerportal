import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    Button,
    Typography,
    Pagination,
    CircularProgress,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Stack,
    Tooltip
} from "@mui/material";

import {
    Search,
    Add,
    Refresh,
    Close
} from "@mui/icons-material";

import FacilityChannelToolbar from "./FacilityChannelToolbar";
import FacilityChannelStatistics from "./FacilityChannelStatistics";
import FacilityChannelTable from "./FacilityChannelTable";
import FacilityChannelView from "./FacilityChannelView";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    "https://localhost:7000/api/FacilityChannel";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const INITIAL_FORM = {
    facilityName: "",
    channelName: "",
    channelCode: "",
    description: "",
    status: "Active"
};

/* =========================================================
   EXTRACT RESPONSE DATA
========================================================= */

const extractRecords = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (Array.isArray(responseData?.data)) {
        return responseData.data;
    }

    if (Array.isArray(responseData?.items)) {
        return responseData.items;
    }

    if (Array.isArray(responseData?.records)) {
        return responseData.records;
    }

    if (Array.isArray(responseData?.result)) {
        return responseData.result;
    }

    return [];
};

/* =========================================================
   EXTRACT API ERROR
========================================================= */

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (Array.isArray(data?.errors)) {
        return data.errors.join(", ");
    }

    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors)
            .flat()
            .join(", ");
    }

    return (
        data?.message ||
        data?.title ||
        error?.message ||
        fallback
    );
};

/* =========================================================
   FACILITY CHANNELS LIST
========================================================= */

const FacilityChannelsList = ({
    apiBaseUrl = API_BASE_URL
}) => {

    /* =====================================================
       STATE
    ===================================================== */

    const [facilityChannels, setFacilityChannels] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedChannel, setSelectedChannel] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [formError, setFormError] = useState("");

    /* =====================================================
       GET RECORD ID
    ===================================================== */

    const getRecordId = (item) =>
        item?.id ??
        item?.facilityChannelId ??
        item?.channelId;

    /* =====================================================
       FETCH FACILITY CHANNELS
    ===================================================== */

    const fetchFacilityChannels = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(apiBaseUrl);

            setFacilityChannels(
                extractRecords(response.data)
            );
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Failed to load facility channels."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [apiBaseUrl]);

    useEffect(() => {
        fetchFacilityChannels();
    }, [fetchFacilityChannels]);

    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    const filteredChannels = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return facilityChannels.filter((item) => {
            const facilityName =
                item.facilityName ??
                item.facility?.name ??
                item.name ??
                "";

            const channelName =
                item.channelName ??
                item.channel?.name ??
                item.channel ??
                "";

            const channelCode =
                item.channelCode ??
                item.code ??
                "";

            const id = getRecordId(item);

            const status =
                item.status ??
                item.channelStatus ??
                (
                    item.isActive === true
                        ? "Active"
                        : item.isActive === false
                            ? "Inactive"
                            : ""
                );

            const matchesSearch =
                !searchValue ||
                [
                    facilityName,
                    channelName,
                    channelCode,
                    id
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(searchValue)
                );

            const matchesStatus =
                statusFilter === "All" ||
                String(status).toLowerCase() ===
                    statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [facilityChannels, search, statusFilter]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredChannels.length / rowsPerPage)
    );

    const paginatedChannels = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;

        return filteredChannels.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredChannels, page, rowsPerPage]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    /* =====================================================
       OPEN CREATE DIALOG
    ===================================================== */

    const handleOpenCreate = () => {
        setFormData({ ...INITIAL_FORM });
        setFormError("");
        setSelectedChannel(null);
        setCreateOpen(true);
    };

    /* =====================================================
       OPEN VIEW DIALOG
    ===================================================== */

    const handleView = (item) => {
        setSelectedChannel(item);
        setViewOpen(true);
    };

    /* =====================================================
       OPEN EDIT DIALOG
    ===================================================== */

    const handleEdit = (item) => {
        setSelectedChannel(item);

        setFormData({
            facilityName:
                item.facilityName ??
                item.facility?.name ??
                item.name ??
                "",

            channelName:
                item.channelName ??
                item.channel?.name ??
                item.channel ??
                "",

            channelCode:
                item.channelCode ??
                item.code ??
                "",

            description:
                item.description ??
                item.remarks ??
                "",

            status:
                item.status ??
                item.channelStatus ??
                (item.isActive === false ? "Inactive" : "Active")
        });

        setFormError("");
        setEditOpen(true);
    };

    /* =====================================================
       OPEN DELETE DIALOG
    ===================================================== */

    const handleOpenDelete = (item) => {
        setSelectedChannel(item);
        setError("");
        setDeleteOpen(true);
    };

    /* =====================================================
       HANDLE FORM INPUT
    ===================================================== */

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        if (!formData.facilityName.trim()) {
            return "Facility name is required.";
        }

        if (!formData.channelName.trim()) {
            return "Channel name is required.";
        }

        if (!formData.channelCode.trim()) {
            return "Channel code is required.";
        }

        return "";
    };

    /* =====================================================
       CREATE FACILITY CHANNEL
    ===================================================== */

    const handleCreate = async () => {
        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        setSaving(true);
        setFormError("");

        try {
            await axios.post(apiBaseUrl, formData);

            setCreateOpen(false);
            setSuccess("Facility channel created successfully.");

            await fetchFacilityChannels();
        } catch (err) {
            setFormError(
                getErrorMessage(
                    err,
                    "Failed to create facility channel."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       UPDATE FACILITY CHANNEL
    ===================================================== */

    const handleUpdate = async () => {
        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        const id = getRecordId(selectedChannel);

        if (id === null || id === undefined) {
            setFormError("Facility channel ID was not found.");
            return;
        }

        setSaving(true);
        setFormError("");

        try {
            await axios.put(
                `${apiBaseUrl}/${encodeURIComponent(id)}`,
                formData
            );

            setEditOpen(false);
            setSelectedChannel(null);
            setSuccess("Facility channel updated successfully.");

            await fetchFacilityChannels();
        } catch (err) {
            setFormError(
                getErrorMessage(
                    err,
                    "Failed to update facility channel."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       DELETE FACILITY CHANNEL
    ===================================================== */

    const handleDelete = async () => {
        const id = getRecordId(selectedChannel);

        if (id === null || id === undefined) {
            setError("Facility channel ID was not found.");
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await axios.delete(
                `${apiBaseUrl}/${encodeURIComponent(id)}`
            );

            setDeleteOpen(false);
            setSelectedChannel(null);
            setSuccess("Facility channel deleted successfully.");

            await fetchFacilityChannels();
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Failed to delete facility channel."
                )
            );
        } finally {
            setDeleting(false);
        }
    };

    /* =====================================================
       CLOSE FORM DIALOGS
    ===================================================== */

    const handleCloseForm = () => {
        if (saving) {
            return;
        }

        setCreateOpen(false);
        setEditOpen(false);
        setFormError("");
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            className="facility-channels-list"
            sx={{
                width: "100%",
                minWidth: 0,
                p: { xs: 1.5, sm: 2.5 }
            }}
        >
            <Stack spacing={3}>

                {/* TOOLBAR */}

                <FacilityChannelToolbar
                    title="Facility Channels"
                    subtitle="Manage facility and channel mappings"
                    onCreate={handleOpenCreate}
                    onRefresh={fetchFacilityChannels}
                    loading={loading}
                    showCreate
                    showRefresh
                    showExport={false}
                />

                {/* ERROR MESSAGE */}

                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError("")}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={fetchFacilityChannels}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* STATISTICS */}

                <FacilityChannelStatistics
                    facilityChannels={facilityChannels}
                    loading={loading}
                />

                {/* SEARCH AND FILTER */}

                <PaperSection>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Search facility channels"
                                placeholder="Search by facility, channel, code or ID"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Status"
                                value={statusFilter}
                                onChange={(event) => {
                                    setStatusFilter(event.target.value);
                                    setPage(1);
                                }}
                            >
                                <MenuItem value="All">All Statuses</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Rows per page"
                                value={rowsPerPage}
                                onChange={(event) => {
                                    setRowsPerPage(
                                        Number(event.target.value)
                                    );
                                    setPage(1);
                                }}
                            >
                                {[5, 10, 25, 50].map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                        sx={{ mt: 2 }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {filteredChannels.length} facility channel(s) found
                        </Typography>

                        <Button
                            size="small"
                            startIcon={<Refresh />}
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("All");
                                setPage(1);
                            }}
                            disabled={!search && statusFilter === "All"}
                        >
                            Clear Filters
                        </Button>
                    </Stack>
                </PaperSection>

                {/* TABLE */}

                <FacilityChannelTable
                    facilityChannels={paginatedChannels}
                    loading={loading}
                    error=""
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleOpenDelete}
                />

                {/* PAGINATION */}

                {!loading && filteredChannels.length > 0 && (
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Showing{" "}
                            {(page - 1) * rowsPerPage + 1}
                            {" - "}
                            {Math.min(
                                page * rowsPerPage,
                                filteredChannels.length
                            )}
                            {" of "}
                            {filteredChannels.length}
                        </Typography>

                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            shape="rounded"
                        />
                    </Stack>
                )}
            </Stack>

            {/* CREATE DIALOG */}

            <FacilityChannelFormDialog
                open={createOpen}
                title="Create Facility Channel"
                formData={formData}
                error={formError}
                loading={saving}
                onChange={handleFormChange}
                onClose={handleCloseForm}
                onSubmit={handleCreate}
            />

            {/* EDIT DIALOG */}

            <FacilityChannelFormDialog
                open={editOpen}
                title="Edit Facility Channel"
                formData={formData}
                error={formError}
                loading={saving}
                onChange={handleFormChange}
                onClose={handleCloseForm}
                onSubmit={handleUpdate}
            />

            {/* VIEW DIALOG */}

            <FacilityChannelView
                open={viewOpen}
                facilityChannel={selectedChannel}
                facilityChannelId={getRecordId(selectedChannel)}
                apiBaseUrl={apiBaseUrl}
                onClose={() => setViewOpen(false)}
                onEdit={(item) => {
                    setViewOpen(false);
                    handleEdit(item);
                }}
            />

            {/* DELETE CONFIRMATION */}

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    if (!deleting) {
                        setDeleteOpen(false);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Confirm Delete
                    <IconButton
                        aria-label="Close delete dialog"
                        onClick={() => setDeleteOpen(false)}
                        disabled={deleting}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to delete facility channel{" "}
                        <strong>
                            {selectedChannel?.channelName ??
                                selectedChannel?.channel?.name ??
                                selectedChannel?.channelCode ??
                                getRecordId(selectedChannel) ??
                                ""}
                        </strong>
                        ?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteOpen(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleting}
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : null
                        }
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SUCCESS NOTIFICATION */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={4000}
                onClose={() => setSuccess("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

/* =========================================================
   REUSABLE PAPER SECTION
========================================================= */

const PaperSection = ({ children }) => (
    <Box
        sx={{
            width: "100%",
            p: { xs: 1.5, sm: 2 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper"
        }}
    >
        {children}
    </Box>
);

/* =========================================================
   REUSABLE CREATE / EDIT DIALOG
========================================================= */

const FacilityChannelFormDialog = ({
    open,
    title,
    formData,
    error,
    loading,
    onChange,
    onClose,
    onSubmit
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
    >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    required
                    name="facilityName"
                    label="Facility Name"
                    value={formData.facilityName}
                    onChange={onChange}
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    required
                    name="channelName"
                    label="Channel Name"
                    value={formData.channelName}
                    onChange={onChange}
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    required
                    name="channelCode"
                    label="Channel Code"
                    value={formData.channelCode}
                    onChange={onChange}
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={onChange}
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    select
                    name="status"
                    label="Status"
                    value={formData.status}
                    onChange={onChange}
                    disabled={loading}
                >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                </TextField>
            </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
            <Button
                onClick={onClose}
                disabled={loading}
            >
                Cancel
            </Button>

            <Button
                variant="contained"
                onClick={onSubmit}
                disabled={loading}
                startIcon={
                    loading ? (
                        <CircularProgress
                            size={18}
                            color="inherit"
                        />
                    ) : (
                        <Add />
                    )
                }
            >
                {loading ? "Saving..." : "Save"}
            </Button>
        </DialogActions>
    </Dialog>
);

export default FacilityChannelsList;

