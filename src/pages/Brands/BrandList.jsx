import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Alert
} from "@mui/material";

import BrandToolbar from "./BrandToolbar";
import BrandStatistics from "./BrandStatistics";
import BrandSearch from "./BrandSearch";
import BrandFilters from "./BrandFilters";
import BrandTable from "./BrandTable";
import BrandPagination from "./BrandPagination";

const SERVER_URL = "http://localhost:5000";

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // =========================================================
    // LOAD BRANDS
    // =========================================================

    const loadBrands = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${SERVER_URL}/api/brands`
            );

            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status}`
                );
            }

            const data = await response.json();

            setBrands(data);
            setFilteredBrands(data);
            setError("");

        } catch (err) {
            console.error("Error loading brands:", err);
            setError("Unable to load brands.");
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadBrands();
    }, []);

    // =========================================================
    // SEARCH + STATUS FILTER
    // =========================================================

    useEffect(() => {
        let result = [...brands];

        // Search
        if (searchText.trim() !== "") {
            const search = searchText.toLowerCase();

            result = result.filter(
                (brand) =>
                    brand.brandName
                        ?.toLowerCase()
                        .includes(search) ||
                    brand.description
                        ?.toLowerCase()
                        .includes(search)
            );
        }

        // Status
        if (statusFilter !== "All") {
            const active = statusFilter === "Active";

            result = result.filter(
                (brand) => brand.isActive === active
            );
        }

        setFilteredBrands(result);
        setPage(0);

    }, [brands, searchText, statusFilter]);

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    // =========================================================
    // PAGINATION
    // =========================================================

    const paginatedBrands = filteredBrands.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // =========================================================
    // UI
    // =========================================================

    return (
        <Box p={3}>

            <BrandToolbar
                onRefresh={loadBrands}
            />

            <BrandStatistics
                brands={filteredBrands}
            />

            <BrandSearch
                value={searchText}
                onChange={setSearchText}
            />

            <BrandFilters
                value={statusFilter}
                onChange={setStatusFilter}
            />

            <BrandTable
                brands={paginatedBrands}
                refresh={loadBrands}
            />

            <BrandPagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalRecords={filteredBrands.length}

                onPageChange={(event, newPage) => {
                    setPage(newPage);
                }}

                onRowsPerPageChange={(event) => {
                    setRowsPerPage(
                        parseInt(event.target.value, 10)
                    );
                    setPage(0);
                }}
            />

        </Box>
    );
};

export default BrandList;