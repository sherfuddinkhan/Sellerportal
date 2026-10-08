// =========================================================
// ProductForm.jsx - FULL FIELD COVERAGE - CLEAN & POLISHED UI
// Built from GET /api/categories/1/products response
// =========================================================
import React, { useEffect, useState } from "react";
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Button, Stack, Alert, CircularProgress,
  Box, Typography, Divider, Paper, Chip
} from "@mui/material";

const CategoryForm = ({ initialValues = {}, loading = false, sellerId: propSellerId, customerId: propCustomerId, onSubmit, onCancel }) => {

  const getDefaultForm = () => ({
    // Core Identifiers
    productId: 0,
    sellerId: propSellerId || 0,
    customerId: propCustomerId || 0,
    productName: "",
    sku: "",
    barcode: "",
    description: "",
    scanIdentifier: "",
    brandName: "",
    minOrderSize: 0,
    features: "",
    productPageUrl: "",
    productCode: "",
    itemCode: "",
    itemType: "",
    productXID: "",
    costPrice: 0,
    gstPercentage: 18,
    isReturnable: true,
    isCancellable: true,
    isCodAvailable: true,
    shelfLifeDays: 0,
    warrantyPeriod: "",
    isSynced: false,
    lastSyncDate: null,
    brandId: 0,
    categoryId: 1,
    productTypeId: 1,
    itemTypeCode: "",
    itemTypeName: "",
    productGroupCode: "",
    brandCode: "",
    productDetailFieldColor: "",
    productDetailFieldSize: "",
    productDetailFieldMaterial: "",
    productDetailFieldsJson: "",
    dimUnit: "",
    weightUnit: "",
    shelfLife: 0,
    shelfLifeType: "",
    itemTypeStatus: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    hsnCode: "",
    unitOfMeasure: "",
    uom: "",
    status: "",
    isActive: true,
    taxCategory: "GST_18",
    taxTypeCode: "",
    taxPercentage: 0,
    quantityAmount: 0,
    totalAmount: 0,
    gstPer: 0,
    sgstPer: 0,
    sgstAmount: 0,
    cgstPer: 0,
    cgstAmount: 0,
    igstPer: 0,
    igstAmount: 0,
    afterGSTAmount: 0,
    taxType: "",
    exciseDutyTotalInWords: "",
    mrp: 0,
    sellingPrice: 0,
    currencyCode: "INR",
    mfgDate: "",
    expDate: "",
    visibilityStatus: "VISIBLE",
    fulfillmentType: "SELF",
    carrierType: "PARTNER",
    readyToDispatchDays: 2,
    shippingChargeLocal: 0,
    shippingChargeRegional: 0,
    shippingChargeNational: 0,
    isComboPack: false,
    externalProductId: "",
    externalSystemCode: "",
    color: "",
    colorCode: "",
    remarks: "",
    isAdditionalCharges: false,
    size: "",
    brandXID: "",
    itemXID: "",
    flipkartFsn: "",
    fulfillmentProfile: "",
    shippingProvider: "",
    procurementType: "",
    procurementSla: 2,
    barcodeImageUrl: "",
    barcodeType: "",
    barcodeDetailsJson: "",
    isBarcodeVerified: false,
    barcodeVerifiedDate: null,
    batchId: "",
    isBulkUpload: false,
    bulkUploadRowNumber: 0,
    bulkUploadStatus: "",
    bulkUploadError: "",
    categoryCode: "",
    categoryPath: "",
    isCategoryCodeMatch: false,
    channelCode: "",
    channelItemId: "",
    channelProductId: "",
    isChannelSynced: false,
    lastChannelSyncDate: null,
    channelSyncStatus: "",
    isChannelCodeMatch: false,
    vendorCode: "",
    vendorSkuCode: "",
    facilityCode: "",
    listingStatus: "",
    inventoryQuantity: 0,
    reservedQuantity: 0,
    damagedQuantity: 0,
    sellableInventory: 0,
    offerPrice: 0,
    mrpPrice: 0,
    primaryWarehouseId: 0,
    primaryWarehouseCode: "",
    isWarehouseActive: false,
    itemSku: "",
    brand: "",
    category: "",
    productType: "",
    images: [],
    attributes: [],
    inventories: [],
    prices: [],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    eanCode: "",
    upcCode: "",
    sellingPriceVal: 0,
    countryOfOrigin: "",
    isBatchEnabled: false,
    isExpiryEnabled: false,
    isSerialEnabled: false,
    manufacturerDetails: "",
    importerDetails: "",
    packerDetails: "",
    shelfLifeSeconds: 0,
    ...initialValues,
    sellerId: initialValues.sellerId ?? propSellerId ?? 0,
    customerId: initialValues.customerId ?? propCustomerId ?? 0,
  });

  const [formData, setFormData] = useState(getDefaultForm());
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(getDefaultForm());
  }, [initialValues, propSellerId, propCustomerId]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Full payload with proper typing matching API model
    const payload = {
      ...formData,
      productId: Number(formData.productId) || 0,
      sellerId: Number(formData.sellerId) || 0,
      customerId: Number(formData.customerId) || 0,
      minOrderSize: formData.minOrderSize ? Number(formData.minOrderSize) : null,
      costPrice: formData.costPrice ? Number(formData.costPrice) : null,
      gstPercentage: Number(formData.gstPercentage) || 0,
      shelfLifeDays: formData.shelfLifeDays ? Number(formData.shelfLifeDays) : null,
      brandId: Number(formData.brandId) || 0,
      categoryId: Number(formData.categoryId) || 0,
      productTypeId: Number(formData.productTypeId) || 0,
      shelfLife: formData.shelfLife ? Number(formData.shelfLife) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      length: formData.length ? Number(formData.length) : null,
      width: formData.width ? Number(formData.width) : null,
      height: formData.height ? Number(formData.height) : null,
      taxPercentage: formData.taxPercentage ? Number(formData.taxPercentage) : null,
      quantityAmount: formData.quantityAmount ? Number(formData.quantityAmount) : null,
      totalAmount: formData.totalAmount ? Number(formData.totalAmount) : null,
      mrp: formData.mrp ? Number(formData.mrp) : null,
      sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : null,
      readyToDispatchDays: Number(formData.readyToDispatchDays) || 2,
      shippingChargeLocal: Number(formData.shippingChargeLocal) || 0,
      shippingChargeRegional: Number(formData.shippingChargeRegional) || 0,
      shippingChargeNational: Number(formData.shippingChargeNational) || 0,
      procurementSla: Number(formData.procurementSla) || 2,
      inventoryQuantity: formData.inventoryQuantity ? Number(formData.inventoryQuantity) : null,
      reservedQuantity: formData.reservedQuantity ? Number(formData.reservedQuantity) : null,
      damagedQuantity: formData.damagedQuantity ? Number(formData.damagedQuantity) : null,
      sellableInventory: formData.sellableInventory ? Number(formData.sellableInventory) : null,
      offerPrice: formData.offerPrice ? Number(formData.offerPrice) : null,
      mrpPrice: formData.mrpPrice ? Number(formData.mrpPrice) : null,
      sellingPriceVal: Number(formData.sellingPriceVal) || 0,
      shelfLifeSeconds: formData.shelfLifeSeconds ? Number(formData.shelfLifeSeconds) : null,
      updatedDate: new Date().toISOString(),
    };
    console.log("FULL PRODUCT PAYLOAD:", payload);
    onSubmit(payload);
  };
