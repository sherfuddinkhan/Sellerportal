import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { Box, Button, CircularProgress, Chip, Stack } from "@mui/material";

const SERVER_URL = "http://localhost:5000";
const COPY_TYPES = ["Original For Recipient", "Duplicate For Transporter", "Triplicate For Supplier", "Quadruplicate"];

const normalizeTx = (v) => {
  const t = String(v||"REG").toUpperCase().replace(/\s*-\s*/g,"_").replace(/\s+/g,"_");
  if(t.includes("BILL_TO_BILL_TO") || t.includes("COMBINED") || t.includes("BILL_TO_SHIP_TO_SHIP_TO")) return "BILL_TO_BILL_TO_SHIP_TO_SHIP_TO";
  if(t.includes("BILL_TO_SHIP_TO")) return "BILL_TO_SHIP_TO";
  if(t.includes("BILL_FROM_DISPATCH") || t.includes("DISPATCH_FROM")) return "BILL_FROM_DISPATCH_FROM";
  return "REG";
};

const numToWords = (num) => {
  const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const n = (num) => {
    if(num<20) return a[num];
    if(num<100) return b[Math.floor(num/10)] + a[num%10];
    if(num<1000) return a[Math.floor(num/100)] + 'Hundred ' + n(num%100);
    if(num<100000) return n(Math.floor(num/1000)) + 'Thousand ' + n(num%1000);
    if(num<10000000) return n(Math.floor(num/100000)) + 'Lakh ' + n(num%100000);
    return n(Math.floor(num/10000000)) + 'Crore ' + n(num%10000000);
  };
  if(num===0) return 'Zero';
  return 'INR ' + n(Math.floor(num)) + 'Only.';
};

