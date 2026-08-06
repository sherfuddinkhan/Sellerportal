import React, {useEffect,useState} from "react";
import {Box} from "@mui/material";
import OrderItemToolbar from "./OrderItemToolbar";
import OrderItemStatistics from "./OrderItemStatistics";
import OrderItemSearch from "./OrderItemSearch";
import OrderItemTable from "./OrderItemTable";
import OrderItemPagination from "./OrderItemPagination";
import OrderItemModal from "./OrderItemModal";
import OrderItemView from "./OrderItemView";
import DeleteOrderItemDialog from "./DeleteOrderItemDialog";



const OrderItemList = () => {

    // ==========================================
    // State
    // ==========================================
    const [orderItems,setOrderItems] = useState([]);
    const [filteredItems,setFilteredItems] = useState([]);
    const [loading,setLoading] = useState(false);
    const [searchText,setSearchText] = useState("");
    const [selectedItem,setSelectedItem] = useState(null);
    const [modalOpen,setModalOpen] = useState(false);
    const [viewOpen,setViewOpen] = useState(false);
    const [deleteOpen,setDeleteOpen] = useState(false);
    const [page,setPage] = useState(1);
    const [ pageSize,setPageSize] = useState(10);
    // ==========================================
    // Load Order Items
    // ==========================================


    const loadOrderItems = async () => {

        try {



            setLoading(true);




            const response =

                await apiService.getOrderItems();




            setOrderItems(

                response.data

            );




            setFilteredItems(

                response.data

            );




        }

        catch(error) {



            console.log(

                "Load Order Items Error",

                error

            );



        }

        finally {



            setLoading(false);



        }



    };








    useEffect(() => {



        loadOrderItems();




    }, []);









    // ==========================================
    // Search Filter
    // ==========================================


    useEffect(() => {



        let result = [

            ...orderItems

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






                String(

                    item.ProductId

                )

                .includes(search)



            );



        }








        setFilteredItems(

            result

        );



        setPage(1);



    }, [



        orderItems,

        searchText



    ]);









    // ==========================================
    // Pagination
    // ==========================================


    const totalPages = Math.ceil(



        filteredItems.length /

        pageSize



    );







    const pagedItems =



        filteredItems.slice(



            (page - 1) * pageSize,



            page * pageSize



        );









    // ==========================================
    // Save Order Item
    // ==========================================


    const handleSave = async(data) => {



        try {



            if (

                data.OrderItemId

            ) {



                await apiService.updateOrderItem(



                    data.OrderItemId,



                    data



                );



            }

            else {



                await apiService.createOrderItem(

                    data

                );



            }







            await loadOrderItems();







            setModalOpen(false);



            setSelectedItem(null);




        }

        catch(error) {



            console.log(

                "Save Order Item Error",

                error

            );



        }



    };
        // ==========================================
    // Delete Order Item
    // ==========================================


    const handleDelete = async (id) => {


        try {


            await apiService.deleteOrderItem(id);




            await loadOrderItems();




            setDeleteOpen(false);



            setSelectedItem(null);



        }

        catch(error) {



            console.log(

                "Delete Order Item Error",

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







            <OrderItemToolbar





                onAdd={() => {



                    setSelectedItem(null);



                    setModalOpen(true);



                }}







                onRefresh={loadOrderItems}







                onExport={() =>



                    console.log(

                        "Export Order Items"

                    )



                }



            />









            <OrderItemStatistics



                items={orderItems}



            />









            <OrderItemSearch



                searchText={searchText}



                setSearchText={setSearchText}



            />









            <OrderItemTable



                items={pagedItems}



                loading={loading}







                onView={(row) => {



                    setSelectedItem(row);



                    setViewOpen(true);



                }}







                onEdit={(row) => {



                    setSelectedItem(row);



                    setModalOpen(true);



                }}







                onDelete={(row) => {



                    setSelectedItem(row);



                    setDeleteOpen(true);



                }}



            />









            <OrderItemPagination



                page={page}



                totalPages={totalPages}



                pageSize={pageSize}



                totalRecords={

                    filteredItems.length

                }







                onPageChange={setPage}







                onPageSizeChange={(size) => {



                    setPageSize(size);



                    setPage(1);



                }}



            />









            <OrderItemModal



                open={modalOpen}



                item={selectedItem}







                onClose={() => {



                    setModalOpen(false);



                    setSelectedItem(null);



                }}







                onSave={handleSave}



            />









            <OrderItemView



                open={viewOpen}



                item={selectedItem}







                onClose={() => {



                    setViewOpen(false);



                    setSelectedItem(null);



                }}



            />









            <DeleteOrderItemDialog



                open={deleteOpen}



                item={selectedItem}







                onClose={() => {



                    setDeleteOpen(false);



                    setSelectedItem(null);



                }}







                onDeleted={handleDelete}



            />







        </Box>



    );

};



export default OrderItemList;