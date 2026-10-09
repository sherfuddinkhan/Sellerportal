// ============================================================
// ExportJobsList.jsx
// ============================================================

import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    Snackbar,
    Alert,
    TextField,
    InputAdornment,
    Button,
    Chip
} from "@mui/material";

import {
    Search,
    Refresh,
    Visibility,
    Edit,
    Delete,
    Add
} from "@mui/icons-material";


// ============================================================
// SERVER URL
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// API URL
// ============================================================

const EXPORT_JOBS_URL =
    `${SERVER_URL}/api/export-jobs/all`;


// ============================================================
// DEFAULT PAGE SIZE
// ============================================================

const DEFAULT_PAGE_SIZE = 10;


// ============================================================
// GET ID
// ============================================================

const getExportJobId = (job) => {

    return (
        job?.ExportJobId ??
        job?.exportJobId ??
        job?.Id ??
        job?.id
    );

};


// ============================================================
// GET VALUE
// ============================================================

const getValue = (
    object,
    ...keys
) => {

    for (const key of keys) {

        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
        }

    }

    return "";

};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

};


// ============================================================
// STATUS COLOR
// ============================================================

const getStatusColor = (
    status
) => {

    switch (
        String(status || "")
            .toLowerCase()
    ) {

        case "completed":
        case "success":
        case "successful":
        case "active":
            return "success";

        case "pending":
        case "processing":
        case "in progress":
            return "warning";

        case "failed":
        case "error":
        case "cancelled":
        case "canceled":
            return "error";

        case "created":
        case "new":
            return "info";

        default:
            return "default";
    }

};


// ============================================================
// COMPONENT
// ============================================================

