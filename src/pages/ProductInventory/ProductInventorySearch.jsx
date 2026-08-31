// =========================================================
// ProductInventorySearch.jsx
// Product Inventory Search & Quick Filters
// Frontend Only
// =========================================================

import React, {
    useMemo
} from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductInventorySearch = ({

    searchText,

    setSearchText,

    stockStatusFilter,

    setStockStatusFilter,

    warehouseFilter,

    setWarehouseFilter,

    inventories = []

}) => {


    // =====================================================
    // WAREHOUSES
    // =====================================================

    const warehouses = useMemo(() => {

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
    // STOCK STATUSES
    // =====================================================

    const stockStatuses = useMemo(() => {

        const values = inventories
            .map((item) => {

                return (
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
                        placeholder="Product ID, Seller ID, Warehouse..."
                        value={searchText || ""}
                        onChange={(e) =>
                            setSearchText(
                                e.target.value
                            )
                        }
                    />

                </Grid>


                {/* =================================================
                    STOCK STATUS
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
                            Stock Status
                        </InputLabel>

                        <Select
                            value={
                                stockStatusFilter || ""
                            }
                            label="Stock Status"
                            onChange={(e) =>
                                setStockStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>


                            {stockStatuses.map(
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
                    md={4}
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
                                        {warehouse}
                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>

            </Grid>

        </Paper>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductInventorySearch;
