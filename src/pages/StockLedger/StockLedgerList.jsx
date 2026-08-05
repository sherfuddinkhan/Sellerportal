import React, {useEffect,useMemo,useState} from "react";
import {Box,CircularProgress} from "@mui/material";
import {Alert,Snackbar} from "@mui/material";
import StockLedgerToolbar from "./StockLedgerToolbar";
import StockLedgerStatistics from "./StockLedgerStatistics";
import StockLedgerSearch from "./StockLedgerSearch";
import StockLedgerTable from "./StockLedgerTable";
import StockLedgerPagination from "./StockLedgerPagination";
import StockLedgerModal from "./StockLedgerModal";
import StockLedgerView from "./StockLedgerView";
import DeleteStockLedgerDialog from "./DeleteStockLedgerDialog";
const StockLedgerList = () => {
    // ==========================================================
    // State
    // ==========================================================
    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedLedger, setSelectedLedger] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open:false,
        message:"",
        severity:"success"
    });
    // ==========================================================
    // Load Stock Ledger Data
    // ==========================================================
    const loadStockLedgers = async () => {
        try {
            setLoading(true);
            const response =  await apiService.getStockLedgers();
            setLedgers( response.data || [] );
        }
        catch(error) {
            console.error( "Stock Ledger Load Error", error );
            setSnackbar({
                open:true,
                message:
                    "Failed to load stock ledger data",
                severity:
                    "error"
            });
        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStockLedgers();
    }, []);

    // ==========================================================
    // Search Filter
    // ==========================================================
    const filteredLedgers = useMemo(() => {
        if(!searchText.trim())
            return ledgers;
        const search =
            searchText.toLowerCase();
        return ledgers.filter((item) => {
            return (
                String( item.StockLedgerId)
                .includes(search)
                ||
                String( item.ProductId)
                .includes(search)
                ||
                String(item.WarehouseId)
                .includes(search)
                ||
                item.TransactionType
                ?.toLowerCase()
                .includes(search)
                ||
                item.ReferenceNumber
                ?.toLowerCase()
                .includes(search)
            );
        });
    }, [
        ledgers,
        searchText
    ]);
}

    // ==========================================================
    // Pagination Data
    // ==========================================================

    const totalRecords = filteredLedgers.length;
    const totalPages = Math.ceil(
        totalRecords / pageSize
    );
    const paginatedLedgers = filteredLedgers.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    // ==========================================================
    // Add
    // ==========================================================
    const handleAdd = () => {
        setSelectedLedger(null);
        setModalOpen(true);
    };
    // ==========================================================
    // Edit
    // ==========================================================
    const handleEdit = (ledger) => {
        setSelectedLedger(ledger);
        setModalOpen(true);
    };
    // ==========================================================
    // View
    // ==========================================================
    const handleView = (ledger) => {
        setSelectedLedger(ledger);
        setViewOpen(true);
    };
    // ==========================================================
    // Delete Open
    // ==========================================================
const handleDelete = (ledger) => {
        setSelectedLedger(ledger);
        setDeleteOpen(true);
    };
    // ==========================================================
    // Save Create / Update
    // ==========================================================
    const handleSave = async (data) => {
        try {
            if(data.StockLedgerId) {
                await apiService.updateStockLedger(
                    data.StockLedgerId,
                    data
                );
                setSnackbar({
                    open:true,
                    message: "Stock Ledger updated successfully",
                    severity: "success"
                });
            }
            else {
                await apiService.createStockLedger(
                    data
                );
                setSnackbar({
                   open:true,
                    message: "Stock Ledger created successfully",
                    severity: "success"
                });



            }







            setModalOpen(false);



            loadStockLedgers();



        }

        catch(error) {



            console.error(

                error

            );



            setSnackbar({



                open:true,



                message:

                    "Save failed",



                severity:

                    "error"



            });



        }



    };









    // ==========================================================
    // Delete Confirm
    // ==========================================================


    const handleDeleted = async (id) => {



        try {



            await apiService.deleteStockLedger(

                id

            );





            setSnackbar({



                open:true,



                message:

                    "Stock Ledger deleted successfully",



                severity:

                    "success"



            });





            setDeleteOpen(false);



            loadStockLedgers();



        }

        catch(error) {



            console.error(

                error

            );
            setSnackbar({
                open:true,
                message:
                    "Delete failed",
                severity:
                    "error"
            });
        }
    };

    // ==========================================================
    // Refresh
    // ==========================================================
    const handleRefresh = () => {
        loadStockLedgers();
    };
    // ==========================================================
    // Return UI
    // ==========================================================
    return (
        <Box
              className="stock-ledger-container"
        >
            <StockLedgerToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />
            <StockLedgerStatistics
                statistics={{
                    totalTransactions:
                        ledgers.length,
                    totalQuantity:
                        ledgers.reduce(
                            (sum,item)=>
                                sum +
                                Number(item.Quantity || 0),
                            0
                        ),
                    totalBalance:
                        ledgers.reduce(
                            (sum,item)=>
                                sum +
                                Number(item.BalanceQuantity || 0),
                            0
                        )
                }}
            />
            <StockLedgerSearch
                searchText={searchText}
                setSearchText={(value)=>{
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
                    <StockLedgerTable
                        items={paginatedLedgers}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )
            }
            <StockLedgerPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={setPage}
                onPageSizeChange={(size)=>{
                    setPageSize(size);
                    setPage(1);
                }}
            />
            <StockLedgerModal
                open={modalOpen}
                ledger={selectedLedger}
                onClose={()=>setModalOpen(false)}
                onSave={handleSave}
            />
            <StockLedgerView
                open={viewOpen}
                ledger={selectedLedger}
                onClose={()=>setViewOpen(false)}
            />
            <DeleteStockLedgerDialog
                open={deleteOpen}
                ledger={selectedLedger}
                onClose={()=>setDeleteOpen(false)}
                onDeleted={handleDeleted}
            />
            <Snackbar
                 open={snackbar.open}
                autoHideDuration={3000}
                onClose={()=>
                    setSnackbar({
                        ...snackbar,
                        open:false
                    })
                }
            >
                <Alert
               severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );

export default StockLedgerList;