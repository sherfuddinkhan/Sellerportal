import React, {
    useEffect,
    useState
} from "react";


import {
    Box
} from "@mui/material";


import apiService from "../../services/apiService";


import CustomerReturnToolbar from "./CustomerReturnToolbar";
import CustomerReturnStatistics from "./CustomerReturnStatistics";
import CustomerReturnSearch from "./CustomerReturnSearch";
import CustomerReturnTable from "./CustomerReturnTable";
import CustomerReturnPagination from "./CustomerReturnPagination";
import CustomerReturnModal from "./CustomerReturnModal";
import CustomerReturnView from "./CustomerReturnView";
import DeleteCustomerReturnDialog from "./DeleteCustomerReturnDialog";



const CustomerReturnList = () => {



    // ==========================================
    // State
    // ==========================================


    const [

        returns,

        setReturns

    ] = useState([]);




    const [

        filteredReturns,

        setFilteredReturns

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

        selectedReturn,

        setSelectedReturn

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
    // Load Customer Returns
    // ==========================================


    const loadReturns = async () => {



        try {



            setLoading(true);




            const response =

                await apiService.getCustomerReturns();




            setReturns(

                response.data

            );




            setFilteredReturns(

                response.data

            );



        }

        catch(error) {



            console.log(

                "Load Customer Returns Error",

                error

            );



        }

        finally {



            setLoading(false);



        }



    };








    useEffect(() => {



        loadReturns();




    }, []);









    // ==========================================
    // Search Filter
    // ==========================================


    useEffect(() => {



        let result = [

            ...returns

        ];








        if (

            searchText.trim() !== ""

        ) {



            const search =

                searchText.toLowerCase();






            result = result.filter(item =>





                String(

                    item.SalesInvoiceId

                )

                .includes(search)







                ||






                String(

                    item.ProductId

                )

                .includes(search)







                ||






                item.ReturnNumber

                    ?.toLowerCase()

                    .includes(search)







                ||






                item.Reason

                    ?.toLowerCase()

                    .includes(search)







                ||






                item.Status

                    ?.toLowerCase()

                    .includes(search)





            );



        }








        setFilteredReturns(

            result

        );



        setPage(1);



    }, [



        returns,

        searchText



    ]);









    // ==========================================
    // Pagination
    // ==========================================


    const totalPages = Math.ceil(



        filteredReturns.length /

        pageSize



    );







    const pagedReturns =



        filteredReturns.slice(



            (page - 1) * pageSize,



            page * pageSize



        );









    // ==========================================
    // Save Return
    // ==========================================


    const handleSave = async(data) => {



        try {



            if (

                data.CustomerReturnId

            ) {



                await apiService.updateCustomerReturn(



                    data.CustomerReturnId,



                    data



                );



            }

            else {



                await apiService.createCustomerReturn(

                    data

                );



            }







            await loadReturns();







            setModalOpen(false);



            setSelectedReturn(null);



        }

        catch(error) {



            console.log(

                "Save Customer Return Error",

                error

            );



        }



    };
        // ==========================================
    // Delete Customer Return
    // ==========================================


    const handleDelete = async (id) => {



        try {



            await apiService.deleteCustomerReturn(id);




            await loadReturns();




            setDeleteOpen(false);



            setSelectedReturn(null);



        }

        catch(error) {



            console.log(

                "Delete Customer Return Error",

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







            <CustomerReturnToolbar





                onAdd={() => {



                    setSelectedReturn(null);



                    setModalOpen(true);



                }}







                onRefresh={loadReturns}







                onExport={() =>



                    console.log(

                        "Export Customer Returns"

                    )



                }



            />









            <CustomerReturnStatistics



                returns={returns}



            />









            <CustomerReturnSearch



                searchText={searchText}



                setSearchText={setSearchText}



            />









            <CustomerReturnTable



                items={pagedReturns}



                loading={loading}







                onView={(row) => {



                    setSelectedReturn(row);



                    setViewOpen(true);



                }}







                onEdit={(row) => {



                    setSelectedReturn(row);



                    setModalOpen(true);



                }}







                onDelete={(row) => {



                    setSelectedReturn(row);



                    setDeleteOpen(true);



                }}



            />









            <CustomerReturnPagination



                page={page}



                totalPages={totalPages}



                pageSize={pageSize}



                totalRecords={

                    filteredReturns.length

                }







                onPageChange={setPage}







                onPageSizeChange={(size) => {



                    setPageSize(size);



                    setPage(1);



                }}



            />









            <CustomerReturnModal



                open={modalOpen}



                item={selectedReturn}







                onClose={() => {



                    setModalOpen(false);



                    setSelectedReturn(null);



                }}







                onSave={handleSave}



            />









            <CustomerReturnView



                open={viewOpen}



                item={selectedReturn}







                onClose={() => {



                    setViewOpen(false);



                    setSelectedReturn(null);



                }}



            />









            <DeleteCustomerReturnDialog



                open={deleteOpen}



                item={selectedReturn}







                onClose={() => {



                    setDeleteOpen(false);



                    setSelectedReturn(null);



                }}







                onDeleted={handleDelete}



            />







        </Box>



    );

};



export default CustomerReturnList;