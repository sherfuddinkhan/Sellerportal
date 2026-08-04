import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    CircularProgress
} from "@mui/material";

import {
    Alert,
    Snackbar
} from "@mui/material";

import apiService from "../../services/apiService";

import DeliveryChallanToolbar
from "./DeliveryChallanToolbar";

import DeliveryChallanStatistics
from "./DeliveryChallanStatistics";

import DeliveryChallanSearch
from "./DeliveryChallanSearch";

import DeliveryChallanTable
from "./DeliveryChallanTable";

import DeliveryChallanPagination
from "./DeliveryChallanPagination";

import DeliveryChallanModal
from "./DeliveryChallanModal";

import DeliveryChallanView
from "./DeliveryChallanView";

import DeleteDeliveryChallanDialog
from "./DeleteDeliveryChallanDialog";

const DeliveryChallanList = () => {

    // ==========================================================
    // State
    // ==========================================================

    const [deliveryChallans, setDeliveryChallans] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [selectedDeliveryChallan,
        setSelectedDeliveryChallan] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({

        open: false,

        message: "",

        severity: "success"

    });

    // ==========================================================
    // Load Delivery Challans
    // ==========================================================

    const loadDeliveryChallans = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getDeliveryChallans();

            setDeliveryChallans(
                response.data || []
            );

        }
        catch (error) {

            console.error(
                "Delivery Challan Load Error",
                error
            );

            setSnackbar({

                open: true,

                message:
                    "Failed to load delivery challans",

                severity: "error"

            });

        }
        finally {

            setLoading(false);

        }

    };

    // ==========================================================
    // Initial Load
    // ==========================================================

    useEffect(() => {

        loadDeliveryChallans();

    }, []);
    // ==========================================================
    // Search Filter
    // ==========================================================

    const filteredDeliveryChallans = useMemo(() => {

        if (!searchText.trim())
            return deliveryChallans;

        const search = searchText.toLowerCase();

        return deliveryChallans.filter((item) => {

            return (

                String(item.DeliveryChallanId)
                    .includes(search)

                ||

                String(item.SalesOrderId)
                    .includes(search)

                ||

                item.ChallanNumber
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.VehicleNumber
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.DriverName
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.DriverMobile
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.TransporterName
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.Status
                    ?.toLowerCase()
                    .includes(search)

            );

        });

    }, [
        deliveryChallans,
        searchText
    ]);



    // ==========================================================
    // Statistics
    // ==========================================================

    const statistics = useMemo(() => ({

        totalDeliveryChallans:
            deliveryChallans.length,

        delivered:
            deliveryChallans.filter(

                x => x.Status === "Delivered"

            ).length,

        pending:
            deliveryChallans.filter(

                x => x.Status === "Pending"

            ).length,

        inTransit:
            deliveryChallans.filter(

                x => x.Status === "In Transit"

            ).length

    }), [deliveryChallans]);



    // ==========================================================
    // Pagination
    // ==========================================================

    const totalRecords =
        filteredDeliveryChallans.length;

    const totalPages = Math.ceil(
        totalRecords / pageSize
    );

    const paginatedDeliveryChallans =
        filteredDeliveryChallans.slice(

            (page - 1) * pageSize,

            page * pageSize

        );



    // ==========================================================
    // Add
    // ==========================================================

    const handleAdd = () => {

        setSelectedDeliveryChallan(null);

        setModalOpen(true);

    };



    // ==========================================================
    // Edit
    // ==========================================================

    const handleEdit = (challan) => {

        setSelectedDeliveryChallan(challan);

        setModalOpen(true);

    };



    // ==========================================================
    // View
    // ==========================================================

    const handleView = (challan) => {

        setSelectedDeliveryChallan(challan);

        setViewOpen(true);

    };



    // ==========================================================
    // Delete
    // ==========================================================

    const handleDelete = (challan) => {

        setSelectedDeliveryChallan(challan);

        setDeleteOpen(true);

    };



    // ==========================================================
    // Save (Create / Update)
    // ==========================================================

    const handleSave = async (data) => {

        try {

            if (data.DeliveryChallanId) {

                await apiService.updateDeliveryChallan(

                    data.DeliveryChallanId,

                    data

                );

                setSnackbar({

                    open: true,

                    message:
                        "Delivery Challan updated successfully",

                    severity: "success"

                });

            }
            else {

                await apiService.createDeliveryChallan(data);

                setSnackbar({

                    open: true,

                    message:
                        "Delivery Challan created successfully",

                    severity: "success"

                });

            }

            setModalOpen(false);

            loadDeliveryChallans();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message: "Save failed",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Delete Confirm
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            await apiService.deleteDeliveryChallan(id);

            setSnackbar({

                open: true,

                message:
                    "Delivery Challan deleted successfully",

                severity: "success"

            });

            setDeleteOpen(false);

            loadDeliveryChallans();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message: "Delete failed",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Refresh
    // ==========================================================

    const handleRefresh = () => {

        loadDeliveryChallans();

    };
        // ==========================================================
    // Return UI
    // ==========================================================

    return (

        <Box className="delivery-challan-container">

            <DeliveryChallanToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />

            <DeliveryChallanStatistics
                statistics={statistics}
            />

            <DeliveryChallanSearch
                searchText={searchText}
                setSearchText={(value) => {

                    setPage(1);

                    setSearchText(value);

                }}
            />

            {
                loading ?

                (

                    <Box
                        display="flex"
                        justifyContent="center"
                        mt={5}
                    >

                        <CircularProgress />

                    </Box>

                )

                :

                (

                    <DeliveryChallanTable
                        items={paginatedDeliveryChallans}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )

            }

            <DeliveryChallanPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={setPage}
                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}
            />

            <DeliveryChallanModal
                open={modalOpen}
                deliveryChallan={selectedDeliveryChallan}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
                        <DeliveryChallanView
                open={viewOpen}
                deliveryChallan={selectedDeliveryChallan}
                onClose={() => setViewOpen(false)}
            />

            <DeleteDeliveryChallanDialog
                open={deleteOpen}
                deliveryChallan={selectedDeliveryChallan}
                onClose={() => setDeleteOpen(false)}
                onDeleted={handleDeleted}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>

    );

};

export default DeliveryChallanList;