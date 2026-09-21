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

    console.log("========================================");
    console.log("SALES INVOICE API LOAD STARTED");
    console.log("Invoice ID:", id);
    console.log("========================================");

    let invoice = {};
    let order = {};
    let orderItems = [];
    let customer = {};
    let printData = null;

    // ============================================
    // 1. INVOICE API
    // ============================================

    try {
      const invoiceResponse = await axios.get(
        `${SERVER_URL}/api/sales-invoices/${id}`
      );

      console.log("========== INVOICE API RESPONSE ==========");
      console.log(
        "URL:",
        `${SERVER_URL}/api/sales-invoices/${id}`
      );
      console.log("Status:", invoiceResponse.status);
      console.log("Headers:", invoiceResponse.headers);
      console.log("Response Data:", invoiceResponse.data);
      console.log(
        "Response Data JSON:",
        JSON.stringify(invoiceResponse.data, null, 2)
      );

      invoice =
        invoiceResponse.data?.$values?.[0] ||
        (Array.isArray(invoiceResponse.data)
          ? invoiceResponse.data[0]
          : invoiceResponse.data) ||
        {};
    } catch (error) {
      console.error("Invoice API failed:", error);

      // ============================================
      // FALLBACK INVOICE API
      // ============================================

      try {
        const invoiceFallbackResponse = await axios.get(
          `${SERVER_URL}/api/SalesInvoice/${id}`
        );

        console.log(
          "========== FALLBACK INVOICE API RESPONSE =========="
        );

        console.log(
          "URL:",
          `${SERVER_URL}/api/SalesInvoice/${id}`
        );

        console.log(
          "Status:",
          invoiceFallbackResponse.status
        );

        console.log(
          "Response Data:",
          invoiceFallbackResponse.data
        );

        console.log(
          "Response Data JSON:",
          JSON.stringify(
            invoiceFallbackResponse.data,
            null,
            2
          )
        );

        invoice =
          invoiceFallbackResponse.data?.$values?.[0] ||
          (Array.isArray(invoiceFallbackResponse.data)
            ? invoiceFallbackResponse.data[0]
            : invoiceFallbackResponse.data) ||
          {};
      } catch (fallbackError) {
        console.error(
          "Fallback Invoice API failed:",
          fallbackError
        );
      }
    }

    console.log("========== NORMALIZED INVOICE ==========");
    console.log("Invoice Object:", invoice);

    // ============================================
    // IDS
    // ============================================

    const soId =
      invoice?.salesOrderId ??
      invoice?.SalesOrderId ??
      null;

    const sellerId =
      invoice?.sellerId ??
      invoice?.SellerId ??
      null;

    const customerId =
      invoice?.customerId ??
      invoice?.CustomerId ??
      null;

    console.log("========== EXTRACTED IDS ==========");
    console.log("Sales Order ID:", soId);
    console.log("Seller ID:", sellerId);
    console.log("Customer ID:", customerId);

    // ============================================
    // 2. SALES ORDER API
    // ============================================

    if (soId) {
      try {
        const orderResponse = await axios.get(
          `${SERVER_URL}/api/SalesOrder/${soId}`
        );

        console.log(
          "========== SALES ORDER API RESPONSE =========="
        );

        console.log(
          "URL:",
          `${SERVER_URL}/api/SalesOrder/${soId}`
        );

        console.log("Status:", orderResponse.status);

        console.log(
          "Response Data:",
          orderResponse.data
        );

        console.log(
          "Response Data JSON:",
          JSON.stringify(
            orderResponse.data,
            null,
            2
          )
        );

        order =
          orderResponse.data?.$values?.[0] ||
          (Array.isArray(orderResponse.data)
            ? orderResponse.data[0]
            : orderResponse.data) ||
          {};

        console.log(
          "Normalized Sales Order:",
          order
        );
      } catch (error) {
        console.error(
          "Sales Order API failed:",
          error.response?.data ||
            error.message ||
            error
        );
      }
    } else {
      console.warn(
        "Sales Order API skipped because SalesOrderId is missing."
      );
    }

    // ============================================
    // 3. SALES ORDER ITEMS API
    //
    // CONFIRMED BACKEND ENDPOINT:
    // GET /api/sales-order-items/all
    //
    // We retrieve all items and filter them using
    // the current SalesOrderId.
    // ============================================

    if (soId) {
      try {
        const allItemsResponse = await axios.get(
          `${SERVER_URL}/api/sales-order-items/all`
        );

        console.log(
          "========== SALES ORDER ITEMS API RESPONSE =========="
        );

        console.log(
          "URL:",
          `${SERVER_URL}/api/sales-order-items/all`
        );

        console.log(
          "Status:",
          allItemsResponse.status
        );

        console.log(
          "Response Data:",
          allItemsResponse.data
        );

        console.log(
          "Response Data JSON:",
          JSON.stringify(
            allItemsResponse.data,
            null,
            2
          )
        );

        // Normalize API response
        const allSalesOrderItems =
          Array.isArray(allItemsResponse.data)
            ? allItemsResponse.data
            : allItemsResponse.data?.$values ||
              allItemsResponse.data?.data ||
              allItemsResponse.data?.items ||
              [];

        console.log(
          "All Sales Order Items:",
          allSalesOrderItems
        );

        console.log(
          "Total Sales Order Items:",
          allSalesOrderItems.length
        );

        // Filter only the items belonging to
        // the current Sales Order
        orderItems = allSalesOrderItems.filter(
          (salesOrderItem) => {
            const itemSalesOrderId =
              salesOrderItem?.salesOrderId ??
              salesOrderItem?.SalesOrderId ??
              null;

            return (
              Number(itemSalesOrderId) ===
              Number(soId)
            );
          }
        );

        console.log(
          `========== FILTERED ITEMS FOR SALES ORDER ${soId} ==========`
        );

        console.log(
          "Filtered Sales Order Items:",
          orderItems
        );

        console.log(
          "Number of Items:",
          orderItems.length
        );

        // Detailed item logging
        orderItems.forEach(
          (salesOrderItem, index) => {
            console.log(
              `ITEM ${index + 1}:`,
              {
                salesOrderItemId:
                  salesOrderItem.salesOrderItemId,

                salesOrderId:
                  salesOrderItem.salesOrderId,

                productId:
                  salesOrderItem.productId,

                description:
                  salesOrderItem.description,

                quantity:
                  salesOrderItem.quantity,

                uom:
                  salesOrderItem.uom,

                unitPrice:
                  salesOrderItem.unitPrice,

                discount:
                  salesOrderItem.discount,

                hsncode:
                  salesOrderItem.hsncode,

                gstPer:
                  salesOrderItem.gstPer,

                sgstAmount:
                  salesOrderItem.sgstAmount,

                cgstAmount:
                  salesOrderItem.cgstAmount,

                igstAmount:
                  salesOrderItem.igstAmount,

                taxAmount:
                  salesOrderItem.taxAmount,

                totalAmount:
                  salesOrderItem.totalAmount,
              }
            );
          }
        );
      } catch (error) {
        console.error(
          "Sales Order Items API failed:",
          error.response?.data ||
            error.message ||
            error
        );

        orderItems = [];
      }
    } else {
      console.warn(
        "Sales Order Items API skipped because SalesOrderId is missing."
      );
    }

    // ============================================
    // 4. SELLER CUSTOMER API
    // ============================================

    if (sellerId && customerId) {
      try {
        const customerResponse =
          await axios.get(
            `${SERVER_URL}/api/SellerCustomer/${sellerId}/customers/${customerId}`
          );

        console.log(
          "========== SELLER CUSTOMER API RESPONSE =========="
        );

        console.log(
          "URL:",
          `${SERVER_URL}/api/SellerCustomer/${sellerId}/customers/${customerId}`
        );

        console.log(
          "Status:",
          customerResponse.status
        );

        console.log(
          "Response Data:",
          customerResponse.data
        );

        console.log(
          "Response Data JSON:",
          JSON.stringify(
            customerResponse.data,
            null,
            2
          )
        );

        customer =
          customerResponse.data?.$values?.[0] ||
          customerResponse.data?.data ||
          customerResponse.data ||
          {};

        if (Array.isArray(customer)) {
          customer = customer[0] || {};
        }

        console.log(
          "Normalized Seller Customer:",
          customer
        );
      } catch (error) {
        console.error(
          "Seller Customer API failed:",
          error.response?.data ||
            error.message ||
            error
        );

        customer = {};
      }
    } else {
      console.warn(
        "Seller Customer API skipped.",
        {
          sellerId,
          customerId,
        }
      );
    }

    // ============================================
    // 5. E-INVOICE PRINT VIEW API
    // ============================================

    try {
      const printResponse = await axios.get(
        `${SERVER_URL}/api/e-invoice/print-view/${id}`
      );

      console.log(
        "========== E-INVOICE PRINT VIEW RESPONSE =========="
      );

      console.log(
        "URL:",
        `${SERVER_URL}/api/e-invoice/print-view/${id}`
      );

      console.log(
        "Status:",
        printResponse.status
      );

      console.log(
        "Response Data:",
        printResponse.data
      );

      console.log(
        "Response Data JSON:",
        JSON.stringify(
          printResponse.data,
          null,
          2
        )
      );

      printData =
        printResponse.data?.$values?.[0] ||
        printResponse.data?.data ||
        printResponse.data ||
        null;

      console.log(
        "Normalized E-Invoice Print Data:",
        printData
      );
    } catch (error) {
      console.warn(
        "E-Invoice Print View API failed:",
        error.response?.data ||
          error.message ||
          error
      );

      printData = null;
    }

    // ============================================
    // 6. FINAL COMBINED DATA
    // ============================================

    console.log("========================================");
    console.log("FINAL SALES INVOICE DATA");
    console.log("========================================");

    console.log("INVOICE:", invoice);
    console.log("SALES ORDER:", order);
    console.log(
      "SALES ORDER ITEMS:",
      orderItems
    );
    console.log(
      "SELLER CUSTOMER:",
      customer
    );
    console.log(
      "E-INVOICE PRINT DATA:",
      printData
    );

    console.log("========================================");
    console.log("ALL API DATA AS JSON");
    console.log("========================================");

    console.log(
      JSON.stringify(
        {
          invoice,
          salesOrder: order,
          salesOrderItems: orderItems,
          sellerCustomer: customer,
          eInvoicePrintData: printData,
        },
        null,
        2
      )
    );

    // ============================================
    // 7. SET STATE
    // ============================================

    setInv(invoice);
    setSo(order);
    setItems(orderItems);
    setCust(customer);
    setIrnData(printData);

  } catch (error) {
    console.error(
      "SALES INVOICE LOAD ERROR:",
      error.response?.data ||
        error.message ||
        error
    );

    setInv({});
    setSo({});
    setItems([]);
    setCust({});
    setIrnData(null);
  } finally {
    setLoading(false);

    console.log("========================================");
    console.log("SALES INVOICE API LOAD FINISHED");
    console.log("========================================");
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

  const txType = normalizeTx(rawTx);

  const isShipTo =
    txType === "BILL_TO_SHIP_TO" ||
    txType === "BILL_TO_BILL_TO_SHIP_TO_SHIP_TO";

  const isDispatch =
    txType === "BILL_FROM_DISPATCH_FROM" ||
    txType === "BILL_TO_BILL_TO_SHIP_TO_SHIP_TO";

  // SELLER
const sellerName =
  customer?.companyName ||
  customer?.company_Name ||
  order?.company_Name ||
  invoice?.companyName ||
  "N/A";

const sellerDetails =
  customer?.dealerName ||
  customer?.dealerDetails ||
  customer?.companyDetails ||
  customer?.businessName ||
  order?.company_Name ||
  invoice?.companyName ||
  "N/A";

 const sellerGSTIN =
  customer?.gstin ||
  customer?.GSTIN ||
  order?.gstin ||
  invoice?.userGSTIN ||
  "N/A";

 const sellerGstin = sellerGSTIN;

const sellerAddress =
  customer?.companyAddress ||
  customer?.company_Address ||
  order?.company_Address ||
  invoice?.companyAddress ||
  "N/A";

const sellerAddr = sellerAddress;

  const sellerCity =
  customer?.companyCity ||
  customer?.company_City ||
  order?.company_City ||
  invoice?.companyCity ||
  "N/A";

const sellerState =
  customer?.companyState ||
  customer?.company_State ||
  order?.company_State ||
  invoice?.companyState ||
  "N/A";

const sellerPIN =
  customer?.companyPINCode ||
  customer?.company_PINCode ||
  order?.company_PINCode ||
  invoice?.companyPINCode ||
  "N/A";

  const sellerStateCode =
  customer?.stateCode ||
  customer?.StateCode ||
  so?.stateCode ||
  inv?.stateCode ||
  "N/A";

const signedQRCode =
  so?.signedQRCode ||
  inv?.signedQRCode ||
  irnData?.signedQRCode ||
  "";

const eWayBillNumber =
  so?.eWayBillNumber ||
  inv?.eWayBillNumber ||
  irnData?.eWayBillNumber ||
  "N/A";

const sellerEmail = customer?.email || customer?.emailAddress || customer?.companyEmail || order?.company_Email || order?.companyEmail || invoice?.companyEmail || invoice?.email || "N/A"; const sellerPhone = customer?.phone || customer?.phoneNumber || customer?.mobile || customer?.mobileNumber || customer?.companyPhone || order?.company_Phone || order?.companyPhone || invoice?.companyPhone || invoice?.phone || "N/A"; const sellerWebsite = customer?.website || customer?.companyWebsite || order?.company_Website || order?.companyWebsite || invoice?.companyWebsite || invoice?.website || "N/A"; 
// =============================== // SELLER TAX / BANK DETAILS // 
// =============================== 
const sellerPAN = customer?.pan || customer?.PAN || customer?.panNumber || order?.pan || invoice?.pan || "N/A"; 
const sellerBankName = customer?.bankName || order?.bankName || invoice?.bankName || "N/A"; 
const sellerBankAccount = customer?.bankAccountNumber || customer?.accountNumber || order?.bankAccountNumber || invoice?.bankAccountNumber || "N/A"; 
const sellerBankIFSC = customer?.ifsc || customer?.IFSC || customer?.ifscCode || order?.ifsc || invoice?.ifsc || "N/A"; 
const sellerBankBranch = customer?.bankBranch || order?.bankBranch || invoice?.bankBranch || "N/A";
  
  // DISPATCH
  const dispatchName =
    inv?.dispatchFromCompanyName ||
    so?.dispatchFromCompanyName ||
    "TechNova Medchal Warehouse";

  const dispatchGstin =
    inv?.dispatchFromGSTIN ||
    so?.dispatchFromGSTIN ||
    "36AARFB4347G039";

  const dispatchAddr =
    inv?.dispatchFromAddress ||
    so?.dispatchFromAddress ||
    "Medchal Industrial Area";

  // BUYER / BILL TO
  const billToName =
    cust?.customerName ||
    cust?.companyName ||
    cust?.legalName ||
    cust?.tradeName ||
    inv?.companyName ||
    "TechNova Retail Customer";

  const billToGstin =
    inv?.customerGSTIN ||
    cust?.gstin ||
    "";

  const billToAddr = formatAddress(cust);
  const billToState = cust?.state || "";
  const billToCode = billToGstin?.substring(0, 2) || "";

  // SHIP TO
  const shipToAddressSource =
    inv?.shipTo ||
    so?.shipTo ||
    inv?.buyerClients ||
    cust ||
    {};

  const shipToName =
    inv?.shipToCompanyName ||
    so?.shipToCompanyName ||
    cust?.customerName ||
    billToName;

  const shipToGstin =
    inv?.shipToGSTIN ||
    so?.shipToGSTIN ||
    cust?.gstin ||
    billToGstin;

  const shipToAddr =
    formatAddress(shipToAddressSource) ||
    inv?.shipToAddress ||
    so?.shipToAddress ||
    billToAddr;

  const shipToState =
    cust?.state ||
    shipToAddressSource?.state ||
    billToState;

  const shipToCode =
    shipToGstin?.substring(0, 2) ||
    billToCode;

  // CONSIGNEE / BUYER LOGIC
  let consigneeName,
    consigneeGstin,
    consigneeAddr,
    consigneeState,
    consigneeCode;

  let buyerName,
    buyerGstin,
    buyerAddr,
    buyerState,
    buyerCode;

  if (txType === "REG") {
    consigneeName = billToName;
    consigneeGstin = billToGstin;
    consigneeAddr = billToAddr;
    consigneeState = billToState;
    consigneeCode = billToCode;

    buyerName = billToName;
    buyerGstin = billToGstin;
    buyerAddr = billToAddr;
    buyerState = billToState;
    buyerCode = billToCode;
  } else if (txType === "BILL_TO_SHIP_TO") {
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
  } else if (txType === "BILL_FROM_DISPATCH_FROM") {
    consigneeName = billToName;
    consigneeGstin = billToGstin;
    consigneeAddr = billToAddr;
    consigneeState = billToState;
    consigneeCode = billToCode;

    buyerName = billToName;
    buyerGstin = billToGstin;
    buyerAddr = billToAddr;
    buyerState = billToState;
    buyerCode = billToCode;
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
      // rate = amount / qty, not unitPrice
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

const totalQty = parsedItems.reduce((s, i) => s + i.qty, 0);
const taxableValue = parsedItems.reduce((s, i) => s + i.amount, 0); // 18900

const isInter = (sellerGstin?.substring(0, 2) || "") !== (consigneeGstin?.substring(0, 2) || "");

const igstRate = 18;
const igstAmt = (taxableValue * igstRate) / 100; // 3402
const cgstAmt = isInter ? 0 : igstAmt / 2;
const sgstAmt = isInter ? 0 : igstAmt / 2;

// FINAL - Use only these
const taxAmount = igstAmt; // don't take from invoice?.taxAmount, it was 3400
const grandTotal = taxableValue + taxAmount; // 22302
const invoiceGrandTotal = grandTotal;

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
        <div key={`${copyLabel}-${copyIndex}`} className="invoice-page" style={{ width: "206mm", minWidth: "206mm", maxWidth: "206mm", minHeight: "291mm", height: "291mm", boxSizing: "border-box", border: "2.5px solid #000", background: "#fff", color: "#000", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "9px", margin: "0 auto 5mm auto", padding: 0, display: "flex", flexDirection: "column", overflow: "hidden", pageBreakAfter: copyIndex === COPY_TYPES.length - 1? "avoid" : "always" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #000", padding: "4px 6px", fontSize: "8px", minHeight: "22px" }}>
            <span><b>Tax Invoice</b></span><span><b>GSTIN/UIN: {sellerGstin || "N/A"}</b></span><span><b>{copyLabel || "N/A"}</b></span>
          </div>

          <div style={{ width: "100%", borderBottom: "1px solid #000", padding: "5px 6px" }}>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-start", minHeight: "78px" }}>
              <div style={{ flex: "1 1 50%", width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontSize: "8px", fontWeight: "bold", marginBottom: "2px" }}>E-WAY BILL</div>
                {ewbNo && ewbNo!== "N/A"? (
                  <svg ref={(el) => { ewbBarcodeRefs.current[copyIndex] = el; }} style={{ width: "190px", height: "45px", display: "block" }} />
                ) : (
                  <div style={{ width: "190px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "bold", border: "1px solid #000" }}>N/A</div>
                )}
                <div style={{ fontSize: "7px", marginTop: "1px" }}>E-Way Bill No: <b>{ewbNo || "N/A"}</b></div>
              </div>
              <div style={{ flex: "1 1 50%", width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ fontSize: "8px", fontWeight: "bold", marginBottom: "2px", marginRight: "8px" }}>IRN QR CODE</div>
                {signedQRCode || irnNumber? (
                  <QRCodeSVG value={signedQRCode || irnNumber} size={58} level="M" includeMargin={false} style={{ display: "block", marginRight: "8px" }} />
                ) : (
                  <div style={{ width: "58px", height: "58px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", border: "1px solid #000", marginRight: "8px" }}>N/A</div>
                )}
              </div>
            </div>
            <div style={{ width: "100%", textAlign: "center", marginTop: "4px", paddingTop: "4px", borderTop: "1px solid #000", fontSize: "8px", lineHeight: "12px", wordBreak: "break-word" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", lineHeight: "17px", marginBottom: "2px" }}>{sellerName || "N/A"}</div>
              <div>{sellerDetails || "N/A"}{sellerAddr? `, ${sellerAddr}` : ""}{sellerCity? `, ${sellerCity}` : ""}{sellerState? `, ${sellerState}` : ""}{sellerPIN? ` - ${sellerPIN}` : ""}</div>
              <div><b>GSTIN/UIN: {sellerGstin || "N/A"}</b>{sellerEmail? `, Email: ${sellerEmail}` : ""}{sellerPhone? `, Ph: ${sellerPhone}` : ""}{sellerWebsite? `, Website: ${sellerWebsite}` : ""}</div>
            </div>
          </div>

          <div style={{ width: "100%", borderBottom: "1px solid #000", padding: "4px 6px", fontSize: "8px", lineHeight: "12px" }}>
            <div><b>E-Way Bill Number:</b> {ewbNo || "N/A"}</div><div><b>IRN Number:</b> {irnNumber || "N/A"}</div><div><b>Acknowledgement No:</b> {ackNo || "N/A"}</div><div><b>Acknowledgement Date:</b> {ackDate || "N/A"}</div>
          </div>

          <div style={{ display: "flex", width: "100%", borderBottom: "1px solid #000" }}>
            <div style={{ flex: "1 1 50%", width: "50%", borderRight: "1px solid #000", padding: "4px", fontSize: "8px", wordBreak: "break-word" }}>
              Transaction: {txType? txType.replace(/_/g, " ") : "N/A"}
              <div>Consignee:<br /><b style={{ fontSize: "9px" }}>{consigneeName || "N/A"}</b><br />{consigneeAddr || "N/A"}<br />GSTIN / UIN: <b>{consigneeGstin || "N/A"}</b><br />State Name: {consigneeState || "N/A"}, Code: {consigneeCode || "N/A"}</div>
              <div style={{ borderTop: "1px solid #000", marginTop: "6px", paddingTop: "4px" }}>Buyer (If other than consignee)<br /><b style={{ fontSize: "9px" }}>{buyerName || "N/A"}</b><br />{buyerAddr || "N/A"}<br />Contact Person: {cust?.contactPerson || "N/A"}<br />Phone: {cleanPhone(cust?.phone) || "N/A"}<br />Email: {cust?.email || "N/A"}<br />GSTIN / UIN: <b>{buyerGstin || "N/A"}</b><br />State Name: {buyerState || "N/A"}, Code: {buyerCode || "N/A"}</div>
            </div>
            <div style={{ flex: "1 1 50%", width: "50%", fontSize: "8px", overflow: "hidden" }}>
              <div style={{ display: "flex", width: "100%", borderBottom: "1px solid #000" }}>
                <div style={{ flex: "1 1 50%", width: "50%", borderRight: "1px solid #000", padding: "3px" }}>Invoice No.<br /><b>{invoiceNo || "N/A"}</b></div>
                <div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Dated:<br /><b>{invoiceDate || "N/A"}</b></div>
              </div>
              <div style={{ display: "flex", width: "100%", borderBottom: "1px solid #000" }}>
                <div style={{ flex: "1 1 50%", width: "50%", borderRight: "1px solid #000", padding: "3px" }}>D. C. No.<br /><b>{invoice?.despatchedDocumentNumber || "N/A"}</b></div>
                <div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Delivery Note Date:<br />{invoice?.deliveryNoteDate? formatDate(invoice.deliveryNoteDate) : "N/A"}</div>
              </div>
              <div style={{ display: "flex", width: "100%", borderBottom: "1px solid #000" }}>
                <div style={{ flex: "1 1 50%", width: "50%", borderRight: "1px solid #000", padding: "3px" }}>Purchase Order No.<br /><b>{invoice?.purchaseOrderNo || "N/A"}</b></div>
                <div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Purchase Order Date<br />{invoice?.purchaseOrderDate? formatDate(invoice.purchaseOrderDate) : "N/A"}</div>
              </div>
              <div style={{ display: "flex", width: "100%", borderBottom: "1px solid #000" }}>
                <div style={{ flex: "1 1 50%", width: "50%", borderRight: "1px solid #000", padding: "3px" }}>Bill Of Landing /<br />LR-RR No.<br /><b>{invoice?.billOfLandingOrLRRRNo || "N/A"}</b></div>
                <div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Despatched Through<br /><b>{invoice?.despatchedThrough || invoice?.transport || "N/A"}</b></div>
              </div>
              <div style={{ display: "flex", width: "100%", borderBottom: "1px solid #000" }}>
                <div style={{ flex: "1 1 50%", width: "50%", borderRight: "1px solid #000", padding: "3px" }}>Despatched Through<br /><b>{invoice?.despatchedThrough || invoice?.transport || "N/A"}</b></div>
                <div style={{ flex: "1 1 50%", width: "50%", padding: "3px" }}>Other Reference(s)<br /><b>{invoice?.otherReferences || "N/A"}</b></div>
              </div>
              <div style={{ width: "100%", borderBottom: "1px solid #000", padding: "3px" }}>Motor Vehicle No.<br /><b>{vehicleNo || "N/A"}</b></div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: "8px", margin: 0 }}>
            <thead><tr style={{ borderBottom: "1px solid #000", background: "#fff" }}>
              <th style={{ width: "5%", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px" }}>Sl. No</th>
              <th style={{ width: "40%", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px" }}>Description of Goods</th>
              <th style={{ width: "10%", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px" }}>HSN/SAC</th>
              <th style={{ width: "10%", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px" }}>Quantity</th>
              <th style={{ width: "12%", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px" }}>Rate</th>
              <th style={{ width: "5%", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px" }}>Per</th>
              <th style={{ width: "18%", textAlign: "right", borderBottom: "1px solid #000", padding: "3px" }}>Amount</th>
            </tr></thead>
            <tbody>
              {parsedItems.map((it) => (
                <tr key={it.sl} style={{ borderBottom: "1px solid #000" }}>
                  <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{it.sl}</td>
                  <td style={{ borderRight: "1px solid #000", padding: "3px", wordBreak: "break-word" }}>{it.desc || "N/A"}</td>
                  <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{it.hsn || "N/A"}</td>
                  <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{it.qty || 0} {it.uom || ""}</td>
                  <td style={{ borderRight: "1px solid #000", textAlign: "right", padding: "3px" }}>{Number(it.rate || 0).toFixed(2)}</td>
                  <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{it.uom || "N/A"}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold", padding: "3px" }}>{Number(it.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
                <td colSpan={6} style={{ textAlign: "right", borderRight: "1px solid #000", padding: "3px" }}>Total</td>
                <td style={{ textAlign: "right", fontWeight: "bold", padding: "3px" }}>{taxableValue.toFixed(2)}</td>
              </tr>
              {isInter? (
                <tr style={{ borderBottom: "1px solid #000" }}>
                  <td colSpan={4} style={{ borderRight: "1px solid #000" }} />
                  <td style={{ borderRight: "1px solid #000", textAlign: "right", fontWeight: "bold", padding: "3px" }}>IGST</td>
                  <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{igstRate}%</td>
                  <td style={{ textAlign: "right", fontWeight: "bold", padding: "3px" }}>{igstAmt.toFixed(2)}</td>
                </tr>
              ) : (
                <>
                  <tr style={{ borderBottom: "1px solid #000" }}>
                    <td colSpan={4} style={{ borderRight: "1px solid #000" }} />
                    <td style={{ borderRight: "1px solid #000", textAlign: "right", padding: "3px" }}>CGST</td>
                    <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{igstRate / 2}%</td>
                    <td style={{ textAlign: "right", padding: "3px" }}>{cgstAmt.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #000" }}>
                    <td colSpan={4} style={{ borderRight: "1px solid #000" }} />
                    <td style={{ borderRight: "1px solid #000", textAlign: "right", padding: "3px" }}>SGST</td>
                    <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{igstRate / 2}%</td>
                    <td style={{ textAlign: "right", padding: "3px" }}>{sgstAmt.toFixed(2)}</td>
                  </tr>
                </>
              )}
              <tr style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000", fontWeight: "bold" }}>
                <td colSpan={3} style={{ textAlign: "right", borderRight: "1px solid #000", padding: "3px" }}>Grand Total</td>
                <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>{totalQty} nos</td>
                <td style={{ borderRight: "1px solid #000" }} /><td style={{ borderRight: "1px solid #000" }} />
                <td style={{ textAlign: "right", padding: "3px" }}>₹{grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ width: "100%", borderTop: "1px solid #000", borderBottom: "1px solid #000", padding: "3px", fontSize: "8px" }}>Amount Chargeable (in Words): <b>{numToWords(grandTotal)}</b><span style={{ float: "right" }}>E. & O. E</span></div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: "8px", borderBottom: "1px solid #000" }}>
            <thead><tr style={{ background: "#fff", borderBottom: "1px solid #000" }}>
              <th style={{ width: "40%", borderRight: "1px solid #000", padding: "3px" }}>HSN/SAC</th>
              <th style={{ width: "15%", borderRight: "1px solid #000", padding: "3px" }}>Taxable Value</th>
              <th style={{ width: "25%", borderRight: "1px solid #000", padding: "3px" }}>{isInter? `IGST ${igstRate}%` : `CGST + SGST ${igstRate}%`}</th>
              <th style={{ width: "20%", padding: "3px" }}>Total Tax</th>
            </tr></thead>
            <tbody>
  <tr>
    <td style={{ borderRight: "1px solid #000", textAlign: "center", padding: "3px" }}>
      {parsedItems[0]?.hsn || "N/A"}
    </td>
    <td style={{ borderRight: "1px solid #000", textAlign: "right", padding: "3px" }}>
      {taxableValue.toFixed(2)}
    </td>
    <td style={{ borderRight: "1px solid #000", textAlign: "right", padding: "3px" }}>
      {isInter? igstAmt.toFixed(2) : (cgstAmt + sgstAmt).toFixed(2)}
    </td>
    <td style={{ textAlign: "right", padding: "3px" }}>
      {isInter? igstAmt.toFixed(2) : (cgstAmt + sgstAmt).toFixed(2)}
    </td>
  </tr>
</tbody>
          </table>

          <div style={{ display: "flex", width: "100%", flex: "1 1 auto", minHeight: "90px", borderTop: "1px solid #000" }}>
            <div style={{ flex: "1 1 50%", width: "50%", borderRight: "1px solid #000", padding: "6px", fontSize: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between", wordBreak: "break-word" }}>
              <div>
                <div>Company&apos;s PAN: <b>{sellerPAN || "N/A"}</b></div>
                <div style={{ marginTop: "5px" }}><b>Declaration</b><br />OTHER TERMS & CONDITIONS:<br />Subjected to Hyderabad Jurisdiction.</div>
                <div style={{ marginTop: "8px" }}>
                  Transaction Type: <b>{txType? txType.replace(/_/g, " ") : "N/A"}</b><br />
                  {isShipTo? <span>ShipTo GSTIN: {shipToGstin || "N/A"}</span> : null}
                  {isShipTo && isDispatch? <span> | </span> : null}
                  {isDispatch? <span>Dispatch GSTIN: {dispatchGstin || "N/A"}</span> : null}
                </div>
              </div>
            </div>
            <div style={{ flex: "1 1 50%", width: "50%", padding: "6px", fontSize: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between", wordBreak: "break-word" }}>
              <div><div>Bank: {sellerBankName || "N/A"}</div><div>A/c: {sellerBankAccount || "N/A"}</div><div>IFSC: {sellerBankIFSC || "N/A"}</div><div>Branch: {sellerBankBranch || "N/A"}</div></div>
              <div style={{ textAlign: "right", marginTop: "20px" }}><div>For <b>{sellerName || "N/A"}</b></div><div style={{ height: "40px" }} /><div>Authorised Signatory</div></div>
            </div>
          </div>
        </div>
      ))}
    </Box>
  </Box>
);
}

export default SalesInvoicePrint;


