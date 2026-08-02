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
    return{

    };