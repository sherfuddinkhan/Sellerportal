import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Download
} from "@mui/icons-material";


// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";

const COPY_TYPES = [
    "Original For Recipient",
    "Duplicate For Transporter",
    "Triplicate For Supplier",
    "Quadruplicate"
];


// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0.00";
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


const numberValue = (value) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
};


// ============================================================
// NORMALIZE ITEMS
// ============================================================

const getNormalizedItems = (rawItems) => {

    let parsedItems = rawItems;

    if (typeof rawItems === "string") {

        try {
            parsedItems = JSON.parse(rawItems);
        } catch (error) {

            console.error(
                "Failed to parse items:",
                error
            );

            parsedItems = [];
        }
    }


    if (
        parsedItems &&
        typeof parsedItems === "object" &&
        parsedItems.$values
    ) {
        parsedItems = parsedItems.$values;
    }


    if (!Array.isArray(parsedItems)) {
        return [];
    }


    return parsedItems.map(
        (item, index) => {

            const qty =
                numberValue(
                    item?.quantity ??
                    item?.Quantity ??
                    item?.qty ??
                    item?.Qty
                );


            const rate =
                numberValue(
                    item?.unitPrice ??
                    item?.UnitPrice ??
                    item?.rate ??
                    item?.Rate
                );


            const taxAmt =
                numberValue(
                    item?.taxAmount ??
                    item?.TaxAmount ??
                    item?.gstAmount ??
                    item?.GstAmount
                );


            const totalAmt =
                numberValue(
                    item?.afterGSTAmount ??
                    item?.AfterGSTAmount ??
                    item?.totalAmount ??
                    item?.TotalAmount ??
                    item?.amount ??
                    item?.Amount
                );


            return {

                salesInvoiceItemId:
                    item?.salesInvoiceItemId ||
                    item?.SalesInvoiceItemId ||
                    item?.id ||
                    item?.Id ||
                    `item-${index}`,

                description:
                    item?.description ||
                    item?.Description ||
                    item?.itemName ||
                    item?.ItemName ||
                    "N/A",

                hsncode:
                    item?.hsncode ||
                    item?.hsnCode ||
                    item?.HSNCode ||
                    item?.hsn ||
                    item?.HSN ||
                    "-",

                quantity: qty,

                uom:
                    item?.uom ||
                    item?.UOM ||
                    item?.unit ||
                    item?.Unit ||
                    "Pcs",

                unitPrice: rate,

                taxAmount: taxAmt,

                totalAmount:
                    totalAmt ||
                    (
                        qty * rate +
                        taxAmt
                    ),

                cgstPer:
                    numberValue(
                        item?.cgstPer ??
                        item?.CgstPer ??
                        item?.cgstRate
                    ),

                sgstPer:
                    numberValue(
                        item?.sgstPer ??
                        item?.SgstPer ??
                        item?.sgstRate
                    ),

                igstPer:
                    numberValue(
                        item?.igstPer ??
                        item?.IgstPer ??
                        item?.igstRate
                    ),

                cgstAmount:
                    numberValue(
                        item?.cgstAmount ??
                        item?.CgstAmount
                    ),

                sgstAmount:
                    numberValue(
                        item?.sgstAmount ??
                        item?.SgstAmount
                    ),

                igstAmount:
                    numberValue(
                        item?.igstAmount ??
                        item?.IgstAmount
                    )
            };
        }
    );
};


// ============================================================
// MAIN COMPONENT
// ============================================================

