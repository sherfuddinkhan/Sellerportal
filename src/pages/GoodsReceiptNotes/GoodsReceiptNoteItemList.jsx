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
    Alert
} from "@mui/material";


import apiService from "../../services/apiService";


import {

    GoodsReceiptNoteItemToolbar,

    GoodsReceiptNoteItemStatistics,

    GoodsReceiptNoteItemSearch,

    GoodsReceiptNoteItemTable,

    GoodsReceiptNoteItemPagination,

    GoodsReceiptNoteItemModal,

    GoodsReceiptNoteItemView,

    DeleteGoodsReceiptNoteItemDialog

} from "./index";





const GoodsReceiptNoteItemList = () => {



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


        open:false,


        message:"",


        severity:"success"


    });









    // ==========================================================
    // Load Goods Receipt Note Items
    // ==========================================================


    const loadGoodsReceiptNoteItems = async () => {


        try {


            setLoading(true);



            const response =

                await apiService.getGoodsReceiptNoteItems();




            setItems(

                response.data || []

            );



        }

        catch(error) {



            console.error(

                "Error loading GRN Items",

                error

            );



            setSnackbar({


                open:true,


                message:

                    "Failed to load Goods Receipt Note Items",


                severity:"error"



            });



        }

        finally {


            setLoading(false);


        }


    };








    useEffect(() => {


        loadGoodsReceiptNoteItems();



    }, []);









    // ==========================================================
    // Search Filter
    // ==========================================================


    const filteredItems = useMemo(() => {



        if(!searchText)

            return items;





        const search =

            searchText.toLowerCase();







        return items.filter(item =>





            String(

                item.GoodsReceiptNoteItemId

            )

            .includes(search)






            ||






            String(

                item.GoodsReceiptNoteId

            )

            .includes(search)






            ||






            String(

                item.ProductId

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



const paginatedItems =

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



        totalReceived:

            items.reduce(

                (sum, item) =>

                    sum +

                    Number(

                        item.ReceivedQuantity || 0

                    ),

                0

            ),




        totalRejected:

            items.reduce(

                (sum, item) =>

                    sum +

                    Number(

                        item.RejectedQuantity || 0

                    ),

                0

            ),





        totalAmount:

            items.reduce(

                (sum, item) =>

                    sum +

                    Number(

                        item.TotalAmount || 0

                    ),

                0

            )



    };



}, [items]);









// ==========================================================
// Add
// ==========================================================


const handleAdd = () => {


    setSelectedItem(null);


    setModalOpen(true);


};








// ==========================================================
// Edit
// ==========================================================


const handleEdit = (item) => {


    setSelectedItem(item);


    setModalOpen(true);


};









// ==========================================================
// Save
// ==========================================================


const handleSave = async (data) => {



    try {



        if(data.GoodsReceiptNoteItemId) {



            await apiService.updateGoodsReceiptNoteItem(

                data.GoodsReceiptNoteItemId,

                data

            );



            setSnackbar({


                open:true,


                message:

                    "GRN Item updated successfully",


                severity:"success"



            });



        }

        else {



            await apiService.createGoodsReceiptNoteItem(

                data

            );



            setSnackbar({


                open:true,


                message:

                    "GRN Item created successfully",


                severity:"success"



            });



        }







        setModalOpen(false);



        loadGoodsReceiptNoteItems();





    }

    catch(error) {



        console.error(

            "Save GRN Item Error",

            error

        );



        setSnackbar({


            open:true,


            message:

                "Failed to save GRN Item",


            severity:"error"



        });



    }



};









// ==========================================================
// View
// ==========================================================


const handleView = (item) => {



    setSelectedItem(item);



    setViewOpen(true);



};









// ==========================================================
// Delete
// ==========================================================


const handleDelete = (item) => {



    setSelectedItem(item);



    setDeleteOpen(true);



};









const confirmDelete = async (id) => {



    try {



        await apiService.deleteGoodsReceiptNoteItem(

            id

        );



        setSnackbar({


            open:true,


            message:

                "GRN Item deleted successfully",


            severity:"success"



        });





        setDeleteOpen(false);



        loadGoodsReceiptNoteItems();



    }

    catch(error) {



        console.error(

            "Delete GRN Item Error",

            error

        );



        setSnackbar({


            open:true,


            message:

                "Delete failed",


            severity:"error"



        });



    }



};









// ==========================================================
// Pagination Events
// ==========================================================


const handlePageChange = (value) => {


    setPage(value);


};






const handlePageSizeChange = (value) => {


    setPageSize(value);


    setPage(1);


};









// ==========================================================
// UI Return
// ==========================================================


return (



<Box

    className="goods-receipt-note-items-container"

>





    <Typography

        variant="h4"

        fontWeight="bold"

        mb={3}

    >


        Goods Receipt Note Items


    </Typography>







    <GoodsReceiptNoteItemToolbar


        onAdd={handleAdd}


        onRefresh={loadGoodsReceiptNoteItems}


    />








    <GoodsReceiptNoteItemStatistics


        statistics={statistics}


    />








    <GoodsReceiptNoteItemSearch


        searchText={searchText}


        setSearchText={setSearchText}


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



            <GoodsReceiptNoteItemTable


                items={paginatedItems}


                onView={handleView}


                onEdit={handleEdit}


                onDelete={handleDelete}


            />



        )



    }









    <GoodsReceiptNoteItemPagination


        page={page}


        totalPages={totalPages}


        pageSize={pageSize}


        totalRecords={totalRecords}


        onPageChange={handlePageChange}


        onPageSizeChange={handlePageSizeChange}


    />









    <GoodsReceiptNoteItemModal


        open={modalOpen}


        item={selectedItem}


        onClose={() =>

            setModalOpen(false)

        }


        onSave={handleSave}


    />









    <GoodsReceiptNoteItemView


        open={viewOpen}


        item={selectedItem}


        onClose={() =>

            setViewOpen(false)

        }


    />









    <DeleteGoodsReceiptNoteItemDialog


        open={deleteOpen}


        item={selectedItem}


        onClose={() =>

            setDeleteOpen(false)

        }


        onDeleted={confirmDelete}


    />









    <Snackbar


        open={snackbar.open}


        autoHideDuration={3000}


        onClose={() =>

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



};



export default GoodsReceiptNoteItemList;