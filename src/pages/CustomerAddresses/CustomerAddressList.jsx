import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import CustomerAddressToolbar from "./CustomerAddressToolbar";
import CustomerAddressStatistics from "./CustomerAddressStatistics";
import CustomerAddressSearch from "./CustomerAddressSearch";
import CustomerAddressTable from "./CustomerAddressTable";
import CustomerAddressPagination from "./CustomerAddressPagination";
import CustomerAddressModal from "./CustomerAddressModal";
import CustomerAddressView from "./CustomerAddressView";
import DeleteCustomerAddressDialog from "./DeleteCustomerAddressDialog";


// ============================================================
// API
// ============================================================

const API_URL =
    "http://localhost:5000/api/customer-addresses";


// ============================================================
// NORMALIZE ADDRESS
// Supports PascalCase + camelCase
// ============================================================

const normalizeAddress = (item = {}) => ({
    CustomerAddressId:
        item.CustomerAddressId ??
        item.customerAddressId ??
        0,

    CustomerId:
        item.CustomerId ??
        item.customerId ??
        0,

    AddressType:
        item.AddressType ??
        item.addressType ??
        "",

    AddressLine1:
        item.AddressLine1 ??
        item.addressLine1 ??
        "",

    AddressLine2:
        item.AddressLine2 ??
        item.addressLine2 ??
        "",

    City:
        item.City ??
        item.city ??
        "",

    State:
        item.State ??
        item.state ??
        "",

    Country:
        item.Country ??
        item.country ??
        "",

    PostalCode:
        item.PostalCode ??
        item.postalCode ??
        "",

    IsDefault:
        item.IsDefault ??
        item.isDefault ??
        false,

    CreatedDate:
        item.CreatedDate ??
        item.createdDate ??
        null
});


// ============================================================
// COMPONENT
// ============================================================

