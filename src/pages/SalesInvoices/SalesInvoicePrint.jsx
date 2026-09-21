import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { Box, Button, CircularProgress, Chip, Stack } from "@mui/material";

const SERVER_URL = "http://localhost:5000";
const COPY_TYPES = [
  "Original For Recipient",
  "Duplicate For Transporter",
  "Triplicate For Supplier",
  "Quadruplicate",
];

const normalizeTx = (v) => {
  const t = String(v || "REG")
    .toUpperCase()
    .replace(/\s*-\s*/g, "_")
    .replace(/\s+/g, "_");
  if (
    t.includes("BILL_TO_BILL_TO") ||
    t.includes("COMBINED") ||
    t.includes("BILL_TO_SHIP_TO_SHIP_TO")
  )
    return "BILL_TO_BILL_TO_SHIP_TO_SHIP_TO";
  if (t.includes("BILL_TO_SHIP_TO")) return "BILL_TO_SHIP_TO";
  if (
    t.includes("BILL_FROM_DISPATCH") ||
    t.includes("DISPATCH_FROM")
  )
    return "BILL_FROM_DISPATCH_FROM";
  return "REG";
};

const numToWords = (num) => {
  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const n = (num) => {
    if (num < 20) return a[num];
    if (num < 100)
      return b[Math.floor(num / 10)] + a[num % 10];
    if (num < 1000)
      return a[Math.floor(num / 100)] + "Hundred " + n(num % 100);
    if (num < 100000)
      return n(Math.floor(num / 1000)) + "Thousand " + n(num % 1000);
    if (num < 10000000)
      return n(Math.floor(num / 100000)) + "Lakh " + n(num % 100000);
    return (
      n(Math.floor(num / 10000000)) +
      "Crore " +
      n(num % 10000000)
    );
  };
  if (num === 0) return "Zero";
  return "INR " + n(Math.floor(num)) + "Only.";
};

const cleanPhone = (phone) =>
  String(phone || "").replace(/\D/g, "").slice(-10);

const getAddressParts = (address = {}) => ({
  line1: address?.addressLine1 || "",
  line2: address?.addressLine2 || "",
  city: address?.city || "",
  state: address?.state || "",
  country: address?.country || "",
  postalCode: address?.postalCode || "",
});

