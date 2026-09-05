import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem
} from "@mui/material";


const PurchaseReturnModal = ({
    open,
    onClose,
    onSave,
    purchaseReturn
}) => {

    /* =========================================================
       INITIAL STATE
    ========================================================= */

    const initialState = {
        PurchaseReturnId: 0,
        PurchaseOrderId: "",
        GoodsReceiptNoteId: "",
        SupplierId: "",
        PurchaseReturnNumber: "",
        ReturnDate: "",
        Reason: "",
        TotalAmount: "",
        Status: "Pending"
    };


    /* =========================================================
       FORM STATE
    ========================================================= */

    const [
        formData,
        setFormData
    ] = useState(initialState);


    /* =========================================================
       LOAD / RESET FORM
    ========================================================= */

    useEffect(() => {

        if (!open) {
            return;
        }

        if (purchaseReturn) {

            setFormData({

                PurchaseReturnId:
                    purchaseReturn.PurchaseReturnId ?? 0,

                PurchaseOrderId:
                    purchaseReturn.PurchaseOrderId ?? "",

                GoodsReceiptNoteId:
                    purchaseReturn.GoodsReceiptNoteId ?? "",

                SupplierId:
                    purchaseReturn.SupplierId ?? "",

                PurchaseReturnNumber:
                    purchaseReturn.PurchaseReturnNumber ?? "",

                ReturnDate:
                    purchaseReturn.ReturnDate
                        ? String(
                            purchaseReturn.ReturnDate
                        ).substring(0, 10)
                        : "",

                Reason:
                    purchaseReturn.Reason ?? "",

                TotalAmount:
                    purchaseReturn.TotalAmount ?? "",

                Status:
                    purchaseReturn.Status ?? "Pending"

            });

        } else {

            setFormData({
                ...initialState
            });

        }

    }, [purchaseReturn, open]);


    /* =========================================================
       HANDLE CHANGE
    ========================================================= */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };


    /* =========================================================
       HANDLE SUBMIT
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();

        const purchaseOrderId =
            Number(formData.PurchaseOrderId);

        const goodsReceiptNoteId =
            Number(formData.GoodsReceiptNoteId);

        const supplierId =
            Number(formData.SupplierId);

        const totalAmount =
            Number(formData.TotalAmount);


        /* =====================================================
           VALIDATION
        ===================================================== */

        if (!Number.isInteger(purchaseOrderId) || purchaseOrderId <= 0) {

            alert("Please enter a valid Purchase Order ID.");

            return;
        }


        if (
            !Number.isInteger(goodsReceiptNoteId) ||
            goodsReceiptNoteId <= 0
        ) {

            alert(
                "Please enter a valid Goods Receipt Note ID."
            );

            return;
        }


        if (!Number.isInteger(supplierId) || supplierId <= 0) {

            alert("Please enter a valid Supplier ID.");

            return;
        }


        if (
            !Number.isFinite(totalAmount) ||
            totalAmount < 0
        ) {

            alert("Please enter a valid Total Amount.");

            return;
        }


        if (!formData.PurchaseReturnNumber.trim()) {

            alert(
                "Purchase Return Number is required."
            );

            return;
        }


        if (!formData.ReturnDate) {

            alert("Return Date is required.");

            return;
        }


        /* =====================================================
           PAYLOAD
        ===================================================== */

        const payload = {

            PurchaseReturnId:
                Number(formData.PurchaseReturnId) || 0,

            PurchaseOrderId:
                purchaseOrderId,

            GoodsReceiptNoteId:
                goodsReceiptNoteId,

            SupplierId:
                supplierId,

            PurchaseReturnNumber:
                formData.PurchaseReturnNumber.trim(),

            ReturnDate:
                formData.ReturnDate,

            Reason:
                formData.Reason.trim(),

            TotalAmount:
                totalAmount,

            Status:
                formData.Status

        };


        /* =====================================================
           SEND TO PARENT
        ===================================================== */

        onSave(payload);

    };


    /* =========================================================
       RENDER
    ========================================================= */

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

                {formData.PurchaseReturnId > 0
                    ? "Edit Purchase Return"
                    : "Add Purchase Return"}

            </DialogTitle>


            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

                <DialogContent>

                    <Grid
                        container
                        spacing={2}
                        sx={{ mt: 0.5 }}
                    >

                        {/* =====================================
                            PURCHASE ORDER ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Purchase Order ID"
                                name="PurchaseOrderId"
                                value={
                                    formData.PurchaseOrderId
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            GRN ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Goods Receipt Note ID"
                                name="GoodsReceiptNoteId"
                                value={
                                    formData.GoodsReceiptNoteId
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            SUPPLIER ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Supplier ID"
                                name="SupplierId"
                                value={
                                    formData.SupplierId
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            PURCHASE RETURN NUMBER
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Purchase Return Number"
                                name="PurchaseReturnNumber"
                                value={
                                    formData.PurchaseReturnNumber
                                }
                                onChange={handleChange}
                                placeholder="PR-001"
                            />

                        </Grid>


                        {/* =====================================
                            RETURN DATE
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Return Date"
                                name="ReturnDate"
                                value={
                                    formData.ReturnDate
                                }
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            TOTAL AMOUNT
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Total Amount"
                                name="TotalAmount"
                                value={
                                    formData.TotalAmount
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            REASON
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Reason"
                                name="Reason"
                                value={
                                    formData.Reason
                                }
                                onChange={handleChange}
                                placeholder="Enter reason for purchase return"
                            />

                        </Grid>


                        {/* =====================================
                            STATUS
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Status"
                                name="Status"
                                value={
                                    formData.Status
                                }
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

                    </Grid>

                </DialogContent>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2
                    }}
                >

                    <Button
                        onClick={onClose}
                        color="inherit"
                    >
                        Cancel
                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                    >
                        {formData.PurchaseReturnId > 0
                            ? "Update"
                            : "Save"}
                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

};


export default PurchaseReturnModal;