import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

import GoodsReceiptNoteToolbar
    from "./GoodsReceiptNoteToolbar";

import GoodsReceiptNoteStatistics
    from "./GoodsReceiptNoteStatistics";

import GoodsReceiptNoteSearch
    from "./GoodsReceiptNoteSearch";

import GoodsReceiptNoteTable
    from "./GoodsReceiptNoteTable";

import GoodsReceiptNotePagination
    from "./GoodsReceiptNotePagination";

import GoodsReceiptNoteModal
    from "./GoodsReceiptNoteModal";

import GoodsReceiptNoteView
    from "./GoodsReceiptNoteView";

import DeleteGoodsReceiptNoteDialog
    from "./DeleteGoodsReceiptNoteDialog";




/* =========================================================
   GOODS RECEIPT NOTE API
========================================================= */

const GRN_API =
    `${SERVER_URL}/api/goods-receipt-notes`;


const GoodsReceiptNoteList = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [
        goodsReceiptNotes,
        setGoodsReceiptNotes
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
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    const [
        selectedGRN,
        setSelectedGRN
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
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    /* =====================================================
       LOAD GOODS RECEIPT NOTES
       GET:
       http://localhost:5000/api/goods-receipt-notes/all
    ===================================================== */

    const loadGoodsReceiptNotes = async () => {

        try {

            setLoading(true);

            console.log(
                "GET ALL GOODS RECEIPT NOTES"
            );

            const response = await axios.get(
                `${GRN_API}/all`
            );

            console.log(
                "GOODS RECEIPT NOTES RESPONSE:",
                response.data
            );

            const data = response.data;

            /*
             * Support both:
             *
             * [
             *   {...},
             *   {...}
             * ]
             *
             * and:
             *
             * {
             *   items: [...]
             * }
             */

            if (Array.isArray(data)) {

                setGoodsReceiptNotes(data);

            }
            else if (
                data &&
                Array.isArray(data.items)
            ) {

                setGoodsReceiptNotes(
                    data.items
                );

            }
            else {

                setGoodsReceiptNotes([]);
            }

            setPage(1);

        }
        catch (error) {

            console.error(
                "Error loading Goods Receipt Notes:",
                error
            );

            setGoodsReceiptNotes([]);

            setSnackbar({
                open: true,
                message:
                    "Failed to load Goods Receipt Notes",
                severity: "error"
            });

        }
        finally {

            setLoading(false);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadGoodsReceiptNotes();

    }, []);


    /* =====================================================
       SEARCH FILTER
    ===================================================== */

    const filteredNotes = useMemo(() => {

        if (!searchText.trim()) {

            return goodsReceiptNotes;
        }

        const search =
            searchText
                .toLowerCase()
                .trim();

        return goodsReceiptNotes.filter(
            (note) => {

                return (

                    String(
                        note.GoodsReceiptNoteId ?? ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        note.GRNNumber ?? ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        note.PurchaseOrderId ?? ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        note.SupplierId ?? ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        note.Status ?? ""
                    )
                    .toLowerCase()
                    .includes(search)

                );
            }
        );

    }, [
        goodsReceiptNotes,
        searchText
    ]);


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalRecords =
        filteredNotes.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );

    const paginatedNotes =
        filteredNotes.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {

        return {

            totalGRN:
                goodsReceiptNotes.length,

            totalAmount:
                goodsReceiptNotes.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.TotalAmount ?? 0
                        ),
                    0
                ),

            completed:
                goodsReceiptNotes.filter(
                    (item) =>
                        String(
                            item.Status ?? ""
                        ).toLowerCase() ===
                        "completed"
                ).length,

            pending:
                goodsReceiptNotes.filter(
                    (item) =>
                        String(
                            item.Status ?? ""
                        ).toLowerCase() ===
                        "pending"
                ).length
        };

    }, [
        goodsReceiptNotes
    ]);


    /* =====================================================
       ADD
    ===================================================== */

    const handleAdd = () => {

        setSelectedGRN(null);

        setModalOpen(true);
    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (item) => {

        setSelectedGRN(item);

        setModalOpen(true);
    };


    /* =====================================================
       CREATE / UPDATE
    ===================================================== */

    const handleSave = async (data) => {

        try {

            console.log(
                "SAVE GOODS RECEIPT NOTE:",
                data
            );

            /*
             * UPDATE
             */

            if (
                data.GoodsReceiptNoteId
            ) {

                const response =
                    await axios.put(
                        `${GRN_API}/${data.GoodsReceiptNoteId}`,
                        data
                    );

                console.log(
                    "UPDATE RESPONSE:",
                    response.data
                );

                setSnackbar({
                    open: true,
                    message:
                        "Goods Receipt Note updated successfully",
                    severity: "success"
                });

            }

            /*
             * CREATE
             */

            else {

                const response =
                    await axios.post(
                        GRN_API,
                        data
                    );

                console.log(
                    "CREATE RESPONSE:",
                    response.data
                );

                setSnackbar({
                    open: true,
                    message:
                        "Goods Receipt Note created successfully",
                    severity: "success"
                });
            }


            setModalOpen(false);

            setSelectedGRN(null);

            await loadGoodsReceiptNotes();

        }
        catch (error) {

            console.error(
                "Save GRN Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to save Goods Receipt Note",
                severity: "error"
            });
        }
    };


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (item) => {

        setSelectedGRN(item);

        setViewOpen(true);
    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = (item) => {

        setSelectedGRN(item);

        setDeleteOpen(true);
    };


    /* =====================================================
       CONFIRM DELETE
    ===================================================== */

    const confirmDelete = async (id) => {

        try {

            console.log(
                "DELETE GOODS RECEIPT NOTE:",
                id
            );

            const response =
                await axios.delete(
                    `${GRN_API}/${id}`
                );

            console.log(
                "DELETE RESPONSE:",
                response.data
            );

            setSnackbar({
                open: true,
                message:
                    "Goods Receipt Note deleted successfully",
                severity: "success"
            });

            setDeleteOpen(false);

            setSelectedGRN(null);

            await loadGoodsReceiptNotes();

        }
        catch (error) {

            console.error(
                "Delete GRN Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Delete failed",
                severity: "error"
            });
        }
    };


    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (
        value
    ) => {

        setPage(value);
    };


    /* =====================================================
       PAGE SIZE CHANGE
    ===================================================== */

    const handlePageSizeChange = (
        value
    ) => {

        setPageSize(value);

        setPage(1);
    };


    /* =====================================================
       SNACKBAR CLOSE
    ===================================================== */

    const handleSnackbarClose = () => {

        setSnackbar({
            ...snackbar,
            open: false
        });
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            className="goods-receipt-notes-container"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Goods Receipt Notes
            </Typography>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <GoodsReceiptNoteToolbar
                onAdd={handleAdd}
                onRefresh={loadGoodsReceiptNotes}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <GoodsReceiptNoteStatistics
                statistics={statistics}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <GoodsReceiptNoteSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />


            {/* =================================================
                TABLE
            ================================================= */}

            {
                loading

                    ?

                    (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            mt={5}
                        >

                            <CircularProgress />

                        </Box>
                    )

                    :

                    (
                        <GoodsReceiptNoteTable
                            notes={paginatedNotes}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )
            }


            {/* =================================================
                PAGINATION
            ================================================= */}

            <GoodsReceiptNotePagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
                onPageSizeChange={
                    handlePageSizeChange
                }
            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <GoodsReceiptNoteModal
                open={modalOpen}
                note={selectedGRN}
                onClose={() =>
                    setModalOpen(false)
                }
                onSave={handleSave}
            />


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            <GoodsReceiptNoteView
                open={viewOpen}
                note={selectedGRN}
                onClose={() =>
                    setViewOpen(false)
                }
            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteGoodsReceiptNoteDialog
                open={deleteOpen}
                note={selectedGRN}
                onClose={() =>
                    setDeleteOpen(false)
                }
                onDeleted={confirmDelete}
            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={
                    handleSnackbarClose
                }
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    onClose={
                        handleSnackbarClose
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default GoodsReceiptNoteList;
