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
    Grid,
    TextField,
    MenuItem
} from "@mui/material";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    StockLedgerId: null,

    SellerId: "",

    CustomerId: "",

    ProductId: "",

    WarehouseId: "",

    TransactionType: "",

    ReferenceNumber: "",

    Quantity: "",

    BalanceQuantity: "",

    Remarks: "",

    TransactionDate: ""

};


// =========================================================
// TRANSACTION TYPES
// =========================================================

const transactionTypes = [
    "PURCHASE",
    "SALE",
    "ADJUSTMENT",
    "RETURN",
    "TRANSFER"
];


// =========================================================
// COMPONENT
// =========================================================

const StockLedgerModal = ({
    open,
    ledger,
    onClose,
    onSave
}) => {

    const [formData, setFormData] =
        useState(initialState);


    // =====================================================
    // LOAD EDIT DATA
    // =====================================================

    useEffect(() => {

        if (ledger) {

            setFormData({

                StockLedgerId:
                    ledger.StockLedgerId ??
                    null,

                SellerId:
                    ledger.SellerId ??
                    "",

                CustomerId:
                    ledger.CustomerId ??
                    "",

                ProductId:
                    ledger.ProductId ??
                    "",

                WarehouseId:
                    ledger.WarehouseId ??
                    "",

                TransactionType:
                    ledger.TransactionType ??
                    "",

                ReferenceNumber:
                    ledger.ReferenceNumber ??
                    "",

                Quantity:
                    ledger.Quantity ??
                    "",

                BalanceQuantity:
                    ledger.BalanceQuantity ??
                    "",

                Remarks:
                    ledger.Remarks ??
                    "",

                TransactionDate:
                    ledger.TransactionDate
                        ? ledger.TransactionDate.substring(
                            0,
                            10
                        )
                        : ""

            });

        }
        else {

            setFormData({
                ...initialState
            });

        }

    }, [
        ledger,
        open
    ]);


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

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


    // =====================================================
    // SUBMIT
    //
    // IMPORTANT:
    // No Axios here.
    //
    // Data goes to StockLedgerList.jsx
    // through onSave().
    // =====================================================

    const handleSubmit = () => {

        const data = {

            ...formData,

            SellerId:
                formData.SellerId === ""
                    ? null
                    : Number(
                        formData.SellerId
                    ),

            CustomerId:
                formData.CustomerId === ""
                    ? null
                    : Number(
                        formData.CustomerId
                    ),

            ProductId:
                formData.ProductId === ""
                    ? null
                    : Number(
                        formData.ProductId
                    ),

            WarehouseId:
                formData.WarehouseId === ""
                    ? null
                    : Number(
                        formData.WarehouseId
                    ),

            Quantity:
                formData.Quantity === ""
                    ? 0
                    : Number(
                        formData.Quantity
                    ),

            BalanceQuantity:
                formData.BalanceQuantity === ""
                    ? 0
                    : Number(
                        formData.BalanceQuantity
                    ),

            TransactionDate:
                formData.TransactionDate
                    ? formData.TransactionDate
                    : null

        };


        console.log(
            "Stock Ledger Submit:",
            data
        );


        onSave(data);

    };


    // =====================================================
    // RENDER
    // =====================================================

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

                {formData.StockLedgerId
                    ? "Edit Stock Ledger Entry"
                    : "Add Stock Ledger Entry"}

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{
                        mt: 0.5
                    }}
                >

                    {/* =================================================
                        SELLER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Seller ID"
                            name="SellerId"
                            value={formData.SellerId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =================================================
                        CUSTOMER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Customer ID"
                            name="CustomerId"
                            value={formData.CustomerId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =================================================
                        PRODUCT
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Product ID"
                            name="ProductId"
                            value={formData.ProductId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =================================================
                        WAREHOUSE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Warehouse ID"
                            name="WarehouseId"
                            value={formData.WarehouseId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =================================================
                        TRANSACTION TYPE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Transaction Type"
                            name="TransactionType"
                            value={formData.TransactionType}
                            onChange={handleChange}
                        >

                            {transactionTypes.map(
                                (type) => (

                                    <MenuItem
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        REFERENCE NUMBER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            label="Reference Number"
                            name="ReferenceNumber"
                            value={formData.ReferenceNumber}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =================================================
                        QUANTITY
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            name="Quantity"
                            value={formData.Quantity}
                            onChange={handleChange}
                            inputProps={{
                                min: 0
                            }}
                        />

                    </Grid>


                    {/* =================================================
                        BALANCE QUANTITY
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Balance Quantity"
                            name="BalanceQuantity"
                            value={
                                formData.BalanceQuantity
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0
                            }}
                        />

                    </Grid>


                    {/* =================================================
                        TRANSACTION DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="date"
                            label="Transaction Date"
                            name="TransactionDate"
                            value={
                                formData.TransactionDate
                            }
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>


                    {/* =================================================
                        REMARKS
                    ================================================= */}

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

            <DialogActions
                sx={{
                    px: 3,
                    py: 2
                }}
            >

                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {formData.StockLedgerId
                        ? "Update"
                        : "Save"}
                </Button>

            </DialogActions>

        </Dialog>

    );

};


export default StockLedgerModal;

