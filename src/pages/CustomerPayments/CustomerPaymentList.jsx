import React, {
    useEffect,
    useState
} from "react";


import {
    Box
} from "@mui/material";


import apiService from "../../services/apiService";


import CustomerPaymentToolbar from "./CustomerPaymentToolbar";
import CustomerPaymentStatistics from "./CustomerPaymentStatistics";
import CustomerPaymentSearch from "./CustomerPaymentSearch";
import CustomerPaymentTable from "./CustomerPaymentTable";
import CustomerPaymentPagination from "./CustomerPaymentPagination";
import CustomerPaymentModal from "./CustomerPaymentModal";
import CustomerPaymentView from "./CustomerPaymentView";
import DeleteCustomerPaymentDialog from "./DeleteCustomerPaymentDialog";



const CustomerPaymentList = () => {



    // ==========================================
    // State
    // ==========================================


    const [

        payments,

        setPayments

    ] = useState([]);



    const [

        filteredPayments,

        setFilteredPayments

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

        paymentModeFilter,

        setPaymentModeFilter

    ] = useState("All");



    const [

        selectedPayment,

        setSelectedPayment

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
    // Load Payments
    // ==========================================


    const loadPayments = async () => {


        try {


            setLoading(true);



            const response =

                await apiService.getCustomerPayments();



            setPayments(

                response.data

            );



            setFilteredPayments(

                response.data

            );



        }

        catch(error) {


            console.log(

                "Load Customer Payments Error",

                error

            );


        }

        finally {


            setLoading(false);


        }


    };




    useEffect(() => {


        loadPayments();


    }, []);




    // ==========================================
    // Search & Filter
    // ==========================================


    useEffect(() => {


        let result = [

            ...payments

        ];



        if (

            searchText.trim() !== ""

        ) {



            const search =

                searchText.toLowerCase();



            result = result.filter(item =>



                item.PaymentNumber

                    ?.toLowerCase()

                    .includes(search)



                ||



                item.PaymentMode

                    ?.toLowerCase()

                    .includes(search)



                ||



                item.ReferenceNumber

                    ?.toLowerCase()

                    .includes(search)



                ||



                item.Remarks

                    ?.toLowerCase()

                    .includes(search)



            );


        }



        if (

            paymentModeFilter !== "All"

        ) {



            result = result.filter(item =>


                item.PaymentMode ===

                paymentModeFilter


            );


        }



        setFilteredPayments(result);



        setPage(1);



    }, [

        payments,

        searchText,

        paymentModeFilter

    ]);




    // ==========================================
    // Pagination
    // ==========================================


    const totalPages = Math.ceil(

        filteredPayments.length /

        pageSize

    );



    const pagedPayments =

        filteredPayments.slice(

            (page - 1) * pageSize,

            page * pageSize

        );




    // ==========================================
    // Save Payment
    // ==========================================


    const handleSave = async(data) => {


        try {



            if (

                data.CustomerPaymentId

            ) {


                await apiService.updateCustomerPayment(

                    data.CustomerPaymentId,

                    data

                );


            }

            else {


                await apiService.createCustomerPayment(

                    data

                );


            }



            await loadPayments();



            setModalOpen(false);



            setSelectedPayment(null);



        }

        catch(error) {


            console.log(

                "Save Customer Payment Error",

                error

            );


        }


    };
        // ==========================================
    // Delete Payment
    // ==========================================


    const handleDelete = async (id) => {


        try {


            await apiService.deleteCustomerPayment(id);



            await loadPayments();



            setDeleteOpen(false);



            setSelectedPayment(null);



        }

        catch(error) {


            console.log(

                "Delete Customer Payment Error",

                error

            );


        }


    };



    // ==========================================
    // Render
    // ==========================================


    return (

        <Box sx={{ p: 3 }}>


            <CustomerPaymentToolbar

                onAdd={() => {


                    setSelectedPayment(null);


                    setModalOpen(true);


                }}



                onRefresh={loadPayments}



                onExport={() =>


                    console.log(

                        "Export Customer Payments"

                    )


                }

            />



            <CustomerPaymentStatistics

                payments={payments}

            />



            <CustomerPaymentSearch

                searchText={searchText}

                setSearchText={setSearchText}

                paymentModeFilter={paymentModeFilter}

                setPaymentModeFilter={

                    setPaymentModeFilter

                }

            />



            <CustomerPaymentTable

                payments={pagedPayments}

                loading={loading}



                onView={(row) => {


                    setSelectedPayment(row);


                    setViewOpen(true);


                }}



                onEdit={(row) => {


                    setSelectedPayment(row);


                    setModalOpen(true);


                }}



                onDelete={(row) => {


                    setSelectedPayment(row);


                    setDeleteOpen(true);


                }}

            />



            <CustomerPaymentPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={

                    filteredPayments.length

                }



                onPageChange={setPage}



                onPageSizeChange={(size) => {


                    setPageSize(size);


                    setPage(1);


                }}

            />



            <CustomerPaymentModal

                open={modalOpen}

                payment={selectedPayment}



                onClose={() => {


                    setModalOpen(false);


                    setSelectedPayment(null);


                }}



                onSave={handleSave}

            />



            <CustomerPaymentView

                open={viewOpen}

                payment={selectedPayment}



                onClose={() => {


                    setViewOpen(false);


                    setSelectedPayment(null);


                }}

            />



            <DeleteCustomerPaymentDialog

                open={deleteOpen}

                payment={selectedPayment}



                onClose={() => {


                    setDeleteOpen(false);


                    setSelectedPayment(null);


                }}



                onDeleted={handleDelete}

            />


        </Box>

    );

};



export default CustomerPaymentList;