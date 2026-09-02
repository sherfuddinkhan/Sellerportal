// =========================================================
// ProductImageList.jsx
// Product Image List
// Frontend uses server.js
// NO apiService
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Box,
    Alert,
    Snackbar,
} from "@mui/material";

import ProductImageToolbar from "./ProductImageToolbar";
import ProductImageStatistics from "./ProductImageStatistics";
import ProductImageSearch from "./ProductImageSearch";
import ProductImageTable from "./ProductImageTable";
import ProductImagePagination from "./ProductImagePagination";
import ProductImageModal from "./ProductImageModal";
import ProductImageView from "./ProductImageView";
import DeleteProductImageDialog from "./DeleteProductImageDialog";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// PRODUCT IMAGE LIST
// =========================================================

const ProductImageList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [images, setImages] = useState([]);

    const [filteredImages, setFilteredImages] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [imageTypeFilter, setImageTypeFilter] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");



    // =====================================================
    // LOAD PRODUCT IMAGES
    // GET:
    // http://localhost:5000/api/product-images/all
    // =====================================================

    const loadImages = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-images/all`
            );

            if (!response.ok) {

                const errorData =
                    await response.json().catch(() => ({}));

                throw new Error(
                    errorData.message ||
                    `Failed to load product images. Status: ${response.status}`
                );
            }

            const data = await response.json();

            // ---------------------------------------------
            // Support:
            // []
            // { items: [] }
            // { data: [] }
            // ---------------------------------------------

            let imageList = [];

            if (Array.isArray(data)) {

                imageList = data;

            }

            else if (Array.isArray(data?.items)) {

                imageList = data.items;

            }

            else if (Array.isArray(data?.data)) {

                imageList = data.data;

            }

            setImages(imageList);

            setFilteredImages(imageList);

        }

        catch (err) {

            console.error(
                "Load Product Images Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load product images."
            );

        }

        finally {

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
    // SEARCH & FILTER
    // =====================================================

    useEffect(() => {

        let result = [...images];


        // -------------------------------------------------
        // SEARCH
        // -------------------------------------------------

        if (searchText.trim() !== "") {

            const search =
                searchText.trim().toLowerCase();

            result = result.filter((item) => {

                const productId =
                    String(
                        item.ProductId ??
                        item.productId ??
                        ""
                    ).toLowerCase();

                const imageName =
                    String(
                        item.ImageName ??
                        item.imageName ??
                        ""
                    ).toLowerCase();

                const imageUrl =
                    String(
                        item.ImageUrl ??
                        item.imageUrl ??
                        ""
                    ).toLowerCase();

                const imageType =
                    String(
                        item.ImageType ??
                        item.imageType ??
                        ""
                    ).toLowerCase();

                return (
                    productId.includes(search) ||
                    imageName.includes(search) ||
                    imageUrl.includes(search) ||
                    imageType.includes(search)
                );

            });

        }


        // -------------------------------------------------
        // IMAGE TYPE FILTER
        // -------------------------------------------------

        if (imageTypeFilter !== "") {

            result = result.filter((item) => {

                const imageType =
                    item.ImageType ??
                    item.imageType ??
                    "";

                return imageType === imageTypeFilter;

            });

        }


        setFilteredImages(result);

        setPage(1);

    }, [
        images,
        searchText,
        imageTypeFilter,
    ]);



    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.ceil(
            filteredImages.length / pageSize
        );


    const pagedImages =
        filteredImages.slice(
            (page - 1) * pageSize,
            page * pageSize
        );



    // =====================================================
    // SAVE PRODUCT IMAGE
    //
    // POST:
    // /api/product-images
    //
    // PUT:
    // /api/product-images/:id
    // =====================================================

    const handleSave = async (data) => {

        try {

            setError("");

            // ------------------------------------------------
            // Detect ID
            // ------------------------------------------------

            const productImageId =
                data?.ProductImageId ??
                data?.productImageId ??
                0;


            // ------------------------------------------------
            // UPDATE
            // ------------------------------------------------

            if (productImageId) {

                const response = await fetch(
                    `${SERVER_URL}/api/product-images/${productImageId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(data),
                    }
                );


                if (!response.ok) {

                    const errorData =
                        await response
                            .json()
                            .catch(() => ({}));

                    throw new Error(
                        errorData.message ||
                        `Failed to update product image. Status: ${response.status}`
                    );
                }

                setSuccess(
                    "Product image updated successfully."
                );

            }

            // ------------------------------------------------
            // CREATE
            // ------------------------------------------------

            else {

                const response = await fetch(
                    `${SERVER_URL}/api/product-images`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(data),
                    }
                );


                if (!response.ok) {

                    const errorData =
                        await response
                            .json()
                            .catch(() => ({}));

                    throw new Error(
                        errorData.message ||
                        `Failed to create product image. Status: ${response.status}`
                    );
                }

                setSuccess(
                    "Product image created successfully."
                );

            }


            // ------------------------------------------------
            // Reload
            // ------------------------------------------------

            await loadImages();

            setModalOpen(false);

            setSelectedImage(null);

        }

        catch (err) {

            console.error(
                "Save Product Image Error:",
                err
            );

            setError(
                err.message ||
                "Failed to save product image."
            );

        }

    };



    // =====================================================
    // DELETE PRODUCT IMAGE
    //
    // DELETE:
    // /api/product-images/:id
    // =====================================================

    const handleDelete = async (id) => {

        try {

            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-images/${id}`,
                {
                    method: "DELETE",
                }
            );


            if (!response.ok) {

                const errorData =
                    await response
                        .json()
                        .catch(() => ({}));

                throw new Error(
                    errorData.message ||
                    `Failed to delete product image. Status: ${response.status}`
                );
            }


            await loadImages();

            setDeleteOpen(false);

            setSelectedImage(null);

            setSuccess(
                "Product image deleted successfully."
            );

        }

        catch (err) {

            console.error(
                "Delete Product Image Error:",
                err
            );

            setError(
                err.message ||
                "Failed to delete product image."
            );

        }

    };



    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ProductImageToolbar

                onAdd={() => {

                    setSelectedImage(null);

                    setModalOpen(true);

                }}

                onRefresh={loadImages}

                onExport={() => {

                    console.log(
                        "Export Product Images"
                    );

                }}

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <ProductImageStatistics
                images={images}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <ProductImageSearch

                searchText={searchText}

                setSearchText={setSearchText}

                imageTypeFilter={imageTypeFilter}

                setImageTypeFilter={
                    setImageTypeFilter
                }

                images={images}

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <ProductImageTable

                images={pagedImages}

                loading={loading}

                onView={(row) => {

                    setSelectedImage(row);

                    setViewOpen(true);

                }}

                onEdit={(row) => {

                    setSelectedImage(row);

                    setModalOpen(true);

                }}

                onDelete={(row) => {

                    setSelectedImage(row);

                    setDeleteOpen(true);

                }}

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <ProductImagePagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredImages.length
                }

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <ProductImageModal

                open={modalOpen}

                image={selectedImage}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedImage(null);

                }}

                onSave={handleSave}

            />


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            <ProductImageView

                open={viewOpen}

                image={selectedImage}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedImage(null);

                }}

            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteProductImageDialog

                open={deleteOpen}

                image={selectedImage}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedImage(null);

                }}

                onDeleted={handleDelete}

            />


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

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
