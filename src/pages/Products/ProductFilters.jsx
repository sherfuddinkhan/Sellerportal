import React from "react";
import {Grid,FormControl,InputLabel,Select,MenuItem} from "@mui/material";

const ProductFilters = ({
    statusFilter,
    setStatusFilter,
    brandFilter,
    setBrandFilter,
    categoryFilter,
    setCategoryFilter,
    productTypeFilter,
    setProductTypeFilter,
    brands = [],
    categories = [],
    productTypes = []
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
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
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                    <InputLabel>Brand</InputLabel>
                    <Select
                        value={brandFilter}
                        label="Brand"
                        onChange={(e) =>
                            setBrandFilter(e.target.value)
                        }
                    >
                        <MenuItem value="">
                            All Brands
                        </MenuItem>
                        {
                            brands.map((brand) => (
                                <MenuItem
                                    key={brand.brandId}
                                    value={brand.brandId}
                                >
                                    {brand.brandName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                    <InputLabel>
                        Category
                    </InputLabel>
                    <Select
                        value={categoryFilter}
                        label="Category"
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                    >
                        <MenuItem value="">
                            All Categories
                        </MenuItem>
                        {
                            categories.map((category) => (
                                <MenuItem
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.categoryName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                    <InputLabel>
                        Product Type
                    </InputLabel>
                    <Select
                        value={productTypeFilter}
                        label="Product Type"
                        onChange={(e) =>
                            setProductTypeFilter(e.target.value)
                        }
                    >
                        <MenuItem value="">
                            All Product Types
                        </MenuItem>
                        {
                            productTypes.map((type) => (
                                <MenuItem
                                    key={type.productTypeId}
                                    value={type.productTypeId}
                                >
                                    {type.productTypeName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default ProductFilters;