// =========================================================
// ProductImageList.jsx
// Product Image List
// View / Edit / Delete navigate to separate pages
// Frontend -> Node.js server.js -> ASP.NET Core API
// =========================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Alert, Snackbar } from "@mui/material";

import ProductImageToolbar from "./ProductImageToolbar";
import ProductImageStatistics from "./ProductImageStatistics";
import ProductImageSearch from "./ProductImageSearch";
import ProductImageTable from "./ProductImageTable";
import ProductImagePagination from "./ProductImagePagination";

// =========================================================
// NODE.JS SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// GET IMAGE ID
// Supports camelCase and PascalCase responses
// =========================================================

const getImageId = (image) =>
    image?.id ??
    image?.Id ??
    image?.productImageId ??
    image?.ProductImageId ??
    image?.productImagesId ??
    image?.ProductImagesId ??
    null;

// =========================================================
// PRODUCT IMAGE LIST
// =========================================================

const ProductImageList = () => {
    const navigate = useNavigate();

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [imageTypeFilter, setImageTypeFilter] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [statisticsRefresh, setStatisticsRefresh] = useState(0);

    // =====================================================
    // LOAD PRODUCT IMAGES
    // GET http://localhost:5000/api/product-images/all
    // =====================================================

    const loadImages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-images/all`
            );

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({}));

                throw new Error(
                    errorData.message ||
                    `Failed to load product images. Status: ${response.status}`
                );
            }

            const data = await response.json();

            let imageList = [];

            if (Array.isArray(data)) {
                imageList = data;
            } else if (Array.isArray(data?.items)) {
                imageList = data.items;
            } else if (Array.isArray(data?.data)) {
                imageList = data.data;
            }

            setImages(imageList);
            setPage(1);

            setStatisticsRefresh((previous) => previous + 1);
        } catch (err) {
            console.error("Load Product Images Error:", err);

            setError(
                err?.message || "Failed to load product images."
            );

            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadImages();
    }, []);

    // =====================================================
    // SEARCH AND FILTER
    // =====================================================

    useEffect(() => {
        let result = [...images];

        if (searchText.trim()) {
            const search = searchText.trim().toLowerCase();

            result = result.filter((item) => {
                const productId = String(
                    item?.productId ?? item?.ProductId ?? ""
                ).toLowerCase();

                const imageName = String(
                    item?.imageName ?? item?.ImageName ?? ""
                ).toLowerCase();

                const imageUrl = String(
                    item?.imageUrl ?? item?.ImageUrl ?? ""
                ).toLowerCase();

                const imageType = String(
                    item?.imageType ?? item?.ImageType ?? ""
                ).toLowerCase();

                return (
                    productId.includes(search) ||
                    imageName.includes(search) ||
                    imageUrl.includes(search) ||
                    imageType.includes(search)
                );
            });
        }

        if (imageTypeFilter !== "") {
            result = result.filter((item) => {
                const imageType =
                    item?.imageType ?? item?.ImageType ?? "";

                return (
                    String(imageType).toLowerCase() ===
                    String(imageTypeFilter).toLowerCase()
                );
            });
        }

        setFilteredImages(result);
        setPage(1);
    }, [images, searchText, imageTypeFilter]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        filteredImages.length / pageSize
    );

    const pagedImages = filteredImages.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // =====================================================
    // CREATE PRODUCT IMAGE
    // Opens a separate page
    // =====================================================

    const handleCreate = () => {
        navigate("/product-images/create");
    };

    // =====================================================
    // VIEW PRODUCT IMAGE
    // Opens /product-images/:id
    // =====================================================

    const handleView = (image) => {
        const id = getImageId(image);

        if (!id) {
            setError("Cannot view this image: image ID is missing.");
            return;
        }

        navigate(`/product-images/${id}`);
    };

    // =====================================================
    // EDIT PRODUCT IMAGE
    // Opens /product-images/edit/:id
    // =====================================================

    const handleEdit = (image) => {
        const id = getImageId(image);

        if (!id) {
            setError("Cannot edit this image: image ID is missing.");
            return;
        }

        navigate(`/product-images/edit/${id}`);
    };

    // =====================================================
    // DELETE PRODUCT IMAGE
    // Opens /product-images/delete/:id
    // =====================================================

    const handleDelete = (image) => {
        const id = getImageId(image);

        if (!id) {
            setError("Cannot delete this image: image ID is missing.");
            return;
        }

        navigate(`/product-images/delete/${id}`);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: 3 }}>
            {/* ERROR MESSAGE */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* TOOLBAR */}
            <ProductImageToolbar
                onAdd={handleCreate}
                onRefresh={loadImages}
                onExport={() => {
                    console.log("Export Product Images");
                }}
            />

            {/* STATISTICS */}
            <ProductImageStatistics
                refreshTrigger={statisticsRefresh}
            />

            {/* SEARCH AND FILTER */}
            <ProductImageSearch
                searchText={searchText}
                setSearchText={setSearchText}
                imageTypeFilter={imageTypeFilter}
                setImageTypeFilter={setImageTypeFilter}
                images={images}
            />

            {/* PRODUCT IMAGE TABLE */}
            <ProductImageTable
                images={pagedImages}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* PAGINATION */}
            <ProductImagePagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={filteredImages.length}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />

            {/* SUCCESS MESSAGE */}
            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() => setSuccess("")}
                message={success}
            />
        </Box>
    );
};

export default ProductImageList;

