import React, {
    useEffect,
    useState
} from "react";


import {
    Box
} from "@mui/material";


import apiService from "../../services/apiService";


import ShipmentToolbar from "./ShipmentToolbar";
import ShipmentStatistics from "./ShipmentStatistics";
import ShipmentSearch from "./ShipmentSearch";
import ShipmentTable from "./ShipmentTable";
import ShipmentPagination from "./ShipmentPagination";
import ShipmentModal from "./ShipmentModal";
import ShipmentView from "./ShipmentView";
import DeleteShipmentDialog from "./DeleteShipmentDialog";



const ShipmentList = () => {



    // ==========================================
    // State
    // ==========================================


    const [

        shipments,

        setShipments

    ] = useState([]);




    const [

        filteredShipments,

        setFilteredShipments

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

        selectedShipment,

        setSelectedShipment

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
    // Load Shipments
    // ==========================================


    const loadShipments = async () => {



        try {



            setLoading(true);




            const response =

                await apiService.getShipments();




            setShipments(

                response.data

            );




            setFilteredShipments(

                response.data

            );



        }

        catch(error) {



            console.log(

                "Load Shipments Error",

                error

            );



        }

        finally {



            setLoading(false);



        }



    };








    useEffect(() => {



        loadShipments();




    }, []);









    // ==========================================
    // Search Filter
    // ==========================================


    useEffect(() => {



        let result = [

            ...shipments

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






                item.CourierName

                    ?.toLowerCase()

                    .includes(search)







                ||






                item.TrackingNumber

                    ?.toLowerCase()

                    .includes(search)







                ||






                item.ShipmentStatus

                    ?.toLowerCase()

                    .includes(search)





            );



        }








        setFilteredShipments(

            result

        );



        setPage(1);



    }, [



        shipments,

        searchText



    ]);









    // ==========================================
    // Pagination
    // ==========================================


    const totalPages = Math.ceil(



        filteredShipments.length /

        pageSize



    );







    const pagedShipments =



        filteredShipments.slice(



            (page - 1) * pageSize,



            page * pageSize



        );









    // ==========================================
    // Save Shipment
    // ==========================================


    const handleSave = async(data) => {



        try {



            if (

                data.ShipmentId

            ) {



                await apiService.updateShipment(



                    data.ShipmentId,



                    data



                );



            }

            else {



                await apiService.createShipment(

                    data

                );



            }







            await loadShipments();







            setModalOpen(false);



            setSelectedShipment(null);



        }

        catch(error) {



            console.log(

                "Save Shipment Error",

                error

            );



        }



    };
        // ==========================================
    // Delete Shipment
    // ==========================================


    const handleDelete = async (id) => {



        try {



            await apiService.deleteShipment(id);




            await loadShipments();




            setDeleteOpen(false);



            setSelectedShipment(null);



        }

        catch(error) {



            console.log(

                "Delete Shipment Error",

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







            <ShipmentToolbar





                onAdd={() => {



                    setSelectedShipment(null);



                    setModalOpen(true);



                }}







                onRefresh={loadShipments}







                onExport={() =>



                    console.log(

                        "Export Shipments"

                    )



                }



            />









            <ShipmentStatistics



                shipments={shipments}



            />









            <ShipmentSearch



                searchText={searchText}



                setSearchText={setSearchText}



            />









            <ShipmentTable



                items={pagedShipments}



                loading={loading}







                onView={(row) => {



                    setSelectedShipment(row);



                    setViewOpen(true);



                }}







                onEdit={(row) => {



                    setSelectedShipment(row);



                    setModalOpen(true);



                }}







                onDelete={(row) => {



                    setSelectedShipment(row);



                    setDeleteOpen(true);



                }}



            />









            <ShipmentPagination



                page={page}



                totalPages={totalPages}



                pageSize={pageSize}



                totalRecords={

                    filteredShipments.length

                }







                onPageChange={setPage}







                onPageSizeChange={(size) => {



                    setPageSize(size);



                    setPage(1);



                }}



            />









            <ShipmentModal



                open={modalOpen}



                item={selectedShipment}







                onClose={() => {



                    setModalOpen(false);



                    setSelectedShipment(null);



                }}







                onSave={handleSave}



            />









            <ShipmentView



                open={viewOpen}



                item={selectedShipment}







                onClose={() => {



                    setViewOpen(false);



                    setSelectedShipment(null);



                }}



            />









            <DeleteShipmentDialog



                open={deleteOpen}



                item={selectedShipment}







                onClose={() => {



                    setDeleteOpen(false);



                    setSelectedShipment(null);



                }}







                onDeleted={handleDelete}



            />







        </Box>



    );

};



export default ShipmentList;