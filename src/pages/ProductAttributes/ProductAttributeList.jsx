// =========================================================
// ProductAttributeList.jsx
// Product Attribute Management
// Uses Node server.js - NO apiService
// =========================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Snackbar,
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
// COMPONENT
// =========================================================

const ProductAttributeList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [attributes, setAttributes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [attributeTypeFilter, setAttributeTypeFilter] =
        useState("");

    const [selectedAttribute, setSelectedAttribute] =
        useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD ALL PRODUCT ATTRIBUTES
    // =====================================================

    const loadAttributes = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading Product Attributes..."
            );

            const response = await fetch(
                `${SERVER_URL}/api/product-attributes/all`
            );

            console.log(
                "Product Attribute API Status:",
                response.status
            );

            const data = await response
                .json()
                .catch(() => null);

            console.log(
                "Product Attribute API Response:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    `Failed to load product attributes. Status: ${response.status}`
                );
            }

            // -------------------------------------------------
            // API MAY RETURN:
            //
            // [
            //   {...},
            //   {...}
            // ]
            //
            // OR
            //
            // {
            //   items: [...]
            // }
            // -------------------------------------------------

            let items = [];

            if (Array.isArray(data)) {

                items = data;

            } else if (
                Array.isArray(data?.items)
            ) {

                items = data.items;

            } else if (
                Array.isArray(data?.data)
            ) {

                items = data.data;

            }

            setAttributes(items);

            console.log(
                `Loaded ${items.length} product attributes.`
            );

        }
        catch (err) {

            console.error(
                "Load Product Attributes Error:",
                err
            );

            setAttributes([]);

            setError(
                err.message ||
                "Failed to load product attributes."
            );

        }
        finally {

            setLoading(false);

        }

    }, []);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAttributes();

    }, [loadAttributes]);


    // =====================================================
    // FILTER + SEARCH
    // =====================================================

    const filteredAttributes = useMemo(() => {

        let result = [...attributes];

        // -------------------------------------------------
        // SEARCH
        // -------------------------------------------------

        if (searchText.trim()) {

            const search =
                searchText
                    .trim()
                    .toLowerCase();

            result = result.filter(
                (item) => {

                    const productId =
                        String(
                            item.productId ??
                            item.ProductId ??
                            ""
                        ).toLowerCase();

                    const sellerId =
                        String(
                            item.sellerId ??
                            item.SellerId ??
                            ""
                        ).toLowerCase();

                    const customerId =
                        String(
                            item.customerId ??
                            item.CustomerId ??
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

                    return (
                        productId.includes(search) ||
                        sellerId.includes(search) ||
                        customerId.includes(search) ||
                        attributeName.includes(search) ||
                        attributeValue.includes(search)
                    );
                }
            );
        }

        // -------------------------------------------------
        // ATTRIBUTE TYPE FILTER
        //
        // Your current ProductAttribute model does NOT
        // contain AttributeType.
        //
        // This is retained only for compatibility if
        // your API later adds it.
        // -------------------------------------------------

        if (attributeTypeFilter) {

            result = result.filter(
                (item) => {

                    const attributeType =
                        item.attributeType ??
                        item.AttributeType ??
                        "";

                    return (
                        attributeType ===
                        attributeTypeFilter
                    );
                }
            );
        }

        return result;

    }, [
        attributes,
        searchText,
        attributeTypeFilter,
    ]);


    // =====================================================
    // RESET PAGE WHEN FILTER CHANGES
    // =====================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText,
        attributeTypeFilter,
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredAttributes.length /
                pageSize
            )
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

            // -------------------------------------------------
            // SUPPORT BOTH PascalCase AND camelCase
            // -------------------------------------------------

            const attributeId =
                data?.ProductAttributeId ??
                data?.productAttributeId ??
                0;


            // =================================================
            // NORMALIZE PAYLOAD
            // =================================================

            const payload = {

                ProductAttributeId:
                    Number(attributeId || 0),

                ProductId:
                    Number(
                        data?.ProductId ??
                        data?.productId ??
                        0
                    ),

                SellerId:
                    Number(
                        data?.SellerId ??
                        data?.sellerId ??
                        0
                    ),

                CustomerId:
                    Number(
                        data?.CustomerId ??
                        data?.customerId ??
                        0
                    ),

                AttributeName:
                    String(
                        data?.AttributeName ??
                        data?.attributeName ??
                        ""
                    ).trim(),

                AttributeValue:
                    String(
                        data?.AttributeValue ??
                        data?.attributeValue ??
                        ""
                    ).trim(),

                IsActive:
                    Boolean(
                        data?.IsActive ??
                        data?.isActive ??
                        true
                    ),

                CreatedDate:
                    data?.CreatedDate ??
                    data?.createdDate ??
                    new Date().toISOString(),
            };


            // =================================================
            // VALIDATION
            // =================================================

            if (!payload.ProductId) {

                throw new Error(
                    "Product ID is required."
                );
            }

            if (!payload.SellerId) {

                throw new Error(
                    "Seller ID is required."
                );
            }

            if (!payload.CustomerId) {

                throw new Error(
                    "Customer ID is required."
                );
            }

            if (!payload.AttributeName) {

                throw new Error(
                    "Attribute name is required."
                );
            }

            if (!payload.AttributeValue) {

                throw new Error(
                    "Attribute value is required."
                );
            }


            // =================================================
            // UPDATE
            // =================================================

            if (attributeId) {

                console.log(
                    "Updating Product Attribute:",
                    payload
                );

                const response = await fetch(
                    `${SERVER_URL}/api/product-attributes/${attributeId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );

                const responseData =
                    await response
                        .json()
                        .catch(
                            () => null
                        );

                console.log(
                    "Update Response:",
                    responseData
                );

                if (!response.ok) {

                    throw new Error(
                        responseData?.message ||
                        responseData?.error ||
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

                console.log(
                    "Creating Product Attribute:",
                    payload
                );

                const response = await fetch(
                    `${SERVER_URL}/api/product-attributes`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );

                const responseData =
                    await response
                        .json()
                        .catch(
                            () => null
                        );

                console.log(
                    "Create Response:",
                    responseData
                );

                if (!response.ok) {

                    throw new Error(
                        responseData?.message ||
                        responseData?.error ||
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

    const handleDelete = async (attributeOrId) => {

        try {

            setError("");

            // -------------------------------------------------
            // SUPPORT:
            //
            // onDelete(3)
            //
            // OR
            //
            // onDelete(row)
            // -------------------------------------------------

            const id =
                typeof attributeOrId === "object"
                    ? (
                        attributeOrId
                            ?.ProductAttributeId ??
                        attributeOrId
                            ?.productAttributeId
                    )
                    : attributeOrId;

            if (!id) {

                throw new Error(
                    "Product attribute ID is required."
                );
            }


            console.log(
                "Deleting Product Attribute:",
                id
            );


            const response = await fetch(
                `${SERVER_URL}/api/product-attributes/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data =
                await response
                    .json()
                    .catch(
                        () => null
                    );


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    `Failed to delete product attribute. Status: ${response.status}`
                );
            }


            setSuccess(
                "Product attribute deleted successfully."
            );


            // -------------------------------------------------
            // RELOAD
            // -------------------------------------------------

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
    // CLOSE VIEW
    // =====================================================

    const handleCloseView = () => {

        setViewOpen(false);

        setSelectedAttribute(null);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseModal = () => {

        setModalOpen(false);

        setSelectedAttribute(null);
    };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const handleCloseDelete = () => {

        setDeleteOpen(false);

        setSelectedAttribute(null);
    };


    // =====================================================
    // CLOSE NOTIFICATIONS
    // =====================================================

    const handleCloseError = () => {

        setError("");
    };


    const handleCloseSuccess = () => {

        setSuccess("");
    };


    // =====================================================
    // EXPORT
    // =====================================================

    const handleExport = () => {

        try {

            if (!filteredAttributes.length) {

                setError(
                    "There are no product attributes to export."
                );

                return;
            }


            const headers = [
                "Product Attribute ID",
                "Product ID",
                "Seller ID",
                "Customer ID",
                "Attribute Name",
                "Attribute Value",
                "Active",
                "Created Date",
            ];


            const rows =
                filteredAttributes.map(
                    (item) => [

                        item.ProductAttributeId ??
                        item.productAttributeId ??
                        "",

                        item.ProductId ??
                        item.productId ??
                        "",

                        item.SellerId ??
                        item.sellerId ??
                        "",

                        item.CustomerId ??
                        item.customerId ??
                        "",

                        item.AttributeName ??
                        item.attributeName ??
                        "",

                        item.AttributeValue ??
                        item.attributeValue ??
                        "",

                        (
                            item.IsActive ??
                            item.isActive ??
                            false
                        )
                            ? "Active"
                            : "Inactive",

                        item.CreatedDate ??
                        item.createdDate ??
                        "",
                    ]
                );


            const csvContent = [
                headers,
                ...rows,
            ]
                .map(
                    (row) =>
                        row
                            .map(
                                (value) =>
                                    `"${String(value)
                                        .replace(
                                            /"/g,
                                            '""'
                                        )}"`
                            )
                            .join(",")
                )
                .join("\n");


            const blob = new Blob(
                [csvContent],
                {
                    type:
                        "text/csv;charset=utf-8;",
                }
            );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "product-attributes.csv";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);


            setSuccess(
                "Product attributes exported successfully."
            );

        }
        catch (err) {

            console.error(
                "Export Error:",
                err
            );

            setError(
                "Failed to export product attributes."
            );
        }
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    sm: 3,
                },
                width: "100%",
            }}
        >

            {/* =================================================
                TOOLBAR
                ================================================= */}

            <ProductAttributeToolbar
                onAdd={() => {

                    setSelectedAttribute(null);

                    setModalOpen(true);
                }}

                onRefresh={loadAttributes}

                onExport={handleExport}
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

                onPageChange={(newPage) => {

                    if (
                        newPage >= 1 &&
                        newPage <= totalPages
                    ) {
                        setPage(newPage);
                    }

                }}

                onPageSizeChange={(size) => {

                    const newSize =
                        Number(size) || 10;

                    setPageSize(newSize);

                    setPage(1);
                }}
            />


            {/* =================================================
                CREATE / EDIT MODAL
                ================================================= */}

            <ProductAttributeModal
                open={modalOpen}

                attribute={
                    selectedAttribute
                }

                onClose={
                    handleCloseModal
                }

                onSave={
                    handleSave
                }
            />


            {/* =================================================
                VIEW
                ================================================= */}

            <ProductAttributeView
                open={viewOpen}

                attribute={
                    selectedAttribute
                }

                onClose={
                    handleCloseView
                }
            />


            {/* =================================================
                DELETE
                ================================================= */}

            <DeleteProductAttributeDialog
                open={deleteOpen}

                attribute={
                    selectedAttribute
                }

                onClose={
                    handleCloseDelete
                }

                onDeleted={
                    handleDelete
                }
            />


            {/* =================================================
                ERROR NOTIFICATION
                ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={
                    handleCloseError
                }
            >

                <Alert
                    severity="error"
                    variant="filled"
                    onClose={
                        handleCloseError
                    }
                    sx={{
                        width: "100%",
                    }}
                >
                    {error}
                </Alert>

            </Snackbar>


            {/* =================================================
                SUCCESS NOTIFICATION
                ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={4000}
                onClose={
                    handleCloseSuccess
                }
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={
                        handleCloseSuccess
                    }
                    sx={{
                        width: "100%",
                    }}
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProductAttributeList;
