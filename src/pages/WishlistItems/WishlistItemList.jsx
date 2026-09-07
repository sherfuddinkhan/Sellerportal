
import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import WishlistItemToolbar from "./WishlistItemToolbar";
import WishlistItemStatistics from "./WishlistItemStatistics";
import WishlistItemTable from "./WishlistItemTable";
import WishlistItemPagination from "./WishlistItemPagination";


// =========================================================
// NODE SERVER / PROXY URL
// =========================================================

const API_URL = "http://localhost:5000/api";


// =========================================================
// WISHLIST ITEM LIST
// =========================================================

const WishlistItemList = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [wishlistItems, setWishlistItems] =
        useState([]);

    const [filteredWishlistItems, setFilteredWishlistItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchText, setSearchText] =
        useState("");

    const [sort, setSort] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);


    // =====================================================
    // GET ALL WISHLIST ITEMS
    //
    // Node:
    // GET http://localhost:5000/api/WishlistItem
    //
    // Node forwards to:
    // GET https://localhost:7203/api/WishlistItem
    // =====================================================

    const loadWishlistItems = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "GET ALL WISHLIST ITEMS"
            );


            const response = await axios.get(
                `${API_URL}/WishlistItem`
            );


            console.log(
                "WISHLIST ITEM RESPONSE:",
                response.data
            );


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setWishlistItems(data);

            setFilteredWishlistItems(data);

        }

        catch (err) {

            console.error(
                "Wishlist item loading error:",
                err
            );


            console.error(
                "Wishlist item server response:",
                err.response?.data
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load wishlist items"
            );


            setWishlistItems([]);

            setFilteredWishlistItems([]);

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD WISHLIST ITEMS ON PAGE LOAD
    // =====================================================

    useEffect(() => {

        loadWishlistItems();

    }, []);


    // =====================================================
    // SEARCH + SORT
    // =====================================================

    useEffect(() => {

        let result =
            [...wishlistItems];


        // =================================================
        // SEARCH
        //
        // Searches all returned API fields
        // =================================================

        if (searchText.trim()) {

            const search =
                searchText
                    .toLowerCase()
                    .trim();


            result =
                result.filter(
                    (item) =>

                        Object.values(item)
                            .some(
                                (value) => {

                                    if (
                                        value === null ||
                                        value === undefined
                                    ) {
                                        return false;
                                    }


                                    // Do not search nested objects
                                    // such as wishlist/product
                                    if (
                                        typeof value ===
                                        "object"
                                    ) {
                                        return false;
                                    }


                                    return String(value)
                                        .toLowerCase()
                                        .includes(search);

                                }
                            )

                );

        }


        // =================================================
        // SORT
        // =================================================

        if (sort === "id_asc") {

            result.sort(
                (a, b) =>
                    Number(
                        a.wishlistItemId ??
                        a.WishlistItemId ??
                        0
                    ) -
                    Number(
                        b.wishlistItemId ??
                        b.WishlistItemId ??
                        0
                    )
            );

        }

        else if (sort === "id_desc") {

            result.sort(
                (a, b) =>
                    Number(
                        b.wishlistItemId ??
                        b.WishlistItemId ??
                        0
                    ) -
                    Number(
                        a.wishlistItemId ??
                        a.WishlistItemId ??
                        0
                    )
            );

        }

        else if (sort === "wishlist_asc") {

            result.sort(
                (a, b) =>
                    Number(
                        a.wishlistId ??
                        a.WishlistId ??
                        0
                    ) -
                    Number(
                        b.wishlistId ??
                        b.WishlistId ??
                        0
                    )
            );

        }

        else if (sort === "wishlist_desc") {

            result.sort(
                (a, b) =>
                    Number(
                        b.wishlistId ??
                        b.WishlistId ??
                        0
                    ) -
                    Number(
                        a.wishlistId ??
                        a.WishlistId ??
                        0
                    )
            );

        }

        else if (sort === "product_asc") {

            result.sort(
                (a, b) =>
                    Number(
                        a.productId ??
                        a.ProductId ??
                        0
                    ) -
                    Number(
                        b.productId ??
                        b.ProductId ??
                        0
                    )
            );

        }

        else if (sort === "product_desc") {

            result.sort(
                (a, b) =>
                    Number(
                        b.productId ??
                        b.ProductId ??
                        0
                    ) -
                    Number(
                        a.productId ??
                        a.ProductId ??
                        0
                    )
            );

        }

        else if (sort === "date_asc") {

            result.sort(
                (a, b) =>
                    new Date(
                        a.createdDate ??
                        a.CreatedDate ??
                        0
                    ) -
                    new Date(
                        b.createdDate ??
                        b.CreatedDate ??
                        0
                    )
            );

        }

        else if (sort === "date_desc") {

            result.sort(
                (a, b) =>
                    new Date(
                        b.createdDate ??
                        b.CreatedDate ??
                        0
                    ) -
                    new Date(
                        a.createdDate ??
                        a.CreatedDate ??
                        0
                    )
            );

        }


        setFilteredWishlistItems(result);

        setPage(1);

    }, [
        searchText,
        sort,
        wishlistItems
    ]);


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (wishlistItemId) => {

        console.log(
            "VIEW WISHLIST ITEM:",
            wishlistItemId
        );


        navigate(
            `/wishlist-items/details/${wishlistItemId}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (wishlistItemId) => {

        console.log(
            "EDIT WISHLIST ITEM:",
            wishlistItemId
        );


        navigate(
            `/wishlist-items/edit/${wishlistItemId}`
        );

    };


    // =====================================================
    // DELETE
    //
    // Node:
    // DELETE /api/WishlistItem/:id
    //
    // Node forwards to:
    // DELETE https://localhost:7203/api/WishlistItem/:id
    // =====================================================

    const handleDelete = async (
        wishlistItemId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this wishlist item?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");


            console.log(
                "DELETE WISHLIST ITEM:",
                wishlistItemId
            );


            await axios.delete(
                `${API_URL}/WishlistItem/${wishlistItemId}`
            );


            // Reload list after deletion

            await loadWishlistItems();

        }

        catch (err) {

            console.error(
                "Wishlist item delete error:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to delete wishlist item"
            );

        }

    };


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.ceil(
            filteredWishlistItems.length /
            rowsPerPage
        );


    const startIndex =
        (page - 1) *
        rowsPerPage;


    const paginatedWishlistItems =
        filteredWishlistItems.slice(
            startIndex,
            startIndex + rowsPerPage
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >

                <CircularProgress />

            </Box>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            className="wishlist-item-list"
            sx={{
                width: "100%"
            }}
        >

            {/* ============================================
                ERROR
            ============================================ */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >

                    {error}

                </Alert>

            )}


            {/* ============================================
                TOOLBAR
            ============================================ */}

            <WishlistItemToolbar

                searchText={
                    searchText
                }

                setSearchText={
                    setSearchText
                }

                sort={
                    sort
                }

                setSort={
                    setSort
                }

                onRefresh={
                    loadWishlistItems
                }

            />


            {/* ============================================
                STATISTICS
            ============================================ */}

            <WishlistItemStatistics
                wishlistItems={
                    wishlistItems
                }
            />


            {/* ============================================
                TABLE
            ============================================ */}

            <WishlistItemTable

                items={
                    paginatedWishlistItems
                }

                wishlistItems={
                    paginatedWishlistItems
                }

                onView={
                    handleView
                }

                onEdit={
                    handleEdit
                }

                onDelete={
                    handleDelete
                }

            />


            {/* ============================================
                PAGINATION
            ============================================ */}

            <WishlistItemPagination

                page={
                    page
                }

                setPage={
                    setPage
                }

                rowsPerPage={
                    rowsPerPage
                }

                setRowsPerPage={(value) => {

                    setRowsPerPage(
                        value
                    );

                    setPage(1);

                }}

                totalPages={
                    totalPages
                }

                totalItems={
                    filteredWishlistItems.length
                }

            />

        </Box>

    );

};


export default WishlistItemList;
