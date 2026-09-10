// =========================================================
// ProductInventorySearch.jsx
// Product Inventory Search & Filters
// =========================================================

import React from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stack
} from "@mui/material";

import {
    Clear
} from "@mui/icons-material";


// =========================================================
// COMPONENT
// =========================================================

const ProductInventorySearch = ({

    // =====================================================
    // SEARCH
    // =====================================================

    searchText,
    setSearchText,

    // =====================================================
    // STATUS
    // Maps to API: ?status=
    // =====================================================

    statusFilter,
    setStatusFilter,

    // =====================================================
    // WAREHOUSE
    // Warehouse is handled by:
    // /api/product-inventories/warehouse/{warehouseId}
    // =====================================================

    warehouseFilter,
    setWarehouseFilter,

    // =====================================================
    // AVAILABLE DATA
    // =====================================================

    inventories = [],

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    onClear

}) => {


    // =====================================================
    // WAREHOUSES
    // =====================================================

    const warehouses = React.useMemo(() => {

        const values = inventories
            .map((item) => {

                return (
                    item.warehouseId ??
                    item.WarehouseId ??
                    null
                );

            })
            .filter(
                (value) =>
                    value !== null &&
                    value !== undefined &&
                    value !== ""
            );

        return [
            ...new Set(values)
        ];

    }, [inventories]);


    // =====================================================
    // STATUS OPTIONS
    // =====================================================

    const statuses = React.useMemo(() => {

        const values = inventories
            .map((item) => {

                return (
                    item.status ??
                    item.Status ??
                    item.stockStatus ??
                    item.StockStatus ??
                    null
                );

            })
            .filter(
                (value) =>
                    value !== null &&
                    value !== undefined &&
                    value !== ""
            );

        return [
            ...new Set(values)
        ];

    }, [inventories]);


    // =====================================================
    // CLEAR
    // =====================================================

    const handleClear = () => {

        if (setSearchText) {
            setSearchText("");
        }

        if (setStatusFilter) {
            setStatusFilter("");
        }

        if (setWarehouseFilter) {
            setWarehouseFilter("");
        }

        if (onClear) {
            onClear();
        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3
            }}
        >

            <Grid
                container
                spacing={2}
                alignItems="center"
            >

                {/* =================================================
                    SEARCH
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={5}
                >

                    <TextField
                        fullWidth
                        label="Search Inventory"
                        placeholder="Search product, seller, warehouse..."
                        value={searchText || ""}
                        onChange={(e) =>
                            setSearchText(
                                e.target.value
                            )
                        }
                    />

                </Grid>


                {/* =================================================
                    STATUS
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <FormControl
                        fullWidth
                    >

                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={
                                statusFilter || ""
                            }
                            label="Status"
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>


                            {statuses.map(
                                (status) => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>


                {/* =================================================
                    WAREHOUSE
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <FormControl
                        fullWidth
                    >

                        <InputLabel>
                            Warehouse
                        </InputLabel>

                        <Select
                            value={
                                warehouseFilter || ""
                            }
                            label="Warehouse"
                            onChange={(e) =>
                                setWarehouseFilter(
                                    e.target.value
                                )
                            }
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>


                            {warehouses.map(
                                (warehouse) => (

                                    <MenuItem
                                        key={warehouse}
                                        value={warehouse}
                                    >
                                        Warehouse {warehouse}
                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>


                {/* =================================================
                    CLEAR
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={1}
                >

                    <Stack
                        direction="row"
                        justifyContent="center"
                    >

                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<Clear />}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Paper>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductInventorySearch;
