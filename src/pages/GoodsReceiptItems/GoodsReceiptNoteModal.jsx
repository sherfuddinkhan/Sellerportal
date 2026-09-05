import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem
} from "@mui/material";


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
    GoodsReceiptNoteId: null,
    PurchaseOrderId: "",
    SellerId: "",
    SupplierId: "",
    GRNNumber: "",
    ReceiptDate: "",
    Status: "Pending",
    TotalAmount: "",
    Remarks: ""
};


/* =========================================================
   GOODS RECEIPT NOTE MODAL
========================================================= */

const GoodsReceiptNoteModal = ({
    open,
    note,
    onClose,
    onSave
}) => {

    const [formData, setFormData] = useState(initialState);


    /* =====================================================
       LOAD NOTE FOR EDIT / RESET FOR CREATE
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }

        if (note) {

            setFormData({
                GoodsReceiptNoteId:
                    note.GoodsReceiptNoteId ?? null,

                PurchaseOrderId:
                    note.PurchaseOrderId ?? "",

                SellerId:
                    note.SellerId ?? "",

                SupplierId:
                    note.SupplierId ?? "",

                GRNNumber:
                    note.GRNNumber ?? "",

                ReceiptDate:
                    note.ReceiptDate
                        ? String(note.ReceiptDate).substring(0, 10)
                        : "",

                Status:
                    note.Status || "Pending",

                TotalAmount:
                    note.TotalAmount ?? "",

                Remarks:
                    note.Remarks ?? ""
            });

        } else {

            setFormData({
                ...initialState
            });

        }

    }, [note, open]);


    /* =====================================================
       HANDLE FIELD CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    /* =====================================================
       HANDLE SAVE
    ===================================================== */

    const handleSubmit = () => {

        const payload = {
            ...formData,

            PurchaseOrderId:
                formData.PurchaseOrderId === ""
                    ? 0
                    : Number(formData.PurchaseOrderId),

            SellerId:
                formData.SellerId === ""
                    ? 0
                    : Number(formData.SellerId),

            SupplierId:
                formData.SupplierId === ""
                    ? 0
                    : Number(formData.SupplierId),

            TotalAmount:
                formData.TotalAmount === ""
                    ? 0
                    : Number(formData.TotalAmount)
        };

        onSave(payload);
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                {formData.GoodsReceiptNoteId
                    ? "Edit Goods Receipt Note"
                    : "Add Goods Receipt Note"
                }

            </DialogTitle>


            {/* =================================================
                FORM
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 0.5 }}
                >

                    {/* =========================================
                        PURCHASE ORDER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Purchase Order ID"
                            name="PurchaseOrderId"
                            type="number"
                            value={formData.PurchaseOrderId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        SELLER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Seller ID"
                            name="SellerId"
                            type="number"
                            value={formData.SellerId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        SUPPLIER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Supplier ID"
                            name="SupplierId"
                            type="number"
                            value={formData.SupplierId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        GRN NUMBER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="GRN Number"
                            name="GRNNumber"
                            value={formData.GRNNumber}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =========================================
                        RECEIPT DATE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            type="date"
                            label="Receipt Date"
                            name="ReceiptDate"
                            value={formData.ReceiptDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        STATUS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Status"
                            name="Status"
                            value={formData.Status}
                            onChange={handleChange}
                        >

                            <MenuItem value="Pending">
                                Pending
                            </MenuItem>

                            <MenuItem value="Completed">
                                Completed
                            </MenuItem>

                            <MenuItem value="Cancelled">
                                Cancelled
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* =========================================
                        TOTAL AMOUNT
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Total Amount"
                            name="TotalAmount"
                            value={formData.TotalAmount}
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        REMARKS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Remarks"
                            name="Remarks"
                            value={formData.Remarks}
                            onChange={handleChange}
                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Save
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default GoodsReceiptNoteModal;

