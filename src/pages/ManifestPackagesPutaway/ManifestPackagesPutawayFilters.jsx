
import React, { useEffect, useState } from "react";

import {
    Paper,
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Stack,
    Typography,
    Divider
} from "@mui/material";

import {
    FilterAlt,
    RestartAlt,
    Search,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";

/* =========================================================
   INITIAL FILTER VALUES
========================================================= */

const initialFilters = {
    status: "all",
    manifestId: "",
    packageId: "",
    putawayLocation: ""
};

/* =========================================================
   MANIFEST PACKAGES PUTAWAY FILTERS
========================================================= */

const ManifestPackagesPutawayFilters = ({
    filters = initialFilters,

    onApply,
    onReset,

    loading = false,

    statusOptions = [
        { value: "all", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "putaway", label: "Putaway" },
        { value: "cancelled", label: "Cancelled" }
    ],

    defaultExpanded = true
}) => {
    /* -----------------------------------------------------
       LOCAL FILTER STATE
    ----------------------------------------------------- */

    const [formFilters, setFormFilters] = useState({
        ...initialFilters,
        ...(filters || {})
    });

    const [expanded, setExpanded] = useState(defaultExpanded);

    /* -----------------------------------------------------
       SYNC FILTERS FROM PARENT
    ----------------------------------------------------- */

    useEffect(() => {
        setFormFilters({
            ...initialFilters,
            ...(filters || {})
        });
    }, [filters]);

    /* -----------------------------------------------------
       HANDLE FIELD CHANGE
    ----------------------------------------------------- */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFilters((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    /* -----------------------------------------------------
       APPLY FILTERS
    ----------------------------------------------------- */

    const handleApply = (event) => {
        event.preventDefault();

        if (typeof onApply === "function") {
            onApply({ ...formFilters });
        }
    };

    /* -----------------------------------------------------
       RESET FILTERS
    ----------------------------------------------------- */

    const handleReset = () => {
        const resetValues = { ...initialFilters };

        setFormFilters(resetValues);

        if (typeof onReset === "function") {
            onReset(resetValues);
        } else if (typeof onApply === "function") {
            onApply(resetValues);
        }
    };

    /* -----------------------------------------------------
       COUNT ACTIVE FILTERS
    ----------------------------------------------------- */

    const activeFilterCount = [
        formFilters.status !== "all",
        String(formFilters.manifestId || "").trim() !== "",
        String(formFilters.packageId || "").trim() !== "",
        String(formFilters.putawayLocation || "").trim() !== ""
    ].filter(Boolean).length;

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Paper
            elevation={1}
            sx={{
                width: "100%",
                mb: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden"
            }}
        >
            {/* FILTER HEADER */}

            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <FilterAlt color="primary" />

                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                        >
                            Advanced Filters
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Filter manifest package putaway records.
                        </Typography>
                    </Box>

                    {activeFilterCount > 0 && (
                        <Box
                            sx={{
                                px: 1,
                                py: 0.25,
                                borderRadius: 5,
                                bgcolor: "primary.light",
                                color: "primary.dark",
                                fontSize: 12,
                                fontWeight: 700
                            }}
                        >
                            {activeFilterCount} active
                        </Box>
                    )}
                </Stack>

                <Button
                    size="small"
                    color="inherit"
                    endIcon={
                        expanded
                            ? <ExpandLess />
                            : <ExpandMore />
                    }
                    onClick={() => setExpanded((previous) => !previous)}
                >
                    {expanded ? "Hide Filters" : "Show Filters"}
                </Button>
            </Box>

            {expanded && (
                <>
                    <Divider />

                    <Box
                        component="form"
                        onSubmit={handleApply}
                        sx={{ p: 2.5 }}
                    >
                        <Grid container spacing={2}>
                            {/* STATUS */}

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Putaway Status"
                                    name="status"
                                    value={formFilters.status}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    {statusOptions.map((option) => {
                                        const item =
                                            typeof option === "string"
                                                ? {
                                                    value: option,
                                                    label: option
                                                }
                                                : option;

                                        return (
                                            <MenuItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>

                            {/* MANIFEST ID */}

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Manifest ID"
                                    name="manifestId"
                                    value={formFilters.manifestId}
                                    onChange={handleChange}
                                    placeholder="Enter Manifest ID"
                                    disabled={loading}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>

                            {/* PACKAGE ID */}

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Package ID"
                                    name="packageId"
                                    value={formFilters.packageId}
                                    onChange={handleChange}
                                    placeholder="Enter Package ID"
                                    disabled={loading}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>

                            {/* PUTAWAY LOCATION */}

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Putaway Location"
                                    name="putawayLocation"
                                    value={formFilters.putawayLocation}
                                    onChange={handleChange}
                                    placeholder="Enter location"
                                    disabled={loading}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2.5 }} />

                        {/* ACTION BUTTONS */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={1.5}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<RestartAlt />}
                                onClick={handleReset}
                                disabled={
                                    loading ||
                                    activeFilterCount === 0
                                }
                            >
                                Reset Filters
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Search />}
                                disabled={loading}
                            >
                                Apply Filters
                            </Button>
                        </Stack>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default ManifestPackagesPutawayFilters;

