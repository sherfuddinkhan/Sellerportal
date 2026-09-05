import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import PurchaseReturnToolbar
    from "./PurchaseReturnToolbar";

import PurchaseReturnStatistics
    from "./PurchaseReturnStatistics";

import PurchaseReturnSearch
    from "./PurchaseReturnSearch";

import PurchaseReturnTable
    from "./PurchaseReturnTable";

import PurchaseReturnPagination
    from "./PurchaseReturnPagination";

import PurchaseReturnModal
    from "./PurchaseReturnModal";

import PurchaseReturnView
    from "./PurchaseReturnView";

import DeletePurchaseReturnDialog
    from "./DeletePurchaseReturnDialog";


// ==========================================================
// NODE SERVER
// ==========================================================

const SERVER_URL = "http://localhost:5000";


// ==========================================================
// COMPONENT
// ==========================================================

const PurchaseReturnList = () => {

    // ==========================================================
    // PURCHASE RETURNS
    // ==========================================================

    const [purchaseReturns, setPurchaseReturns] =
        useState([]);


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const [statistics, setStatistics] =
        useState({
            totalReturns: 0,
            totalAmount: 0,
            completedReturns: 0,
            pendingReturns: 0
        });


    // ==========================================================
    // LOADING
    // ==========================================================

    const [loading, setLoading] =
        useState(false);

    const [statisticsLoading, setStatisticsLoading] =
        useState(false);


    // ==========================================================
    // SEARCH
    // ==========================================================

    const [searchText, setSearchText] =
        useState("");


    // ==========================================================
    // PAGINATION
    // ==========================================================

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);


    // ==========================================================
    // SELECTED PURCHASE RETURN
    // ==========================================================

    const [
        selectedPurchaseReturn,
        setSelectedPurchaseReturn
    ] = useState(null);


    // ==========================================================
    // MODALS
    // ==========================================================

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);


    // ==========================================================
    // SNACKBAR
    // ==========================================================

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    // ==========================================================
    // LOAD PURCHASE RETURNS
    // ==========================================================

    const loadPurchaseReturns = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${SERVER_URL}/api/purchase-returns/all-details`
            );

            console.log(
                "================================================"
            );

            console.log(
                "PURCHASE RETURNS RESPONSE:",
                response.data
            );

            console.log(
                "================================================"
            );


            const data = response.data;


            if (Array.isArray(data)) {

                setPurchaseReturns(data);

            }
            else if (
                data &&
                Array.isArray(data.items)
            ) {

                setPurchaseReturns(
                    data.items
                );

            }
            else {

                console.warn(
                    "UNEXPECTED PURCHASE RETURNS RESPONSE:",
                    data
                );

                setPurchaseReturns([]);

            }

        }
        catch (error) {

            console.error(
                "LOAD PURCHASE RETURNS ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setPurchaseReturns([]);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    "Failed to load Purchase Returns.",
                severity: "error"
            });

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================================
    // LOAD PURCHASE RETURN STATISTICS
    // ==========================================================

    const loadStatistics = async () => {

        try {

            setStatisticsLoading(true);


            const response = await axios.get(
                `${SERVER_URL}/api/purchase-returns/stats`
            );


            console.log(
                "================================================"
            );

            console.log(
                "PURCHASE RETURN STATISTICS API RESPONSE:",
                response.data
            );

            console.log(
                "================================================"
            );


            const data =
                response.data || {};


            const normalizedStatistics = {

                totalReturns:
                    Number(
                        data.totalRecords ?? 0
                    ),

                totalAmount:
                    Number(
                        data.totalReturnAmount ?? 0
                    ),

                completedReturns:
                    Number(
                        data.completedCount ?? 0
                    ),

                pendingReturns:
                    Number(
                        data.pendingPickupCount ?? 0
                    )

            };


            console.log(
                "NORMALIZED PURCHASE RETURN STATISTICS:",
                normalizedStatistics
            );


            setStatistics(
                normalizedStatistics
            );

        }
        catch (error) {

            console.error(
                "LOAD PURCHASE RETURN STATISTICS ERROR:",
                error
            );

            console.error(
                "STATISTICS SERVER RESPONSE:",
                error.response?.data
            );


            setStatistics({

                totalReturns: 0,

                totalAmount: 0,

                completedReturns: 0,

                pendingReturns: 0

            });

        }
        finally {

            setStatisticsLoading(false);

        }

    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        loadPurchaseReturns();

        loadStatistics();

    }, []);


    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredPurchaseReturns =
        useMemo(() => {

            const search =
                String(searchText ?? "")
                    .trim()
                    .toLowerCase();


            if (!search) {

                return purchaseReturns;

            }


            return purchaseReturns.filter(
                (item) => {

                    return (

                        String(
                            item?.purchaseReturnId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.purchaseOrderId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.goodsReceiptNoteId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.supplierId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.sellerId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.customerId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.purchaseReturnNumber ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.status ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.reason ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item?.totalAmount ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

        }, [
            purchaseReturns,
            searchText
        ]);


    // ==========================================================
    // PAGINATION
    // ==========================================================

    const totalRecords =
        filteredPurchaseReturns.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );


    // ==========================================================
    // VALIDATE PAGE
    // ==========================================================

    useEffect(() => {

        if (page > totalPages) {

            setPage(totalPages);

        }

    }, [
        page,
        totalPages
    ]);


    // ==========================================================
    // PAGINATED DATA
    // ==========================================================

    const paginatedPurchaseReturns =
        useMemo(() => {

            const startIndex =
                (page - 1) * pageSize;

            const endIndex =
                startIndex + pageSize;


            return filteredPurchaseReturns.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredPurchaseReturns,
            page,
            pageSize
        ]);


    // ==========================================================
    // ADD
    // ==========================================================

    const handleAdd = () => {

        setSelectedPurchaseReturn(null);

        setModalOpen(true);

    };


    // ==========================================================
    // EDIT
    // ==========================================================

    const handleEdit = (item) => {

        console.log(
            "EDIT PURCHASE RETURN:",
            item
        );

        setSelectedPurchaseReturn(item);

        setModalOpen(true);

    };


    // ==========================================================
    // VIEW
    // ==========================================================

    const handleView = (item) => {

        console.log(
            "VIEW PURCHASE RETURN:",
            item
        );

        setSelectedPurchaseReturn(item);

        setViewOpen(true);

    };


    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete = (item) => {

        console.log(
            "DELETE PURCHASE RETURN:",
            item
        );

        setSelectedPurchaseReturn(item);

        setDeleteOpen(true);

    };


    // ==========================================================
    // SAVE
    // ==========================================================

    const handleSave = async (data) => {

        try {

            console.log(
                "PURCHASE RETURN SAVE DATA:",
                data
            );


            const purchaseReturnId =
                Number(
                    data?.purchaseReturnId ?? 0
                );


            // ==================================================
            // UPDATE
            // ==================================================

            if (
                Number.isInteger(
                    purchaseReturnId
                ) &&
                purchaseReturnId > 0
            ) {

                const payload = {

                    ...data,

                    purchaseReturnId

                };


                console.log(
                    "PURCHASE RETURN UPDATE PAYLOAD:",
                    payload
                );


                const response =
                    await axios.put(

                        `${SERVER_URL}/api/purchase-returns/${purchaseReturnId}`,

                        payload

                    );


                console.log(
                    "PURCHASE RETURN UPDATED:",
                    response.data
                );


                setSnackbar({

                    open: true,

                    message:
                        "Purchase Return updated successfully.",

                    severity: "success"

                });

            }


            // ==================================================
            // CREATE
            // ==================================================

            else {

                const payload = {

                    ...data,

                    purchaseReturnId: 0

                };


                console.log(
                    "PURCHASE RETURN CREATE PAYLOAD:",
                    payload
                );


                const response =
                    await axios.post(

                        `${SERVER_URL}/api/purchase-returns`,

                        payload

                    );


                console.log(
                    "PURCHASE RETURN CREATED:",
                    response.data
                );


                setSnackbar({

                    open: true,

                    message:
                        "Purchase Return created successfully.",

                    severity: "success"

                });

            }


            setModalOpen(false);

            setSelectedPurchaseReturn(null);


            await Promise.all([

                loadPurchaseReturns(),

                loadStatistics()

            ]);

        }
        catch (error) {

            console.error(
                "SAVE PURCHASE RETURN ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            setSnackbar({

                open: true,

                message:
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    error.message ||
                    "Failed to save Purchase Return.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            const purchaseReturnId =
                Number(id);


            if (
                !Number.isInteger(
                    purchaseReturnId
                ) ||
                purchaseReturnId <= 0
            ) {

                throw new Error(
                    "Invalid Purchase Return ID."
                );

            }


            const response =
                await axios.delete(
                    `${SERVER_URL}/api/purchase-returns/${purchaseReturnId}`
                );


            console.log(
                "PURCHASE RETURN DELETED:",
                response.data
            );


            setSnackbar({

                open: true,

                message:
                    response.data?.message ||
                    "Purchase Return deleted successfully.",

                severity: "success"

            });


            setDeleteOpen(false);

            setSelectedPurchaseReturn(null);


            await Promise.all([

                loadPurchaseReturns(),

                loadStatistics()

            ]);

        }
        catch (error) {

            console.error(
                "DELETE PURCHASE RETURN ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            setSnackbar({

                open: true,

                message:
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    error.message ||
                    "Failed to delete Purchase Return.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // REFRESH
    // ==========================================================

    const handleRefresh = async () => {

        await Promise.all([

            loadPurchaseReturns(),

            loadStatistics()

        ]);

    };


    // ==========================================================
    // SEARCH CHANGE
    // ==========================================================

    const handleSearchChange = (value) => {

        setSearchText(value);

        setPage(1);

    };


    // ==========================================================
    // PAGE CHANGE
    // ==========================================================

    const handlePageChange = (newPage) => {

        setPage(newPage);

    };


    // ==========================================================
    // PAGE SIZE CHANGE
    // ==========================================================

    const handlePageSizeChange = (size) => {

        const newPageSize =
            Number(size);


        if (
            !Number.isInteger(
                newPageSize
            ) ||
            newPageSize <= 0
        ) {

            return;

        }


        setPageSize(newPageSize);

        setPage(1);

    };


    // ==========================================================
    // SNACKBAR CLOSE
    // ==========================================================

    const handleSnackbarClose = () => {

        setSnackbar(
            (previous) => ({

                ...previous,

                open: false

            })
        );

    };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <Box
            className="purchase-return-container"
            sx={{
                width: "100%"
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <PurchaseReturnToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <PurchaseReturnStatistics
                statistics={statistics}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <PurchaseReturnSearch
                searchText={searchText}
                setSearchText={
                    handleSearchChange
                }
            />


            {/* =================================================
                TABLE
            ================================================= */}

            {loading ? (

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={5}
                    mb={5}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <PurchaseReturnTable
                    purchaseReturns={
                        paginatedPurchaseReturns
                    }
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}


            {/* =================================================
                PAGINATION
            ================================================= */}

            <PurchaseReturnPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={
                    handlePageChange
                }
                onPageSizeChange={
                    handlePageSizeChange
                }
            />


            {/* =================================================
                CREATE / EDIT
            ================================================= */}

            <PurchaseReturnModal
                open={modalOpen}
                purchaseReturn={
                    selectedPurchaseReturn
                }
                onClose={() => {

                    setModalOpen(false);

                    setSelectedPurchaseReturn(null);

                }}
                onSave={handleSave}
            />


            {/* =================================================
                VIEW
            ================================================= */}

            <PurchaseReturnView
                open={viewOpen}
                purchaseReturn={
                    selectedPurchaseReturn
                }
                onClose={() => {

                    setViewOpen(false);

                    setSelectedPurchaseReturn(null);

                }}
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeletePurchaseReturnDialog
                open={deleteOpen}
                purchaseReturn={
                    selectedPurchaseReturn
                }
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedPurchaseReturn(null);

                }}
                onDeleted={handleDeleted}
            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={
                    handleSnackbarClose
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={
                        handleSnackbarClose
                    }
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default PurchaseReturnList;