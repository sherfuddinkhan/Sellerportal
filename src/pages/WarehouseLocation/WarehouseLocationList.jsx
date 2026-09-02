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

    const navigate = useNavigate();

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
    // LOAD
    // =====================================================

    const loadLocations = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${SERVER_URL}/api/warehouse-locations`
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to load warehouse locations."
                );
            }

            const data =
                await response.json();

            setLocations(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            setError(
                err.message ||
                "Failed to load warehouse locations."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadLocations();
    }, []);


    // =====================================================
    // FILTER
    // =====================================================

    const filteredLocations = useMemo(() => {

        let result = [...locations];

        const search =
            searchText
                .trim()
                .toLowerCase();

        if (search) {

            result = result.filter(
                location => {

                    const values = [

                        location.LocationId,
                        location.locationId,

                        location.WarehouseId,
                        location.warehouseId,

                        location.CustomerId,
                        location.customerId,

                        location.LocationCode,
                        location.locationCode,

                        location.LocationName,
                        location.locationName,

                        location.Aisle,
                        location.aisle,

                        location.Rack,
                        location.rack,

                        location.Shelf,
                        location.shelf,

                        location.Bin,
                        location.bin
                    ];

                    return values.some(
                        value =>
                            String(
                                value ?? ""
                            )
                                .toLowerCase()
                                .includes(search)
                    );
                }
            );
        }


        if (statusFilter !== "all") {

            const active =
                statusFilter === "active";

            result = result.filter(
                location =>
                    Boolean(
                        location.IsActive ??
                        location.isActive
                    ) === active
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

        if (page > totalPages) {
            setPage(totalPages);
        }

    }, [
        page,
        totalPages
    ]);


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = location => {

        const id =
            location.LocationId ??
            location.locationId;

        navigate(
            `/warehouse-locations/details/${id}`
        );
    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = location => {

        const id =
            location.LocationId ??
            location.locationId;

        navigate(
            `/warehouse-locations/edit/${id}`
        );
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDeleteClick = location => {

        setSelectedLocation(location);
        setDeleteOpen(true);
    };


    const handleDelete = async () => {

        if (!selectedLocation) {
            return;
        }

        const id =
            selectedLocation.LocationId ??
            selectedLocation.locationId;

        try {

            setError("");
            setSuccess("");

            const response =
                await fetch(
                    `${SERVER_URL}/api/warehouse-locations/${id}`,
                    {
                        method: "DELETE"
                    }
                );

            if (!response.ok) {

                const body =
                    await response.json()
                        .catch(() => null);

                throw new Error(
                    body?.message ||
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
            setSelectedLocation(null);

        } catch (err) {

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
        <Box sx={{ p: 3 }}>

            <WarehouseLocationToolbar
                onAdd={() =>
                    navigate(
                        "/warehouse-locations/create"
                    )
                }
                onRefresh={loadLocations}
                onExport={() =>
                    console.log(
                        "Export warehouse locations"
                    )
                }
            />


            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}


            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            )}


            <WarehouseLocationStatistics
                locations={locations}
            />


            <WarehouseLocationSearch
                searchText={searchText}
                onSearchChange={value => {
                    setSearchText(value);
                    setPage(1);
                }}
                statusFilter={statusFilter}
                onStatusChange={value => {
                    setStatusFilter(value);
                    setPage(1);
                }}
            />


            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
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
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={
                            handleDeleteClick
                        }
                    />

                    <WarehouseLocationPagination
                        page={page}
                        pageSize={pageSize}
                        totalItems={
                            filteredLocations.length
                        }
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onPageSizeChange={value => {
                            setPageSize(value);
                            setPage(1);
                        }}
                    />
                </>

            )}


            <DeleteWarehouseLocationDialog
                open={deleteOpen}
                location={selectedLocation}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedLocation(null);
                }}
                onConfirm={handleDelete}
            />

        </Box>
    );
};


export default WarehouseLocationList;