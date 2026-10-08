// =========================================================
// CategoryForm.jsx - FULL CATEGORY FIELD COVERAGE
// Matches CategoryCreateRequest.cs
// Includes SubCategories
// =========================================================

import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoryForm = ({
  initialValues = {},
  loading = false,
  sellerId: propSellerId,
  customerId: propCustomerId,
  onSubmit,
  onCancel,
}) => {

  // =========================================================
  // DEFAULT CATEGORY
  // =========================================================

  const getDefaultCategory = () => ({
    categoryId: 0,
    categoryName: "",
    parentCategoryId: null,
    description: "",
    isActive: true,

    createdDate: new Date().toISOString(),
    updatedDate: null,

    categoryCode: "",
    categoryPath: "",
    categoryLevel: 1,
    displayOrder: 0,
    imageUrl: "",

    batchId: "",
    isBulkUpload: false,
    channelCode: "CUSTOM",

    sellerId: propSellerId || 0,
    customerId: propCustomerId || 0,

    createdBy: "System",
    updatedBy: null,

    productCount: 0,

    parentCategory: null,

    subCategories: [],

    bannerUrl: "",
    iconUrl: "",

    metaTitle: "",
    metaDescription: "",

    isSystemDefined: false,

    hsnCode: "",
    gstPercentage: 18,

    ...initialValues,

    sellerId:
      initialValues.sellerId ??
      propSellerId ??
      0,

    customerId:
      initialValues.customerId ??
      propCustomerId ??
      0,

    subCategories:
      Array.isArray(initialValues.subCategories)
        ? initialValues.subCategories
        : [],
  });

  const [formData, setFormData] = useState(getDefaultCategory());

  const [error, setError] = useState("");

  // =========================================================
  // RESET FORM
  // =========================================================

  useEffect(() => {
    setFormData(getDefaultCategory());
  }, [initialValues, propSellerId, propCustomerId]);

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // HANDLE SUBCATEGORY CHANGE
  // =========================================================

  const handleSubCategoryChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const subCategories = [
        ...prev.subCategories,
      ];

      subCategories[index] = {
        ...subCategories[index],
        [field]: value,
      };

      return {
        ...prev,
        subCategories,
      };
    });
  };

  // =========================================================
  // ADD SUBCATEGORY
  // =========================================================

  const addSubCategory = () => {
    setFormData((prev) => ({
      ...prev,

      subCategories: [
        ...prev.subCategories,

        {
          categoryId: 0,
          categoryName: "",
          parentCategoryId:
            prev.categoryId || 0,

          description: "",
          isActive: true,

          createdDate:
            new Date().toISOString(),

          updatedDate: null,

          categoryCode: "",
          categoryPath:
            prev.categoryPath
              ? `${prev.categoryPath}/`
              : "",

          categoryLevel:
            Number(prev.categoryLevel || 1) + 1,

          displayOrder:
            prev.subCategories.length + 1,

          imageUrl: "",

          batchId: prev.batchId || "",

          isBulkUpload:
            Boolean(prev.isBulkUpload),

          channelCode:
            prev.channelCode || "CUSTOM",

          sellerId:
            prev.sellerId || 0,

          customerId:
            prev.customerId || 0,

          createdBy:
            prev.createdBy || "System",

          updatedBy: null,

          productCount: 0,

          parentCategory:
            prev.categoryName || null,

          subCategories: [],

          bannerUrl: "",
          iconUrl: "",

          metaTitle: "",
          metaDescription: "",

          isSystemDefined: false,

          hsnCode: "",
          gstPercentage:
            Number(prev.gstPercentage ?? 18),
        },
      ],
    }));
  };

  // =========================================================
  // REMOVE SUBCATEGORY
  // =========================================================

  const removeSubCategory = (index) => {
    setFormData((prev) => ({
      ...prev,

      subCategories:
        prev.subCategories.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!formData.categoryName.trim()) {
      setError("Category Name is required.");
      return;
    }

    const payload = {
      ...formData,

      categoryId:
        Number(formData.categoryId) || 0,

      parentCategoryId:
        formData.parentCategoryId === null ||
        formData.parentCategoryId === ""
          ? null
          : Number(formData.parentCategoryId),

      sellerId:
        Number(formData.sellerId) || 0,

      customerId:
        Number(formData.customerId) || 0,

      categoryLevel:
        formData.categoryLevel === ""
          ? null
          : Number(formData.categoryLevel),

      displayOrder:
        Number(formData.displayOrder) || 0,

      productCount:
        Number(formData.productCount) || 0,

      gstPercentage:
        formData.gstPercentage === "" ||
        formData.gstPercentage === null
          ? null
          : Number(formData.gstPercentage),

      isActive:
        Boolean(formData.isActive),

      isBulkUpload:
        Boolean(formData.isBulkUpload),

      isSystemDefined:
        Boolean(formData.isSystemDefined),

      subCategories:
        formData.subCategories.map(
          (subCategory, index) => ({
            ...subCategory,

            categoryId:
              Number(subCategory.categoryId) || 0,

            parentCategoryId:
              subCategory.parentCategoryId ===
                null ||
              subCategory.parentCategoryId === ""
                ? formData.categoryId || 0
                : Number(
                    subCategory.parentCategoryId
                  ),

            categoryLevel:
              subCategory.categoryLevel === ""
                ? null
                : Number(
                    subCategory.categoryLevel
                  ),

            displayOrder:
              Number(
                subCategory.displayOrder
              ) || index + 1,

            sellerId:
              Number(
                subCategory.sellerId
              ) || 0,

            customerId:
              Number(
                subCategory.customerId
              ) || 0,

            productCount:
              Number(
                subCategory.productCount
              ) || 0,

            gstPercentage:
              subCategory.gstPercentage ===
                "" ||
              subCategory.gstPercentage === null
                ? null
                : Number(
                    subCategory.gstPercentage
                  ),

            isActive:
              Boolean(
                subCategory.isActive
              ),

            isBulkUpload:
              Boolean(
                subCategory.isBulkUpload
              ),

            isSystemDefined:
              Boolean(
                subCategory.isSystemDefined
              ),

            subCategories:
              Array.isArray(
                subCategory.subCategories
              )
                ? subCategory.subCategories
                : [],
          })
        ),

      updatedDate:
        new Date().toISOString(),
    };

    console.log(
      "FULL CATEGORY PAYLOAD:",
      payload
    );

    onSubmit(payload);
  };

  // =========================================================
  // SECTION
  // =========================================================

  const Section = ({
    title,
    children,
  }) => (
    <>
      <Box
        sx={{
          width: "100%",
          flexBasis: "100%",
          flexGrow: 0,
          flexShrink: 0,

          mt: {
            xs: 3,
            sm: 4,
            md: 5,
          },

          mb: {
            xs: 1,
            sm: 1.5,
          },
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

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,

        bgcolor: "#ffffff",

        width: "100%",

        overflow: "hidden",
      }}
    >

      <form onSubmit={handleSubmit}>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* ===================================================
            TOP BAR
        =================================================== */}

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
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
              }}
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
                bgcolor:
                  "background.paper",
              }}
            />
          </Box>

          {/* Customer ID */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
              }}
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
                bgcolor:
                  "background.paper",
              }}
            />
          </Box>

          {/* Category ID */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Category ID:
            </Typography>

            <TextField
              size="small"
              name="categoryId"
              type="number"
              value={formData.categoryId}
              onChange={handleChange}
              sx={{
                flex: 1,
                bgcolor:
                  "background.paper",
              }}
            />
          </Box>

          {/* Switches */}

          <Box
            sx={{
              gridColumn: {
                xs: "1",
                sm: "1 / -1",
                md: "1 / -1",
              },

              display: "flex",
              flexWrap: "wrap",

              gap: {
                xs: 1,
                sm: 2,
              },

              alignItems: "center",

              justifyContent: {
                xs: "flex-start",
                md: "flex-end",
              },
            }}
          >

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(
                    formData.isActive
                  )}
                  name="isActive"
                  onChange={handleChange}
                />
              }
              label="Active"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(
                    formData.isBulkUpload
                  )}
                  name="isBulkUpload"
                  onChange={handleChange}
                />
              }
              label="Bulk Upload"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(
                    formData.isSystemDefined
                  )}
                  name="isSystemDefined"
                  onChange={handleChange}
                />
              }
              label="System Defined"
            />

          </Box>
        </Box>

        {/* ===================================================
            MAIN FORM
        =================================================== */}

        <Grid
          container
          spacing={{
            xs: 2,
            sm: 2.5,
            md: 3,
          }}
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <Section title="BASIC INFORMATION">

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                size="small"
                label="Category Name"
                name="categoryName"
                value={
                  formData.categoryName
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Parent Category ID"
                name="parentCategoryId"
                type="number"
                value={
                  formData.parentCategoryId ??
                  ""
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Category Code"
                name="categoryCode"
                value={
                  formData.categoryCode
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Category Path"
                name="categoryPath"
                value={
                  formData.categoryPath
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Category Level"
                name="categoryLevel"
                type="number"
                value={
                  formData.categoryLevel
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Display Order"
                name="displayOrder"
                type="number"
                value={
                  formData.displayOrder
                }
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
                value={
                  formData.description
                }
                onChange={handleChange}
              />
            </Grid>

          </Section>

          {/* =================================================
              SELLER / CUSTOMER / CHANNEL
          ================================================= */}

          <Section title="SELLER / CUSTOMER / CHANNEL">

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Seller ID"
                name="sellerId"
                type="number"
                value={formData.sellerId}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Customer ID"
                name="customerId"
                type="number"
                value={
                  formData.customerId
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Channel Code"
                name="channelCode"
                value={
                  formData.channelCode
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Batch ID"
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Created By"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Updated By"
                name="updatedBy"
                value={
                  formData.updatedBy ?? ""
                }
                onChange={handleChange}
              />
            </Grid>

          </Section>

          {/* =================================================
              IMAGES & SEO
          ================================================= */}

          <Section title="IMAGES & SEO">

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Banner URL"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Icon URL"
                name="iconUrl"
                value={formData.iconUrl}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Meta Title"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Meta Description"
                name="metaDescription"
                value={
                  formData.metaDescription
                }
                onChange={handleChange}
              />
            </Grid>

          </Section>

          {/* =================================================
              TAX INFORMATION
          ================================================= */}

          <Section title="TAX INFORMATION">

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="HSN Code"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="GST Percentage"
                name="gstPercentage"
                type="number"
                value={
                  formData.gstPercentage
                }
                onChange={handleChange}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 0.01,
                }}
              />
            </Grid>

          </Section>

          {/* =================================================
              CATEGORY STATUS / STATISTICS
          ================================================= */}

          <Section title="CATEGORY STATUS & STATISTICS">

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Product Count"
                name="productCount"
                type="number"
                value={
                  formData.productCount
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Parent Category"
                name="parentCategory"
                value={
                  formData.parentCategory ??
                  ""
                }
                onChange={handleChange}
              />
            </Grid>

          </Section>

          {/* =================================================
              SUB CATEGORIES
          ================================================= */}

          <Section title="SUB CATEGORIES">

            <Grid item xs={12}>

              {formData.subCategories
                .length === 0 && (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    border: "1px dashed",
                    borderColor:
                      "grey.400",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No sub-categories added.
                  </Typography>
                </Box>
              )}

              {formData.subCategories.map(
                (subCategory, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "1px solid",
                      borderColor:
                        "grey.300",
                      borderRadius: 2,
                      bgcolor:
                        "#fafafa",
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        color="primary"
                      >
                        Sub Category{" "}
                        {index + 1}
                      </Typography>

                      <IconButton
                        color="error"
                        onClick={() =>
                          removeSubCategory(
                            index
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Grid
                      container
                      spacing={2}
                    >

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Category Name"
                          value={
                            subCategory.categoryName ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "categoryName",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Category Code"
                          value={
                            subCategory.categoryCode ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "categoryCode",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Category Path"
                          value={
                            subCategory.categoryPath ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "categoryPath",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Category Level"
                          type="number"
                          value={
                            subCategory.categoryLevel ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "categoryLevel",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Display Order"
                          type="number"
                          value={
                            subCategory.displayOrder ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "displayOrder",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="HSN Code"
                          value={
                            subCategory.hsnCode ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "hsnCode",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="GST %"
                          type="number"
                          value={
                            subCategory.gstPercentage ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "gstPercentage",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          label="Image URL"
                          value={
                            subCategory.imageUrl ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "imageUrl",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="Description"
                          value={
                            subCategory.description ??
                            ""
                          }
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(
                                subCategory.isActive
                              )}
                              onChange={(e) =>
                                handleSubCategoryChange(
                                  index,
                                  "isActive",
                                  e.target.checked
                                )
                              }
                            />
                          }
                          label="Active"
                        />
                      </Grid>

                    </Grid>
                  </Paper>
                )
              )}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addSubCategory}
                sx={{
                  borderRadius: 2,
                  textTransform:
                    "none",
                  fontWeight: 600,
                }}
              >
                Add Sub Category
              </Button>

            </Grid>

          </Section>

          {/* =================================================
              DATES
          ================================================= */}

          <Section title="AUDIT INFORMATION">

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Created Date"
                type="datetime-local"
                value={
                  formData.createdDate
                    ? formData.createdDate.slice(
                        0,
                        16
                      )
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    createdDate:
                      e.target.value
                        ? new Date(
                            e.target.value
                          ).toISOString()
                        : null,
                  }))
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Updated Date"
                type="datetime-local"
                value={
                  formData.updatedDate
                    ? formData.updatedDate.slice(
                        0,
                        16
                      )
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    updatedDate:
                      e.target.value
                        ? new Date(
                            e.target.value
                          ).toISOString()
                        : null,
                  }))
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

          </Section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <Grid
            item
            xs={12}
            sx={{ mt: 3 }}
          >
            <Divider sx={{ mb: 2 }} />

            <Stack
              direction={{
                xs: "column-reverse",
                sm: "row",
              }}
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
                  textTransform:
                    "none",
                  px: 3,
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
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
                  textTransform:
                    "none",
                  px: 4,
                  fontWeight: 700,
                  boxShadow: 2,
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  "Save Category"
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
