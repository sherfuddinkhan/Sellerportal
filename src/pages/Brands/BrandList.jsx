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
import BrandTable from "./BrandTable";



const SERVER_URL = "http://localhost:5000";


const BrandList = () => {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [brands, setBrands] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

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
                "Brand response status:",
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


            // =====================================================
            // HANDLE DIFFERENT API RESPONSE FORMATS
            // =====================================================

            const brandData =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.brands)
                            ? data.brands
                            : Array.isArray(data?.items)
                                ? data.items
                                : Array.isArray(data?.$values)
                                    ? data.$values
                                    : [];


            console.log(
                "Brands extracted:",
                brandData
            );


            setBrands(
                brandData
            );


            // Reset pagination after refresh

            setPage(0);


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
    // VIEW BRAND
    // =========================================================

    const handleView = (brand) => {

        console.log(
            "View Brand:",
            brand
        );


        const brandId =
            brand?.brandId ??
            brand?.BrandId;


        console.log(
            "Brand ID:",
            brandId
        );


        if (
            brandId === undefined ||
            brandId === null ||
            brandId === ""
        ) {

            setError(
                "Brand ID is missing."
            );

            return;

        }


        navigate(
            `/brands/details/${brandId}`
        );

    };


    // =========================================================
    // EDIT BRAND
    // =========================================================

    const handleEdit = (brand) => {

        console.log(
            "Edit Brand:",
            brand
        );


        const brandId =
            brand?.brandId ??
            brand?.BrandId;


        console.log(
            "Brand ID:",
            brandId
        );


        if (
            brandId === undefined ||
            brandId === null ||
            brandId === ""
        ) {

            setError(
                "Brand ID is missing."
            );

            return;

        }


        navigate(
            `/brands/${brandId}/edit`
        );

    };


    // =========================================================
    // OPEN BRAND MODELS
    // =========================================================
    //
    // Brand Models are opened ONLY from BrandList.
    //
    // Example:
    //
    // Brand ID = 3
    //
    // /brands/3/models
    //
    // BrandModelTable receives:
    //
    // brandId = 3
    //
    // =========================================================

    const handleModels = (brand) => {

        console.log(
            "Brand Models clicked:",
            brand
        );


        const brandId =
            brand?.brandId ??
            brand?.BrandId;


        console.log(
            "Brand ID for models:",
            brandId
        );


        if (
            brandId === undefined ||
            brandId === null ||
            brandId === ""
        ) {

            setError(
                "Brand ID is missing."
            );

            return;

        }


        navigate(
            `/brands/${brandId}/models`
        );

    };


    // =========================================================
    // DELETE BRAND
    // =========================================================

    const handleDelete = async (
        brand
    ) => {

        const brandId =
            brand?.brandId ??
            brand?.BrandId;


        const brandName =
            brand?.brandName ??
            brand?.BrandName ??
            "this brand";


        if (
            brandId === undefined ||
            brandId === null ||
            brandId === ""
        ) {

            setError(
                "Brand ID is missing."
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${brandName}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setLoading(true);
            setError("");


            console.log(
                "Deleting Brand:",
                brandId
            );


            const response =
                await fetch(
                    `${SERVER_URL}/api/brand/${brandId}`,
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
        brands.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );


    // =========================================================
    // INITIAL LOADING
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
                    brands
                }
            />


            {/* =================================================
                BRAND TABLE
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

                onModels={
                    handleModels
                }
            />

        </Box>

    );

};


export default BrandList;
