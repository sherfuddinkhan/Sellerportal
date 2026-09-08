import React, {
    useEffect,
    useState
} from "react";

import {
    Box
} from "@mui/material";

import axios from "axios";

import OrderToolbar from "./OrderToolbar";
import OrderStatistics from "./OrderStatistics";
import OrderSearch from "./OrderSearch";
import OrderTable from "./OrderTable";
import OrderPagination from "./OrderPagination";
import OrderModal from "./OrderModal";
import OrderView from "./OrderView";
import DeleteOrderDialog from "./DeleteOrderDialog";


// =========================================================
// CONFIG
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const OrderList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [orders, setOrders] = useState([]);

    const [filteredOrders, setFilteredOrders] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);


    // =====================================================
    // LOAD ORDERS
    // =====================================================

    const loadOrders = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${SERVER_URL}/api/Order`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setOrders(data);

            setFilteredOrders(data);

        }
        catch (error) {

            console.error(
                "Load Orders Error:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadOrders();

    }, []);


    // =====================================================
    // SEARCH & FILTER
    // =====================================================

    useEffect(() => {

        let result = [...orders];


        // ---------------------------------------------
        // SEARCH
        // ---------------------------------------------

        if (searchText.trim() !== "") {

            const search =
                searchText
                    .toLowerCase()
                    .trim();


            result = result.filter(item =>

                item.OrderNumber
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.orderNumber
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.OrderStatus
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.orderStatus
                    ?.toLowerCase()
                    .includes(search)

            );

        }


        // ---------------------------------------------
        // STATUS FILTER
        // ---------------------------------------------

        if (statusFilter !== "All") {

            result = result.filter(item =>

                (
                    item.OrderStatus ??
                    item.orderStatus
                ) === statusFilter

            );

        }


        setFilteredOrders(result);

        setPage(1);

    }, [
        orders,
        searchText,
        statusFilter
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        filteredOrders.length / pageSize
    );


    const pagedOrders = filteredOrders.slice(

        (page - 1) * pageSize,

        page * pageSize

    );


    // =====================================================
    // SAVE ORDER
    // =====================================================

    const handleSave = async (data) => {

        try {

            if (data.OrderId || data.orderId) {

                const id =
                    data.OrderId ??
                    data.orderId;


                await axios.put(

                    `${SERVER_URL}/api/Order/${id}`,

                    data

                );

            }
            else {

                await axios.post(

                    `${SERVER_URL}/api/Order`,

                    data

                );

            }


            await loadOrders();


            setModalOpen(false);

            setSelectedOrder(null);

        }
        catch (error) {

            console.error(
                "Save Order Error:",
                error
            );

        }

    };


    // =====================================================
    // DELETE ORDER
    // =====================================================

    const handleDelete = async (id) => {

        try {

            await axios.delete(

                `${SERVER_URL}/api/Order/${id}`

            );


            await loadOrders();


            setDeleteOpen(false);

            setSelectedOrder(null);

        }
        catch (error) {

            console.error(
                "Delete Order Error:",
                error
            );

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <OrderToolbar

                onAdd={() => {

                    setSelectedOrder(null);

                    setModalOpen(true);

                }}

                onRefresh={loadOrders}

                onExport={() => {

                    console.log(
                        "Export Orders"
                    );

                }}

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <OrderStatistics
                orders={orders}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <OrderSearch

                searchText={searchText}

                setSearchText={setSearchText}

                statusFilter={statusFilter}

                setStatusFilter={setStatusFilter}

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <OrderTable

                orders={pagedOrders}

                loading={loading}

                onView={(row) => {

                    setSelectedOrder(row);

                    setViewOpen(true);

                }}

                onEdit={(row) => {

                    setSelectedOrder(row);

                    setModalOpen(true);

                }}

                onDelete={(row) => {

                    setSelectedOrder(row);

                    setDeleteOpen(true);

                }}

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <OrderPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredOrders.length
                }

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            <OrderModal

                open={modalOpen}

                order={selectedOrder}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedOrder(null);

                }}

                onSave={handleSave}

            />


            {/* =================================================
                VIEW
            ================================================= */}

            <OrderView

                open={viewOpen}

                order={selectedOrder}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedOrder(null);

                }}

            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteOrderDialog

                open={deleteOpen}

                order={selectedOrder}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedOrder(null);

                }}

                onDeleted={handleDelete}

            />

        </Box>

    );

};


export default OrderList;