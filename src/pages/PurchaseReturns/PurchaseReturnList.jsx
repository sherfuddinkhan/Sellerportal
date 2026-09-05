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

const SERVER_URL =
    "http://localhost:5000";


// ==========================================================
// COMPONENT
// ==========================================================

const PurchaseReturnList = () => {

    // ==========================================================
    // STATE
    // ==========================================================

    const [
        purchaseReturns,
        setPurchaseReturns
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

    const [
        selectedPurchaseReturn,
        setSelectedPurchaseReturn
    ] = useState(null);

    const [
        modalOpen,
        setModalOpen
    ] = useState(false);

    const [
        viewOpen,
        setViewOpen
    ] = useState(false);

    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);

    const [
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    // ==========================================================
    // LOAD PURCHASE RETURNS
    //
    // Node:
    // GET /api/purchase-returns/all-details
    // ==========================================================

    const loadPurchaseReturns = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${SERVER_URL}/api/purchase-returns/all-details`
            );

            console.log(
                "PURCHASE RETURNS RESPONSE:",
                response.data
            );

            // --------------------------------------------------
            // Handle different possible response structures
            // --------------------------------------------------

            let data = response.data;

            if (Array.isArray(data)) {

                setPurchaseReturns(data);

            }
            else if (
                data &&
                Array.isArray(data.items)
            ) {

                setPurchaseReturns(data.items);

            }
            else {

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
                    "Failed to load Purchase Returns.",

                severity: "error"

            });

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        loadPurchaseReturns();

    }, []);


    // ==========================================================
    // SEARCH FILTER
    // ==========================================================

    const filteredPurchaseReturns = useMemo(() => {

        if (!searchText.trim()) {

            return purchaseReturns;

        }

        const search =
            searchText
                .toLowerCase()
                .trim();


        return purchaseReturns.filter(
            (item) => {

                return (

                    String(
                        item.PurchaseReturnId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.PurchaseOrderId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.GoodsReceiptNoteId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.SupplierId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.PurchaseReturnNumber ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.Status ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.Reason ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.TotalAmount ?? ""
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
    // STATISTICS
    // ==========================================================

    const statistics = useMemo(() => {

        return {

            totalReturns:
                purchaseReturns.length,

            totalAmount:
                purchaseReturns.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.TotalAmount || 0
                        ),
                    0
                ),

            completedReturns:
                purchaseReturns.filter(
                    item =>
                        String(
                            item.Status || ""
                        )
                            .toLowerCase() ===
                        "completed"
                ).length,

            pendingReturns:
                purchaseReturns.filter(
                    item =>
                        String(
                            item.Status || ""
                        )
                            .toLowerCase() ===
                        "pending"
                ).length

        };

    }, [
        purchaseReturns
    ]);


    // ==========================================================
    // PAGINATION
    // ==========================================================

    const totalRecords =
        filteredPurchaseReturns.length;

    const totalPages =
        Math.ceil(
            totalRecords / pageSize
        );

    const paginatedPurchaseReturns =
        filteredPurchaseReturns.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


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

        setSelectedPurchaseReturn(item);

        setModalOpen(true);

    };


    // ==========================================================
    // VIEW
    // ==========================================================

    const handleView = (item) => {

        setSelectedPurchaseReturn(item);

        setViewOpen(true);

    };


    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete = (item) => {

        setSelectedPurchaseReturn(item);

        setDeleteOpen(true);

    };


    // ==========================================================
    // SAVE
    //
    // CREATE:
    // POST /api/purchase-returns
    //
    // UPDATE:
    // PUT /api/purchase-returns/{id}
    // ==========================================================

    const handleSave = async (data) => {

        try {

            // ==================================================
            // UPDATE
            // ==================================================

            if (data.PurchaseReturnId) {

                const response =
                    await axios.put(
                        `${SERVER_URL}/api/purchase-returns/${data.PurchaseReturnId}`,
                        data
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

                const response =
                    await axios.post(
                        `${SERVER_URL}/api/purchase-returns`,
                        data
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


            // ==================================================
            // CLOSE MODAL
            // ==================================================

            setModalOpen(false);


            // ==================================================
            // RELOAD
            // ==================================================

            await loadPurchaseReturns();

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
                    "Failed to save Purchase Return.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // DELETE CONFIRM
    //
    // DELETE /api/purchase-returns/{id}
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            const response =
                await axios.delete(
                    `${SERVER_URL}/api/purchase-returns/${id}`
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

            await loadPurchaseReturns();

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
                    "Failed to delete Purchase Return.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // REFRESH
    // ==========================================================

    const handleRefresh = () => {

        loadPurchaseReturns();

    };


    // ==========================================================
    // SNACKBAR CLOSE
    // ==========================================================

    const handleSnackbarClose = () => {

        setSnackbar(
            previous => ({
                ...previous,
                open: false
            })
        );

    };


    // ==========================================================
    // RETURN UI
    // ==========================================================

    return (

        <Box
            className="purchase-return-container"
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
                setSearchText={(value) => {

                    setPage(1);

                    setSearchText(value);

                }}
            />


            {/* =================================================
                TABLE / LOADING
            ================================================= */}

            {
                loading

                ?

                (

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt={5}
                    >

                        <CircularProgress />

                    </Box>

                )

                :

                (

                    <PurchaseReturnTable
                        purchaseReturns={
                            paginatedPurchaseReturns
                        }
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )
            }


            {/* =================================================
                PAGINATION
            ================================================= */}

            <PurchaseReturnPagination
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


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <PurchaseReturnModal
                open={modalOpen}
                purchaseReturn={
                    selectedPurchaseReturn
                }
                onClose={() =>
                    setModalOpen(false)
                }
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
                onClose={() =>
                    setViewOpen(false)
                }
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeletePurchaseReturnDialog
                open={deleteOpen}
                purchaseReturn={
                    selectedPurchaseReturn
                }
                onClose={() =>
                    setDeleteOpen(false)
                }
                onDeleted={handleDeleted}
            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={handleSnackbarClose}
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default PurchaseReturnList;