const Section = ({ title, children }) => (
  <>
    {/* =========================================================
        FULL-WIDTH SECTION HEADER
    ========================================================= */}
    <Box
      sx={{
        width: "100%",
        flexBasis: "100%",
        flexGrow: 0,
        flexShrink: 0,
        mt: { xs: 3, sm: 4, md: 5 },
        mb: { xs: 1, sm: 1.5 },
      }}
    >
      <Typography
        variant="subtitle1"
        color="primary"
        fontWeight={700}
        letterSpacing={0.5}
        sx={{
          fontSize: {
            xs: "0.9rem",
            sm: "0.95rem",
          },
        }}
      >
        {title}
      </Typography>

      <Divider
        sx={{
          mt: 1.5,
          width: "100%",
        }}
      />
    </Box>

    {children}
  </>
);

return (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, sm: 2.5, md: 3 },
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      bgcolor: "#ffffff",
      width: "100%",
      overflow: "hidden",
    }}
  >
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* =========================================================
          TOP BAR
      ========================================================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
          p: 2,
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 2,
          bgcolor: "#f8fafc",
        }}
      >
        {/* Seller ID */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{ whiteSpace: "nowrap" }}
          >
            Seller ID:
          </Typography>

          <TextField
            size="small"
            name="sellerId"
            type="number"
            value={formData.sellerId}
            onChange={handleChange}
            sx={{
              flex: 1,
              minWidth: 0,
              bgcolor: "background.paper",
            }}
          />
        </Box>

        {/* Customer ID */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{ whiteSpace: "nowrap" }}
          >
            Customer ID:
          </Typography>

          <TextField
            size="small"
            name="customerId"
            type="number"
            value={formData.customerId}
            onChange={handleChange}
            sx={{
              flex: 1,
              minWidth: 0,
              bgcolor: "background.paper",
            }}
          />
        </Box>

        {/* Product ID */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{ whiteSpace: "nowrap" }}
          >
            Product ID:
          </Typography>

          <TextField
            size="small"
            name="productId"
            type="number"
            value={formData.productId}
            onChange={handleChange}
            sx={{
              flex: 1,
              minWidth: 0,
              bgcolor: "background.paper",
            }}
          />
        </Box>

        {/* Top switches */}
        <Box
          sx={{
            gridColumn: {
              xs: "1",
              sm: "1 / -1",
              md: "1 / -1",
            },
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
            alignItems: "center",
            justifyContent: {
              xs: "flex-start",
              md: "flex-end",
            },
            pt: { xs: 1, md: 0 },
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(formData.isActive)}
                name="isActive"
                onChange={handleChange}
                color="primary"
              />
            }
            label="Active"
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(formData.isReturnable)}
                name="isReturnable"
                onChange={handleChange}
                color="primary"
              />
            }
            label="Returnable"
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(formData.isCancellable)}
                name="isCancellable"
                onChange={handleChange}
                color="primary"
              />
            }
            label="Cancellable"
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(formData.isCodAvailable)}
                name="isCodAvailable"
                onChange={handleChange}
                color="primary"
              />
            }
            label="COD"
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(formData.isComboPack)}
                name="isComboPack"
                onChange={handleChange}
                color="primary"
              />
            }
            label="Combo"
          />
        </Box>
      </Box>

      {/* =========================================================
          MAIN FORM
      ========================================================= */}
      <Grid
        container
        spacing={{ xs: 2, sm: 2.5, md: 3 }}
      >

        {/* =======================================================
            BASIC INFORMATION
        ======================================================= */}
        <Section title="BASIC INFORMATION">

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              required
              size="small"
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Item SKU"
              name="itemSku"
              value={formData.itemSku}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Scan Identifier"
              name="scanIdentifier"
              value={formData.scanIdentifier}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="EAN Code"
              name="eanCode"
              value={formData.eanCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="UPC Code"
              name="upcCode"
              value={formData.upcCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Features"
              name="features"
              value={formData.features}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

        </Section>


        {/* =======================================================
            CATEGORY / BRAND / TYPE MAPPING
        ======================================================= */}
        <Section title="CATEGORY / BRAND / TYPE MAPPING">

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Brand ID"
              name="brandId"
              type="number"
              value={formData.brandId}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Category ID"
              name="categoryId"
              type="number"
              value={formData.categoryId}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Product Type ID"
              name="productTypeId"
              type="number"
              value={formData.productTypeId}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Brand Name"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Brand Code"
              name="brandCode"
              value={formData.brandCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Category Code"
              name="categoryCode"
              value={formData.categoryCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Category Path"
              name="categoryPath"
              value={formData.categoryPath}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Product Code"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Product Group Code"
              name="productGroupCode"
              value={formData.productGroupCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Item Code"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Item Type"
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Item Type Code"
              name="itemTypeCode"
              value={formData.itemTypeCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Item Type Name"
              name="itemTypeName"
              value={formData.itemTypeName}
              onChange={handleChange}
            />
          </Grid>

        </Section>


        {/* =======================================================
            VARIANT & PHYSICAL ATTRIBUTES
        ======================================================= */}
        <Section title="VARIANT & PHYSICAL ATTRIBUTES">

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Color Code"
              name="colorCode"
              value={formData.colorCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Material"
              name="productDetailFieldMaterial"
              value={formData.productDetailFieldMaterial}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Detail Field Color"
              name="productDetailFieldColor"
              value={formData.productDetailFieldColor}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Detail Field Size"
              name="productDetailFieldSize"
              value={formData.productDetailFieldSize}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Product Detail Fields JSON"
              name="productDetailFieldsJson"
              value={formData.productDetailFieldsJson}
              onChange={handleChange}
              placeholder='{"color":"red"}'
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Length"
              name="length"
              type="number"
              value={formData.length}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Width"
              name="width"
              type="number"
              value={formData.width}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Dim Unit"
              name="dimUnit"
              value={formData.dimUnit}
              onChange={handleChange}
              placeholder="cm"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Weight Unit"
              name="weightUnit"
              value={formData.weightUnit}
              onChange={handleChange}
              placeholder="kg"
            />
          </Grid>

        </Section>


        {/* =======================================================
            PRICING & TAX
        ======================================================= */}
        <Section title="PRICING & TAX">

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Cost Price"
              name="costPrice" type="number"
              value={formData.costPrice} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="MRP"
              name="mrp" type="number"
              value={formData.mrp} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Selling Price"
              name="sellingPrice" type="number"
              value={formData.sellingPrice} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="SellingPriceVal"
              name="sellingPriceVal" type="number"
              value={formData.sellingPriceVal} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="MRP Price"
              name="mrpPrice" type="number"
              value={formData.mrpPrice} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Offer Price"
              name="offerPrice" type="number"
              value={formData.offerPrice} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="GST %"
              name="gstPercentage" type="number"
              value={formData.gstPercentage} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Tax %"
              name="taxPercentage" type="number"
              value={formData.taxPercentage} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="HSN Code"
              name="hsnCode"
              value={formData.hsnCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Tax Category"
              name="taxCategory"
              value={formData.taxCategory} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Tax Type Code"
              name="taxTypeCode"
              value={formData.taxTypeCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Currency"
              name="currencyCode"
              value={formData.currencyCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Quantity Amount"
              name="quantityAmount" type="number"
              value={formData.quantityAmount} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Total Amount"
              name="totalAmount" type="number"
              value={formData.totalAmount} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="After GST Amount"
              name="afterGSTAmount" type="number"
              value={formData.afterGSTAmount} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Excise Duty In Words"
              name="exciseDutyTotalInWords"
              value={formData.exciseDutyTotalInWords}
              onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="GST Per"
              name="gstPer" type="number"
              value={formData.gstPer} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="SGST Per"
              name="sgstPer" type="number"
              value={formData.sgstPer} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="SGST Amount"
              name="sgstAmount" type="number"
              value={formData.sgstAmount} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="CGST Per"
              name="cgstPer" type="number"
              value={formData.cgstPer} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="CGST Amount"
              name="cgstAmount" type="number"
              value={formData.cgstAmount} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="IGST Per"
              name="igstPer" type="number"
              value={formData.igstPer} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="IGST Amount"
              name="igstAmount" type="number"
              value={formData.igstAmount} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Tax Type"
              name="taxType"
              value={formData.taxType} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="UOM / Unit"
              name="uom"
              value={formData.uom || formData.unitOfMeasure}
              onChange={handleChange}
            />
          </Grid>

        </Section>


        {/* =======================================================
            INVENTORY & WAREHOUSE
        ======================================================= */}
        <Section title="INVENTORY & WAREHOUSE">

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Inventory Qty"
              name="inventoryQuantity" type="number"
              value={formData.inventoryQuantity} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Reserved Qty"
              name="reservedQuantity" type="number"
              value={formData.reservedQuantity} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Damaged Qty"
              name="damagedQuantity" type="number"
              value={formData.damagedQuantity} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Sellable"
              name="sellableInventory" type="number"
              value={formData.sellableInventory} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Primary Warehouse ID"
              name="primaryWarehouseId" type="number"
              value={formData.primaryWarehouseId} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Primary Warehouse Code"
              name="primaryWarehouseCode"
              value={formData.primaryWarehouseCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Vendor Code"
              name="vendorCode"
              value={formData.vendorCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Vendor SKU Code"
              name="vendorSkuCode"
              value={formData.vendorSkuCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Facility Code"
              name="facilityCode"
              value={formData.facilityCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Min Order Size"
              name="minOrderSize" type="number"
              value={formData.minOrderSize} onChange={handleChange} />
          </Grid>

        </Section>


        {/* =======================================================
            FULFILLMENT & SHIPPING
        ======================================================= */}
        <Section title="FULFILLMENT & SHIPPING">

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Visibility Status</InputLabel>
              <Select
                name="visibilityStatus"
                label="Visibility Status"
                value={formData.visibilityStatus}
                onChange={handleChange}
              >
                <MenuItem value="VISIBLE">VISIBLE</MenuItem>
                <MenuItem value="HIDDEN">HIDDEN</MenuItem>
                <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Fulfillment Type</InputLabel>
              <Select
                name="fulfillmentType"
                label="Fulfillment Type"
                value={formData.fulfillmentType}
                onChange={handleChange}
              >
                <MenuItem value="SELF">SELF</MenuItem>
                <MenuItem value="WAREHOUSE">WAREHOUSE</MenuItem>
                <MenuItem value="DROPSHIP">DROPSHIP</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Carrier Type"
              name="carrierType"
              value={formData.carrierType} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Ready To Dispatch Days"
              name="readyToDispatchDays" type="number"
              value={formData.readyToDispatchDays} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shipping Local"
              name="shippingChargeLocal" type="number"
              value={formData.shippingChargeLocal} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shipping Regional"
              name="shippingChargeRegional" type="number"
              value={formData.shippingChargeRegional} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shipping National"
              name="shippingChargeNational" type="number"
              value={formData.shippingChargeNational} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Listing Status"
              name="listingStatus"
              value={formData.listingStatus} onChange={handleChange} />
          </Grid>

        </Section>


        {/* =======================================================
            SHELF LIFE / MANUFACTURING
        ======================================================= */}
        <Section title="SHELF LIFE / MANUFACTURING">

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shelf Life Days"
              name="shelfLifeDays" type="number"
              value={formData.shelfLifeDays} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shelf Life"
              name="shelfLife" type="number"
              value={formData.shelfLife} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shelf Life Type"
              name="shelfLifeType"
              value={formData.shelfLifeType} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shelf Life Seconds"
              name="shelfLifeSeconds" type="number"
              value={formData.shelfLifeSeconds} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="MFG Date"
              name="mfgDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.mfgDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="EXP Date"
              name="expDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.expDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Warranty Period"
              name="warrantyPeriod"
              value={formData.warrantyPeriod} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Country Of Origin"
              name="countryOfOrigin"
              value={formData.countryOfOrigin} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Item Type Status"
              name="itemTypeStatus"
              value={formData.itemTypeStatus} onChange={handleChange} />
          </Grid>

        </Section>


        {/* =======================================================
            EXTERNAL CHANNELS & SYNC
        ======================================================= */}
        <Section title="EXTERNAL CHANNELS & SYNC">

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="External Product ID"
              name="externalProductId"
              value={formData.externalProductId} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="External System Code"
              name="externalSystemCode"
              value={formData.externalSystemCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Channel Code"
              name="channelCode"
              value={formData.channelCode} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Channel Sync Status"
              name="channelSyncStatus"
              value={formData.channelSyncStatus} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Channel Item ID"
              name="channelItemId"
              value={formData.channelItemId} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Channel Product ID"
              name="channelProductId"
              value={formData.channelProductId} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Flipkart FSN"
              name="flipkartFsn"
              value={formData.flipkartFsn} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Status"
              name="status"
              value={formData.status} onChange={handleChange} />
          </Grid>

        </Section>


        {/* =======================================================
            BARCODE / BATCH / BULK
        ======================================================= */}
        <Section title="BARCODE / BATCH / BULK">

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Barcode Image URL"
              name="barcodeImageUrl"
              value={formData.barcodeImageUrl} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Barcode Type"
              name="barcodeType"
              value={formData.barcodeType} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Barcode Details JSON"
              name="barcodeDetailsJson"
              value={formData.barcodeDetailsJson} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Batch ID"
              name="batchId"
              value={formData.batchId} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Bulk Row Number"
              name="bulkUploadRowNumber" type="number"
              value={formData.bulkUploadRowNumber} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Bulk Upload Status"
              name="bulkUploadStatus"
              value={formData.bulkUploadStatus} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Bulk Upload Error"
              name="bulkUploadError"
              value={formData.bulkUploadError} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Product Page URL"
              name="productPageUrl"
              value={formData.productPageUrl} onChange={handleChange} />
          </Grid>

        </Section>


        {/* =======================================================
            ADDITIONAL METADATA
        ======================================================= */}
        <Section title="ADDITIONAL METADATA">

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Product XID"
              name="productXID"
              value={formData.productXID} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Brand XID"
              name="brandXID"
              value={formData.brandXID} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Item XID"
              name="itemXID"
              value={formData.itemXID} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Fulfillment Profile"
              name="fulfillmentProfile"
              value={formData.fulfillmentProfile} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Shipping Provider"
              name="shippingProvider"
              value={formData.shippingProvider} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Procurement Type"
              name="procurementType"
              value={formData.procurementType} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Procurement SLA"
              name="procurementSla"
              type="number"
              value={formData.procurementSla}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Manufacturer Details"
              name="manufacturerDetails"
              value={formData.manufacturerDetails}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Importer Details"
              name="importerDetails"
              value={formData.importerDetails}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Packer Details"
              name="packerDetails"
              value={formData.packerDetails}
              onChange={handleChange}
            />
          </Grid>


          {/* =====================================================
              CONFIGURATION FLAGS
          ===================================================== */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Configuration Flags & Toggles
            </Typography>

            <Grid container spacing={1}>
              {[
                ["isBatchEnabled", "Batch Enabled"],
                ["isExpiryEnabled", "Expiry Enabled"],
                ["isSerialEnabled", "Serial Enabled"],
                ["isSynced", "Is Synced"],
                ["isBulkUpload", "Is Bulk Upload"],
                ["isWarehouseActive", "Warehouse Active"],
                ["isBarcodeVerified", "Barcode Verified"],
                ["isChannelSynced", "Channel Synced"],
                ["isAdditionalCharges", "Additional Charges"],
                ["isCategoryCodeMatch", "Category Code Match"],
                ["isChannelCodeMatch", "Channel Code Match"],
              ].map(([name, label]) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={name}
                >
                  <FormControlLabel
                    sx={{
                      width: "100%",
                      m: 0,
                      minHeight: 42,
                    }}
                    control={
                      <Switch
                        checked={Boolean(formData[name])}
                        name={name}
                        onChange={handleChange}
                      />
                    }
                    label={label}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Section>


        {/* =======================================================
            ACTIONS
        ======================================================= */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={2}
            justifyContent="flex-end"
            sx={{
              width: "100%",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 4,
                fontWeight: 700,
                boxShadow: 2,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save Product"
              )}
            </Button>
          </Stack>
        </Grid>

      </Grid>
    </form>
  </Paper>
);


};

export default CategoryForm;