const CustomerAddressList = () => {

    // ========================================================
    // STATE
    // ========================================================

    const [addresses, setAddresses] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [addressTypeFilter, setAddressTypeFilter] =
        useState("All");

    const [selectedAddress, setSelectedAddress] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    // ========================================================
    // SNACKBAR
    // ========================================================

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    // ========================================================
    // SHOW MESSAGE
    // ========================================================

    const showMessage = (
        message,
        severity = "success"
    ) => {

        setSnackbar({
            open: true,
            message,
            severity
        });
    };


    // ========================================================
    // LOAD ALL CUSTOMER ADDRESSES
    // GET:
    // http://localhost:5000/api/customer-addresses
    // ========================================================

    const loadCustomerAddresses = useCallback(
        async () => {

            try {

                setLoading(true);

                const response =
                    await axios.get(API_URL);

                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

                const normalizedData =
                    data.map(normalizeAddress);

                setAddresses(normalizedData);

            }
            catch (error) {

                console.error(
                    "Load Customer Addresses Error:",
                    error
                );

                setAddresses([]);

                showMessage(
                    error.response?.data?.message ||
                    "Failed to load customer addresses.",
                    "error"
                );
            }
            finally {

                setLoading(false);

            }

        },
        []
    );


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadCustomerAddresses();

    }, [loadCustomerAddresses]);


    // ========================================================
    // SEARCH + FILTER
    // ========================================================

    const filteredAddresses = useMemo(() => {

        let result = [...addresses];

        // ----------------------------------------------------
        // SEARCH
        // ----------------------------------------------------

        if (searchText.trim() !== "") {

            const search =
                searchText
                    .trim()
                    .toLowerCase();

            result = result.filter((item) => {

                return (

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

                    ||

                    String(item.CustomerId)
                        .includes(search)

                );

            });
        }


        // ----------------------------------------------------
        // ADDRESS TYPE
        // ----------------------------------------------------

        if (addressTypeFilter !== "All") {

            result = result.filter(
                (item) =>
                    item.AddressType ===
                    addressTypeFilter
            );

        }

        return result;

    }, [
        addresses,
        searchText,
        addressTypeFilter
    ]);


    // ========================================================
    // RESET PAGE WHEN SEARCH/FILTER CHANGES
    // ========================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText,
        addressTypeFilter
    ]);


    // ========================================================
    // PAGINATION
    // ========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredAddresses.length /
                pageSize
            )
        );


    const pagedAddresses =
        useMemo(() => {

            const startIndex =
                (page - 1) * pageSize;

            return filteredAddresses.slice(
                startIndex,
                startIndex + pageSize
            );

        }, [
            filteredAddresses,
            page,
            pageSize
        ]);


    // ========================================================
    // CREATE / UPDATE
    // ========================================================

    const handleSave = async (data) => {

        try {

            setLoading(true);

            const customerAddressId =
                data.CustomerAddressId ??
                data.customerAddressId ??
                0;


            // =================================================
            // UPDATE
            // =================================================

            if (customerAddressId > 0) {

                const payload = {
                    ...data,

                    CustomerAddressId:
                        customerAddressId
                };

                await axios.put(
                    `${API_URL}/${customerAddressId}`,
                    payload
                );

                showMessage(
                    "Customer address updated successfully.",
                    "success"
                );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const payload = {
                    ...data,

                    CustomerAddressId: 0,

                    CreatedDate: null
                };

                await axios.post(
                    API_URL,
                    payload
                );

                showMessage(
                    "Customer address created successfully.",
                    "success"
                );

            }


            // =================================================
            // REFRESH
            // =================================================

            await loadCustomerAddresses();

            setModalOpen(false);

            setSelectedAddress(null);

        }
        catch (error) {

            console.error(
                "Save Customer Address Error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                "Failed to save customer address.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = async (id) => {

        try {

            setLoading(true);

            await axios.delete(
                `${API_URL}/${id}`
            );

            showMessage(
                "Customer address deleted successfully.",
                "success"
            );

            await loadCustomerAddresses();

            setDeleteOpen(false);

            setSelectedAddress(null);

        }
        catch (error) {

            console.error(
                "Delete Customer Address Error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                "Failed to delete customer address.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ========================================================
    // VIEW
    // ========================================================

    const handleView = (row) => {

        setSelectedAddress(row);

        setViewOpen(true);

    };


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = (row) => {

        setSelectedAddress(row);

        setModalOpen(true);

    };


    // ========================================================
    // DELETE DIALOG
    // ========================================================

    const handleDeleteClick = (row) => {

        setSelectedAddress(row);

        setDeleteOpen(true);

    };


    // ========================================================
    // ADD
    // ========================================================

    const handleAdd = () => {

        setSelectedAddress(null);

        setModalOpen(true);

    };


    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const handleModalClose = () => {

        setModalOpen(false);

        setSelectedAddress(null);

    };


    // ========================================================
    // CLOSE VIEW
    // ========================================================

    const handleViewClose = () => {

        setViewOpen(false);

        setSelectedAddress(null);

    };


    // ========================================================
    // CLOSE DELETE
    // ========================================================

    const handleDeleteClose = () => {

        setDeleteOpen(false);

        setSelectedAddress(null);

    };


    // ========================================================
    // PAGE SIZE
    // ========================================================

    const handlePageSizeChange = (size) => {

        setPageSize(size);

        setPage(1);

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                p: 3,
                position: "relative"
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <CustomerAddressToolbar

                onAdd={handleAdd}

                onRefresh={loadCustomerAddresses}

                onExport={() =>
                    console.log(
                        "Export Customer Addresses"
                    )
                }

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <CustomerAddressStatistics
                addresses={addresses}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <CustomerAddressSearch

                searchText={searchText}

                setSearchText={setSearchText}

                addressTypeFilter={
                    addressTypeFilter
                }

                setAddressTypeFilter={
                    setAddressTypeFilter
                }

            />


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && addresses.length === 0 ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 6
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                /* =============================================
                   TABLE
                ============================================= */

                <CustomerAddressTable

                    addresses={pagedAddresses}

                    loading={loading}

                    onView={handleView}

                    onEdit={handleEdit}

                    onDelete={handleDeleteClick}

                />

            )}


            {/* =================================================
                PAGINATION
            ================================================= */}

            <CustomerAddressPagination

                page={page}

                totalPages={totalPages}

                pageSize={pageSize}

                totalRecords={
                    filteredAddresses.length
                }

                onPageChange={setPage}

                onPageSizeChange={
                    handlePageSizeChange
                }

            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <CustomerAddressModal

                open={modalOpen}

                address={selectedAddress}

                onClose={handleModalClose}

                onSave={handleSave}

            />


            {/* =================================================
                VIEW
            ================================================= */}

            <CustomerAddressView

                open={viewOpen}

                address={selectedAddress}

                onClose={handleViewClose}

            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteCustomerAddressDialog

                open={deleteOpen}

                address={selectedAddress}

                onClose={handleDeleteClose}

                onDeleted={handleDelete}

            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar

                open={snackbar.open}

                autoHideDuration={4000}

                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false
                    }))
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}

            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false
                        }))
                    }
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );
};


export default CustomerAddressList;