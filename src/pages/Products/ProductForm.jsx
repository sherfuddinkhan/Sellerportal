// =========================================================
// ProductForm.jsx
// Marketplace Seller Portal
// Create / Edit Product
// Uses Node.js server.js proxy
// No apiService
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import axios from "axios";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// DEFAULT PRODUCT
// =========================================================

const DEFAULT_PRODUCT = {
    sellerId: "",
    customerId: "",
    sku: "",
    productName: "",
    description: "",
    brandId: "",
    categoryId: "",
    productTypeId: "",
    isActive: true,
};

// =========================================================
// COMPONENT
// =========================================================

const ProductForm = ({
    initialValues = null,
    loading: parentLoading = false,
    onSubmit,
    onCancel,
}) => {

    const navigate = useNavigate();

    // =========================================================
    // ROUTE PARAMETER
    // =========================================================

    const { id } = useParams();

    const isEditMode =
        Boolean(id);

    // =========================================================
    // PRODUCT STATE
    // =========================================================

    const [product, setProduct] =
        useState(DEFAULT_PRODUCT);

    // =========================================================
    // MASTER DATA
    // =========================================================

    const [brands, setBrands] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [productTypes, setProductTypes] =
        useState([]);

    // =========================================================
    // UI STATE
    // =========================================================

    const [loading, setLoading] =
        useState(false);

    const [masterLoading, setMasterLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =========================================================
    // DEBUG
    // =========================================================

    useEffect(() => {

        console.log(
            "=========================================="
        );

        console.log(
            "PRODUCT FORM"
        );

        console.log(
            "URL:",
            window.location.href
        );

        console.log(
            "PRODUCT ID:",
            id
        );

        console.log(
            "EDIT MODE:",
            isEditMode
        );

        console.log(
            "INITIAL VALUES:",
            initialValues
        );

        console.log(
            "=========================================="
        );

    }, [
        id,
        isEditMode,
        initialValues,
    ]);

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadMasterData();

    }, []);

    // =========================================================
    // LOAD INITIAL PRODUCT
    // =========================================================

    useEffect(() => {

        if (!isEditMode) {

            setProduct(
                DEFAULT_PRODUCT
            );

            return;
        }

        // =====================================================
        // PRODUCT RECEIVED FROM PRODUCT EDIT
        // =====================================================

        if (initialValues) {

            console.log(
                "Using product received from ProductEdit:"
            );

            console.log(
                initialValues
            );

            setProduct({

                sellerId:
                    initialValues.sellerId ??
                    initialValues.SellerId ??
                    "",

                customerId:
                    initialValues.customerId ??
                    initialValues.CustomerId ??
                    "",

                sku:
                    initialValues.sku ??
                    initialValues.SKU ??
                    "",

                productName:
                    initialValues.productName ??
                    initialValues.ProductName ??
                    "",

                description:
                    initialValues.description ??
                    initialValues.Description ??
                    "",

                brandId:
                    initialValues.brandId ??
                    initialValues.BrandId ??
                    "",

                categoryId:
                    initialValues.categoryId ??
                    initialValues.CategoryId ??
                    "",

                productTypeId:
                    initialValues.productTypeId ??
                    initialValues.ProductTypeId ??
                    "",

                isActive:
                    initialValues.isActive ??
                    initialValues.IsActive ??
                    true,
            });

            return;
        }

        // =====================================================
        // FETCH PRODUCT BY ID
        // =====================================================

        loadProductById(id);

    }, [
        id,
        isEditMode,
        initialValues,
    ]);

    // =========================================================
    // NORMALIZE API RESPONSE
    // =========================================================
    //
    // Supports:
    //
    // []
    //
    // { items: [] }
    //
    // { data: [] }
    //
    // { results: [] }
    //
    // { Items: [] }
    //
    // { Data: [] }
    //
    // =========================================================

    const normalizeListResponse = (
        responseData
    ) => {

        if (Array.isArray(responseData)) {

            return responseData;
        }

        if (
            Array.isArray(
                responseData?.items
            )
        ) {

            return responseData.items;
        }

        if (
            Array.isArray(
                responseData?.data
            )
        ) {

            return responseData.data;
        }

        if (
            Array.isArray(
                responseData?.results
            )
        ) {

            return responseData.results;
        }

        if (
            Array.isArray(
                responseData?.Items
            )
        ) {

            return responseData.Items;
        }

        if (
            Array.isArray(
                responseData?.Data
            )
        ) {

            return responseData.Data;
        }

        return [];
    };

    // =========================================================
    // LOAD MASTER DATA
    // =========================================================
    //
    // IMPORTANT:
    //
    // Each API is loaded separately.
    //
    // Therefore if Brands fails, Categories and Product Types
    // can still load.
    //
    // =========================================================

    const loadMasterData = async () => {

        setMasterLoading(true);

        setError("");

        console.log(
            "================================================="
        );

        console.log(
            "LOADING MASTER DATA"
        );

        console.log(
            "================================================="
        );

        // =====================================================
        // GET ALL BRANDS
        // =====================================================

        try {

            console.log(
                "GET ALL BRANDS"
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/brands`
            );

            const response =
                await axios.get(

                    `${SERVER_URL}/api/brands`,

                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "BRANDS STATUS:",
                response.status
            );

            console.log(
                "BRANDS RAW RESPONSE:",
                response.data
            );

            const brandList =
                normalizeListResponse(
                    response.data
                );

            console.log(
                "BRANDS NORMALIZED:",
                brandList
            );

            setBrands(
                brandList
            );

        }
        catch (err) {

            console.error(
                "GET ALL BRANDS FAILED"
            );

            console.error(
                "BRANDS ERROR:",
                err
            );

            console.error(
                "BRANDS STATUS:",
                err.response?.status
            );

            console.error(
                "BRANDS RESPONSE:",
                err.response?.data
            );

            setBrands([]);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "GET ALL BRANDS failed."
            );
        }

        // =====================================================
        // GET ALL CATEGORIES
        // =====================================================

        try {

            console.log(
                "GET ALL CATEGORIES"
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/category`
            );

            const response =
                await axios.get(

                    `${SERVER_URL}/api/category`,

                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "CATEGORIES STATUS:",
                response.status
            );

            console.log(
                "CATEGORIES RAW RESPONSE:",
                response.data
            );

            const categoryList =
                normalizeListResponse(
                    response.data
                );

            console.log(
                "CATEGORIES NORMALIZED:",
                categoryList
            );

            setCategories(
                categoryList
            );

        }
        catch (err) {

            console.error(
                "GET ALL CATEGORIES FAILED"
            );

            console.error(
                "CATEGORIES ERROR:",
                err
            );

            console.error(
                "CATEGORIES STATUS:",
                err.response?.status
            );

            console.error(
                "CATEGORIES RESPONSE:",
                err.response?.data
            );

            setCategories([]);

        }

        // =====================================================
        // GET ALL PRODUCT TYPES
        // =====================================================

        try {

            console.log(
                "GET ALL PRODUCT TYPES"
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/producttype`
            );

            const response =
                await axios.get(

                    `${SERVER_URL}/api/producttype`,

                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "PRODUCT TYPES STATUS:",
                response.status
            );

            console.log(
                "PRODUCT TYPES RAW RESPONSE:",
                response.data
            );

            const productTypeList =
                normalizeListResponse(
                    response.data
                );

            console.log(
                "PRODUCT TYPES NORMALIZED:",
                productTypeList
            );

            setProductTypes(
                productTypeList
            );

        }
        catch (err) {

            console.error(
                "GET ALL PRODUCT TYPES FAILED"
            );

            console.error(
                "PRODUCT TYPES ERROR:",
                err
            );

            console.error(
                "PRODUCT TYPES STATUS:",
                err.response?.status
            );

            console.error(
                "PRODUCT TYPES RESPONSE:",
                err.response?.data
            );

            setProductTypes([]);

        }

        // =====================================================
        // FINISH MASTER DATA
        // =====================================================

        setMasterLoading(false);

        console.log(
            "================================================="
        );

        console.log(
            "MASTER DATA LOAD COMPLETE"
        );

        console.log(
            "================================================="
        );
    };

    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    const loadProductById = async (
        productId
    ) => {

        if (!productId) {

            setError(
                "Product ID is missing."
            );

            return;
        }

        try {

            setLoading(true);

            setError("");

            console.log(
                "=========================================="
            );

            console.log(
                "LOADING PRODUCT BY ID"
            );

            console.log(
                "PRODUCT ID:",
                productId
            );

            console.log(
                "GET:",
                `${SERVER_URL}/api/products/${productId}`
            );

            console.log(
                "=========================================="
            );

            const response =
                await axios.get(

                    `${SERVER_URL}/api/products/${encodeURIComponent(productId)}`,

                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "PRODUCT RESPONSE:",
                response.data
            );

            const data =
                response.data;

            if (!data) {

                throw new Error(
                    "Product data is empty."
                );
            }

            setProduct({

                sellerId:
                    data.sellerId ??
                    data.SellerId ??
                    "",

                customerId:
                    data.customerId ??
                    data.CustomerId ??
                    "",

                sku:
                    data.sku ??
                    data.SKU ??
                    "",

                productName:
                    data.productName ??
                    data.ProductName ??
                    "",

                description:
                    data.description ??
                    data.Description ??
                    "",

                brandId:
                    data.brandId ??
                    data.BrandId ??
                    "",

                categoryId:
                    data.categoryId ??
                    data.CategoryId ??
                    "",

                productTypeId:
                    data.productTypeId ??
                    data.ProductTypeId ??
                    "",

                isActive:
                    data.isActive ??
                    data.IsActive ??
                    true,
            });

        }
        catch (err) {

            console.error(
                "PRODUCT LOAD ERROR:",
                err
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            console.error(
                "DATA:",
                err.response?.data
            );

            setError(
                err.response?.data?.message ||
                `Unable to load product. HTTP ${
                    err.response?.status ||
                    "Unknown"
                }`
            );

        }
        finally {

            setLoading(false);

        }
    };

    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setProduct(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setError("");

        setSuccess("");
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {

        if (!product.sellerId) {

            setError(
                "Seller ID is required."
            );

            return false;
        }

        if (!product.sku?.trim()) {

            setError(
                "SKU is required."
            );

            return false;
        }

        if (!product.productName?.trim()) {

            setError(
                "Product name is required."
            );

            return false;
        }

        if (!product.brandId) {

            setError(
                "Brand is required."
            );

            return false;
        }

        if (!product.categoryId) {

            setError(
                "Category is required."
            );

            return false;
        }

        if (!product.productTypeId) {

            setError(
                "Product type is required."
            );

            return false;
        }

        return true;
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");

        setSuccess("");

        if (!validateForm()) {

            return;
        }

        try {

            setSaving(true);

            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                sellerId:
                    Number(
                        product.sellerId
                    ),

                customerId:
                    product.customerId
                        ? Number(
                            product.customerId
                        )
                        : null,

                sku:
                    product.sku.trim(),

                productName:
                    product.productName.trim(),

                description:
                    product.description?.trim() ||
                    "",

                brandId:
                    Number(
                        product.brandId
                    ),

                categoryId:
                    Number(
                        product.categoryId
                    ),

                productTypeId:
                    Number(
                        product.productTypeId
                    ),

                isActive:
                    Boolean(
                        product.isActive
                    ),
            };

            console.log(
                "=========================================="
            );

            console.log(
                "PRODUCT SAVE"
            );

            console.log(
                "EDIT MODE:",
                isEditMode
            );

            console.log(
                "PRODUCT ID:",
                id
            );

            console.log(
                "PAYLOAD:",
                payload
            );

            console.log(
                "=========================================="
            );

            // =================================================
            // PARENT HANDLER
            // =================================================

            if (onSubmit) {

                await onSubmit(
                    payload
                );

                return;
            }

            // =================================================
            // UPDATE PRODUCT
            // =================================================

            if (isEditMode) {

                console.log(
                    "UPDATING PRODUCT ID:",
                    id
                );

                const response =
                    await axios.put(

                        `${SERVER_URL}/api/products/${encodeURIComponent(id)}`,

                        payload,

                        {
                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json",
                            },

                            timeout: 30000,
                        }
                    );

                console.log(
                    "UPDATE RESPONSE:",
                    response.data
                );

                setSuccess(
                    "Product updated successfully."
                );

                setTimeout(() => {

                    navigate(
                        "/products"
                    );

                }, 1000);

                return;
            }

            // =================================================
            // CREATE PRODUCT
            // =================================================

            console.log(
                "CREATING PRODUCT"
            );

            const response =
                await axios.post(

                    `${SERVER_URL}/api/products`,

                    payload,

                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "CREATE RESPONSE:",
                response.data
            );

            setSuccess(
                "Product created successfully."
            );

            setProduct(
                DEFAULT_PRODUCT
            );

        }
        catch (err) {

            console.error(
                "PRODUCT SAVE ERROR:",
                err
            );

            console.error(
                "SAVE STATUS:",
                err.response?.status
            );

            console.error(
                "SAVE RESPONSE:",
                err.response?.data
            );

            const apiError =
                err.response?.data;

            setError(

                apiError?.message ||

                apiError?.title ||

                (
                    typeof apiError ===
                    "string"
                        ? apiError
                        : null
                ) ||

                err.message ||

                "Unable to save product."

            );

        }
        finally {

            setSaving(false);

        }
    };

    // =========================================================
    // CANCEL
    // =========================================================

    const handleCancel = () => {

        if (onCancel) {

            onCancel();

            return;
        }

        navigate(
            "/products"
        );
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (
        loading ||
        parentLoading
    ) {

        return (

            <div
                className="product-form-container"
            >

                <div
                    className="product-form-card"
                >

                    <h2>

                        {isEditMode
                            ? "Edit Product"
                            : "Create Product"}

                    </h2>

                    <p>

                        {isEditMode
                            ? `Loading Product ID: ${id}`
                            : "Loading..."}

                    </p>

                </div>

            </div>

        );
    }

    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            className="product-form-container"
        >

            <div
                className="product-form-card"
            >

                {/* =================================================
                    HEADER
                ================================================== */}

                <div
                    className="product-form-header"
                >

                    <div>

                        <h2>

                            {isEditMode
                                ? "Edit Product"
                                : "Create Product"}

                        </h2>

                        <p>

                            {isEditMode

                                ? `Update Product ID: ${id}`

                                : "Enter product information"}

                        </p>

                    </div>

                    <button
                        type="button"
                        className="back-button"
                        onClick={handleCancel}
                    >
                        ← Back
                    </button>

                </div>

                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div
                        className="product-form-error"
                    >

                        {String(error)}

                    </div>

                )}

                {/* =================================================
                    SUCCESS
                ================================================== */}

                {success && (

                    <div
                        className="product-form-success"
                    >

                        {success}

                    </div>

                )}

                {/* =================================================
                    MASTER LOADING
                ================================================== */}

                {masterLoading && (

                    <div>

                        Loading brands, categories
                        and product types...

                    </div>

                )}

                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                >

                    <div
                        className="form-grid"
                    >

                        {/* =================================================
                            SELLER ID
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                Seller ID *
                            </label>

                            <input
                                type="number"
                                name="sellerId"
                                value={
                                    product.sellerId
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter Seller ID"
                            />

                        </div>

                        {/* =================================================
                            CUSTOMER ID
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                Customer ID
                            </label>

                            <input
                                type="number"
                                name="customerId"
                                value={
                                    product.customerId
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter Customer ID"
                            />

                        </div>

                        {/* =================================================
                            SKU
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                SKU *
                            </label>

                            <input
                                type="text"
                                name="sku"
                                value={
                                    product.sku
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter SKU"
                            />

                        </div>

                        {/* =================================================
                            PRODUCT NAME
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="productName"
                                value={
                                    product.productName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter Product Name"
                            />

                        </div>

                        {/* =================================================
                            BRAND
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                Brand *
                            </label>

                            <select
                                name="brandId"
                                value={
                                    product.brandId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    masterLoading
                                }
                            >

                                <option value="">
                                    Select Brand
                                </option>

                                {brands.map(
                                    (brand) => {

                                        const brandId =
                                            brand.brandId ??
                                            brand.BrandId ??
                                            brand.id ??
                                            brand.Id;

                                        const brandName =
                                            brand.brandName ??
                                            brand.BrandName ??
                                            brand.name ??
                                            brand.Name ??
                                            `Brand ${brandId}`;

                                        return (

                                            <option
                                                key={
                                                    brandId
                                                }
                                                value={
                                                    brandId
                                                }
                                            >

                                                {
                                                    brandName
                                                }

                                            </option>

                                        );

                                    }
                                )}

                            </select>

                            {!masterLoading &&
                                brands.length === 0 && (

                                    <small>

                                        No brands found.

                                    </small>

                                )}

                        </div>

                        {/* =================================================
                            CATEGORY
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                Category *
                            </label>

                            <select
                                name="categoryId"
                                value={
                                    product.categoryId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    masterLoading
                                }
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    (category) => {

                                        const categoryId =
                                            category.categoryId ??
                                            category.CategoryId ??
                                            category.id ??
                                            category.Id;

                                        const categoryName =
                                            category.categoryName ??
                                            category.CategoryName ??
                                            category.name ??
                                            category.Name ??
                                            `Category ${categoryId}`;

                                        return (

                                            <option
                                                key={
                                                    categoryId
                                                }
                                                value={
                                                    categoryId
                                                }
                                            >

                                                {
                                                    categoryName
                                                }

                                            </option>

                                        );

                                    }
                                )}

                            </select>

                        </div>

                        {/* =================================================
                            PRODUCT TYPE
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                Product Type *
                            </label>

                            <select
                                name="productTypeId"
                                value={
                                    product.productTypeId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    masterLoading
                                }
                            >

                                <option value="">
                                    Select Product Type
                                </option>

                                {productTypes.map(
                                    (type) => {

                                        const typeId =
                                            type.productTypeId ??
                                            type.ProductTypeId ??
                                            type.id ??
                                            type.Id;

                                        const typeName =
                                            type.productTypeName ??
                                            type.ProductTypeName ??
                                            type.name ??
                                            type.Name ??
                                            `Product Type ${typeId}`;

                                        return (

                                            <option
                                                key={
                                                    typeId
                                                }
                                                value={
                                                    typeId
                                                }
                                            >

                                                {
                                                    typeName
                                                }

                                            </option>

                                        );

                                    }
                                )}

                            </select>

                        </div>

                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div
                            className="form-group"
                        >

                            <label>
                                Status
                            </label>

                            <select
                                name="isActive"
                                value={
                                    product.isActive
                                        ? "true"
                                        : "false"
                                }
                                onChange={(
                                    event
                                ) => {

                                    setProduct(
                                        (previous) => ({

                                            ...previous,

                                            isActive:
                                                event
                                                    .target
                                                    .value ===
                                                "true",

                                        })
                                    );

                                    setError("");

                                    setSuccess("");

                                }}
                            >

                                <option value="true">
                                    Active
                                </option>

                                <option value="false">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <div
                        className="form-group full-width"
                    >

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                product.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter product description"
                            rows="5"
                        />

                    </div>

                    {/* =================================================
                        BUTTONS
                    ================================================== */}

                    <div
                        className="form-actions"
                    >

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                saving
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                            disabled={
                                saving ||
                                masterLoading
                            }
                        >

                            {saving

                                ? "Saving..."

                                : isEditMode
                                    ? "Update Product"
                                    : "Create Product"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProductForm;