const ExportJobsList = ({
    onCreate,
    onView,
    onEdit,
    onDelete,
    refreshTrigger = 0
}) => {


    // ========================================================
    // STATE
    // ========================================================

    const [
        exportJobs,
        setExportJobs
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        searchText,
        setSearchText
    ] = useState("");


    const [
        page,
        setPage
    ] = useState(1);


    const [
        pageSize,
        setPageSize
    ] = useState(
        DEFAULT_PAGE_SIZE
    );


    const [
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        severity: "success",
        message: ""
    });


    // ========================================================
    // SHOW MESSAGE
    // ========================================================

    const showMessage = (
        message,
        severity = "success"
    ) => {

        setSnackbar({
            open: true,
            severity,
            message
        });

    };


    // ========================================================
    // CLOSE MESSAGE
    // ========================================================

    const closeSnackbar = () => {

        setSnackbar(
            previous => ({
                ...previous,
                open: false
            })
        );

    };


    // ========================================================
    // LOAD EXPORT JOBS
    // ========================================================

    const loadExportJobs =
        async () => {

            try {

                setLoading(true);


                console.log(
                    "================================================"
                );

                console.log(
                    "GET ALL EXPORT JOBS"
                );

                console.log(
                    "URL:",
                    EXPORT_JOBS_URL
                );

                console.log(
                    "================================================"
                );


                const response =
                    await axios.get(
                        EXPORT_JOBS_URL,
                        {
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                console.log(
                    "EXPORT JOBS RESPONSE:",
                    response.data
                );


                // =================================================
                // NORMALIZE RESPONSE
                // =================================================

                let data = [];


                if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    data =
                        response.data;

                }
                else if (
                    Array.isArray(
                        response.data?.data
                    )
                ) {

                    data =
                        response.data.data;

                }
                else if (
                    Array.isArray(
                        response.data?.items
                    )
                ) {

                    data =
                        response.data.items;

                }
                else if (
                    Array.isArray(
                        response.data?.result
                    )
                ) {

                    data =
                        response.data.result;

                }
                else if (
                    Array.isArray(
                        response.data?.exportJobs
                    )
                ) {

                    data =
                        response.data.exportJobs;

                }


                setExportJobs(data);


                setPage(1);


            }
            catch (error) {

                console.error(
                    "================================================"
                );

                console.error(
                    "GET ALL EXPORT JOBS ERROR:",
                    error
                );

                console.error(
                    "RESPONSE:",
                    error.response?.data
                );

                console.error(
                    "================================================"
                );


                setExportJobs([]);


                const responseData =
                    error.response?.data;


                let message =
                    "Failed to load Export Jobs.";


                if (
                    typeof responseData ===
                    "string"
                ) {

                    message =
                        responseData;

                }
                else if (
                    responseData?.message
                ) {

                    message =
                        responseData.message;

                }
                else if (
                    responseData?.title
                ) {

                    message =
                        responseData.title;

                }
                else if (
                    error.message
                ) {

                    message =
                        error.message;

                }


                showMessage(
                    message,
                    "error"
                );

            }
            finally {

                setLoading(false);

            }

        };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadExportJobs();

    }, [
        refreshTrigger
    ]);


    // ========================================================
    // SEARCH
    // ========================================================

    const filteredExportJobs =
        useMemo(() => {

            const searchValue =
                searchText
                    .toLowerCase()
                    .trim();


            if (!searchValue) {

                return exportJobs;

            }


            return exportJobs.filter(
                job => {

                    const id =
                        getExportJobId(job);


                    const sellerId =
                        getValue(
                            job,
                            "SellerId",
                            "sellerId"
                        );


                    const customerId =
                        getValue(
                            job,
                            "CustomerId",
                            "customerId"
                        );


                    const status =
                        getValue(
                            job,
                            "Status",
                            "status"
                        );


                    const jobType =
                        getValue(
                            job,
                            "JobType",
                            "jobType",
                            "Type",
                            "type"
                        );


                    const description =
                        getValue(
                            job,
                            "Description",
                            "description"
                        );


                    const createdDate =
                        getValue(
                            job,
                            "CreatedDate",
                            "createdDate",
                            "CreatedAt",
                            "createdAt"
                        );


                    const searchableText =
                        [
                            id,
                            sellerId,
                            customerId,
                            status,
                            jobType,
                            description,
                            createdDate
                        ]
                            .join(" ")
                            .toLowerCase();


                    return searchableText
                        .includes(
                            searchValue
                        );

                }
            );

        }, [
            exportJobs,
            searchText
        ]);


    // ========================================================
    // PAGINATION
    // ========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredExportJobs.length /
                pageSize
            )
        );


    const paginatedExportJobs =
        useMemo(() => {

            const startIndex =
                (page - 1) *
                pageSize;


            return filteredExportJobs.slice(
                startIndex,
                startIndex + pageSize
            );

        }, [
            filteredExportJobs,
            page,
            pageSize
        ]);


    // ========================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // ========================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText,
        pageSize
    ]);


    // ========================================================
    // VIEW
    // ========================================================

    const handleView = (
        job
    ) => {

        if (
            typeof onView ===
            "function"
        ) {

            onView(job);

            return;
        }


        console.log(
            "VIEW EXPORT JOB:",
            job
        );

    };


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = (
        job
    ) => {

        if (
            typeof onEdit ===
            "function"
        ) {

            onEdit(job);

            return;
        }


        console.log(
            "EDIT EXPORT JOB:",
            job
        );

    };


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = (
        job
    ) => {

        if (
            typeof onDelete ===
            "function"
        ) {

            onDelete(job);

            return;
        }


        console.log(
            "DELETE EXPORT JOB:",
            job
        );

    };


    // ========================================================
    // CREATE
    // ========================================================

    const handleCreate = () => {

        if (
            typeof onCreate ===
            "function"
        ) {

            onCreate();

            return;
        }


        console.log(
            "CREATE EXPORT JOB"
        );

    };


    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {

        loadExportJobs();

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    width: "100%",
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <CircularProgress />

                <Typography
                    sx={{
                        mt: 2
                    }}
                    color="text.secondary"
                >
                    Loading Export Jobs...
                </Typography>

            </Box>
        );

    }


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                width: "100%"
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: {
                        xs: "stretch",
                        sm: "center"
                    },
                    justifyContent:
                        "space-between",
                    gap: 2,
                    mb: 2,
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    }
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Export Jobs
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage export jobs
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Tooltip
                        title="Refresh"
                    >

                        <IconButton
                            onClick={
                                handleRefresh
                            }
                        >

                            <Refresh />

                        </IconButton>

                    </Tooltip>


                    <Button
                        variant="contained"
                        startIcon={
                            <Add />
                        }
                        onClick={
                            handleCreate
                        }
                    >
                        Create Export Job
                    </Button>

                </Box>

            </Box>


            {/* ==================================================
                SEARCH
            ================================================== */}

            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 2
                }}
            >

                <TextField
                    fullWidth
                    size="small"
                    placeholder={
                        "Search Export Jobs..."
                    }
                    value={
                        searchText
                    }
                    onChange={
                        event =>
                            setSearchText(
                                event.target.value
                            )
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment
                                position="start"
                            >
                                <Search />
                            </InputAdornment>
                        )
                    }}
                />

            </Paper>


            {/* ==================================================
                TABLE
            ================================================== */}

            <TableContainer
                component={Paper}
                elevation={2}
            >

                <Table
                    size="small"
                    stickyHeader
                >

                    <TableHead>

                        <TableRow>

                            <TableCell
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                ID
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                Seller ID
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                Customer ID
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                Job Type
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                Status
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                Created Date
                            </TableCell>


                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {paginatedExportJobs.length ===
                        0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                    align="center"
                                    sx={{
                                        py: 6
                                    }}
                                >

                                    <Typography
                                        color="text.secondary"
                                    >
                                        No Export Jobs
                                        found.
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            paginatedExportJobs.map(
                                (
                                    job,
                                    index
                                ) => {

                                    const id =
                                        getExportJobId(
                                            job
                                        );


                                    const sellerId =
                                        getValue(
                                            job,
                                            "SellerId",
                                            "sellerId"
                                        );


                                    const customerId =
                                        getValue(
                                            job,
                                            "CustomerId",
                                            "customerId"
                                        );


                                    const jobType =
                                        getValue(
                                            job,
                                            "JobType",
                                            "jobType",
                                            "Type",
                                            "type"
                                        );


                                    const status =
                                        getValue(
                                            job,
                                            "Status",
                                            "status"
                                        );


                                    const createdDate =
                                        getValue(
                                            job,
                                            "CreatedDate",
                                            "createdDate",
                                            "CreatedAt",
                                            "createdAt"
                                        );


                                    return (

                                        <TableRow
                                            key={
                                                id ??
                                                index
                                            }
                                            hover
                                        >

                                            <TableCell>
                                                {id ??
                                                    "-"}
                                            </TableCell>


                                            <TableCell>
                                                {sellerId ||
                                                    "-"}
                                            </TableCell>


                                            <TableCell>
                                                {customerId ||
                                                    "-"}
                                            </TableCell>


                                            <TableCell>
                                                {jobType ||
                                                    "-"}
                                            </TableCell>


                                            <TableCell>

                                                {status ? (

                                                    <Chip
                                                        size="small"
                                                        label={
                                                            status
                                                        }
                                                        color={
                                                            getStatusColor(
                                                                status
                                                            )
                                                        }
                                                    />

                                                ) : (

                                                    "-"
                                                )}

                                            </TableCell>


                                            <TableCell>
                                                {
                                                    formatDate(
                                                        createdDate
                                                    )
                                                }
                                            </TableCell>


                                            <TableCell
                                                align="center"
                                            >

                                                <Tooltip
                                                    title="View"
                                                >

                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() =>
                                                            handleView(
                                                                job
                                                            )
                                                        }
                                                    >

                                                        <Visibility
                                                            fontSize="small"
                                                        />

                                                    </IconButton>

                                                </Tooltip>


                                                <Tooltip
                                                    title="Edit"
                                                >

                                                    <IconButton
                                                        size="small"
                                                        color="warning"
                                                        onClick={() =>
                                                            handleEdit(
                                                                job
                                                            )
                                                        }
                                                    >

                                                        <Edit
                                                            fontSize="small"
                                                        />

                                                    </IconButton>

                                                </Tooltip>


                                                <Tooltip
                                                    title="Delete"
                                                >

                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                job
                                                            )
                                                        }
                                                    >

                                                        <Delete
                                                            fontSize="small"
                                                        />

                                                    </IconButton>

                                                </Tooltip>

                                            </TableCell>

                                        </TableRow>

                                    );

                                }
                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* ==================================================
                PAGINATION
            ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 2
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing{" "}
                    {
                        filteredExportJobs.length ===
                        0
                            ? 0
                            : (
                                (page - 1) *
                                pageSize
                            ) + 1
                    }
                    {" - "}
                    {
                        Math.min(
                            page *
                                pageSize,
                            filteredExportJobs.length
                        )
                    }
                    {" of "}
                    {
                        filteredExportJobs.length
                    }
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    <Button
                        size="small"
                        variant="outlined"
                        disabled={
                            page <= 1
                        }
                        onClick={() =>
                            setPage(
                                previous =>
                                    Math.max(
                                        1,
                                        previous -
                                            1
                                    )
                            )
                        }
                    >
                        Previous
                    </Button>


                    <Typography
                        variant="body2"
                    >
                        Page {page} of{" "}
                        {totalPages}
                    </Typography>


                    <Button
                        size="small"
                        variant="outlined"
                        disabled={
                            page >=
                            totalPages
                        }
                        onClick={() =>
                            setPage(
                                previous =>
                                    Math.min(
                                        totalPages,
                                        previous +
                                            1
                                    )
                            )
                        }
                    >
                        Next
                    </Button>


                    <TextField
                        select
                        size="small"
                        value={
                            pageSize
                        }
                        onChange={
                            event =>
                                setPageSize(
                                    Number(
                                        event
                                            .target
                                            .value
                                    )
                                )
                        }
                        SelectProps={{
                            native: true
                        }}
                        sx={{
                            width: 80
                        }}
                    >

                        <option value={5}>
                            5
                        </option>

                        <option value={10}>
                            10
                        </option>

                        <option value={25}>
                            25
                        </option>

                        <option value={50}>
                            50
                        </option>

                    </TextField>

                </Box>

            </Box>


            {/* ==================================================
                SNACKBAR
            ================================================== */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={4000}
                onClose={
                    closeSnackbar
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={
                        closeSnackbar
                    }
                >
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </Box>

    );

};


// ============================================================
// EXPORT
// ============================================================

export default ExportJobsList;