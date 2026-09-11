import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import DeliveryChallanToolbar from "./DeliveryChallanToolbar";
import DeliveryChallanStatistics from "./DeliveryChallanStatistics";
import DeliveryChallanSearch from "./DeliveryChallanSearch";
import DeliveryChallanTable from "./DeliveryChallanTable";
import DeliveryChallanPagination from "./DeliveryChallanPagination";
import DeliveryChallanModal from "./DeliveryChallanModal";
import DeliveryChallanView from "./DeliveryChallanView";
import DeleteDeliveryChallanDialog from "./DeleteDeliveryChallanDialog";


const SERVER_URL = "http://localhost:5000";


const DeliveryChallanList = () => {

    // ==========================================================
    // STATE
    // ==========================================================

    const [deliveryChallans, setDeliveryChallans] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [
        selectedDeliveryChallan,
        setSelectedDeliveryChallan
    ] = useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    // ==========================================================
    // MESSAGE
    // ==========================================================

    const showMessage = (
        message,
        severity = "success"
    ) => {

        setSnackbar({
            open: true,
            message,
            severity
        });
    };


    const closeSnackbar = () => {

        setSnackbar(previous => ({
            ...previous,
            open: false
        }));
    };


    // ==========================================================
    // GET ALL
    // NODE:
    // GET /api/delivery-challans
    // ==========================================================

    const loadDeliveryChallans = async () => {

        try {

            setLoading(true);

            console.log(
                "================================================"
            );

            console.log(
                "GET /api/delivery-challans"
            );

            console.log(
                "================================================"
            );


            const response = await fetch(
                `${SERVER_URL}/api/delivery-challans`,
                {
                    method: "GET",
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );


            const data =
                await response
                    .json()
                    .catch(() => null);


            console.log(
                "GET DELIVERY CHALLANS RESPONSE:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to load delivery challans."
                );
            }


            const list =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];


            setDeliveryChallans(
                list
            );

        }
        catch (error) {

            console.error(
                "LOAD DELIVERY CHALLANS ERROR:",
                error
            );

            setDeliveryChallans([]);

            showMessage(
                error.message ||
                "Failed to load delivery challans.",
                "error"
            );

        }
        finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        loadDeliveryChallans();

    }, []);


    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredDeliveryChallans =
        useMemo(() => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();


            if (!search) {

                return deliveryChallans;
            }


            return deliveryChallans.filter(
                item => {

                    const values = [

                        item.DeliveryChallanId,
                        item.deliveryChallanId,

                        item.SalesOrderId,
                        item.salesOrderId,

                        item.ChallanNumber,
                        item.challanNumber,

                        item.VehicleNumber,
                        item.vehicleNumber,

                        item.DriverName,
                        item.driverName,

                        item.DriverMobile,
                        item.driverMobile,

                        item.TransporterName,
                        item.transporterName,

                        item.Status,
                        item.status
                    ];


                    return values.some(
                        value =>
                            String(
                                value ?? ""
                            )
                                .toLowerCase()
                                .includes(search)
                    );
                }
            );

        }, [
            deliveryChallans,
            searchText
        ]);


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const statistics =
        useMemo(() => {

            return {

                totalDeliveryChallans:
                    deliveryChallans.length,

                delivered:
                    deliveryChallans.filter(
                        item =>
                            String(
                                item.Status ??
                                item.status ??
                                ""
                            ).toLowerCase() ===
                            "delivered"
                    ).length,

                pending:
                    deliveryChallans.filter(
                        item =>
                            String(
                                item.Status ??
                                item.status ??
                                ""
                            ).toLowerCase() ===
                            "pending"
                    ).length,

                inTransit:
                    deliveryChallans.filter(
                        item =>
                            String(
                                item.Status ??
                                item.status ??
                                ""
                            ).toLowerCase() ===
                            "in transit"
                    ).length
            };

        }, [
            deliveryChallans
        ]);


    // ==========================================================
    // PAGINATION
    // ==========================================================

    const totalRecords =
        filteredDeliveryChallans.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords /
                pageSize
            )
        );


    const paginatedDeliveryChallans =
        filteredDeliveryChallans.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    useEffect(() => {

        setPage(1);

    }, [
        searchText
    ]);


    useEffect(() => {

        if (page > totalPages) {

            setPage(
                totalPages
            );
        }

    }, [
        page,
        totalPages
    ]);


    // ==========================================================
    // ADD
    // ==========================================================

    const handleAdd = () => {

        setSelectedDeliveryChallan(
            null
        );

        setModalOpen(true);
    };


    // ==========================================================
    // EDIT
    // ==========================================================

    const handleEdit = (
        challan
    ) => {

        setSelectedDeliveryChallan(
            challan
        );

        setModalOpen(true);
    };


    // ==========================================================
    // VIEW
    // ==========================================================

    const handleView = (
        challan
    ) => {

        setSelectedDeliveryChallan(
            challan
        );

        setViewOpen(true);
    };


    // ==========================================================
    // DELETE CLICK
    // ==========================================================

    const handleDelete = (
        challan
    ) => {

        setSelectedDeliveryChallan(
            challan
        );

        setDeleteOpen(true);
    };


    // ==========================================================
    // CREATE
    // ==========================================================

    const createDeliveryChallan =
        async (data) => {

            const response =
                await fetch(
                    `${SERVER_URL}/api/delivery-challans`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const result =
                await response
                    .json()
                    .catch(() => null);


            if (!response.ok) {

                throw new Error(
                    result?.message ||
                    result?.error ||
                    "Failed to create delivery challan."
                );
            }


            return result;
        };


    // ==========================================================
    // UPDATE
    // ==========================================================

    const updateDeliveryChallan =
        async (
            id,
            data
        ) => {

            const response =
                await fetch(
                    `${SERVER_URL}/api/delivery-challans/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const result =
                await response
                    .json()
                    .catch(() => null);


            if (!response.ok) {

                throw new Error(
                    result?.message ||
                    result?.error ||
                    "Failed to update delivery challan."
                );
            }


            return result;
        };


    // ==========================================================
    // DELETE
    // ==========================================================

    const deleteDeliveryChallan =
        async (
            id
        ) => {

            const response =
                await fetch(
                    `${SERVER_URL}/api/delivery-challans/${id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            const result =
                await response
                    .json()
                    .catch(() => null);


            if (!response.ok) {

                throw new Error(
                    result?.message ||
                    result?.error ||
                    "Failed to delete delivery challan."
                );
            }


            return result;
        };


    // ==========================================================
    // SAVE
    // ==========================================================

    const handleSave =
        async (
            data
        ) => {

            try {

                const id =
                    data.DeliveryChallanId ??
                    data.deliveryChallanId;


                if (id) {

                    await updateDeliveryChallan(
                        id,
                        data
                    );

                    showMessage(
                        "Delivery Challan updated successfully.",
                        "success"
                    );

                }
                else {

                    await createDeliveryChallan(
                        data
                    );

                    showMessage(
                        "Delivery Challan created successfully.",
                        "success"
                    );
                }


                setModalOpen(false);

                setSelectedDeliveryChallan(
                    null
                );


                await loadDeliveryChallans();

            }
            catch (error) {

                console.error(
                    "SAVE DELIVERY CHALLAN ERROR:",
                    error
                );

                showMessage(
                    error.message ||
                    "Failed to save delivery challan.",
                    "error"
                );
            }
        };


    // ==========================================================
    // DELETE CONFIRM
    // ==========================================================

    const handleDeleted =
        async (
            id
        ) => {

            try {

                if (!id) {

                    throw new Error(
                        "Invalid delivery challan ID."
                    );
                }


                await deleteDeliveryChallan(
                    id
                );


                showMessage(
                    "Delivery Challan deleted successfully.",
                    "success"
                );


                setDeleteOpen(false);

                setSelectedDeliveryChallan(
                    null
                );


                await loadDeliveryChallans();

            }
            catch (error) {

                console.error(
                    "DELETE DELIVERY CHALLAN ERROR:",
                    error
                );

                showMessage(
                    error.message ||
                    "Failed to delete delivery challan.",
                    "error"
                );
            }
        };


    // ==========================================================
    // REFRESH
    // ==========================================================

    const handleRefresh = () => {

        loadDeliveryChallans();

    };


    // ==========================================================
    // UI
    // ==========================================================

    return (

        <Box
            className="delivery-challan-container"
            sx={{
                p: 3
            }}
        >

            <DeliveryChallanToolbar
                onAdd={
                    handleAdd
                }

                onRefresh={
                    handleRefresh
                }
            />


            <DeliveryChallanStatistics
                statistics={
                    statistics
                }
            />


            <DeliveryChallanSearch
                searchText={
                    searchText
                }

                setSearchText={
                    (value) => {

                        setSearchText(
                            value
                        );

                        setPage(1);
                    }
                }
            />


            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 8
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <>

                    <DeliveryChallanTable
                        items={
                            paginatedDeliveryChallans
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


                    <DeliveryChallanPagination
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
                            totalRecords
                        }

                        onPageChange={
                            setPage
                        }

                        onPageSizeChange={
                            (size) => {

                                setPageSize(
                                    size
                                );

                                setPage(1);
                            }
                        }
                    />

                </>

            )}


            <DeliveryChallanModal
                open={
                    modalOpen
                }

                deliveryChallan={
                    selectedDeliveryChallan
                }

                onClose={() => {

                    setModalOpen(false);

                    setSelectedDeliveryChallan(
                        null
                    );

                }}

                onSave={
                    handleSave
                }
            />


            <DeliveryChallanView
                open={
                    viewOpen
                }

                deliveryChallan={
                    selectedDeliveryChallan
                }

                onClose={() => {

                    setViewOpen(false);

                    setSelectedDeliveryChallan(
                        null
                    );

                }}
            />


            <DeleteDeliveryChallanDialog
                open={
                    deleteOpen
                }

                deliveryChallan={
                    selectedDeliveryChallan
                }

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedDeliveryChallan(
                        null
                    );

                }}

                onDeleted={
                    handleDeleted
                }
            />


            <Snackbar
                open={
                    snackbar.open
                }

                autoHideDuration={
                    3000
                }

                onClose={
                    closeSnackbar
                }

                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={
                        snackbar.severity
                    }

                    variant="filled"

                    onClose={
                        closeSnackbar
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default DeliveryChallanList;
