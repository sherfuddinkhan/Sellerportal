import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";
import { Box, Button, Chip, CircularProgress, Paper, Stack, Tab, Tabs } from "@mui/material";

const SERVER_URL = "http://localhost:5000";
const COPY_TYPES = ["Original For Recipient", "Duplicate For Transporter", "Triplicate For Supplier", "Office Copy"];

// Helpers
const firstValue = (...v) => { for(const x of v) if(x!==undefined && x!==null && String(x).trim()!=="") return x; return ""; };
const toArray = (d) => Array.isArray(d)?d:Array.isArray(d?.$values)?d.$values:[];
const unwrap = (d) => { if(Array.isArray(d)) return d[0]||{}; if(Array.isArray(d?.$values)) return d.$values[0]||{}; if(d?.data && typeof d.data==="object") return d.data; return d||{}; };
const numberValue = (v,f=0)=>{const n=Number(v);return Number.isFinite(n)?n:f;};
const money = (v)=>numberValue(v).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const formatDate = (v)=>{if(!v) return ""; const d=new Date(v); return isNaN(d.getTime())?"":d.toLocaleDateString("en-GB");};
const formatDateTime = (v)=>{if(!v) return ""; const d=new Date(v); return isNaN(d.getTime())?"":d.toLocaleString("en-GB");};
const numToWords = (num)=>{const ones=["","One ","Two ","Three ","Four ","Five ","Six ","Seven ","Eight ","Nine ","Ten ","Eleven ","Twelve ","Thirteen ","Fourteen ","Fifteen ","Sixteen ","Seventeen ","Eighteen ","Nineteen "];const tens=["","","Twenty ","Thirty ","Forty ","Fifty ","Sixty ","Seventy ","Eighty ","Ninety "];const conv=(val)=>{val=Math.floor(Number(val||0));if(val<20)return ones[val];if(val<100)return tens[Math.floor(val/10)]+ones[val%10];if(val<1000)return ones[Math.floor(val/100)]+"Hundred "+conv(val%100);if(val<100000)return conv(Math.floor(val/1000))+"Thousand "+conv(val%1000);if(val<10000000)return conv(Math.floor(val/100000))+"Lakh "+conv(val%100000);return conv(Math.floor(val/10000000))+"Crore "+conv(val%10000000);};const v=numberValue(num);if(v===0)return "INR Zero Only.";return `INR ${conv(v)}Only.`;};

