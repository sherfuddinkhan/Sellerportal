import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://localhost:7203/api";

const ProductForm = () => {

    const navigate = useNavigate();
    const { productId } = useParams();

    const isEditMode = Boolean(productId);

    // =========================================================
    // PRODUCT STATE
    // =========================================================

    const [product, setProduct] = useState({
        sellerId: "",
        sku: "",
        productName: "",
        description: "",
        brandId: "",
        categoryId: "",
        productTypeId: "",
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
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // LOAD MASTER DATA
    // =========================================================

    useEffect(() => {
        loadMasterData();

        if (isEditMode) {
            loadProduct();
        }
    }, [productId]);

    // =========================================================
    // LOAD BRANDS / CATEGORIES / PRODUCT TYPES
    // =========================================================

    const loadMasterData = async () => {

        try {

            const [
                brandsResponse,
                categoriesResponse,
                productTypesResponse
            ] = await Promise.all([
                axios.get(`${BASE_URL}/Brand`),
                axios.get(`${BASE_URL}/Category`),
                axios.get(`${BASE_URL}/ProductType`)
            ]);

            setBrands(brandsResponse.data || []);
            setCategories(categoriesResponse.data || []);
            setProductTypes(productTypesResponse.data || []);

        } catch (err) {

            console.error("Master data error:", err);

            setError(
                "Unable to load brands, categories or product types."
            );
        }
    };

    // =========================================================
    // LOAD PRODUCT FOR EDIT
    // =========================================================

    const loadProduct = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${BASE_URL}/Product/${productId}`
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

        } catch (err) {

            console.error("Product loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load product."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {

        if (!product.sellerId) {
            setError("Seller is required.");
            return false;
        }

        if (!product.sku.trim()) {
            setError("SKU is required.");
            return false;
        }

        if (!product.productName.trim()) {
            setError("Product name is required.");
            return false;
        }

        if (!product.brandId) {
            setError("Brand is required.");
            return false;
        }

        if (!product.categoryId) {
            setError("Category is required.");
            return false;
        }

        if (!product.productTypeId) {
            setError("Product type is required.");
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
                sellerId: Number(product.sellerId),
                sku: product.sku.trim(),
                productName: product.productName.trim(),
                description: product.description.trim(),
                brandId: Number(product.brandId),
                categoryId: Number(product.categoryId),
                productTypeId: Number(product.productTypeId)
            };

            if (isEditMode) {

                await axios.put(
                    `${BASE_URL}/Product/${productId}`,
                    payload
                );

                setSuccess("Product updated successfully.");

            } else {

                await axios.post(
                    `${BASE_URL}/Product`,
                    payload
                );

                setSuccess("Product created successfully.");

                setProduct({
                    sellerId: "",
                    sku: "",
                    productName: "",
                    description: "",
                    brandId: "",
                    categoryId: "",
                    productTypeId: "",
                });
            }

        } catch (err) {

            console.error("Product save error:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to save product."
            );

        } finally {

            setSaving(false);
        }
    };

    // =========================================================
    // CANCEL
    // =========================================================

    const handleCancel = () => {
        navigate("/products");
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="product-form-container">
                <div className="product-form-loading">
                    Loading product...
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

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="product-form-header">

                    <div>
                        <h2>
                            {isEditMode
                                ? "Edit Product"
                                : "Create Product"}
                        </h2>

                        <p>
                            {isEditMode
                                ? "Update product information"
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
                ================================================= */}

                {error && (
                    <div className="product-form-error">
                        {error}
                    </div>
                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div className="product-form-success">
                        {success}
                    </div>
                )}


                {/* =================================================
                    FORM
                ================================================= */}

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
                                placeholder="Enter product name"
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
                                        key={brand.brandId}
                                        value={brand.brandId}
                                    >
                                        {brand.brandName}
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
                                        key={category.categoryId}
                                        value={category.categoryId}
                                    >
                                        {category.categoryName}
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
                                        key={type.productTypeId}
                                        value={type.productTypeId}
                                    >
                                        {type.productTypeName}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

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


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

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

