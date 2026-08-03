import React, {
    useEffect,
    useState
} from "react";


import {
    Box
} from "@mui/material";


import apiService from "../../services/apiService";


import OrderToolbar from "./OrderToolbar";
import OrderStatistics from "./OrderStatistics";
import OrderSearch from "./OrderSearch";
import OrderTable from "./OrderTable";
import OrderPagination from "./OrderPagination";
import OrderModal from "./OrderModal";
import OrderView from "./OrderView";
import DeleteOrderDialog from "./DeleteOrderDialog";



const OrderList = () => {



    // ==========================================
    // State
    // ==========================================


    const [

        orders,

        setOrders

    ] = useState([]);




    const [

        filteredOrders,

        setFilteredOrders

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

        statusFilter,

        setStatusFilter

    ] = useState("All");




    const [

        selectedOrder,

        setSelectedOrder

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
    // Load Orders
    // ==========================================


    const loadOrders = async () => {


        try {


            setLoading(true);



            const response =

                await apiService.getOrders();



            setOrders(

                response.data

            );



            setFilteredOrders(

                response.data

            );



        }

        catch(error) {


            console.log(

                "Load Orders Error",

                error

            );


        }

        finally {


            setLoading(false);


        }


    };






    useEffect(() => {


        loadOrders();



    }, []);








    // ==========================================
    // Search & Filter
    // ==========================================


    useEffect(() => {



        let result = [

            ...orders

        ];





        if (

            searchText.trim() !== ""

        ) {



            const search =

                searchText.toLowerCase();




            result = result.filter(item =>




                item.OrderNumber

                    ?.toLowerCase()

                    .includes(search)




                ||




                item.OrderStatus

                    ?.toLowerCase()

                    .includes(search)



            );



        }







        if (

            statusFilter !== "All"

        ) {



            result = result.filter(item =>



                item.OrderStatus ===

                statusFilter



            );



        }






        setFilteredOrders(

            result

        );



        setPage(1);



    }, [

        orders,

        searchText,

        statusFilter

    ]);









    // ==========================================
    // Pagination
    // ==========================================


    const totalPages = Math.ceil(


        filteredOrders.length /

        pageSize


    );




    const pagedOrders =



        filteredOrders.slice(



            (page - 1) * pageSize,



            page * pageSize



        );








    // ==========================================
    // Save Order
    // ==========================================


    const handleSave = async(data) => {


        try {


            if (

                data.OrderId

            ) {



                await apiService.updateOrder(

                    data.OrderId,

                    data

                );



            }

            else {



                await apiService.createOrder(

                    data

                );



            }




            await loadOrders();




            setModalOpen(false);



            setSelectedOrder(null);



        }

        catch(error) {


            console.log(

                "Save Order Error",

                error

            );


        }


    };
        // ==========================================
    // Delete Order
    // ==========================================


    const handleDelete = async (id) => {


        try {


            await apiService.deleteOrder(id);



            await loadOrders();



            setDeleteOpen(false);



            setSelectedOrder(null);



        }

        catch(error) {


            console.log(

                "Delete Order Error",

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




            <OrderToolbar



                onAdd={() => {



                    setSelectedOrder(null);



                    setModalOpen(true);



                }}




                onRefresh={loadOrders}




                onExport={() =>



                    console.log(

                        "Export Orders"

                    )



                }



            />







            <OrderStatistics



                orders={orders}



            />







            <OrderSearch



                searchText={searchText}



                setSearchText={setSearchText}



                statusFilter={statusFilter}



                setStatusFilter={

                    setStatusFilter

                }



            />









            <OrderTable



                orders={pagedOrders}



                loading={loading}




                onView={(row) => {



                    setSelectedOrder(row);



                    setViewOpen(true);



                }}







                onEdit={(row) => {



                    setSelectedOrder(row);



                    setModalOpen(true);



                }}







                onDelete={(row) => {



                    setSelectedOrder(row);



                    setDeleteOpen(true);



                }}



            />









            <OrderPagination



                page={page}



                totalPages={totalPages}



                pageSize={pageSize}



                totalRecords={

                    filteredOrders.length

                }





                onPageChange={setPage}







                onPageSizeChange={(size) => {



                    setPageSize(size);



                    setPage(1);



                }}



            />









            <OrderModal



                open={modalOpen}



                order={selectedOrder}







                onClose={() => {



                    setModalOpen(false);



                    setSelectedOrder(null);



                }}







                onSave={handleSave}



            />









            <OrderView



                open={viewOpen}



                order={selectedOrder}







                onClose={() => {



                    setViewOpen(false);



                    setSelectedOrder(null);



                }}



            />









            <DeleteOrderDialog



                open={deleteOpen}



                order={selectedOrder}







                onClose={() => {



                    setDeleteOpen(false);



                    setSelectedOrder(null);



                }}







                onDeleted={handleDelete}



            />






        </Box>


    );

};



export default OrderList;