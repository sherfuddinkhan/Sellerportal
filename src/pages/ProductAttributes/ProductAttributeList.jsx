import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProductAttributeToolbar from "./ProductAttributeToolbar";
import ProductAttributeStatistics from "./ProductAttributeStatistics";
import ProductAttributeSearch from "./ProductAttributeSearch";
import ProductAttributeTable from "./ProductAttributeTable";
import ProductAttributePagination from "./ProductAttributePagination";
import ProductAttributeModal from "./ProductAttributeModal";
import ProductAttributeView from "./ProductAttributeView";
import DeleteProductAttributeDialog from "./DeleteProductAttributeDialog";

const ProductAttributeList = () => {

    // ==========================================
    // State
    // ==========================================

    const [attributes, setAttributes] = useState([]);

    const [filteredAttributes, setFilteredAttributes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [attributeTypeFilter, setAttributeTypeFilter] = useState("");

    const [selectedAttribute, setSelectedAttribute] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    // ==========================================
    // Load Attributes
    // ==========================================

    const loadAttributes = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getProductAttributes();

            setAttributes(response.data);

            setFilteredAttributes(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadAttributes();

    }, []);

    // ==========================================
    // Search & Filter
    // ==========================================

    useEffect(() => {

        let result = [...attributes];

        if (searchText.trim() !== "") {

            const search = searchText.toLowerCase();

            result = result.filter(item =>

                String(item.ProductId)

                    .toLowerCase()

                    .includes(search)

                ||

                item.AttributeName

                    ?.toLowerCase()

                    .includes(search)

                ||

                item.AttributeValue

                    ?.toLowerCase()

                    .includes(search)

                ||

                item.AttributeType

                    ?.toLowerCase()

                    .includes(search)

            );

        }

        if (attributeTypeFilter !== "") {

            result = result.filter(

                item =>

                    item.AttributeType ===

                    attributeTypeFilter

            );

        }

        setFilteredAttributes(result);

        setPage(1);

    }, [

        attributes,

        searchText,

        attributeTypeFilter

    ]);

    // ==========================================
    // Pagination
    // ==========================================

    const totalPages = Math.ceil(

        filteredAttributes.length / pageSize

    );

    const pagedAttributes =

        filteredAttributes.slice(

            (page - 1) * pageSize,

            page * pageSize

        );

    // ==========================================
    // Save
    // ==========================================

    const handleSave = async (data) => {

        try {

            if (data.ProductAttributeId) {

                await apiService.updateProductAttribute(

                    data.ProductAttributeId,

                    data

                );

            }

            else {

                await apiService.createProductAttribute(

                    data

                );

            }

            await loadAttributes();

            setModalOpen(false);

            setSelectedAttribute(null);

        }

        catch (err) {

            console.log(err);

        }

    };

    // ==========================================
    // Delete
    // ==========================================

    const handleDelete = async (id) => {

        try {

            await apiService.deleteProductAttribute(id);

            await loadAttributes();

            setDeleteOpen(false);

            setSelectedAttribute(null);

        }

        catch (err) {

            console.log(err);

        }

    };
        // ==========================================
    // Render
    // ==========================================

    return (

        <Box sx={{ p: 3 }}>

            <ProductAttributeToolbar

                onAdd={() => {

                    setSelectedAttribute(null);

                    setModalOpen(true);

                }}

                onRefresh={loadAttributes}

                onExport={() =>

                    console.log(

                        "Export Product Attributes"

                    )

                }

            />

            <ProductAttributeStatistics

                attributes={attributes}

            />

            <ProductAttributeSearch

                searchText={searchText}

                setSearchText={setSearchText}

                attributeTypeFilter={attributeTypeFilter}

                setAttributeTypeFilter={

                    setAttributeTypeFilter

                }

                attributes={attributes}

            />

            <ProductAttributeTable

                attributes={pagedAttributes}

                loading={loading}

                onView={(row) => {

                    setSelectedAttribute(row);

                    setViewOpen(true);

                }}

                onEdit={(row) => {

                    setSelectedAttribute(row);

                    setModalOpen(true);

                }}

                onDelete={(row) => {

                    setSelectedAttribute(row);

                    setDeleteOpen(true);

                }}

            />

            <ProductAttributePagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={

                    filteredAttributes.length

                }

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />

            <ProductAttributeModal

                open={modalOpen}

                attribute={selectedAttribute}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedAttribute(null);

                }}

                onSave={handleSave}

            />

            <ProductAttributeView

                open={viewOpen}

                attribute={selectedAttribute}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedAttribute(null);

                }}

            />

            <DeleteProductAttributeDialog

                open={deleteOpen}

                attribute={selectedAttribute}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedAttribute(null);

                }}

                onDeleted={handleDelete}

            />

        </Box>

    );

};

export default ProductAttributeList;