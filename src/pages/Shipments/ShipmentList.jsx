// =========================================================
// ShipmentList.jsx
// Shipment Management
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

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
import ShipmentModal from "./ShipmentModal";
import ShipmentView from "./ShipmentView";
import DeleteShipmentDialog from "./DeleteShipmentDialog";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ShipmentList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [shipments, setShipments] = useState([]);

    const [filteredShipments, setFilteredShipments] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedShipment, setSelectedShipment] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD SHIPMENTS
    // GET /api/Shipment
    // =====================================================

    const loadShipments = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/Shipment`
            );

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }

            const data = await response.json();

            const shipmentData =
                Array.isArray(data)
                    ? data
                    : [];

            setShipments(shipmentData);

            setFilteredShipments(shipmentData);

        }
        catch (error) {

            console.error(
                "Load Shipments Error:",
                error
            );

            setError(
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

        let result = [
            ...shipments
        ];

        const search =
            searchText
                .trim()
                .toLowerCase();


        if (search !== "") {

            result =
                result.filter((item) => {

                    const shipmentId =
                        String(
                            item.shipmentId ??
                            item.ShipmentId ??
                            ""
                        );

                    const sellerId =
                        String(
                            item.sellerId ??
                            item.SellerId ??
                            ""
                        );

                    const customerId =
                        String(
                            item.customerId ??
                            item.CustomerId ??
                            ""
                        );

                    const orderId =
                        String(
                            item.orderId ??
                            item.OrderId ??
                            ""
                        );

                    const courierName =
                        String(
                            item.courierName ??
                            item.CourierName ??
                            ""
                        ).toLowerCase();

                    const trackingNumber =
                        String(
                            item.trackingNumber ??
                            item.TrackingNumber ??
                            ""
                        ).toLowerCase();

                    const shipmentStatus =
                        String(
                            item.shipmentStatus ??
                            item.ShipmentStatus ??
                            ""
                        ).toLowerCase();


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

                        shipmentStatus.includes(search)

                    );

                });

        }


        setFilteredShipments(result);

        setPage(1);

    }, [
        shipments,
        searchText
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredShipments.length /
            pageSize
        )
    );


    const pagedShipments =
        filteredShipments.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSave = async (data) => {

        try {

            setError("");

            const shipmentId =
                data.shipmentId ??
                data.ShipmentId ??
                0;


            // =================================================
            // UPDATE
            // =================================================

            if (shipmentId && shipmentId > 0) {

                const response =
                    await fetch(
                        `${SERVER_URL}/api/Shipment/${shipmentId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                ...data,
                                shipmentId: shipmentId
                            })
                        }
                    );


                if (!response.ok) {

                    const text =
                        await response.text();

                    throw new Error(
                        text ||
                        `HTTP ${response.status}`
                    );

                }


                setSuccess(
                    "Shipment updated successfully."
                );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const response =
                    await fetch(
                        `${SERVER_URL}/api/Shipment`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                shipmentId: 0,

                                sellerId:
                                    data.sellerId ??
                                    data.SellerId,

                                customerId:
                                    data.customerId ??
                                    data.CustomerId,

                                orderId:
                                    data.orderId ??
                                    data.OrderId,

                                courierName:
                                    data.courierName ??
                                    data.CourierName,

                                trackingNumber:
                                    data.trackingNumber ??
                                    data.TrackingNumber,

                                shipmentDate:
                                    data.shipmentDate ??
                                    data.ShipmentDate,

                                deliveryDate:
                                    data.deliveryDate ??
                                    data.DeliveryDate,

                                shipmentStatus:
                                    data.shipmentStatus ??
                                    data.ShipmentStatus

                            })
                        }
                    );


                if (!response.ok) {

                    const text =
                        await response.text();

                    throw new Error(
                        text ||
                        `HTTP ${response.status}`
                    );

                }


                setSuccess(
                    "Shipment created successfully."
                );

            }


            // =================================================
            // RELOAD
            // =================================================

            await loadShipments();

            setModalOpen(false);

            setSelectedShipment(null);

        }
        catch (error) {

            console.error(
                "Save Shipment Error:",
                error
            );

            setError(
                error.message ||
                "Failed to save shipment."
            );

        }

    };


    // =====================================================
    // DELETE
    // DELETE /api/Shipment/{id}
    // =====================================================

    const handleDelete = async (id) => {

        try {

            setError("");

            const response =
                await fetch(
                    `${SERVER_URL}/api/Shipment/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                const text =
                    await response.text();

                throw new Error(
                    text ||
                    `HTTP ${response.status}`
                );

            }


            setSuccess(
                "Shipment deleted successfully."
            );


            await loadShipments();

            setDeleteOpen(false);

            setSelectedShipment(null);

        }
        catch (error) {

            console.error(
                "Delete Shipment Error:",
                error
            );

            setError(
                error.message ||
                "Failed to delete shipment."
            );

        }

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (row) => {

        setSelectedShipment(row);

        setViewOpen(true);

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (row) => {

        setSelectedShipment(row);

        setModalOpen(true);

    };


    // =====================================================
    // DELETE DIALOG
    // =====================================================

    const handleDeleteClick = (row) => {

        setSelectedShipment(row);

        setDeleteOpen(true);

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleModalClose = () => {

        setModalOpen(false);

        setSelectedShipment(null);

    };


    // =====================================================
    // CLOSE VIEW
    // =====================================================

    const handleViewClose = () => {

        setViewOpen(false);

        setSelectedShipment(null);

    };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const handleDeleteClose = () => {

        setDeleteOpen(false);

        setSelectedShipment(null);

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
                    row =>
                        row
                            .map(
                                value =>
                                    `"${String(value)
                                        .replace(/"/g, '""')}"`
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
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "shipments.csv";


            link.click();

            URL.revokeObjectURL(url);

        }
        catch (error) {

            console.error(
                "Export Error:",
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

        <Box sx={{ p: 3 }}>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ShipmentToolbar

                onAdd={() => {

                    setSelectedShipment(null);

                    setModalOpen(true);

                }}

                onRefresh={loadShipments}

                onExport={handleExport}

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <ShipmentStatistics
                shipments={shipments}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <ShipmentSearch

                searchText={searchText}

                setSearchText={setSearchText}

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <ShipmentTable

                items={pagedShipments}

                loading={loading}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={handleDeleteClick}

            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            <ShipmentPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredShipments.length
                }

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <ShipmentModal

                open={modalOpen}

                item={selectedShipment}

                onClose={handleModalClose}

                onSave={handleSave}

            />


            {/* =================================================
                VIEW
            ================================================= */}

            <ShipmentView

                open={viewOpen}

                item={selectedShipment}

                onClose={handleViewClose}

            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteShipmentDialog

                open={deleteOpen}

                item={selectedShipment}

                onClose={handleDeleteClose}

                onDeleted={handleDelete}

            />


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar

                open={Boolean(success)}

                autoHideDuration={3000}

                onClose={() => setSuccess("")}

                message={success}

            />

        </Box>

    );

};

export default ShipmentList;