import React, {useEffect,useMemo,useState} from "react";
import {Box,CircularProgress,Alert,Snackbar} from "@mui/material";
import MarketplaceReturnToolbar from "./MarketplaceReturnToolbar";
import MarketplaceReturnStatistics from "./MarketplaceReturnStatistics";
import MarketplaceReturnSearch from "./MarketplaceReturnSearch";
import MarketplaceReturnTable from "./MarketplaceReturnTable";
import MarketplaceReturnPagination from "./MarketplaceReturnPagination";
import MarketplaceReturnModal from "./MarketplaceReturnModal";
import MarketplaceReturnView from "./MarketplaceReturnView";
import DeleteMarketplaceReturnDialog from "./DeleteMarketplaceReturnDialog";

const MarketplaceReturnList = () => {

    // ==========================================================
    // State
    // ==========================================================

    const [marketplaceReturns,setMarketplaceReturns] = useState([]);
    const [loading,setLoading] = useState(false);
    const [searchText,setSearchText] = useState("");
    const [page,setPage] = useState(1);
    const [pageSize,setPageSize] = useState(10);
    const [selectedMarketplaceReturn,setSelectedMarketplaceReturn] = useState(null);
    const [modalOpen,setModalOpen] = useState(false);
    const [viewOpen,setViewOpen] = useState(false);
    const [deleteOpen,setDeleteOpen] = useState(false);
    const [snackbar,setSnackbar] = useState({open: false,message: "",severity: "success"});

    // ==========================================================
    // Load Marketplace Returns
    // ==========================================================

    const loadMarketplaceReturns = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getMarketplaceReturns();

            setMarketplaceReturns(
                response.data || []
            );

        }
        catch (error) {

            console.error(
                "Marketplace Return Load Error",
                error
            );

            setSnackbar({

                open: true,

                message:
                    "Failed to load Marketplace Returns.",

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

        loadMarketplaceReturns();

    }, []);
        // ==========================================================
    // Search Filter
    // ==========================================================

    const filteredMarketplaceReturns = useMemo(() => {

        if (!searchText.trim())
            return marketplaceReturns;

        const search = searchText.toLowerCase();

        return marketplaceReturns.filter((item) => (

            String(item.MarketplaceReturnId)
                .includes(search)

            ||

            String(item.MarketplaceOrderItemId)
                .includes(search)

            ||

            item.ReturnNumber
                ?.toLowerCase()
                .includes(search)

            ||

            item.ReturnReason
                ?.toLowerCase()
                .includes(search)

            ||

            item.ReturnStatus
                ?.toLowerCase()
                .includes(search)

            ||

            String(item.QuantityReturned)
                .includes(search)

            ||

            String(item.RefundAmount)
                .includes(search)

        ));

    }, [

        marketplaceReturns,

        searchText

    ]);



    // ==========================================================
    // Statistics
    // ==========================================================

    const statistics = useMemo(() => ({

        totalReturns:

            marketplaceReturns.length,

        totalRefundAmount:

            marketplaceReturns.reduce(

                (sum, item) =>

                    sum + Number(item.RefundAmount || 0),

                0

            ),

        completedReturns:

            marketplaceReturns.filter(

                item =>

                    item.ReturnStatus?.toLowerCase() === "completed"

            ).length,

        pendingReturns:

            marketplaceReturns.filter(

                item =>

                    item.ReturnStatus?.toLowerCase() === "pending"

            ).length

    }), [

        marketplaceReturns

    ]);



    // ==========================================================
    // Pagination
    // ==========================================================

    const totalRecords =

        filteredMarketplaceReturns.length;

    const totalPages =

        Math.ceil(totalRecords / pageSize);

    const paginatedMarketplaceReturns =

        filteredMarketplaceReturns.slice(

            (page - 1) * pageSize,

            page * pageSize

        );



    // ==========================================================
    // Add
    // ==========================================================

    const handleAdd = () => {

        setSelectedMarketplaceReturn(null);

        setModalOpen(true);

    };



    // ==========================================================
    // Edit
    // ==========================================================

    const handleEdit = (marketplaceReturn) => {

        setSelectedMarketplaceReturn(marketplaceReturn);

        setModalOpen(true);

    };



    // ==========================================================
    // View
    // ==========================================================

    const handleView = (marketplaceReturn) => {

        setSelectedMarketplaceReturn(marketplaceReturn);

        setViewOpen(true);

    };



    // ==========================================================
    // Delete
    // ==========================================================

    const handleDelete = (marketplaceReturn) => {

        setSelectedMarketplaceReturn(marketplaceReturn);

        setDeleteOpen(true);

    };



    // ==========================================================
    // Save
    // ==========================================================

    const handleSave = async (data) => {

        try {

            if (data.MarketplaceReturnId) {

                await apiService.updateMarketplaceReturn(

                    data.MarketplaceReturnId,

                    data

                );

                setSnackbar({

                    open: true,

                    message:

                        "Marketplace Return updated successfully.",

                    severity: "success"

                });

            }
            else {

                await apiService.createMarketplaceReturn(data);

                setSnackbar({

                    open: true,

                    message:

                        "Marketplace Return created successfully.",

                    severity: "success"

                });

            }

            setModalOpen(false);

            loadMarketplaceReturns();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:

                    "Failed to save Marketplace Return.",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Delete Confirm
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            await apiService.deleteMarketplaceReturn(id);

            setSnackbar({

                open: true,

                message:

                    "Marketplace Return deleted successfully.",

                severity: "success"

            });

            setDeleteOpen(false);

            loadMarketplaceReturns();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:

                    "Failed to delete Marketplace Return.",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Refresh
    // ==========================================================

    const handleRefresh = () => {

        loadMarketplaceReturns();

    };
        // ==========================================================
    // Return UI
    // ==========================================================

    return (

        <Box className="marketplace-return-container">

            <MarketplaceReturnToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />

            <MarketplaceReturnStatistics
                statistics={statistics}
            />

            <MarketplaceReturnSearch
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

                    <MarketplaceReturnTable
                        marketplaceReturns={
                            paginatedMarketplaceReturns
                        }
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )

            }

            <MarketplaceReturnPagination
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

            <MarketplaceReturnModal
                open={modalOpen}
                marketplaceReturn={
                    selectedMarketplaceReturn
                }
                onClose={() =>
                    setModalOpen(false)
                }
                onSave={handleSave}
            />
                        <MarketplaceReturnView
                open={viewOpen}
                marketplaceReturn={
                    selectedMarketplaceReturn
                }
                onClose={() =>
                    setViewOpen(false)
                }
            />

            <DeleteMarketplaceReturnDialog
                open={deleteOpen}
                marketplaceReturn={
                    selectedMarketplaceReturn
                }
                onClose={() =>
                    setDeleteOpen(false)
                }
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

export default MarketplaceReturnList;