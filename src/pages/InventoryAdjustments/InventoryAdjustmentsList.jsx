import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import InventoryAdjustmentsToolbar
    from "./InventoryAdjustmentsToolbar";

import InventoryAdjustmentsStatistics
    from "./InventoryAdjustmentsStatistics";

import InventoryAdjustmentsSearch
    from "./InventoryAdjustmentsSearch";

import InventoryAdjustmentsFilters
    from "./InventoryAdjustmentsFilters";

import InventoryAdjustmentsTable
    from "./InventoryAdjustmentsTable";

import InventoryAdjustmentsPagination
    from "./InventoryAdjustmentsPagination";

import DeleteInventoryAdjustmentDialog
    from "./DeleteInventoryAdjustmentDialog";


// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

const INVENTORY_ADJUSTMENTS_API =
    `${SERVER_URL}/api/inventory-adjustments`;


// =========================================================
// COMPONENT
// =========================================================

const InventoryAdjustmentsList = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [adjustments, setAdjustments] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [filters, setFilters] =
        useState({
            adjustmentType: "",
            status: ""
        });

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedAdjustment, setSelectedAdjustment] =
        useState(null);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    // =====================================================
    // LOAD ALL
    // =====================================================

    const loadAdjustments = async () => {

        try {

            setLoading(true);

            console.log(
                "GET:",
                `${INVENTORY_ADJUSTMENTS_API}/all`
            );

            const response = await axios.get(
                `${INVENTORY_ADJUSTMENTS_API}/all`,
                {
                    timeout: 15000
                }
            );

            console.log(
                "Inventory Adjustments Response:",
                response.data
            );

            const data = response.data;

            let items = [];

            if (Array.isArray(data)) {

                items = data;

            }
            else if (
                Array.isArray(data?.items)
            ) {

                items = data.items;

            }
            else if (
                Array.isArray(data?.data)
            ) {

                items = data.data;

            }
            else if (
                Array.isArray(data?.result)
            ) {

                items = data.result;

            }

            setAdjustments(items);

            setPage(1);

        }
        catch (error) {

            console.error(
                "Inventory Adjustments Load Error:",
                error
            );

            setAdjustments([]);

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load inventory adjustments.",
                severity: "error"
            });

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAdjustments();

    }, []);


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredAdjustments = useMemo(() => {

        const search =
            searchText
                .trim()
                .toLowerCase();


        return adjustments.filter((item) => {

            const matchesSearch =
                !search ||

                String(
                    item?.inventoryAdjustmentId ??
                    item?.InventoryAdjustmentId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.sellerId ??
                    item?.SellerId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.productId ??
                    item?.ProductId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.warehouseLocationId ??
                    item?.WarehouseLocationId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.adjustmentType ??
                    item?.AdjustmentType ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.reason ??
                    item?.Reason ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.referenceNumber ??
                    item?.ReferenceNumber ??
                    ""
                )
                    .toLowerCase()
                    .includes(search);


            const adjustmentType =
                item?.adjustmentType ??
                item?.AdjustmentType ??
                "";

            const status =
                item?.status ??
                item?.Status ??
                "";


            const matchesType =
                !filters.adjustmentType ||
                String(adjustmentType) ===
                String(filters.adjustmentType);


            const matchesStatus =
                !filters.status ||
                String(status) ===
                String(filters.status);


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );

        });

    }, [
        adjustments,
        searchText,
        filters
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalRecords =
        filteredAdjustments.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );

    const safePage =
        Math.min(
            Math.max(page, 1),
            totalPages
        );

    const paginatedAdjustments =
        filteredAdjustments.slice(
            (safePage - 1) * pageSize,
            safePage * pageSize
        );


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        navigate(
            "/inventory-adjustments/create"
        );

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (item) => {

        const id =
            item?.inventoryAdjustmentId ??
            item?.InventoryAdjustmentId;

        navigate(
            `/inventory-adjustments/view/${encodeURIComponent(id)}`
        );

    };


    // =====================================================
    // DETAILS
    // =====================================================

    const handleDetails = (item) => {

        const id =
            item?.inventoryAdjustmentId ??
            item?.InventoryAdjustmentId;

        navigate(
            `/inventory-adjustments/details/${encodeURIComponent(id)}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (item) => {

        const id =
            item?.inventoryAdjustmentId ??
            item?.InventoryAdjustmentId;

        navigate(
            `/inventory-adjustments/${encodeURIComponent(id)}/edit`
        );

    };


    // =====================================================
    // DELETE OPEN
    // =====================================================

    const handleDelete = (item) => {

        setSelectedAdjustment(item);

        setDeleteOpen(true);

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDeleted = async (id) => {

        try {

            await axios.delete(
                `${INVENTORY_ADJUSTMENTS_API}/${encodeURIComponent(id)}`,
                {
                    timeout: 15000
                }
            );

            setSnackbar({
                open: true,
                message:
                    "Inventory adjustment deleted successfully.",
                severity: "success"
            });

            setDeleteOpen(false);

            setSelectedAdjustment(null);

            await loadAdjustments();

        }
        catch (error) {

            console.error(
                "Inventory Adjustment Delete Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Delete failed.",
                severity: "error"
            });

        }

    };


    // =====================================================
    // FILTER CHANGE
    // =====================================================

    const handleFilterChange = (newFilters) => {

        setFilters(newFilters);

        setPage(1);

    };


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const handleResetFilters = () => {

        setFilters({
            adjustmentType: "",
            status: ""
        });

        setPage(1);

    };


    // =====================================================
    // PAGE
    // =====================================================

    const handlePageChange = (newPage) => {

        setPage(
            Math.min(
                Math.max(
                    Number(newPage) || 1,
                    1
                ),
                totalPages
            )
        );

    };


    // =====================================================
    // PAGE SIZE
    // =====================================================

    const handlePageSizeChange = (size) => {

        const value =
            Number(size);

        if (value > 0) {

            setPageSize(value);

            setPage(1);

        }

    };


    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = useMemo(() => {

        const total =
            adjustments.length;

        const increased =
            adjustments.filter((item) =>
                String(
                    item?.adjustmentType ??
                    item?.AdjustmentType ??
                    ""
                ).toUpperCase() === "INCREASE"
            ).length;

        const decreased =
            adjustments.filter((item) =>
                String(
                    item?.adjustmentType ??
                    item?.AdjustmentType ??
                    ""
                ).toUpperCase() === "DECREASE"
            ).length;

        const totalQuantity =
            adjustments.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item?.quantity ??
                        item?.Quantity ??
                        0
                    ),
                0
            );

        return {
            total,
            increased,
            decreased,
            totalQuantity
        };

    }, [adjustments]);


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0
            }}
        >

            <InventoryAdjustmentsToolbar
                onAdd={handleAdd}
                onRefresh={loadAdjustments}
            />


            <InventoryAdjustmentsStatistics
                statistics={statistics}
            />


            <InventoryAdjustmentsSearch
                searchText={searchText}
                setSearchText={(value) => {

                    setSearchText(value);

                    setPage(1);

                }}
            />


            <InventoryAdjustmentsFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
            />


            {loading ? (

                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <InventoryAdjustmentsTable
                    items={paginatedAdjustments}
                    onView={handleView}
                    onDetails={handleDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}


            {!loading &&
                totalRecords > 0 && (

                    <InventoryAdjustmentsPagination
                        page={safePage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalRecords={totalRecords}
                        onPageChange={handlePageChange}
                        onPageSizeChange={
                            handlePageSizeChange
                        }
                    />

                )}


            <DeleteInventoryAdjustmentDialog
                open={deleteOpen}
                adjustment={selectedAdjustment}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedAdjustment(null);

                }}
                onDeleted={handleDeleted}
            />


            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => {

                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }));

                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};

export default InventoryAdjustmentsList;
