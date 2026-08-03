import React, {
    useEffect,
    useMemo,
    useState
} from "react";


import {
    Box,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    Grid
} from "@mui/material";


import apiService from "../../services/apiService";


import {
    PurchaseOrderItemToolbar,
    PurchaseOrderItemStatistics,
    PurchaseOrderItemSearch,
    PurchaseOrderItemTable,
    PurchaseOrderItemPagination,
    PurchaseOrderItemModal,
    PurchaseOrderItemView,
    DeletePurchaseOrderItemDialog,
    PurchaseOrderItemCard
} from "./index";



const PurchaseOrderItemList = () => {


    const [items, setItems] = useState([]);


    const [loading, setLoading] = useState(false);


    const [searchText, setSearchText] = useState("");



    const [page, setPage] = useState(1);


    const [pageSize, setPageSize] = useState(10);



    const [selectedItem, setSelectedItem] = useState(null);



    const [modalOpen, setModalOpen] = useState(false);


    const [viewOpen, setViewOpen] = useState(false);


    const [deleteOpen, setDeleteOpen] = useState(false);



    const [snackbar, setSnackbar] = useState({

        open: false,

        message: "",

        severity: "success"

    });



    // ==========================================================
    // Load Purchase Order Items
    // ==========================================================

    const loadItems = async () => {


        try {


            setLoading(true);


            const response =
                await apiService.getPurchaseOrderItems();



            setItems(

                response.data || []

            );


        }
        catch (error) {


            console.error(

                "Purchase Order Items Load Error",

                error

            );


            setSnackbar({

                open: true,

                message:
                    "Unable to load Purchase Order Items",

                severity: "error"

            });


        }
        finally {


            setLoading(false);


        }


    };




    useEffect(() => {


        loadItems();


    }, []);





    // ==========================================================
    // Search
    // ==========================================================


    const filteredItems = useMemo(() => {


        if (!searchText)

            return items;



        const search =
            searchText.toLowerCase();



        return items.filter(item =>



            String(

                item.PurchaseOrderItemId

            )

            .includes(search)



            ||

            String(

                item.PurchaseOrderId

            )

            .includes(search)



            ||

            String(

                item.ProductId

            )

            .includes(search)



            ||

            String(

                item.Quantity

            )

            .includes(search)



            ||

            String(

                item.UnitPrice

            )

            .includes(search)



        );



    }, [

        items,

        searchText

    ]);





    // ==========================================================
    // Pagination
    // ==========================================================


    const totalRecords =

        filteredItems.length;



    const totalPages =

        Math.ceil(

            totalRecords / pageSize

        );



    const pagedItems =

        filteredItems.slice(

            (page - 1) * pageSize,

            page * pageSize

        );





    // ==========================================================
    // Statistics
    // ==========================================================


    const statistics = useMemo(() => {


        return {


            totalItems:

                items.length,


            totalQuantity:

                items.reduce(

                    (sum, x) =>

                        sum +

                        Number(

                            x.Quantity || 0

                        ),

                    0

                ),



            totalAmount:

                items.reduce(

                    (sum, x) =>

                        sum +

                        Number(

                            x.TotalAmount || 0

                        ),

                    0

                ),



            totalTax:

                items.reduce(

                    (sum, x) =>

                        sum +

                        Number(

                            x.TaxAmount || 0

                        ),

                    0

                )


        };


    }, [items]);






    // ==========================================================
    // Actions
    // ==========================================================


    const handleAdd = () => {


        setSelectedItem(null);


        setModalOpen(true);


    };



    const handleEdit = (item) => {


        setSelectedItem(item);


        setModalOpen(true);


    };



    const handleView = (item) => {


        setSelectedItem(item);


        setViewOpen(true);


    };



    const handleDelete = (item) => {


        setSelectedItem(item);


        setDeleteOpen(true);


    };





    const handleSave = async(data) => {


        try {


            if(data.PurchaseOrderItemId){


                await apiService.updatePurchaseOrderItem(

                    data.PurchaseOrderItemId,

                    data

                );


            }

            else {


                await apiService.createPurchaseOrderItem(

                    data

                );


            }



            setModalOpen(false);


            loadItems();



            setSnackbar({

                open:true,

                message:"Purchase Order Item saved successfully",

                severity:"success"

            });



        }

        catch(error){


            console.error(error);


            setSnackbar({

                open:true,

                message:"Save failed",

                severity:"error"

            });


        }


    };





    const handleDeleteConfirm = async(id)=>{


        try{


            await apiService.deletePurchaseOrderItem(id);


            setDeleteOpen(false);


            loadItems();


            setSnackbar({

                open:true,

                message:"Deleted successfully",

                severity:"success"

            });


        }

        catch(error){


            console.error(error);


        }


    };






    if(loading){


        return (

            <Box

                display="flex"

                justifyContent="center"

                mt={5}

            >

                <CircularProgress/>


            </Box>

        );


    }





    return (


        <Box className="purchase-order-items-container">



            <Typography

                variant="h4"

                fontWeight="bold"

                mb={3}

            >

                Purchase Order Items


            </Typography>




            <PurchaseOrderItemToolbar

                onAdd={handleAdd}

                onRefresh={loadItems}

            />




            <PurchaseOrderItemStatistics

                statistics={statistics}

            />




            <PurchaseOrderItemSearch

                searchText={searchText}

                setSearchText={setSearchText}

            />




            <PurchaseOrderItemTable

                items={pagedItems}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />




            <PurchaseOrderItemPagination

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





            <PurchaseOrderItemModal

                open={modalOpen}

                item={selectedItem}

                onClose={()=>setModalOpen(false)}

                onSave={handleSave}

            />





            <PurchaseOrderItemView

                open={viewOpen}

                item={selectedItem}

                onClose={()=>setViewOpen(false)}

            />





            <DeletePurchaseOrderItemDialog

                open={deleteOpen}

                item={selectedItem}

                onClose={()=>setDeleteOpen(false)}

                onDeleted={handleDeleteConfirm}

            />





            <Snackbar

                open={snackbar.open}

                autoHideDuration={3000}

                onClose={()=>setSnackbar({

                    ...snackbar,

                    open:false

                })}

            >

                <Alert severity={snackbar.severity}>

                    {snackbar.message}

                </Alert>

            </Snackbar>



        </Box>


    );


};


export default PurchaseOrderItemList;