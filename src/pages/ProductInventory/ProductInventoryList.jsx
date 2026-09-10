// =========================================================
// ProductInventoryList.jsx
// Product Inventory Management
// React -> Node server.js -> ASP.NET Core API
// =========================================================

import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    Snackbar
} from "@mui/material";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

import ProductInventoryToolbar
    from "./ProductInventoryToolbar";

import ProductInventoryStatistics
    from "./ProductInventoryStatistics";

import ProductInventorySearch
    from "./ProductInventorySearch";

import ProductInventoryFilters
    from "./ProductInventoryFilters";

import ProductInventoryTable
    from "./ProductInventoryTable";

import ProductInventoryPagination
    from "./ProductInventoryPagination";

import ProductInventoryModal
    from "./ProductInventoryModal";

import ProductInventoryView
    from "./ProductInventoryView";

import DeleteProductInventoryDialog
    from "./DeleteProductInventoryDialog";


// =========================================================
// SERVER CONFIGURATION
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

const INVENTORY_API =
    `${SERVER_URL}/api/product-inventories`;


// =========================================================
// COMPONENT
// =========================================================

const ProductInventoryList = () => {

    const navigate = useNavigate();


    // =====================================================
    // INVENTORIES
    // =====================================================

    const [inventories, setInventories] =
        useState([]);


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // SEARCH
    // =====================================================

    const [searchText, setSearchText] =
        useState("");


    // =====================================================
    // STATUS
    // =====================================================

    const [statusFilter, setStatusFilter] =
        useState("All");


    // =====================================================
    // WAREHOUSE
    // =====================================================

    const [warehouseFilter, setWarehouseFilter] =
        useState("");


    // =====================================================
    // QUANTITY
    // out / low / available
    // =====================================================

    const [quantityFilter, setQuantityFilter] =
        useState("");


    // =====================================================
    // SELECTED INVENTORY
    // =====================================================

    const [selectedInventory, setSelectedInventory] =
        useState(null);


    // =====================================================
    // CREATE / EDIT MODAL
    // =====================================================

    const [modalOpen, setModalOpen] =
        useState(false);


    // =====================================================
    // VIEW
    // =====================================================

    const [viewOpen, setViewOpen] =
        useState(false);


    // =====================================================
    // DELETE
    // =====================================================

    const [deleteOpen, setDeleteOpen] =
        useState(false);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);


    // =====================================================
    // MESSAGES
    // =====================================================

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // GET ALL PRODUCT INVENTORIES
    //
    // React
    //    ->
    // Node server.js
    //    ->
    // ASP.NET Core
    //
    // GET
    // http://localhost:5000/api/product-inventories/all
    // =========================================================

    const loadInventories = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "GET:",
                `${INVENTORY_API}/all`
            );


            const response =
                await axios.get(
                    `${INVENTORY_API}/all`
                );


            console.log(
                "GET ALL PRODUCT INVENTORIES RESPONSE:",
                response.data
            );


            const data =
                response.data;


            // =================================================
            // RESPONSE IS DIRECT ARRAY
            // =================================================

            if (Array.isArray(data)) {

                setInventories(data);

                return;
            }


            // =================================================
            // RESPONSE:
            // { data: [] }
            // =================================================

            if (
                Array.isArray(data?.data)
            ) {

                setInventories(
                    data.data
                );

                return;
            }


            // =================================================
            // RESPONSE:
            // { items: [] }
            // =================================================

            if (
                Array.isArray(data?.items)
            ) {

                setInventories(
                    data.items
                );

                return;
            }


            // =================================================
            // RESPONSE:
            // { inventories: [] }
            // =================================================

            if (
                Array.isArray(
                    data?.inventories
                )
            ) {

                setInventories(
                    data.inventories
                );

                return;
            }


            // =================================================
            // UNKNOWN RESPONSE
            // =================================================

            console.warn(
                "Unexpected Product Inventory Response:",
                data
            );

            setInventories([]);

            setError(
                "Product inventory API returned an unexpected response."
            );

        }
        catch (err) {

            console.error(
                "GET ALL PRODUCT INVENTORIES ERROR:",
                err
            );


            console.error(
                "STATUS:",
                err?.response?.status
            );


            console.error(
                "RESPONSE:",
                err?.response?.data
            );


            const message =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Failed to load product inventories.";


            setInventories([]);

            setError(message);

        }
        finally {

            setLoading(false);
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadInventories();

    }, []);


    // =========================================================
    // FILTER INVENTORIES
    // =========================================================

    const filteredInventories =
        useMemo(() => {

            let result =
                [...inventories];


            // =================================================
            // SEARCH
            // =================================================

            if (
                searchText.trim() !== ""
            ) {

                const search =
                    searchText
                        .trim()
                        .toLowerCase();


                result =
                    result.filter(
                        (item) => {

                            const inventoryId =
                                item.productInventoryId ??
                                item.ProductInventoryId ??
                                "";

                            const productId =
                                item.productId ??
                                item.ProductId ??
                                "";

                            const sellerId =
                                item.sellerId ??
                                item.SellerId ??
                                "";

                            const customerId =
                                item.customerId ??
                                item.CustomerId ??
                                "";

                            const warehouseId =
                                item.warehouseId ??
                                item.WarehouseId ??
                                "";

                            const locationId =
                                item.locationId ??
                                item.LocationId ??
                                "";

                            const productName =
                                item.productName ??
                                item.ProductName ??
                                "";

                            const warehouseName =
                                item.warehouseName ??
                                item.WarehouseName ??
                                "";

                            const stockStatus =
                                item.stockStatus ??
                                item.StockStatus ??
                                "";


                            return (

                                String(inventoryId)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(productId)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(sellerId)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(customerId)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(warehouseId)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(locationId)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(productName)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(warehouseName)
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                String(stockStatus)
                                    .toLowerCase()
                                    .includes(search)
                            );
                        }
                    );
            }


            // =================================================
            // ACTIVE / INACTIVE
            // =================================================

            if (
                statusFilter !== "All"
            ) {

                result =
                    result.filter(
                        (item) => {

                            const isActive =
                                item.isActive ??
                                item.IsActive ??
                                false;


                            if (
                                statusFilter === "Active"
                            ) {

                                return isActive === true;
                            }


                            if (
                                statusFilter === "Inactive"
                            ) {

                                return isActive === false;
                            }


                            return true;
                        }
                    );
            }


            // =================================================
            // WAREHOUSE
            // =================================================

            if (
                warehouseFilter !== ""
            ) {

                result =
                    result.filter(
                        (item) => {

                            const warehouseId =
                                item.warehouseId ??
                                item.WarehouseId ??
                                "";


                            return (
                                String(warehouseId) ===
                                String(warehouseFilter)
                            );
                        }
                    );
            }


            // =================================================
            // QUANTITY
            // =================================================

            if (
                quantityFilter !== ""
            ) {

                result =
                    result.filter(
                        (item) => {

                            const available =
                                Number(
                                    item.availableQuantity ??
                                    item.AvailableQuantity ??
                                    0
                                );


                            const reorder =
                                Number(
                                    item.reorderLevel ??
                                    item.ReorderLevel ??
                                    0
                                );


                            // ---------------------------------
                            // OUT OF STOCK
                            // ---------------------------------

                            if (
                                quantityFilter === "out"
                            ) {

                                return available === 0;
                            }


                            // ---------------------------------
                            // LOW STOCK
                            // ---------------------------------

                            if (
                                quantityFilter === "low"
                            ) {

                                return (
                                    available > 0 &&
                                    available <= reorder
                                );
                            }


                            // ---------------------------------
                            // AVAILABLE
                            // ---------------------------------

                            if (
                                quantityFilter === "available"
                            ) {

                                return available > reorder;
                            }


                            return true;
                        }
                    );
            }


            return result;

        }, [
            inventories,
            searchText,
            statusFilter,
            warehouseFilter,
            quantityFilter
        ]);


    // =========================================================
    // RESET PAGE WHEN FILTER CHANGES
    // =========================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText,
        statusFilter,
        warehouseFilter,
        quantityFilter
    ]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalRecords =
        filteredInventories.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );


    const pagedInventories =
        filteredInventories.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearchText("");

        setStatusFilter("All");

        setWarehouseFilter("");

        setQuantityFilter("");

        setPage(1);
    };


    // =========================================================
    // SAVE INVENTORY
    //
    // POST
    // /api/product-inventories
    //
    // PUT
    // /api/product-inventories/{id}
    // =========================================================

    const handleSave =
        async (data) => {

            try {

                setLoading(true);

                setError("");


                const inventoryId =
                    data.productInventoryId ??
                    data.ProductInventoryId;


                // =============================================
                // UPDATE
                // =============================================

                if (inventoryId) {

                    console.log(
                        "PUT PRODUCT INVENTORY:",
                        inventoryId,
                        data
                    );


                    await axios.put(
                        `${INVENTORY_API}/${inventoryId}`,
                        data
                    );


                    setSuccess(
                        "Product inventory updated successfully."
                    );
                }


                // =============================================
                // CREATE
                // =============================================

                else {

                    console.log(
                        "POST PRODUCT INVENTORY:",
                        data
                    );


                    await axios.post(
                        INVENTORY_API,
                        data
                    );


                    setSuccess(
                        "Product inventory created successfully."
                    );
                }


                // =============================================
                // RELOAD
                // =============================================

                await loadInventories();


                setModalOpen(false);

                setSelectedInventory(null);

            }
            catch (err) {

                console.error(
                    "SAVE PRODUCT INVENTORY ERROR:",
                    err
                );


                console.error(
                    "RESPONSE:",
                    err?.response?.data
                );


                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    err?.message ||
                    "Failed to save product inventory."
                );
            }
            finally {

                setLoading(false);
            }
        };


    // =========================================================
    // DELETE INVENTORY
    //
    // DELETE
    // /api/product-inventories/{id}
    // =========================================================

    const handleDelete =
        async (id) => {

            try {

                setLoading(true);

                setError("");


                if (!id) {

                    throw new Error(
                        "Product inventory ID is required."
                    );
                }


                console.log(
                    "DELETE PRODUCT INVENTORY:",
                    id
                );


                await axios.delete(
                    `${INVENTORY_API}/${id}`
                );


                setSuccess(
                    "Product inventory deleted successfully."
                );


                await loadInventories();


                setDeleteOpen(false);

                setSelectedInventory(null);

            }
            catch (err) {

                console.error(
                    "DELETE PRODUCT INVENTORY ERROR:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    err?.message ||
                    "Failed to delete product inventory."
                );
            }
            finally {

                setLoading(false);
            }
        };


    // =========================================================
    // VIEW
    // =========================================================

    const handleView =
        (row) => {

            const id =
                row.productInventoryId ??
                row.ProductInventoryId;


            if (!id) {

                setError(
                    "Inventory ID is missing."
                );

                return;
            }


            setSelectedInventory(row);

            setViewOpen(true);

            // If you prefer a dedicated page:
            // navigate(`/product-inventory/details/${id}`);
        };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit =
        (row) => {

            const id =
                row.productInventoryId ??
                row.ProductInventoryId;


            if (!id) {

                setError(
                    "Inventory ID is missing."
                );

                return;
            }


            navigate(
                `/product-inventory/edit/${id}`
            );
        };


    // =========================================================
    // ADD
    // =========================================================

    const handleAdd =
        () => {

            setSelectedInventory(null);

            setModalOpen(true);
        };


    // =========================================================
    // DELETE CLICK
    // =========================================================

    const handleDeleteClick =
        (row) => {

            if (!row) {

                setError(
                    "No inventory record selected."
                );

                return;
            }


            const id =
                row.productInventoryId ??
                row.ProductInventoryId;


            if (!id) {

                setError(
                    "Inventory ID is missing."
                );

                return;
            }


            setSelectedInventory(row);

            setDeleteOpen(true);
        };


    // =========================================================
    // EXPORT CSV
    // =========================================================

    const handleExport =
        () => {

            if (
                !filteredInventories.length
            ) {

                setError(
                    "No inventory records available to export."
                );

                return;
            }


            const headers = [

                "Inventory ID",
                "Product ID",
                "Seller ID",
                "Customer ID",
                "Warehouse ID",
                "Location ID",
                "Quantity",
                "Available Quantity",
                "Reserved Quantity",
                "Reorder Level",
                "Min Stock Level",
                "Max Stock Level",
                "Stock Status",
                "Active"

            ];


            const rows =
                filteredInventories.map(
                    (item) => [

                        item.productInventoryId ??
                            item.ProductInventoryId ??
                            "",

                        item.productId ??
                            item.ProductId ??
                            "",

                        item.sellerId ??
                            item.SellerId ??
                            "",

                        item.customerId ??
                            item.CustomerId ??
                            "",

                        item.warehouseId ??
                            item.WarehouseId ??
                            "",

                        item.locationId ??
                            item.LocationId ??
                            "",

                        item.quantity ??
                            item.Quantity ??
                            0,

                        item.availableQuantity ??
                            item.AvailableQuantity ??
                            0,

                        item.reservedQuantity ??
                            item.ReservedQuantity ??
                            0,

                        item.reorderLevel ??
                            item.ReorderLevel ??
                            0,

                        item.minStockLevel ??
                            item.MinStockLevel ??
                            0,

                        item.maxStockLevel ??
                            item.MaxStockLevel ??
                            0,

                        item.stockStatus ??
                            item.StockStatus ??
                            "",

                        (
                            item.isActive ??
                            item.IsActive ??
                            false
                        )
                            ? "Active"
                            : "Inactive"

                    ]
                );


            const csv =
                [
                    headers,
                    ...rows
                ]
                    .map(
                        (row) =>
                            row
                                .map(
                                    (value) => {

                                        const text =
                                            String(
                                                value ?? ""
                                            );


                                        return (
                                            `"${text.replace(
                                                /"/g,
                                                '""'
                                            )}"`
                                        );
                                    }
                                )
                                .join(",")
                    )
                    .join("\n");


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "product-inventory.csv";


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);


            URL.revokeObjectURL(url);


            setSuccess(
                "Product inventory exported successfully."
            );
        };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ProductInventoryToolbar
                onAdd={handleAdd}
                onRefresh={loadInventories}
                onExport={handleExport}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <ProductInventoryStatistics
                inventories={inventories}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <ProductInventorySearch
                searchText={searchText}
                setSearchText={setSearchText}

                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}

                warehouseFilter={warehouseFilter}
                setWarehouseFilter={setWarehouseFilter}

                inventories={inventories}

                onClear={handleClearFilters}
            />


            {/* =================================================
                FILTERS
            ================================================= */}

            <ProductInventoryFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}

                quantityFilter={quantityFilter}
                setQuantityFilter={setQuantityFilter}

                inventories={inventories}
            />


            {/* =================================================
                TABLE
            ================================================= */}

            <ProductInventoryTable
                inventories={pagedInventories}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <ProductInventoryPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);
                }}
            />


            {/* =================================================
                CREATE / EDIT
            ================================================= */}

            <ProductInventoryModal
                open={modalOpen}
                inventory={selectedInventory}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedInventory(null);
                }}

                onSave={handleSave}
            />


            {/* =================================================
                VIEW
            ================================================= */}

            <ProductInventoryView
                open={viewOpen}
                inventory={selectedInventory}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedInventory(null);
                }}
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteProductInventoryDialog
                open={deleteOpen}
                inventory={selectedInventory}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedInventory(null);
                }}

                onDeleted={handleDelete}
            />


            {/* =================================================
                ERROR
            ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}

                onClose={() =>
                    setError("")
                }
            >

                <Alert
                    severity="error"
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            </Snackbar>


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}

                onClose={() =>
                    setSuccess("")
                }
            >

                <Alert
                    severity="success"
                    onClose={() =>
                        setSuccess("")
                    }
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProductInventoryList;
