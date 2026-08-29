// =========================================================
// CatalogFilters.jsx
// =========================================================

import React from "react";

import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";

// =========================================================
// COMPONENT
// =========================================================

const CatalogFilters = ({
    brands = [],
    categories = [],
    productTypes = [],

    brandId = "",
    categoryId = "",
    productTypeId = "",
    status = "All",

    onBrandChange,
    onCategoryChange,
    onProductTypeChange,
    onStatusChange,

    onApply,
    onClear
}) => {

    // =========================================================
    // SAFE ARRAYS
    // =========================================================

    const safeBrands =
        Array.isArray(brands)
            ? brands
            : [];

    const safeCategories =
        Array.isArray(categories)
            ? categories
            : [];

    const safeProductTypes =
        Array.isArray(productTypes)
            ? productTypes
            : [];


    // =========================================================
    // HELPERS
    // =========================================================

    const getId = (item) =>
        item?.brandId ??
        item?.BrandId ??
        item?.categoryId ??
        item?.CategoryId ??
        item?.productTypeId ??
        item?.ProductTypeId ??
        item?.id ??
        item?.Id;

    const getName = (item) =>
        item?.brandName ??
        item?.BrandName ??
        item?.categoryName ??
        item?.CategoryName ??
        item?.productTypeName ??
        item?.ProductTypeName ??
        item?.name ??
        item?.Name ??
        "";


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper"
            }}
        >

            {/* =================================================
                BRAND
            ================================================= */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 180
                }}
            >

                <InputLabel>
                    Brand
                </InputLabel>

                <Select
                    value={brandId}
                    label="Brand"
                    onChange={(event) =>
                        onBrandChange?.(
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="">
                        All Brands
                    </MenuItem>

                    {safeBrands.map((brand) => {

                        const id =
                            brand?.brandId ??
                            brand?.BrandId;

                        const name =
                            brand?.brandName ??
                            brand?.BrandName ??
                            "-";

                        return (
                            <MenuItem
                                key={id}
                                value={id}
                            >
                                {name}
                            </MenuItem>
                        );
                    })}

                </Select>

            </FormControl>


            {/* =================================================
                CATEGORY
            ================================================= */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 180
                }}
            >

                <InputLabel>
                    Category
                </InputLabel>

                <Select
                    value={categoryId}
                    label="Category"
                    onChange={(event) =>
                        onCategoryChange?.(
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="">
                        All Categories
                    </MenuItem>

                    {safeCategories.map(
                        (category) => {

                            const id =
                                category?.categoryId ??
                                category?.CategoryId;

                            const name =
                                category?.categoryName ??
                                category?.CategoryName ??
                                "-";

                            return (
                                <MenuItem
                                    key={id}
                                    value={id}
                                >
                                    {name}
                                </MenuItem>
                            );
                        }
                    )}

                </Select>

            </FormControl>


            {/* =================================================
                PRODUCT TYPE
            ================================================= */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 180
                }}
            >

                <InputLabel>
                    Product Type
                </InputLabel>

                <Select
                    value={productTypeId}
                    label="Product Type"
                    onChange={(event) =>
                        onProductTypeChange?.(
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="">
                        All Product Types
                    </MenuItem>

                    {safeProductTypes.map(
                        (type) => {

                            const id =
                                type?.productTypeId ??
                                type?.ProductTypeId;

                            const name =
                                type?.productTypeName ??
                                type?.ProductTypeName ??
                                "-";

                            return (
                                <MenuItem
                                    key={id}
                                    value={id}
                                >
                                    {name}
                                </MenuItem>
                            );
                        }
                    )}

                </Select>

            </FormControl>


            {/* =================================================
                STATUS
            ================================================= */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 150
                }}
            >

                <InputLabel>
                    Status
                </InputLabel>

                <Select
                    value={status}
                    label="Status"
                    onChange={(event) =>
                        onStatusChange?.(
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="All">
                        All
                    </MenuItem>

                    <MenuItem value="Active">
                        Active
                    </MenuItem>

                    <MenuItem value="Inactive">
                        Inactive
                    </MenuItem>

                </Select>

            </FormControl>


            {/* =================================================
                APPLY
            ================================================= */}

            <Button
                variant="contained"
                startIcon={
                    <FilterAltIcon />
                }
                onClick={() =>
                    onApply?.()
                }
            >
                Apply Filters
            </Button>


            {/* =================================================
                CLEAR
            ================================================= */}

            <Button
                variant="outlined"
                color="inherit"
                startIcon={
                    <ClearIcon />
                }
                onClick={() =>
                    onClear?.()
                }
            >
                Clear
            </Button>

        </Box>
    );
};

export default CatalogFilters;

