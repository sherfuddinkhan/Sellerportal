import React, {useEffect,useMemo,useState} from "react";
import {Box,CircularProgress,Alert,Snackbar} from "@mui/material";
import PurchaseReturnToolbar from "./PurchaseReturnToolbar";

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

const PurchaseReturnList = () => {

    // ==========================================================
    // State
    // ==========================================================

    const [purchaseReturns,
        setPurchaseReturns] = useState([]);

    const [loading,
        setLoading] = useState(false);

    const [searchText,
        setSearchText] = useState("");

    const [page,
        setPage] = useState(1);

    const [pageSize,
        setPageSize] = useState(10);

    const [selectedPurchaseReturn,
        setSelectedPurchaseReturn] = useState(null);

    const [modalOpen,
        setModalOpen] = useState(false);

    const [viewOpen,
        setViewOpen] = useState(false);

    const [deleteOpen,
        setDeleteOpen] = useState(false);

    const [snackbar,
        setSnackbar] = useState({

            open: false,

            message: "",

            severity: "success"

        });

    // ==========================================================
    // Load Purchase Returns
    // ==========================================================

    const loadPurchaseReturns = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getPurchaseReturns();

            setPurchaseReturns(
                response.data || []
            );

        }
        catch (error) {

            console.error(
                "Purchase Return Load Error",
                error
            );

            setSnackbar({

                open: true,

                message:
                    "Failed to load Purchase Returns.",

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

        loadPurchaseReturns();

    }, []);
        // ==========================================================
    // Search Filter
    // ==========================================================

    const filteredPurchaseReturns = useMemo(() => {

        if (!searchText.trim())
            return purchaseReturns;

        const search = searchText.toLowerCase();

        return purchaseReturns.filter((item) => (

            String(item.PurchaseReturnId)
                .includes(search)

            ||

            String(item.PurchaseOrderId)
                .includes(search)

            ||

            String(item.GoodsReceiptNoteId)
                .includes(search)

            ||

            String(item.SupplierId)
                .includes(search)

            ||

            item.PurchaseReturnNumber
                ?.toLowerCase()
                .includes(search)

            ||

            item.Status
                ?.toLowerCase()
                .includes(search)

            ||

            item.Reason
                ?.toLowerCase()
                .includes(search)

            ||

            String(item.TotalAmount)
                .includes(search)

        ));

    }, [

        purchaseReturns,

        searchText

    ]);



    // ==========================================================
    // Statistics
    // ==========================================================

    const statistics = useMemo(() => ({

        totalReturns:

            purchaseReturns.length,

        totalAmount:

            purchaseReturns.reduce(

                (sum, item) =>

                    sum + Number(item.TotalAmount || 0),

                0

            ),

        completedReturns:

            purchaseReturns.filter(

                item =>

                    item.Status?.toLowerCase() === "completed"

            ).length,

        pendingReturns:

            purchaseReturns.filter(

                item =>

                    item.Status?.toLowerCase() === "pending"

            ).length

    }), [

        purchaseReturns

    ]);



    // ==========================================================
    // Pagination
    // ==========================================================

    const totalRecords =

        filteredPurchaseReturns.length;

    const totalPages =

        Math.ceil(totalRecords / pageSize);

    const paginatedPurchaseReturns =

        filteredPurchaseReturns.slice(

            (page - 1) * pageSize,

            page * pageSize

        );



    // ==========================================================
    // Add
    // ==========================================================

    const handleAdd = () => {

        setSelectedPurchaseReturn(null);

        setModalOpen(true);

    };



    // ==========================================================
    // Edit
    // ==========================================================

    const handleEdit = (item) => {

        setSelectedPurchaseReturn(item);

        setModalOpen(true);

    };



    // ==========================================================
    // View
    // ==========================================================

    const handleView = (item) => {

        setSelectedPurchaseReturn(item);

        setViewOpen(true);

    };



    // ==========================================================
    // Delete
    // ==========================================================

    const handleDelete = (item) => {

        setSelectedPurchaseReturn(item);

        setDeleteOpen(true);

    };



    // ==========================================================
    // Save
    // ==========================================================

    const handleSave = async (data) => {

        try {

            if (data.PurchaseReturnId) {

                await apiService.updatePurchaseReturn(

                    data.PurchaseReturnId,

                    data

                );

                setSnackbar({

                    open: true,

                    message:

                        "Purchase Return updated successfully.",

                    severity: "success"

                });

            }
            else {

                await apiService.createPurchaseReturn(data);

                setSnackbar({

                    open: true,

                    message:

                        "Purchase Return created successfully.",

                    severity: "success"

                });

            }

            setModalOpen(false);

            loadPurchaseReturns();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:

                    "Failed to save Purchase Return.",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Delete Confirm
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            await apiService.deletePurchaseReturn(id);

            setSnackbar({

                open: true,

                message:

                    "Purchase Return deleted successfully.",

                severity: "success"

            });

            setDeleteOpen(false);

            loadPurchaseReturns();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:

                    "Failed to delete Purchase Return.",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Refresh
    // ==========================================================

    const handleRefresh = () => {

        loadPurchaseReturns();

    };
        // ==========================================================
    // Return UI
    // ==========================================================

    return (

        <Box className="purchase-return-container">

            <PurchaseReturnToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />

            <PurchaseReturnStatistics
                statistics={statistics}
            />

            <PurchaseReturnSearch
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

            <PurchaseReturnModal
                open={modalOpen}
                purchaseReturn={selectedPurchaseReturn}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
                        <PurchaseReturnView
                open={viewOpen}
                purchaseReturn={selectedPurchaseReturn}
                onClose={() => setViewOpen(false)}
            />

            <DeletePurchaseReturnDialog
                open={deleteOpen}
                purchaseReturn={selectedPurchaseReturn}
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

export default PurchaseReturnList;