const SalesInvoicePrint = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const invoiceRef = useRef(null);

    const [invoice, setInvoice] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [downloading, setDownloading] =
        useState(false);


    // ========================================================
    // LOAD INVOICE DATA
    // ========================================================

    const loadInvoiceData =
        useCallback(
            async () => {

                if (!id) {

                    setError(
                        "No Sales Invoice ID was provided."
                    );

                    setLoading(false);

                    return;
                }


                try {

                    setLoading(true);

                    setError("");


                    // ==================================================
                    // INVOICE
                    // ==================================================

                    const invoiceResponse =
                        await axios.get(
                            `${SERVER_URL}/api/sales-invoices/${id}`
                        );


                    const invoiceData =
                        invoiceResponse.data;


                    const primaryInvoice =
                        Array.isArray(invoiceData)
                            ? invoiceData[0]
                            : invoiceData?.$values
                                ? invoiceData.$values[0]
                                : invoiceData;


                    if (!primaryInvoice) {

                        setError(
                            "Sales invoice data is empty."
                        );

                        return;
                    }


                    // ==================================================
                    // IDS
                    // ==================================================

                    const salesOrderId =
                        primaryInvoice?.salesOrderId ??
                        primaryInvoice?.SalesOrderId;


                    const sellerId =
                        primaryInvoice?.sellerId ??
                        primaryInvoice?.SellerId ??
                        6;


                    const customerId =
                        primaryInvoice?.customerId ??
                        primaryInvoice?.CustomerId ??
                        3;


                    // ==================================================
                    // SALES ORDER
                    // ==================================================

                    let salesOrder = null;


                    if (salesOrderId) {

                        try {

                            const response =
                                await axios.get(
                                    `${SERVER_URL}/api/SalesOrder/${salesOrderId}`
                                );


                            salesOrder =
                                Array.isArray(response.data)
                                    ? response.data[0]
                                    : response.data?.$values
                                        ? response.data.$values[0]
                                        : response.data;

                        } catch (err) {

                            console.error(
                                "Sales Order Load Error:",
                                err
                            );
                        }
                    }


                    // ==================================================
                    // SALES ORDER ITEMS
                    // ==================================================

                    let salesOrderItems = [];


                    if (salesOrderId) {

                        try {

                            const response =
                                await axios.get(
                                    `${SERVER_URL}/api/sales-order-items/${salesOrderId}`
                                );


                            const data =
                                response.data;


                            if (Array.isArray(data)) {

                                salesOrderItems = data;

                            } else if (data?.$values) {

                                salesOrderItems =
                                    data.$values;

                            } else if (data) {

                                salesOrderItems = [
                                    data
                                ];
                            }

                        } catch (err) {

                            console.error(
                                "Sales Order Items Load Error:",
                                err
                            );
                        }
                    }


                    // ==================================================
                    // CUSTOMER
                    // ==================================================

                    let customer = null;


                    if (
                        sellerId &&
                        customerId
                    ) {

                        try {

                            const response =
                                await axios.get(
                                    `${SERVER_URL}/api/SellerCustomer/${sellerId}/customers/${customerId}`
                                );


                            customer =
                                response.data;

                        } catch (err) {

                            console.error(
                                "Seller Customer Load Error:",
                                err
                            );
                        }
                    }


                    // ==================================================
                    // COMBINED DATA
                    // ==================================================

                    setInvoice({

                        ...primaryInvoice,

                        salesOrder,

                        salesOrderItems,

                        customerDetails:
                            customer
                    });


                } catch (err) {

                    console.error(
                        "Sales Invoice Load Error:",
                        err
                    );


                    setError(
                        err?.response?.data?.message ||
                        "Unable to load sales invoice."
                    );

                } finally {

                    setLoading(false);
                }

            },
            [id]
        );


    useEffect(() => {

        loadInvoiceData();

    }, [loadInvoiceData]);


    // ============================================================
    // NORMALIZED DATA
    // ============================================================

    const salesOrder =
        invoice?.salesOrder || {};


    const customer =
        invoice?.customerDetails || {};


    const items =
        useMemo(
            () => {

                const rawItems =
                    invoice?.salesInvoiceItems ||
                    invoice?.SalesInvoiceItems ||
                    invoice?.items ||
                    invoice?.Items ||
                    invoice?.salesOrderItems ||
                    invoice?.SalesOrderItems;


                return getNormalizedItems(
                    rawItems
                );

            },
            [invoice]
        );


    // ============================================================
    // SELLER
    // ============================================================

    const sellerName =
        salesOrder?.company_Name ||
        salesOrder?.Company_Name ||
        invoice?.companyName ||
        invoice?.CompanyName ||
        "TechNova Solutions Pvt Ltd";


    const sellerAddress =
        salesOrder?.company_Address ||
        salesOrder?.Company_Address ||
        invoice?.companyAddress ||
        invoice?.CompanyAddress ||
        "Plot No. 25, Industrial Estate, Hyderabad";


    const sellerCity =
        salesOrder?.company_City ||
        salesOrder?.Company_City ||
        invoice?.companyCity ||
        invoice?.CompanyCity ||
        "Hyderabad";


    const sellerState =
        salesOrder?.company_State ||
        salesOrder?.Company_State ||
        invoice?.companyState ||
        invoice?.CompanyState ||
        "Telangana";


    const sellerPIN =
        salesOrder?.company_PINCode ||
        salesOrder?.Company_PINCode ||
        invoice?.companyPINCode ||
        invoice?.CompanyPINCode ||
        "500034";


    const sellerGstin =
        salesOrder?.gstin ||
        salesOrder?.GSTIN ||
        invoice?.sellerGSTIN ||
        invoice?.SellerGSTIN ||
        invoice?.customerGSTIN ||
        invoice?.CustomerGSTIN ||
        "36ABCDE1234F1Z5";


    const sellerEmail =
        salesOrder?.email_Address ||
        salesOrder?.Email_Address ||
        invoice?.emailAddress ||
        invoice?.EmailAddress ||
        "accounts@technova.example.com";


    const sellerPhone =
        salesOrder?.phone_no ||
        salesOrder?.Phone_no ||
        invoice?.mobileNo ||
        invoice?.MobileNo ||
        "9876543210";


    // ============================================================
    // BUYER
    // ============================================================

    const buyerName =
        customer?.legalName ||
        customer?.LegalName ||
        customer?.tradeName ||
        customer?.TradeName ||
        customer?.customerName ||
        customer?.CustomerName ||
        "TechNova Retail Customer";


    const buyerAddress = [
        customer?.addressLine1 ||
        customer?.AddressLine1,

        customer?.addressLine2 ||
        customer?.AddressLine2,

        customer?.city ||
        customer?.City,

        customer?.state ||
        customer?.State,

        customer?.postalCode ||
        customer?.PostalCode
    ]
        .filter(Boolean)
        .join(", ");


    const buyerPhone =
        customer?.phone ||
        customer?.Phone ||
        "9876543210";


    const buyerEmail =
        customer?.email ||
        customer?.Email ||
        "accounts@technova.example.com";


    const buyerGstin =
        customer?.gstin ||
        customer?.GSTIN ||
        "29KLMNO7890P1Z3";


    // ============================================================
    // DOCUMENT
    // ============================================================

    const invoiceNo =
        invoice?.invoiceNumber ||
        invoice?.InvoiceNumber ||
        `Invoice-${id}`;


    const invoiceDate =
        invoice?.invoiceDate ||
        invoice?.InvoiceDate;


    const documentType =
        invoice?.documentType ||
        invoice?.DocumentType ||
        "TAX INVOICE";


    const salesOrderNo =
        salesOrder?.salesOrderNumber ||
        salesOrder?.SalesOrderNumber ||
        salesOrder?.orderNumber ||
        salesOrder?.OrderNumber ||
        (
            invoice?.salesOrderId
                ? `SO-${invoice.salesOrderId}`
                : "-"
        );


    const salesOrderDate =
        salesOrder?.orderDate ||
        salesOrder?.OrderDate;


    const purchaseOrderNo =
        salesOrder?.otherReferences ||
        salesOrder?.OtherReferences ||
        invoice?.purchaseOrderNo ||
        invoice?.PurchaseOrderNo ||
        "-";


    const purchaseOrderDate =
        salesOrder?.purchaseOrderDate ||
        salesOrder?.PurchaseOrderDate ||
        invoice?.purchaseOrderDate ||
        invoice?.PurchaseOrderDate;


    const eWayBillNo =
        salesOrder?.eWayBillNumber ||
        salesOrder?.EWayBillNumber ||
        invoice?.eWayBillNumber ||
        invoice?.EWayBillNumber ||
        "-";


    const vehicleNo =
        salesOrder?.vehicleNo ||
        salesOrder?.VehicleNo ||
        invoice?.vehicleNo ||
        invoice?.VehicleNo ||
        "-";


    const transportMode =
        salesOrder?.transportMode ||
        salesOrder?.TransportMode ||
        salesOrder?.transport ||
        salesOrder?.Transport ||
        "-";


    const paymentTerms =
        salesOrder?.modeorTermsOfPayment ||
        salesOrder?.ModeorTermsOfPayment ||
        invoice?.modeOrTermsOfPayment ||
        invoice?.ModeOrTermsOfPayment ||
        "-";


    const placeOfSupply =
        salesOrder?.company_State ||
        salesOrder?.Company_State ||
        invoice?.placeOfSupply ||
        invoice?.PlaceOfSupply ||
        "-";


    const stateCode =
        salesOrder?.stateCode ||
        salesOrder?.StateCode ||
        invoice?.stateCode ||
        invoice?.StateCode ||
        "-";


    // ============================================================
    // TOTALS
    // ============================================================

    const totalQuantity =
        useMemo(
            () =>
                items.reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                ),
            [items]
        );


    const subTotal =
        useMemo(
            () => {

                const invoiceSubtotal =
                    numberValue(
                        invoice?.subTotal ??
                        invoice?.SubTotal
                    );


                if (invoiceSubtotal > 0) {
                    return invoiceSubtotal;
                }


                return items.reduce(
                    (sum, item) =>
                        sum +
                        (
                            item.quantity *
                            item.unitPrice
                        ),
                    0
                );

            },
            [invoice, items]
        );


    const discountAmount =
        numberValue(
            invoice?.discountAmount ??
            invoice?.DiscountAmount
        );


    const totalTax =
        useMemo(
            () => {

                const invoiceTax =
                    numberValue(
                        invoice?.taxAmount ??
                        invoice?.TaxAmount
                    );


                if (invoiceTax > 0) {
                    return invoiceTax;
                }


                return items.reduce(
                    (sum, item) =>
                        sum + item.taxAmount,
                    0
                );

            },
            [invoice, items]
        );


    const grandTotal =
        numberValue(
            invoice?.totalAmount ??
            invoice?.TotalAmount
        ) ||
        (
            subTotal +
            totalTax -
            discountAmount
        );


    const paidAmount =
        numberValue(
            invoice?.paidAmount ??
            invoice?.PaidAmount
        );


    const balanceAmount =
        numberValue(
            invoice?.balanceAmount ??
            invoice?.BalanceAmount
        ) ||
        (
            grandTotal -
            paidAmount
        );


    // ============================================================
    // HSN SUMMARY
    // ============================================================

    const hsnRows =
        useMemo(
            () => {

                const map =
                    items.reduce(
                        (acc, item) => {

                            const hsn =
                                item.hsncode;


                            const taxableValue =
                                item.quantity *
                                item.unitPrice;


                            if (!acc[hsn]) {

                                acc[hsn] = {

                                    hsn,

                                    taxableValue: 0,

                                    cgstPer:
                                        item.cgstPer,

                                    sgstPer:
                                        item.sgstPer,

                                    igstPer:
                                        item.igstPer,

                                    cgstAmount: 0,

                                    sgstAmount: 0,

                                    igstAmount: 0
                                };
                            }


                            acc[hsn].taxableValue +=
                                taxableValue;


                            acc[hsn].cgstAmount +=
                                item.cgstAmount;


                            acc[hsn].sgstAmount +=
                                item.sgstAmount;


                            acc[hsn].igstAmount +=
                                item.igstAmount;


                            return acc;

                        },
                        {}
                    );


                return Object.values(map);

            },
            [items]
        );


    // ============================================================
    // QR
    // ============================================================

    const qrPayload =
        useMemo(
            () =>
                JSON.stringify({

                    gstin:
                        sellerGstin,

                    invoiceNumber:
                        invoiceNo,

                    invoiceDate:
                        invoiceDate,

                    totalAmount:
                        grandTotal,

                    buyerGstin:
                        buyerGstin
                }),
            [
                sellerGstin,
                invoiceNo,
                invoiceDate,
                grandTotal,
                buyerGstin
            ]
        );


    // ============================================================
    // DOWNLOAD FOUR A4 PAGES
    //
    // IMPORTANT:
    // We DO NOT use html2pdf here.
    //
    // Each invoice page is captured independently and placed
    // directly onto one jsPDF A4 page.
    // ============================================================

    // ============================================================
