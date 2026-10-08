// =========================================================
// CatalogTable.jsx - sellerId as FETCHED OBJECT
// =========================================================
import React, { useMemo } from "react";
import {
  Box, Checkbox, Chip, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip, Typography, Stack
} from "@mui/material";
import { Delete, Edit, Visibility, Image, Tune, Reviews, AccountTree, Store, Publish } from "@mui/icons-material";

const CatalogTable = ({
  catalogs = [], selectedIds = [], onSelectionChange,
  onView, onEdit, onDelete, onImages, onAttributes, onReviews, onRelated, onMarketplace, onPublish,
  loading = false,
}) => {

  // NORMALIZE - SAME FIX AS BRAND TABLE
  const normalizedCatalogs = useMemo(() => {
    return catalogs.map((c) => {
      const productId = c.productId?? c.ProductId?? c.catalogId?? c.CatalogId?? c.id?? c.Id;

      // sellerId as OBJECT
      const sellerObj = c.seller?? c.Seller?? null;
      const sellerId = c.sellerId?? c.SellerId?? sellerObj?.sellerId?? sellerObj?.SellerId?? 0;

      // customerId as OBJECT
      const customerObj = c.customer?? c.Customer?? null;
      const customerId = c.customerId?? c.CustomerId?? customerObj?.customerId?? customerObj?.CustomerId?? 0;

      return {
        productId,
        sellerId,
        seller: sellerObj, // <-- FULL OBJECT, not just ID
        customerId,
        customer: customerObj, // <-- FULL OBJECT
        productName: c.productName?? c.ProductName?? c.catalogName?? c.product?.productName?? "-",
        sku: c.sku?? c.SKU?? c.productCode?? c.ProductCode?? c.product?.sku?? "-",
        brandName: c.brandName?? c.BrandName?? c.brand?.brandName?? c.brand?.BrandName?? "-",
        brand: c.brand?? c.Brand?? null,
        categoryName: c.categoryName?? c.CategoryName?? c.category?.categoryName?? "-",
        category: c.category?? c.Category?? null,
        price: c.price?? c.sellingPrice?? c.product?.price?? null,
        stock: Number(c.stockQuantity?? c.stock?? c.quantity?? c.productInventory?.quantity?? 0),
        status: c.status?? (c.isActive? "Active" : "Inactive")?? "Unknown",
        _raw: c // keep full object for actions
      };
    });
  }, [catalogs]);

  const getStatusColor = (s) => {
    switch (String(s).toLowerCase()) {
      case "active": case "available": case "published": return "success";
      case "inactive": return "default";
      case "pending": case "draft": return "warning";
      case "unavailable": case "out of stock": case "rejected": return "error";
      default: return "default";
    }
  };

  const formatPrice = (v) => {
    if (v==null||v==="") return "—";
    const n = Number(v);
    return isNaN(n)? v : `₹${n.toLocaleString("en-IN",{minimumFractionDigits:2})}`;
  };

  const allSelected = normalizedCatalogs.length>0 && normalizedCatalogs.every(c=>selectedIds.includes(c.productId));

  const handleSelectAll = (e) => {
    if (!onSelectionChange) return;
    onSelectionChange(e.target.checked? normalizedCatalogs.map(c=>c.productId).filter(Boolean) : []);
  };

  const handleSelectOne = (c) => {
    if (!onSelectionChange ||!c.productId) return;
    onSelectionChange(selectedIds.includes(c.productId)? selectedIds.filter(id=>id!==c.productId) : [...selectedIds, c.productId]);
  };

  if (loading) return <TableContainer component={Paper}><Box sx={{py:8,textAlign:"center"}}><Typography>Loading...</Typography></Box></TableContainer>;
  if (!normalizedCatalogs.length) return <TableContainer component={Paper}><Box sx={{py:8,textAlign:"center"}}><Typography variant="h6">No Catalogs Found</Typography></Box></TableContainer>;

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, overflowX: "auto" }}>
      <Table stickyHeader size="small" sx={{ minWidth: 1450 }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"><Checkbox checked={allSelected} indeterminate={selectedIds.length>0 &&!allSelected} onChange={handleSelectAll} /></TableCell>
            <TableCell><strong>Product ID</strong></TableCell>
            <TableCell><strong>Seller (Object)</strong></TableCell>
            <TableCell><strong>Customer (Object)</strong></TableCell>
            <TableCell><strong>Product</strong></TableCell>
            <TableCell><strong>SKU</strong></TableCell>
            <TableCell><strong>Brand</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell align="right"><strong>Price</strong></TableCell>
            <TableCell align="center"><strong>Stock</strong></TableCell>
            <TableCell align="center"><strong>Status</strong></TableCell>
            <TableCell align="center" sx={{minWidth:300}}><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {normalizedCatalogs.map((cat, index) => (
            <TableRow key={cat.productId??index} hover selected={selectedIds.includes(cat.productId)}>
              <TableCell padding="checkbox"><Checkbox checked={selectedIds.includes(cat.productId)} onChange={()=>handleSelectOne(cat)} /></TableCell>

              <TableCell><Chip label={cat.productId} size="small" variant="outlined" /></TableCell>

              {/* SELLER AS FETCHED OBJECT - NOT SELECTIVE ID */}
              <TableCell>
                <Stack spacing={0.5}>
                  <Chip label={`ID: ${cat.sellerId}`} size="small" color="primary" variant="outlined" />
                  <Typography variant="caption" sx={{fontWeight:600}}>
                    {cat.seller?.sellerName?? cat.seller?.SellerName?? cat.seller?.name?? "—"}
                  </Typography>
                </Stack>
              </TableCell>

              {/* CUSTOMER AS FETCHED OBJECT */}
              <TableCell>
                <Stack spacing={0.5}>
                  <Chip label={`ID: ${cat.customerId}`} size="small" color="secondary" variant="outlined" />
                  <Typography variant="caption" sx={{fontWeight:600}}>
                    {cat.customer?.customerName?? cat.customer?.CustomerName?? "—"}
                  </Typography>
                </Stack>
              </TableCell>

              <TableCell><Typography variant="body2" fontWeight={600} sx={{minWidth:220}}>{cat.productName}</Typography></TableCell>
              <TableCell><Typography variant="body2" color="text.secondary">{cat.sku}</Typography></TableCell>
              <TableCell>{cat.brandName}</TableCell>
              <TableCell><Typography variant="body2" sx={{minWidth:160}}>{cat.categoryName}</Typography></TableCell>
              <TableCell align="right">{formatPrice(cat.price)}</TableCell>
              <TableCell align="center">
                <Chip label={cat.stock<=0? "Out" : cat.stock<=10? `${cat.stock} Low` : cat.stock} color={cat.stock<=0? "error" : cat.stock<=10? "warning" : "success"} size="small" />
              </TableCell>
              <TableCell align="center"><Chip label={cat.status} color={getStatusColor(cat.status)} size="small" /></TableCell>

              <TableCell align="center">
                <Box sx={{display:"flex",justifyContent:"center",gap:0.3}}>
                  <Tooltip title="View (object)"><IconButton size="small" color="primary" onClick={()=>onView?.(cat._raw)}><Visibility fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Edit (object)"><IconButton size="small" color="warning" onClick={()=>onEdit?.(cat._raw)}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Images"><IconButton size="small" color="info" onClick={()=>onImages?.(cat._raw)}><Image fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Attributes"><IconButton size="small" color="secondary" onClick={()=>onAttributes?.(cat._raw)}><Tune fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Reviews"><IconButton size="small" color="success" onClick={()=>onReviews?.(cat._raw)}><Reviews fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Related"><IconButton size="small" onClick={()=>onRelated?.(cat._raw)}><AccountTree fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Marketplace"><IconButton size="small" onClick={()=>onMarketplace?.(cat._raw)}><Store fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Publish"><IconButton size="small" color="success" onClick={()=>onPublish?.(cat._raw)}><Publish fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={()=>onDelete?.(cat._raw)}><Delete fontSize="small" /></IconButton></Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CatalogTable;