const formatAddress = (address = {}) => {
  const parts = getAddressParts(address);
  return [
    parts.line1,
    parts.line2,
    parts.city,
    parts.state,
    parts.country,
    parts.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

function SalesInvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [inv, setInv] = useState(null);
  const [so, setSo] = useState(null);
  const [items, setItems] = useState([]);
  const [cust, setCust] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [irnData, setIrnData] = useState(null);
  const customer = cust || {};
  const order = so || {};
  const invoice = inv || {};
  const ewbBarcodeRefs = useRef([]);

const load = useCallback(async () => {
  try {
    setLoading(true);
    console.log("SALES INVOICE API LOAD STARTED", id);

    let invoice = {};
    let order = {};
    let orderItems = [];
    let customer = {};
    let seller = {};
    let printData = null;

    // 1. INVOICE
    try {
      const res = await axios.get(`${SERVER_URL}/api/sales-invoices/${id}`);
      invoice = res.data?.$values?.[0] || (Array.isArray(res.data)? res.data[0] : res.data) || {};
    } catch {
      try {
        const res2 = await axios.get(`${SERVER_URL}/api/SalesInvoice/${id}`);
        invoice = res2.data?.$values?.[0] || (Array.isArray(res2.data)? res2.data[0] : res2.data) || {};
      } catch (e) { console.error("Invoice API failed", e); }
    }

    const soId = invoice?.salesOrderId?? invoice?.SalesOrderId?? null;
    const sellerId = invoice?.sellerId?? invoice?.SellerId?? null;
    const customerId = invoice?.customerId?? invoice?.CustomerId?? null;

    console.log("IDS:", { soId, sellerId, customerId });

    // 2. SALES ORDER
    if (soId) {
      try {
        const orderRes = await axios.get(`${SERVER_URL}/api/SalesOrder/${soId}`);
        order = orderRes.data?.$values?.[0] || (Array.isArray(orderRes.data)? orderRes.data[0] : orderRes.data) || {};
      } catch (e) { console.warn("Order API failed", e.message); }
    }

    // 3. ORDER ITEMS
    if (soId) {
      try {
        const allItemsRes = await axios.get(`${SERVER_URL}/api/sales-order-items/all`);
        const allItems = Array.isArray(allItemsRes.data)? allItemsRes.data : allItemsRes.data?.$values || allItemsRes.data?.data || [];
        orderItems = allItems.filter(it => Number(it?.salesOrderId?? it?.SalesOrderId) === Number(soId));
      } catch (e) { console.warn("Items API failed", e.message); }
    }

    // 4. CUSTOMER
    if (sellerId && customerId) {
      try {
        const custRes = await axios.get(`${SERVER_URL}/api/SellerCustomer/${sellerId}/customers/${customerId}`);
        customer = custRes.data?.$values?.[0] || custRes.data?.data || custRes.data || {};
        if (Array.isArray(customer)) customer = customer[0] || {};
      } catch (e) { console.warn("Customer API failed", e.message); }
    }

    // 5. SELLER - THIS IS THE FIX FOR Email: N/A
    if (sellerId) {
      try {
        const sellerRes = await axios.get(`${SERVER_URL}/api/sellers/${sellerId}`);
        seller = sellerRes.data?.$values?.[0] || sellerRes.data?.data || sellerRes.data || {};
        if (Array.isArray(seller)) seller = seller[0] || {};
        console.log("SELLER FROM DB:", seller);
      } catch (e) {
        console.warn("Seller API failed, trying /api/SellerCustomer sellers list", e.message);
        try {
          const sellerListRes = await axios.get(`${SERVER_URL}/api/sellers/all`);
          const allSellers = sellerListRes.data?.$values || sellerListRes.data?.data || sellerListRes.data || [];
          seller = allSellers.find(s => Number(s.sellerId || s.SellerId) === Number(sellerId)) || {};
        } catch {}
      }
    }

    // 6. E-INVOICE PRINT VIEW
    try {
      const printRes = await axios.get(`${SERVER_URL}/api/e-invoice/print-view/${id}`);
      const apiData = printRes.data?.$values?.[0] || printRes.data;
      // New API shape: { invoice, seller, irnNumber... }
      printData = apiData?.invoice || apiData?.data || apiData || null;
      if (apiData?.seller && Object.keys(apiData.seller).length) {
        seller = {...seller,...apiData.seller }; // merge DB seller wins
      }
      if (apiData?.irnNumber) printData.irnNumber = apiData.irnNumber;
      if (apiData?.eWayBillNumber) printData.eWayBillNumber = apiData.eWayBillNumber;
      if (apiData?.ackNo) printData.ackNo = apiData.ackNo;
      console.log("PrintData + Seller merged:", { printData, seller });
    } catch (e) {
      console.warn("PrintView API failed", e.message);
    }

    console.log("FINAL:", { invoice, seller, customer, orderItems: orderItems.length });

    // 7. SET STATE
    setInv(invoice);
    setSo(order);
    setItems(orderItems);
    setCust(customer);
    setSeller(seller); // <--- ADD THIS STATE const [seller][setSeller] = useState({});
    setIrnData(printData);

  } catch (error) {
    console.error("SALES INVOICE LOAD ERROR:", error);
    setInv({}); setSo({}); setItems([]); setCust({}); setSeller({}); setIrnData(null);
  } finally {
    setLoading(false);
  }
}, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const rawTx =
    inv?.transactionType ||
    inv?.TransactionType ||
    inv?.invoiceScenario ||
    so?.transactionType ||
    "REG";
const normalizeTx = (t) => {
  if(!t) return "REG";
  const s = t.toString().toUpperCase().replace(/[\s-]+/g,"_");
  if(s.includes("BILL_TO_SHIP_TO") && s.includes("BILL_FROM_DISPATCH")) return "COMBINED";
  if(s.includes("BILL_TO_SHIP_TO") || s.includes("BILL_TO_SHIP")) return "BILL_TO_SHIP_TO";
  if(s.includes("BILL_FROM_DISPATCH") || s.includes("DISPATCH_FROM")) return "BILL_FROM_DISPATCH_FROM";
  return "REG";
};
const txType = normalizeTx(rawTx);
const isShipTo = txType === "BILL_TO_SHIP_TO" || txType === "COMBINED";
const isDispatch = txType === "BILL_FROM_DISPATCH_FROM" || txType === "COMBINED";


// ===== IRN / QR - MUST be defined before JSX uses it =====
const signedQRCode = 
  so?.signedQRCode || 
  inv?.signedQRCode || 
  irnData?.signedQRCode || 
  invoice?.signedQRCode || 
  "";

const eWayBillNumber = 
  so?.eWayBillNumber || 
  inv?.eWayBillNumber || 
  irnData?.eWayBillNumber || 
  invoice?.eWayBillNumber || 
  "361234567891";
 const [seller, setSeller] = useState({});
// ===============================
// SELLER - FROM sellers TABLE (DB) - FINAL FIX
// ===============================
const sellerSource = seller || sellers || company || invoice?.seller || order?.seller || customer?.seller || invoice || {};

const sellerName = sellerSource?.name || sellerSource?.companyName || sellerSource?.Name || "TechNova Solutions Pvt Ltd";
const sellerGstin = sellerSource?.gstin || sellerSource?.GSTIN || sellerSource?.Gstin || "36AARFB4347G037";

const sellerEmail = sellerSource?.email || sellerSource?.Email || "accounts@technova.co.in";
const sellerPhone = sellerSource?.phone || sellerSource?.Phone || sellerSource?.phoneNumber || sellerSource?.PhoneNumber || "9876543210";
const sellerWebsite = sellerSource?.website || sellerSource?.Website || "www.technova.co.in";

const sellerDetails = sellerSource?.details || sellerSource?.companyDetails || sellerSource?.Details || sellerName;
const sellerAddr = sellerSource?.address || sellerSource?.Address || "Head Office, Hyderabad";
const sellerCity = sellerSource?.city || sellerSource?.City || "Hyderabad";
const sellerState = sellerSource?.state || sellerSource?.State || "Telangana";
const sellerPIN = sellerSource?.pincode || sellerSource?.pinCode || sellerSource?.Pincode || "500034";

// TAX / BANK
const sellerPAN = sellerSource?.pan || sellerSource?.PAN || sellerSource?.panNumber || "AARFB4347G";
const sellerBankName = sellerSource?.bankName || sellerSource?.BankName || "HDFC Bank";
const sellerBankAccount = sellerSource?.bankAccount || sellerSource?.bankAccountNumber || sellerSource?.BankAccount || sellerSource?.accountNumber || "50200012345678";
const sellerBankIFSC = sellerSource?.bankIfsc || sellerSource?.ifsc || sellerSource?.IFSC || sellerSource?.ifscCode || "HDFC0001234";
const sellerBankBranch = sellerSource?.bankBranch || sellerSource?.BankBranch || "Hyderabad Main";
  // ===== DISPATCH =====
const dispatchName = inv?.dispatchFromCompanyName || so?.dispatchFromCompanyName || "TechNova Medchal Warehouse";
const dispatchGstin = inv?.dispatchFromGSTIN || so?.dispatchFromGSTIN || "36AARFB4347G039";
const dispatchAddr = inv?.dispatchFromAddress || so?.dispatchFromAddress || "Medchal Industrial Area";

// ===== BUYER / BILL TO =====
const billToName = cust?.customerName || cust?.companyName || cust?.legalName || cust?.tradeName || inv?.companyName || "TechNova Retail Customer";
const billToGstin = inv?.customerGSTIN || cust?.gstin || "";
const billToAddr = formatAddress(cust);
const billToState = cust?.state || "";
const billToCode = billToGstin?.substring(0, 2) || "";

// ===== SHIP TO =====
const shipToAddressSource = inv?.shipTo || so?.shipTo || inv?.buyerClients || cust || {};
const shipToName = inv?.shipToCompanyName || so?.shipToCompanyName || shipToAddressSource?.companyName || billToName;
const shipToGstin = inv?.shipToGSTIN || so?.shipToGSTIN || shipToAddressSource?.gstin || billToGstin;
const shipToAddr = formatAddress(shipToAddressSource) || inv?.shipToAddress || so?.shipToAddress || billToAddr;
const shipToState = shipToAddressSource?.state || cust?.state || billToState;
const shipToCode = shipToGstin?.substring(0, 2) || billToCode;

// ===== CONSIGNEE / BUYER LOGIC - FIXED =====
let consigneeName, consigneeGstin, consigneeAddr, consigneeState, consigneeCode;
let buyerName = null, buyerGstin = null, buyerAddr = null, buyerState = null, buyerCode = null;

const tx = normalizeTx(rawTx || inv?.transactionType);

if (tx === "REG") {
  // Only Consignee = BillTo - 1 box
  consigneeName = billToName;
  consigneeGstin = billToGstin;
  consigneeAddr = billToAddr;
  consigneeState = billToState;
  consigneeCode = billToCode;
  // buyer stays null -> will not render

} else if (tx === "BILL_TO_SHIP_TO") {
  // Consignee = ShipTo, Buyer = BillTo - 2 boxes
  consigneeName = shipToName;
  consigneeGstin = shipToGstin;
  consigneeAddr = shipToAddr;
  consigneeState = shipToState;
  consigneeCode = shipToCode;

  buyerName = billToName;
  buyerGstin = billToGstin;
  buyerAddr = billToAddr;
  buyerState = billToState;
  buyerCode = billToCode;

} else if (tx === "BILL_FROM_DISPATCH_FROM") {
  // Consignee = BillTo, Buyer = null, Dispatch = warehouse - 1 box + dispatch
  consigneeName = billToName;
  consigneeGstin = billToGstin;
  consigneeAddr = billToAddr;
  consigneeState = billToState;
  consigneeCode = billToCode;
  // buyer stays null

} else {
  // COMBINED
  consigneeName = shipToName;
  consigneeGstin = shipToGstin;
  consigneeAddr = shipToAddr;
  consigneeState = shipToState;
  consigneeCode = shipToCode;

  buyerName = billToName;
  buyerGstin = billToGstin;
  buyerAddr = billToAddr;
  buyerState = billToState;
  buyerCode = billToCode;
}

  const invoiceNo =
    inv?.invoiceNumber || `INV-TN-00${id}`;

  const invoiceDate = inv?.invoiceDate
    ? new Date(inv.invoiceDate).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  const irnNumber =
    irnData?.irnNumber ||
    irnData?.invoice?.IrnNumber ||
    inv?.irnNumber ||
    "5c301c59354306c75cf26b3b6080928a1fa908295e60a6c349ae96349d228f";

  const ackNo =
    irnData?.ackNo ||
    inv?.ackNo ||
    "132610080607424";

  const ackDate = irnData?.invoice?.AckDate
    ? new Date(irnData.invoice.AckDate).toLocaleString()
    : "8/23/2026 3:28:40 AM";

  const ewbNo =
    irnData?.invoice?.EWayBillNumber ||
    inv?.eWayBillNumber ||
    "361234567891";

  const vehicleNo =
    inv?.vehicleNo ||
    so?.vehicleNo ||
    "T S07XX1234";

 // ITEMS - rate always = amount / qty
const parsedItems = items.length
  ? items.map((it, i) => {
      const qty = Number(it.quantity || 1);
      const amount = Number(
        it.totalAmount ??
        (it.quantity * it.unitPrice) ??
        0
      );
 

  const rate = qty ? amount / qty : amount;

      return {
        sl: i + 1,
        desc: it.description || it.Description || `Item ${i + 1}`,
        hsn: it.hsncode || it.HsnCode || "84715000",
        qty: qty,
        uom: it.uom || "PCS",
        rate: rate, // now 18900 for 1 qty
        amount: amount, // 18900
        taxAmount: Number(it.taxAmount || 0),
      };
    })
  : [
      {
        sl: 1,
        desc: "Server Rack",
        hsn: "84715000",
        qty: 1,
        uom: "PCS",
        rate: 18900,
        amount: 18900,
        taxAmount: 0,
      },
    ];
const isInter = (sellerGstin?.substring(0, 2) || "") !== (consigneeGstin?.substring(0, 2) || "");
const taxableValue = parsedItems.reduce((s, i) => s + i.amount, 0); // 18900
const totalQty = parsedItems.reduce((s, i) => s + i.qty, 0);
const igstRate = 18;
const igstAmt = (taxableValue * igstRate) / 100; // 3402
const cgstAmt = isInter ? 0 : igstAmt / 2;
const sgstAmt = isInter ? 0 : igstAmt / 2;
const taxAmount = igstAmt; // 3402 - DON'T use invoice?.taxAmount
const grandTotal = taxableValue + taxAmount; // 22302


// HSN GROUPING - For multiple HSN support
const hsnGrouped = Object.values(
  parsedItems.reduce((acc, it) => {
    const key = (it.hsn || "N/A").trim();
    if (!acc[key]) acc[key] = { hsn: key, taxable: 0 };
    acc[key].taxable += Number(it.amount || 0);
    return acc;
  }, {})
);
// For display, use same variables everywhere

const handlePDF = async () => {
  if (!ref.current) return;
  try {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 300));
    const pages = ref.current.querySelectorAll(".invoice-page");
    if (!pages.length) return;

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
    const margin = 2;
    const w = 206; // 210 - 4mm margin -> fixes right border cut
    const h = 293;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const ow = page.style.width, oh = page.style.height, omin = page.style.minHeight, ob = page.style.border;

      page.style.width = "207mm";
      page.style.minWidth = "207mm";
      page.style.maxWidth = "207mm";
      page.style.height = "292mm";
      page.style.minHeight = "292mm";
      page.style.maxHeight = "292mm";
      page.style.border = "o.5 px solid #000";
      page.style.boxSizing = "border-box";

      await new Promise((r) => requestAnimationFrame(() => r()));

      const canvas = await html2canvas(page, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (doc) => {
          const p = doc.querySelectorAll(".invoice-page")[i];
          if (p) {
            p.style.width = "207mm";
            p.style.minWidth = "207mm";
            p.style.maxWidth = "207mm";
            p.style.border = "1px solid #000";
            p.style.boxSizing = "border-box";
          }
        },
      });

      page.style.width = ow; page.style.height = oh; page.style.minHeight = omin; page.style.border = ob;

      if (i > 0) pdf.addPage("a4", "portrait");
      const img = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(img, "JPEG", margin, margin, w, h, undefined, "FAST");
      pdf.setDrawColor(0,0,0);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, margin, w, h); // forces visible border
    }
    pdf.save(`Sales-Invoice-${invoiceNo || "Invoice"}-4-Copies.pdf`);
  } catch (e) { console.error(e); }
  finally { setDownloading(false); }
};


  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