// DOWNLOAD FOUR A4 PAGES
//
// UI IS NOT CHANGED.
//
// Each invoice copy is:
// 1. Cloned
// 2. Placed into an isolated A4 container
// 3. Rendered independently
// 4. Captured with html2canvas
// 5. Added to exactly one jsPDF A4 page
// ============================================================

const handleDownloadPDF = async () => {

    if (
        !invoiceRef.current ||
        !invoice
    ) {
        return;
    }

    try {

        setDownloading(true);

        setError("");


        // ========================================================
        // WAIT FOR COMPLETE UI RENDER
        // ========================================================

        await new Promise((resolve) => {

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    setTimeout(
                        resolve,
                        500
                    );

                });

            });

        });


        // ========================================================
        // GET EXACTLY FOUR INVOICE COPIES
        // ========================================================

        const pages =
            Array.from(
                invoiceRef.current.querySelectorAll(
                    ".invoice-page"
                )
            );


        if (pages.length !== 4) {

            throw new Error(
                `Expected 4 invoice pages but found ${pages.length}.`
            );

        }


        // ========================================================
        // CREATE A4 PDF
        // ========================================================

        const pdf =
            new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true
            });


        // ========================================================
        // SAFE FILE NAME
        // ========================================================

        const safeFileName =
            String(
                invoiceNo ||
                invoice?.InvoiceNumber ||
                "Sales-Invoice"
            )
                .replace(
                    /[\\/:*?"<>|]/g,
                    "-"
                )
                .trim();


        // ========================================================
        // PROCESS EACH COPY
        // ========================================================

        for (
            let index = 0;
            index < pages.length;
            index++
        ) {

            const originalPage =
                pages[index];


            // ====================================================
            // CREATE ISOLATED CONTAINER
            // ====================================================

            const container =
                document.createElement(
                    "div"
                );


            container.style.position =
                "fixed";

            container.style.left =
                "0px";

            container.style.top =
                "0px";

            container.style.width =
                "210mm";

            container.style.height =
                "297mm";

            container.style.margin =
                "0";

            container.style.padding =
                "0";

            container.style.backgroundColor =
                "#ffffff";

            container.style.overflow =
                "hidden";

            container.style.zIndex =
                "2147483647";

            container.style.display =
                "block";

            container.style.visibility =
                "visible";

            container.style.opacity =
                "1";

            container.style.pointerEvents =
                "none";


            // ====================================================
            // CLONE CURRENT UI
            //
            // IMPORTANT:
            // This does NOT create a new invoice design.
            //
            // It copies the exact existing invoice page.
            // ====================================================

            const page =
                originalPage.cloneNode(
                    true
                );


            // ====================================================
            // FORCE EXACT A4 BOUNDARY
            // ====================================================

            page.style.width =
                "210mm";

            page.style.height =
                "297mm";

            page.style.minWidth =
                "210mm";

            page.style.minHeight =
                "297mm";

            page.style.maxWidth =
                "210mm";

            page.style.maxHeight =
                "297mm";

            page.style.margin =
                "0";

            page.style.padding =
                "6mm";

            page.style.boxSizing =
                "border-box";

            page.style.overflow =
                "hidden";

            page.style.backgroundColor =
                "#ffffff";

            page.style.color =
                "#000000";

            page.style.position =
                "relative";

            page.style.left =
                "0";

            page.style.top =
                "0";

            page.style.transform =
                "none";

            page.style.visibility =
                "visible";

            page.style.display =
                "block";

            page.style.flex =
                "none";

            page.style.flexShrink =
                "0";


            // ====================================================
            // APPEND CLONE
            // ====================================================

            container.appendChild(
                page
            );

            document.body.appendChild(
                container
            );


            // ====================================================
            // WAIT FOR CLONE TO RENDER
            // ====================================================

            await new Promise((resolve) => {

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        setTimeout(
                            resolve,
                            200
                        );

                    });

                });

            });


            // ====================================================
            // FORCE TABLE DIMENSIONS
            // ====================================================

            const tables =
                page.querySelectorAll(
                    "table"
                );


            tables.forEach((table) => {

                table.style.width =
                    "100%";

                table.style.maxWidth =
                    "100%";

                table.style.tableLayout =
                    "fixed";

                table.style.borderCollapse =
                    "collapse";

                table.style.boxSizing =
                    "border-box";

            });


            // ====================================================
            // GET ACTUAL A4 PIXEL SIZE
            // ====================================================

            const width =
                page.offsetWidth;

            const height =
                page.offsetHeight;


            if (
                !width ||
                !height
            ) {

                if (
                    container.parentNode
                ) {

                    container.parentNode.removeChild(
                        container
                    );

                }

                throw new Error(
                    `Unable to determine dimensions for invoice copy ${index + 1}.`
                );

            }


            // ====================================================
            // CAPTURE THIS COPY ONLY
            // ====================================================

            let canvas;


            try {

                canvas =
                    await html2canvas(
                        page,
                        {

                            scale: 2,

                            width:
                                width,

                            height:
                                height,

                            windowWidth:
                                width,

                            windowHeight:
                                height,

                            x: 0,

                            y: 0,

                            scrollX: 0,

                            scrollY: 0,

                            backgroundColor:
                                "#ffffff",

                            useCORS:
                                true,

                            allowTaint:
                                false,

                            foreignObjectRendering:
                                false,

                            imageTimeout:
                                15000,

                            logging:
                                false

                        }
                    );

            } finally {

                // ================================================
                // REMOVE TEMPORARY COPY
                // ================================================

                if (
                    container.parentNode
                ) {

                    container.parentNode.removeChild(
                        container
                    );

                }

            }


            // ====================================================
            // VALIDATE CANVAS
            // ====================================================

            if (
                !canvas ||
                canvas.width <= 0 ||
                canvas.height <= 0
            ) {

                throw new Error(
                    `Unable to capture invoice copy ${index + 1}.`
                );

            }


            // ====================================================
            // ADD NEW PDF PAGE
            //
            // First copy uses the jsPDF initial page.
            // Copies 2, 3 and 4 each get their own page.
            // ====================================================

            if (index > 0) {

                pdf.addPage(
                    "a4",
                    "portrait"
                );

            }


            // ====================================================
            // CONVERT CANVAS TO IMAGE
            // ====================================================

            const imageData =
                canvas.toDataURL(
                    "image/jpeg",
                    0.98
                );


            // ====================================================
            // EXACT A4 DIMENSIONS
            // ====================================================

            pdf.addImage(
                imageData,
                "JPEG",
                0,
                0,
                210,
                297,
                undefined,
                "FAST"
            );

        }


        // ========================================================
        // SAVE
        // ========================================================

        pdf.save(
            `${safeFileName}-All-Copies.pdf`
        );


    } catch (err) {

        console.error(
            "PDF Download Error:",
            err
        );


        setError(
            err?.message ||
            "Unable to generate PDF. Please try again."
        );

    } finally {

        setDownloading(false);

    }
};

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <Stack
                    spacing={2}
                    alignItems="center"
                >

                    <CircularProgress />

                    <Typography
                        sx={{
                            fontSize: "14px"
                        }}
                    >
                        Loading invoice data...
                    </Typography>

                </Stack>

            </Box>
        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Back
                </Button>

            </Box>
        );
    }


    if (!invoice) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Sales invoice not found.
                </Alert>

            </Box>
        );
    }


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Box
            sx={{
                minHeight: "100vh",

                backgroundColor:
                    "#f1f3f6",

                py: 3,

                boxSizing:
                    "border-box",

                "@media print": {

                    backgroundColor:
                        "#ffffff",

                    padding: 0,

                    margin: 0
                }
            }}
        >

            {/* ==================================================
                ACTION BAR
            ================================================== */}

            <Box
                sx={{
                    width: "100%",

                    maxWidth: "210mm",

                    mx: "auto",

                    mb: 2,

                    px: {
                        xs: 2,
                        md: 0
                    },

                    "@media print": {
                        display: "none"
                    }
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            downloading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : (
                                    <Download />
                                )
                        }
                        onClick={
                            handleDownloadPDF
                        }
                        disabled={
                            downloading
                        }
                    >

                        {downloading
                            ? "Generating 4 Pages..."
                            : "Download All 4 Copies (PDF)"}

                    </Button>

                </Stack>

            </Box>


            {/* ==================================================
                PDF ROOT
            ================================================== */}

            <Box
                ref={invoiceRef}
                className="invoice-pdf-root"

                sx={{

                    width: "210mm",

                    maxWidth: "210mm",

                    mx: "auto",

                    p: 0,

                    m: 0,

                    display: "flex",

                    flexDirection:
                        "column",

                    gap: 0,

                    boxSizing:
                        "border-box",

                    backgroundColor:
                        "#ffffff",

                    "@media print": {

                        width: "210mm",

                        maxWidth:
                            "210mm",

                        margin: 0,

                        padding: 0
                    }
                }}
            >

                {/* ==================================================
                    FOUR INDEPENDENT A4 PAGES
                ================================================== */}

                {COPY_TYPES.map(
                    (
                        copyLabel,
                        index
                    ) => (

                        <Paper
                            key={copyLabel}
                            className="invoice-page"

                            elevation={0}

                            sx={{

                                // ======================================
                                // EXACT A4 SIZE
                                // ======================================

                                width:
                                    "210mm",

                                height:
                                    "297mm",

                                minWidth:
                                    "210mm",

                                maxWidth:
                                    "210mm",

                                minHeight:
                                    "297mm",

                                maxHeight:
                                    "297mm",


                                // ======================================
                                // CRITICAL
                                // ======================================

                                boxSizing:
                                    "border-box",

                                flex:
                                    "0 0 auto",

                                flexShrink:
                                    0,


                                // ======================================
                                // NO EXTERNAL SPACE
                                // ======================================

                                margin: 0,

                                padding:
                                    "6mm",


                                // ======================================
                                // KEEP EVERYTHING INSIDE
                                // ======================================

                                overflow:
                                    "hidden",


                                // ======================================
                                // VISUAL
                                // ======================================

                                backgroundColor:
                                    "#ffffff",

                                color:
                                    "#000000",

                                border:
                                    "1px solid #000",


                                // ======================================
                                // FONT
                                // ======================================

                                fontFamily:
                                    "'Segoe UI', Roboto, Arial, sans-serif",


                                // ======================================
                                // TABLE
                                // ======================================

                                "& table": {

                                    width:
                                        "100%",

                                    maxWidth:
                                        "100%",

                                    tableLayout:
                                        "fixed",

                                    borderCollapse:
                                        "collapse",

                                    boxSizing:
                                        "border-box"
                                },


                                "& th, & td": {

                                    border:
                                        "1px solid #000",

                                    fontSize:
                                        "8.5px",

                                    padding:
                                        "2px 3px",

                                    lineHeight:
                                        1.15,

                                    boxSizing:
                                        "border-box",

                                    overflow:
                                        "hidden",

                                    wordBreak:
                                        "break-word",

                                    overflowWrap:
                                        "anywhere"
                                },


                                // ======================================
                                // PRINT
                                // ======================================

                                "@media print": {

                                    width:
                                        "210mm",

                                    height:
                                        "297mm",

                                    minWidth:
                                        "210mm",

                                    maxWidth:
                                        "210mm",

                                    minHeight:
                                        "297mm",

                                    maxHeight:
                                        "297mm",

                                    margin: 0,

                                    padding:
                                        "6mm",

                                    overflow:
                                        "hidden",

                                    boxShadow:
                                        "none"
                                }
                            }}
                        >

                            {/* ==================================================
                                HEADER
                            ================================================== */}

                            <Box
                                sx={{
                                    width: "100%",

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center",

                                    borderBottom:
                                        "1px solid #000",

                                    pb: 0.5,

                                    mb: 0.5,

                                    boxSizing:
                                        "border-box"
                                }}
                            >

                                <Box
                                    sx={{
                                        width: "27%",

                                        display:
                                            "flex",

                                        justifyContent:
                                            "flex-start",

                                        overflow:
                                            "hidden"
                                    }}
                                >

                                    <Barcode
                                        value={
                                            String(
                                                invoiceNo
                                            )
                                        }
                                        width={1}
                                        height={22}
                                        fontSize={7}
                                        margin={0}
                                    />

                                </Box>


                                <Box
                                    sx={{
                                        width: "46%",

                                        textAlign:
                                            "center",

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "12px",

                                            fontWeight:
                                                "bold",

                                            textTransform:
                                                "uppercase",

                                            lineHeight:
                                                1.1
                                        }}
                                    >
                                        {documentType}
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",

                                            fontWeight:
                                                "bold",

                                            color:
                                                "#333",

                                            mt:
                                                0.2
                                        }}
                                    >
                                        {copyLabel}
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        width: "27%",

                                        display:
                                            "flex",

                                        justifyContent:
                                            "flex-end"
                                    }}
                                >

                                    <QRCodeSVG
                                        value={
                                            qrPayload
                                        }
                                        size={42}
                                        level="M"
                                    />

                                </Box>

                            </Box>


                            {/* ==================================================
                                SELLER
                            ================================================== */}

                            <Box
                                sx={{
                                    width: "100%",

                                    textAlign:
                                        "center",

                                    borderBottom:
                                        "1px solid #000",

                                    pb: 0.5,

                                    mb: 0.5
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize:
                                            "13px",

                                        fontWeight:
                                            "bold",

                                        lineHeight:
                                            1.1
                                    }}
                                >
                                    {sellerName}
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "8.5px",

                                        lineHeight:
                                            1.1,

                                        wordBreak:
                                            "break-word"
                                    }}
                                >
                                    {sellerAddress},{" "}
                                    {sellerCity},{" "}
                                    {sellerState} -{" "}
                                    {sellerPIN}
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "8.5px",

                                        lineHeight:
                                            1.1,

                                        wordBreak:
                                            "break-word"
                                    }}
                                >

                                    GSTIN:{" "}
                                    <strong>
                                        {sellerGstin}
                                    </strong>

                                    {" | "}

                                    Email:{" "}
                                    {sellerEmail}

                                    {" | "}

                                    Mobile:{" "}
                                    {sellerPhone}

                                </Typography>

                            </Box>


                            {/* ==================================================
                                BUYER + DOCUMENT
                            ================================================== */}

                            <Box
                                sx={{
                                    width: "100%",

                                    display:
                                        "flex",

                                    borderBottom:
                                        "1px solid #000",

                                    mb: 0.5,

                                    pb: 0.5,

                                    boxSizing:
                                        "border-box"
                                }}
                            >

                                {/* BUYER */}

                                <Box
                                    sx={{
                                        width: "50%",

                                        pr: 1,

                                        borderRight:
                                            "1px solid #000",

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9.5px",

                                            fontWeight:
                                                "bold",

                                            mb: 0.2
                                        }}
                                    >
                                        Billed To (Buyer):
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",

                                            fontWeight:
                                                "bold",

                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        {buyerName}
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",

                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        {buyerAddress || "-"}
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",

                                            lineHeight:
                                                1.1
                                        }}
                                    >
                                        GSTIN:{" "}
                                        <strong>
                                            {buyerGstin}
                                        </strong>
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",

                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        Phone:{" "}
                                        {buyerPhone}
                                        {" | "}
                                        Email:{" "}
                                        {buyerEmail}
                                    </Typography>

                                </Box>


                                {/* DOCUMENT */}

                                <Box
                                    sx={{
                                        width: "50%",

                                        pl: 1,

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",
                                            lineHeight:
                                                1.1
                                        }}
                                    >
                                        <strong>
                                            Invoice No:
                                        </strong>{" "}
                                        {invoiceNo}
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",
                                            lineHeight:
                                                1.1
                                        }}
                                    >
                                        <strong>
                                            Invoice Date:
                                        </strong>{" "}
                                        {formatDate(
                                            invoiceDate
                                        )}
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",
                                            lineHeight:
                                                1.1
                                        }}
                                    >
                                        <strong>
                                            SO No:
                                        </strong>{" "}
                                        {salesOrderNo}{" "}
                                        (
                                        {formatDate(
                                            salesOrderDate
                                        )}
                                        )
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",
                                            lineHeight:
                                                1.1
                                        }}
                                    >
                                        <strong>
                                            PO Ref:
                                        </strong>{" "}
                                        {purchaseOrderNo}{" "}
                                        (
                                        {formatDate(
                                            purchaseOrderDate
                                        )}
                                        )
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",
                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        <strong>
                                            Place of Supply:
                                        </strong>{" "}
                                        {placeOfSupply}{" "}
                                        (State Code:{" "}
                                        {stateCode})
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",
                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        <strong>
                                            E-Way Bill:
                                        </strong>{" "}
                                        {eWayBillNo}
                                        {" | "}
                                        <strong>
                                            Vehicle:
                                        </strong>{" "}
                                        {vehicleNo}
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",
                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        <strong>
                                            Despatched Via:
                                        </strong>{" "}
                                        {transportMode}
                                    </Typography>

                                </Box>

                            </Box>


                            {/* ==================================================
                                ITEMS
                            ================================================== */}

                            <Box
                                sx={{
                                    width: "100%",

                                    mb: 0.5,

                                    overflow:
                                        "hidden"
                                }}
                            >

                                <table>

                                    <thead>

                                        <tr
                                            style={{
                                                backgroundColor:
                                                    "#f0f0f0"
                                            }}
                                        >

                                            <th
                                                style={{
                                                    width:
                                                        "4%"
                                                }}
                                            >
                                                #
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "36%"
                                                }}
                                            >
                                                Item Description
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "10%"
                                                }}
                                            >
                                                HSN/SAC
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "6%",
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                Qty
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "6%",
                                                    textAlign:
                                                        "center"
                                                }}
                                            >
                                                UOM
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "10%",
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                Rate
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "10%",
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                Tax
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "18%",
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                Amount
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {items.length > 0 ? (

                                            items.map(
                                                (
                                                    item,
                                                    idx
                                                ) => (

                                                    <tr
                                                        key={
                                                            item.salesInvoiceItemId ||
                                                            `item-${idx}`
                                                        }
                                                    >

                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            {idx + 1}
                                                        </td>


                                                        <td>
                                                            {item.description}
                                                        </td>


                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            {item.hsncode}
                                                        </td>


                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right"
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </td>


                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            {item.uom}
                                                        </td>


                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right"
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                item.unitPrice
                                                            )}
                                                        </td>


                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right"
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                item.taxAmount
                                                            )}
                                                        </td>


                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right"
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                item.totalAmount
                                                            )}
                                                        </td>

                                                    </tr>
                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan={8}
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding:
                                                            "6px"
                                                    }}
                                                >
                                                    No line items available.
                                                </td>

                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                            </Box>


                            {/* ==================================================
                                TAX + TOTALS
                            ================================================== */}

                            <Box
                                sx={{
                                    width: "100%",

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    mb: 0.5,

                                    boxSizing:
                                        "border-box"
                                }}
                            >

                                {/* HSN */}

                                <Box
                                    sx={{
                                        width: "56%",

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",

                                            fontWeight:
                                                "bold",

                                            mb: 0.2
                                        }}
                                    >
                                        HSN/SAC Tax Summary:
                                    </Typography>


                                    <table>

                                        <thead>

                                            <tr
                                                style={{
                                                    backgroundColor:
                                                        "#f9f9f9"
                                                }}
                                            >

                                                <th>
                                                    HSN
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    Taxable
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    CGST
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    SGST
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    IGST
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {hsnRows.length > 0 ? (

                                                hsnRows.map(
                                                    row => (

                                                        <tr
                                                            key={
                                                                row.hsn
                                                            }
                                                        >

                                                            <td>
                                                                {row.hsn}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "right"
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    row.taxableValue
                                                                )}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "right"
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    row.cgstAmount
                                                                )}{" "}
                                                                (
                                                                {row.cgstPer}
                                                                %)
                                                            </td>

                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "right"
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    row.sgstAmount
                                                                )}{" "}
                                                                (
                                                                {row.sgstPer}
                                                                %)
                                                            </td>

                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "right"
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    row.igstAmount
                                                                )}{" "}
                                                                (
                                                                {row.igstPer}
                                                                %)
                                                            </td>

                                                        </tr>
                                                    )
                                                )

                                            ) : (

                                                <tr>

                                                    <td
                                                        colSpan={5}
                                                        style={{
                                                            textAlign:
                                                                "center",
                                                            padding:
                                                                "4px"
                                                        }}
                                                    >
                                                        No tax breakdown available
                                                    </td>

                                                </tr>
                                            )}

                                        </tbody>

                                    </table>

                                </Box>


                                {/* TOTALS */}

                                <Box
                                    sx={{
                                        width: "40%",

                                        minWidth: 0
                                    }}
                                >

                                    <table>

                                        <tbody>

                                            <tr>

                                                <td>
                                                    <strong>
                                                        Total Qty:
                                                    </strong>
                                                </td>

                                                <td
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    {totalQuantity}
                                                </td>

                                            </tr>


                                            <tr>

                                                <td>
                                                    Sub Total (Taxable):
                                                </td>

                                                <td
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        subTotal
                                                    )}
                                                </td>

                                            </tr>


                                            {discountAmount > 0 && (

                                                <tr>

                                                    <td>
                                                        Discount:
                                                    </td>

                                                    <td
                                                        style={{
                                                            textAlign:
                                                                "right"
                                                        }}
                                                    >
                                                        -{" "}
                                                        {formatCurrency(
                                                            discountAmount
                                                        )}
                                                    </td>

                                                </tr>
                                            )}


                                            <tr>

                                                <td>
                                                    Total Tax:
                                                </td>

                                                <td
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        totalTax
                                                    )}
                                                </td>

                                            </tr>


                                            <tr
                                                style={{
                                                    backgroundColor:
                                                        "#f0f0f0",

                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >

                                                <td>
                                                    Grand Total:
                                                </td>

                                                <td
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    ₹{" "}
                                                    {formatCurrency(
                                                        grandTotal
                                                    )}
                                                </td>

                                            </tr>


                                            <tr>

                                                <td>
                                                    Paid Amount:
                                                </td>

                                                <td
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    ₹{" "}
                                                    {formatCurrency(
                                                        paidAmount
                                                    )}
                                                </td>

                                            </tr>


                                            <tr
                                                style={{
                                                    color:
                                                        balanceAmount > 0
                                                            ? "#d32f2f"
                                                            : "#2e7d32",

                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >

                                                <td>
                                                    Balance Due:
                                                </td>

                                                <td
                                                    style={{
                                                        textAlign:
                                                            "right"
                                                    }}
                                                >
                                                    ₹{" "}
                                                    {formatCurrency(
                                                        balanceAmount
                                                    )}
                                                </td>

                                            </tr>

                                        </tbody>

                                    </table>

                                </Box>

                            </Box>


                            {/* ==================================================
                                FOOTER
                            ================================================== */}

                            <Box
                                sx={{
                                    width: "100%",

                                    borderTop:
                                        "1px solid #000",

                                    pt: 0.5,

                                    mt: 0.8,

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    boxSizing:
                                        "border-box"
                                }}
                            >

                                <Box
                                    sx={{
                                        width: "60%",

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "8px",

                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >

                                        <strong>
                                            Terms of Payment:
                                        </strong>{" "}

                                        {paymentTerms}

                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "8px",

                                            color:
                                                "#555",

                                            mt:
                                                0.2,

                                            lineHeight:
                                                1.1
                                        }}
                                    >
                                        This is a computer-generated invoice and requires no physical signature under GST regulations.
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        width: "35%",

                                        textAlign:
                                            "right",

                                        pt: 1
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "9px",

                                            fontWeight:
                                                "bold",

                                            lineHeight:
                                                1.1,

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        For {sellerName}
                                    </Typography>


                                    <Box
                                        sx={{
                                            height:
                                                "15px"
                                        }}
                                    />


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "8px"
                                        }}
                                    >
                                        (Authorized Signatory)
                                    </Typography>

                                </Box>

                            </Box>

                        </Paper>
                    )
                )}

            </Box>

        </Box>
    );
};


export default SalesInvoicePrint;