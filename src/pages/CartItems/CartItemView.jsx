import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";

import CartItemToolbar from "./CartItemToolbar";
import CartItemSearch from "./CartItemSearch";
import CartItemStatistics from "./CartItemStatistics";
import CartItemList from "./CartItemList";
import CartItemModal from "./CartItemModal";
import CartItemPagination from "./CartItemPagination";
import DeleteCartItemDialog from "./DeleteCartItemDialog";

import {
  getCartItems,
  deleteCartItem,
} from "./cartItemService";

import {
  filterCartItems,
  calculateCartItemStatistics,
} from "./cartItemHelpers";

import "./CartItems.css";

const CartItemView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [selectedItem, setSelectedItem] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadCartItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCartItems();

      const records =
        response?.data?.records ||
        response?.data ||
        response?.records ||
        response ||
        [];

      setCartItems(
        Array.isArray(records)
          ? records
          : []
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load cart items."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const filteredItems = useMemo(() => {
    return filterCartItems(
      cartItems,
      search
    );
  }, [cartItems, search]);

  const statistics = useMemo(() => {
    return calculateCartItemStatistics(
      cartItems
    );
  }, [cartItems]);

  const paginatedItems = useMemo(() => {
    const start =
      page * pageSize;

    return filteredItems.slice(
      start,
      start + pageSize
    );
  }, [
    filteredItems,
    page,
    pageSize,
  ]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      setDeleteLoading(true);

      await deleteCartItem(
        selectedItem.cartItemId ||
          selectedItem.id
      );

      setDeleteOpen(false);
      setSelectedItem(null);

      await loadCartItems();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete cart item."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box className="cart-items-page">
      <CartItemToolbar
        onRefresh={loadCartItems}
        loading={loading}
      />

      <Stack spacing={2}>
        <CartItemSearch
          value={search}
          onChange={handleSearch}
        />

        <CartItemStatistics
          statistics={statistics}
        />

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            className="cart-items-loading"
          >
            <CircularProgress />
          </Box>
        ) : (
          <CartItemList
            items={paginatedItems}
            onView={handleView}
            onDelete={handleDeleteClick}
          />
        )}

        <CartItemPagination
          page={page}
          pageSize={pageSize}
          totalItems={
            filteredItems.length
          }
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(0);
          }}
        />
      </Stack>

      <CartItemModal
        open={modalOpen}
        item={selectedItem}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
      />

      <DeleteCartItemDialog
        open={deleteOpen}
        item={selectedItem}
        loading={deleteLoading}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteOpen(false);
            setSelectedItem(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default CartItemView;