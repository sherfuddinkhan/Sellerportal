// =========================================================
// ProductForm.jsx
// Marketplace Seller Portal
// Create / Edit Product
// Uses Node.js server.js proxy
// =========================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductForm = () => {

    const navigate = useNavigate();

    // IMPORTANT:
    // App route should be:
    // /products/edit/:id
    //
    // Therefore we MUST use "id", not "productId".
    const { id } = useParams();

    const isEditMode = Boolean(id);

    // =========================================================
    // PRODUCT STATE
    // =========================================================

    const [product, setProduct] = useState({
        sellerId: "",
        customerId: "",
        sku: "",
        productName: "",
        description: "",
        brandId: "",
        categoryId: "",
        productTypeId: "",
        isActive: true,
    });

    // =========================================================
    // MASTER DATA
    // =========================================================

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);

    // =========================================================
    // UI STATE
    // =========================================================

    const [loading, setLoading] = useState(false);
    const [masterLoading, setMasterLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // DEBUG ROUTE PARAMETER
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
            "=========================================="
        );

    }, [id, isEditMode]);

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadMasterData();

        if (isEditMode) {
            loadProduct();
        }

    }, [id]);

    // =========================================================
    // LOAD MASTER DATA
    // =========================================================

    const loadMasterData = async () => {

        try {

            setMasterLoading(true);

            setError("");

            console.log(
                "Loading master data..."
            );

            const [
                brandsResponse,
                categoriesResponse,
                productTypesResponse
            ] = await Promise.all([

                // Node server.js
                axios.get(
                    `${SERVER_URL}/api/brand`
                ),

                // Node server.js
                axios.get(
                    `${SERVER_URL}/api/category`
                ),

                // Node server.js
                axios.get(
                    `${SERVER_URL}/api/producttype`
                )

            ]);

            console.log(
                "BRANDS:",
                brandsResponse.data
            );

            console.log(
                "CATEGORIES:",
                categoriesResponse.data
            );

            console.log(
                "PRODUCT TYPES:",
                productTypesResponse.data
            );

            setBrands(
                Array.isArray(brandsResponse.data)
                    ? brandsResponse.data
                    : []
            );

            setCategories(
                Array.isArray(categoriesResponse.data)
                    ? categoriesResponse.data
                    : []
            );

            setProductTypes(
                Array.isArray(productTypesResponse.data)
                    ? productTypesResponse.data
                    : []
            );

        }
        catch (err) {

            console.error(
                "MASTER DATA ERROR:",
                err
            );

            console.error(
                "MASTER DATA RESPONSE:",
                err.response?.data
            );

            setError(
                err.response?.data?.message ||
                "Unable to load brands, categories or product types."
            );

        }
        finally {

            setMasterLoading(false);

        }
    };

    // =========================================================
    // LOAD PRODUCT
    // =========================================================

   const loadProduct = async () => {

    try {

        setLoading(true);
        setError("");

        console.log("PRODUCT ID:", productId);

        const response = await axios.get(
            `${BASE_URL}/Product/${productId}`
        );

        console.log(
            "PRODUCT RESPONSE:",
            response.data
        );

        const data = response.data;

        setProduct({
            sellerId: data.sellerId ?? "",
            sku: data.sku ?? "",
            productName: data.productName ?? "",
            description: data.description ?? "",
            brandId: data.brandId ?? "",
            categoryId: data.categoryId ?? "",
            productTypeId: data.productTypeId ?? "",
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
            `Unable to load product. HTTP ${
                err.response?.status || "Unknown"
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

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setProduct(prev => ({
            ...prev,
            [name]: value
        }));

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

        if (!product.sku.trim()) {

            setError(
                "SKU is required."
            );

            return false;
        }

        if (!product.productName.trim()) {

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

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {

            setSaving(true);

            const payload = {

                sellerId:
                    Number(product.sellerId),

                customerId:
                    product.customerId
                        ? Number(product.customerId)
                        : null,

                sku:
                    product.sku.trim(),

                productName:
                    product.productName.trim(),

                description:
                    product.description.trim(),

                brandId:
                    Number(product.brandId),

                categoryId:
                    Number(product.categoryId),

                productTypeId:
                    Number(product.productTypeId),

                isActive:
                    product.isActive

            };

            console.log(
                "PRODUCT PAYLOAD:",
                payload
            );

            // =================================================
            // UPDATE
            // =================================================

            if (isEditMode) {

                console.log(
                    "UPDATING PRODUCT:",
                    id
                );

                await axios.put(

                    `${SERVER_URL}/api/Product/${encodeURIComponent(id)}`,

                    payload,

                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }

                );

                setSuccess(
                    "Product updated successfully."
                );

                setTimeout(() => {

                    navigate(
                        "/products"
                    );

                }, 1000);

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                console.log(
                    "CREATING PRODUCT"
                );

                await axios.post(

                    `${SERVER_URL}/api/Product`,

                    payload,

                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }

                );

                setSuccess(
                    "Product created successfully."
                );

                setProduct({

                    sellerId: "",
                    customerId: "",
                    sku: "",
                    productName: "",
                    description: "",
                    brandId: "",
                    categoryId: "",
                    productTypeId: "",
                    isActive: true,

                });

            }

        }
        catch (err) {

            console.error(
                "PRODUCT SAVE ERROR:",
                err
            );

            console.error(
                "SAVE RESPONSE:",
                err.response?.data
            );

            setError(

                err.response?.data?.message ||

                err.response?.data ||

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

        navigate(
            "/products"
        );

    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="product-form-container">

                <div className="product-form-card">

                    <h2>
                        Edit Product
                    </h2>

                    <p>
                        Loading Product ID: {id}
                    </p>

                </div>

            </div>

        );

    }

    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="product-form-container">

            <div className="product-form-card">

                {/* HEADER */}

                <div className="product-form-header">

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

                {/* ERROR */}

                {error && (

                    <div className="product-form-error">

                        {String(error)}

                    </div>

                )}

                {/* SUCCESS */}

                {success && (

                    <div className="product-form-success">

                        {success}

                    </div>

                )}

                {/* MASTER LOADING */}

                {masterLoading && (

                    <div>

                        Loading brands, categories
                        and product types...

                    </div>

                )}

                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        {/* SELLER ID */}

                        <div className="form-group">

                            <label>
                                Seller ID *
                            </label>

                            <input
                                type="number"
                                name="sellerId"
                                value={product.sellerId}
                                onChange={handleChange}
                                placeholder="Enter Seller ID"
                            />

                        </div>

                        {/* CUSTOMER ID */}

                        <div className="form-group">

                            <label>
                                Customer ID
                            </label>

                            <input
                                type="number"
                                name="customerId"
                                value={product.customerId}
                                onChange={handleChange}
                                placeholder="Enter Customer ID"
                            />

                        </div>

                        {/* SKU */}

                        <div className="form-group">

                            <label>
                                SKU *
                            </label>

                            <input
                                type="text"
                                name="sku"
                                value={product.sku}
                                onChange={handleChange}
                                placeholder="Enter SKU"
                            />

                        </div>

                        {/* PRODUCT NAME */}

                        <div className="form-group">

                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="productName"
                                value={product.productName}
                                onChange={handleChange}
                                placeholder="Enter Product Name"
                            />

                        </div>

                        {/* BRAND */}

                        <div className="form-group">

                            <label>
                                Brand *
                            </label>

                            <select
                                name="brandId"
                                value={product.brandId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Brand
                                </option>

                                {brands.map((brand) => (

                                    <option
                                        key={
                                            brand.brandId ??
                                            brand.BrandId
                                        }
                                        value={
                                            brand.brandId ??
                                            brand.BrandId
                                        }
                                    >
                                        {
                                            brand.brandName ??
                                            brand.BrandName
                                        }
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* CATEGORY */}

                        <div className="form-group">

                            <label>
                                Category *
                            </label>

                            <select
                                name="categoryId"
                                value={product.categoryId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map((category) => (

                                    <option
                                        key={
                                            category.categoryId ??
                                            category.CategoryId
                                        }
                                        value={
                                            category.categoryId ??
                                            category.CategoryId
                                        }
                                    >
                                        {
                                            category.categoryName ??
                                            category.CategoryName
                                        }
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* PRODUCT TYPE */}

                        <div className="form-group">

                            <label>
                                Product Type *
                            </label>

                            <select
                                name="productTypeId"
                                value={product.productTypeId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Product Type
                                </option>

                                {productTypes.map((type) => (

                                    <option
                                        key={
                                            type.productTypeId ??
                                            type.ProductTypeId
                                        }
                                        value={
                                            type.productTypeId ??
                                            type.ProductTypeId
                                        }
                                    >
                                        {
                                            type.productTypeName ??
                                            type.ProductTypeName
                                        }
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* STATUS */}

                        <div className="form-group">

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
                                onChange={(event) =>
                                    setProduct(prev => ({
                                        ...prev,
                                        isActive:
                                            event.target.value === "true"
                                    }))
                                }
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

                    {/* DESCRIPTION */}

                    <div className="form-group full-width">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows="5"
                        />

                    </div>

                    {/* BUTTONS */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                            disabled={saving}
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

export default ProductForm;
