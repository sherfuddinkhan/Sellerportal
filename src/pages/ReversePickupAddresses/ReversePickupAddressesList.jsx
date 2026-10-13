import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

import ReversePickupAddressToolbar from "./ReversePickupAddressToolbar";
import ReversePickupAddressStatistics from "./ReversePickupAddressStatistics";
import ReversePickupAddressSearch from "./ReversePickupAddressSearch";
import ReversePickupAddressFilters, { initialReversePickupAddressFilters } from "./ReversePickupAddressFilters";
import ReversePickupAddressTable from "./ReversePickupAddressTable";
import ReversePickupAddressPagination from "./ReversePickupAddressPagination";

const API_BASE_URL = "http://localhost:5000";
const DEFAULT_API_ENDPOINT = `${API_BASE_URL}/api/reverse-pickup-addresses`;

const getEndpoint = (e) => {
  const ep = e || DEFAULT_API_ENDPOINT;
  if (ep.startsWith("http")) return ep;
  return ep.startsWith("/")? `${API_BASE_URL}${ep}` : `${API_BASE_URL}/${ep}`;
};

const getAddressId = (a) => {
  if (!a) return null;
  return a.reversePickupAddressId?? a.ReversePickupAddressId?? a.addressId?? a.AddressId?? a.id?? a.Id?? null;
};
const getField = (obj,...fields) => {
  if (!obj) return "";
  for (const f of fields) if (obj[f]!== undefined && obj[f]!== null) return obj[f];
  return "";
};
const normalizeAddress = (address) => {
  if (!address) return {};
  return {
   ...address,
    id: getAddressId(address),
    reversePickupAddressId: getField(address, "reversePickupAddressId", "ReversePickupAddressId", "addressId", "AddressId", "id", "Id"),
    sellerId: getField(address, "sellerId", "SellerId"),
    customerId: getField(address, "customerId", "CustomerId"),
    addressType: getField(address, "addressType", "AddressType"),
    addressLine1: getField(address, "addressLine1", "AddressLine1"),
    addressLine2: getField(address, "addressLine2", "AddressLine2"),
    landmark: getField(address, "landmark", "Landmark"),
    city: getField(address, "city", "City"),
    state: getField(address, "state", "State"),
    pincode: getField(address, "pincode", "Pincode", "pinCode", "PostalCode"),
    country: getField(address, "country", "Country"),
    phone: getField(address, "phone", "Phone", "mobile", "Mobile"),
    email: getField(address, "email", "Email"),
    contactName: getField(address, "contactName", "ContactName", "name", "Name"),
    status: getField(address, "status", "Status"),
    isDefault: getField(address, "isDefault", "IsDefault"),
  };
};
const normalizeResponseData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const ReversePickupAddressesList = ({ endpoint = DEFAULT_API_ENDPOINT, pageSize = 10, rowsPerPageOptions = [5,10,25,50,100], title = "Reverse Pickup Addresses", subtitle = "Manage reverse pickup addresses", autoLoad = true, enableCreate=true, enableEdit=true, enableDelete=true, enableView=true, showStatistics=true, showSearch=true, showFilters=true, onDataLoaded }) => {
  const navigate = useNavigate();
  const apiUrl = useMemo(() => getEndpoint(endpoint), [endpoint]);
  const getAllUrl = useMemo(() => `${apiUrl}/all`, [apiUrl]);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialReversePickupAddressFilters || {});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(getAllUrl);
      const data = normalizeResponseData(res.data).map(normalizeAddress);
      setAddresses(data);
      onDataLoaded?.(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load");
    } finally { setLoading(false); }
  }, [getAllUrl, onDataLoaded]);

  useEffect(() => { if (autoLoad) fetchAddresses(); }, [autoLoad, fetchAddresses]);

  const filteredAddresses = useMemo(() => {
    let result = [...addresses];
    const s = searchTerm.trim().toLowerCase();
    if (s) result = result.filter(a => Object.values(a).some(v => String(v??"").toLowerCase().includes(s)));
    if (filters.city) result = result.filter(a => String(a.city??"").toLowerCase().includes(String(filters.city).toLowerCase()));
    if (filters.state) result = result.filter(a => String(a.state??"").toLowerCase().includes(String(filters.state).toLowerCase()));
    if (filters.status) result = result.filter(a => String(a.status??"").toLowerCase() === String(filters.status).toLowerCase());
    return result;
  }, [addresses, searchTerm, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredAddresses.length / rowsPerPage));
  const paginatedAddresses = useMemo(() => filteredAddresses.slice((page-1)*rowsPerPage, (page-1)*rowsPerPage + rowsPerPage), [filteredAddresses, page, rowsPerPage]);

  const statistics = useMemo(() => ({
    total: addresses.length,
    active: addresses.filter(a => String(a.status??"").toLowerCase() === "active").length,
    inactive: addresses.filter(a => String(a.status??"").toLowerCase() === "inactive").length,
    default: addresses.filter(a => a.isDefault === true || String(a.isDefault).toLowerCase() === "true").length
  }), [addresses]);

  // PAGE NAVIGATION - NO POPUP
  const handleCreate = () => navigate("/reverse-pickup-addresses/create");
  const handleView = (address) => navigate(`/reverse-pickup-addresses/${getAddressId(address)}`);
  const handleEdit = (address) => navigate(`/reverse-pickup-addresses/${getAddressId(address)}/edit`);

  const handleDelete = async (address) => {
    const id = getAddressId(address);
    if (!id) return setError("ID missing");
    if (!window.confirm(`Delete address ${id}?`)) return;
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/${encodeURIComponent(id)}`);
      setAddresses(prev => prev.filter(i => String(getAddressId(i))!== String(id)));
      setSuccessMessage("Deleted successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed");
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <ReversePickupAddressToolbar title={title} subtitle={subtitle} onCreate={enableCreate? handleCreate: undefined} onRefresh={fetchAddresses} createDisabled={loading} />
      {showStatistics && <ReversePickupAddressStatistics statistics={statistics} />}
      {showSearch && <ReversePickupAddressSearch value={searchTerm} onChange={(v) => { setSearchTerm(typeof v === "string"? v: v?.target?.value || ""); setPage(1); }} />}
      {showFilters && <ReversePickupAddressFilters filters={filters} onChange={(f) => { setFilters(f||{}); setPage(1); }} onReset={() => { setFilters(initialReversePickupAddressFilters||{}); setSearchTerm(""); setPage(1); }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {loading && addresses.length === 0 && <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>}
      {!(loading && addresses.length === 0) && (
        <ReversePickupAddressTable addresses={paginatedAddresses} loading={loading} onView={enableView? handleView: undefined} onEdit={enableEdit? handleEdit: undefined} onDelete={enableDelete? handleDelete: undefined} />
      )}
      <ReversePickupAddressPagination page={page} totalPages={totalPages} totalItems={filteredAddresses.length} rowsPerPage={rowsPerPage} rowsPerPageOptions={rowsPerPageOptions} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }} />
      <Snackbar open={Boolean(successMessage)} autoHideDuration={4000} onClose={() => setSuccessMessage("")} message={successMessage} />
    </Box>
  );
};
export default ReversePickupAddressesList;