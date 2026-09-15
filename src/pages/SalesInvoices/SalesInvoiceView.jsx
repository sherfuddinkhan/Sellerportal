import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip,
    Box
} from "@mui/material";


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    switch (
        String(status || "").toLowerCase().trim()
    ) {

        case "paid":
        case "completed":
        case "confirmed":
            return "success";

        case "pending":
        case "draft":
        case "open":
        case "due":
        case "due-pending":
            return "warning";

        case "partial":
        case "partially paid":
            return "info";

        case "processing":
            return "primary";

        case "cancelled":
        case "rejected":
        case "failed":
            return "error";

        default:
            return "default";
    }
};


/* =========================================================
   GET VALUE
   Supports PascalCase + camelCase
========================================================= */

const getValue = (
    item,
    pascalCase,
    camelCase
) => {

    return (
        item?.[pascalCase] ??
        item?.[camelCase]
    );
};


/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value,
    bold = false
}) => {

    return (
        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                fontWeight={bold ? "bold" : "normal"}
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {value ?? "-"}
            </Typography>

        </Grid>
    );
};


/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({
    children
}) => {

    return (
        <Grid item xs={12}>

            <Typography
                variant="subtitle1"
                fontWeight="bold"
            >
                {children}
            </Typography>

        </Grid>
    );
};


/* =========================================================
   SALES INVOICE VIEW
========================================================= */

