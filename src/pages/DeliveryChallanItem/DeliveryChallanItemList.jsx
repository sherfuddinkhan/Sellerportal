import React, {useEffect,useMemo,useState} from "react";
import {Box,CircularProgress,Alert,Snackbar} from "@mui/material";
import DeliveryChallanItemToolbar from "./DeliveryChallanItemToolbar";
import DeliveryChallanItemStatistics from "./DeliveryChallanItemStatistics";
import DeliveryChallanItemSearch from "./DeliveryChallanItemSearch";
import DeliveryChallanItemTable from "./DeliveryChallanItemTable";
import DeliveryChallanItemPagination from "./DeliveryChallanItemPagination";
import DeliveryChallanItemModal from "./DeliveryChallanItemModal";
import DeliveryChallanItemView from "./DeliveryChallanItemView";
import DeleteDeliveryChallanItemDialog from "./DeleteDeliveryChallanItemDialog";

const DeliveryChallanItemList = () => {
    // ==========================================================
    // State
    // ==========================================================

    const [deliveryChallanItems,setDeliveryChallanItems] = useState([]);
    const [loading,setLoading] = useState(false);
    const [searchText,setSearchText] = useState("");
    const [page,setPage] = useState(1);
    const [pageSize,setPageSize] = useState(10);
    const [selectedDeliveryChallanItem,setSelectedDeliveryChallanItem] = useState(null);
    const [modalOpen,setModalOpen] = useState(false);
    const [viewOpen,setViewOpen] = useState(false);
    const [deleteOpen,setDeleteOpen] = useState(false);
    const [snackbar,setSnackbar] = useState({open: false,message: "",severity: "success"});

    // ==========================================================
    // Load Delivery Challan Items
    // ==========================================================

    const loadDeliveryChallanItems = async () => {
        try {
            setLoading(true);
            const response = await apiService.getDeliveryChallanItems();
            setDeliveryChallanItems(
                response.data || []
            );
        }
        catch (error) {
            console.error(
                "Delivery Challan Item Load Error",
                error
            );
            setSnackbar({open: true,message:"Failed to load Delivery Challan Items.",severity: "error"});
        }
        finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // Initial Load
    // ==========================================================

    useEffect(() => {
        loadDeliveryChallanItems();
    }, []);
        // ==========================================================
    // Search Filter
    // ==========================================================

    const filteredDeliveryChallanItems = useMemo(() => {
        if (!searchText.trim())
            return deliveryChallanItems;
        const search = searchText.toLowerCase();
return deliveryChallanItems.filter((item) => (String(item.DeliveryChallanItemId).includes(search)||String(item.DeliveryChallanId).includes(search)||String(item.ProductId)
                .includes(search) || String(item.Quantity).includes(search)|| String(item.UnitPrice).includes(search)
            ||String(item.Discount) .includes(search)

            ||

            String(item.TaxAmount)
                .includes(search)

            ||

            String(item.TotalAmount)
                .includes(search)

            ||

            item.Remarks
                ?.toLowerCase()
                .includes(search)

        ));

    }, [
        deliveryChallanItems,
        searchText
    ]);



    // ==========================================================
    // Statistics
    // ==========================================================

    const statistics = useMemo(() => ({

        totalItems:
            deliveryChallanItems.length,

        totalQuantity:
            deliveryChallanItems.reduce(

                (sum, item) =>
                    sum + Number(item.Quantity || 0),

                0

            ),

        totalAmount:
            deliveryChallanItems.reduce(

                (sum, item) =>
                    sum + Number(item.TotalAmount || 0),

                0

            ),

        totalTax:
            deliveryChallanItems.reduce(

                (sum, item) =>
                    sum + Number(item.TaxAmount || 0),

                0

            )

    }), [deliveryChallanItems]);



    // ==========================================================
    // Pagination
    // ==========================================================

    const totalRecords =
        filteredDeliveryChallanItems.length;

    const totalPages =
        Math.ceil(totalRecords / pageSize);

    const paginatedDeliveryChallanItems =
        filteredDeliveryChallanItems.slice(

            (page - 1) * pageSize,

            page * pageSize

        );



    // ==========================================================
    // Add
    // ==========================================================

    const handleAdd = () => {

        setSelectedDeliveryChallanItem(null);

        setModalOpen(true);

    };



    // ==========================================================
    // Edit
    // ==========================================================

    const handleEdit = (item) => {

        setSelectedDeliveryChallanItem(item);

        setModalOpen(true);

    };



    // ==========================================================
    // View
    // ==========================================================

    const handleView = (item) => {

        setSelectedDeliveryChallanItem(item);

        setViewOpen(true);

    };



    // ==========================================================
    // Delete
    // ==========================================================

    const handleDelete = (item) => {

        setSelectedDeliveryChallanItem(item);

        setDeleteOpen(true);

    };



    // ==========================================================
    // Save
    // ==========================================================

    const handleSave = async (data) => {

        try {

            if (data.DeliveryChallanItemId) {

                await apiService.updateDeliveryChallanItem(

                    data.DeliveryChallanItemId,

                    data

                );

                setSnackbar({

                    open: true,

                    message:
                        "Delivery Challan Item updated successfully.",

                    severity: "success"

                });

            }
            else {

                await apiService.createDeliveryChallanItem(data);

                setSnackbar({

                    open: true,

                    message:
                        "Delivery Challan Item created successfully.",

                    severity: "success"

                });

            }

            setModalOpen(false);

            loadDeliveryChallanItems();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:
                    "Failed to save Delivery Challan Item.",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Delete Confirm
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            await apiService.deleteDeliveryChallanItem(id);

            setSnackbar({

                open: true,

                message:
                    "Delivery Challan Item deleted successfully.",

                severity: "success"

            });

            setDeleteOpen(false);

            loadDeliveryChallanItems();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:
                    "Failed to delete Delivery Challan Item.",

                severity: "error"

            });

        }

    };



    // ==========================================================
    // Refresh
    // ==========================================================

    const handleRefresh = () => {

        loadDeliveryChallanItems();

    };
        // ==========================================================
    // Return UI
    // ==========================================================

    return (

        <Box className="delivery-challan-item-container">

            <DeliveryChallanItemToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />

            <DeliveryChallanItemStatistics
                statistics={statistics}
            />

            <DeliveryChallanItemSearch
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

                    <DeliveryChallanItemTable
                        items={paginatedDeliveryChallanItems}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )

            }

            <DeliveryChallanItemPagination
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

            <DeliveryChallanItemModal
                open={modalOpen}
                deliveryChallanItem={selectedDeliveryChallanItem}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
                        <DeliveryChallanItemView
                open={viewOpen}
                deliveryChallanItem={selectedDeliveryChallanItem}
                onClose={() => setViewOpen(false)}
            />

            <DeleteDeliveryChallanItemDialog
                open={deleteOpen}
                deliveryChallanItem={selectedDeliveryChallanItem}
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

export default DeliveryChallanItemList;