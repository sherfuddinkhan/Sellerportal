import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Box,
    Alert,
    Snackbar
} from "@mui/material";

import ShipmentToolbar from "./ShipmentToolbar";
import ShipmentStatistics from "./ShipmentStatistics";
import ShipmentSearch from "./ShipmentSearch";
import ShipmentTable from "./ShipmentTable";
import ShipmentPagination from "./ShipmentPagination";
import ShipmentView from "./ShipmentView";
import DeleteShipmentDialog from "./DeleteShipmentDialog";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL =
    "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const ShipmentList = () => {

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        shipments,
        setShipments
    ] = useState([]);


    const [
        filteredShipments,
        setFilteredShipments
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        searchText,
        setSearchText
    ] = useState("");


    const [
        selectedShipment,
        setSelectedShipment
    ] = useState(null);


    const [
        viewOpen,
        setViewOpen
    ] = useState(false);


    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);


    const [
        page,
        setPage
    ] = useState(1);


    const [
        pageSize,
        setPageSize
    ] = useState(10);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    // =====================================================
    // GET SHIPMENT ID
    // =====================================================

    const getShipmentId = (shipment) => {

        return (
            shipment?.shipmentId ??
            shipment?.ShipmentId ??
            null
        );

    };


    // =====================================================
    // LOAD SHIPMENTS
    //
    // React:
    // GET http://localhost:5000/api/shipments
    //
    // Node:
    // GET https://localhost:7203/api/Shipment
    // =====================================================

    const loadShipments = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await fetch(
                    `${SERVER_URL}/api/shipments`
                );


            if (!response.ok) {

                let message =
                    `HTTP ${response.status}`;


                try {

                    const data =
                        await response.json();

                    message =
                        data?.message ||
                        data?.title ||
                        message;

                }
                catch {

                    // Ignore JSON parsing error

                }


                throw new Error(
                    message
                );

            }


            const data =
                await response.json();


            const shipmentData =
                Array.isArray(data)
                    ? data
                    : [];


            setShipments(
                shipmentData
            );

            setFilteredShipments(
                shipmentData
            );

        }
        catch (error) {

            console.error(
                "Load Shipments Error:",
                error
            );


            setError(
                error?.message ||
                "Failed to load shipments."
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

        loadShipments();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    useEffect(() => {

        const search =
            searchText
                .trim()
                .toLowerCase();


        if (!search) {

            setFilteredShipments(
                shipments
            );

            setPage(1);

            return;

        }


        const result =
            shipments.filter(
                (item) => {

                    const shipmentId =
                        String(
                            item.shipmentId ??
                            item.ShipmentId ??
                            ""
                        )
                            .toLowerCase();


                    const sellerId =
                        String(
                            item.sellerId ??
                            item.SellerId ??
                            ""
                        )
                            .toLowerCase();


                    const customerId =
                        String(
                            item.customerId ??
                            item.CustomerId ??
                            ""
                        )
                            .toLowerCase();


                    const orderId =
                        String(
                            item.orderId ??
                            item.OrderId ??
                            ""
                        )
                            .toLowerCase();


                    const courierName =
                        String(
                            item.courierName ??
                            item.CourierName ??
                            ""
                        )
                            .toLowerCase();


                    const trackingNumber =
                        String(
                            item.trackingNumber ??
                            item.TrackingNumber ??
                            ""
                        )
                            .toLowerCase();


                    const shipmentDate =
                        String(
                            item.shipmentDate ??
                            item.ShipmentDate ??
                            ""
                        )
                            .toLowerCase();


                    const deliveryDate =
                        String(
                            item.deliveryDate ??
                            item.DeliveryDate ??
                            ""
                        )
                            .toLowerCase();


                    const shipmentStatus =
                        String(
                            item.shipmentStatus ??
                            item.ShipmentStatus ??
                            ""
                        )
                            .toLowerCase();


                    return (

                        shipmentId.includes(search)

                        ||

                        sellerId.includes(search)

                        ||

                        customerId.includes(search)

                        ||

                        orderId.includes(search)

                        ||

                        courierName.includes(search)

                        ||

                        trackingNumber.includes(search)

                        ||

                        shipmentDate.includes(search)

                        ||

                        deliveryDate.includes(search)

                        ||

                        shipmentStatus.includes(search)

                    );

                }
            );


        setFilteredShipments(
            result
        );

        setPage(1);


    }, [
        shipments,
        searchText
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredShipments.length /
                pageSize
            )
        );


    const pagedShipments =
        filteredShipments.slice(
            (page - 1) *
                pageSize,

            page *
                pageSize
        );


    // =====================================================
    // CREATE
    // =====================================================

    const handleCreate = () => {

        navigate(
            "/shipments/create"
        );

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (row) => {

        const id =
            getShipmentId(row);


        if (
            !id ||
            String(id) === ":id"
        ) {

            setError(
                "Invalid Shipment ID."
            );

            return;

        }


        /*
         * ShipmentView can be used as a route page.
         *
         * Navigate directly to:
         * /shipments/:id
         */

        navigate(
            `/shipments/${id}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (row) => {

        const id =
            getShipmentId(row);


        if (
            !id ||
            String(id) === ":id"
        ) {

            setError(
                "Invalid Shipment ID."
            );

            return;

        }


        navigate(
            `/shipments/edit/${id}`
        );

    };


    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick = (row) => {

        setSelectedShipment(
            row
        );

        setDeleteOpen(
            true
        );

    };


    // =====================================================
    // DELETE SHIPMENT
    //
    // DELETE:
    // http://localhost:5000/api/shipments/:id
    // =====================================================

    const handleDelete = async (id) => {

        try {

            setError("");


            if (
                !id ||
                String(id) === ":id"
            ) {

                throw new Error(
                    "Invalid Shipment ID."
                );

            }


            const response =
                await fetch(
                    `${SERVER_URL}/api/shipments/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                let message =
                    `HTTP ${response.status}`;


                try {

                    const data =
                        await response.json();

                    message =
                        data?.message ||
                        data?.title ||
                        message;

                }
                catch {

                    // Ignore JSON parsing error

                }


                throw new Error(
                    message
                );

            }


            setSuccess(
                "Shipment deleted successfully."
            );


            setDeleteOpen(
                false
            );

            setSelectedShipment(
                null
            );


            await loadShipments();

        }
        catch (error) {

            console.error(
                "Delete Shipment Error:",
                error
            );


            setError(
                error?.message ||
                "Failed to delete shipment."
            );

        }

    };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const handleDeleteClose = () => {

        setDeleteOpen(
            false
        );

        setSelectedShipment(
            null
        );

    };


    // =====================================================
    // EXPORT
    // =====================================================

    const handleExport = () => {

        try {

            const headers = [

                "Shipment ID",

                "Seller ID",

                "Customer ID",

                "Order ID",

                "Courier",

                "Tracking Number",

                "Shipment Date",

                "Delivery Date",

                "Status"

            ];


            const rows =
                filteredShipments.map(
                    (item) => [

                        item.shipmentId ??
                        item.ShipmentId ??
                        "",


                        item.sellerId ??
                        item.SellerId ??
                        "",


                        item.customerId ??
                        item.CustomerId ??
                        "",


                        item.orderId ??
                        item.OrderId ??
                        "",


                        item.courierName ??
                        item.CourierName ??
                        "",


                        item.trackingNumber ??
                        item.TrackingNumber ??
                        "",


                        item.shipmentDate ??
                        item.ShipmentDate ??
                        "",


                        item.deliveryDate ??
                        item.DeliveryDate ??
                        "",


                        item.shipmentStatus ??
                        item.ShipmentStatus ??
                        ""

                    ]
                );


            const csv = [

                headers,

                ...rows

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


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "shipments.csv";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        }
        catch (error) {

            console.error(
                "Export Shipment Error:",
                error
            );


            setError(
                "Failed to export shipments."
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
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                    onClose={() =>
                        setError("")
                    }
                >

                    {error}

                </Alert>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ShipmentToolbar

                onAdd={
                    handleCreate
                }

                onRefresh={
                    loadShipments
                }

                onExport={
                    handleExport
                }

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <ShipmentStatistics
                shipments={
                    shipments
                }
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <ShipmentSearch

                searchText={
                    searchText
                }

                setSearchText={
                    setSearchText
                }

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <ShipmentTable

                items={
                    pagedShipments
                }

                loading={
                    loading
                }

                onView={
                    handleView
                }

                onEdit={
                    handleEdit
                }

                onDelete={
                    handleDeleteClick
                }

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <ShipmentPagination

                page={
                    page
                }

                totalPages={
                    totalPages
                }

                pageSize={
                    pageSize
                }

                totalRecords={
                    filteredShipments.length
                }

                onPageChange={
                    setPage
                }

                onPageSizeChange={
                    (size) => {

                        setPageSize(
                            size
                        );

                        setPage(
                            1
                        );

                    }
                }

            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteShipmentDialog

                open={
                    deleteOpen
                }

                item={
                    selectedShipment
                }

                onClose={
                    handleDeleteClose
                }

                onDeleted={
                    handleDelete
                }

            />


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar

                open={
                    Boolean(success)
                }

                autoHideDuration={
                    3000
                }

                onClose={() =>
                    setSuccess("")
                }

                message={
                    success
                }

            />

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ShipmentList;
