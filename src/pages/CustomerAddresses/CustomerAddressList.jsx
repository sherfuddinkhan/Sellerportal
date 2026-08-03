import React, { useEffect, useState } from "react";

import {
    Box
} from "@mui/material";

import apiService from "../../services/apiService";

import CustomerAddressToolbar from "./CustomerAddressToolbar";
import CustomerAddressStatistics from "./CustomerAddressStatistics";
import CustomerAddressSearch from "./CustomerAddressSearch";
import CustomerAddressTable from "./CustomerAddressTable";
import CustomerAddressPagination from "./CustomerAddressPagination";
import CustomerAddressModal from "./CustomerAddressModal";
import CustomerAddressView from "./CustomerAddressView";
import DeleteCustomerAddressDialog from "./DeleteCustomerAddressDialog";


const CustomerAddressList = () => {


    // ==========================================
    // State
    // ==========================================


    const [addresses, setAddresses] = useState([]);


    const [filteredAddresses, setFilteredAddresses] = useState([]);


    const [loading, setLoading] = useState(false);


    const [searchText, setSearchText] = useState("");


    const [addressTypeFilter, setAddressTypeFilter] =

        useState("All");


    const [selectedAddress, setSelectedAddress] = useState(null);


    const [modalOpen, setModalOpen] = useState(false);


    const [viewOpen, setViewOpen] = useState(false);


    const [deleteOpen, setDeleteOpen] = useState(false);


    const [page, setPage] = useState(1);


    const [pageSize, setPageSize] = useState(10);



    // ==========================================
    // Load Customer Addresses
    // ==========================================


    const loadCustomerAddresses = async () => {

        try {

            setLoading(true);


            const response =

                await apiService.getCustomerAddresses();


            setAddresses(

                response.data

            );


            setFilteredAddresses(

                response.data

            );


        }

        catch (error) {

            console.log(

                "Load Customer Addresses Error",

                error

            );

        }

        finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        loadCustomerAddresses();

    }, []);



    // ==========================================
    // Search & Filter
    // ==========================================


    useEffect(() => {


        let result = [

            ...addresses

        ];



        if (

            searchText.trim() !== ""

        ) {


            const search =

                searchText.toLowerCase();



            result = result.filter(item =>


                item.AddressType

                    ?.toLowerCase()

                    .includes(search)


                ||

                item.AddressLine1

                    ?.toLowerCase()

                    .includes(search)


                ||

                item.AddressLine2

                    ?.toLowerCase()

                    .includes(search)


                ||

                item.City

                    ?.toLowerCase()

                    .includes(search)


                ||

                item.State

                    ?.toLowerCase()

                    .includes(search)


                ||

                item.Country

                    ?.toLowerCase()

                    .includes(search)


                ||

                item.PostalCode

                    ?.toLowerCase()

                    .includes(search)

            );


        }



        if (

            addressTypeFilter !== "All"

        ) {


            result = result.filter(item =>


                item.AddressType ===

                addressTypeFilter


            );


        }



        setFilteredAddresses(result);


        setPage(1);



    }, [

        addresses,

        searchText,

        addressTypeFilter

    ]);



    // ==========================================
    // Pagination
    // ==========================================


    const totalPages = Math.ceil(

        filteredAddresses.length /

        pageSize

    );



    const pagedAddresses =

        filteredAddresses.slice(

            (page - 1) * pageSize,

            page * pageSize

        );



    // ==========================================
    // Save Address
    // ==========================================


    const handleSave = async (data) => {


        try {


            if (

                data.CustomerAddressId

            ) {


                await apiService.updateCustomerAddress(

                    data.CustomerAddressId,

                    data

                );


            }

            else {


                await apiService.createCustomerAddress(

                    data

                );


            }



            await loadCustomerAddresses();


            setModalOpen(false);


            setSelectedAddress(null);



        }

        catch(error) {


            console.log(

                "Save Address Error",

                error

            );


        }


    };
        // ==========================================
    // Delete Address
    // ==========================================


    const handleDelete = async (id) => {


        try {


            await apiService.deleteCustomerAddress(id);



            await loadCustomerAddresses();



            setDeleteOpen(false);


            setSelectedAddress(null);



        }

        catch(error) {


            console.log(

                "Delete Address Error",

                error

            );


        }


    };



    // ==========================================
    // Render
    // ==========================================


    return (

        <Box sx={{ p: 3 }}>


            <CustomerAddressToolbar

                onAdd={() => {


                    setSelectedAddress(null);


                    setModalOpen(true);


                }}


                onRefresh={loadCustomerAddresses}


                onExport={() =>

                    console.log(

                        "Export Customer Addresses"

                    )

                }

            />



            <CustomerAddressStatistics

                addresses={addresses}

            />



            <CustomerAddressSearch

                searchText={searchText}

                setSearchText={setSearchText}

                addressTypeFilter={addressTypeFilter}

                setAddressTypeFilter={

                    setAddressTypeFilter

                }

            />



            <CustomerAddressTable

                addresses={pagedAddresses}

                loading={loading}


                onView={(row) => {


                    setSelectedAddress(row);


                    setViewOpen(true);


                }}



                onEdit={(row) => {


                    setSelectedAddress(row);


                    setModalOpen(true);


                }}



                onDelete={(row) => {


                    setSelectedAddress(row);


                    setDeleteOpen(true);


                }}

            />



            <CustomerAddressPagination


                page={page}


                totalPages={totalPages}


                pageSize={pageSize}


                totalRecords={

                    filteredAddresses.length

                }


                onPageChange={setPage}



                onPageSizeChange={(size) => {


                    setPageSize(size);


                    setPage(1);


                }}

            />



            <CustomerAddressModal

                open={modalOpen}

                address={selectedAddress}


                onClose={() => {


                    setModalOpen(false);


                    setSelectedAddress(null);


                }}



                onSave={handleSave}

            />



            <CustomerAddressView

                open={viewOpen}


                address={selectedAddress}



                onClose={() => {


                    setViewOpen(false);


                    setSelectedAddress(null);


                }}

            />



            <DeleteCustomerAddressDialog

                open={deleteOpen}


                address={selectedAddress}



                onClose={() => {


                    setDeleteOpen(false);


                    setSelectedAddress(null);


                }}



                onDeleted={handleDelete}

            />


        </Box>

    );

};


export default CustomerAddressList;