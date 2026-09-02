// =========================================================
// WarehouseList.jsx
// Warehouse List / Search / Filter / Pagination / CRUD
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Alert,
    Snackbar
} from "@mui/material";

import WarehouseToolbar from "./WarehouseToolbar";
import WarehouseStatistics from "./WarehouseStatistics";
import WarehouseSearch from "./WarehouseSearch";
import WarehouseTable from "./WarehouseTable";
import WarehousePagination from "./WarehousePagination";
import WarehouseModal from "./WarehouseModal";
import WarehouseView from "./WarehouseView";
import DeleteWarehouseDialog from "./DeleteWarehouseDialog";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// WarehouseList
// =========================================================

const WarehouseList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [warehouses, setWarehouses] = useState([]);

    const [filteredWarehouses, setFilteredWarehouses] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD WAREHOUSES
    // =====================================================

    const loadWarehouses = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/warehouse`
            );

            if (!response.ok) {

                throw new Error(
                    `Failed to load warehouses. Status: ${response.status}`
                );

            }

            const data = await response.json();

            // -------------------------------------------------
            // Support both:
            // [ ... ]
            //
            // and:
            // { data: [ ... ] }
            // -------------------------------------------------

            const warehouseData =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

            setWarehouses(warehouseData);

            setFilteredWarehouses(warehouseData);

        }
        catch (err) {

            console.error(
                "Load Warehouses Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load warehouses."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadWarehouses();

    }, []);


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    useEffect(() => {

        let result = [...warehouses];


        // -------------------------------------------------
        // SEARCH
        // -------------------------------------------------

        if (searchText.trim() !== "") {

            const search =
                searchText
                    .trim()
                    .toLowerCase();

            result = result.filter((item) => {

                return (

                    item.WarehouseCode
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    item.WarehouseName
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    item.City
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    item.State
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    item.Country
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    item.ContactPerson
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    item.Phone
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    item.Email
                        ?.toLowerCase()
                        .includes(search)

                );

            });

        }


        // -------------------------------------------------
        // STATUS FILTER
        // -------------------------------------------------

        if (statusFilter !== "All") {

            result = result.filter((item) => {

                if (statusFilter === "Active") {

                    return item.IsActive === true;

                }

                if (statusFilter === "Inactive") {

                    return item.IsActive === false;

                }

                return true;

            });

        }


        setFilteredWarehouses(result);

        setPage(1);

    }, [
        warehouses,
        searchText,
        statusFilter
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.ceil(
            filteredWarehouses.length /
            pageSize
        );

    const pagedWarehouses =
        filteredWarehouses.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =====================================================
    // CREATE / UPDATE WAREHOUSE
    // =====================================================

    const handleSave = async (data) => {

        try {

            setError("");

            setLoading(true);


            // -------------------------------------------------
            // UPDATE
            // -------------------------------------------------

            if (data.WarehouseId) {

                const response = await fetch(
                    `${SERVER_URL}/api/warehouse/${data.WarehouseId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        `Failed to update warehouse. Status: ${response.status}`
                    );

                }


                setSuccess(
                    "Warehouse updated successfully."
                );

            }


            // -------------------------------------------------
            // CREATE
            // -------------------------------------------------

            else {

                const response = await fetch(
                    `${SERVER_URL}/api/warehouse`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        `Failed to create warehouse. Status: ${response.status}`
                    );

                }


                setSuccess(
                    "Warehouse created successfully."
                );

            }


            // -------------------------------------------------
            // REFRESH
            // -------------------------------------------------

            await loadWarehouses();


            // -------------------------------------------------
            // CLOSE MODAL
            // -------------------------------------------------

            setModalOpen(false);

            setSelectedWarehouse(null);

        }
        catch (err) {

            console.error(
                "Save Warehouse Error:",
                err
            );

            setError(
                err.message ||
                "Failed to save warehouse."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // DELETE WAREHOUSE
    // =====================================================

    const handleDelete = async (id) => {

        try {

            setError("");

            setLoading(true);


            const response = await fetch(
                `${SERVER_URL}/api/warehouse/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    `Failed to delete warehouse. Status: ${response.status}`
                );

            }


            setSuccess(
                "Warehouse deleted successfully."
            );


            // -------------------------------------------------
            // REFRESH
            // -------------------------------------------------

            await loadWarehouses();


            // -------------------------------------------------
            // CLOSE DELETE DIALOG
            // -------------------------------------------------

            setDeleteOpen(false);

            setSelectedWarehouse(null);

        }
        catch (err) {

            console.error(
                "Delete Warehouse Error:",
                err
            );

            setError(
                err.message ||
                "Failed to delete warehouse."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CLOSE SUCCESS MESSAGE
    // =====================================================

    const handleSuccessClose = () => {

        setSuccess("");

    };


    // =====================================================
    // CLOSE ERROR MESSAGE
    // =====================================================

    const handleErrorClose = () => {

        setError("");

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <WarehouseToolbar

                onAdd={() => {

                    setSelectedWarehouse(null);

                    setModalOpen(true);

                }}

                onRefresh={loadWarehouses}

                onExport={() => {

                    console.log(
                        "Export Warehouses"
                    );

                }}

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <WarehouseStatistics
                warehouses={warehouses}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <WarehouseSearch

                searchText={searchText}

                setSearchText={setSearchText}

                statusFilter={statusFilter}

                setStatusFilter={setStatusFilter}

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <WarehouseTable

                warehouses={pagedWarehouses}

                loading={loading}

                onView={(row) => {

                    setSelectedWarehouse(row);

                    setViewOpen(true);

                }}

                onEdit={(row) => {

                    setSelectedWarehouse(row);

                    setModalOpen(true);

                }}

                onDelete={(row) => {

                    setSelectedWarehouse(row);

                    setDeleteOpen(true);

                }}

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <WarehousePagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredWarehouses.length
                }

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <WarehouseModal

                open={modalOpen}

                warehouse={selectedWarehouse}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedWarehouse(null);

                }}

                onSave={handleSave}

            />


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            <WarehouseView

                open={viewOpen}

                warehouse={selectedWarehouse}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedWarehouse(null);

                }}

            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteWarehouseDialog

                open={deleteOpen}

                warehouse={selectedWarehouse}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedWarehouse(null);

                }}

                onDeleted={handleDelete}

            />


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            <Snackbar

                open={Boolean(success)}

                autoHideDuration={3000}

                onClose={handleSuccessClose}

            >

                <Alert
                    severity="success"
                    onClose={handleSuccessClose}
                    variant="filled"
                >
                    {success}
                </Alert>

            </Snackbar>


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            <Snackbar

                open={Boolean(error)}

                autoHideDuration={5000}

                onClose={handleErrorClose}

            >

                <Alert
                    severity="error"
                    onClose={handleErrorClose}
                    variant="filled"
                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default WarehouseList;