function SalesInvoicePrint(){
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

  const load = useCallback(async()=>{
    try{
      setLoading(true);
      const invRes = await axios.get(`${SERVER_URL}/api/sales-invoices/${id}`);
      const invoice = invRes.data?.$values?.[0] || (Array.isArray(invRes.data)?invRes.data[0]:invRes.data);
      const soId = invoice?.salesOrderId || invoice?.SalesOrderId;
      let order=null, orderItems=[], customer=null;
      if(soId){ try{ const r=await axios.get(`${SERVER_URL}/api/SalesOrder/${soId}`); order=r.data?.$values?.[0]||r.data; }catch{} }
      if(soId){ try{ const r=await axios.get(`${SERVER_URL}/api/sales-order-items/${soId}`); const d=r.data; orderItems=Array.isArray(d)?d:d?.$values||[]; }catch{} }
      if(invoice?.sellerId && invoice?.customerId){ try{ const r=await axios.get(`${SERVER_URL}/api/SellerCustomer/${invoice.sellerId}/customers/${invoice.customerId}`); customer=r.data; }catch{} }
      try{ const pr=await axios.get(`${SERVER_URL}/api/e-invoice/print-view/${id}`); setIrnData(pr.data); }catch{}
      setInv(invoice); setSo(order||{}); setItems(orderItems); setCust(customer||{});
    }finally{ setLoading(false); }
  },[id]);

  useEffect(()=>{ load(); },[load]);

  const rawTx = inv?.transactionType || inv?.TransactionType || inv?.invoiceScenario || so?.transactionType || "REG";
  const txType = normalizeTx(rawTx);
  const isShipTo = txType==="BILL_TO_SHIP_TO" || txType==="BILL_TO_BILL_TO_SHIP_TO_SHIP_TO";
  const isDispatch = txType==="BILL_FROM_DISPATCH_FROM" || txType==="BILL_TO_BILL_TO_SHIP_TO_SHIP_TO";

  // DYNAMIC LOGIC AS PER GST RULES
  const sellerName = inv?.companyName || so?.company_Name || "TechNova Solutions Pvt Ltd";
  const sellerGstin = inv?.userGSTIN || so?.gstin || "36AARFB4347G037";
  const sellerAddr = inv?.companyAddress || so?.company_Address || "Head Office, Hyderabad";

  const dispatchName = inv?.dispatchFromCompanyName || so?.dispatchFromCompanyName || "TechNova Medchal Warehouse";
  const dispatchGstin = inv?.dispatchFromGSTIN || so?.dispatchFromGSTIN || "36AARFB4347G039";
  const dispatchAddr = inv?.dispatchFromAddress || so?.dispatchFromAddress || "Medchal Industrial Area";

  const billToName = cust?.legalName || cust?.tradeName || inv?.companyName || "TechNova Solutions Pvt Ltd";
  const billToGstin = inv?.customerGSTIN || cust?.gstin || "02AAACI9260R002";
  const billToAddr = `${cust?.addressLine1||inv?.companyAddress||"3rd Floor H. No 8-2-120/84 Subhash Nagar"} ${cust?.city||"174001"}`.trim();
  const billToState = cust?.state || "KARNATAKA";
  const billToCode = billToGstin?.substring(0,2) || "29";

  const shipToName = inv?.shipToCompanyName || so?.shipToCompanyName || "TechNova Solutions Pvt Ltd";
  const shipToGstin = inv?.shipToGSTIN || so?.shipToGSTIN || "29AARFB4347G038";
  const shipToAddr = inv?.shipToAddress || so?.shipToAddress || "3rd Floor H. No 8-2-120/84 Subhash Nagar 174001";

  // TRANSACTION TYPE LOGIC
  let consigneeName, consigneeGstin, consigneeAddr, consigneeState, consigneeCode;
  let buyerName, buyerGstin, buyerAddr, buyerState, buyerCode;

  if(txType==="REG"){
    consigneeName = billToName; consigneeGstin = billToGstin; consigneeAddr = billToAddr; consigneeState=billToState; consigneeCode=billToCode;
    buyerName = billToName; buyerGstin = billToGstin; buyerAddr = billToAddr; buyerState=billToState; buyerCode=billToCode;
  } else if(txType==="BILL_TO_SHIP_TO"){
    consigneeName = shipToName; consigneeGstin = shipToGstin; consigneeAddr = shipToAddr; consigneeState="KARNATAKA"; consigneeCode=shipToGstin.substring(0,2);
    buyerName = billToName; buyerGstin = billToGstin; buyerAddr = billToAddr; buyerState=billToState; buyerCode=billToCode;
  } else if(txType==="BILL_FROM_DISPATCH_FROM"){
    consigneeName = billToName; consigneeGstin = billToGstin; consigneeAddr = billToAddr; consigneeState=billToState; consigneeCode=billToCode;
    buyerName = billToName; buyerGstin = billToGstin; buyerAddr = billToAddr; buyerState=billToState; buyerCode=billToCode;
  } else { // COMBINED
    consigneeName = shipToName; consigneeGstin = shipToGstin; consigneeAddr = shipToAddr; consigneeState="KARNATAKA"; consigneeCode=shipToGstin.substring(0,2);
    buyerName = billToName; buyerGstin = billToGstin; buyerAddr = billToAddr; buyerState=billToState; buyerCode=billToCode;
  }

  const invoiceNo = inv?.invoiceNumber || `INV-TN-00${id}`;
  const invoiceDate = inv?.invoiceDate? new Date(inv.invoiceDate).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");
  const irnNumber = irnData?.irnNumber || irnData?.invoice?.IrnNumber || inv?.irnNumber || "5c301c59354306c75cf26b3b6080928a1fa908295e60a6c349ae96349d228f";
  const ackNo = irnData?.ackNo || inv?.ackNo || "132610080607424";
  const ackDate = irnData?.invoice?.AckDate? new Date(irnData.invoice.AckDate).toLocaleString() : "8/23/2026 3:28:40 AM";
  const ewbNo = irnData?.invoice?.EWayBillNumber || inv?.eWayBillNumber || "361234567891";
  const vehicleNo = inv?.vehicleNo || so?.vehicleNo || "T S07XX1234";

  // DYNAMIC CALCULATIONS
  const parsedItems = items.length? items.map((it,i)=>({
    sl: i+1,
    desc: it.description || it.Description || `Item ${i+1}`,
    hsn: it.hsncode || it.HsnCode || "34343",
    qty: Number(it.quantity||1),
    uom: it.uom || "nos",
    rate: Number(it.unitPrice||it.quantityAmount||1000),
    amount: Number(it.totalAmount||it.quantity*it.unitPrice||10000)
  })) : [{sl:1,desc:"item",hsn:"34343",qty:10,uom:"nos",rate:1000,amount:10000},{sl:2,desc:"13 mm DRILL CHUCK WITH KEY",hsn:"",qty:1,uom:"NOS",rate:500,amount:500}];

  const totalQty = parsedItems.reduce((s,i)=>s+i.qty,0);
  const taxableValue = parsedItems.reduce((s,i)=>s+i.amount,0);
  const isInter = sellerGstin.substring(0,2)!== consigneeGstin.substring(0,2);
  const igstRate = 18; const igstAmt = taxableValue * igstRate / 100;
  const cgstAmt = isInter?0:igstAmt/2; const sgstAmt = isInter?0:igstAmt/2;
  const grandTotal = taxableValue + igstAmt;

  const handlePDF = async()=>{
    if(!ref.current) return; setDownloading(true);
    try{
      const pages = Array.from(ref.current.querySelectorAll(".invoice-page"));
      const pdf = new (await import("jspdf")).default({orientation:"portrait",unit:"mm",format:"a4"});
      for(let idx=0; idx<pages.length; idx++){
        const orig=pages[idx]; const cont=document.createElement("div");
        cont.style.cssText="position:fixed;left:0;top:0;width:210mm;height:297mm;background:#fff;z-index:9999;";
        const page=orig.cloneNode(true); page.style.cssText="width:210mm;min-height:297mm;padding:0;background:#fff;";
        cont.appendChild(page); document.body.appendChild(cont);
        await new Promise(r=>setTimeout(r,200));
        const canvas=await html2canvas(page,{scale:2,useCORS:true,backgroundColor:"#fff"});
        cont.remove(); if(idx>0) pdf.addPage("a4","portrait");
        pdf.addImage(canvas.toDataURL("image/jpeg",0.98),"JPEG",0,0,210,297);
      }
      pdf.save(`${invoiceNo}-${txType}.pdf`);
    }finally{ setDownloading(false); }
  };

  if(loading) return <Box sx={{display:"flex",justifyContent:"center",mt:10}}><CircularProgress/></Box>;

  return (
    <Box sx={{background:"#f1f3f6",minHeight:"100vh",py:2}}>
      <Box sx={{width:"210mm",mx:"auto",mb:1,display:"flex",justifyContent:"space-between"}}>
        <Button variant="outlined" onClick={()=>navigate(-1)}>Back</Button>
        <Stack direction="row" spacing={1}><Chip label={rawTx} color="info" size="small"/><Chip label={txType.replace(/_/g," ")} color="success" size="small"/><Button variant="contained" onClick={handlePDF} disabled={downloading}>{downloading?"...":"Download 4 Copies"}</Button></Stack>
      </Box>

      <Box ref={ref} sx={{width:"210mm",mx:"auto",bgcolor:"#fff"}}>
        {COPY_TYPES.map(copyLabel=>(
          <div key={copyLabel} className="invoice-page" style={{width:"210mm",minHeight:"297mm",border:"1px solid #000",background:"#fff",color:"#000",fontFamily:"Arial, Helvetica",fontSize:"9px",marginBottom:"12px",display:"flex",flexDirection:"column"}}>

            <div style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #000",padding:"2px 4px",fontSize:"8px"}}>
              <span>Tax Invoice</span><span><b>GSTIN/UIN: {sellerGstin}</b></span><span>{copyLabel}</span>
            </div>

            <div style={{textAlign:"center",borderBottom:"1px solid #000",padding:"6px 4px"}}>
              <div style={{fontSize:"14px",fontWeight:"bold"}}>{sellerName}</div>
              <div style={{fontSize:"7px",fontWeight:"bold"}}>DEALERS IN: INDUSTRIAL METAL WORKING, GENERAL PURPOSE MACHINERY & POWER TOOLS</div>
              <div style={{fontSize:"8px"}}>{sellerAddr} Email:swastikmachineryhyd@gmail.com Ph.9959963344, 91-040-23771020 www.swastikmachinary.com</div>
            </div>

            <div style={{display:"flex",borderBottom:"1px solid #000"}}>
              <div style={{width:"70%",borderRight:"1px solid #000",padding:"4px",fontSize:"8px",lineHeight:"12px"}}>
                <div>E-Way Bill Number</div>
                <div><b>IRN Number</b><br/>{irnNumber}</div>
                <div>Acknowledgement No: {ackNo}</div>
                <div>Acknowledgement Date:{ackDate}</div>
                {isDispatch && <div style={{marginTop:"4px",background:"#fffde7",padding:"2px"}}><b>Dispatch From GSTIN: {dispatchGstin} ({dispatchName})</b><br/>{dispatchAddr}</div>}
              </div>
              <div style={{width:"30%",display:"flex",alignItems:"center",justifyContent:"center",padding:"4px"}}>
                <QRCodeSVG value={irnData?.invoice?.SignedQRCode || irnNumber} size={72} />
              </div>
            </div>

            <div style={{display:"flex",borderBottom:"1px solid #000",flex:0}}>
              <div style={{width:"50%",borderRight:"1px solid #000",padding:"4px",fontSize:"8px"}}>
                <div>Consignee:<br/><b style={{fontSize:"9px"}}>{consigneeName}</b><br/>{consigneeAddr}<br/>GSTIN / UIN : <b>{consigneeGstin}</b><br/>State Name : {consigneeState}, Code : {consigneeCode}</div>
                <div style={{borderTop:"1px solid #000",marginTop:"6px",paddingTop:"4px"}}>
                  Buyer (If other than consignee)<br/><b style={{fontSize:"9px"}}>{buyerName}</b><br/>{buyerAddr}<br/>GSTIN / UIN : <b>{buyerGstin}</b><br/>State Name : {buyerState}, Code : {buyerCode}
                </div>
              </div>
              <div style={{width:"50%",fontSize:"8px"}}>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}><div style={{width:"50%",borderRight:"1px solid #000",padding:"2px"}}>Invoice No.<br/><b>{invoiceNo}</b></div><div style={{width:"50%",padding:"2px"}}>Dated:<br/><b>{invoiceDate}</b></div></div>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}><div style={{width:"50%",borderRight:"1px solid #000",padding:"2px"}}>D. C. No.<br/>DN-001</div><div style={{width:"50%",padding:"2px"}}>Delivery Note Date:<br/>{invoiceDate}</div></div>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}><div style={{width:"50%",borderRight:"1px solid #000",padding:"2px"}}>Purchase Order No.<br/>121</div><div style={{width:"50%",padding:"2px"}}>Purchase Order Date<br/>{invoiceDate}</div></div>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}><div style={{width:"50%",borderRight:"1px solid #000",padding:"2px"}}>Bill Of Landing/LR- RR No<br/>36-Telangana</div><div style={{width:"50%",padding:"2px"}}>Motor Vehicle No.<br/><b>{vehicleNo}</b></div></div>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}><div style={{width:"50%",borderRight:"1px solid #000",padding:"2px"}}>Despatched Through<br/>Road</div><div style={{width:"50%",padding:"2px"}}>Other Reference(s)<br/>PO-2026-001</div></div>
                <div style={{padding:"2px"}}>Terms of Delivery: Door Delivery<br/>EWB: {ewbNo}<br/>Transaction: {txType.replace(/_/g," ")}</div>
              </div>
            </div>

            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"8px"}}>
              <thead>
                <tr style={{borderBottom:"1px solid #000",background:"#fafafa"}}>
                  <th style={{borderRight:"1px solid #000",width:"5%"}}>Sl. No</th><th style={{borderRight:"1px solid #000",width:"40%"}}>Description of Goods</th><th style={{borderRight:"1px solid #000",width:"10%"}}>HSN/SAC</th><th style={{borderRight:"1px solid #000",width:"10%"}}>Quantity</th><th style={{borderRight:"1px solid #000",width:"12%"}}>Rate</th><th style={{borderRight:"1px solid #000",width:"5%"}}>Per</th><th style={{width:"18%",textAlign:"right"}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {parsedItems.map(it=>(
                  <tr key={it.sl} style={{borderBottom:"0.5px solid #ddd"}}>
                    <td style={{borderRight:"1px solid #000",textAlign:"center"}}>{it.sl}</td><td style={{borderRight:"1px solid #000"}}>{it.desc}</td><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{it.hsn}</td><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{it.qty} {it.uom}</td><td style={{borderRight:"1px solid #000",textAlign:"right"}}>{it.rate.toFixed(2)}</td><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{it.uom}</td><td style={{textAlign:"right",fontWeight:"bold"}}>{it.amount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{borderTop:"1px solid #000"}}><td colSpan={6} style={{textAlign:"right",borderRight:"1px solid #000",paddingRight:"4px"}}>Total</td><td style={{textAlign:"right",fontWeight:"bold"}}>{taxableValue.toFixed(2)}</td></tr>
                {isInter? (
                  <tr><td colSpan={4} style={{borderRight:"1px solid #000"}}></td><td style={{borderRight:"1px solid #000",textAlign:"right",fontWeight:"bold"}}>IGST</td><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{igstRate}%</td><td style={{textAlign:"right",fontWeight:"bold"}}>{igstAmt.toFixed(2)}</td></tr>
                ) : (
                  <>
                    <tr><td colSpan={4} style={{borderRight:"1px solid #000"}}></td><td style={{borderRight:"1px solid #000",textAlign:"right"}}>CGST</td><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{igstRate/2}%</td><td style={{textAlign:"right"}}>{cgstAmt.toFixed(2)}</td></tr>
                    <tr><td colSpan={4} style={{borderRight:"1px solid #000"}}></td><td style={{borderRight:"1px solid #000",textAlign:"right"}}>SGST</td><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{igstRate/2}%</td><td style={{textAlign:"right"}}>{sgstAmt.toFixed(2)}</td></tr>
                  </>
                )}
                <tr style={{borderTop:"1px solid #000",fontWeight:"bold"}}><td colSpan={3} style={{textAlign:"right",borderRight:"1px solid #000"}}>Grand Total</td><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{totalQty} nos</td><td style={{borderRight:"1px solid #000"}}></td><td style={{borderRight:"1px solid #000"}}></td><td style={{textAlign:"right"}}>₹{grandTotal.toFixed(2)}</td></tr>
              </tbody>
            </table>

            <div style={{borderTop:"1px solid #000",borderBottom:"1px solid #000",padding:"3px",fontSize:"8px"}}>Amount Chargeable (in Words): <b>{numToWords(grandTotal)}</b> <span style={{float:"right"}}>E. & O. E</span></div>

            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"8px",borderBottom:"1px solid #000"}}>
              <thead><tr style={{background:"#fafafa",borderBottom:"1px solid #000"}}><th style={{width:"40%",borderRight:"1px solid #000"}}>HSN/SAC</th><th style={{width:"15%",borderRight:"1px solid #000"}}>Taxable Value</th><th style={{width:"25%",borderRight:"1px solid #000"}}>IGST {igstRate}%</th><th style={{width:"20%"}}>Total Tax</th></tr></thead>
              <tbody><tr><td style={{borderRight:"1px solid #000",textAlign:"center"}}>{parsedItems[0]?.hsn||"34343"}</td><td style={{borderRight:"1px solid #000",textAlign:"right"}}>{taxableValue.toFixed(2)}</td><td style={{borderRight:"1px solid #000",textAlign:"right"}}>{igstAmt.toFixed(2)}</td><td style={{textAlign:"right"}}>{igstAmt.toFixed(2)}</td></tr></tbody>
            </table>

            {/* FIXED BOTTOM SECTION - LINE EXTENDED + GAP */}
            <div style={{display:"flex",flex:1,minHeight:"90px",borderTop:"1px solid #000"}}>
              <div style={{width:"50%",borderRight:"1px solid #000",padding:"6px",fontSize:"8px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <div>
                  <div>Company's PAN:</div>
                  <div style={{marginTop:"4px"}}><b>Declaration</b><br/>OTHER TERMS & CONDITIONS:<br/>Subjected to Hyderabad Jurisdiction.</div>
                  <div style={{marginTop:"8px"}}>Transaction Type: <b>{txType.replace(/_/g," ")}</b><br/>
                  {isShipTo && `ShipTo GSTIN: ${shipToGstin} | `}{isDispatch && `Dispatch GSTIN: ${dispatchGstin}`}</div>
                </div>
              </div>
              <div style={{width:"50%",padding:"6px",fontSize:"8px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <div>
                  <div>Bank: AXIS A/c: xxx00xxxx000 IFSC: UTIB0000211</div>
                  <div>Branch: HYDERABAD</div>
                </div>
                <div style={{textAlign:"right",marginTop:"20px"}}>
                  <div>For {sellerName}</div>
                  <div style={{height:"40px"}}></div>
                  <div>Authorised Signatory</div>
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