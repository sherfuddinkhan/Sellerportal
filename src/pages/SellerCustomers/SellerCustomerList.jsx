import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SellerCustomerToolbar from "./SellerCustomerToolbar";
import SellerCustomerStatistics from "./SellerCustomerStatistics";
import SellerCustomerSearch from "./SellerCustomerSearch";
import SellerCustomerTable from "./SellerCustomerTable";
import SellerCustomerPagination from "./SellerCustomerPagination";
import SellerCustomerModal from "./SellerCustomerModal";
import SellerCustomerView from "./SellerCustomerView";
import DeleteSellerCustomerDialog from "./DeleteSellerCustomerDialog";

const SellerCustomerList = () => {

    // ==========================================
    // State
    // ==========================================

    const [customers, setCustomers] = useState([]);

    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    // ==========================================
    // Load Customers
    // ==========================================

    const loadSellerCustomers = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getSellerCustomers();

            setCustomers(response.data);

            setFilteredCustomers(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadSellerCustomers();

    }, []);

    // ==========================================
    // Search & Filter
    // ==========================================

    useEffect(() => {

        let result = [...customers];

        if (searchText.trim() !== "") {

            const search = searchText.toLowerCase();

            result = result.filter(item =>

                item.CustomerCode
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.CustomerName
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.ContactPerson
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.Email
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.Phone
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.GSTIN
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.City
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.State
                    ?.toLowerCase()
                    .includes(search));

        }

        if (statusFilter !== "All") {

            result = result.filter(item =>

                statusFilter === "Active"

                    ? item.IsActive

                    : !item.IsActive

            );

        }

        setFilteredCustomers(result);

        setPage(1);

    }, [

        customers,

        searchText,

        statusFilter

    ]);

    // ==========================================
    // Pagination
    // ==========================================

    const totalPages = Math.ceil(

        filteredCustomers.length /

        pageSize

    );

    const pagedCustomers =

        filteredCustomers.slice(

            (page - 1) * pageSize,

            page * pageSize

        );

    // ==========================================
    // Save Customer
    // ==========================================

    const handleSave = async (data) => {

        try {

            if (data.CustomerId) {

                await apiService.updateSellerCustomer(

                    data.CustomerId,

                    data

                );

            }

            else {

                await apiService.createSellerCustomer(

                    data

                );

            }

            await loadSellerCustomers();

            setModalOpen(false);

            setSelectedCustomer(null);

        }

        catch (err) {

            console.log(err);

        }

    };

    // ==========================================
    // Delete Customer
    // ==========================================

    const handleDelete = async (id) => {

        try {

            await apiService.deleteSellerCustomer(id);

            await loadSellerCustomers();

            setDeleteOpen(false);

            setSelectedCustomer(null);

        }

        catch (err) {

            console.log(err);

        }

    };
        // ==========================================
    // Render
    // ==========================================

    return (

        <Box sx={{ p: 3 }}>

            <SellerCustomerToolbar

                onAdd={() => {

                    setSelectedCustomer(null);

                    setModalOpen(true);

                }}

                onRefresh={loadSellerCustomers}

                onExport={() =>

                    console.log(

                        "Export Seller Customers"

                    )

                }

            />

            <SellerCustomerStatistics

                customers={customers}

            />

            <SellerCustomerSearch

                searchText={searchText}

                setSearchText={setSearchText}

                statusFilter={statusFilter}

                setStatusFilter={setStatusFilter}

            />

            <SellerCustomerTable

                customers={pagedCustomers}

                loading={loading}

                onView={(row) => {

                    setSelectedCustomer(row);

                    setViewOpen(true);

                }}

                onEdit={(row) => {

                    setSelectedCustomer(row);

                    setModalOpen(true);

                }}

                onDelete={(row) => {

                    setSelectedCustomer(row);

                    setDeleteOpen(true);

                }}

            />

            <SellerCustomerPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={

                    filteredCustomers.length

                }

                onPageChange={setPage}

                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}

            />

            <SellerCustomerModal

                open={modalOpen}

                customer={selectedCustomer}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedCustomer(null);

                }}

                onSave={handleSave}

            />

            <SellerCustomerView

                open={viewOpen}

                customer={selectedCustomer}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedCustomer(null);

                }}

            />

            <DeleteSellerCustomerDialog

                open={deleteOpen}

                customer={selectedCustomer}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedCustomer(null);

                }}

                onDeleted={handleDelete}

            />

        </Box>

    );

};

export default SellerCustomerList;