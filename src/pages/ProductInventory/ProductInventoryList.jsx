// =========================================================
// ProductInventoryList.jsx
// Product Inventory Management
// Frontend
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

// IMPORTANT:
// Must match server.js:
// /api/product-inventories
const INVENTORY_API =
    `${SERVER_URL}/api/product-inventories`;


// =========================================================
// COMPONENT
// =========================================================

const ProductInventoryList = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [inventories, setInventories] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [stockStatusFilter, setStockStatusFilter] =
        useState("");

    const [warehouseFilter, setWarehouseFilter] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [quantityFilter, setQuantityFilter] =
        useState("");

    const [selectedInventory, setSelectedInventory] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD INVENTORIES
    // =====================================================

    const loadInventories = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Loading Product Inventories:",
                `${INVENTORY_API}/all`
            );

            const response = await axios.get(
                `${INVENTORY_API}/all`
            );

            console.log(
                "Product Inventory Response:",
                response.data
            );


            // =================================================
            // RESPONSE DATA
            // =================================================

            const data = response.data;


            // -------------------------------------------------
            // ARRAY
            // -------------------------------------------------

            if (Array.isArray(data)) {

                setInventories(data);

            }

            // -------------------------------------------------
            // { data: [] }
            // -------------------------------------------------

            else if (
                Array.isArray(data?.data)
            ) {

                setInventories(data.data);

            }

            // -------------------------------------------------
            // { inventories: [] }
            // -------------------------------------------------

            else if (
                Array.isArray(data?.inventories)
            ) {

                setInventories(
                    data.inventories
                );

            }

            // -------------------------------------------------
            // { items: [] }
            // -------------------------------------------------

            else if (
                Array.isArray(data?.items)
            ) {

                setInventories(
                    data.items
                );

            }

            // -------------------------------------------------
            // UNKNOWN RESPONSE
            // -------------------------------------------------

            else {

                console.warn(
                    "Unexpected inventory response:",
                    data
                );

                setInventories([]);

            }

        }

        catch (err) {

            console.error(
                "Load Product Inventory Error:",
                err
            );

            console.error(
                "Request URL:",
                `${INVENTORY_API}/all`
            );

            console.error(
                "Response:",
                err?.response?.data
            );


            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Failed to load product inventory."
            );

            setInventories([]);

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadInventories();

    }, []);


    // =====================================================
    // FILTER INVENTORIES
    // =====================================================

    const filteredInventories = useMemo(() => {

        let result = [...inventories];


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


            result = result.filter(
                (item) => {

                    const productId =
                        item.productId ??
                        item.ProductId ??
                        "";

                    const sellerId =
                        item.sellerId ??
                        item.SellerId ??
                        "";

                    const warehouseId =
                        item.warehouseId ??
                        item.WarehouseId ??
                        "";

                    const stockStatus =
                        item.stockStatus ??
                        item.StockStatus ??
                        "";

                    const productName =
                        item.productName ??
                        item.ProductName ??
                        "";

                    const warehouseName =
                        item.warehouseName ??
                        item.WarehouseName ??
                        "";


                    return (

                        String(productId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(sellerId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(warehouseId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(stockStatus)
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

            result = result.filter(
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
        // STOCK STATUS
        // =================================================

        if (
            stockStatusFilter !== ""
        ) {

            result = result.filter(
                (item) => {

                    const stockStatus =
                        item.stockStatus ??
                        item.StockStatus ??
                        "";


                    return (
                        String(stockStatus) ===
                        String(stockStatusFilter)
                    );

                }
            );

        }


        // =================================================
        // WAREHOUSE
        // =================================================

        if (
            warehouseFilter !== ""
        ) {

            result = result.filter(
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
        // QUANTITY FILTER
        // =================================================

        if (
            quantityFilter !== ""
        ) {

            result = result.filter(
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


                    // -------------------------------------
                    // OUT OF STOCK
                    // -------------------------------------

                    if (
                        quantityFilter === "out"
                    ) {

                        return (
                            available === 0
                        );

                    }


                    // -------------------------------------
                    // LOW STOCK
                    // -------------------------------------

                    if (
                        quantityFilter === "low"
                    ) {

                        return (
                            available > 0 &&
                            available <= reorder
                        );

                    }


                    // -------------------------------------
                    // AVAILABLE
                    // -------------------------------------

                    if (
                        quantityFilter === "available"
                    ) {

                        return (
                            available > reorder
                        );

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
        stockStatusFilter,
        warehouseFilter,
        quantityFilter
    ]);


    // =====================================================
    // RESET PAGE WHEN FILTER CHANGES
    // =====================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText,
        statusFilter,
        stockStatusFilter,
        warehouseFilter,
        quantityFilter
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredInventories.length /
                pageSize
            )
        );


    const pagedInventories =
        filteredInventories.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =====================================================
    // SAVE INVENTORY
    // =====================================================

    const handleSave = async (data) => {

        try {

            setLoading(true);
            setError("");


            const inventoryId =
                data.productInventoryId ??
                data.ProductInventoryId;


            // =================================================
            // UPDATE
            // =================================================

            if (inventoryId) {

                await axios.put(
                    `${INVENTORY_API}/${inventoryId}`,
                    data
                );


                setSuccess(
                    "Product inventory updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                await axios.post(
                    INVENTORY_API,
                    data
                );


                setSuccess(
                    "Product inventory created successfully."
                );

            }


            // =================================================
            // RELOAD
            // =================================================

            await loadInventories();


            setModalOpen(false);

            setSelectedInventory(null);

        }

        catch (err) {

            console.error(
                "Save Product Inventory Error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Failed to save product inventory."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // DELETE INVENTORY
    // =====================================================

    const handleDelete = async (id) => {

        try {

            setLoading(true);
            setError("");


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
                "Delete Product Inventory Error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Failed to delete product inventory."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (row) => {

        const id =
            row.productInventoryId ??
            row.ProductInventoryId;


        if (!id) {

            setError(
                "Inventory ID is missing."
            );

            return;

        }


        // Route matches:
        // /product-inventory/details/:id

        navigate(
            `/product-inventory/details/${id}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (row) => {

        const id =
            row.productInventoryId ??
            row.ProductInventoryId;


        if (!id) {

            setError(
                "Inventory ID is missing."
            );

            return;

        }


        // Route matches:
        // /product-inventory/edit/:id

        navigate(
            `/product-inventory/edit/${id}`
        );

    };


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedInventory(null);

        setModalOpen(true);

    };


    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick = (row) => {

        if (!row) {

            setError(
                "No inventory record selected."
            );

            return;

        }


        setSelectedInventory(row);

        setDeleteOpen(true);

    };


    // =====================================================
    // EXPORT
    // =====================================================

    const handleExport = () => {

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
            "Quantity",
            "Available Quantity",
            "Reserved Quantity",
            "Reorder Level",
            "Min Stock Level",
            "Max Stock Level",
            "Stock Status",
            "Active",

        ];


        const rows =
            filteredInventories.map(
                (item) => {

                    return [

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
                            : "Inactive",

                    ];

                }
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


                                    return `"${text.replace(
                                        /"/g,
                                        '""'
                                    )}"`;

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


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

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

                stockStatusFilter={
                    stockStatusFilter
                }

                setStockStatusFilter={
                    setStockStatusFilter
                }

                warehouseFilter={
                    warehouseFilter
                }

                setWarehouseFilter={
                    setWarehouseFilter
                }

                inventories={
                    inventories
                }

            />


            {/* =================================================
                FILTERS
            ================================================= */}

            <ProductInventoryFilters

                statusFilter={
                    statusFilter
                }

                setStatusFilter={
                    setStatusFilter
                }

                quantityFilter={
                    quantityFilter
                }

                setQuantityFilter={
                    setQuantityFilter
                }

                inventories={
                    inventories
                }

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <ProductInventoryTable

                inventories={
                    pagedInventories
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
                    handleDeleteClick
                }

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <ProductInventoryPagination

                page={
                    page
                }

                totalPages={
                    totalPages
                }

                pageSize={
                    pageSize
                }

                totalRecords={
                    filteredInventories.length
                }

                onPageChange={
                    setPage
                }

                onPageSizeChange={
                    (size) => {

                        setPageSize(size);

                        setPage(1);

                    }
                }

            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <ProductInventoryModal

                open={
                    modalOpen
                }

                inventory={
                    selectedInventory
                }

                onClose={() => {

                    setModalOpen(false);

                    setSelectedInventory(null);

                }}

                onSave={
                    handleSave
                }

            />


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            <ProductInventoryView

                open={
                    viewOpen
                }

                inventory={
                    selectedInventory
                }

                onClose={() => {

                    setViewOpen(false);

                    setSelectedInventory(null);

                }}

            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteProductInventoryDialog

                open={
                    deleteOpen
                }

                inventory={
                    selectedInventory
                }

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedInventory(null);

                }}

                onDeleted={
                    handleDelete
                }

            />


            {/* =================================================
                ERROR
            ================================================= */}

            <Snackbar

                open={
                    Boolean(error)
                }

                autoHideDuration={
                    5000
                }

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

                open={
                    Boolean(success)
                }

                autoHideDuration={
                    3000
                }

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