const SalesInvoiceView = ({
    open,
    item,
    onClose
}) => {

    if (!item) {
        return null;
    }


    /* =========================================================
       BASIC INFORMATION
    ========================================================= */

    const invoiceId =
        getValue(
            item,
            "SalesInvoiceId",
            "salesInvoiceId"
        );

    const salesOrderId =
        getValue(
            item,
            "SalesOrderId",
            "salesOrderId"
        );

    const sellerId =
        getValue(
            item,
            "SellerId",
            "sellerId"
        );

    const customerId =
        getValue(
            item,
            "CustomerId",
            "customerId"
        );

    const invoiceNumber =
        getValue(
            item,
            "InvoiceNumber",
            "invoiceNumber"
        );

    const invoiceDate =
        getValue(
            item,
            "InvoiceDate",
            "invoiceDate"
        );


    /* =========================================================
       CUSTOMER INFORMATION
    ========================================================= */

    const companyName =
        getValue(
            item,
            "CompanyName",
            "companyName"
        );

    const mobileNo =
        getValue(
            item,
            "MobileNo",
            "mobileNo"
        );

    const emailAddress =
        getValue(
            item,
            "EmailAddress",
            "emailAddress"
        );

    const companyAddress =
        getValue(
            item,
            "CompanyAddress",
            "companyAddress"
        );

    const companyCity =
        getValue(
            item,
            "CompanyCity",
            "companyCity"
        );

    const companyState =
        getValue(
            item,
            "CompanyState",
            "companyState"
        );

    const companyPINCode =
        getValue(
            item,
            "CompanyPINCode",
            "companyPINCode"
        );

    const customerGSTIN =
        getValue(
            item,
            "CustomerGSTIN",
            "customerGSTIN"
        );


    /* =========================================================
       CLASSIFICATION
    ========================================================= */

    const invoiceScenario =
        getValue(
            item,
            "InvoiceScenario",
            "invoiceScenario"
        );

    const category =
        getValue(
            item,
            "Category",
            "category"
        );

    const transactionType =
        getValue(
            item,
            "TransactionType",
            "transactionType"
        );

    const documentType =
        getValue(
            item,
            "DocumentType",
            "documentType"
        );

    const supplyType =
        getValue(
            item,
            "SupplyType",
            "supplyType"
        );

    const placeOfSupply =
        getValue(
            item,
            "PlaceOfSupply",
            "placeOfSupply"
        );

    const stateCode =
        getValue(
            item,
            "StateCode",
            "stateCode"
        );

    const financialYear =
        getValue(
            item,
            "FinancialYear",
            "financialYear"
        );

    const reverseCharge =
        getValue(
            item,
            "ReverseCharge",
            "reverseCharge"
        );

    const userGSTIN =
        getValue(
            item,
            "UserGSTIN",
            "userGSTIN"
        );


    /* =========================================================
       PURCHASE / REFERENCE INFORMATION
    ========================================================= */

    const purchaseOrderNo =
        getValue(
            item,
            "PurchaseOrderNo",
            "purchaseOrderNo"
        );

    const purchaseOrderDate =
        getValue(
            item,
            "PurchaseOrderDate",
            "purchaseOrderDate"
        );

    const otherReferences =
        getValue(
            item,
            "OtherReferences",
            "otherReferences"
        );

    const despatchedDocumentNumber =
        getValue(
            item,
            "DespatchedDocumentNumber",
            "despatchedDocumentNumber"
        );

    const referenceId =
        getValue(
            item,
            "Id",
            "id"
        );

    const refId =
        getValue(
            item,
            "RefId",
            "refId"
        );


    /* =========================================================
       TRANSPORT INFORMATION
    ========================================================= */

    const deliveryNote =
        getValue(
            item,
            "DeliveryNote",
            "deliveryNote"
        );

    const deliveryNoteDate =
        getValue(
            item,
            "DeliveryNoteDate",
            "deliveryNoteDate"
        );

    const eWayBillNumber =
        getValue(
            item,
            "EWayBillNumber",
            "eWayBillNumber"
        );

    const vehicleNo =
        getValue(
            item,
            "VehicleNo",
            "vehicleNo"
        );

    const distance =
        getValue(
            item,
            "Distance",
            "distance"
        );

    const transport =
        getValue(
            item,
            "Transport",
            "transport"
        );

    const transporterName =
        getValue(
            item,
            "TransporterName",
            "transporterName"
        );

    const transporterID =
        getValue(
            item,
            "TransporterID",
            "transporterID"
        );

    const transporterDocNo =
        getValue(
            item,
            "TransporterDocNo",
            "transporterDocNo"
        );

    const transportMode =
        getValue(
            item,
            "TransportMode",
            "transportMode"
        );

    const destination =
        getValue(
            item,
            "Destination",
            "destination"
        );

    const billOfLandingOrLRRRNo =
        getValue(
            item,
            "BillOfLandingOrLRRRNo",
            "billOfLandingOrLRRRNo"
        );

    const despatchedThrough =
        getValue(
            item,
            "DespatchedThrough",
            "despatchedThrough"
        );

    const modeOrTermsOfPayment =
        getValue(
            item,
            "ModeOrTermsOfPayment",
            "modeOrTermsOfPayment"
        );


    /* =========================================================
       AMOUNTS
    ========================================================= */

    const subTotal =
        getValue(
            item,
            "SubTotal",
            "subTotal"
        );

    const discountAmount =
        getValue(
            item,
            "DiscountAmount",
            "discountAmount"
        );

    const taxAmount =
        getValue(
            item,
            "TaxAmount",
            "taxAmount"
        );

    const totalAmount =
        getValue(
            item,
            "TotalAmount",
            "totalAmount"
        );

    const paidAmount =
        getValue(
            item,
            "PaidAmount",
            "paidAmount"
        );

    const balanceAmount =
        getValue(
            item,
            "BalanceAmount",
            "balanceAmount"
        );

    const paymentMode =
        getValue(
            item,
            "PaymentMode",
            "paymentMode"
        );

    const paymentStatus =
        getValue(
            item,
            "PaymentStatus",
            "paymentStatus"
        );

    const status =
        getValue(
            item,
            "Status",
            "status"
        );

    const remarks =
        getValue(
            item,
            "Remarks",
            "remarks"
        );


    /* =========================================================
       AUDIT
    ========================================================= */

    const createdDate =
        getValue(
            item,
            "CreatedDate",
            "createdDate"
        );

    const updatedDate =
        getValue(
            item,
            "UpdatedDate",
            "updatedDate"
        );


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            {/* =================================================
               TITLE
            ================================================= */}

            <DialogTitle>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Sales Invoice Details
                </Typography>

                {invoiceNumber && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Invoice No: {invoiceNumber}
                    </Typography>
                )}

            </DialogTitle>


            {/* =================================================
               CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    {/* =================================================
                       BASIC INFORMATION
                    ================================================= */}

                    <SectionTitle>
                        Basic Information
                    </SectionTitle>

                    <DetailItem
                        label="Sales Invoice ID"
                        value={invoiceId}
                    />

                    <DetailItem
                        label="Sales Order ID"
                        value={salesOrderId}
                    />

                    <DetailItem
                        label="Seller ID"
                        value={sellerId}
                    />

                    <DetailItem
                        label="Customer ID"
                        value={customerId}
                    />

                    <DetailItem
                        label="Invoice Number"
                        value={invoiceNumber}
                        bold
                    />

                    <DetailItem
                        label="Invoice Date"
                        value={formatDate(invoiceDate)}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* =================================================
                       CUSTOMER INFORMATION
                    ================================================= */}

                    <SectionTitle>
                        Customer Information
                    </SectionTitle>

                    <DetailItem
                        label="Company Name"
                        value={companyName}
                        bold
                    />

                    <DetailItem
                        label="Mobile Number"
                        value={mobileNo}
                    />

                    <DetailItem
                        label="Email Address"
                        value={emailAddress}
                    />

                    <DetailItem
                        label="Company Address"
                        value={companyAddress}
                    />

                    <DetailItem
                        label="City"
                        value={companyCity}
                    />

                    <DetailItem
                        label="State"
                        value={companyState}
                    />

                    <DetailItem
                        label="PIN Code"
                        value={companyPINCode}
                    />

                    <DetailItem
                        label="Customer GSTIN"
                        value={customerGSTIN}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* =================================================
                       INVOICE CLASSIFICATION
                    ================================================= */}

                    <SectionTitle>
                        Invoice Classification
                    </SectionTitle>

                    <DetailItem
                        label="Invoice Scenario"
                        value={invoiceScenario}
                    />

                    <DetailItem
                        label="Category"
                        value={category}
                    />

                    <DetailItem
                        label="Transaction Type"
                        value={transactionType}
                    />

                    <DetailItem
                        label="Document Type"
                        value={documentType}
                    />

                    <DetailItem
                        label="Supply Type"
                        value={supplyType}
                    />

                    <DetailItem
                        label="Place of Supply"
                        value={placeOfSupply}
                    />

                    <DetailItem
                        label="State Code"
                        value={stateCode}
                    />

                    <DetailItem
                        label="Financial Year"
                        value={financialYear}
                    />

                    <DetailItem
                        label="Reverse Charge"
                        value={
                            typeof reverseCharge === "boolean"
                                ? reverseCharge
                                    ? "Yes"
                                    : "No"
                                : reverseCharge || "-"
                        }
                    />

                    <DetailItem
                        label="User GSTIN"
                        value={userGSTIN}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* =================================================
                       PURCHASE / REFERENCE
                    ================================================= */}

                    <SectionTitle>
                        Purchase & Reference Information
                    </SectionTitle>

                    <DetailItem
                        label="Purchase Order No"
                        value={purchaseOrderNo}
                    />

                    <DetailItem
                        label="Purchase Order Date"
                        value={formatDate(purchaseOrderDate)}
                    />

                    <DetailItem
                        label="Other References"
                        value={otherReferences}
                    />

                    <DetailItem
                        label="Despatched Document Number"
                        value={despatchedDocumentNumber}
                    />

                    <DetailItem
                        label="Reference ID"
                        value={referenceId}
                    />

                    <DetailItem
                        label="Ref ID"
                        value={refId}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* =================================================
                       TRANSPORT
                    ================================================= */}

                    <SectionTitle>
                        Transport & Delivery
                    </SectionTitle>

                    <DetailItem
                        label="Delivery Note"
                        value={deliveryNote}
                    />

                    <DetailItem
                        label="Delivery Note Date"
                        value={formatDate(deliveryNoteDate)}
                    />

                    <DetailItem
                        label="E-Way Bill Number"
                        value={eWayBillNumber}
                    />

                    <DetailItem
                        label="Vehicle Number"
                        value={vehicleNo}
                    />

                    <DetailItem
                        label="Distance"
                        value={distance}
                    />

                    <DetailItem
                        label="Transport"
                        value={transport}
                    />

                    <DetailItem
                        label="Transporter Name"
                        value={transporterName}
                    />

                    <DetailItem
                        label="Transporter ID"
                        value={transporterID}
                    />

                    <DetailItem
                        label="Transporter Document No"
                        value={transporterDocNo}
                    />

                    <DetailItem
                        label="Transport Mode"
                        value={transportMode}
                    />

                    <DetailItem
                        label="Destination"
                        value={destination}
                    />

                    <DetailItem
                        label="Bill of Landing / LR-RR No"
                        value={billOfLandingOrLRRRNo}
                    />

                    <DetailItem
                        label="Despatched Through"
                        value={despatchedThrough}
                    />

                    <DetailItem
                        label="Mode / Terms of Payment"
                        value={modeOrTermsOfPayment}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* =================================================
                       AMOUNT DETAILS
                    ================================================= */}

                    <SectionTitle>
                        Amount Details
                    </SectionTitle>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Sub Total
                        </Typography>

                        <Typography>
                            {formatCurrency(subTotal)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Discount
                        </Typography>

                        <Typography>
                            {formatCurrency(discountAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Tax
                        </Typography>

                        <Typography>
                            {formatCurrency(taxAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(totalAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Paid Amount
                        </Typography>

                        <Typography>
                            {formatCurrency(paidAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Balance Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(balanceAmount)}
                        </Typography>

                    </Grid>


                    <DetailItem
                        label="Payment Mode"
                        value={paymentMode}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* =================================================
                       STATUS
                    ================================================= */}

                    <SectionTitle>
                        Status
                    </SectionTitle>


                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 1
                            }}
                        >
                            Payment Status
                        </Typography>

                        <Chip
                            label={paymentStatus || "-"}
                            color={getStatusColor(
                                paymentStatus
                            )}
                            size="small"
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 1
                            }}
                        >
                            Invoice Status
                        </Typography>

                        <Chip
                            label={status || "-"}
                            color={getStatusColor(status)}
                            size="small"
                        />

                    </Grid>


                    {/* =================================================
                       REMARKS
                    ================================================= */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Remarks
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: "background.default"
                            }}
                        >

                            <Typography>
                                {remarks || "-"}
                            </Typography>

                        </Box>

                    </Grid>


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* =================================================
                       AUDIT INFORMATION
                    ================================================= */}

                    <SectionTitle>
                        Audit Information
                    </SectionTitle>

                    <DetailItem
                        label="Created Date"
                        value={formatDate(createdDate)}
                    />

                    <DetailItem
                        label="Updated Date"
                        value={formatDate(updatedDate)}
                    />

                </Grid>

            </DialogContent>


            {/* =================================================
               ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default SalesInvoiceView;