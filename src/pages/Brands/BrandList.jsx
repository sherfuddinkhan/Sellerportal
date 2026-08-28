import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import BrandToolbar from "./BrandToolbar";
import BrandStatistics from "./BrandStatistics";
import BrandSearch from "./BrandSearch";
import BrandFilters from "./BrandFilters";
import BrandTable from "./BrandTable";
import BrandPagination from "./BrandPagination";


const SERVER_URL = "http://localhost:5000";


const BrandList = () => {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [brands, setBrands] = useState([]);

    const [filteredBrands, setFilteredBrands] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // Text currently being typed
    const [searchText, setSearchText] =
        useState("");


    // Text actually submitted by Search button
    const [searchQuery, setSearchQuery] =
        useState("");


    const [statusFilter, setStatusFilter] =
        useState("All");


    const [page, setPage] =
        useState(0);


    const [rowsPerPage, setRowsPerPage] =
        useState(10);


    // =========================================================
    // LOAD BRANDS
    // =========================================================

    const loadBrands = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Fetching brands..."
            );


            const response = await fetch(
                `${SERVER_URL}/api/brand`
            );


            console.log(
                "Response status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Brand API response:",
                data
            );


            const brandData =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.brands)
                            ? data.brands
                            : [];


            console.log(
                "Brands extracted:",
                brandData
            );


            setBrands(brandData);

            setFilteredBrands(
                brandData
            );


        } catch (err) {

            console.error(
                "Brand loading error:",
                err
            );


            setError(
                err.message ||
                "Unable to load brands."
            );


            setBrands([]);

            setFilteredBrands([]);


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

   
// =========================================================
// SEARCH + STATUS FILTER
// =========================================================

useEffect(() => {

    let result = [...brands];


    // =====================================================
    // SEARCH BY BRAND NAME / DESCRIPTION
    // =====================================================

    const search =
        searchQuery
            .trim()
            .toLowerCase();


    if (search !== "") {

        result = result.filter((brand) => {

            const brandName =
                brand.brandName
                    ?.toLowerCase() || "";

            const description =
                brand.description
                    ?.toLowerCase() || "";


            return (
                brandName.includes(search) ||
                description.includes(search)
            );

        });

    }


    // =====================================================
    // STATUS FILTER
    // =====================================================

    if (statusFilter !== "All") {

        result = result.filter((brand) => {

            if (statusFilter === "Active") {

                return brand.isActive === true;

            }


            if (statusFilter === "Inactive") {

                return brand.isActive === false;

            }


            return true;

        });

    }


    // =====================================================
    // SET FILTERED DATA
    // =====================================================

    setFilteredBrands(result);


    // Reset pagination after filtering

    setPage(0);


}, [
    brands,
    searchQuery,
    statusFilter
]);



    // =========================================================
    // SEARCH BUTTON
    // =========================================================

   const handleSearch = (value) => {

    const search = value.trim();

    if (!search) {
        navigate("/brands/filters");
        return;
    }

    navigate(
        `/brands/filters?search=${encodeURIComponent(search)}`
    );
};


    // =========================================================
    // VIEW BRAND
    // =========================================================

  const handleView = (brand) => {
    console.log("View clicked:", brand);

    const brandId = brand?.brandId;

    console.log("Brand ID:", brandId);

    if (!brandId) {
        setError("Brand ID is missing.");
        return;
    }

    navigate(`/brands/details/${brandId}`);
};


    // =========================================================
    // EDIT BRAND
    // =========================================================

  const handleEdit = (brand) => {
    console.log("Edit Brand:", brand);
    console.log("Brand ID:", brand?.brandId);

    if (!brand?.brandId) {
        setError("Brand ID is missing.");
        return;
    }

    navigate(`/brands/${brand.brandId}/edit`);
};


    // =========================================================
    // DELETE BRAND
    // =========================================================

    const handleDelete = async (
        brand
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${brand.brandName}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setLoading(true);
            setError("");


            console.log(
                "Deleting Brand:",
                brand.brandId
            );


            const response =
                await fetch(
                    `${SERVER_URL}/api/brand/${brand.brandId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                let errorMessage =
                    `Delete failed: HTTP ${response.status}`;


                try {

                    const errorData =
                        await response.json();


                    errorMessage =
                        errorData?.message ||
                        errorMessage;

                } catch {

                    // Response wasn't JSON

                }


                throw new Error(
                    errorMessage
                );

            }


            console.log(
                "Brand deleted successfully"
            );


            await loadBrands();


        } catch (err) {

            console.error(
                "Error deleting brand:",
                err
            );


            setError(
                err.message ||
                "Unable to delete brand."
            );


        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // PAGINATION
    // =========================================================

    const paginatedBrands =
        filteredBrands.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );


    // =========================================================
    // LOADING
    // =========================================================

    if (
        loading &&
        brands.length === 0
    ) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >

                <CircularProgress />

            </Box>

        );

    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box p={3}>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >

                    {error}

                </Alert>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <BrandToolbar
                onRefresh={
                    loadBrands
                }
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <BrandStatistics
                brands={
                    filteredBrands
                }
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <BrandSearch
                value={
                    searchText
                }
                onChange={
                    setSearchText
                }
                onSearch={
                    handleSearch
                }
            />


            {/* =================================================
                FILTER
            ================================================= */}

            <BrandFilters
                value={
                    statusFilter
                }
                onChange={
                    setStatusFilter
                }
            />


            {/* =================================================
                TABLE
            ================================================= */}

            <BrandTable
                brands={
                    paginatedBrands
                }
                loading={
                    loading
                }
                onView={
                    handleView
                }
                onEdit={
                    handleEdit
                }
                onDelete={
                    handleDelete
                }
            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <BrandPagination
                page={
                    page
                }
                rowsPerPage={
                    rowsPerPage
                }
                totalRecords={
                    filteredBrands.length
                }

                onPageChange={(
                    event,
                    newPage
                ) => {

                    setPage(
                        newPage
                    );

                }}

                onRowsPerPageChange={(
                    event
                ) => {

                    const newRowsPerPage =
                        parseInt(
                            event.target.value,
                            10
                        );


                    setRowsPerPage(
                        newRowsPerPage
                    );


                    setPage(0);

                }}

            />

        </Box>

    );

};


export default BrandList;
