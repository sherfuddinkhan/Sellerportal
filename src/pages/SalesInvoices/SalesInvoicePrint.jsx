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
// CONFIG & HELPERS
// ============================================================

// Point to Node.js proxy server (Port 5000)
const SERVER_URL = "http://localhost:5000";

const formatCurrency = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0.00";
    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

const numberValue = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

// ============================================================
// DATA NORMALIZATION (PascalCase & Stringified JSON Support)
// ============================================================

const getNormalizedItems = (rawItems) => {
    // 1. Log what was passed in
    console.log("🔍 getNormalizedItems INPUT:", rawItems);

    let parsedItems = rawItems;

    // Handle stringified JSON
    if (typeof rawItems === "string") {
        try {
            parsedItems = JSON.parse(rawItems);
            console.log("📦 Parsed stringified JSON:", parsedItems);
        } catch (e) {
            console.error("❌ Failed to parse stringified items:", e);
            parsedItems = [];
        }
    }

    // 2. EF Core $values unwrap check
    if (parsedItems && typeof parsedItems === "object" && parsedItems.$values) {
        console.log("🔗 Detected EF Core $values wrapper:", parsedItems.$values);
        parsedItems = parsedItems.$values;
    }

    // 3. Array verification check
    if (!Array.isArray(parsedItems)) {
        console.warn("⚠️ getNormalizedItems expected an Array, but received:", typeof parsedItems, parsedItems);
        return [];
    }

    console.log(`✅ Mapping ${parsedItems.length} items...`);

    const normalized = parsedItems.map((item, index) => {
        console.log(`🔹 Item [${index}] Raw Keys:`, Object.keys(item || {}));

        const qty = numberValue(item?.quantity ?? item?.Quantity ?? item?.qty ?? item?.Qty);
        const rate = numberValue(item?.unitPrice ?? item?.UnitPrice ?? item?.rate ?? item?.Rate);
        const taxAmt = numberValue(item?.taxAmount ?? item?.TaxAmount ?? item?.gstAmount ?? item?.GstAmount);
        const totalAmt = numberValue(
            item?.afterGSTAmount ?? item?.AfterGSTAmount ?? item?.totalAmount ?? item?.TotalAmount ?? item?.amount ?? item?.Amount
        );

        return {
            salesInvoiceItemId: item?.salesInvoiceItemId || item?.SalesInvoiceItemId || item?.id || item?.Id,
            description: item?.description || item?.Description || item?.itemName || item?.ItemName || "N/A",
            hsncode: item?.hsncode || item?.hsnCode || item?.HSNCode || item?.hsn || item?.HSN || "-",
            quantity: qty,
            uom: item?.uom || item?.UOM || item?.unit || item?.Unit || "Pcs",
            unitPrice: rate,
            taxAmount: taxAmt,
            totalAmount: totalAmt || (qty * rate + taxAmt),
            cgstPer: numberValue(item?.cgstPer ?? item?.CgstPer ?? item?.cgstRate),
            sgstPer: numberValue(item?.sgstPer ?? item?.SgstPer ?? item?.sgstRate),
            igstPer: numberValue(item?.igstPer ?? item?.IgstPer ?? item?.igstRate),
            cgstAmount: numberValue(item?.cgstAmount ?? item?.CgstAmount),
            sgstAmount: numberValue(item?.sgstAmount ?? item?.SgstAmount),
            igstAmount: numberValue(item?.igstAmount ?? item?.IgstAmount)
        };
    });

    console.log("🏁 Final Normalized Output:", normalized);
    return normalized;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const SalesInvoicePrint = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const invoiceRef = useRef(null);

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);

    // Fetch data via Node proxy middleware
     const loadInvoiceData = useCallback(async () => {
    try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${SERVER_URL}/api/sales-invoices/${id || 1}`);
        const data = response.data;
        const primaryInvoice = Array.isArray(data) ? data[0] : (data?.$values ? data.$values[0] : data);
        
        // 🚨 ADD THESE TWO LOGS TO INSPECT YOUR BACKEND PAYLOAD:
        console.log("RAW INVOICE OBJECT:", primaryInvoice);
        console.log("AVAILABLE INVOICE KEYS:", Object.keys(primaryInvoice || {}));

        setInvoice(primaryInvoice);
    } catch (err) {
        console.error("Sales Invoice Load Error:", err);
        setError("Unable to load sales invoice.");
    } finally {
        setLoading(false);
    }
}, [id]);

    useEffect(() => {
        loadInvoiceData();
    }, [loadInvoiceData]);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current || !invoice) return;

        try {
            setDownloading(true);
            setError("");

            await new Promise((resolve) => setTimeout(resolve, 300));

            const invoiceNumber = invoice?.invoiceNumber || invoice?.InvoiceNumber || `Invoice-${id}`;
            const safeFileName = String(invoiceNumber).replace(/[\\/:*?"<>|]/g, "-").trim();

            const options = {
                margin: [4, 4, 4, 4],
                filename: `${safeFileName}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff" },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
                pagebreak: { mode: ["css", "legacy"] }
            };

            await html2pdf().set(options).from(invoiceRef.current).save();
        } catch (err) {
            console.error("PDF Download Error:", err);
            setError("Unable to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Stack spacing={2} alignItems="center">
                    <CircularProgress />
                    <Typography sx={{ fontSize: "14px" }}>Loading invoice data...</Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>
        );
    }

    if (!invoice) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">Sales invoice not found.</Alert>
            </Box>
        );
    }

    // Extract items safely with support for multiple naming patterns
    const rawItems = invoice?.items || invoice?.Items || invoice?.salesInvoiceItems || invoice?.SalesInvoiceItems;
    const items = getNormalizedItems(rawItems);

    // Company & Billing details with fallback
    const sellerName = invoice?.companyName || invoice?.CompanyName || "TechNova Solutions Pvt Ltd";
    const sellerAddress = invoice?.companyAddress || invoice?.CompanyAddress || "Plot No. 25, Industrial Estate, Hyderabad";
    const sellerCity = invoice?.companyCity || invoice?.CompanyCity || "Hyderabad";
    const sellerState = invoice?.companyState || invoice?.CompanyState || "Telangana";
    const sellerPIN = invoice?.companyPINCode || invoice?.CompanyPINCode || "500034";
    const sellerGstin = invoice?.customerGSTIN || invoice?.CustomerGSTIN || invoice?.sellerGSTIN || "36ABCDE1234F1Z5";
    const sellerEmail = invoice?.emailAddress || invoice?.EmailAddress || "accounts@technova.example.com";
    const sellerPhone = invoice?.mobileNo || invoice?.MobileNo || "9876543210";

    const remarks = invoice?.remarks || invoice?.Remarks || "";
    const buyerName = remarks.includes("created for") ? remarks.replace("Sales invoice created for ", "") : (invoice?.customerName || invoice?.CustomerName || "TechNova Retail Customer");
    const buyerAddress = invoice?.destination || invoice?.Destination || "Hyderabad, Telangana";
    const buyerPhone = invoice?.mobileNo || invoice?.MobileNo || "9876543210";
    const buyerEmail = invoice?.emailAddress || invoice?.EmailAddress || "accounts@technova.example.com";
    const buyerGstin = invoice?.userGSTIN || invoice?.UserGSTIN || invoice?.buyerGSTIN || "29KLMNO7890P1Z3";

    const invoiceNo = invoice?.invoiceNumber || invoice?.InvoiceNumber || "INV-TN-002";
    const invoiceDate = invoice?.invoiceDate || invoice?.InvoiceDate || "2026-09-15T10:56:15.677";
    const documentType = invoice?.documentType || invoice?.DocumentType || "TAX INVOICE";
    const placeOfSupply = invoice?.placeOfSupply || invoice?.PlaceOfSupply || "Telangana";
    const stateCode = invoice?.stateCode || invoice?.StateCode || "36";

    const salesOrderId = invoice?.salesOrderId || invoice?.SalesOrderId;
    const salesOrderNo = salesOrderId ? `SO-${salesOrderId}` : "1";
    const salesOrderDate = invoice?.createdDate || invoice?.CreatedDate;
    const purchaseOrderNo = invoice?.purchaseOrderNo || invoice?.PurchaseOrderNo || "PO-TN-2026-002";
    const purchaseOrderDate = invoice?.purchaseOrderDate || invoice?.PurchaseOrderDate;
    const eWayBillNo = invoice?.eWayBillNumber || invoice?.EWayBillNumber || "361234567891";
    const vehicleNo = invoice?.vehicleNo || invoice?.VehicleNo || "TS09AB1234";
    const transportMode = invoice?.despatchedThrough || invoice?.DespatchedThrough || invoice?.transportMode || "TechNova Logistics";
    const paymentTerms = invoice?.modeOrTermsOfPayment || invoice?.ModeOrTermsOfPayment || "30 Days Credit";

    // Summary calculations
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = numberValue(invoice?.subTotal ?? invoice?.SubTotal) || items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountAmount = numberValue(invoice?.discountAmount ?? invoice?.DiscountAmount);
    const totalTax = numberValue(invoice?.taxAmount ?? invoice?.TaxAmount) || items.reduce((sum, item) => sum + item.taxAmount, 0);
    const grandTotal = numberValue(invoice?.totalAmount ?? invoice?.TotalAmount) || (subTotal + totalTax - discountAmount);
    const paidAmount = numberValue(invoice?.paidAmount ?? invoice?.PaidAmount);
    const balanceAmount = numberValue(invoice?.balanceAmount ?? invoice?.BalanceAmount) || (grandTotal - paidAmount);

    // Dynamic HSN Tax Summary Aggregation
    const hsnMap = items.reduce((acc, item) => {
        const hsn = item.hsncode;
        const taxableValue = item.quantity * item.unitPrice;

        if (!acc[hsn]) {
            acc[hsn] = {
                hsn,
                taxableValue: 0,
                cgstPer: item.cgstPer,
                sgstPer: item.sgstPer,
                igstPer: item.igstPer,
                cgstAmount: 0,
                sgstAmount: 0,
                igstAmount: 0
            };
        }

        acc[hsn].taxableValue += taxableValue;
        acc[hsn].cgstAmount += item.cgstAmount;
        acc[hsn].sgstAmount += item.sgstAmount;
        acc[hsn].igstAmount += item.igstAmount;

        return acc;
    }, {});

    const hsnRows = Object.values(hsnMap);

    const qrPayload = JSON.stringify({
        gstin: sellerGstin,
        invoiceNumber: invoiceNo,
        invoiceDate: invoiceDate,
        totalAmount: grandTotal,
        buyerGstin: buyerGstin
    });

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f1f3f6", py: 3, boxSizing: "border-box" }}>
            <Box sx={{ width: { xs: "100%", md: "210mm" }, maxWidth: "100%", mx: "auto", mb: 2, px: { xs: 2, md: 0 } }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between" alignItems="center">
                    <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <Download />}
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                    >
                        {downloading ? "Generating PDF..." : "Download PDF"}
                    </Button>
                </Stack>
            </Box>

            <Paper
                ref={invoiceRef}
                elevation={3}
                sx={{
                    width: "210mm",
                    minHeight: "297mm",
                    maxWidth: "100%",
                    mx: "auto",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    p: "8mm",
                    fontFamily: "'Segoe UI', Roboto, sans-serif",
                    border: "1px solid #000",
                    "& table": { width: "100%", borderCollapse: "collapse" },
                    "& th, & td": { border: "1px solid #000", fontSize: "10px", padding: "4px 6px" },
                    "@media print": { width: "210mm", minHeight: "297mm", margin: 0, padding: "8mm", boxShadow: "none" }
                }}
            >
                {/* HEADER SECTION */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #000", pb: 1, mb: 1 }}>
                    <Box sx={{ width: "25%", display: "flex", justifyContent: "flex-start" }}>
                        <Barcode value={invoiceNo} width={1.1} height={28} fontSize={8} margin={0} />
                    </Box>
                    <Box sx={{ width: "50%", textAlign: "center" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase" }}>
                            {documentType}
                        </Typography>
                        <Typography sx={{ fontSize: "10px" }}>Original For Recipient</Typography>
                    </Box>
                    <Box sx={{ width: "25%", display: "flex", justifyContent: "flex-end" }}>
                        <QRCodeSVG value={qrPayload} size={55} level="M" />
                    </Box>
                </Box>

                {/* COMPANY DETAILS */}
                <Box sx={{ textAlign: "center", borderBottom: "1px solid #000", pb: 1, mb: 1 }}>
                    <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>{sellerName}</Typography>
                    <Typography sx={{ fontSize: "10px" }}>
                        {sellerAddress}, {sellerCity}, {sellerState} - {sellerPIN}
                    </Typography>
                    <Typography sx={{ fontSize: "10px" }}>
                        GSTIN: <strong>{sellerGstin}</strong> | Email: {sellerEmail} | Mobile: {sellerPhone}
                    </Typography>
                </Box>

                {/* BUYER & INVOICE META */}
                <Box sx={{ display: "flex", borderBottom: "1px solid #000", mb: 1, pb: 1 }}>
                    <Box sx={{ width: "50%", pr: 1, borderRight: "1px solid #000" }}>
                        <Typography sx={{ fontSize: "11px", fontWeight: "bold", mb: 0.5 }}>Billed To (Buyer):</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: "bold" }}>{buyerName}</Typography>
                        <Typography sx={{ fontSize: "10px" }}>{buyerAddress}</Typography>
                        <Typography sx={{ fontSize: "10px" }}>GSTIN: <strong>{buyerGstin}</strong></Typography>
                        <Typography sx={{ fontSize: "10px" }}>Phone: {buyerPhone} | Email: {buyerEmail}</Typography>
                    </Box>
                    <Box sx={{ width: "50%", pl: 1 }}>
                        <Typography sx={{ fontSize: "10px" }}><strong>Invoice No:</strong> {invoiceNo}</Typography>
                        <Typography sx={{ fontSize: "10px" }}><strong>Invoice Date:</strong> {formatDate(invoiceDate)}</Typography>
                        <Typography sx={{ fontSize: "10px" }}><strong>SO No:</strong> {salesOrderNo} ({formatDate(salesOrderDate)})</Typography>
                        <Typography sx={{ fontSize: "10px" }}><strong>PO Ref:</strong> {purchaseOrderNo} ({formatDate(purchaseOrderDate)})</Typography>
                        <Typography sx={{ fontSize: "10px" }}><strong>Place of Supply:</strong> {placeOfSupply} (State Code: {stateCode})</Typography>
                        <Typography sx={{ fontSize: "10px" }}><strong>E-Way Bill:</strong> {eWayBillNo} | <strong>Vehicle:</strong> {vehicleNo}</Typography>
                        <Typography sx={{ fontSize: "10px" }}><strong>Despatched Via:</strong> {transportMode}</Typography>
                    </Box>
                </Box>

                {/* ITEM LIST TABLE */}
                <Box sx={{ mb: 1 }}>
                    <table>
                        <thead>
                            <tr style={{ backgroundColor: "#f0f0f0" }}>
                                <th style={{ width: "4%" }}>#</th>
                                <th style={{ width: "36%" }}>Item Description</th>
                                <th style={{ width: "10%" }}>HSN/SAC</th>
                                <th style={{ width: "6%", textAlign: "right" }}>Qty</th>
                                <th style={{ width: "6%", textAlign: "center" }}>UOM</th>
                                <th style={{ width: "10%", textAlign: "right" }}>Rate</th>
                                <th style={{ width: "10%", textAlign: "right" }}>Tax</th>
                                <th style={{ width: "18%", textAlign: "right" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item, idx) => (
                                    <tr key={item.salesInvoiceItemId || idx}>
                                        <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                        <td>{item.description}</td>
                                        <td style={{ textAlign: "center" }}>{item.hsncode}</td>
                                        <td style={{ textAlign: "right" }}>{item.quantity}</td>
                                        <td style={{ textAlign: "center" }}>{item.uom}</td>
                                        <td style={{ textAlign: "right" }}>{formatCurrency(item.unitPrice)}</td>
                                        <td style={{ textAlign: "right" }}>{formatCurrency(item.taxAmount)}</td>
                                        <td style={{ textAlign: "right" }}>{formatCurrency(item.totalAmount)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "10px" }}>
                                        No line items available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Box>

                {/* HSN TAX SUMMARY & TOTALS */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Box sx={{ width: "56%" }}>
                        <Typography sx={{ fontSize: "10px", fontWeight: "bold", mb: 0.5 }}>
                            HSN/SAC Tax Summary:
                        </Typography>
                        <table>
                            <thead>
                                <tr style={{ backgroundColor: "#f9f9f9" }}>
                                    <th>HSN</th>
                                    <th style={{ textAlign: "right" }}>Taxable</th>
                                    <th style={{ textAlign: "right" }}>CGST</th>
                                    <th style={{ textAlign: "right" }}>SGST</th>
                                    <th style={{ textAlign: "right" }}>IGST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hsnRows.length > 0 ? (
                                    hsnRows.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.hsn}</td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(row.taxableValue)}</td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(row.cgstAmount)} ({row.cgstPer}%)</td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(row.sgstAmount)} ({row.sgstPer}%)</td>
                                            <td style={{ textAlign: "right" }}>{formatCurrency(row.igstAmount)} ({row.igstPer}%)</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: "6px" }}>No tax breakdown available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Box>

                    <Box sx={{ width: "40%" }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><strong>Total Qty:</strong></td>
                                    <td style={{ textAlign: "right" }}>{totalQuantity}</td>
                                </tr>
                                <tr>
                                    <td>Sub Total (Taxable):</td>
                                    <td style={{ textAlign: "right" }}>{formatCurrency(subTotal)}</td>
                                </tr>
                                {discountAmount > 0 && (
                                    <tr>
                                        <td>Discount:</td>
                                        <td style={{ textAlign: "right" }}>- {formatCurrency(discountAmount)}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td>Total Tax:</td>
                                    <td style={{ textAlign: "right" }}>{formatCurrency(totalTax)}</td>
                                </tr>
                                <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                                    <td>Grand Total:</td>
                                    <td style={{ textAlign: "right" }}>₹ {formatCurrency(grandTotal)}</td>
                                </tr>
                                <tr>
                                    <td>Paid Amount:</td>
                                    <td style={{ textAlign: "right" }}>₹ {formatCurrency(paidAmount)}</td>
                                </tr>
                                <tr style={{ color: balanceAmount > 0 ? "#d32f2f" : "#2e7d32", fontWeight: "bold" }}>
                                    <td>Balance Due:</td>
                                    <td style={{ textAlign: "right" }}>₹ {formatCurrency(balanceAmount)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>
                </Box>

                {/* FOOTER */}
                <Box sx={{ borderTop: "1px solid #000", pt: 1, mt: 2, display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ width: "60%" }}>
                        <Typography sx={{ fontSize: "9px" }}><strong>Terms of Payment:</strong> {paymentTerms}</Typography>
                        <Typography sx={{ fontSize: "9px", color: "#555", mt: 0.5 }}>
                            This is a computer-generated invoice and requires no physical signature under GST regulations.
                        </Typography>
                    </Box>
                    <Box sx={{ width: "35%", textAlign: "right", pt: 2 }}>
                        <Typography sx={{ fontSize: "10px", fontWeight: "bold" }}>For {sellerName}</Typography>
                        <Box sx={{ height: "30px" }} />
                        <Typography sx={{ fontSize: "9px" }}>(Authorized Signatory)</Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default SalesInvoicePrint;