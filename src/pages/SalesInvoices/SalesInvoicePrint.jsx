// ============================================================
// SalesInvoicePrint.jsx
// Sales Invoice PDF / Download Page
//
// Architecture:
// React -> Node server.js -> ASP.NET Core API
// ============================================================

import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";
import html2pdf from "html2pdf.js";

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
// INVOICE COMPONENTS
// ============================================================

import InvoiceHeader
    from "./InvoiceHeader";

import InvoiceCustomerSection
    from "./InvoiceCustomerSection";

import InvoiceInformation
    from "./InvoiceInformation";

import InvoiceItems
    from "./InvoiceItems";

import InvoiceTaxSection
    from "./InvoiceTaxSection";

import InvoiceCharges
    from "./InvoiceCharges";

import InvoiceSummary
    from "./InvoiceSummary";

import InvoicePayment
    from "./InvoicePayment";

import InvoiceTransport
    from "./InvoiceTransport";

import InvoiceProjectSection
    from "./InvoiceProjectSection";

import InvoiceDeliveryTerms
    from "./InvoiceDeliveryTerms";

// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// COMPONENT
// ============================================================

const SalesInvoicePrint = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const invoiceRef = useRef(null);

    const [invoice, setInvoice] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [downloading, setDownloading] = useState(false);

    // ========================================================
    // LOAD INVOICE
    // ========================================================

    const loadInvoice = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading Sales Invoice:",
                id
            );

            const response = await axios.get(
                `${SERVER_URL}/api/sales-invoices/${id}`
            );

            console.log(
                "Sales Invoice Response:",
                response.data
            );

            setInvoice(response.data);

        } catch (err) {

            console.error(
                "Sales Invoice Load Error:",
                err
            );

            const responseData =
                err?.response?.data;

            setError(
                responseData?.message ||
                responseData ||
                err?.message ||
                "Unable to load sales invoice."
            );

        } finally {

            setLoading(false);

        }

    }, [id]);

    // ========================================================
    // LOAD ON PAGE
    // ========================================================

    useEffect(() => {

        if (id) {
            loadInvoice();
        }

    }, [
        id,
        loadInvoice
    ]);

    // ========================================================
    // DOWNLOAD PDF
    // ========================================================

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

            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );

            // ------------------------------------------------
            // INVOICE NUMBER
            // ------------------------------------------------

            const invoiceNumber =
                invoice?.InvoiceNumber ||
                invoice?.invoiceNumber ||
                `Invoice-${id}`;

            // ------------------------------------------------
            // SAFE FILE NAME
            // ------------------------------------------------

            const safeFileName =
                String(invoiceNumber)
                    .replace(/[\\/:*?"<>|]/g, "-")
                    .trim();

            // ------------------------------------------------
            // PDF ELEMENT
            // ------------------------------------------------

            const element =
                invoiceRef.current;

            // ------------------------------------------------
            // PDF OPTIONS
            // ------------------------------------------------

            const options = {

                margin: [
                    6,
                    6,
                    6,
                    6
                ],

                filename:
                    `${safeFileName}.pdf`,

                image: {
                    type: "jpeg",
                    quality: 0.98
                },

                html2canvas: {

                    scale: 2,

                    useCORS: true,

                    allowTaint: false,

                    logging: false,

                    backgroundColor:
                        "#ffffff",

                    scrollX: 0,

                    scrollY: 0

                },

                jsPDF: {

                    unit: "mm",

                    format: "a4",

                    orientation: "portrait",

                    compress: true

                },

                pagebreak: {

                    mode: [
                        "css",
                        "legacy"
                    ],

                    avoid: [

                        ".invoice-section",

                        ".invoice-table",

                        ".invoice-summary",

                        ".invoice-payment",

                        ".invoice-transport",

                        ".invoice-project",

                        ".invoice-buyer-section",

                        ".invoice-delivery-terms"

                    ]

                }

            };

            // ------------------------------------------------
            // GENERATE PDF
            // ------------------------------------------------

            await html2pdf()
                .set(options)
                .from(element)
                .save();

        } catch (err) {

            console.error(
                "PDF Download Error:",
                err
            );

            setError(
                "Unable to generate PDF. Please try again."
            );

        } finally {

            setDownloading(false);

        }

    };

    // ========================================================
    // LOADING
    // ========================================================

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
                        Loading invoice...
                    </Typography>

                </Stack>

            </Box>

        );

    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/sales-invoices"
                        )
                    }
                >
                    Back to Sales Invoices
                </Button>

            </Box>

        );

    }

    // ========================================================
    // NO DATA
    // ========================================================

    if (!invoice) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert severity="warning">
                    Sales invoice not found.
                </Alert>

            </Box>

        );

    }

    // ========================================================
    // NORMALIZE CHILD DATA
    // ========================================================

    const items =
        invoice?.Items ||
        invoice?.items ||
        [];

    const payments =
        invoice?.Payments ||
        invoice?.payments ||
        [];

    const additionalCharges =
        invoice?.AdditionalCharges ||
        invoice?.additionalCharges ||
        [];

    // ========================================================
    // CUSTOMER
    // ========================================================

    const customer = {

        customerId:
            invoice?.CustomerId ??
            invoice?.customerId,

        customerName:
            invoice?.CompanyName ||
            invoice?.companyName ||
            "",

        companyName:
            invoice?.CompanyName ||
            invoice?.companyName ||
            "",

        mobileNo:
            invoice?.MobileNo ||
            invoice?.mobileNo ||
            "",

        emailAddress:
            invoice?.EmailAddress ||
            invoice?.emailAddress ||
            "",

        companyAddress:
            invoice?.CompanyAddress ||
            invoice?.companyAddress ||
            "",

        companyCity:
            invoice?.CompanyCity ||
            invoice?.companyCity ||
            "",

        companyState:
            invoice?.CompanyState ||
            invoice?.companyState ||
            "",

        companyPINCode:
            invoice?.CompanyPINCode ||
            invoice?.companyPINCode ||
            "",

        customerGSTIN:
            invoice?.CustomerGSTIN ||
            invoice?.customerGSTIN ||
            ""

    };

    // ========================================================
    // SELLER
    // ========================================================

    const seller = {

        sellerId:
            invoice?.SellerId ??
            invoice?.sellerId,

        companyName:
            invoice?.UserCompanyName ||
            invoice?.userCompanyName ||
            invoice?.SellerCompanyName ||
            invoice?.sellerCompanyName ||
            "YOUR COMPANY NAME",

        companyAddress:
            invoice?.UserCompanyAddress ||
            invoice?.userCompanyAddress ||
            "",

        companyCity:
            invoice?.UserCompanyCity ||
            invoice?.userCompanyCity ||
            "",

        companyState:
            invoice?.UserCompanyState ||
            invoice?.userCompanyState ||
            "",

        companyPINCode:
            invoice?.UserCompanyPINCode ||
            invoice?.userCompanyPINCode ||
            "",

        gstin:
            invoice?.UserGSTIN ||
            invoice?.userGSTIN ||
            ""

    };

    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f1f3f6",
                py: 3,
                boxSizing: "border-box"
            }}
        >

            {/* =================================================
                ACTION BAR
            ================================================= */}

            <Box
                sx={{
                    width: {
                        xs: "100%",
                        md: "210mm"
                    },
                    maxWidth: "100%",
                    mx: "auto",
                    mb: 2,
                    px: {
                        xs: 2,
                        md: 0
                    },
                    boxSizing: "border-box"
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "stretch",
                        sm: "center"
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/sales-invoices"
                            )
                        }
                    >
                        Back to Sales Invoices
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={

                            downloading ? (

                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />

                            ) : (

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
                            ? "Generating PDF..."
                            : "Download PDF"}

                    </Button>

                </Stack>

            </Box>

            {/* =================================================
                A4 PAPER
            ================================================= */}

            <Paper
                ref={invoiceRef}
                elevation={3}
                className="sales-invoice-pdf"
                sx={{

                    width: "210mm",

                    minHeight: "297mm",

                    maxWidth: "100%",

                    mx: "auto",

                    backgroundColor:
                        "#ffffff",

                    color: "#000000",

                    boxSizing:
                        "border-box",

                    px: "9mm",

                    py: "7mm",

                    overflow: "hidden",

                    // ==========================================
                    // GLOBAL SECTIONS
                    // ==========================================

                    "& .invoice-section": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        marginBottom:
                            "4mm",

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // BUYER
                    // ==========================================

                    "& .invoice-buyer-section": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // DELIVERY TERMS
                    // ==========================================

                    "& .invoice-delivery-terms": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // TABLES
                    // ==========================================

                    "& table": {

                        width: "100%",

                        borderCollapse:
                            "collapse",

                        boxSizing:
                            "border-box"

                    },

                    "& th": {

                        fontSize: "9px",

                        fontWeight: 700,

                        padding:
                            "5px 5px",

                        verticalAlign:
                            "middle",

                        wordBreak:
                            "break-word"

                    },

                    "& td": {

                        fontSize: "9px",

                        padding:
                            "5px 5px",

                        verticalAlign:
                            "top",

                        wordBreak:
                            "break-word"

                    },

                    // ==========================================
                    // ITEM TABLE
                    // ==========================================

                    "& .invoice-table": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        pageBreakInside:
                            "auto"

                    },

                    "& .invoice-table tr": {

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // SUMMARY
                    // ==========================================

                    "& .invoice-summary": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // PAYMENT
                    // ==========================================

                    "& .invoice-payment": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // TRANSPORT
                    // ==========================================

                    "& .invoice-transport": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // PROJECT
                    // ==========================================

                    "& .invoice-project": {

                        width: "100%",

                        boxSizing:
                            "border-box",

                        pageBreakInside:
                            "avoid"

                    },

                    // ==========================================
                    // IMAGES / SVG
                    // ==========================================

                    "& img": {

                        maxWidth:
                            "100%"

                    },

                    "& svg": {

                        maxWidth:
                            "100%"

                    },

                    // ==========================================
                    // PRINT
                    // ==========================================

                    "@media print": {

                        width: "210mm",

                        minHeight: "297mm",

                        margin: 0,

                        padding:
                            "7mm 9mm",

                        boxShadow: "none",

                        backgroundColor:
                            "#ffffff"

                    }

                }}
            >

                {/* =================================================
                    1. COMPANY HEADER
                       COMPANY
                       BARCODE LEFT
                       QR RIGHT
                       TAX INVOICE
                ================================================= */}

                <Box
                    className="invoice-section"
                >

                    <InvoiceHeader
                        invoice={invoice}
                        seller={seller}
                        customer={customer}
                    />

                </Box>

                {/* =================================================
                    2. BUYER / CUSTOMER
                ================================================= */}

                <Box
                    className="invoice-buyer-section"
                    sx={{
                        border:
                            "1px solid #000",

                        mb: "4mm",

                        boxSizing:
                            "border-box"
                    }}
                >

                    <InvoiceCustomerSection
                        invoice={invoice}
                        customer={customer}
                    />

                </Box>

                {/* =================================================
                    3. INVOICE INFORMATION
                ================================================= */}

                <Box
                    className="invoice-section"
                >

                    <InvoiceInformation
                        invoice={invoice}
                    />

                </Box>

                {/* =================================================
                    4. PROJECT INFORMATION
                ================================================= */}

                <Box
                    className="invoice-project"
                    sx={{
                        mb: "4mm"
                    }}
                >

                    <InvoiceProjectSection
                        invoice={invoice}
                    />

                </Box>

                {/* =================================================
                    5. PRODUCTS / ITEMS
                ================================================= */}

                <Box
                    className="invoice-table"
                    sx={{
                        mb: "4mm"
                    }}
                >

                    <InvoiceItems
                        invoice={invoice}
                        items={items}
                    />

                </Box>

                {/* =================================================
                    6. TAX DETAILS
                ================================================= */}

                <Box
                    className="invoice-section"
                >

                    <InvoiceTaxSection
                        invoice={invoice}
                        items={items}
                    />

                </Box>

                {/* =================================================
                    7. ADDITIONAL CHARGES
                ================================================= */}

                {additionalCharges.length > 0 && (

                    <Box
                        className="invoice-section"
                    >

                        <InvoiceCharges
                            invoice={invoice}
                            charges={
                                additionalCharges
                            }
                        />

                    </Box>

                )}

                {/* =================================================
                    8. SUMMARY
                ================================================= */}

                <Box
                    className="invoice-summary"
                    sx={{
                        mb: "4mm"
                    }}
                >

                    <InvoiceSummary
                        invoice={invoice}
                        items={items}
                        charges={
                            additionalCharges
                        }
                    />

                </Box>

                {/* =================================================
                    9. PAYMENT
                ================================================= */}

                <Box
                    className="invoice-payment"
                    sx={{
                        mb: "4mm"
                    }}
                >

                    <InvoicePayment
                        invoice={invoice}
                        payments={payments}
                    />

                </Box>

                {/* =================================================
                    10. TRANSPORT
                ================================================= */}

                <Box
                    className="invoice-transport"
                    sx={{
                        mb: "4mm"
                    }}
                >

                    <InvoiceTransport
                        invoice={invoice}
                    />

                </Box>

                {/* =================================================
                    11. TERMS OF DELIVERY
                    MOVED TO BOTTOM
                ================================================= */}

                <Box
                    className="invoice-delivery-terms"
                    sx={{
                        mb: "4mm"
                    }}
                >

                    <InvoiceDeliveryTerms
                        invoice={invoice}
                    />

                </Box>

                {/* =================================================
                    12. SIGNATURE
                ================================================= */}

                <Box
                    className="invoice-section"
                    sx={{
                        mt: "10mm",
                        display: "flex",
                        justifyContent:
                            "flex-end",
                        pageBreakInside:
                            "avoid"
                    }}
                >

                    <Box
                        sx={{
                            width: "55mm",
                            textAlign:
                                "center"
                        }}
                    >

                        <Box
                            sx={{
                                height: "15mm",
                                borderBottom:
                                    "1px solid #000",
                                mb: 1
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "9px",
                                fontWeight: 600
                            }}
                        >
                            Authorised Signatory
                        </Typography>

                    </Box>

                </Box>

                {/* =================================================
                    13. FOOTER
                ================================================= */}

                <Box
                    sx={{
                        mt: "6mm",
                        pt: "2mm",
                        borderTop:
                            "1px solid #999",
                        textAlign:
                            "center",
                        pageBreakInside:
                            "avoid"
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "8px",
                            color: "#555",
                            lineHeight: 1.4
                        }}
                    >
                        This is a computer generated invoice.
                    </Typography>

                </Box>

            </Paper>

        </Box>

    );

};

// ============================================================
// EXPORT
// ============================================================

export default SalesInvoicePrint;