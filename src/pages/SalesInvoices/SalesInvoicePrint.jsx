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

import InvoiceHeader from "./InvoiceHeader";
import InvoiceCustomerSection from "./InvoiceCustomerSection";
import InvoiceInformation from "./InvoiceInformation";
import InvoiceItems from "./InvoiceItems";
import InvoiceTaxSection from "./InvoiceTaxSection";
import InvoiceCharges from "./InvoiceCharges";
import InvoiceSummary from "./InvoiceSummary";
import InvoicePayment from "./InvoicePayment";
import InvoiceTransport from "./InvoiceTransport";
import InvoiceProjectSection from "./InvoiceProjectSection";

// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// COMPONENT
// ============================================================

const SalesInvoicePrint = () => {

    const {
        id
    } = useParams();

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

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to load sales invoice."
            );

        } finally {

            setLoading(false);
        }

    }, [id]);

    // ========================================================
    // EFFECT
    // ========================================================

    useEffect(() => {

        if (id) {
            loadInvoice();
        }

    }, [id, loadInvoice]);

    // ========================================================
    // DOWNLOAD PDF
    // ========================================================

    const handleDownloadPDF = async () => {

        if (!invoiceRef.current || !invoice) {
            return;
        }

        try {

            setDownloading(true);

            // Small delay allows the browser to finish rendering
            await new Promise(resolve =>
                setTimeout(resolve, 150)
            );

            const invoiceNumber =
                invoice?.InvoiceNumber ||
                invoice?.invoiceNumber ||
                `Invoice-${id}`;

            const safeFileName =
                String(invoiceNumber)
                    .replace(/[\\/:*?"<>|]/g, "-")
                    .trim();

            const element =
                invoiceRef.current;

            const options = {

                margin: [
                    8,
                    8,
                    8,
                    8
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
                    backgroundColor: "#ffffff"
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
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
                        ".invoice-project"
                    ]
                }

            };

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
                "Unable to generate PDF."
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

                    <Typography>
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
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/sales-invoices")
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
    // NORMALIZE DATA
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
                py: 3
            }}
        >

            {/* =================================================
                TOP ACTION BAR
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
                    }
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "stretch",
                        sm: "center"
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/sales-invoices")
                        }
                    >
                        Back to Sales Invoices
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            downloading
                                ? <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                                : <Download />
                        }
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                    >
                        {downloading
                            ? "Generating PDF..."
                            : "Download PDF"}
                    </Button>

                </Stack>

            </Box>

            {/* =================================================
                A4 INVOICE
            ================================================= */}

            <Paper
                elevation={3}
                ref={invoiceRef}
                className="sales-invoice-pdf"
                sx={{
                    width: "210mm",
                    minHeight: "297mm",
                    maxWidth: "100%",
                    mx: "auto",
                    backgroundColor: "#fff",
                    boxSizing: "border-box",

                    px: "10mm",
                    py: "8mm",

                    overflow: "hidden",

                    color: "#000",

                    "& .invoice-section": {
                        width: "100%",
                        boxSizing: "border-box",
                        marginBottom: "5mm",
                        pageBreakInside: "avoid"
                    },

                    "& table": {
                        width: "100%",
                        borderCollapse: "collapse",
                        tableLayout: "fixed"
                    },

                    "& th": {
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "5px 4px",
                        verticalAlign: "middle",
                        wordBreak: "break-word"
                    },

                    "& td": {
                        fontSize: "9px",
                        padding: "5px 4px",
                        verticalAlign: "top",
                        wordBreak: "break-word"
                    },

                    "& .invoice-table": {
                        pageBreakInside: "avoid"
                    },

                    "& .invoice-summary": {
                        pageBreakInside: "avoid"
                    },

                    "& .invoice-payment": {
                        pageBreakInside: "avoid"
                    },

                    "& .invoice-transport": {
                        pageBreakInside: "avoid"
                    },

                    "& .invoice-project": {
                        pageBreakInside: "avoid"
                    },

                    "@media print": {

                        width: "210mm",
                        minHeight: "297mm",
                        margin: 0,
                        padding: "8mm",

                        boxShadow: "none",

                        backgroundColor: "#fff"
                    }
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    className="invoice-section"
                >
                    <InvoiceHeader
                        invoice={invoice}
                        seller={seller}
                    />
                </Box>

                {/* =================================================
                    CUSTOMER
                ================================================= */}

                <Box
                    className="invoice-section"
                >
                    <InvoiceCustomerSection
                        invoice={invoice}
                        customer={customer}
                    />
                </Box>

                {/* =================================================
                    INVOICE INFORMATION
                ================================================= */}

                <Box
                    className="invoice-section"
                >
                    <InvoiceInformation
                        invoice={invoice}
                    />
                </Box>

                {/* =================================================
                    PROJECT
                ================================================= */}

                <Box
                    className="invoice-project invoice-section"
                >
                    <InvoiceProjectSection
                        invoice={invoice}
                    />
                </Box>

                {/* =================================================
                    ITEMS
                ================================================= */}

                <Box
                    className="invoice-table invoice-section"
                >
                    <InvoiceItems
                        invoice={invoice}
                        items={items}
                    />
                </Box>

                {/* =================================================
                    TAX
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
                    ADDITIONAL CHARGES
                ================================================= */}

                {additionalCharges.length > 0 && (

                    <Box
                        className="invoice-section"
                    >
                        <InvoiceCharges
                            invoice={invoice}
                            charges={additionalCharges}
                        />
                    </Box>
                )}

                {/* =================================================
                    SUMMARY
                ================================================= */}

                <Box
                    className="invoice-summary invoice-section"
                >
                    <InvoiceSummary
                        invoice={invoice}
                        items={items}
                        charges={additionalCharges}
                    />
                </Box>

                {/* =================================================
                    PAYMENT
                ================================================= */}

                <Box
                    className="invoice-payment invoice-section"
                >
                    <InvoicePayment
                        invoice={invoice}
                        payments={payments}
                    />
                </Box>

                {/* =================================================
                    TRANSPORT
                ================================================= */}

                <Box
                    className="invoice-transport invoice-section"
                >
                    <InvoiceTransport
                        invoice={invoice}
                    />
                </Box>

                {/* =================================================
                    TERMS
                ================================================= */}

                <Box
                    className="invoice-section"
                    sx={{
                        mt: 3,
                        pt: 1.5,
                        borderTop: "1px solid #000"
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            mb: 0.5
                        }}
                    >
                        Terms of Delivery
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "9px",
                            lineHeight: 1.5
                        }}
                    >
                        {invoice?.Transport ||
                            invoice?.transport ||
                            "-"}
                    </Typography>

                </Box>

                {/* =================================================
                    SIGNATURE
                ================================================= */}

                <Box
                    sx={{
                        mt: 10,
                        display: "flex",
                        justifyContent: "flex-end"
                    }}
                >

                    <Box
                        sx={{
                            width: "55mm",
                            textAlign: "center"
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
                    FOOTER
                ================================================= */}

                <Box
                    sx={{
                        mt: 6,
                        pt: 1,
                        borderTop: "1px solid #999",
                        textAlign: "center"
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "8px",
                            color: "#555"
                        }}
                    >
                        This is a computer generated invoice.
                    </Typography>

                </Box>

            </Paper>

        </Box>
    );
};

export default SalesInvoicePrint;