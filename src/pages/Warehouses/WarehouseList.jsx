import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import WarehouseToolbar from "./WarehouseToolbar";
import WarehouseStatistics from "./WarehouseStatistics";
import WarehouseSearch from "./WarehouseSearch";
import WarehouseTable from "./WarehouseTable";
import WarehousePagination from "./WarehousePagination";
import WarehouseModal from "./WarehouseModal";
import WarehouseView from "./WarehouseView";
import DeleteWarehouseDialog from "./DeleteWarehouseDialog";

const WarehouseList = () => {

    // ==========================================
    // State
    // ==========================================

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

    // ==========================================
    // Load Warehouses
    // ==========================================

    const loadWarehouses = async () => {

        try {

            setLoading(true);

            const response = await apiService.getWarehouses();

            setWarehouses(response.data);

            setFilteredWarehouses(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadWarehouses();

    }, []);

    // ==========================================
    // Search & Filter
    // ==========================================

    useEffect(() => {

        let result = [...warehouses];

        if (searchText.trim() !== "") {

            const search = searchText.toLowerCase();

            result = result.filter(item =>

                item.WarehouseCode?.toLowerCase().includes(search) ||

                item.WarehouseName?.toLowerCase().includes(search) ||

                item.City?.toLowerCase().includes(search) ||

                item.State?.toLowerCase().includes(search) ||

                item.Country?.toLowerCase().includes(search) ||

                item.ContactPerson?.toLowerCase().includes(search) ||

                item.Phone?.toLowerCase().includes(search) ||

                item.Email?.toLowerCase().includes(search)

            );

        }

        if (statusFilter !== "All") {

            result = result.filter(item =>

                statusFilter === "Active"

                    ? item.IsActive

                    : !item.IsActive

            );

        }

        setFilteredWarehouses(result);

        setPage(1);

    }, [
        warehouses,
        searchText,
        statusFilter
    ]);

    // ==========================================
    // Pagination
    // ==========================================

    const totalPages = Math.ceil(filteredWarehouses.length / pageSize);
    const pagedWarehouses = filteredWarehouses.slice((page - 1) * pageSize,page * pageSize);
    // ==========================================
    // Save Warehouse
    // ==========================================

    const handleSave = async (data) => {

        try {

            if (data.WarehouseId) {

                await apiService.updateWarehouse(
                    data.WarehouseId,
                    data
                );
            }
            else {
                await apiService.createWarehouse(data);
            }
            await loadWarehouses();
            setModalOpen(false);
            setSelectedWarehouse(null);
        }
        catch (err) {
            console.log(err);
        }
    };

    // ==========================================
    // Delete Warehouse
    // ==========================================

    const handleDelete = async (id) => {

        try {

            await apiService.deleteWarehouse(id);

            await loadWarehouses();

            setDeleteOpen(false);

            setSelectedWarehouse(null);

        }

        catch (err) {

            console.log(err);

        }

    };
        // ==========================================
    // Render
    // ==========================================

    return (

        <Box sx={{ p: 3 }}>

            <WarehouseToolbar

                onAdd={() => {

                    setSelectedWarehouse(null);

                    setModalOpen(true);

                }}

                onRefresh={loadWarehouses}

                onExport={() =>

                    console.log("Export Warehouses")

                }

            />

            <WarehouseStatistics

                warehouses={warehouses}

            />

            <WarehouseSearch

                searchText={searchText}

                setSearchText={setSearchText}

                statusFilter={statusFilter}

                setStatusFilter={setStatusFilter}

            />

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

            <WarehousePagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={filteredWarehouses.length}

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />

            <WarehouseModal

                open={modalOpen}

                warehouse={selectedWarehouse}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedWarehouse(null);

                }}

                onSave={handleSave}

            />

            <WarehouseView

                open={viewOpen}

                warehouse={selectedWarehouse}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedWarehouse(null);

                }}

            />

            <DeleteWarehouseDialog

                open={deleteOpen}

                warehouse={selectedWarehouse}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedWarehouse(null);

                }}

                onDeleted={handleDelete}

            />

        </Box>

    );

};

export default WarehouseList;