import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    Alert,
    Box,
    Snackbar
} from "@mui/material";

import WishlistItemToolbar
    from "./WishlistItemToolbar";

import WishlistItemStatistics
    from "./WishlistItemStatistics";

import WishlistItemTable
    from "./WishlistItemTable";

import WishlistItemPagination
    from "./WishlistItemPagination";


// ============================================================
// API
// ============================================================

const API_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const WishlistItemList = () => {

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [wishlistItems, setWishlistItems] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [sortBy, setSortBy] =
        useState("wishlistItemId");

    const [sortOrder, setSortOrder] =
        useState("desc");

    const [page, setPage] =
        useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);


    // ========================================================
    // LOAD WISHLIST ITEMS
    // ========================================================

    const loadWishlistItems = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "GET ALL WISHLIST ITEMS"
                );

                const response = await axios.get(
                    `${API_URL}/api/WishlistItem`,
                    {
                        timeout: 30000
                    }
                );

                console.log(
                    "WISHLIST ITEMS RESPONSE:",
                    response.data
                );


                // ASP.NET currently returns:
                //
                // [
                //   {
                //      wishlistItemId: 2,
                //      wishlistId: 2,
                //      sellerId: 6,
                //      customerId: 3,
                //      productId: 6
                //   }
                // ]

                let data = [];

                if (Array.isArray(response.data)) {

                    data = response.data;

                } else if (
                    Array.isArray(response.data?.data)
                ) {

                    data = response.data.data;

                } else if (
                    Array.isArray(response.data?.items)
                ) {

                    data = response.data.items;

                } else if (
                    Array.isArray(response.data?.wishlistItems)
                ) {

                    data = response.data.wishlistItems;

                }


                const normalizedData = data.map(
                    (item) => ({
                        ...item,

                        wishlistItemId:
                            Number(
                                item.wishlistItemId ??
                                item.WishlistItemId ??
                                0
                            ),

                        wishlistId:
                            Number(
                                item.wishlistId ??
                                item.WishlistId ??
                                0
                            ),

                        sellerId:
                            Number(
                                item.sellerId ??
                                item.SellerId ??
                                0
                            ),

                        customerId:
                            Number(
                                item.customerId ??
                                item.CustomerId ??
                                0
                            ),

                        productId:
                            Number(
                                item.productId ??
                                item.ProductId ??
                                0
                            )
                    })
                );


                console.log(
                    "NORMALIZED WISHLIST ITEMS:",
                    normalizedData
                );

                setWishlistItems(
                    normalizedData
                );

                setPage(1);

            } catch (err) {

                console.error(
                    "GET ALL WISHLIST ITEMS ERROR:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Failed to load wishlist items."
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadWishlistItems();

    }, [
        loadWishlistItems
    ]);


    // ========================================================
    // SEARCH
    // ========================================================

    const filteredWishlistItems =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            if (!searchValue) {

                return wishlistItems;

            }

            return wishlistItems.filter(
                (item) => {

                    const searchableText = [

                        item.wishlistItemId,

                        item.wishlistId,

                        item.sellerId,

                        item.customerId,

                        item.productId

                    ]
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(
                        searchValue
                    );
                }
            );

        }, [
            wishlistItems,
            search
        ]);


    // ========================================================
    // SORT
    // ========================================================

    const sortedWishlistItems =
        useMemo(() => {

            const data = [
                ...filteredWishlistItems
            ];

            data.sort(
                (a, b) => {

                    const aValue =
                        a?.[sortBy];

                    const bValue =
                        b?.[sortBy];

                    if (
                        aValue === null ||
                        aValue === undefined
                    ) {
                        return 1;
                    }

                    if (
                        bValue === null ||
                        bValue === undefined
                    ) {
                        return -1;
                    }


                    const numericA =
                        Number(aValue);

                    const numericB =
                        Number(bValue);


                    let comparison;

                    if (
                        !Number.isNaN(numericA) &&
                        !Number.isNaN(numericB)
                    ) {

                        comparison =
                            numericA - numericB;

                    } else {

                        comparison =
                            String(aValue)
                                .localeCompare(
                                    String(bValue)
                                );

                    }


                    return sortOrder === "asc"
                        ? comparison
                        : -comparison;
                }
            );

            return data;

        }, [
            filteredWishlistItems,
            sortBy,
            sortOrder
        ]);


    // ========================================================
    // PAGINATION
    // ========================================================

    const totalItems =
        sortedWishlistItems.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalItems /
                rowsPerPage
            )
        );


    useEffect(() => {

        if (page > totalPages) {

            setPage(totalPages);

        }

    }, [
        page,
        totalPages
    ]);


    const paginatedWishlistItems =
        useMemo(() => {

            const startIndex =
                (page - 1) *
                rowsPerPage;

            const endIndex =
                startIndex +
                rowsPerPage;

            return sortedWishlistItems.slice(
                startIndex,
                endIndex
            );

        }, [
            sortedWishlistItems,
            page,
            rowsPerPage
        ]);


    // ========================================================
    // VIEW
    // ========================================================

    const handleView = useCallback(
        (itemOrId) => {

            const id =
                typeof itemOrId === "object"
                    ? (
                        itemOrId?.wishlistItemId ??
                        itemOrId?.WishlistItemId ??
                        itemOrId?.id
                    )
                    : itemOrId;


            const numericId =
                Number(id);


            if (
                !Number.isInteger(numericId) ||
                numericId <= 0
            ) {

                setError(
                    "Invalid wishlist item ID."
                );

                return;
            }


            navigate(
                `/wishlist-items/details/${numericId}`
            );

        },
        [
            navigate
        ]
    );


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = useCallback(
        (itemOrId) => {

            const id =
                typeof itemOrId === "object"
                    ? (
                        itemOrId?.wishlistItemId ??
                        itemOrId?.WishlistItemId ??
                        itemOrId?.id
                    )
                    : itemOrId;


            const numericId =
                Number(id);


            if (
                !Number.isInteger(numericId) ||
                numericId <= 0
            ) {

                setError(
                    "Invalid wishlist item ID."
                );

                return;
            }


            navigate(
                `/wishlist-items/edit/${numericId}`
            );

        },
        [
            navigate
        ]
    );


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = useCallback(
        async (itemOrId) => {

            const id =
                typeof itemOrId === "object"
                    ? (
                        itemOrId?.wishlistItemId ??
                        itemOrId?.WishlistItemId ??
                        itemOrId?.id
                    )
                    : itemOrId;


            const numericId =
                Number(id);


            if (
                !Number.isInteger(numericId) ||
                numericId <= 0
            ) {

                setError(
                    "Invalid wishlist item ID."
                );

                return;
            }


            const confirmed =
                window.confirm(
                    `Are you sure you want to delete Wishlist Item ${numericId}?`
                );


            if (!confirmed) {

                return;
            }


            try {

                setError("");

                console.log(
                    "DELETE WISHLIST ITEM:",
                    numericId
                );


                await axios.delete(
                    `${API_URL}/api/WishlistItem/${numericId}`,
                    {
                        timeout: 30000
                    }
                );


                setSuccess(
                    "Wishlist item deleted successfully."
                );


                await loadWishlistItems();

            } catch (err) {

                console.error(
                    "DELETE WISHLIST ITEM ERROR:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Failed to delete wishlist item."
                );

            }

        },
        [
            loadWishlistItems
        ]
    );


    // ========================================================
    // SEARCH HANDLER
    // ========================================================

    const handleSearch = useCallback(
        (value) => {

            setSearch(
                value ?? ""
            );

            setPage(1);

        },
        []
    );


    // ========================================================
    // SORT HANDLER
    // ========================================================

    const handleSort = useCallback(
        (field, order) => {

            setSortBy(
                field || "wishlistItemId"
            );

            setSortOrder(
                order || "desc"
            );

            setPage(1);

        },
        []
    );


    // ========================================================
    // PAGE HANDLER
    // ========================================================

    const handlePageChange = useCallback(
        (newPage) => {

            const numericPage =
                Number(newPage);


            if (
                Number.isInteger(numericPage) &&
                numericPage >= 1 &&
                numericPage <= totalPages
            ) {

                setPage(
                    numericPage
                );

            }

        },
        [
            totalPages
        ]
    );


    // ========================================================
    // ROWS PER PAGE
    // ========================================================

    const handleRowsPerPageChange =
        useCallback(
            (value) => {

                const numericValue =
                    Number(value);


                if (
                    Number.isInteger(
                        numericValue
                    ) &&
                    numericValue > 0
                ) {

                    setRowsPerPage(
                        numericValue
                    );

                    setPage(1);

                }

            },
            []
        );


    // ========================================================
    // CLOSE ERROR
    // ========================================================

    const handleCloseError =
        useCallback(() => {

            setError("");

        }, []);


    // ========================================================
    // CLOSE SUCCESS
    // ========================================================

    const handleCloseSuccess =
        useCallback(() => {

            setSuccess("");

        }, []);


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                width: "100%",
                p: 2
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <WishlistItemToolbar
                search={search}
                onSearch={handleSearch}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onCreate={() =>
                    navigate(
                        "/wishlist-items/create"
                    )
                }
                onRefresh={
                    loadWishlistItems
                }
                loading={loading}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <WishlistItemStatistics
                wishlistItems={
                    wishlistItems
                }
                items={
                    wishlistItems
                }
                loading={loading}
            />


            {/* =================================================
                TABLE
            ================================================= */}

            <WishlistItemTable
                items={
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


            {/* =================================================
                PAGINATION
            ================================================= */}

            <WishlistItemPagination
                page={page}
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                rowsPerPage={rowsPerPage}
                onPageChange={
                    handlePageChange
                }
                onRowsPerPageChange={
                    handleRowsPerPageChange
                }
            />


            {/* =================================================
                ERROR
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
                    onClose={
                        handleCloseError
                    }
                    sx={{
                        width: "100%"
                    }}
                >
                    {String(error)}
                </Alert>

            </Snackbar>


            {/* =================================================
                SUCCESS
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
                    onClose={
                        handleCloseSuccess
                    }
                    sx={{
                        width: "100%"
                    }}
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default WishlistItemList;
