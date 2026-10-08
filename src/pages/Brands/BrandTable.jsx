import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, IconButton, Tooltip, TextField, MenuItem, InputAdornment, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Edit, Delete, AccountTree, Search, Clear } from "@mui/icons-material";

const BrandTable = ({ brands = [], loading = false, onView, onEdit, onDelete, onModels }) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setSearchText(""); setStatusFilter("All");
  }, [brands]);

  // FIX: Normalize PascalCase + camelCase to fix brandCode missing
  const normalizedBrands = useMemo(() => {
    return brands.map((b) => ({
      brandId: b.brandId?? b.BrandId,
      brandName: b.brandName?? b.BrandName?? "",
      brandCode: b.brandCode?? b.BrandCode?? "", // <-- THIS FIXES YOUR ISSUE
      description: b.description?? b.Description?? "",
      productCount: b.productCount?? b.ProductCount?? 0,
      modelCount: b.modelCount?? b.ModelCount?? 0,
      sellerId: b.sellerId?? b.SellerId,
      logoUrl: b.logoUrl?? b.LogoUrl,
      isActive: b.isActive?? b.IsActive?? false,
      createdDate: b.createdDate?? b.CreatedDate,
      updatedDate: b.updatedDate?? b.UpdatedDate,
      _raw: b // keep original for actions
    }));
  }, [brands]);

  const filteredBrands = useMemo(() => {
    let result = [...normalizedBrands];
    const search = searchText.trim().toLowerCase();
    if (search!== "") {
      result = result.filter((brand) => {
        return (
          String(brand.brandName).toLowerCase().includes(search) ||
          String(brand.brandCode).toLowerCase().includes(search) || // <-- search by code also
          String(brand.description).toLowerCase().includes(search)
        );
      });
    }
    if (statusFilter!== "All") {
      result = result.filter((brand) => {
        if (statusFilter === "Active") return brand.isActive === true;
        if (statusFilter === "Inactive") return brand.isActive === false;
        return true;
      });
    }
    return result;
  }, [normalizedBrands, searchText, statusFilter]);

  const handleClearSearch = () => setSearchText("");

  const columns = [
    { field: "brandId", headerName: "ID", width: 90 },
    { field: "brandName", headerName: "Brand Name", flex: 1.5, minWidth: 180 },
    {
      field: "brandCode",
      headerName: "Brand Code",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <strong>{params.value || "-"}</strong>
    },
    { field: "description", headerName: "Description", flex: 2, minWidth: 250, renderCell: (params) => <span>{params.value || "-"}</span> },
    { field: "productCount", headerName: "Products", width: 90, type: "number", renderCell: (params) => <span>{params.value?? 0}</span> },
    { field: "modelCount", headerName: "Models", width: 90, type: "number", renderCell: (params) => <span>{params.value?? 0}</span> },
    { field: "isActive", headerName: "Status", width: 110, renderCell: (params) => <Chip label={params.value? "Active" : "Inactive"} color={params.value? "success" : "error"} size="small" /> },
    {
      field: "actions", headerName: "Actions", width: 200, sortable: false, filterable: false,
      renderCell: (params) => {
        const brand = params.row._raw || params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Brand Models"><IconButton color="secondary" onClick={() => onModels?.(brand)}><AccountTree /></IconButton></Tooltip>
            <Tooltip title="View"><IconButton color="primary" onClick={() => onView?.(brand)}><Visibility /></IconButton></Tooltip>
            <Tooltip title="Edit"><IconButton color="warning" onClick={() => onEdit?.(brand)}><Edit /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton color="error" onClick={() => onDelete?.(brand)}><Delete /></IconButton></Tooltip>
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth size="small" label="Search Brand" placeholder="Search by brand name, code or description"
          value={searchText} onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            endAdornment: searchText && <InputAdornment position="end"><IconButton size="small" onClick={handleClearSearch}><Clear /></IconButton></InputAdornment>
          }}
        />
        <TextField select size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="All">All</MenuItem><MenuItem value="Active">Active</MenuItem><MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Stack>

      <Box sx={{ mb: 1, fontSize: 14, color: "text.secondary" }}>Results: {filteredBrands.length}</Box>

      <DataGrid
        rows={filteredBrands}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.brandId}
        pageSizeOptions={[5, 10, 20, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
};

export default BrandTable;