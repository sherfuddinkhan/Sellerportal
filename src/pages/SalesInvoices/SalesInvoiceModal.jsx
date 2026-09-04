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
    MenuItem,
    Divider,
    Typography
} from "@mui/material";


// =========================================================
// CONFIGURATION
// =========================================================

// Change these if the logged-in seller/customer changes.
// Later these can come from localStorage or authentication.

const SELLER_ID = 6;
const CUSTOMER_ID = 3;


// =========================================================
// OPTIONS
// =========================================================

const paymentStatusOptions = [
    "Pending",
    "Partially Paid",
    "Paid"
];

const statusOptions = [
    "Draft",
    "Open",
    "Completed",
    "Cancelled"
];

const invoiceScenarioOptions = [
    "B2B",
    "B2C",
    "Export",
    "SEZ"
];

const categoryOptions = [
    "Goods",
    "Services",
    "Goods and Services"
];

const transactionTypeOptions = [
    "Sale",
    "Credit Note",
    "Debit Note"
];

const documentTypeOptions = [
    "Invoice",
    "Tax Invoice",
    "Bill of Supply"
];

const supplyTypeOptions = [
    "B2B",
    "B2C",
    "Export",
    "SEZ",
    "Deemed Export"
];

const reverseChargeOptions = [
    "No",
    "Yes"
];


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    SalesInvoiceId: 0,

    SalesOrderId: "",

    SellerId: SELLER_ID,

    CustomerId: CUSTOMER_ID,

    InvoiceNumber: "",

    InvoiceDate: "",

    InvoiceScenario: "B2B",

    Category: "Goods",

    TransactionType: "Sale",

    UserGSTIN: "",

    DocumentType: "Tax Invoice",

    SupplyType: "B2B",

    PlaceOfSupply: "",

    FinancialYear: "",

    ReverseCharge: "No",

    Id: "",

    RefId: "",

    SubTotal: "",

    DiscountAmount: "",

    TaxAmount: "",

    TotalAmount: "",

    PaidAmount: "",

    BalanceAmount: "",

    PaymentStatus: "Pending",

    Status: "Draft",

    Remarks: ""

};


// =========================================================
// COMPONENT
// =========================================================

