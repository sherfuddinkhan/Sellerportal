import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";

import SupplierAddressToolbar from "./SupplierAddressToolbar";
import SupplierAddressStatistics from "./SupplierAddressStatistics";
import SupplierAddressSearch from "./SupplierAddressSearch";
import SupplierAddressFilters from "./SupplierAddressFilters";
import SupplierAddressTable from "./SupplierAddressTable";
import SupplierAddressPagination from "./SupplierAddressPagination";

// API CONFIG - NEW MODEL
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const SUPPLIER_ADDRESSES_API = `${API_BASE_URL}/SupplierAddress`;
const SUPPLIERS_API = `${API_BASE_URL}/Supplier`;

// Helpers
const getField = (item,...fields) => {
  for (const f of fields) {
    const v = item?.[f];
    if (v!== undefined && v!== null && String(v).trim()!== "") return v;
  }
  return "";
};

const normalize = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.result)) return d.result;
  if (Array.isArray(d?.$values)) return d.$values;
  return [];
};

const SupplierAddressesList = () => {
  const navigate = useNavigate();

  // Data
  const [supplierAddresses, setSupplierAddresses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters - NEW MODEL
  const [searchTerm, setSearchTerm] = useState("");
  const [addressTypeFilter, setAddressTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [stateCodeFilter, setStateCodeFilter] = useState("");
  const [countryCodeFilter, setCountryCodeFilter] = useState("");
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("all");

  // Alert
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const showAlert = useCallback((message, severity = "success") => {
    setAlert({ open: true, message, severity });
  }, []);

  // Fetch
  const fetchSupplierAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(SUPPLIER_ADDRESSES_API);
      setSupplierAddresses(normalize(res));
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || `Failed to fetch ${SUPPLIER_ADDRESSES_API}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await axios.get(SUPPLIERS_API);
      setSuppliers(normalize(res));
    } catch {}
  }, []);

  useEffect(() => {
    fetchSupplierAddresses();
    fetchSuppliers();
  }, [fetchSupplierAddresses, fetchSuppliers]);

  // Filtering - NEW MODEL: countryCode, stateCode, city, pincode, phone
  const filtered = useMemo(() => {
    return supplierAddresses.filter((item) => {
      const supplierName = getField(item, "supplierName", "SupplierName") || getField(item?.supplier || item?.Supplier, "supplierName", "name");
      const supplierId = getField(item, "supplierId", "SupplierId");
      const addressType = getField(item, "addressType", "AddressType");
      const addressLine1 = getField(item, "addressLine1", "AddressLine1");
      const addressLine2 = getField(item, "addressLine2", "AddressLine2");
      const city = getField(item, "city", "City");
      const stateCode = getField(item, "stateCode", "StateCode");
      const countryCode = getField(item, "countryCode", "CountryCode");
      const pincode = getField(item, "pincode", "Pincode");
      const phone = getField(item, "phone", "Phone");
      const sellerId = getField(item, "sellerId", "SellerId");
      const customerId = getField(item, "customerId", "CustomerId");

      const searchHaystack = [supplierName, supplierId, addressType, addressLine1, addressLine2, city, stateCode, countryCode, pincode, phone, sellerId, customerId]
       .join(" ").toLowerCase();

      const matchesSearch =!searchTerm.trim() || searchHaystack.includes(searchTerm.trim().toLowerCase());
      const matchesType = addressTypeFilter === "all" || String(addressType).toLowerCase() === addressTypeFilter.toLowerCase();
      const matchesCity =!cityFilter || String(city).toLowerCase() === cityFilter.toLowerCase();
      const matchesState =!stateCodeFilter || String(stateCode).toLowerCase() === stateCodeFilter.toLowerCase();
      const matchesCountry =!countryCodeFilter || String(countryCode).toLowerCase() === countryCodeFilter.toLowerCase();
      const matchesPincode =!pincodeFilter || String(pincode).toLowerCase() === pincodeFilter.toLowerCase();
      const matchesSupplier = supplierFilter === "all" || String(supplierId) === String(supplierFilter);

      return matchesSearch && matchesType && matchesCity && matchesState && matchesCountry && matchesPincode && matchesSupplier;
    });
  }, [supplierAddresses, searchTerm, addressTypeFilter, cityFilter, stateCodeFilter, countryCodeFilter, pincodeFilter, supplierFilter]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // Reset page on filter change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, addressTypeFilter, cityFilter, stateCodeFilter, countryCodeFilter, pincodeFilter, supplierFilter, rowsPerPage]);

  // Handlers
  const handleClearFilters = useCallback(() => {
    setSearchTerm(""); setAddressTypeFilter("all"); setCityFilter("");
    setStateCodeFilter(""); setCountryCodeFilter(""); setPincodeFilter("");
    setSupplierFilter("all"); setPage(0);
  }, []);

const handleAdd = () => navigate("/supplier-addresses/create");

  const handleView = useCallback((item) => {
    const id = getField(item, "supplierAddressId", "SupplierAddressId");
    if (!id) return showAlert("ID not found", "error");
    navigate(`/supplier-addresses/${id}`);
  }, [navigate, showAlert]);

  const handleEdit = useCallback((item) => {
    const id = getField(item, "supplierAddressId", "SupplierAddressId");
    if (!id) return showAlert("ID not found", "error");
    navigate(`/supplier-addresses/${id}/edit`);
  }, [navigate, showAlert]);

  const handleDelete = useCallback(async (item) => {
    const id = getField(item, "supplierAddressId", "SupplierAddressId");
    if (!id) return showAlert("ID not found", "error");
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`${SUPPLIER_ADDRESSES_API}/${id}`);
      showAlert("Deleted successfully");
      fetchSupplierAddresses();
    } catch (err) {
      showAlert(err?.response?.data?.message || "Failed to delete", "error");
    }
  }, [fetchSupplierAddresses, showAlert]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <SupplierAddressToolbar
        totalCount={filtered.length}
        onAdd={handleAdd}
        onRefresh={fetchSupplierAddresses}
        loading={loading}
      />

      <Box sx={{ mt: 3 }}>
        <SupplierAddressStatistics supplierAddresses={supplierAddresses} />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SupplierAddressSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          addressTypeFilter={addressTypeFilter}
          onAddressTypeChange={setAddressTypeFilter}
          onClear={handleClearFilters}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <SupplierAddressFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          addressTypeFilter={addressTypeFilter}
          onAddressTypeChange={setAddressTypeFilter}
          cityFilter={cityFilter}
          onCityChange={setCityFilter}
          stateFilter={stateCodeFilter}
          onStateChange={setStateCodeFilter}
          countryFilter={countryCodeFilter}
          onCountryChange={setCountryCodeFilter}
          pincodeFilter={pincodeFilter}
          onPincodeChange={setPincodeFilter}
          supplierFilter={supplierFilter}
          onSupplierChange={setSupplierFilter}
          suppliers={suppliers}
          supplierAddresses={supplierAddresses}
          onClear={handleClearFilters}
          loading={loading}
        />
      </Box>

      <Box sx={{ mt: 2, mb: 1, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Showing {paginated.length} of {filtered.length} supplier addresses
        </Typography>
      </Box>

      <Box sx={{ mt: 1 }}>
        {loading? (
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: 220 }}>
            <CircularProgress />
          </Box>
        ) : (
          <SupplierAddressTable
            supplierAddresses={paginated}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Box>

      <SupplierAddressPagination
        count={filtered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
        loading={loading}
      />

      <Snackbar open={alert.open} autoHideDuration={5000} onClose={() => setAlert((p) => ({...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setAlert((p) => ({...p, open: false }))} severity={alert.severity} variant="filled">{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierAddressesList;