import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import apiService from "../../services/apiService";

import ProductToolbar from "./ProductToolbar";
import ProductStatistics from "./ProductStatistics";
import ProductSearch from "./ProductSearch";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductPagination from "./ProductPagination";
import ProductModal from "./ProductModal";
import DeleteProductDialog from "./DeleteProductDialog";

const ProductList = () => {

    const navigate = useNavigate();

    // ===========================
    // State
    // ===========================

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [brandFilter, setBrandFilter] = useState("");

    const [categoryFilter, setCategoryFilter] = useState("");

    const [productTypeFilter, setProductTypeFilter] = useState("");

    const [brands, setBrands] = useState([]);

    const [categories, setCategories] = useState([]);

    const [productTypes, setProductTypes] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    // ===========================
    // Load Products
    // ===========================

    const loadProducts = async () => {

        try {

            setLoading(true);

            const response = await apiService.getProducts();

            setProducts(response.data);

            setFilteredProducts(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    // ===========================
    // Load Dropdowns
    // ===========================

    const loadDropdowns = async () => {

        try {

            const [

                brandRes,

                categoryRes,

                productTypeRes

            ] = await Promise.all([

                apiService.getBrands(),

                apiService.getCategories(),

                apiService.getProductTypes()

            ]);

            setBrands(brandRes.data);

            setCategories(categoryRes.data);

            setProductTypes(productTypeRes.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    // ===========================
    // Initial Load
    // ===========================

    useEffect(() => {

        loadProducts();

        loadDropdowns();

    }, []);

    // ===========================
    // Search & Filter
    // ===========================

    useEffect(() => {

        let result = [...products];

        if (searchText.trim() !== "") {

            const search = searchText.toLowerCase();

            result = result.filter(item =>

                item.ProductName?.toLowerCase().includes(search) ||

                item.SKU?.toLowerCase().includes(search) ||

                item.Barcode?.toLowerCase().includes(search) ||

                item.HSNCode?.toLowerCase().includes(search)

            );

        }

        if (statusFilter !== "All") {

            result = result.filter(item =>

                statusFilter === "Active"

                    ? item.IsActive

                    : !item.IsActive

            );

        }

        if (brandFilter !== "") {

            result = result.filter(

                item => item.BrandId === brandFilter

            );

        }

        if (categoryFilter !== "") {

            result = result.filter(

                item => item.CategoryId === categoryFilter

            );

        }

        if (productTypeFilter !== "") {

            result = result.filter(

                item =>

                    item.ProductTypeId === productTypeFilter

            );

        }

        setFilteredProducts(result);

        setPage(1);

    }, [

        products,

        searchText,

        statusFilter,

        brandFilter,

        categoryFilter,

        productTypeFilter

    ]);

    // ===========================
    // Pagination
    // ===========================

    const totalPages = Math.ceil(

        filteredProducts.length / pageSize

    );

    const pagedProducts = filteredProducts.slice(

        (page - 1) * pageSize,

        page * pageSize

    );
      return (

        <Box sx={{ p: 3 }}>

            <ProductToolbar

                onAdd={() =>
                    navigate("/products/create")
                }

                onRefresh={loadProducts}

                onExport={() =>
                    console.log("Export Products")
                }

            />

            <ProductStatistics

                products={products}

            />

            <ProductSearch

                searchText={searchText}

                setSearchText={setSearchText}

                statusFilter={statusFilter}

                setStatusFilter={setStatusFilter}

            />

            <ProductFilters

                brands={brands}

                categories={categories}

                productTypes={productTypes}

                brandFilter={brandFilter}

                setBrandFilter={setBrandFilter}

                categoryFilter={categoryFilter}

                setCategoryFilter={setCategoryFilter}

                productTypeFilter={productTypeFilter}

                setProductTypeFilter={setProductTypeFilter}

                statusFilter={statusFilter}

                setStatusFilter={setStatusFilter}

            />

            <ProductTable

                products={pagedProducts}

                loading={loading}

                onView={(row) => {

                    setSelectedProduct(row);

                }}

                onEdit={(row) => {

                    navigate(

                        `/products/edit/${row.ProductId}`

                    );

                }}

                onDelete={(row) => {

                    setSelectedProduct(row);

                    setDeleteOpen(true);

                }}

            />

            <ProductPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={filteredProducts.length}

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />

            <ProductModal

                open={Boolean(selectedProduct)}

                product={selectedProduct}

                onClose={() =>

                    setSelectedProduct(null)

                }

            />

            <DeleteProductDialog

                open={deleteOpen}

                product={selectedProduct}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedProduct(null);

                }}

                onDeleted={() => {

                    loadProducts();

                    setDeleteOpen(false);

                    setSelectedProduct(null);

                }}

            />

        </Box>

    );

};

export default ProductList;