
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Add,
    Delete,
    Edit,
    Visibility,
    Refresh,
    Search,
    Download,
    Close
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api/export-jobs";
const API_URL = `${API_BASE_URL}/all`;

const getJobId = (job) =>
    job?.exportJobId ?? job?.ExportJobId ?? job?.id ?? job?.Id;

const getJobField = (job, camelCase, pascalCase) =>
    job?.[camelCase] ?? job?.[pascalCase] ?? "";

const formatDate = (value) => {
    if (!value) return "Not scheduled";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
};

const ExportJobsList = ({
    onCreate,
    onView,
    onEdit,
    onDelete,
    refreshTrigger = 0
}) => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedJob, setSelectedJob] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showMessage = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const loadExportJobs = useCallback(async () => {
        setLoading(true);

        try {
            const response = await axios.get(API_URL);

            console.log("Export Jobs API response:", response.data);

            let result = response.data;

            if (!Array.isArray(result)) {
                result =
                    result?.data ??
                    result?.items ??
                    result?.results ??
                    result?.exportJobs ??
                    result?.ExportJobs ??
                    [];
            }

            if (!Array.isArray(result)) {
                result = [];
            }

            setJobs(result);
        } catch (error) {
            console.error(
                "Error loading Export Jobs:",
                error.response?.data ?? error.message
            );

            setJobs([]);

            showMessage(
                error.response?.data?.message ??
                    "Unable to fetch Export Jobs. Check the API server.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadExportJobs();
    }, [loadExportJobs, refreshTrigger]);

    const filteredJobs = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        if (!query) return jobs;

        return jobs.filter((job) => {
            const searchableValues = [
                getJobField(job, "jobCode", "JobCode"),
                getJobField(
                    job,
                    "exportJobTypeName",
                    "ExportJobTypeName"
                ),
                getJobField(job, "reportName", "ReportName"),
                getJobField(job, "frequency", "Frequency"),
                getJobField(job, "status", "Status"),
                getJobId(job),
                getJobField(job, "notificationEmail", "NotificationEmail")
            ];

            return searchableValues.some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            );
        });
    }, [jobs, searchText]);

    const paginatedJobs = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredJobs.slice(start, start + rowsPerPage);
    }, [filteredJobs, page, rowsPerPage]);

    const handleCreate = () => {
        if (typeof onCreate === "function") {
            onCreate();
        } else {
            navigate("/export-jobs/create");
        }
    };

    const handleView = (job) => {
        console.log("View Export Job clicked:", {
            id: getJobId(job),
            job
        });

        if (typeof onView === "function") {
            onView(job);
            return;
        }

        const id = getJobId(job);

        if (!id) {
            showMessage("Export Job ID is missing.", "error");
            return;
        }

        navigate(`/export-jobs/details/${id}`);
    };

    const handleEdit = (job) => {
        console.log("Edit Export Job clicked:", {
            id: getJobId(job),
            job
        });

        if (typeof onEdit === "function") {
            onEdit(job);
            return;
        }

        const id = getJobId(job);

        if (!id) {
            showMessage("Export Job ID is missing.", "error");
            return;
        }

        navigate(`/export-jobs/${id}/edit`);
    };

    const handleDeleteClick = (job) => {
        if (typeof onDelete === "function") {
            onDelete(job);
            return;
        }

        setSelectedJob(job);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const id = getJobId(selectedJob);

        if (!id) {
            showMessage("Export Job ID is missing.", "error");
            return;
        }

        setDeleting(true);

        try {
            await axios.delete(`${API_BASE_URL}/${id}`);

            setJobs((previousJobs) =>
                previousJobs.filter((job) => getJobId(job) !== id)
            );

            setDeleteDialogOpen(false);
            setSelectedJob(null);

            showMessage("Export Job deleted successfully.");
        } catch (error) {
            console.error(
                "Error deleting Export Job:",
                error.response?.data ?? error.message
            );

            showMessage(
                error.response?.data?.message ??
                    "Unable to delete Export Job. Verify the DELETE API endpoint.",
                "error"
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleExportCsv = () => {
        if (filteredJobs.length === 0) {
            showMessage("There are no Export Jobs to export.", "warning");
            return;
        }

        const headers = [
            "Export Job ID",
            "Job Code",
            "Export Type",
            "Report Name",
            "Frequency",
            "Schedule Time",
            "Notification Email",
            "Seller ID",
            "Customer ID",
            "Status"
        ];

        const escapeCsv = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const rows = filteredJobs.map((job) => [
            getJobId(job),
            getJobField(job, "jobCode", "JobCode"),
            getJobField(
                job,
                "exportJobTypeName",
                "ExportJobTypeName"
            ),
            getJobField(job, "reportName", "ReportName"),
            getJobField(job, "frequency", "Frequency"),
            getJobField(job, "scheduleTime", "ScheduleTime"),
            getJobField(
                job,
                "notificationEmail",
                "NotificationEmail"
            ),
            getJobField(job, "sellerId", "SellerId"),
            getJobField(job, "customerId", "CustomerId"),
            getJobField(job, "status", "Status")
        ]);

        const csvContent = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) => row.map(escapeCsv).join(","))
        ].join("\r\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "export-jobs.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status) => {
        const value = String(status ?? "").toUpperCase();

        if (value === "ACTIVE" || value === "COMPLETED" || value === "SUCCESS") {
            return "success";
        }

        if (value === "PENDING" || value === "SCHEDULED") {
            return "warning";
        }

        if (value === "FAILED" || value === "INACTIVE" || value === "CANCELLED") {
            return "error";
        }

        return "default";
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Export Jobs
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Manage scheduled reports and data export jobs.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadExportJobs}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleExportCsv}
                    >
                        Export CSV
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Create Export Job
                    </Button>
                </Stack>
            </Stack>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)"
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Total Export Jobs
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {jobs.length}
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Active Jobs
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {
                                jobs.filter(
                                    (job) =>
                                        String(
                                            getJobField(job, "status", "Status")
                                        ).toUpperCase() === "ACTIVE"
                                ).length
                            }
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Scheduled Jobs
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {
                                jobs.filter(
                                    (job) =>
                                        !!getJobField(
                                            job,
                                            "scheduleTime",
                                            "ScheduleTime"
                                        )
                                ).length
                            }
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search by job code, report, type, status, email, or ID..."
                    value={searchText}
                    onChange={(event) => {
                        setSearchText(event.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        endAdornment: searchText ? (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Clear search"
                                    onClick={() => setSearchText("")}
                                    edge="end"
                                >
                                    <Close />
                                </IconButton>
                            </InputAdornment>
                        ) : null
                    }}
                />
            </Paper>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Job Code</TableCell>
                            <TableCell>Export Type</TableCell>
                            <TableCell>Report Name</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Schedule Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2,
                                            py: 5
                                        }}
                                    >
                                        <CircularProgress size={26} />
                                        <Typography>
                                            Loading Export Jobs...
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : paginatedJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography
                                        color="text.secondary"
                                        sx={{ py: 5 }}
                                    >
                                        {searchText
                                            ? "No matching Export Jobs found."
                                            : "No Export Jobs available."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedJobs.map((job, index) => {
                                const id = getJobId(job);
                                const status = getJobField(
                                    job,
                                    "status",
                                    "Status"
                                );

                                return (
                                    <TableRow
                                        hover
                                        key={id ?? index}
                                    >
                                        <TableCell>{id ?? "—"}</TableCell>

                                        <TableCell>
                                            <Typography fontWeight={600}>
                                                {getJobField(
                                                    job,
                                                    "jobCode",
                                                    "JobCode"
                                                ) || "—"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {getJobField(
                                                job,
                                                "exportJobTypeName",
                                                "ExportJobTypeName"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {getJobField(
                                                job,
                                                "reportName",
                                                "ReportName"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {getJobField(
                                                job,
                                                "frequency",
                                                "Frequency"
                                            ) || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {formatDate(
                                                getJobField(
                                                    job,
                                                    "scheduleTime",
                                                    "ScheduleTime"
                                                )
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={status || "Unknown"}
                                                color={getStatusColor(status)}
                                                variant="outlined"
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="center"
                                            >
                                                <Tooltip title="View Export Job">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() =>
                                                            handleView(job)
                                                        }
                                                        aria-label={`View Export Job ${id}`}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit Export Job">
                                                    <IconButton
                                                        color="success"
                                                        onClick={() =>
                                                            handleEdit(job)
                                                        }
                                                        aria-label={`Edit Export Job ${id}`}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete Export Job">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeleteClick(job)
                                                        }
                                                        aria-label={`Delete Export Job ${id}`}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredJobs.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => {
                    if (!deleting) {
                        setDeleteDialogOpen(false);
                        setSelectedJob(null);
                    }
                }}
            >
                <DialogTitle>Delete Export Job</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete Export Job{" "}
                        <strong>
                            {getJobField(
                                selectedJob,
                                "jobCode",
                                "JobCode"
                            ) || getJobId(selectedJob)}
                        </strong>
                        ? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteDialogOpen(false);
                            setSelectedJob(null);
                        }}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDeleteConfirm}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ExportJobsList;