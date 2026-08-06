import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProductImageToolbar from "./ProductImageToolbar";
import ProductImageStatistics from "./ProductImageStatistics";
import ProductImageSearch from "./ProductImageSearch";
import ProductImageTable from "./ProductImageTable";
import ProductImagePagination from "./ProductImagePagination";
import ProductImageModal from "./ProductImageModal";
import ProductImageView from "./ProductImageView";
import DeleteProductImageDialog from "./DeleteProductImageDialog";

const ProductImageList = () => {

    // ===========================================
    // State
    // ===========================================

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

    // ===========================================
    // Load Images
    // ===========================================

    const loadImages = async () => {

        try {

            setLoading(true);

            const response = await apiService.getProductImages();

            setImages(response.data);

            setFilteredImages(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadImages();

    }, []);

    // ===========================================
    // Search & Filter
    // ===========================================

    useEffect(() => {

        let result = [...images];

        if (searchText.trim() !== "") {

            const search = searchText.toLowerCase();

            result = result.filter(item =>

                String(item.ProductId)
                    .toLowerCase()
                    .includes(search)

                ||

                item.ImageName
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.ImageUrl
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.ImageType
                    ?.toLowerCase()
                    .includes(search)

            );

        }

        if (imageTypeFilter !== "") {

            result = result.filter(

                item => item.ImageType === imageTypeFilter

            );

        }

        setFilteredImages(result);

        setPage(1);

    }, [

        images,

        searchText,

        imageTypeFilter

    ]);

    // ===========================================
    // Pagination
    // ===========================================

    const totalPages = Math.ceil(

        filteredImages.length / pageSize

    );

    const pagedImages = filteredImages.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    // ===========================================
    // Save
    // ===========================================

    const handleSave = async (data) => {

        try {

            if (data.ProductImageId) {

                await apiService.updateProductImage(

                    data.ProductImageId,

                    data

                );

            }

            else {

                await apiService.createProductImage(data);

            }

            loadImages();

            setModalOpen(false);

            setSelectedImage(null);

        }

        catch (err) {

            console.log(err);

        }

    };

    // ===========================================
    // Delete
    // ===========================================

    const handleDelete = async (id) => {

        try {

            await apiService.deleteProductImage(id);

            loadImages();

            setDeleteOpen(false);

            setSelectedImage(null);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <Box sx={{ p: 3 }}>

            <ProductImageToolbar

                onAdd={() => {

                    setSelectedImage(null);

                    setModalOpen(true);

                }}

                onRefresh={loadImages}

                onExport={() =>

                    console.log("Export Product Images")

                }

            />

            <ProductImageStatistics

                images={images}

            />

            <ProductImageSearch

                searchText={searchText}

                setSearchText={setSearchText}

                imageTypeFilter={imageTypeFilter}

                setImageTypeFilter={setImageTypeFilter}

                images={images}

            />

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

            <ProductImageModal

                open={modalOpen}

                image={selectedImage}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedImage(null);

                }}

                onSave={handleSave}

            />

            <ProductImageView

                open={viewOpen}

                image={selectedImage}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedImage(null);

                }}

            />

            <DeleteProductImageDialog

                open={deleteOpen}

                image={selectedImage}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedImage(null);

                }}

                onDeleted={handleDelete}

            />

        </Box>

    );

};

export default ProductImageList;