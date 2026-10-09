import React from "react";

import {
    Box,
    Paper,
    Grid,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Pagination,
    Stack
} from "@mui/material";

/* =========================================================
   VENDOR ITEM CUSTOM FIELD PAGINATION
========================================================= */

const VendorItemCustomFieldPagination = ({
    page = 0,
    pageSize = 10,
    totalRecords = 0,

    onPageChange,
    onPageSizeChange,

    rowsPerPageOptions = [5, 10, 25, 50, 100],

    loading = false,
    showRecordCount = true,
    showPageSizeSelector = true,
    showFirstLastButtons = true
}) => {
    /* =====================================================
       NORMALIZE VALUES

       Internal page index: 0-based
       MUI Pagination page: 1-based
    ===================================================== */

    const safePageSize = Math.max(
        1,
        Number(pageSize) || 10
    );

    const safeTotalRecords = Math.max(
        0,
        Number(totalRecords) || 0
    );

    const totalPages = Math.max(
        1,
        Math.ceil(safeTotalRecords / safePageSize)
    );

    const safePage = Math.min(
        Math.max(0, Number(page) || 0),
        totalPages - 1
    );

    const startRecord =
        safeTotalRecords === 0
            ? 0
            : safePage * safePageSize + 1;

    const endRecord = Math.min(
        (safePage + 1) * safePageSize,
        safeTotalRecords
    );

    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (_, selectedPage) => {
        if (onPageChange) {
            onPageChange(selectedPage - 1);
        }
    };

    /* =====================================================
       PAGE SIZE CHANGE
    ===================================================== */

    const handlePageSizeChange = (event) => {
        const newPageSize = Number(event.target.value);

        if (onPageSizeChange) {
            onPageSizeChange(newPageSize);
        }

        if (onPageChange) {
            onPageChange(0);
        }
    };

    /* =====================================================
       FIRST PAGE
    ===================================================== */

    const handleFirstPage = () => {
        if (onPageChange) {
            onPageChange(0);
        }
    };

    /* =====================================================
       LAST PAGE
    ===================================================== */

    const handleLastPage = () => {
        if (onPageChange) {
            onPageChange(totalPages - 1);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                mt: 2,
                p: { xs: 2, sm: 2.5 },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2
            }}
        >
            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
            >
                {/* =========================================
                    RECORD COUNT
                ========================================= */}

                {showRecordCount && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Showing{" "}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    fontWeight={700}
                                    color="text.primary"
                                >
                                    {startRecord}–{endRecord}
                                </Typography>
                                {" "}of{" "}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    fontWeight={700}
                                    color="text.primary"
                                >
                                    {safeTotalRecords}
                                </Typography>
                                {" "}records
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Page {safePage + 1} of {totalPages}
                            </Typography>
                        </Box>
                    </Grid>
                )}

                {/* =========================================
                    PAGE SIZE SELECTOR
                ========================================= */}

                {showPageSizeSelector && (
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                Rows per page:
                            </Typography>

                            <FormControl
                                size="small"
                                sx={{ minWidth: 85 }}
                            >
                                <Select
                                    value={safePageSize}
                                    onChange={handlePageSizeChange}
                                    disabled={loading}
                                    inputProps={{
                                        "aria-label": "Rows per page"
                                    }}
                                    sx={{ borderRadius: 2 }}
                                >
                                    {rowsPerPageOptions.map((size) => (
                                        <MenuItem
                                            key={size}
                                            value={size}
                                        >
                                            {size}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Grid>
                )}

                {/* =========================================
                    PAGINATION CONTROLS
                ========================================= */}

                <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                        display: "flex",
                        justifyContent: {
                            xs: "flex-start",
                            md: "flex-end"
                        }
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                    >
                        {showFirstLastButtons && (
                            <Typography
                                component="button"
                                type="button"
                                onClick={handleFirstPage}
                                disabled={loading || safePage === 0}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1.5,
                                    px: 1.25,
                                    py: 0.75,
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    backgroundColor: "transparent",
                                    color: "text.primary",
                                    cursor:
                                        loading || safePage === 0
                                            ? "default"
                                            : "pointer",
                                    opacity:
                                        loading || safePage === 0
                                            ? 0.45
                                            : 1
                                }}
                            >
                                First
                            </Typography>
                        )}

                        <Pagination
                            count={totalPages}
                            page={safePage + 1}
                            onChange={handlePageChange}
                            disabled={loading}
                            color="primary"
                            shape="rounded"
                            size="medium"
                            siblingCount={1}
                            boundaryCount={1}
                            showFirstButton={false}
                            showLastButton={false}
                        />

                        {showFirstLastButtons && (
                            <Typography
                                component="button"
                                type="button"
                                onClick={handleLastPage}
                                disabled={
                                    loading ||
                                    safePage >= totalPages - 1
                                }
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1.5,
                                    px: 1.25,
                                    py: 0.75,
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    backgroundColor: "transparent",
                                    color: "text.primary",
                                    cursor:
                                        loading ||
                                        safePage >= totalPages - 1
                                            ? "default"
                                            : "pointer",
                                    opacity:
                                        loading ||
                                        safePage >= totalPages - 1
                                            ? 0.45
                                            : 1
                                }}
                            >
                                Last
                            </Typography>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default VendorItemCustomFieldPagination;

