import React, { useEffect, useState } from "react";

import {
    Box,
    Alert,
    CircularProgress
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import SupplierToolbar from "./SupplierToolbar";
import SupplierStatistics from "./SupplierStatistics";
import SupplierTable from "./SupplierTable";
import SupplierPagination from "./SupplierPagination";

// =========================================================
// NODE SERVER / PROXY URL
// =========================================================

const API_URL = "http://localhost:5000/api";


// =========================================================
// SUPPLIER LIST
// =========================================================

const SupplierList = () => {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [suppliers, setSuppliers] = useState([]);

    const [filteredSuppliers, setFilteredSuppliers] =
        useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchText, setSearchText] = useState("");

    const [sort, setSort] = useState("");

    const [page, setPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);


    // =====================================================
    // GET ALL SUPPLIERS
    // Node:
    // GET http://localhost:5000/api/Supplier
    //
    // Node forwards to:
    // GET https://localhost:7203/api/Supplier
    // =====================================================

    const loadSuppliers = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await axios.get(
                `${API_URL}/Supplier`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setSuppliers(data);

            setFilteredSuppliers(data);

        } catch (err) {

            console.error(
                "Supplier loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load suppliers"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD SUPPLIERS ON PAGE LOAD
    // =====================================================

    useEffect(() => {

        loadSuppliers();

    }, []);


    // =====================================================
    // SEARCH + SORT
    // =====================================================

    useEffect(() => {

        let result = [...suppliers];


        // =================================================
        // SEARCH
        // =================================================

        if (searchText.trim()) {

            const search =
                searchText
                    .toLowerCase()
                    .trim();

            result = result.filter(
                (supplier) =>
                    Object.values(supplier).some(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            String(value)
                                .toLowerCase()
                                .includes(search)
                    )
            );
        }


        // =================================================
        // SORT
        // =================================================

        if (sort === "name_asc") {

            result.sort(
                (a, b) =>
                    (a.supplierName || "")
                        .localeCompare(
                            b.supplierName || ""
                        )
            );

        }

        else if (sort === "name_desc") {

            result.sort(
                (a, b) =>
                    (b.supplierName || "")
                        .localeCompare(
                            a.supplierName || ""
                        )
            );

        }

        else if (sort === "id_asc") {

            result.sort(
                (a, b) =>
                    (a.supplierId || 0) -
                    (b.supplierId || 0)
            );

        }

        else if (sort === "id_desc") {

            result.sort(
                (a, b) =>
                    (b.supplierId || 0) -
                    (a.supplierId || 0)
            );

        }


        setFilteredSuppliers(result);

        setPage(1);

    }, [
        searchText,
        sort,
        suppliers
    ]);


    // =====================================================
    // CREATE
    // =====================================================

    const handleCreate = () => {

        navigate(
            "/suppliers/create"
        );

    };


    // =====================================================
    // VIEW
    // =====================================================

const handleView = (supplierId) => {
    navigate(`/suppliers/details/${supplierId}`);
};


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (supplierId) => {

        navigate(
            `/suppliers/edit/${supplierId}`
        );

    };


    // =====================================================
    // DELETE
    //
    // Node:
    // DELETE /api/Supplier/:supplierId
    //
    // Node forwards to:
    // DELETE https://localhost:7203/api/Supplier/:supplierId
    // =====================================================

    const handleDelete = async (supplierId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this supplier?"
            );

        if (!confirmed) {

            return;

        }


        try {

            setError("");


            await axios.delete(
                `${API_URL}/Supplier/${supplierId}`
            );


            // Reload list after deletion

            await loadSuppliers();

        }

        catch (err) {

            console.error(
                "Supplier delete error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to delete supplier"
            );

        }

    };


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.ceil(
            filteredSuppliers.length /
            rowsPerPage
        );


    const startIndex =
        (page - 1) *
        rowsPerPage;


    const paginatedSuppliers =
        filteredSuppliers.slice(
            startIndex,
            startIndex + rowsPerPage
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >

                <CircularProgress />

            </Box>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            className="supplier-list"
            sx={{
                width: "100%"
            }}
        >

            {/* ============================================
                ERROR
            ============================================ */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            )}


            {/* ============================================
                TOOLBAR
            ============================================ */}

            <SupplierToolbar

                searchText={searchText}

                setSearchText={setSearchText}

                sort={sort}

                setSort={setSort}

                onCreate={handleCreate}

                onRefresh={loadSuppliers}

            />


            {/* ============================================
                STATISTICS
            ============================================ */}

            <SupplierStatistics
                suppliers={suppliers}
            />


            {/* ============================================
                TABLE
            ============================================ */}

            <SupplierTable

                suppliers={paginatedSuppliers}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />


            {/* ============================================
                PAGINATION
            ============================================ */}

            <SupplierPagination

                page={page}

                setPage={setPage}

                rowsPerPage={rowsPerPage}

                setRowsPerPage={(value) => {

                    setRowsPerPage(value);

                    setPage(1);

                }}

                totalPages={totalPages}

                totalItems={
                    filteredSuppliers.length
                }

            />

        </Box>

    );

};


export default SupplierList;