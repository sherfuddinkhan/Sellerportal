// =========================================================
// ProductAttributeList.jsx
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Alert,
    Snackbar
} from "@mui/material";

import ProductAttributeToolbar
    from "./ProductAttributeToolbar";

import ProductAttributeStatistics
    from "./ProductAttributeStatistics";

import ProductAttributeSearch
    from "./ProductAttributeSearch";

import ProductAttributeTable
    from "./ProductAttributeTable";

import ProductAttributePagination
    from "./ProductAttributePagination";

import ProductAttributeModal
    from "./ProductAttributeModal";

import ProductAttributeView
    from "./ProductAttributeView";

import DeleteProductAttributeDialog
    from "./DeleteProductAttributeDialog";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// Component
// =========================================================

const ProductAttributeList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [attributes, setAttributes] = useState([]);

    const [filteredAttributes, setFilteredAttributes] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [attributeTypeFilter, setAttributeTypeFilter] =
        useState("");

    const [selectedAttribute, setSelectedAttribute] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD ALL PRODUCT ATTRIBUTES
    // =====================================================

    const loadAttributes = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-attributes/all`
            );

            if (!response.ok) {

                throw new Error(
                    `Failed to load product attributes. Status: ${response.status}`
                );
            }

            const data = await response.json();

            // ---------------------------------------------
            // API may return array directly
            // ---------------------------------------------

            const items = Array.isArray(data)
                ? data
                : data.items || [];

            setAttributes(items);

        }
        catch (err) {

            console.error(
                "Load Product Attributes Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load product attributes."
            );

            setAttributes([]);
        }
        finally {

            setLoading(false);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAttributes();

    }, []);


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    useEffect(() => {

        let result = [...attributes];


        // -------------------------------------------------
        // SEARCH
        // -------------------------------------------------

        if (searchText.trim() !== "") {

            const search =
                searchText.toLowerCase().trim();

            result = result.filter((item) => {

                const productId =
                    String(
                        item.productId ??
                        item.ProductId ??
                        ""
                    ).toLowerCase();

                const attributeName =
                    String(
                        item.attributeName ??
                        item.AttributeName ??
                        ""
                    ).toLowerCase();

                const attributeValue =
                    String(
                        item.attributeValue ??
                        item.AttributeValue ??
                        ""
                    ).toLowerCase();

                const attributeType =
                    String(
                        item.attributeType ??
                        item.AttributeType ??
                        ""
                    ).toLowerCase();


                return (
                    productId.includes(search) ||
                    attributeName.includes(search) ||
                    attributeValue.includes(search) ||
                    attributeType.includes(search)
                );

            });
        }


        // -------------------------------------------------
        // ATTRIBUTE TYPE FILTER
        // -------------------------------------------------

        if (attributeTypeFilter !== "") {

            result = result.filter((item) => {

                const attributeType =
                    item.attributeType ??
                    item.AttributeType ??
                    "";

                return attributeType ===
                    attributeTypeFilter;
            });
        }


        setFilteredAttributes(result);

        setPage(1);

    }, [
        attributes,
        searchText,
        attributeTypeFilter
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.ceil(
            filteredAttributes.length /
            pageSize
        );


    const pagedAttributes =
        filteredAttributes.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =====================================================
    // SAVE
    // CREATE / UPDATE
    // =====================================================

    const handleSave = async (data) => {

        try {

            setError("");

            const attributeId =
                data.productAttributeId ??
                data.ProductAttributeId;


            // =================================================
            // UPDATE
            // =================================================

            if (attributeId) {

                const response = await fetch(
                    `${SERVER_URL}/api/product-attributes/${attributeId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


                if (!response.ok) {

                    const errorData =
                        await response.json()
                            .catch(() => null);

                    throw new Error(
                        errorData?.message ||
                        `Failed to update product attribute. Status: ${response.status}`
                    );
                }


                setSuccess(
                    "Product attribute updated successfully."
                );
            }


            // =================================================
            // CREATE
            // =================================================

            else {

                const response = await fetch(
                    `${SERVER_URL}/api/product-attributes`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


                if (!response.ok) {

                    const errorData =
                        await response.json()
                            .catch(() => null);

                    throw new Error(
                        errorData?.message ||
                        `Failed to create product attribute. Status: ${response.status}`
                    );
                }


                setSuccess(
                    "Product attribute created successfully."
                );
            }


            // =================================================
            // RELOAD
            // =================================================

            await loadAttributes();

            setModalOpen(false);

            setSelectedAttribute(null);

        }
        catch (err) {

            console.error(
                "Save Product Attribute Error:",
                err
            );

            setError(
                err.message ||
                "Failed to save product attribute."
            );
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        try {

            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-attributes/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                const errorData =
                    await response.json()
                        .catch(() => null);

                throw new Error(
                    errorData?.message ||
                    `Failed to delete product attribute. Status: ${response.status}`
                );
            }


            setSuccess(
                "Product attribute deleted successfully."
            );


            await loadAttributes();

            setDeleteOpen(false);

            setSelectedAttribute(null);

        }
        catch (err) {

            console.error(
                "Delete Product Attribute Error:",
                err
            );

            setError(
                err.message ||
                "Failed to delete product attribute."
            );
        }
    };


    // =====================================================
    // CLOSE NOTIFICATIONS
    // =====================================================

    const handleCloseNotification = () => {

        setError("");
        setSuccess("");
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ProductAttributeToolbar

                onAdd={() => {

                    setSelectedAttribute(null);

                    setModalOpen(true);
                }}

                onRefresh={loadAttributes}

                onExport={() => {

                    console.log(
                        "Export Product Attributes"
                    );

                }}

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <ProductAttributeStatistics
                attributes={attributes}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <ProductAttributeSearch

                searchText={searchText}

                setSearchText={setSearchText}

                attributeTypeFilter={
                    attributeTypeFilter
                }

                setAttributeTypeFilter={
                    setAttributeTypeFilter
                }

                attributes={attributes}

            />


            {/* =================================================
                TABLE
            ================================================= */}

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


            {/* =================================================
                PAGINATION
            ================================================= */}

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


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <ProductAttributeModal

                open={modalOpen}

                attribute={selectedAttribute}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedAttribute(null);

                }}

                onSave={handleSave}

            />


            {/* =================================================
                VIEW
            ================================================= */}

            <ProductAttributeView

                open={viewOpen}

                attribute={selectedAttribute}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedAttribute(null);

                }}

            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteProductAttributeDialog

                open={deleteOpen}

                attribute={selectedAttribute}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedAttribute(null);

                }}

                onDeleted={handleDelete}

            />


            {/* =================================================
                ERROR
            ================================================= */}

            <Snackbar

                open={Boolean(error)}

                autoHideDuration={5000}

                onClose={handleCloseNotification}

            >

                <Alert
                    severity="error"
                    onClose={handleCloseNotification}
                >
                    {error}
                </Alert>

            </Snackbar>


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar

                open={Boolean(success)}

                autoHideDuration={3000}

                onClose={handleCloseNotification}

            >

                <Alert
                    severity="success"
                    onClose={handleCloseNotification}
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default ProductAttributeList;