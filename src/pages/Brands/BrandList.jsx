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

        if (searchText !== "") {

            result = result.filter(x =>
                x.brandName
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );

        }

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
                brands={filteredBrands}
                refresh={loadBrands}
            />

            <BrandPagination />

        </Box>

    );

};

export default BrandList;