import React, {useEffect,useState} from "react";
import {Box} from "@mui/material";
import OrderStatusHistoryToolbar from "./OrderStatusHistoryToolbar";
import OrderStatusHistoryStatistics from "./OrderStatusHistoryStatistics";
import OrderStatusHistorySearch from "./OrderStatusHistorySearch";
import OrderStatusHistoryTable from "./OrderStatusHistoryTable";
import OrderStatusHistoryPagination from "./OrderStatusHistoryPagination";
import OrderStatusHistoryModal from "./OrderStatusHistoryModal";
import OrderStatusHistoryView from "./OrderStatusHistoryView";
import DeleteOrderStatusHistoryDialog from "./DeleteOrderStatusHistoryDialog";



const OrderStatusHistoryList = () => {



    // ==========================================
    // State
    // ==========================================


    const [

        historyList,

        setHistoryList

    ] = useState([]);




    const [

        filteredHistory,

        setFilteredHistory

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

        selectedHistory,

        setSelectedHistory

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

        page,

        setPage

    ] = useState(1);




    const [

        pageSize,

        setPageSize

    ] = useState(10);







    // ==========================================
    // Load History Data
    // ==========================================


    const loadHistory = async () => {



        try {



            setLoading(true);




            const response =

                await apiService.getOrderStatusHistory();




            setHistoryList(

                response.data

            );




            setFilteredHistory(

                response.data

            );



        }

        catch(error) {



            console.log(

                "Load Order Status History Error",

                error

            );



        }

        finally {



            setLoading(false);



        }



    };








    useEffect(() => {



        loadHistory();




    }, []);









    // ==========================================
    // Search Filter
    // ==========================================


    useEffect(() => {



        let result = [

            ...historyList

        ];








        if (

            searchText.trim() !== ""

        ) {



            const search =

                searchText.toLowerCase();






            result = result.filter(item =>




                String(

                    item.OrderId

                )

                .includes(search)







                ||






                item.Status

                    ?.toLowerCase()

                    .includes(search)







            );



        }








        setFilteredHistory(

            result

        );



        setPage(1);



    }, [



        historyList,

        searchText



    ]);









    // ==========================================
    // Pagination
    // ==========================================


    const totalPages = Math.ceil(



        filteredHistory.length /

        pageSize



    );







    const pagedHistory =



        filteredHistory.slice(



            (page - 1) * pageSize,



            page * pageSize



        );









    // ==========================================
    // Save History
    // ==========================================


    const handleSave = async(data) => {



        try {



            if (

                data.HistoryId

            ) {



                await apiService.updateOrderStatusHistory(



                    data.HistoryId,



                    data



                );



            }

            else {



                await apiService.createOrderStatusHistory(

                    data

                );



            }







            await loadHistory();







            setModalOpen(false);



            setSelectedHistory(null);



        }

        catch(error) {



            console.log(

                "Save Order Status History Error",

                error

            );



        }



    };
        // ==========================================
    // Delete History Record
    // ==========================================


    const handleDelete = async (id) => {



        try {



            await apiService.deleteOrderStatusHistory(id);




            await loadHistory();




            setDeleteOpen(false);



            setSelectedHistory(null);



        }

        catch(error) {



            console.log(

                "Delete Order Status History Error",

                error

            );



        }



    };









    // ==========================================
    // Render
    // ==========================================


    return (



        <Box



            sx={{



                p: 3



            }}



        >







            <OrderStatusHistoryToolbar





                onAdd={() => {



                    setSelectedHistory(null);



                    setModalOpen(true);



                }}







                onRefresh={loadHistory}







                onExport={() =>



                    console.log(

                        "Export Order Status History"

                    )



                }



            />









            <OrderStatusHistoryStatistics



                history={historyList}



            />









            <OrderStatusHistorySearch



                searchText={searchText}



                setSearchText={setSearchText}



            />









            <OrderStatusHistoryTable



                items={pagedHistory}



                loading={loading}







                onView={(row) => {



                    setSelectedHistory(row);



                    setViewOpen(true);



                }}







                onEdit={(row) => {



                    setSelectedHistory(row);



                    setModalOpen(true);



                }}







                onDelete={(row) => {



                    setSelectedHistory(row);



                    setDeleteOpen(true);



                }}



            />









            <OrderStatusHistoryPagination



                page={page}



                totalPages={totalPages}



                pageSize={pageSize}



                totalRecords={

                    filteredHistory.length

                }







                onPageChange={setPage}







                onPageSizeChange={(size) => {



                    setPageSize(size);



                    setPage(1);



                }}



            />









            <OrderStatusHistoryModal



                open={modalOpen}



                item={selectedHistory}







                onClose={() => {



                    setModalOpen(false);



                    setSelectedHistory(null);



                }}







                onSave={handleSave}



            />









            <OrderStatusHistoryView



                open={viewOpen}



                item={selectedHistory}







                onClose={() => {



                    setViewOpen(false);



                    setSelectedHistory(null);



                }}



            />









            <DeleteOrderStatusHistoryDialog



                open={deleteOpen}



                item={selectedHistory}







                onClose={() => {



                    setDeleteOpen(false);



                    setSelectedHistory(null);



                }}







                onDeleted={handleDelete}



            />







        </Box>



    );

};



export default OrderStatusHistoryList;