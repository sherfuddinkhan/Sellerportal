// =========================================================
// CatalogList.jsx
// =========================================================

import React, { useMemo, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

import CatalogTable from "./CatalogTable";
import CatalogPagination from "./CatalogPagination";

// =========================================================
// COMPONENT
// =========================================================

const CatalogList = ({
    catalogs = [],
    loading = false,
    error = "",
    page = 1,
    rowsPerPage = 10,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    onView,
    onEdit,
    onDelete,
    onSelectionChange,
}) => {
    // =========================================================
    // SELECTED CATALOGS
    // =========================================================

    const [selectedIds, setSelectedIds] =
        useState([]);

    // =========================================================
    // SAFE DATA
    // =========================================================

    const catalogData = useMemo(() => {
        if (!Array.isArray(catalogs)) {
            return [];
        }

        return catalogs;
    }, [catalogs]);

    // =========================================================
    // TOTAL COUNT
    // =========================================================

    const total = useMemo(() => {
        if (
            totalCount !== undefined &&
            totalCount !== null
        ) {
            return Number(totalCount);
        }

        return catalogData.length;
    }, [totalCount, catalogData.length]);

    // =========================================================
    // HANDLE SELECTION
    // =========================================================

    const handleSelectionChange = (ids) => {
        setSelectedIds(ids);

        if (onSelectionChange) {
            onSelectionChange(ids);
        }
    };

    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        newPage
    ) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    // =========================================================
    // ROWS PER PAGE
    // =========================================================

    const handleRowsPerPageChange = (
        newRowsPerPage
    ) => {
        setSelectedIds([]);

        if (onRowsPerPageChange) {
            onRowsPerPageChange(
                newRowsPerPage
            );
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading catalogs...
                </Typography>
            </Box>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <Box sx={{ width: "100%" }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    // =========================================================
    // EMPTY
    // =========================================================

    if (!catalogData.length) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 4,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                    >
                        No Catalogs Found
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        There are no catalog records
                        available.
                    </Typography>
                </Box>
            </Box>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            {/* =====================================================
                LIST HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Catalogs
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {total} catalog
                        {total === 1
                            ? ""
                            : "s"}{" "}
                        found
                    </Typography>
                </Box>

                {selectedIds.length > 0 && (
                    <Typography
                        variant="body2"
                        color="primary"
                        fontWeight="medium"
                    >
                        {selectedIds.length} selected
                    </Typography>
                )}
            </Box>

            {/* =====================================================
                TABLE
               ===================================================== */}

            <CatalogTable
                catalogs={catalogData}
                selectedIds={selectedIds}
                onSelectionChange={
                    handleSelectionChange
                }
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
            />

            {/* =====================================================
                PAGINATION
               ===================================================== */}

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <CatalogPagination
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={total}
                    onPageChange={
                        handlePageChange
                    }
                    onRowsPerPageChange={
                        handleRowsPerPageChange
                    }
                />
            </Box>
        </Box>
    );
};

export default CatalogList;