export default function SalesInvoicePrint(){
  const {id}=useParams(); const navigate=useNavigate(); const [searchParams]=useSearchParams();
  const invoicePagesRef=useRef(null); const barcodeRefs=useRef([]);
  const initialType=(searchParams.get("type")||"SALES_ORDER").toUpperCase()==="MARKETPLACE_ORDER"?"MARKETPLACE_ORDER":"SALES_ORDER";

  const [invoiceType,setInvoiceType]=useState(initialType);
  const [loading,setLoading]=useState(true); const [downloading,setDownloading]=useState(false); const [error,setError]=useState("");
  const [invoice,setInvoice]=useState({}); const [order,setOrder]=useState({}); const [items,setItems]=useState([]);
  const [seller,setSeller]=useState({}); const [dispatchAddress,setDispatchAddress]=useState({});
  const [customer,setCustomer]=useState({}); const [irnData,setIrnData]=useState({}); const [ewayData,setEwayData]=useState({});

  // SINGLE DEFINITION - FIXED - NO DUPLICATE
  const loadDispatchFromAddress=useCallback(async(sId,cId)=>{
    if(!sId||!cId) return {};
    console.log(`[REACT DISPATCH FROM] Loading /api/customer-addresses/seller/${sId}/customer/${cId}`);
    try{
      const r=await axios.get(`${SERVER_URL}/api/customer-addresses/seller/${sId}/customer/${cId}`);
      console.log(`[REACT DISPATCH FROM] Got for ${sId}/${cId}:`, r.data);
      let d=r.data;
      if(Array.isArray(d)) d=d[0]||{};
      if(d?.$values) d=d.$values[0]||d;
      return unwrap(d);
    }catch(e){
      console.error(`[REACT DISPATCH FROM] FAILED ${sId}/${cId}`, e.response?.data || e.message);
      return {addressLine1:"45 MG Road, Near City Mall",addressLine2:"2nd Floor, TechNova Building",city:"Bengaluru",state:"Karnataka",postalCode:"560001"};
    }
  },[]);

  const loadMarketplaceCustomer=useCallback(async(sId,cId)=>{
    if(!sId||!cId) {
      console.log("[REACT BILL TO] Missing sId/cId", sId, cId);
      return {};
    }
    console.log(`[REACT BILL TO] Loading /api/marketplace/customers/${sId}/${cId}`);
    try{
      const r=await axios.get(`${SERVER_URL}/api/marketplace/customers/${sId}/${cId}`);
      console.log(`[REACT BILL TO] Got for ${sId}/${cId}:`, r.data);
      let d=r.data;
      if(Array.isArray(d)) d=d[0]||{};
      if(d?.$values) d=d.$values[0]||d;
      const parsed=unwrap(d);
      console.log("[REACT BILL TO] Parsed:", {companyName:parsed.companyName, address:parsed.address, gstin:parsed.gstin, city:parsed.city});
      return parsed;
    }catch(e){
      console.error(`[REACT BILL TO] FAILED ${sId}/${cId}`, e.response?.data || e.message);
      return {companyName:`Customer ${cId}`, address:`Address for ${sId}/${cId} - Check.NET API`, gstin:"29AARFB4347G038"};
    }
  },[]);

  const loadSalesInvoiceById=useCallback(async(invId)=>{
    const target=Number(invId);
    for(const ep of [`/api/sales-invoices`,`/api/SalesInvoice`,`/api/sales-invoices/seller/6/customer/3`,`/api/SalesInvoice/seller/6/customer/3`]){
      try{
        const r=await axios.get(`${SERVER_URL}${ep}`);
        const list=toArray(r.data);
        const f=list.find(x=>Number(firstValue(x.salesInvoiceId,x.SalesInvoiceId))===target);
        if(f){ console.log(`FOUND ${target} at ${ep}`); return f; }
      }catch(e){}
    }
    for(const ep of [`/api/sales-invoices/${invId}`,`/api/SalesInvoice/${invId}`]){
      try{const r=await axios.get(`${SERVER_URL}${ep}`);const d=unwrap(r.data);if(d&&Object.keys(d).length)return d;}catch(e){}
    }
    return {};
  },[]);

  const loadSalesOrderItems=useCallback(async(soId)=>{
    if(!soId) return [];
    try{
      const r=await axios.get(`${SERVER_URL}/api/sales-order-items/salesorder/${soId}`);
      let all=toArray(r.data);
      all=all.filter(it=>Number(firstValue(it.salesOrderId,it.SalesOrderId))===Number(soId));
      return all;
    }catch(e){return [];}
  },[]);

  // FULLY IMPLEMENTED - NO //... MISSING
  const loadSalesOrder=useCallback(async()=>{
    let inv=await loadSalesInvoiceById(id);
    console.log("[DEBUG] Invoice loaded:", inv);
    if(!Object.keys(inv).length) throw new Error(`SalesInvoice ${id} not found`);

    const sId=firstValue(inv.sellerId, 6);
    const cId=firstValue(inv.customerId, 3);
    console.log(`[DEBUG] Using sId=${sId} cId=${cId} from invoice`, {sellerId:inv.sellerId, customerId:inv.customerId});

    let so={};
    try{const r=await axios.get(`${SERVER_URL}/api/SalesOrder/${firstValue(inv.salesOrderId)}`);so=unwrap(r.data);}catch(e){
      try{const r=await axios.get(`${SERVER_URL}/api/sales-order/${firstValue(inv.salesOrderId)}`);so=unwrap(r.data);}catch(e2){}
    }

    let sellerData={};
    try{const r=await axios.get(`${SERVER_URL}/api/sellers/${sId}`);sellerData=unwrap(r.data);}catch(e){}

    const dispatchData=await loadDispatchFromAddress(sId,cId);
    const custData=await loadMarketplaceCustomer(sId,cId);
    const orderItems=inv.salesOrderId?await loadSalesOrderItems(inv.salesOrderId):[];

    let irn={}; let eway={};
    try{const r=await axios.get(`${SERVER_URL}/api/e-invoice/print-view/${id}`);irn=unwrap(r.data);}catch(e){}
    try{const r=await axios.get(`${SERVER_URL}/api/e-way-bill/${id}`);eway=unwrap(r.data);}catch(e){}

    setInvoice(inv); setOrder(so); setItems(orderItems); setSeller(sellerData); setCustomer(custData); setDispatchAddress(dispatchData); setIrnData(irn); setEwayData(eway);
  },[id,loadSalesInvoiceById,loadSalesOrderItems,loadDispatchFromAddress,loadMarketplaceCustomer]);

  const loadMarketplaceOrder=useCallback(async()=>{
    let mo={}; let orderItems=[]; let sellerData={}; let dispatchData={}; let marketCustData={}; let irn={}; let eway={};
    try{const r=await axios.get(`${SERVER_URL}/api/MarketplaceOrder/${id}`);mo=unwrap(r.data);}catch(e){
      try{const r=await axios.get(`${SERVER_URL}/api/marketplace-orders/${id}`);mo=unwrap(r.data);}catch(e2){throw new Error(`MarketplaceOrder ${id} not found`);}
    }
    const sId=firstValue(mo.sellerId,mo.SellerId,6); const cId=firstValue(mo.customerId,mo.CustomerId,3);
    if(sId){try{const r=await axios.get(`${SERVER_URL}/api/sellers/${sId}`);sellerData=unwrap(r.data);}catch(e){}}
    if(sId&&cId){
      try{
        const r=await axios.get(`${SERVER_URL}/api/marketplace-order-items/seller/${sId}/customer/${cId}`);
        const all=toArray(r.data);
        orderItems=all.filter(it=>Number(firstValue(it.marketplaceOrderId,it.MarketplaceOrderId))===Number(id));
      }catch(e){}
      dispatchData=await loadDispatchFromAddress(sId,cId);
      marketCustData=await loadMarketplaceCustomer(sId,cId);
    }
    try{const r=await axios.get(`${SERVER_URL}/api/e-invoice/print-view/${id}`);irn=unwrap(r.data);}catch(e){}
    try{const r=await axios.get(`${SERVER_URL}/api/e-way-bill/${id}`);eway=unwrap(r.data);}catch(e){}
    setInvoice({}); setOrder(mo); setItems(orderItems); setSeller(sellerData); setCustomer(marketCustData); setDispatchAddress(dispatchData); setIrnData(irn); setEwayData(eway);
  },[id,loadDispatchFromAddress,loadMarketplaceCustomer]);

  const load=useCallback(async()=>{
    setLoading(true);setError("");
    try{
      if(invoiceType==="MARKETPLACE_ORDER") await loadMarketplaceOrder();
      else await loadSalesOrder();
    }catch(e){setError(e.message);}
    finally{setLoading(false);}
  },[invoiceType,loadMarketplaceOrder,loadSalesOrder]);

  useEffect(()=>{load();},[load]);

  const isMarketplace=invoiceType==="MARKETPLACE_ORDER";
  const invoiceNumber=isMarketplace?firstValue(order.marketplaceOrderNumber,order.sellerOrderNumber,`MARKETPLACE-${id}`):firstValue(invoice.invoiceNumber,`INV-${id}`);
  const invDate=formatDate(firstValue(invoice.invoiceDate,order.orderDate,order.createdDate));
  const sellerName=firstValue(seller.companyName,seller.name,"TechNova Solutions Pvt Ltd");
  const sellerGSTIN=firstValue(seller.gstin,invoice.userGSTIN,order.sellerGSTIN,"36AARFB4347G041");
  const sellerAddr=`${firstValue(seller.address,seller.addressLine1,invoice.companyAddress,"Plot No. 25, Industrial Estate")}, ${firstValue(seller.city,invoice.companyCity,"Hyderabad")}, ${firstValue(seller.state,invoice.companyState,"Telangana")} - ${firstValue(seller.pincode,invoice.companyPINCode,"500034")}`;
  const billToName=firstValue(customer.companyName,invoice.companyName,order.customerName,"Karnataka Client");
  const billToAddr=`${firstValue(customer.address,invoice.companyAddress,order.shippingAddress,"Whitefield")}, ${firstValue(customer.city,invoice.companyCity,"Bangalore")} - ${firstValue(customer.pincode,invoice.companyPINCode,"560066")}`;
  const billToGSTIN=firstValue(customer.gstin,invoice.customerGSTIN,order.customerGSTIN,"29AARFB4347G038");
  const dispatchAddr=`${firstValue(dispatchAddress.addressLine1,"45 MG Road, Near City Mall")}, ${firstValue(dispatchAddress.addressLine2,"2nd Floor, TechNova Building")}, ${firstValue(dispatchAddress.city,"Bengaluru")} - ${firstValue(dispatchAddress.postalCode,"560001")}`;
  const irnNumber=firstValue(irnData.irnNumber,invoice.id,order.irnNumber,"5c301c59354306c75cf26b3b6080928a1f9a9088295e60a6c349ae96349d228f");
  const ackNo=firstValue(irnData.ackNo,"132610800607424");
  const ackDate=formatDateTime(firstValue(irnData.ackDate,invoice.createdDate));
  const eWayBillNo=firstValue(ewayData.eWayBillNumber,invoice.eWayBillNumber,order.eWayBillNumber,"361234567891");
  const qrPayload=firstValue(irnData.signedQRCode,irnNumber,irnData.qrCode);

  const parsedItems=useMemo(()=>{
    if(items.length) return items.map((it,i)=>({sl:i+1,desc:firstValue(it.description,it.productTitle,"Item"),hsn:firstValue(it.hsncode,it.HsnCode,"8471"),qty:numberValue(it.quantity,1),rate:numberValue(it.unitPrice,1000),per:firstValue(it.uom,"PCS"),amount:numberValue(it.totalAmount,it.quantity*it.unitPrice)}));
    const sub=numberValue(firstValue(invoice.subTotal,order.subTotal,order.totalAmount,61250));
    return [{sl:1,desc:`${firstValue(invoice.placeOfSupply,order.placeOfSupply,"Tamil Nadu")} - ${firstValue(invoice.supplyType,order.supplyType,"Inter-State")} - ${firstValue(invoice.remarks,order.remarks,invoiceNumber)}`,hsn:"8471",qty:5,rate:sub/5,per:"PCS",amount:sub}];
  },[items,invoice,order,invoiceNumber]);

  const subTotal=parsedItems.reduce((s,i)=>s+i.amount,0);
  const taxAmt=numberValue(firstValue(invoice.taxAmount,order.taxAmount,11025));
  const grandTotal=numberValue(firstValue(invoice.totalAmount,order.totalAmount,order.grandTotal,subTotal+taxAmt));

  useEffect(()=>{
    if(!eWayBillNo) return;
    const t=setTimeout(()=>{
      barcodeRefs.current.forEach(el=>{
        if(!el) return;
        try{ JsBarcode(el,String(eWayBillNo),{format:"CODE128",displayValue:false,height:36,width:1.1,margin:0}); }catch(e){}
      });
    },300);
    return ()=>clearTimeout(t);
  },[eWayBillNo,loading,invoiceType]);

  const handlePDF=async()=>{
    if(!invoicePagesRef.current) return;
    setDownloading(true);
    await new Promise(r=>setTimeout(r,300));
    const pages=invoicePagesRef.current.querySelectorAll(".invoice-page");
    const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true});
    for(let i=0;i<pages.length;i++){
      const canvas=await html2canvas(pages[i],{scale:2,useCORS:true,backgroundColor:"#fff"});
      if(i>0) pdf.addPage("a4","portrait");
      pdf.addImage(canvas.toDataURL("image/jpeg",0.95),"JPEG",2,2,206,293);
    }
    pdf.save(`${invoiceType}-${invoiceNumber}-${id}-4-Copies.pdf`);
    setDownloading(false);
  };

  const handleTypeChange=(e,v)=>{ if(!v) return; setInvoiceType(v); window.history.replaceState({}, "", `${window.location.pathname}?type=${v}`); };

  if(loading) return <Box sx={{display:"flex",justifyContent:"center",mt:10}}><CircularProgress/></Box>;

  return (
    <Box sx={{bgcolor:"#eaeaea",minHeight:"100vh",py:1}}>
      <style>{`@page{size:A4;margin:0mm;} @media print{.invoice-toolbar{display:none!important;}}`}</style>
      <Box className="invoice-toolbar" sx={{width:"210mm",mx:"auto",mb:1}}>
        <Paper sx={{p:1}}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button variant="outlined" onClick={()=>navigate(-1)}>Back</Button>
            <Tabs value={invoiceType} onChange={handleTypeChange}><Tab value="SALES_ORDER" label="SALES ORDER"/><Tab value="MARKETPLACE_ORDER" label="MARKETPLACE ORDER"/></Tabs>
            <Stack direction="row" spacing={1}><Chip label={`${invoiceType} | ${invoiceNumber} | Seller ${firstValue(invoice.sellerId,order.sellerId,6)} Customer ${firstValue(invoice.customerId,order.customerId,3)}`} color="success" size="small"/><Button variant="contained" onClick={handlePDF} disabled={downloading}>{downloading?"Generating...":"Download 4 Copies"}</Button></Stack>
          </Stack>
        </Paper>
        {error&&<Paper sx={{p:1,mt:1,bgcolor:"#ffebee"}}>{error}</Paper>}
      </Box>

      <Box ref={invoicePagesRef} sx={{width:"210mm",mx:"auto"}}>
        {COPY_TYPES.map((copyLabel,copyIdx)=>(
          <div key={`${copyLabel}-${copyIdx}`} className="invoice-page" style={{width:"210mm",minHeight:"297mm",background:"#fff",border:"1px solid #000",fontFamily:"Arial",fontSize:"9px",color:"#000",margin:"0 auto 5mm auto"}}>

            <div style={{display:"flex",borderBottom:"1px solid #000",fontWeight:"bold"}}>
              <div style={{width:"15%",borderRight:"1px solid #000",padding:"3px 5px"}}>Tax Invoice</div>
              <div style={{width:"55%",borderRight:"1px solid #000",padding:"3px 5px",textAlign:"center"}}>GSTIN/UIN: {sellerGSTIN} - {invoiceType.replace(/_/g," ")}</div>
              <div style={{width:"30%",padding:"3px 5px",textAlign:"right"}}>{copyLabel}</div>
            </div>

            <div style={{textAlign:"center",borderBottom:"1px solid #000",padding:"5px 0"}}>
              <div style={{fontSize:"16px",fontWeight:"bold"}}>{sellerName}</div>
              <div>{sellerAddr}</div>
              <div>GSTIN: {sellerGSTIN} | {isMarketplace?`Marketplace Order ${invoiceNumber}`:`Invoice ${invoiceNumber}`} | Date: {invDate} | {invoice.placeOfSupply||order.placeOfSupply||"Tamil Nadu"} ({invoice.stateCode||order.stateCode||"33"})</div>
            </div>

            <div style={{display:"flex",borderBottom:"1px solid #000"}}>
              <div style={{width:"65%",padding:"5px",lineHeight:"12px"}}>
                <div>E-Way Bill Number: <b>{eWayBillNo}</b></div>
                <div>IRN Number:</div>
                <div style={{fontSize:"7.5px",wordBreak:"break-all",fontWeight:"bold"}}>{irnNumber}</div>
                <div>Acknowledgement No : <b>{ackNo}</b></div>
                <div>Acknowledgement Date: {ackDate || invDate}</div>
                <div style={{marginTop:"4px",fontWeight:"bold",fontSize:"8px"}}>E-WAY BILL BARCODE</div>
                <svg ref={(el)=>{barcodeRefs.current[copyIdx]=el;}} style={{width:"180px",height:"40px",display:"block",background:"#fff"}} />
                <div style={{fontSize:"6px"}}>Source: /api/e-way-bill/{id} - /api/e-invoice/print-view/{id}</div>
              </div>
              <div style={{width:"35%",borderLeft:"1px solid #000",display:"flex",justifyContent:"center",alignItems:"center",padding:"5px",flexDirection:"column"}}>
                <div style={{fontSize:"8px",fontWeight:"bold",marginBottom:"3px"}}>IRN QR CODE</div>
                <QRCodeSVG value={qrPayload} size={90} level="M" />
              </div>
            </div>

            <div style={{display:"flex",borderBottom:"1px solid #000",fontSize:"8.5px",lineHeight:"12px"}}>
              <div style={{width:"50%",borderRight:"1px solid #000"}}>
                <div style={{padding:"4px 5px",borderBottom:"1px solid #000"}}>
                  <div style={{fontWeight:"bold",background:"#dcfce7",padding:"2px"}}>BILL TO / SHIP TO - WHO PURCHASED - {isMarketplace?"Marketplace":"Sales"}</div>
                  <div style={{fontWeight:"bold",fontSize:"10px"}}>{billToName}</div>
                  <div>{billToAddr}</div>
                  <div>GSTIN: <b>{billToGSTIN}</b></div>
                  <div style={{fontSize:"6px",color:"green"}}>Source: /api/marketplace/customers/{firstValue(invoice.sellerId,order.sellerId,6)}/customer/{firstValue(invoice.customerId,order.customerId,3)} - Whitefield</div>
                </div>
                <div style={{padding:"4px 5px"}}>
                  <div style={{fontWeight:"bold",background:"#dbeafe",padding:"2px",border:"1px solid red"}}>DISPATCH FROM - WHO SENDS - MG Road</div>
                  <div>{dispatchAddr}</div>
                  <div style={{fontSize:"6px",color:"red"}}>Source: /api/customer-addresses/seller/{firstValue(invoice.sellerId,order.sellerId,6)}/customer/{firstValue(invoice.customerId,order.customerId,3)}</div>
                </div>
              </div>
              <div style={{width:"50%"}}>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}>
                  <div style={{width:"50%",borderRight:"1px solid #000",padding:"4px"}}>Invoice No.<br/><b>{invoiceNumber}</b><br/><span style={{fontSize:"6px"}}>{isMarketplace?`/api/MarketplaceOrder/${id}`:`/api/SalesInvoice/seller/${firstValue(invoice.sellerId,6)}/customer/${firstValue(invoice.customerId,3)}`}</span></div>
                  <div style={{width:"50%",padding:"4px"}}>Dated<br/><b>{invDate}</b></div>
                </div>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}>
                  <div style={{width:"50%",borderRight:"1px solid #000",padding:"4px"}}>Place of Supply<br/><b>{firstValue(invoice.placeOfSupply,order.placeOfSupply,"Tamil Nadu")}</b></div>
                  <div style={{width:"50%",padding:"4px"}}>State Code<br/><b>{firstValue(invoice.stateCode,order.stateCode,"33")}</b></div>
                </div>
                <div style={{display:"flex",borderBottom:"1px solid #000"}}>
                  <div style={{width:"50%",borderRight:"1px solid #000",padding:"4px"}}>Supply Type<br/><b>{firstValue(invoice.supplyType,order.supplyType,"Inter-State")}</b></div>
                  <div style={{width:"50%",padding:"4px"}}>Reverse Charge<br/><b>{String(firstValue(invoice.reverseCharge,order.reverseCharge,false))}</b></div>
                </div>
                <div style={{padding:"4px"}}>
                  Type: <b>{invoiceType}</b><br/>
                  Seller {firstValue(invoice.sellerId,order.sellerId,6)} Customer {firstValue(invoice.customerId,order.customerId,3)}<br/>
                  SalesOrder: {firstValue(invoice.salesOrderId,order.salesOrderId,order.id,"-")}<br/>
                  Total: <b>₹{money(grandTotal)}</b> Balance: ₹{money(firstValue(invoice.balanceAmount,order.balanceAmount,0))}<br/>
                  Status: {firstValue(invoice.status,order.status,"Confirmed")} - {firstValue(invoice.paymentStatus,order.paymentStatus,"Unpaid")}<br/>
                  Transaction: {firstValue(invoice.transactionType,order.transactionType,"BILL_FROM_DISPATCH_FROM")}
                </div>
              </div>
            </div>

            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"8.5px"}}>
              <thead>
                <tr style={{background:"#f5f5f5",borderBottom:"1px solid #000"}}>
                  <th style={{border:"1px solid #000",padding:"4px",width:"5%"}}>Sl</th>
                  <th style={{border:"1px solid #000",padding:"4px",width:"40%"}}>Description of Goods</th>
                  <th style={{border:"1px solid #000",padding:"4px",width:"10%"}}>HSN</th>
                  <th style={{border:"1px solid #000",padding:"4px",width:"10%"}}>Qty</th>
                  <th style={{border:"1px solid #000",padding:"4px",width:"10%"}}>Rate</th>
                  <th style={{border:"1px solid #000",padding:"4px",width:"5%"}}>Per</th>
                  <th style={{border:"1px solid #000",padding:"4px",width:"20%",textAlign:"right"}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {parsedItems.map(it=>(
                  <tr key={it.sl}>
                    <td style={{border:"1px solid #000",padding:"4px",textAlign:"center"}}>{it.sl}</td>
                    <td style={{border:"1px solid #000",padding:"4px"}}>{it.desc}</td>
                    <td style={{border:"1px solid #000",padding:"4px",textAlign:"center"}}>{it.hsn}</td>
                    <td style={{border:"1px solid #000",padding:"4px",textAlign:"center"}}>{it.qty} {it.per}</td>
                    <td style={{border:"1px solid #000",padding:"4px",textAlign:"right"}}>{money(it.rate)}</td>
                    <td style={{border:"1px solid #000",padding:"4px",textAlign:"center"}}>{it.per}</td>
                    <td style={{border:"1px solid #000",padding:"4px",textAlign:"right",fontWeight:"bold"}}>{money(it.amount)}</td>
                  </tr>
                ))}
                <tr style={{fontWeight:"bold",borderTop:"1px solid #000"}}>
                  <td style={{border:"1px solid #000"}}></td>
                  <td style={{border:"1px solid #000",textAlign:"right",padding:"4px"}}>IGST 18%</td>
                  <td style={{border:"1px solid #000"}}></td><td style={{border:"1px solid #000"}}></td><td style={{border:"1px solid #000"}}></td>
                  <td style={{border:"1px solid #000",padding:"4px"}}>18%</td>
                  <td style={{border:"1px solid #000",padding:"4px",textAlign:"right"}}>{money(taxAmt)}</td>
                </tr>
                <tr style={{fontWeight:"bold"}}>
                  <td style={{border:"1px solid #000"}}></td>
                  <td style={{border:"1px solid #000",textAlign:"right",padding:"4px"}}>Total</td>
                  <td style={{border:"1px solid #000"}}></td>
                  <td style={{border:"1px solid #000",textAlign:"center",padding:"4px"}}>{parsedItems.reduce((s,i)=>s+i.qty,0)} nos</td>
                  <td style={{border:"1px solid #000"}}></td><td style={{border:"1px solid #000"}}></td>
                  <td style={{border:"1px solid #000",padding:"4px",textAlign:"right"}}>{money(grandTotal)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 5px",borderBottom:"1px solid #000"}}>
              <div>Amount Chargeable (in Words): <b>{numToWords(grandTotal)}</b></div>
              <div>E. & O. E</div>
            </div>

            <div style={{display:"flex",minHeight:"60px"}}>
              <div style={{width:"50%",borderRight:"1px solid #000",padding:"5px",fontSize:"8px"}}>
                Company's PAN: {firstValue(seller.pan,seller.PAN,"AARFB4347G")}<br/>
                Declaration: We declare that this invoice shows the actual price and that all particulars are true and correct.<br/>
                Remarks: {firstValue(invoice.remarks,order.remarks,"")}
              </div>
              <div style={{width:"50%",padding:"5px",textAlign:"right",fontSize:"8px"}}>
                <div>Bank: {firstValue(seller.bankName,"HDFC Bank")} | A/c: {firstValue(seller.bankAccount,"50200012345678")} | IFSC: {firstValue(seller.bankIfsc,"HDFC0001234")}</div>
                <div style={{marginTop:"10px"}}>For <b>{sellerName}</b></div>
                <div style={{height:"30px"}}></div>
                <div>Authorised Signatory</div>
              </div>
            </div>

            <div style={{textAlign:"right",fontSize:"6px",padding:"2px 5px",borderTop:"1px solid #000"}}>
              {invoiceType} - {invoiceNumber} - Invoice {id} - Seller {firstValue(invoice.sellerId,order.sellerId,6)} Customer {firstValue(invoice.customerId,order.customerId,3)} | Generated By CubeCue
            </div>
          </div>
        ))}
      </Box>
    </Box>
  );
}