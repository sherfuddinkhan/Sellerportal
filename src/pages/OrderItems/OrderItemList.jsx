import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Box
} from "@mui/material";

import OrderItemToolbar from "./OrderItemToolbar";
import OrderItemStatistics from "./OrderItemStatistics";
import OrderItemSearch from "./OrderItemSearch";
import OrderItemTable from "./OrderItemTable";
import OrderItemPagination from "./OrderItemPagination";
import OrderItemModal from "./OrderItemModal";
import OrderItemView from "./OrderItemView";
import DeleteOrderItemDialog from "./DeleteOrderItemDialog";


// =========================================================
// Node Server
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// Order Item List
// =========================================================

const OrderItemList = () => {

    // =====================================================
    // State
    // =====================================================

    const [orderItems, setOrderItems] = useState([]);

    const [filteredItems, setFilteredItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);


    // =====================================================
    // Load Order Items
    // =====================================================

    const loadOrderItems = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${SERVER_URL}/api/OrderItem`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setOrderItems(data);

            setFilteredItems(data);

        }

        catch (error) {

            console.error(
                "LOAD ORDER ITEMS ERROR:",
                error
            );

            setOrderItems([]);

            setFilteredItems([]);

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // Initial Load
    // =====================================================

    useEffect(() => {

        loadOrderItems();

    }, []);


    // =====================================================
    // Search / Filter
    // =====================================================

    useEffect(() => {

        let result = [
            ...orderItems
        ];


        if (searchText.trim() !== "") {

            const search =
                searchText
                    .toLowerCase()
                    .trim();


            result = result.filter((item) => {

                const orderId = String(
                    item.OrderId ??
                    item.orderId ??
                    ""
                ).toLowerCase();


                const productId = String(
                    item.ProductId ??
                    item.productId ??
                    ""
                ).toLowerCase();


                const sku = String(
                    item.Sku ??
                    item.sku ??
                    ""
                ).toLowerCase();


                return (
                    orderId.includes(search) ||
                    productId.includes(search) ||
                    sku.includes(search)
                );

            });

        }


        setFilteredItems(result);

        setPage(1);

    }, [
        orderItems,
        searchText
    ]);


    // =====================================================
    // Pagination
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredItems.length / pageSize
        )
    );


    const pagedItems = filteredItems.slice(
        (page - 1) * pageSize,
        page * pageSize
    );


    // =====================================================
    // Save Order Item
    // =====================================================

    const handleSave = async (data) => {

        try {

            const orderItemId =
                data.OrderItemId ??
                data.orderItemId;


            // ---------------------------------------------
            // UPDATE
            // ---------------------------------------------

            if (orderItemId) {

                await axios.put(
                    `${SERVER_URL}/api/OrderItem/${orderItemId}`,
                    data
                );

            }

            // ---------------------------------------------
            // CREATE
            // ---------------------------------------------

            else {

                await axios.post(
                    `${SERVER_URL}/api/OrderItem`,
                    data
                );

            }


            // Reload data

            await loadOrderItems();


            // Close modal

            setModalOpen(false);

            setSelectedItem(null);

        }

        catch (error) {

            console.error(
                "SAVE ORDER ITEM ERROR:",
                error
            );

        }

    };


    // =====================================================
    // Delete Order Item
    // =====================================================

    const handleDelete = async (id) => {

        try {

            await axios.delete(
                `${SERVER_URL}/api/OrderItem/${id}`
            );


            // Reload data

            await loadOrderItems();


            // Close delete dialog

            setDeleteOpen(false);

            setSelectedItem(null);

        }

        catch (error) {

            console.error(
                "DELETE ORDER ITEM ERROR:",
                error
            );

        }

    };


    // =====================================================
    // Render
    // =====================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =================================================
                Toolbar
            ================================================= */}

            <OrderItemToolbar

                onAdd={() => {

                    setSelectedItem(null);

                    setModalOpen(true);

                }}

                onRefresh={loadOrderItems}

                onExport={() => {

                    console.log(
                        "Export Order Items"
                    );

                }}

            />


            {/* =================================================
                Statistics
            ================================================= */}

            <OrderItemStatistics
                items={orderItems}
            />


            {/* =================================================
                Search
            ================================================= */}

            <OrderItemSearch

                searchText={searchText}

                setSearchText={setSearchText}

            />


            {/* =================================================
                Table
            ================================================= */}

            <OrderItemTable

                items={pagedItems}

                loading={loading}


                onView={(row) => {

                    setSelectedItem(row);

                    setViewOpen(true);

                }}


                onEdit={(row) => {

                    setSelectedItem(row);

                    setModalOpen(true);

                }}


                onDelete={(row) => {

                    setSelectedItem(row);

                    setDeleteOpen(true);

                }}

            />


            {/* =================================================
                Pagination
            ================================================= */}

            <OrderItemPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredItems.length
                }


                onPageChange={setPage}


                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />


            {/* =================================================
                Add / Edit Modal
            ================================================= */}

            <OrderItemModal

                open={modalOpen}

                item={selectedItem}


                onClose={() => {

                    setModalOpen(false);

                    setSelectedItem(null);

                }}


                onSave={handleSave}

            />


            {/* =================================================
                View Dialog
            ================================================= */}

            <OrderItemView

                open={viewOpen}

                item={selectedItem}


                onClose={() => {

                    setViewOpen(false);

                    setSelectedItem(null);

                }}

            />


            {/* =================================================
                Delete Dialog
            ================================================= */}

            <DeleteOrderItemDialog

                open={deleteOpen}

                item={selectedItem}


                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedItem(null);

                }}


                onDeleted={handleDelete}

            />

        </Box>

    );

};


export default OrderItemList;
