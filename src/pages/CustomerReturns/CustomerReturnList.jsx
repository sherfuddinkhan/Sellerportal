// =========================================================
// CustomerReturnList.jsx
// Customer Return Management Page
// React -> server.js -> ASP.NET Core API
// =========================================================

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Snackbar,
} from "@mui/material";

import CustomerReturnToolbar from "./CustomerReturnToolbar";
import CustomerReturnStatistics from "./CustomerReturnStatistics";
import CustomerReturnSearch from "./CustomerReturnSearch";
import CustomerReturnTable from "./CustomerReturnTable";
import CustomerReturnPagination from "./CustomerReturnPagination";
import CustomerReturnModal from "./CustomerReturnModal";
import CustomerReturnView from "./CustomerReturnView";
import DeleteCustomerReturnDialog from "./DeleteCustomerReturnDialog";

// =========================================================
// CONFIGURATION
// =========================================================

// React does NOT call ASP.NET directly.
// React -> server.js
const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [returns, setReturns] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedReturn, setSelectedReturn] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD RETURNS
    // =====================================================

    const loadReturns = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading Customer Returns..."
            );

            // =================================================
            // GET
            //
            // React
            //    ↓
            // server.js
            //    ↓
            // ASP.NET Core
            //
            // GET /api/customer-returns
            // =================================================

            const response = await axios.get(
                `${SERVER_URL}/api/customer-returns`
            );

            console.log(
                "Customer Returns Response:",
                response.data
            );

            // Handle different possible API response shapes
            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ||
                      response.data?.items ||
                      response.data?.returns ||
                      [];

            setReturns(data);

        }
        catch (error) {

            console.error(
                "Load Customer Returns Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                `Unable to load customer returns. HTTP ${
                    error.response?.status || "Network Error"
                }`
            );

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadReturns();

    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredReturns = useMemo(() => {

        let result = [...returns];

        const search =
            searchText
                .trim()
                .toLowerCase();

        if (search !== "") {

            result = result.filter((item) => {

                return (

                    String(
                        item.CustomerReturnId ??
                        item.customerReturnId ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.SalesInvoiceId ??
                        item.salesInvoiceId ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.CustomerId ??
                        item.customerId ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.ProductId ??
                        item.productId ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.ReturnNumber ??
                        item.returnNumber ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.Reason ??
                        item.reason ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.Status ??
                        item.status ??
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                );

            });

        }

        return result;

    }, [
        returns,
        searchText,
    ]);

    // =====================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        setPage(1);

    }, [searchText]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredReturns.length /
                pageSize
            )
        );

    const pagedReturns =
        filteredReturns.slice(
            (page - 1) * pageSize,
            page * pageSize
        );

    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSave = async (data) => {

        try {

            setLoading(true);

            setError("");

            const customerReturnId =
                data.CustomerReturnId ??
                data.customerReturnId;

            // =================================================
            // UPDATE
            // =================================================

            if (customerReturnId) {

                console.log(
                    "Updating Customer Return:",
                    customerReturnId
                );

                await axios.put(

                    `${SERVER_URL}/api/customer-returns/${customerReturnId}`,

                    data,

                    {
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    }

                );

                setSuccess(
                    "Customer return updated successfully."
                );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                console.log(
                    "Creating Customer Return:",
                    data
                );

                await axios.post(

                    `${SERVER_URL}/api/customer-returns`,

                    data,

                    {
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    }

                );

                setSuccess(
                    "Customer return created successfully."
                );

            }

            // =================================================
            // REFRESH
            // =================================================

            await loadReturns();

            setModalOpen(false);

            setSelectedReturn(null);

        }
        catch (error) {

            console.error(
                "Save Customer Return Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                `Unable to save customer return. HTTP ${
                    error.response?.status || "Network Error"
                }`
            );

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "Deleting Customer Return:",
                id
            );

            await axios.delete(

                `${SERVER_URL}/api/customer-returns/${id}`

            );

            setSuccess(
                "Customer return deleted successfully."
            );

            await loadReturns();

            setDeleteOpen(false);

            setSelectedReturn(null);

        }
        catch (error) {

            console.error(
                "Delete Customer Return Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                `Unable to delete customer return. HTTP ${
                    error.response?.status || "Network Error"
                }`
            );

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedReturn(null);

        setModalOpen(true);

    };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (row) => {

        console.log(
            "View Customer Return:",
            row
        );

        setSelectedReturn(row);

        setViewOpen(true);

    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (row) => {

        console.log(
            "Edit Customer Return:",
            row
        );

        setSelectedReturn(row);

        setModalOpen(true);

    };

    // =====================================================
    // DELETE DIALOG
    // =====================================================

    const handleDeleteDialog = (row) => {

        console.log(
            "Delete Customer Return:",
            row
        );

        setSelectedReturn(row);

        setDeleteOpen(true);

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                p: 3,
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <CustomerReturnToolbar

                onAdd={handleAdd}

                onRefresh={loadReturns}

                onExport={() => {

                    console.log(
                        "Export Customer Returns"
                    );

                }}

            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <CustomerReturnStatistics
                returns={returns}
            />

            {/* =================================================
                SEARCH
            ================================================= */}

            <CustomerReturnSearch

                searchText={searchText}

                setSearchText={setSearchText}

            />

            {/* =================================================
                TABLE
            ================================================= */}

            <CustomerReturnTable

                items={pagedReturns}

                loading={loading}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={handleDeleteDialog}

            />

            {/* =================================================
                PAGINATION
            ================================================= */}

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

            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <CustomerReturnModal

                open={modalOpen}

                item={selectedReturn}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedReturn(null);

                }}

                onSave={handleSave}

            />

            {/* =================================================
                VIEW
            ================================================= */}

            <CustomerReturnView

                open={viewOpen}

                item={selectedReturn}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedReturn(null);

                }}

            />

            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteCustomerReturnDialog

                open={deleteOpen}

                item={selectedReturn}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedReturn(null);

                }}

                onDeleted={handleDelete}

            />

            {/* =================================================
                ERROR
            ================================================= */}

            <Snackbar

                open={Boolean(error)}

                autoHideDuration={5000}

                onClose={() =>
                    setError("")
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}

            >

                <Alert
                    severity="error"
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            </Snackbar>

            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar

                open={Boolean(success)}

                autoHideDuration={3000}

                onClose={() =>
                    setSuccess("")
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}

            >

                <Alert
                    severity="success"
                    onClose={() =>
                        setSuccess("")
                    }
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default CustomerReturnList;