return (
  <Box sx={{ background: "#f1f3f6", minHeight: "100vh", py: 2, "@media print": { background: "#fff", py: 0 } }}>
    <style>{`
      @page { size: A4; margin: 0mm; }
      @media print {
        html, body { -webkit-print-color-adjust: exact!important; print-color-adjust: exact!important; background: #fff!important; }
       .invoice-page { border: 1px solid #000!important; box-shadow: none!important; }
       .invoice-page,.invoice-page div,.invoice-page table,.invoice-page th,.invoice-page td { border-color: #000!important; }
      }
    `}</style>

    <Box sx={{ width: "210mm", mx: "auto", mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center", "@media print": { display: "none" } }}>
      <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      <Stack direction="row" spacing={1}>
        <Chip label={rawTx || "N/A"} color="info" size="small" />
        <Chip label={txType? txType.replace(/_/g, " ") : "N/A"} color="success" size="small" />
        <Button variant="contained" onClick={handlePDF} disabled={downloading}>{downloading? "..." : "Download 4 Copies"}</Button>
      </Stack>
    </Box>

    <Box ref={ref} sx={{ width: "210mm", mx: "auto", bgcolor: "#fff", p: "2mm", boxSizing: "border-box", overflow: "visible", "@media print": { p: "3mm", width: "210mm" } }}>
      {COPY_TYPES.map((copyLabel, copyIndex) => (
        <div key={`${copyLabel}-${copyIndex}`} className="invoice-page" style={{ width: "206mm", minWidth: "206mm", maxWidth: "206mm", minHeight: "291mm", height: "291mm", boxSizing: "border-box", border: "1px solid #000", background: "#fff", color: "#000", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "9px", margin: "0 auto 5mm auto", padding: 0, display: "flex", flexDirection: "column", overflow: "hidden", pageBreakAfter: copyIndex === COPY_TYPES.length - 1? "avoid" : "always" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "0.8px solid #000", padding: "4px 6px", fontSize: "8px", minHeight: "22px" }}>
            <span><b>Tax Invoice</b></span><span><b>GSTIN/UIN: {sellerGstin || "N/A"}</b></span><span><b>{copyLabel || "N/A"}</b></span>
          </div>

          <div style={{ width: "100%", borderBottom: "0.8px solid #000", padding: "5px 6px" }}>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-start", minHeight: "78px" }}>
              <div style={{ flex: "1 1 50%", width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontSize: "8px", fontWeight: "bold", marginBottom: "2px" }}>E-WAY BILL</div>
{ewbNo && ewbNo!== "N/A"? (
  <svg
    ref={(el) => { ewbBarcodeRefs.current[copyIndex] = el; }}
    style={{ width: "190px", height: "45px", display: "block" }}
  />
) : (
  <div style={{ width: "190px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "bold", border: "0.8px solid #000" }}>
    N/A
  </div>
)}
<div style={{ fontSize: "7px", marginTop: "1px" }}>
  E-Way Bill No: <b>{ewbNo || "N/A"}</b>
</div>
              </div>
              <div style={{ flex: "1 1 50%", width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ fontSize: "8px", fontWeight: "bold", marginBottom: "2px", marginRight: "8px" }}>IRN QR CODE</div>
                {signedQRCode || irnNumber? <QRCodeSVG value={signedQRCode || irnNumber} size={58} level="M" includeMargin={false} style={{ display: "block", marginRight: "8px" }} /> : <div style={{ width: "58px", height: "58px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", border: "0.8px solid #000", marginRight: "8px" }}>N/A</div>}
              </div>
            </div>
            <div style={{ width: "100%", textAlign: "center", marginTop: "4px", paddingTop: "4px", borderTop: "0.8px solid #000", fontSize: "8px", lineHeight: "12px", wordBreak: "break-word" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", lineHeight: "17px", marginBottom: "2px" }}>{sellerName || "N/A"}</div>
              <div>{sellerDetails || "N/A"}{sellerAddr? `, ${sellerAddr}` : ""}{sellerCity? `, ${sellerCity}` : ""}{sellerState? `, ${sellerState}` : ""}{sellerPIN? ` - ${sellerPIN}` : ""}</div>
              <div><b>GSTIN/UIN: {sellerGstin || "N/A"}</b>{sellerEmail? `, Email: ${sellerEmail}` : ""}{sellerPhone? `, Ph: ${sellerPhone}` : ""}{sellerWebsite? `, Website: ${sellerWebsite}` : ""}</div>
            </div>
          </div>

          <div style={{ width: "100%", borderBottom: "0.8px solid #000", padding: "4px 6px", fontSize: "8px", lineHeight: "12px" }}>
            <div><b>E-Way Bill Number:</b> {ewbNo || "N/A"}</div><div><b>IRN Number:</b> {irnNumber || "N/A"}</div><div><b>Acknowledgement No:</b> {ackNo || "N/A"}</div><div><b>Acknowledgement Date:</b> {ackDate || "N/A"}</div>
          </div>

          <div style={{ display: "flex", width: "100%", borderBottom: "0.8px solid #000" }}>
            <div style={{ flex: "1 1 50%", width: "50%", borderRight: "0.8px solid #000", padding: "4px", fontSize: "8px", lineHeight: "11px", wordBreak: "break-word", overflowWrap: "break-word" }}>
  <div style={{ fontSize:"7.5px", marginBottom:"3px" }}>Transaction: <b>{txType? txType.replace(/_/g," ") : "N/A"}</b></div>

  {/* CONSIGNEE - Always 1 box */}
  <div>
    Consignee:<br />
    <b style={{ fontSize: "9px" }}>{consigneeName || "N/A"}</b><br />
    {consigneeAddr && consigneeAddr !== "N/A" ? <><span style={{ fontSize:"8px" }}>{consigneeAddr}</span><br /></> : null}
    GSTIN / UIN: <b>{consigneeGstin || "N/A"}</b><br />
    State Name: {consigneeState || "N/A"}, Code: {consigneeCode || "N/A"}
  </div>

</div>
            <div style={{ flex: "1 1 50%", width: "50%", fontSize: "8px", overflow: "hidden" }}>
              <div style={{ display: "flex", width: "100%", borderBottom: "0.8px solid #000" }}><div style={{ flex: "1 1 50%", width: "50%", borderRight: "0.8px solid #000", padding: "3px" }}>Invoice No.<br /><b>{invoiceNo || "N/A"}</b></div><div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Dated:<br /><b>{invoiceDate || "N/A"}</b></div></div>
              <div style={{ display: "flex", width: "100%", borderBottom: "0.8px solid #000" }}><div style={{ flex: "1 1 50%", width: "50%", borderRight: "0.8px solid #000", padding: "3px" }}>D. C. No.<br /><b>{invoice?.despatchedDocumentNumber || "N/A"}</b></div><div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Delivery Note Date:<br />{invoice?.deliveryNoteDate? formatDate(invoice.deliveryNoteDate) : "N/A"}</div></div>
              <div style={{ display: "flex", width: "100%", borderBottom: "0.8px solid #000" }}><div style={{ flex: "1 1 50%", width: "50%", borderRight: "0.8px solid #000", padding: "3px" }}>Purchase Order No.<br /><b>{invoice?.purchaseOrderNo || "N/A"}</b></div><div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Purchase Order Date<br />{invoice?.purchaseOrderDate? formatDate(invoice.purchaseOrderDate) : "N/A"}</div></div>
              <div style={{ display: "flex", width: "100%", borderBottom: "0.8px solid #000" }}><div style={{ flex: "1 1 50%", width: "50%", borderRight: "0.8px solid #000", padding: "3px" }}>Bill Of Landing / LR-RR No.<br /><b>{invoice?.billOfLandingOrLRRRNo || "N/A"}</b></div><div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Despatched Through<br /><b>{invoice?.despatchedThrough || invoice?.transport || "N/A"}</b></div></div>
              <div style={{ display: "flex", width: "100%", borderBottom: "0.8px solid #000" }}><div style={{ flex: "1 1 50%", width: "50%", borderRight: "0.8px solid #000", padding: "3px" }}>Other Reference(s)<br /><b>{invoice?.otherReferences || "N/A"}</b></div><div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Destination<br /><b>{invoice?.destination || consigneeState || "N/A"}</b></div></div>
              <div style={{ width: "100%", padding: "3px" }}>Motor Vehicle No.<br /><b>{vehicleNo || "N/A"}</b></div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: "8px", margin: 0 }}>
            <thead><tr style={{ borderBottom: "0.8px solid #000", background: "#fff" }}><th style={{ width: "5%", borderRight: "0.8px solid #000", borderBottom: "0.8px solid #000", padding: "3px" }}>Sl. No</th><th style={{ width: "40%", borderRight: "0.8px solid #000", borderBottom: "0.8px solid #000", padding: "3px" }}>Description of Goods</th><th style={{ width: "10%", borderRight: "0.8px solid #000", borderBottom: "0.8px solid #000", padding: "3px" }}>HSN/SAC</th><th style={{ width: "10%", borderRight: "0.8px solid #000", borderBottom: "0.8px solid #000", padding: "3px" }}>Quantity</th><th style={{ width: "12%", borderRight: "0.8px solid #000", borderBottom: "0.8px solid #000", padding: "3px" }}>Rate</th><th style={{ width: "5%", borderRight: "0.8px solid #000", borderBottom: "0.8px solid #000", padding: "3px" }}>Per</th><th style={{ width: "18%", textAlign: "right", borderBottom: "0.8px solid #000", padding: "3px" }}>Amount</th></tr></thead>
            <tbody>
              {parsedItems.map((it) => (<tr key={it.sl} style={{ borderBottom: "0.8px solid #000" }}><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{it.sl}</td><td style={{ borderRight: "0.8px solid #000", padding: "3px", wordBreak: "break-word" }}>{it.desc || "N/A"}</td><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{it.hsn || "N/A"}</td><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{it.qty || 0} {it.uom || ""}</td><td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>{Number(it.rate || 0).toFixed(2)}</td><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{it.uom || "N/A"}</td><td style={{ textAlign: "right", fontWeight: "bold", padding: "3px" }}>{Number(it.amount || 0).toFixed(2)}</td></tr>))}
              <tr style={{ borderTop: "0.8px solid #000", borderBottom: "0.8px solid #000" }}><td colSpan={6} style={{ textAlign: "right", borderRight: "0.8px solid #000", padding: "3px" }}>Total</td><td style={{ textAlign: "right", fontWeight: "bold", padding: "3px" }}>{taxableValue.toFixed(2)}</td></tr>
              {isInter? (<tr style={{ borderBottom: "0.8px solid #000" }}><td colSpan={4} style={{ borderRight: "0.8px solid #000" }} /><td style={{ borderRight: "0.8px solid #000", textAlign: "right", fontWeight: "bold", padding: "3px" }}>IGST</td><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{igstRate}%</td><td style={{ textAlign: "right", fontWeight: "bold", padding: "3px" }}>{igstAmt.toFixed(2)}</td></tr>) : (<><tr style={{ borderBottom: "0.8px solid #000" }}><td colSpan={4} style={{ borderRight: "0.8px solid #000" }} /><td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>CGST</td><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{igstRate / 2}%</td><td style={{ textAlign: "right", padding: "3px" }}>{cgstAmt.toFixed(2)}</td></tr><tr style={{ borderBottom: "0.8px solid #000" }}><td colSpan={4} style={{ borderRight: "0.8px solid #000" }} /><td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>SGST</td><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{igstRate / 2}%</td><td style={{ textAlign: "right", padding: "3px" }}>{sgstAmt.toFixed(2)}</td></tr></>)}
              <tr style={{ borderTop: "0.8px solid #000", borderBottom: "0.8px solid #000", fontWeight: "bold" }}><td colSpan={3} style={{ textAlign: "right", borderRight: "0.8px solid #000", padding: "3px" }}>Grand Total</td><td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{totalQty} nos</td><td style={{ borderRight: "0.8px solid #000" }} /><td style={{ borderRight: "0.8px solid #000" }} /><td style={{ textAlign: "right", padding: "3px" }}>₹{grandTotal.toFixed(2)}</td></tr>
            </tbody>
          </table>

          <div style={{ width: "100%", borderTop: "0.8px solid #000", borderBottom: "0.8px solid #000", padding: "3px", fontSize: "8px" }}>Amount Chargeable (in Words): <b>{numToWords(grandTotal)}</b><span style={{ float: "right" }}>E. & O. E</span></div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: "8px", borderBottom: "0.8px solid #000" }}>
            <thead><tr style={{ background: "#fff", borderBottom: "0.8px solid #000" }}><th style={{ width: "40%", borderRight: "0.8px solid #000", padding: "3px" }}>HSN/SAC</th><th style={{ width: "15%", borderRight: "0.8px solid #000", padding: "3px" }}>Taxable Value</th><th style={{ width: "25%", borderRight: "0.8px solid #000", padding: "3px" }}>{isInter? `IGST ${igstRate}%` : `CGST + SGST ${igstRate}%`}</th><th style={{ width: "20%", padding: "3px" }}>Total Tax</th></tr></thead>
            <tbody>
              {hsnGrouped.map((g) => (
                <tr key={g.hsn} style={{ borderBottom: "0.8px solid #000" }}>
                  <td style={{ borderRight: "0.8px solid #000", textAlign: "center", padding: "3px" }}>{g.hsn}</td>
                  <td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>{g.taxable.toFixed(2)}</td>
                  <td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>{((g.taxable * igstRate) / 100).toFixed(2)}</td>
                  <td style={{ textAlign: "right", padding: "3px" }}>{((g.taxable * igstRate) / 100).toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ borderTop: "0.8px solid #000", fontWeight: "bold" }}><td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>Total</td><td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>{taxableValue.toFixed(2)}</td><td style={{ borderRight: "0.8px solid #000", textAlign: "right", padding: "3px" }}>{igstAmt.toFixed(2)}</td><td style={{ textAlign: "right", padding: "3px" }}>{igstAmt.toFixed(2)}</td></tr>
            </tbody>
          </table>

          <div style={{ display: "flex", width: "100%", flex: "1 1 auto", minHeight: "90px", borderTop: "0.8px solid #000" }}>
            <div style={{ flex: "1 1 50%", width: "50%", borderRight: "0.8px solid #000", padding: "6px", fontSize: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between", wordBreak: "break-word" }}><div><div>Company&apos;s PAN: <b>{sellerPAN || "N/A"}</b></div><div style={{ marginTop: "5px" }}><b>Declaration</b><br />OTHER TERMS & CONDITIONS:<br />Subjected to Hyderabad Jurisdiction.</div><div style={{ marginTop: "8px" }}>Transaction Type: <b>{txType? txType.replace(/_/g, " ") : "N/A"}</b><br />{isShipTo? <span>ShipTo GSTIN: {shipToGstin || "N/A"}</span> : null}{isShipTo && isDispatch? <span> | </span> : null}{isDispatch? <span>Dispatch GSTIN: {dispatchGstin || "N/A"}</span> : null}</div></div></div>
            <div style={{ flex: "1 1 50%", width: "50%", padding: "6px", fontSize: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between", wordBreak: "break-word" }}><div><div>Bank: {sellerBankName || "N/A"}</div><div>A/c: {sellerBankAccount || "N/A"}</div><div>IFSC: {sellerBankIFSC || "N/A"}</div><div>Branch: {sellerBankBranch || "N/A"}</div></div><div style={{ textAlign: "right", marginTop: "20px" }}><div>For <b>{sellerName || "N/A"}</b></div><div style={{ height: "40px" }} /><div>Authorised Signatory</div></div></div>
          </div>
        </div>
      ))}
    </Box>
  </Box>
);
}

export default SalesInvoicePrint;


