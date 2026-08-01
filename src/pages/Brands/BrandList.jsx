import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Alert
} from "@mui/material";

import apiService from "../../services/apiService";

import BrandToolbar from "./BrandToolbar";
import BrandStatistics from "./BrandStatistics";
import BrandSearch from "./BrandSearch";
import BrandFilters from "./BrandFilters";
import BrandTable from "./BrandTable";
import BrandPagination from "./BrandPagination";

const BrandList = () => {

    const [brands, setBrands] = useState([]);

    const [filteredBrands, setFilteredBrands] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");
    
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    useEffect(() => {

        loadBrands();

    }, []);

    const loadBrands = async () => {

        try {

            setLoading(true);

            const response = await apiService.getBrands();

            setBrands(response.data);

            setFilteredBrands(response.data);

            setError("");

        }
        catch (err) {

            console.error(err);

            setError("Unable to load brands.");

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

    let result = [...brands];

    // Search Filter
    if (searchText.trim() !== "") {

        const search = searchText.toLowerCase();

        result = result.filter(x =>

            (x.brandName &&
                x.brandName.toLowerCase().includes(search))

            ||

            (x.description &&
                x.description.toLowerCase().includes(search))

        );

    }

    // Status Filter
    if (statusFilter !== "All") {

        const active = statusFilter === "Active";

        result = result.filter(x => x.isActive === active);

    }

    setFilteredBrands(result);

}, [searchText, statusFilter, brands]);

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

    if (error) {

        return (

            <Alert severity="error">

                {error}

            </Alert>

        );

    }

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
    brands={filteredBrands.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )}
    refresh={loadBrands}
/>

           <BrandPagination

    page={page}

    rowsPerPage={rowsPerPage}

    totalRecords={filteredBrands.length}

    onPageChange={(event, newPage) =>
        setPage(newPage)
    }

    onRowsPerPageChange={(event) => {

        setRowsPerPage(parseInt(event.target.value, 10));

        setPage(0);

    }}

/>

        </Box>

    );

};

export default BrandList;