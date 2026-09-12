import React, {
    useCallback,
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

import {
    useNavigate
} from "react-router-dom";

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

import DeliveryChallanView
    from "./DeliveryChallanView";

import DeleteDeliveryChallanDialog
    from "./DeleteDeliveryChallanDialog";


const SERVER_URL =
    "http://localhost:5000";


// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getDeliveryChallanId = (
    item
) => {

    return (
        item?.DeliveryChallanId ??
        item?.deliveryChallanId ??
        item?.id ??
        item?.Id ??
        null
    );
};


const getSalesOrderId = (
    item
) => {

    return (
        item?.SalesOrderId ??
        item?.salesOrderId ??
        null
    );
};


const getChallanNumber = (
    item
) => {

    return (
        item?.ChallanNumber ??
        item?.challanNumber ??
        ""
    );
};


const getChallanDate = (
    item
) => {

    return (
        item?.ChallanDate ??
        item?.challanDate ??
        ""
    );
};


const getVehicleNumber = (
    item
) => {

    return (
        item?.VehicleNumber ??
        item?.vehicleNumber ??
        ""
    );
};


const getDriverName = (
    item
) => {

    return (
        item?.DriverName ??
        item?.driverName ??
        ""
    );
};


const getDriverMobile = (
    item
) => {

    return (
        item?.DriverMobile ??
        item?.driverMobile ??
        ""
    );
};


const getTransporterName = (
    item
) => {

    return (
        item?.TransporterName ??
        item?.transporterName ??
        ""
    );
};


const getCurrentStatus = (
    item
) => {

    return (
        item?.CurrentStatus ??
        item?.currentStatus ??
        item?.Status ??
        item?.status ??
        "Pending"
    );
};


// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanList = () => {

    const navigate =
        useNavigate();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        deliveryChallans,
        setDeliveryChallans
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
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);


    // ==========================================================
    // SELECTED DELIVERY CHALLAN
    // ==========================================================

    const [
        selectedDeliveryChallan,
        setSelectedDeliveryChallan
    ] = useState(null);


    // ==========================================================
    // VIEW
    // ==========================================================

    const [
        viewOpen,
        setViewOpen
    ] = useState(false);


    // ==========================================================
    // DELETE
    // ==========================================================

    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);


    // ==========================================================
    // SNACKBAR
    // ==========================================================

    const [
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    // ==========================================================
    // SHOW MESSAGE
    // ==========================================================

    const showMessage = useCallback(
        (
            message,
            severity = "success"
        ) => {

            setSnackbar({
                open: true,
                message,
                severity
            });

        },
        []
    );


    // ==========================================================
    // CLOSE SNACKBAR
    // ==========================================================

    const closeSnackbar = () => {

        setSnackbar(
            previous => ({
                ...previous,
                open: false
            })
        );
    };


    // ==========================================================
    // GET ERROR MESSAGE
    // ==========================================================

    const getErrorMessage = (
        data,
        fallback
    ) => {

        if (
            typeof data === "string" &&
            data.trim()
        ) {

            return data;
        }


        if (
            data?.message
        ) {

            return data.message;
        }


        if (
            data?.error
        ) {

            return data.error;
        }


        if (
            data?.title
        ) {

            return data.title;
        }


        if (
            Array.isArray(
                data?.errors
            )
        ) {

            return data.errors.join(
                ", "
            );
        }


        if (
            data?.errors &&
            typeof data.errors === "object"
        ) {

            return Object
                .values(data.errors)
                .flat()
                .join(", ");
        }


        return fallback;
    };


    // ==========================================================
    // GET ALL DELIVERY CHALLANS
    //
    // React:
    // GET /api/delivery-challans
    //
    // Node:
    // GET /api/delivery-challans
    //
    // ASP.NET:
    // GET /api/DeliveryChallan
    // ==========================================================

    const loadDeliveryChallans =
        useCallback(
            async () => {

                try {

                    setLoading(true);


                    console.log(
                        "================================================"
                    );

                    console.log(
                        "GET DELIVERY CHALLANS"
                    );

                    console.log(
                        `${SERVER_URL}/api/delivery-challans`
                    );

                    console.log(
                        "================================================"
                    );


                    const response =
                        await fetch(
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
                            .catch(
                                () => null
                            );


                    console.log(
                        "DELIVERY CHALLANS RESPONSE:",
                        data
                    );


                    if (!response.ok) {

                        throw new Error(
                            getErrorMessage(
                                data,
                                "Failed to load delivery challans."
                            )
                        );
                    }


                    const list =
                        Array.isArray(data)
                            ? data
                            : Array.isArray(data?.data)
                                ? data.data
                                : Array.isArray(data?.items)
                                    ? data.items
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

            },
            [
                showMessage
            ]
        );


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        loadDeliveryChallans();

    }, [
        loadDeliveryChallans
    ]);


    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredDeliveryChallans =
        useMemo(
            () => {

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

                            getDeliveryChallanId(
                                item
                            ),

                            getSalesOrderId(
                                item
                            ),

                            getChallanNumber(
                                item
                            ),

                            getChallanDate(
                                item
                            ),

                            getVehicleNumber(
                                item
                            ),

                            getDriverName(
                                item
                            ),

                            getDriverMobile(
                                item
                            ),

                            getTransporterName(
                                item
                            ),

                            getCurrentStatus(
                                item
                            )
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

            },
            [
                deliveryChallans,
                searchText
            ]
        );


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const statistics =
        useMemo(
            () => {

                const getStatus =
                    item =>
                        String(
                            getCurrentStatus(
                                item
                            )
                        )
                            .trim()
                            .toLowerCase();


                return {

                    totalDeliveryChallans:
                        deliveryChallans.length,


                    delivered:
                        deliveryChallans.filter(
                            item =>
                                getStatus(item) ===
                                "delivered"
                        ).length,


                    pending:
                        deliveryChallans.filter(
                            item =>
                                getStatus(item) ===
                                "pending"
                        ).length,


                    inTransit:
                        deliveryChallans.filter(
                            item =>
                                getStatus(item) ===
                                "in transit"
                        ).length

                };

            },
            [
                deliveryChallans
            ]
        );


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
        useMemo(
            () => {

                const start =
                    (page - 1) *
                    pageSize;


                const end =
                    start +
                    pageSize;


                return filteredDeliveryChallans.slice(
                    start,
                    end
                );

            },
            [
                filteredDeliveryChallans,
                page,
                pageSize
            ]
        );


    // ==========================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // ==========================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText
    ]);


    // ==========================================================
    // KEEP PAGE VALID
    // ==========================================================

    useEffect(() => {

        if (
            page >
            totalPages
        ) {

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

        navigate(
            "/delivery-challans/create"
        );
    };


    // ==========================================================
    // EDIT
    //
    // Dedicated page:
    // /delivery-challans/edit/:id
    // ==========================================================

    const handleEdit = (
        challan
    ) => {

        const id =
            getDeliveryChallanId(
                challan
            );


        if (
            !id ||
            String(id) === ":id"
        ) {

            showMessage(
                "Invalid Delivery Challan ID.",
                "error"
            );

            return;
        }


        console.log(
            "EDIT DELIVERY CHALLAN:",
            id
        );


        navigate(
            `/delivery-challans/edit/${id}`
        );
    };


// ==========================================================
// VIEW
// ==========================================================

const handleView = (
    challan
) => {

    const id =
        getDeliveryChallanId(
            challan
        );

    if (
        !id ||
        String(id) === ":id"
    ) {

        showMessage(
            "Invalid Delivery Challan ID.",
            "error"
        );

        return;
    }

    navigate(
        `/delivery-challans/${id}`
    );
};

    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete = (
        challan
    ) => {

        const id =
            getDeliveryChallanId(
                challan
            );


        if (
            !id ||
            String(id) === ":id"
        ) {

            showMessage(
                "Invalid Delivery Challan ID.",
                "error"
            );

            return;
        }


        setSelectedDeliveryChallan(
            challan
        );


        setDeleteOpen(
            true
        );
    };


    // ==========================================================
    // DELETE API
    //
    // React:
    // DELETE /api/delivery-challans/:id
    //
    // Node:
    // DELETE /api/delivery-challans/:id
    //
    // ASP.NET:
    // DELETE /api/DeliveryChallan/:id
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


            const data =
                await response
                    .json()
                    .catch(
                        () => null
                    );


            if (!response.ok) {

                throw new Error(
                    getErrorMessage(
                        data,
                        "Failed to delete delivery challan."
                    )
                );
            }


            return data;
        };


    // ==========================================================
    // DELETE CONFIRM
    // ==========================================================

    const handleDeleted =
        async (
            id
        ) => {

            try {

                if (
                    !id ||
                    String(id) === ":id"
                ) {

                    throw new Error(
                        "Invalid Delivery Challan ID."
                    );
                }


                console.log(
                    "DELETE DELIVERY CHALLAN:",
                    id
                );


                await deleteDeliveryChallan(
                    id
                );


                showMessage(
                    "Delivery Challan deleted successfully.",
                    "success"
                );


                setDeleteOpen(
                    false
                );


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

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <DeliveryChallanToolbar
                onAdd={
                    handleAdd
                }

                onRefresh={
                    handleRefresh
                }
            />


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <DeliveryChallanStatistics
                statistics={
                    statistics
                }
            />


            {/* ==================================================
                SEARCH
            ================================================== */}

            <DeliveryChallanSearch
                searchText={
                    searchText
                }

                setSearchText={
                    value => {

                        setSearchText(
                            value
                        );

                        setPage(
                            1
                        );
                    }
                }
            />


            {/* ==================================================
                CONTENT
            ================================================== */}

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

                    {/* ==========================================
                        TABLE
                    ========================================== */}

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


                    {/* ==========================================
                        PAGINATION
                    ========================================== */}

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
                            size => {

                                setPageSize(
                                    size
                                );

                                setPage(
                                    1
                                );
                            }
                        }
                    />

                </>

            )}


            {/* ==================================================
                VIEW
            ================================================== */}

            <DeliveryChallanView
                open={
                    viewOpen
                }

                deliveryChallan={
                    selectedDeliveryChallan
                }

                onClose={() => {

                    setViewOpen(
                        false
                    );

                    setSelectedDeliveryChallan(
                        null
                    );

                }}
            />


            {/* ==================================================
                DELETE
            ================================================== */}

            <DeleteDeliveryChallanDialog
                open={
                    deleteOpen
                }

                deliveryChallan={
                    selectedDeliveryChallan
                }

                onClose={() => {

                    setDeleteOpen(
                        false
                    );

                    setSelectedDeliveryChallan(
                        null
                    );

                }}

                onDeleted={
                    handleDeleted
                }
            />


            {/* ==================================================
                SNACKBAR
            ================================================== */}

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
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default DeliveryChallanList;
