import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

import StockLedgerToolbar from "./StockLedgerToolbar";
import StockLedgerStatistics from "./StockLedgerStatistics";
import StockLedgerSearch from "./StockLedgerSearch";
import StockLedgerTable from "./StockLedgerTable";
import StockLedgerPagination from "./StockLedgerPagination";

const SERVER_URL =  "http://localhost:5000";
const STOCK_LEDGER_API = `http://localhost:5000/api/stock-ledgers`;

const api = axios.create({ baseURL: STOCK_LEDGER_API, timeout: 15000 });

const getVal = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k] != null && obj?.[k] !== "") return obj[k];
  return "";
};

const normalizeResponse = (data) => {
  if (Array.isArray(data)) return data;
  return data?.items || data?.data || data?.result || [];
};

const StockLedgerList = () => {
  const navigate = useNavigate();

  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loadStockLedgers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/all");
      setLedgers(normalizeResponse(res.data));
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to load stock ledger",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStockLedgers();
  }, [loadStockLedgers]);

  // SEARCH
  const filteredLedgers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return ledgers;
    return ledgers.filter((item) =>
      [
        getVal(item, "StockLedgerId", "stockLedgerId"),
        getVal(item, "SellerId", "sellerId"),
        getVal(item, "ReferenceNumber", "referenceNumber"),
        getVal(item, "TransactionType", "transactionType"),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [ledgers, searchText]);

  // PAGINATION
  const totalRecords = filteredLedgers.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paginatedLedgers = filteredLedgers.slice((safePage - 1) * pageSize, safePage * pageSize);

  const statistics = useMemo(
    () => ({
      totalTransactions: ledgers.length,
      totalQuantity: ledgers.reduce((s, i) => s + Number(getVal(i, "Quantity", "quantity") || 0), 0),
      totalBalance: ledgers.reduce((s, i) => s + Number(getVal(i, "BalanceQuantity", "balanceQuantity") || 0), 0),
    }),
    [ledgers]
  );

  // REDIRECTS - NO POPUP
  const handleAdd = () => {
    navigate("/stock-ledgers/new");
  };

  const handleEdit = (ledger) => {
    const id = getVal(ledger, "StockLedgerId", "stockLedgerId");
    navigate(`/stock-ledgers/${encodeURIComponent(id)}/edit`);
  };

  const handleView = (ledger) => {
    const id = getVal(ledger, "StockLedgerId", "stockLedgerId");
    navigate(`/stock-ledgers/${encodeURIComponent(id)}`);
  };

  const handleDelete = async (ledger) => {
    const id = getVal(ledger, "StockLedgerId", "stockLedgerId");
    // Option 1: Direct delete with confirm
    if (!window.confirm(`Delete Stock Ledger ${id}?`)) return;
    try {
      await api.delete(`/${encodeURIComponent(id)}`);
      setSnackbar({ open: true, message: "Deleted successfully", severity: "success" });
      loadStockLedgers();
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Delete failed", severity: "error" });
    }
    // Option 2: If you want a separate delete page, use:
    // navigate(`/stock-ledgers/${encodeURIComponent(id)}/delete`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <StockLedgerToolbar onAdd={handleAdd} onRefresh={loadStockLedgers} />
      <StockLedgerStatistics statistics={statistics} />
      <StockLedgerSearch searchText={searchText} setSearchText={setSearchText} />

      {loading ? (
        <Box sx={{ minHeight: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <StockLedgerTable items={paginatedLedgers} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </Box>
      )}

      {!loading && totalRecords > 0 && (
        <StockLedgerPagination
          page={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(Number(s));
            setPage(1);
          }}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockLedgerList;