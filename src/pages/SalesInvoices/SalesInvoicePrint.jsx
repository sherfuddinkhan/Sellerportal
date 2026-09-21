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

  // ITEMS
  const parsedItems = items.length
    ? items.map((it, i) => ({
        sl: i + 1,
        desc:
          it.description ||
          it.Description ||
          `Item ${i + 1}`,
        hsn: it.hsncode || it.HsnCode || "34343",
        qty: Number(it.quantity || 1),
        uom: it.uom || "nos",
        rate: Number(
          it.unitPrice ||
            it.quantityAmount ||
            1000
        ),
        amount: Number(
          it.totalAmount ||
            it.quantity * it.unitPrice ||
            10000
        ),
      }))
    : [
        {
          sl: 1,
          desc: "item",
          hsn: "34343",
          qty: 10,
          uom: "nos",
          rate: 1000,
          amount: 10000,
        },
        {
          sl: 2,
          desc: "13 mm DRILL CHUCK WITH KEY",
          hsn: "",
          qty: 1,
          uom: "NOS",
          rate: 500,
          amount: 500,
        },
      ];

  const totalQty = parsedItems.reduce(
    (s, i) => s + i.qty,
    0
  );
  const taxableValue = parsedItems.reduce(
    (s, i) => s + i.amount,
    0
  );

  const isInter =
    sellerGstin.substring(0, 2) !==
    consigneeGstin.substring(0, 2);

  const igstRate = 18;
  const igstAmt = (taxableValue * igstRate) / 100;
  const cgstAmt = isInter ? 0 : igstAmt / 2;
  const sgstAmt = isInter ? 0 : igstAmt / 2;
  const grandTotal = taxableValue + igstAmt;

// ===============================
// FINAL INVOICE AMOUNTS
// ===============================

const taxAmount = Number(
  invoice?.taxAmount ??
  order?.taxAmount ??
  parsedItems.reduce(
    (sum, item) => sum + Number(item?.taxAmount || 0),
    0
  ) ??
  0
);

const subtotalAmount = Number(
  invoice?.subTotal ??
  order?.subTotal ??
  parsedItems.reduce(
    (sum, item) =>
      sum +
      Number(item?.quantity || 0) * Number(item?.unitPrice || 0),
    0
  )
);

const discountAmount = Number(
  invoice?.discountAmount ??
  order?.discountAmount ??
  0
);

const paidAmount = Number(
  invoice?.paidAmount ??
  invoice?.paidAmount ??
  0
);

const balanceAmount = Number(
  invoice?.balanceAmount ??
  invoice?.balance ??
  Math.max(
    0,
    Number(invoice?.totalAmount || 0) - paidAmount
  )
);

const invoiceGrandTotal = Number(
  invoice?.totalAmount ??
  order?.totalAmount ??
  subtotalAmount + taxAmount - discountAmount
);


  const handlePDF = async () => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const pages = Array.from(
        ref.current.querySelectorAll(".invoice-page")
      );
      const pdf = new (await import("jspdf")).default({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      for (let idx = 0; idx < pages.length; idx++) {
        const orig = pages[idx];
        const cont = document.createElement("div");
        cont.style.cssText =
          "position:fixed;left:0;top:0;width:210mm;height:297mm;background:#fff;z-index:9999;";
        const page = orig.cloneNode(true);
        page.style.cssText =
          "width:210mm;min-height:297mm;padding:0;background:#fff;";
        cont.appendChild(page);
        document.body.appendChild(cont);
        await new Promise((r) => setTimeout(r, 200));
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#fff",
        });
        cont.remove();
        if (idx > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.98),
          "JPEG",
          0,
          0,
          210,
          297
        );
      }
      pdf.save(`${invoiceNo}-${txType}.pdf`);
    } finally {
      setDownloading(false);
    }
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
<Box
sx={{
background: "#f1f3f6",
minHeight: "100vh",
py: 2,
}}
>
{/* ================= TOP TOOLBAR ================= */}
<Box
  sx={{
    width: "210mm",
    mx: "auto",
    mb: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Button
    variant="outlined"
    onClick={() => navigate(-1)}
  >
    Back
  </Button>

  <Stack direction="row" spacing={1}>
    <Chip
      label={rawTx || "N/A"}
      color="info"
      size="small"
    />

    <Chip
      label={
        txType
          ? txType.replace(/_/g, " ")
          : "N/A"
      }
      color="success"
      size="small"
    />

    <Button
      variant="contained"
      onClick={handlePDF}
      disabled={downloading}
    >
      {downloading
        ? "..."
        : "Download 4 Copies"}
    </Button>
  </Stack>
</Box>

{/* ================= A4 PRINT AREA ================= */}
<Box
  ref={ref}
  sx={{
    width: "210mm",
    mx: "auto",
    bgcolor: "#fff",
  }}
>
  {COPY_TYPES.map((copyLabel, copyIndex) => (
    <div
      key={`${copyLabel}-${copyIndex}`}
      className="invoice-page"
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        border: "1px solid #000",
        background: "#fff",
        color: "#000",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        fontSize: "9px",
        marginBottom: "12px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #000",
          padding: "4px 6px",
          fontSize: "8px",
          minHeight: "22px",
          boxSizing: "border-box",
        }}
      >
        <span>
          <b>Tax Invoice</b>
        </span>

        <span>
          <b>
            GSTIN/UIN: {sellerGstin || "N/A"}
          </b>
        </span>

        <span>
          <b>{copyLabel || "N/A"}</b>
        </span>
      </div>

      {/* =====================================================
          SELLER HEADER
          
          E-WAY BARCODE = LEFT
          IRN QR         = RIGHT
          
          SELLER DETAILS BELOW
      ====================================================== */}
      <div
        style={{
          borderBottom: "1px solid #000",
          padding: "5px 6px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* ================= BARCODE + QR ROW ================= */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
            minHeight: "78px",
            boxSizing: "border-box",
          }}
        >
          {/* ================= E-WAY BILL BARCODE ================= */}
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              minHeight: "72px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "8px",
                fontWeight: "bold",
                marginBottom: "2px",
              }}
            >
              E-WAY BILL
            </div>

            {ewbNo && ewbNo !== "N/A" ? (
              <svg
                ref={(element) => {
                  ewbBarcodeRefs.current[copyIndex] =
                    element;
                }}
                style={{
                  width: "190px",
                  height: "45px",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "190px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: "bold",
                  border: "1px solid #999",
                  boxSizing: "border-box",
                }}
              >
                N/A
              </div>
            )}

            <div
              style={{
                fontSize: "7px",
                marginTop: "1px",
              }}
            >
              E-Way Bill No:{" "}
              <b>{ewbNo || "N/A"}</b>
            </div>
          </div>

          {/* ================= IRN QR CODE ================= */}
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-start",
              minHeight: "72px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "8px",
                fontWeight: "bold",
                marginBottom: "2px",
                marginRight: "8px",
              }}
            >
              IRN QR CODE
            </div>

            {signedQRCode || irnNumber ? (
              <QRCodeSVG
                value={
                  signedQRCode || irnNumber
                }
                size={58}
                level="M"
                includeMargin={false}
                style={{
                  display: "block",
                  marginRight: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8px",
                  border: "1px solid #999",
                  marginRight: "8px",
                  boxSizing: "border-box",
                }}
              >
                N/A
              </div>
            )}

            <div
              style={{
                fontSize: "7px",
                marginTop: "1px",
                marginRight: "8px",
                maxWidth: "190px",
                wordBreak: "break-all",
                textAlign: "right",
              }}
            >
            </div>
          </div>
        </div>
{/* ================= SELLER DETAILS ================= */}
<div
  style={{
    textAlign: "center",
    marginTop: "4px",
    paddingTop: "4px",
    borderTop: "1px solid #000",
    fontSize: "8px",
    lineHeight: "12px",
    boxSizing: "border-box",
  }}
>
  {/* SELLER NAME */}
  <div
    style={{
      fontSize: "14px",
      fontWeight: "bold",
      lineHeight: "17px",
      marginBottom: "2px",
    }}
  >
    {sellerName || "N/A"}
  </div>

  {/* SELLER DETAILS - SIDE BY SIDE */}
  <div>
    {sellerDetails || "N/A"}
    {sellerAddr ? `, ${sellerAddr}` : ""}
    {sellerCity ? `, ${sellerCity}` : ""}
    {sellerState ? `, ${sellerState}` : ""}
    {sellerPIN ? ` - ${sellerPIN}` : ""}
  </div>

  {/* GSTIN, EMAIL, PHONE, WEBSITE - SIDE BY SIDE */}
  <div>
    <b>
      GSTIN/UIN: {sellerGstin || "N/A"}
    </b>
    {sellerEmail ? `, Email: ${sellerEmail}` : ""}
    {sellerPhone ? `, Ph: ${sellerPhone}` : ""}
    {sellerWebsite ? `, Website: ${sellerWebsite}` : ""}
  </div>
</div>
      </div>
{/* =====================================================
    IRN / EWB INFORMATION
    Single horizontal box - fields one below another
    ===================================================== */}
<div
  style={{
    width: "100%",
    borderBottom: "1px solid #000",
    padding: "4px 6px",
    fontSize: "8px",
    lineHeight: "12px",
    boxSizing: "border-box",
  }}
>
  <div>
    <b>E-Way Bill Number:</b>{" "}
    {ewbNo || "N/A"}
  </div>

  <div>
    <b>IRN Number:</b>{" "}
    {irnNumber || "N/A"}
  </div>

  <div>
    <b>Acknowledgement No:</b>{" "}
    {ackNo || "N/A"}
  </div>

  <div>
    <b>Acknowledgement Date:</b>{" "}
    {ackDate || "N/A"}
  </div>
</div>
      {/* =====================================================
          CONSIGNEE + BUYER + INVOICE DETAILS
      ====================================================== */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #000",
          flex: 0,
        }}
      >
        {/* ================= CONSIGNEE / BUYER ================= */}
        <div
          style={{
            width: "50%",
            borderRight: "1px solid #000",
            padding: "4px",
            fontSize: "8px",
            boxSizing: "border-box",
          }}
        >
            Transaction:{" "}
            {txType
              ? txType.replace(/_/g, " ")
              : "N/A"}
          {/* CONSIGNEE */}
          <div>
            Consignee:
            <br />

            <b
              style={{
                fontSize: "9px",
              }}
            >
              {consigneeName || "N/A"}
            </b>

            <br />

            {consigneeAddr || "N/A"}

            <br />

            GSTIN / UIN:{" "}
            <b>
              {consigneeGstin || "N/A"}
            </b>

            <br />

            State Name:{" "}
            {consigneeState || "N/A"}
            , Code:{" "}
            {consigneeCode || "N/A"}
          </div>

          {/* BUYER */}
          <div
            style={{
              borderTop: "1px solid #000",
              marginTop: "6px",
              paddingTop: "4px",
            }}
          >
            Buyer (If other than
            consignee)
            <br />

            <b
              style={{
                fontSize: "9px",
              }}
            >
              {buyerName || "N/A"}
            </b>

            <br />

            {buyerAddr || "N/A"}

            <br />

            Contact Person:{" "}
            {cust?.contactPerson || "N/A"}

            <br />

            Phone:{" "}
            {cleanPhone(cust?.phone) || "N/A"}

            <br />

            Email:{" "}
            {cust?.email || "N/A"}

            <br />

            GSTIN / UIN:{" "}
            <b>
              {buyerGstin || "N/A"}
            </b>

            <br />

            State Name:{" "}
            {buyerState || "N/A"}
            , Code:{" "}
            {buyerCode || "N/A"}
          </div>
        </div>
{/* ================= INVOICE META ================= */}
<div
  style={{
    width: "50%",
    fontSize: "8px",
    boxSizing: "border-box",
  }}
>
  {/* INVOICE NO / DATE */}
  <div
    style={{
      display: "flex",
      borderBottom: "1px solid #000",
    }}
  >
    <div
      style={{
        width: "50%",
        borderRight: "1px solid #000",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Invoice No.
      <br />
      <b>{invoiceNo || "N/A"}</b>
    </div>

    <div
      style={{
        width: "50%",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Dated:
      <br />
      <b>{invoiceDate || "N/A"}</b>
    </div>
  </div>

  {/* DELIVERY NOTE */}
  <div
    style={{
      display: "flex",
      borderBottom: "1px solid #000",
    }}
  >
    <div
      style={{
        width: "50%",
        borderRight: "1px solid #000",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      D. C. No.
      <br />
      <b>
        {invoice?.despatchedDocumentNumber || "N/A"}
      </b>
    </div>

    <div
      style={{
        width: "50%",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Delivery Note Date:
      <br />
      {invoice?.deliveryNoteDate
        ? formatDate(invoice.deliveryNoteDate)
        : "N/A"}
    </div>
  </div>

  {/* PURCHASE ORDER */}
  <div
    style={{
      display: "flex",
      borderBottom: "1px solid #000",
    }}
  >
    <div
      style={{
        width: "50%",
        borderRight: "1px solid #000",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Purchase Order No.
      <br />
      <b>
        {invoice?.purchaseOrderNo || "N/A"}
      </b>
    </div>

    <div
      style={{
        width: "50%",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Purchase Order Date
      <br />
      {invoice?.purchaseOrderDate
        ? formatDate(invoice.purchaseOrderDate)
        : "N/A"}
    </div>
  </div>

  {/* LR / VEHICLE */}
  <div
    style={{
      display: "flex",
      borderBottom: "1px solid #000",
    }}
  >
    <div
      style={{
        width: "50%",
        borderRight: "1px solid #000",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Bill Of Landing /
      <br />
      LR-RR No.
      <br />
      <b>
        {invoice?.billOfLandingOrLRRRNo || "N/A"}
      </b>
    </div>

    <div
      style={{
        width: "50%",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Despatched Through
      <br />
      <b>
        {invoice?.despatchedThrough ||
          invoice?.transport ||
          "N/A"}
      </b>
    </div>
  </div>

  {/* DISPATCH / OTHER REFERENCE */}
  <div
    style={{
      display: "flex",
      borderBottom: "1px solid #000",
    }}
  >
    <div
      style={{
        width: "50%",
        borderRight: "1px solid #000",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Despatched Through
      <br />
      <b>
        {invoice?.despatchedThrough ||
          invoice?.transport ||
          "N/A"}
      </b>
    </div>

    <div
      style={{
        width: "50%",
        padding: "3px",
        boxSizing: "border-box",
      }}
    >
      Other Reference(s)
      <br />
      <b>
        {invoice?.otherReferences || "N/A"}
      </b>
    </div>
  </div>

  {/* VEHICLE NUMBER - BELOW OTHER REFERENCE */}
  <div
    style={{
      width: "100%",
      borderBottom: "1px solid #000",
      padding: "3px",
      boxSizing: "border-box",
    }}
  >
    Motor Vehicle No.
    <br />
    <b>{vehicleNo || "N/A"}</b>
  </div>
</div>

      </div>

      {/* =====================================================
          ITEMS TABLE
      ====================================================== */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "8px",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #000",
              background: "#fafafa",
            }}
          >
            <th
              style={{
                borderRight: "1px solid #000",
                width: "5%",
                padding: "3px",
              }}
            >
              Sl. No
            </th>

            <th
              style={{
                borderRight: "1px solid #000",
                width: "40%",
                padding: "3px",
              }}
            >
              Description of Goods
            </th>

            <th
              style={{
                borderRight: "1px solid #000",
                width: "10%",
                padding: "3px",
              }}
            >
              HSN/SAC
            </th>

            <th
              style={{
                borderRight: "1px solid #000",
                width: "10%",
                padding: "3px",
              }}
            >
              Quantity
            </th>

            <th
              style={{
                borderRight: "1px solid #000",
                width: "12%",
                padding: "3px",
              }}
            >
              Rate
            </th>

            <th
              style={{
                borderRight: "1px solid #000",
                width: "5%",
                padding: "3px",
              }}
            >
              Per
            </th>

            <th
              style={{
                width: "18%",
                textAlign: "right",
                padding: "3px",
              }}
            >
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          {parsedItems.map((it) => (
            <tr
              key={it.sl}
              style={{
                borderBottom:
                  "0.5px solid #ddd",
              }}
            >
              <td
                style={{
                  borderRight: "1px solid #000",
                  textAlign: "center",
                  padding: "3px",
                }}
              >
                {it.sl}
              </td>

              <td
                style={{
                  borderRight: "1px solid #000",
                  padding: "3px",
                }}
              >
                {it.desc || "N/A"}
              </td>

              <td
                style={{
                  borderRight: "1px solid #000",
                  textAlign: "center",
                  padding: "3px",
                }}
              >
                {it.hsn || "N/A"}
              </td>

              <td
                style={{
                  borderRight: "1px solid #000",
                  textAlign: "center",
                  padding: "3px",
                }}
              >
                {it.qty || 0}{" "}
                {it.uom || ""}
              </td>

              <td
                style={{
                  borderRight: "1px solid #000",
                  textAlign: "right",
                  padding: "3px",
                }}
              >
                {Number(
                  it.rate || 0
                ).toFixed(2)}
              </td>

              <td
                style={{
                  borderRight: "1px solid #000",
                  textAlign: "center",
                  padding: "3px",
                }}
              >
                {it.uom || "N/A"}
              </td>

              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  padding: "3px",
                }}
              >
                {Number(
                  it.amount || 0
                ).toFixed(2)}
              </td>
            </tr>
          ))}

          {/* TOTAL */}
          <tr
            style={{
              borderTop: "1px solid #000",
            }}
          >
            <td
              colSpan={6}
              style={{
                textAlign: "right",
                borderRight: "1px solid #000",
                padding: "3px",
              }}
            >
              Total
            </td>

            <td
              style={{
                textAlign: "right",
                fontWeight: "bold",
                padding: "3px",
              }}
            >
              {taxableValue.toFixed(2)}
            </td>
          </tr>

          {/* IGST */}
          {isInter ? (
            <tr>
              <td
                colSpan={4}
                style={{
                  borderRight: "1px solid #000",
                }}
              />

              <td
                style={{
                  borderRight: "1px solid #000",
                  textAlign: "right",
                  fontWeight: "bold",
                  padding: "3px",
                }}
              >
                IGST
              </td>

              <td
                style={{
                  borderRight: "1px solid #000",
                  textAlign: "center",
                  padding: "3px",
                }}
              >
                {igstRate}%
              </td>

              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  padding: "3px",
                }}
              >
                {igstAmt.toFixed(2)}
              </td>
            </tr>
          ) : (
            <>
              {/* CGST */}
              <tr>
                <td
                  colSpan={4}
                  style={{
                    borderRight:
                      "1px solid #000",
                  }}
                />

                <td
                  style={{
                    borderRight:
                      "1px solid #000",
                    textAlign: "right",
                    padding: "3px",
                  }}
                >
                  CGST
                </td>

                <td
                  style={{
                    borderRight:
                      "1px solid #000",
                    textAlign: "center",
                    padding: "3px",
                  }}
                >
                  {igstRate / 2}%
                </td>

                <td
                  style={{
                    textAlign: "right",
                    padding: "3px",
                  }}
                >
                  {cgstAmt.toFixed(2)}
                </td>
              </tr>

              {/* SGST */}
              <tr>
                <td
                  colSpan={4}
                  style={{
                    borderRight:
                      "1px solid #000",
                  }}
                />

                <td
                  style={{
                    borderRight:
                      "1px solid #000",
                    textAlign: "right",
                    padding: "3px",
                  }}
                >
                  SGST
                </td>

                <td
                  style={{
                    borderRight:
                      "1px solid #000",
                    textAlign: "center",
                    padding: "3px",
                  }}
                >
                  {igstRate / 2}%
                </td>

                <td
                  style={{
                    textAlign: "right",
                    padding: "3px",
                  }}
                >
                  {sgstAmt.toFixed(2)}
                </td>
              </tr>
            </>
          )}

          {/* GRAND TOTAL */}
          <tr
            style={{
              borderTop: "1px solid #000",
              fontWeight: "bold",
            }}
          >
            <td
              colSpan={3}
              style={{
                textAlign: "right",
                borderRight: "1px solid #000",
                padding: "3px",
              }}
            >
              Grand Total
            </td>

            <td
              style={{
                borderRight: "1px solid #000",
                textAlign: "center",
                padding: "3px",
              }}
            >
              {totalQty} nos
            </td>

            <td
              style={{
                borderRight: "1px solid #000",
              }}
            />

            <td
              style={{
                borderRight: "1px solid #000",
              }}
            />

            <td
              style={{
                textAlign: "right",
                padding: "3px",
              }}
            >
              ₹{grandTotal.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* =====================================================
          AMOUNT IN WORDS
      ====================================================== */}
      <div
        style={{
          borderTop: "1px solid #000",
          borderBottom: "1px solid #000",
          padding: "3px",
          fontSize: "8px",
        }}
      >
        Amount Chargeable (in Words):{" "}
        <b>
          {numToWords(grandTotal)}
        </b>

        <span
          style={{
            float: "right",
          }}
        >
          E. & O. E
        </span>
      </div>

      {/* =====================================================
          TAX SUMMARY
      ====================================================== */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "8px",
          borderBottom: "1px solid #000",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#fafafa",
              borderBottom: "1px solid #000",
            }}
          >
            <th
              style={{
                width: "40%",
                borderRight: "1px solid #000",
                padding: "3px",
              }}
            >
              HSN/SAC
            </th>

            <th
              style={{
                width: "15%",
                borderRight: "1px solid #000",
                padding: "3px",
              }}
            >
              Taxable Value
            </th>

            <th
              style={{
                width: "25%",
                borderRight: "1px solid #000",
                padding: "3px",
              }}
            >
              {isInter
                ? `IGST ${igstRate}%`
                : `CGST + SGST ${igstRate}%`}
            </th>

            <th
              style={{
                width: "20%",
                padding: "3px",
              }}
            >
              Total Tax
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td
              style={{
                borderRight: "1px solid #000",
                textAlign: "center",
                padding: "3px",
              }}
            >
              {parsedItems[0]?.hsn || "N/A"}
            </td>

            <td
              style={{
                borderRight: "1px solid #000",
                textAlign: "right",
                padding: "3px",
              }}
            >
              {taxableValue.toFixed(2)}
            </td>

            <td
              style={{
                borderRight: "1px solid #000",
                textAlign: "right",
                padding: "3px",
              }}
            >
              {isInter
                ? igstAmt.toFixed(2)
                : (
                    cgstAmt + sgstAmt
                  ).toFixed(2)}
            </td>

            <td
              style={{
                textAlign: "right",
                padding: "3px",
              }}
            >
              {taxAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* =====================================================
          BOTTOM SECTION
      ====================================================== */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: "90px",
          borderTop: "1px solid #000",
        }}
      >
        {/* ================= LEFT ================= */}
        <div
          style={{
            width: "50%",
            borderRight: "1px solid #000",
            padding: "6px",
            fontSize: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div>
            <div>
              Company's PAN:{" "}
              <b>
                {sellerPAN || "N/A"}
              </b>
            </div>

            <div
              style={{
                marginTop: "5px",
              }}
            >
              <b>Declaration</b>

              <br />

              OTHER TERMS & CONDITIONS:

              <br />

              Subjected to Hyderabad
              Jurisdiction.
            </div>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              Transaction Type:{" "}
              <b>
                {txType
                  ? txType.replace(
                      /_/g,
                      " "
                    )
                  : "N/A"}
              </b>

              <br />

              {isShipTo &&
                `ShipTo GSTIN: ${
                  shipToGstin || "N/A"
                }`}

              {isDispatch &&
                ` | Dispatch GSTIN: ${
                  dispatchGstin || "N/A"
                }`}
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div
          style={{
            width: "50%",
            padding: "6px",
            fontSize: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div>
            <div>
              Bank:{" "}
              {sellerBankName || "N/A"}
            </div>

            <div>
              A/c:{" "}
              {sellerBankAccount || "N/A"}
            </div>

            <div>
              IFSC:{" "}
              {sellerBankIFSC || "N/A"}
            </div>

            <div>
              Branch:{" "}
              {sellerBankBranch || "N/A"}
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
              marginTop: "20px",
            }}
          >
            <div>
              For{" "}
              <b>
                {sellerName || "N/A"}
              </b>
            </div>

            <div
              style={{
                height: "40px",
              }}
            />

            <div>
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</Box>


  </Box>
);



}

export default SalesInvoicePrint;