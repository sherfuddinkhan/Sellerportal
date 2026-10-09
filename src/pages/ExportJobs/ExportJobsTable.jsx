import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


/* =========================================================
   GET EXPORT JOB ID
========================================================= */

const getExportJobId = (job) => {

    return (
        job?.ExportJobId ??
        job?.exportJobId ??
        job?.Id ??
        job?.id ??
        "-"
    );

};


/* =========================================================
   GET FIELD VALUE
========================================================= */

const getValue = (
    job,
    ...keys
) => {

    for (const key of keys) {

        if (
            job?.[key] !== undefined &&
            job?.[key] !== null
        ) {
            return job[key];
        }

    }

    return "";

};


/* =========================================================
   FORMAT DATE
========================================================= */

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


/* =========================================================
   STATUS COLOR
========================================================= */

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


/* =========================================================
   COMPONENT
========================================================= */

const ExportJobsTable = ({
    exportJobs = [],
    onView,
    onEdit,
    onDelete
}) => {


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (
        job
    ) => {

        if (
            typeof onView ===
            "function"
        ) {

            onView(job);

        }

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (
        job
    ) => {

        if (
            typeof onEdit ===
            "function"
        ) {

            onEdit(job);

        }

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = (
        job
    ) => {

        if (
            typeof onDelete ===
            "function"
        ) {

            onDelete(job);

        }

    };


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (
        !Array.isArray(exportJobs) ||
        exportJobs.length === 0
    ) {

        return (

            <TableContainer
                component={Paper}
                elevation={2}
            >

                <Table>

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

                        <TableRow>

                            <TableCell
                                colSpan={7}
                                align="center"
                            >

                                <Box
                                    sx={{
                                        py: 5
                                    }}
                                >

                                    <Typography
                                        color="text.secondary"
                                    >
                                        No Export Jobs
                                        found.
                                    </Typography>

                                </Box>

                            </TableCell>

                        </TableRow>

                    </TableBody>

                </Table>

            </TableContainer>

        );

    }


    /* =====================================================
       TABLE
    ===================================================== */

    return (

        <TableContainer
            component={Paper}
            elevation={2}
        >

            <Table
                size="small"
                stickyHeader
            >

                {/* =================================================
                   TABLE HEAD
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            ID
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Seller ID
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Customer ID
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Job Type
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Status
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Created Date
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                   TABLE BODY
                ================================================= */}

                <TableBody>

                    {exportJobs.map(
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
                                        id !== "-"
                                            ? id
                                            : index
                                    }
                                    hover
                                >

                                    {/* =================================
                                       ID
                                    ================================= */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {id}
                                        </Typography>
                                    </TableCell>


                                    {/* =================================
                                       SELLER ID
                                    ================================= */}

                                    <TableCell>
                                        {sellerId || "-"}
                                    </TableCell>


                                    {/* =================================
                                       CUSTOMER ID
                                    ================================= */}

                                    <TableCell>
                                        {customerId || "-"}
                                    </TableCell>


                                    {/* =================================
                                       JOB TYPE
                                    ================================= */}

                                    <TableCell>
                                        {jobType || "-"}
                                    </TableCell>


                                    {/* =================================
                                       STATUS
                                    ================================= */}

                                    <TableCell>

                                        {status ? (

                                            <Chip
                                                label={
                                                    status
                                                }
                                                size="small"
                                                color={
                                                    getStatusColor(
                                                        status
                                                    )
                                                }
                                            />

                                        ) : (

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                -
                                            </Typography>

                                        )}

                                    </TableCell>


                                    {/* =================================
                                       CREATED DATE
                                    ================================= */}

                                    <TableCell>
                                        {
                                            formatDate(
                                                createdDate
                                            )
                                        }
                                    </TableCell>


                                    {/* =================================
                                       ACTIONS
                                    ================================= */}

                                    <TableCell
                                        align="center"
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "center",
                                                alignItems:
                                                    "center",
                                                gap: 0.5
                                            }}
                                        >

                                            {/* =========================
                                               VIEW
                                            ========================= */}

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


                                            {/* =========================
                                               EDIT
                                            ========================= */}

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


                                            {/* =========================
                                               DELETE
                                            ========================= */}

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

                                        </Box>

                                    </TableCell>

                                </TableRow>

                            );

                        }
                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

};


/* =========================================================
   EXPORT
========================================================= */

export default ExportJobsTable;