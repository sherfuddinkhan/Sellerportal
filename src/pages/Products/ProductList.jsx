import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
// Product Components
import ProductToolbar from "./ProductToolbar";
import ProductStatistics from "./ProductStatistics";
import ProductSearch from "./ProductSearch";
import ProductTable from "./ProductTable";
import ProductPagination from "./ProductPagination";
import ProductModal from "./ProductModal";
import DeleteProductDialog from "./DeleteProductDialog";

const ProductList = () => {
    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [categoryFilter, setCategoryFilter] = useState("");

    const [brandFilter, setBrandFilter] = useState("");

    const [productTypeFilter, setProductTypeFilter] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    // =========================================================
    // LOAD PRODUCTS
    // =========================================================

    const loadProducts = async () => {
        try {
            setLoading(true);

            const response = await apiService.getProducts();

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setProducts(data);
            setFilteredProducts(data);
        }
        catch (err) {
            console.error(
                "Error loading products:",
                err
            );

            setProducts([]);
            setFilteredProducts([]);
        }
        finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadProducts();
    }, []);

    // =========================================================
    // SEARCH & FILTER
    // =========================================================

    useEffect(() => {
        let result = [...products];

        // -----------------------------------------------------
        // SEARCH
        // -----------------------------------------------------

        if (searchText.trim() !== "") {

            const search =
                searchText
                    .toLowerCase()
                    .trim();

            result = result.filter((item) => {

                return (
                    String(
                        item.ProductId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.ProductName ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.ProductCode ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.SKU ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.SellerId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.CategoryId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.BrandId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.ProductTypeId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.Description ?? ""
                    )
                        .toLowerCase()
                        .includes(search)
                );
            });
        }

        // -----------------------------------------------------
        // STATUS FILTER
        // -----------------------------------------------------

        if (statusFilter !== "All") {

            result = result.filter((item) => {

                const isActive =
                    item.IsActive === true ||
                    item.IsActive === 1 ||
                    item.IsActive === "true";

                return statusFilter === "Active"
                    ? isActive
                    : !isActive;
            });
        }

        // -----------------------------------------------------
        // CATEGORY FILTER
        // -----------------------------------------------------

        if (categoryFilter !== "") {

            result = result.filter(
                (item) =>
                    String(
                        item.CategoryId ?? ""
                    ) === String(categoryFilter)
            );
        }

        // -----------------------------------------------------
        // BRAND FILTER
        // -----------------------------------------------------

        if (brandFilter !== "") {

            result = result.filter(
                (item) =>
                    String(
                        item.BrandId ?? ""
                    ) === String(brandFilter)
            );
        }

        // -----------------------------------------------------
        // PRODUCT TYPE FILTER
        // -----------------------------------------------------

        if (productTypeFilter !== "") {

            result = result.filter(
                (item) =>
                    String(
                        item.ProductTypeId ?? ""
                    ) === String(productTypeFilter)
            );
        }

        // -----------------------------------------------------
        // UPDATE FILTERED PRODUCTS
        // -----------------------------------------------------

        setFilteredProducts(result);

        // Reset pagination after search/filter
        setPage(1);

    }, [
        products,
        searchText,
        statusFilter,
        categoryFilter,
        brandFilter,
        productTypeFilter
    ]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredProducts.length /
                pageSize
            )
        );

    const pagedProducts =
        filteredProducts.slice(
            (page - 1) * pageSize,
            page * pageSize
        );

    // =========================================================
    // SAVE PRODUCT
    // =========================================================

    const handleSave = async (data) => {

        try {

            setLoading(true);

            // -------------------------------------------------
            // UPDATE
            // -------------------------------------------------

            if (data.ProductId) {

                await apiService.updateProduct(
                    data.ProductId,
                    data
                );

            }

            // -------------------------------------------------
            // CREATE
            // -------------------------------------------------

            else {

                await apiService.createProduct(
                    data
                );

            }

            // Reload products
            await loadProducts();

            // Close modal
            setSelectedProduct(null);

        }
        catch (err) {

            console.error(
                "Error saving product:",
                err
            );

        }
        finally {

            setLoading(false);

        }
    };

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    const handleDelete = async (id) => {

        try {

            setLoading(true);

            await apiService.deleteProduct(id);

            await loadProducts();

        }
        catch (err) {

            console.error(
                "Error deleting product:",
                err
            );

        }
        finally {

            setLoading(false);

            setDeleteOpen(false);

            setSelectedProduct(null);
        }
    };

    // =========================================================
    // VIEW PRODUCT
    // =========================================================

    const handleView = (row) => {

        setSelectedProduct(row);

        // If you prefer a separate View page,
        // replace the above with:
        //
        // navigate(`/products/view/${row.ProductId}`);
    };

    // =========================================================
    // EDIT PRODUCT
    // =========================================================

    const handleEdit = (row) => {

        setSelectedProduct(row);

    };

    // =========================================================
    // DELETE CONFIRMATION
    // =========================================================

    const handleDeleteClick = (row) => {

        setSelectedProduct(row);

        setDeleteOpen(true);

    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                p: 3,
                width: "100%",
            }}
        >

            {/* =================================================
                PRODUCT TOOLBAR
            ================================================== */}

            <ProductToolbar
                onAdd={() =>
                    setSelectedProduct({})
                }
                onRefresh={loadProducts}
                onExport={() =>
                    console.log(
                        "Export Products"
                    )
                }
            />

            {/* =================================================
                PRODUCT STATISTICS
            ================================================== */}

            <ProductStatistics
                products={products}
            />

            {/* =================================================
                PRODUCT SEARCH & FILTERS
            ================================================== */}

            <ProductSearch
                searchText={searchText}
                setSearchText={setSearchText}

                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}

                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}

                brandFilter={brandFilter}
                setBrandFilter={setBrandFilter}

                productTypeFilter={
                    productTypeFilter
                }
                setProductTypeFilter={
                    setProductTypeFilter
                }

                products={products}
            />

            {/* =================================================
                PRODUCT TABLE
            ================================================== */}

            <ProductTable
                products={pagedProducts}

                loading={loading}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={
                    handleDeleteClick
                }
            />

            {/* =================================================
                PRODUCT PAGINATION
            ================================================== */}

            <ProductPagination
                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredProducts.length
                }

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}
            />

            {/* =================================================
                PRODUCT MODAL
            ================================================== */}

            <ProductModal
                open={
                    Boolean(
                        selectedProduct
                    ) &&
                    !deleteOpen
                }

                product={
                    selectedProduct
                }

                onClose={() =>
                    setSelectedProduct(null)
                }

                onSave={handleSave}
            />

            {/* =================================================
                DELETE PRODUCT DIALOG
            ================================================== */}

            <DeleteProductDialog
                open={deleteOpen}

                product={
                    selectedProduct
                }

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedProduct(null);

                }}

                onDeleted={handleDelete}
            />

        </Box>
    );
};

export default ProductList;