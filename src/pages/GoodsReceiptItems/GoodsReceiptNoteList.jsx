import React, {useEffect,useMemo,useState} from "react";
import {Box,Typography,CircularProgress,Snackbar,Alert} from "@mui/material";
import {GoodsReceiptNoteToolbar,GoodsReceiptNoteStatistics,GoodsReceiptNoteSearch,GoodsReceiptNoteTable,GoodsReceiptNotePagination,GoodsReceiptNoteModal,GoodsReceiptNoteView,DeleteGoodsReceiptNoteDialog} from "./index";
const GoodsReceiptNoteList = () => {
    const [goodsReceiptNotes, setGoodsReceiptNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedGRN, setSelectedGRN] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });






    // ==========================================================
    // Load Goods Receipt Notes
    // ==========================================================


    const loadGoodsReceiptNotes = async () => {


        try {


            setLoading(true);



            const response =

                await apiService.getGoodsReceiptNotes();



            setGoodsReceiptNotes(

                response.data || []

            );



        }

        catch(error) {


            console.error(

                "Error loading Goods Receipt Notes",

                error

            );



            setSnackbar({

                open: true,

                message:

                    "Failed to load Goods Receipt Notes",

                severity: "error"

            });


        }

        finally {


            setLoading(false);


        }


    };





    useEffect(() => {


        loadGoodsReceiptNotes();


    }, []);







    // ==========================================================
    // Search Filter
    // ==========================================================


    const filteredNotes = useMemo(() => {


        if(!searchText)

            return goodsReceiptNotes;



        const search =

            searchText.toLowerCase();




        return goodsReceiptNotes.filter(note =>



            String(

                note.GoodsReceiptNoteId

            )

            .includes(search)



            ||



            String(

                note.GRNNumber

            )

            .toLowerCase()

            .includes(search)



            ||



            String(

                note.PurchaseOrderId

            )

            .includes(search)



            ||



            String(

                note.SupplierId

            )

            .includes(search)



            ||



            String(

                note.Status

            )

            .toLowerCase()

            .includes(search)



        );



    }, [

        goodsReceiptNotes,

        searchText

    ]);






    // ==========================================================
    // Pagination
    // ==========================================================


    const totalRecords =

        filteredNotes.length;



    const totalPages =

        Math.ceil(

            totalRecords / pageSize

        );



    const paginatedNotes =

        filteredNotes.slice(

            (page - 1) * pageSize,

            page * pageSize

        );





    // ==========================================================
    // Statistics
    // ==========================================================


    const statistics = useMemo(() => {


        return {


            totalGRN:

                goodsReceiptNotes.length,



            totalAmount:

                goodsReceiptNotes.reduce(

                    (sum, item) =>

                        sum +

                        Number(

                            item.TotalAmount || 0

                        ),

                    0

                ),



            completed:

                goodsReceiptNotes.filter(

                    x =>

                    x.Status === "Completed"

                ).length,



            pending:

                goodsReceiptNotes.filter(

                    x =>

                    x.Status === "Pending"

                ).length


        };


    }, [

        goodsReceiptNotes

    ]);


// ==========================================================
// Add / Edit
// ==========================================================


const handleAdd = () => {


    setSelectedGRN(null);


    setModalOpen(true);


};





const handleEdit = (item) => {


    setSelectedGRN(item);


    setModalOpen(true);


};






const handleSave = async (data) => {


    try {


        if(data.GoodsReceiptNoteId) {


            await apiService.updateGoodsReceiptNote(

                data.GoodsReceiptNoteId,

                data

            );



            setSnackbar({

                open:true,

                message:"Goods Receipt Note updated successfully",

                severity:"success"

            });


        }

        else {


            await apiService.createGoodsReceiptNote(

                data

            );



            setSnackbar({

                open:true,

                message:"Goods Receipt Note created successfully",

                severity:"success"

            });


        }




        setModalOpen(false);



        loadGoodsReceiptNotes();



    }

    catch(error) {


        console.error(

            "Save GRN Error",

            error

        );



        setSnackbar({

            open:true,

            message:"Failed to save Goods Receipt Note",

            severity:"error"

        });


    }


};






// ==========================================================
// View
// ==========================================================


const handleView = (item) => {


    setSelectedGRN(item);


    setViewOpen(true);


};







// ==========================================================
// Delete
// ==========================================================


const handleDelete = (item) => {


    setSelectedGRN(item);


    setDeleteOpen(true);


};







const confirmDelete = async (id) => {


    try {


        await apiService.deleteGoodsReceiptNote(

            id

        );



        setSnackbar({

            open:true,

            message:"Goods Receipt Note deleted successfully",

            severity:"success"

        });



        setDeleteOpen(false);



        loadGoodsReceiptNotes();



    }

    catch(error) {


        console.error(

            "Delete GRN Error",

            error

        );



        setSnackbar({

            open:true,

            message:"Delete failed",

            severity:"error"

        });


    }


};







const handlePageChange = (

    value

) => {


    setPage(value);


};







const handlePageSizeChange = (

    value

) => {


    setPageSize(value);


    setPage(1);


};







return (



    <Box

        className="goods-receipt-notes-container"

    >



        <Typography

            variant="h4"

            fontWeight="bold"

            mb={3}

        >


            Goods Receipt Notes


        </Typography>






        <GoodsReceiptNoteToolbar


            onAdd={handleAdd}


            onRefresh={loadGoodsReceiptNotes}


        />






        <GoodsReceiptNoteStatistics


            statistics={statistics}


        />






        <GoodsReceiptNoteSearch


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

                <GoodsReceiptNoteTable


                    notes={paginatedNotes}


                    onView={handleView}


                    onEdit={handleEdit}


                    onDelete={handleDelete}


                />

            )


        }








        <GoodsReceiptNotePagination


            page={page}


            totalPages={totalPages}


            pageSize={pageSize}


            totalRecords={totalRecords}


            onPageChange={handlePageChange}


            onPageSizeChange={handlePageSizeChange}


        />








        <GoodsReceiptNoteModal


            open={modalOpen}


            note={selectedGRN}


            onClose={() => setModalOpen(false)}


            onSave={handleSave}


        />







        <GoodsReceiptNoteView


            open={viewOpen}


            note={selectedGRN}


            onClose={() => setViewOpen(false)}


        />







        <DeleteGoodsReceiptNoteDialog


            open={deleteOpen}


            note={selectedGRN}


            onClose={() => setDeleteOpen(false)}


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



export default GoodsReceiptNoteList;