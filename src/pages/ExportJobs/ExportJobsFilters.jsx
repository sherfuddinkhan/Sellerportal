import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Paper,
    Typography,
    Divider
} from "@mui/material";

import {
    FilterAlt,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   INITIAL FILTER VALUES
========================================================= */

const initialFilters = {
    status: "",
    exportType: "",
    format: "",
    startDate: "",
    endDate: ""
};

/* =========================================================
   EXPORT JOBS FILTERS
========================================================= */

const ExportJobsFilters = ({
    filters = initialFilters,
    onApply,
    onReset,
    loading = false
}) => {

    /* =====================================================
       FILTER STATE
    ===================================================== */

    const [formFilters, setFormFilters] = useState({
        ...initialFilters,
        ...filters
    });

    const [dateError, setDateError] = useState("");

    /* =====================================================
       SYNC FILTERS
    ===================================================== */

    useEffect(() => {

        setFormFilters({
            ...initialFilters,
            ...filters
        });

    }, [filters]);

    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormFilters((previous) => ({
            ...previous,
            [name]: value
        }));

        if (name === "startDate" || name === "endDate") {
            setDateError("");
        }
    };

    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const handleApply = () => {

        if (
            formFilters.startDate &&
            formFilters.endDate &&
            formFilters.startDate > formFilters.endDate
        ) {
            setDateError(
                "Start date cannot be later than end date."
            );
            return;
        }

        setDateError("");

        if (typeof onApply === "function") {
            onApply({ ...formFilters });
        }
    };

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleReset = () => {

        setFormFilters({ ...initialFilters });
        setDateError("");

        if (typeof onReset === "function") {
            onReset({ ...initialFilters });
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                width: "100%",
                p: 2.5,
                borderRadius: 2
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2
                }}
            >

                <FilterAlt color="primary" />

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Export Jobs Filters
                </Typography>

            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* =================================================
                FILTER FIELDS
            ================================================= */}

            <Grid container spacing={2}>

                {/* STATUS */}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        label="Status"
                        name="status"
                        value={formFilters.status}
                        onChange={handleChange}
                        disabled={loading}
                    >

                        <MenuItem value="">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="Pending">
                            Pending
                        </MenuItem>

                        <MenuItem value="Processing">
                            Processing
                        </MenuItem>

                        <MenuItem value="Completed">
                            Completed
                        </MenuItem>

                        <MenuItem value="Failed">
                            Failed
                        </MenuItem>

                    </TextField>
                </Grid>

                {/* EXPORT TYPE */}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        label="Export Type"
                        name="exportType"
                        value={formFilters.exportType}
                        onChange={handleChange}
                        disabled={loading}
                    >

                        <MenuItem value="">
                            All Types
                        </MenuItem>

                        <MenuItem value="Products">
                            Products
                        </MenuItem>

                        <MenuItem value="Orders">
                            Orders
                        </MenuItem>

                        <MenuItem value="Customers">
                            Customers
                        </MenuItem>

                        <MenuItem value="Inventory">
                            Inventory
                        </MenuItem>

                        <MenuItem value="Sales">
                            Sales
                        </MenuItem>

                    </TextField>
                </Grid>

                {/* FORMAT */}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        label="Format"
                        name="format"
                        value={formFilters.format}
                        onChange={handleChange}
                        disabled={loading}
                    >

                        <MenuItem value="">
                            All Formats
                        </MenuItem>

                        <MenuItem value="CSV">
                            CSV
                        </MenuItem>

                        <MenuItem value="Excel">
                            Excel
                        </MenuItem>

                        <MenuItem value="JSON">
                            JSON
                        </MenuItem>

                        <MenuItem value="XML">
                            XML
                        </MenuItem>

                        <MenuItem value="PDF">
                            PDF
                        </MenuItem>

                    </TextField>
                </Grid>

                {/* START DATE */}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={formFilters.startDate}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            htmlInput: {
                                max: formFilters.endDate || undefined
                            }
                        }}
                    />
                </Grid>

                {/* END DATE */}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={formFilters.endDate}
                        onChange={handleChange}
                        disabled={loading}
                        error={Boolean(dateError)}
                        helperText={dateError}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            htmlInput: {
                                min: formFilters.startDate || undefined
                            }
                        }}
                    />
                </Grid>

                {/* ACTIONS */}

                <Grid item xs={12} md={2}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            height: "100%",
                            alignItems: "flex-start"
                        }}
                    >

                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<FilterAlt />}
                            onClick={handleApply}
                            disabled={loading}
                        >
                            Apply
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleReset}
                            disabled={loading}
                            sx={{ minWidth: 44 }}
                            aria-label="Reset filters"
                        >
                            <RestartAlt />
                        </Button>

                    </Box>
                </Grid>

            </Grid>

        </Paper>
    );
};

export default ExportJobsFilters;