const SalesInvoiceModal = ({
    open,
    item,
    onClose,
    onSave
}) => {

    const [formData, setFormData] =
        useState(initialState);


    // =========================================================
    // LOAD EDIT DATA
    // =========================================================

    useEffect(() => {

        if (item) {

            setFormData({

                ...initialState,

                ...item,

                InvoiceDate:
                    item.InvoiceDate
                        ? item.InvoiceDate.substring(0, 10)
                        : "",

                SellerId:
                    item.SellerId ||
                    SELLER_ID,

                CustomerId:
                    item.CustomerId ||
                    CUSTOMER_ID,

                ReverseCharge:
                    item.ReverseCharge ??
                    "No"

            });

        }
        else {

            setFormData({
                ...initialState
            });

        }

    }, [item, open]);


    // =========================================================
    // HANDLE CHANGE
    // =========================================================

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


    // =========================================================
    // CALCULATE BALANCE
    // =========================================================

    useEffect(() => {

        const total =
            Number(formData.TotalAmount || 0);

        const paid =
            Number(formData.PaidAmount || 0);

        const balance =
            Math.max(total - paid, 0);

        setFormData((previous) => ({

            ...previous,

            BalanceAmount: balance

        }));

    }, [
        formData.TotalAmount,
        formData.PaidAmount
    ]);


    // =========================================================
    // HANDLE SUBMIT
    // =========================================================

    const handleSubmit = () => {

        const payload = {

            ...formData,

            SalesInvoiceId:
                Number(
                    formData.SalesInvoiceId || 0
                ),

            SalesOrderId:
                Number(
                    formData.SalesOrderId || 0
                ),

            SellerId:
                Number(
                    formData.SellerId || SELLER_ID
                ),

            CustomerId:
                Number(
                    formData.CustomerId || CUSTOMER_ID
                ),

            SubTotal:
                Number(
                    formData.SubTotal || 0
                ),

            DiscountAmount:
                Number(
                    formData.DiscountAmount || 0
                ),

            TaxAmount:
                Number(
                    formData.TaxAmount || 0
                ),

            TotalAmount:
                Number(
                    formData.TotalAmount || 0
                ),

            PaidAmount:
                Number(
                    formData.PaidAmount || 0
                ),

            BalanceAmount:
                Number(
                    formData.BalanceAmount || 0
                )

        };

        console.log(
            "SALES INVOICE PAYLOAD:",
            payload
        );

        onSave(payload);

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                {formData.SalesInvoiceId
                    ? "Edit Sales Invoice"
                    : "Add Sales Invoice"}

            </DialogTitle>


            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    {/* =================================================
                        SALES ORDER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Sales Order ID"
                            name="SalesOrderId"
                            type="number"
                            value={
                                formData.SalesOrderId
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </Grid>


                    {/* =================================================
                        INVOICE NUMBER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Invoice Number"
                            name="InvoiceNumber"
                            value={
                                formData.InvoiceNumber
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </Grid>


                    {/* =================================================
                        INVOICE DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="Invoice Date"
                            name="InvoiceDate"
                            value={
                                formData.InvoiceDate
                            }
                            onChange={
                                handleChange
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>


                    {/* =================================================
                        INVOICE SCENARIO
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Invoice Scenario"
                            name="InvoiceScenario"
                            value={
                                formData.InvoiceScenario
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {invoiceScenarioOptions.map(
                                (option) => (

                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        CATEGORY
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Category"
                            name="Category"
                            value={
                                formData.Category
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {categoryOptions.map(
                                (option) => (

                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        TRANSACTION TYPE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Transaction Type"
                            name="TransactionType"
                            value={
                                formData.TransactionType
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {transactionTypeOptions.map(
                                (option) => (

                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        GSTIN
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="User GSTIN"
                            name="UserGSTIN"
                            value={
                                formData.UserGSTIN
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </Grid>


                    {/* =================================================
                        DOCUMENT TYPE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Document Type"
                            name="DocumentType"
                            value={
                                formData.DocumentType
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {documentTypeOptions.map(
                                (option) => (

                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        SUPPLY TYPE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Supply Type"
                            name="SupplyType"
                            value={
                                formData.SupplyType
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {supplyTypeOptions.map(
                                (option) => (

                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        PLACE OF SUPPLY
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Place of Supply"
                            name="PlaceOfSupply"
                            value={
                                formData.PlaceOfSupply
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. Andhra Pradesh"
                        />

                    </Grid>


                    {/* =================================================
                        FINANCIAL YEAR
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Financial Year"
                            name="FinancialYear"
                            value={
                                formData.FinancialYear
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. 2026-27"
                        />

                    </Grid>


                    {/* =================================================
                        REVERSE CHARGE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Reverse Charge"
                            name="ReverseCharge"
                            value={
                                formData.ReverseCharge
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {reverseChargeOptions.map(
                                (option) => (

                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        AMOUNTS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider sx={{ my: 1 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Invoice Amounts
                        </Typography>

                    </Grid>


                    {/* SUB TOTAL */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Sub Total"
                            name="SubTotal"
                            type="number"
                            value={
                                formData.SubTotal
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* DISCOUNT */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Discount Amount"
                            name="DiscountAmount"
                            type="number"
                            value={
                                formData.DiscountAmount
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* TAX */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Tax Amount"
                            name="TaxAmount"
                            type="number"
                            value={
                                formData.TaxAmount
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* TOTAL */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Total Amount"
                            name="TotalAmount"
                            type="number"
                            value={
                                formData.TotalAmount
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* PAID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Paid Amount"
                            name="PaidAmount"
                            type="number"
                            value={
                                formData.PaidAmount
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* BALANCE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Balance Amount"
                            name="BalanceAmount"
                            type="number"
                            value={
                                formData.BalanceAmount
                            }
                            InputProps={{
                                readOnly: true
                            }}
                        />

                    </Grid>


                    {/* =================================================
                        PAYMENT STATUS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Payment Status"
                            name="PaymentStatus"
                            value={
                                formData.PaymentStatus
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {paymentStatusOptions.map(
                                (status) => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        INVOICE STATUS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Invoice Status"
                            name="Status"
                            value={
                                formData.Status
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {statusOptions.map(
                                (status) => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

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
                            value={
                                formData.Remarks
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =========================================================
                ACTIONS
            ========================================================= */}

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

export default SalesInvoiceModal;