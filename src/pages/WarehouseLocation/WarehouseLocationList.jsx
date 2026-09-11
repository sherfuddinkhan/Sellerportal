import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import WarehouseLocationToolbar
    from "./WarehouseLocationToolbar";

import WarehouseLocationStatistics
    from "./WarehouseLocationStatistics";

import WarehouseLocationSearch
    from "./WarehouseLocationSearch";

import WarehouseLocationTable
    from "./WarehouseLocationTable";

import WarehouseLocationPagination
    from "./WarehouseLocationPagination";

import DeleteWarehouseLocationDialog
    from "./DeleteWarehouseLocationDialog";


const SERVER_URL =
    "http://localhost:5000";


const WarehouseLocationList = () => {

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        locations,
        setLocations
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    const [
        searchText,
        setSearchText
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter
    ] = useState("all");


    const [
        page,
        setPage
    ] = useState(1);


    const [
        pageSize,
        setPageSize
    ] = useState(10);


    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);


    const [
        selectedLocation,
        setSelectedLocation
    ] = useState(null);


    // =====================================================
    // LOAD ALL LOCATIONS
    // =====================================================

    const loadLocations =
        async () => {

            try {

                setLoading(true);
                setError("");


                console.log(
                    "================================================"
                );

                console.log(
                    "GET /api/warehouse-locations"
                );

                console.log(
                    "================================================"
                );


                const response =
                    await fetch(
                        `${SERVER_URL}/api/warehouse-locations`,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => null
                        );


                console.log(
                    "GET RESPONSE:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        data?.error ||
                        "Failed to load warehouse locations."
                    );
                }


                const list =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(
                            data?.data
                        )
                            ? data.data
                            : [];


                setLocations(list);

            } catch (err) {

                console.error(
                    "LOAD WAREHOUSE LOCATIONS ERROR:",
                    err
                );


                setLocations([]);


                setError(
                    err.message ||
                    "Failed to load warehouse locations."
                );

            } finally {

                setLoading(false);
            }
        };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadLocations();

    }, []);


    // =====================================================
    // FILTER
    // =====================================================

    const filteredLocations =
        useMemo(() => {

            let result =
                [...locations];


            const search =
                searchText
                    .trim()
                    .toLowerCase();


            // =============================================
            // SEARCH
            // =============================================

            if (search) {

                result =
                    result.filter(
                        location => {

                            const values = [

                                // Location
                                location.LocationId,
                                location.locationId,

                                // Warehouse
                                location.WarehouseId,
                                location.warehouseId,

                                // Seller
                                location.SellerId,
                                location.sellerId,

                                // Customer
                                location.CustomerId,
                                location.customerId,

                                // Code
                                location.LocationCode,
                                location.locationCode,

                                // Name
                                location.LocationName,
                                location.locationName,

                                // Description
                                location.Description,
                                location.description
                            ];


                            return values.some(
                                value =>
                                    String(
                                        value ?? ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            search
                                        )
                            );
                        }
                    );
            }


            // =============================================
            // STATUS
            // =============================================

            if (
                statusFilter !==
                "all"
            ) {

                const active =
                    statusFilter ===
                    "active";


                result =
                    result.filter(
                        location => {

                            const value =
                                location.IsActive ??
                                location.isActive;


                            return Boolean(
                                value
                            ) === active;
                        }
                    );
            }


            return result;

        }, [
            locations,
            searchText,
            statusFilter
        ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredLocations.length /
                pageSize
            )
        );


    const paginatedLocations =
        filteredLocations.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    useEffect(() => {

        if (
            page >
            totalPages
        ) {

            setPage(
                totalPages
            );
        }

    }, [
        page,
        totalPages
    ]);


    // =====================================================
    // VIEW
    // =====================================================

    const handleView =
        location => {

            const id =
                location.LocationId ??
                location.locationId;


            if (!id) {

                setError(
                    "Invalid warehouse location ID."
                );

                return;
            }


            navigate(
                `/warehouse-locations/details/${id}`
            );
        };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit =
        location => {

            const id =
                location.LocationId ??
                location.locationId;


            if (!id) {

                setError(
                    "Invalid warehouse location ID."
                );

                return;
            }


            navigate(
                `/warehouse-locations/edit/${id}`
            );
        };


    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick =
        location => {

            setSelectedLocation(
                location
            );

            setDeleteOpen(true);
        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        async () => {

            if (
                !selectedLocation
            ) {

                return;
            }


            const id =
                selectedLocation.LocationId ??
                selectedLocation.locationId;


            if (!id) {

                setError(
                    "Invalid warehouse location ID."
                );

                return;
            }


            try {

                setError("");
                setSuccess("");


                console.log(
                    "================================================"
                );

                console.log(
                    `DELETE /api/warehouse-locations/${id}`
                );

                console.log(
                    "================================================"
                );


                const response =
                    await fetch(
                        `${SERVER_URL}/api/warehouse-locations/${id}`,
                        {
                            method: "DELETE",

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => null
                        );


                console.log(
                    "DELETE RESPONSE:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        data?.error ||
                        "Failed to delete warehouse location."
                    );
                }


                setLocations(
                    previous =>
                        previous.filter(
                            location =>
                                (
                                    location.LocationId ??
                                    location.locationId
                                ) !== id
                        )
                );


                setSuccess(
                    "Warehouse location deleted successfully."
                );


                setDeleteOpen(false);

                setSelectedLocation(
                    null
                );

            } catch (err) {

                console.error(
                    "DELETE WAREHOUSE LOCATION ERROR:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to delete warehouse location."
                );
            }
        };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =============================================
                TOOLBAR
            ============================================= */}

            <WarehouseLocationToolbar
                onAdd={() =>
                    navigate(
                        "/warehouse-locations/create"
                    )
                }

                onRefresh={
                    loadLocations
                }

                onExport={() =>
                    console.log(
                        "Export warehouse locations"
                    )
                }
            />


            {/* =============================================
                ERROR
            ============================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}

                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>
            )}


            {/* =============================================
                SUCCESS
            ============================================= */}

            {success && (

                <Alert
                    severity="success"
                    sx={{
                        mb: 2
                    }}

                    onClose={() =>
                        setSuccess("")
                    }
                >
                    {success}
                </Alert>
            )}


            {/* =============================================
                STATISTICS
            ============================================= */}

            <WarehouseLocationStatistics
                locations={
                    locations
                }
            />


            {/* =============================================
                SEARCH
            ============================================= */}

            <WarehouseLocationSearch

                searchText={
                    searchText
                }

                onSearchChange={
                    value => {

                        setSearchText(
                            value
                        );

                        setPage(1);
                    }
                }

                statusFilter={
                    statusFilter
                }

                onStatusChange={
                    value => {

                        setStatusFilter(
                            value
                        );

                        setPage(1);
                    }
                }
            />


            {/* =============================================
                TABLE
            ============================================= */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 8
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <>

                    <WarehouseLocationTable

                        locations={
                            paginatedLocations
                        }

                        onView={
                            handleView
                        }

                        onEdit={
                            handleEdit
                        }

                        onDelete={
                            handleDeleteClick
                        }
                    />


                    {/* =====================================
                        PAGINATION
                    ===================================== */}

                    <WarehouseLocationPagination

                        page={
                            page
                        }

                        pageSize={
                            pageSize
                        }

                        totalItems={
                            filteredLocations.length
                        }

                        totalPages={
                            totalPages
                        }

                        onPageChange={
                            setPage
                        }

                        onPageSizeChange={
                            value => {

                                setPageSize(
                                    value
                                );

                                setPage(1);
                            }
                        }
                    />

                </>

            )}


            {/* =============================================
                DELETE DIALOG
            ============================================= */}

            <DeleteWarehouseLocationDialog

                open={
                    deleteOpen
                }

                location={
                    selectedLocation
                }

                onClose={() => {

                    setDeleteOpen(
                        false
                    );

                    setSelectedLocation(
                        null
                    );
                }}

                onConfirm={
                    handleDelete
                }
            />

        </Box>
    );
};


export default WarehouseLocationList;
