// ReversePickupView.jsx - FINAL COPY PASTE
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  CircularProgress,
  Alert,
  Grid,
  Divider
} from "@mui/material";
import { ArrowBack, Edit, AssignmentReturn } from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/ReversePickup";

const getField = (r,...keys) => {
  for (const k of keys) {
    const v = r?.[k];
    if (v!== undefined && v!== null && v!== "") return v;
  }
  return "—";
};

const ReversePickupView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/all`);
        const data = res.data?.data || res.data?.Data || res.data || [];
        const found = data.find(
          (r) => String(r.reversePickupId || r.id) === String(id)
        );
        if (found) setRow(found);
        else setError(`ID ${id} not found. Available: ${data.map((d) => d.reversePickupId).join(", ")}`);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Box sx={{ p: 8, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert><Button sx={{ mt: 2 }} startIcon={<ArrowBack />} onClick={() => navigate("/reverse-pickups")}>Back to List</Button></Container>;
  if (!row) return null;

  const sellerId = getField(row, "sellerId", "SellerId");
  const customerId = getField(row, "customerId", "CustomerId");
  const status = getField(row, "reversePickupStatus", "ReversePickupStatus");

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/reverse-pickups")} sx={{ mb: 1 }}>Back to List</Button>
          <Stack direction="row" spacing={1} alignItems="center">
            <AssignmentReturn color="primary" />
            <Typography variant="h5" fontWeight={700}>Reverse Pickup {getField(row, "reversePickupNo", "ReversePickupNo")}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label={`ID: ${id}`} size="small" />
            <Chip label={`Seller: ${sellerId}`} color="primary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
            <Chip label={`Customer: ${customerId}`} color="secondary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
            <Chip label={status} color="info" size="small" />
          </Stack>
        </Box>
        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/reverse-pickups/${id}/edit`, { state: { from: `/reverse-pickups/view/${id}` } })}>Edit</Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid xs={12}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
              <Typography fontWeight={700}>Pickup Summary</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell sx={{ fontWeight: 600, width: 200 }}>Pickup No</TableCell><TableCell>{getField(row, "reversePickupNo", "ReversePickupNo")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Status</TableCell><TableCell><Chip label={status} size="small" /></TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Tracking No</TableCell><TableCell sx={{ fontFamily: "monospace" }}>{getField(row, "trackingNo", "TrackingNo")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Return Reason</TableCell><TableCell>{getField(row, "returnReason", "ReturnReason")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>QC Comment</TableCell><TableCell>{getField(row, "qcComment", "QCComment")}</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}><Typography fontWeight={700}>Order Details</Typography></Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Sale Order Code</TableCell><TableCell>{getField(row, "saleOrderCode", "SaleOrderCode")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Sale Order Item Code</TableCell><TableCell>{getField(row, "saleOrderItemCode", "SaleOrderItemCode")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Item SKU Code</TableCell><TableCell sx={{ fontWeight: 700 }}>{getField(row, "itemSkuCode", "ItemSkuCode")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Facility Code</TableCell><TableCell>{getField(row, "facilityCode", "FacilityCode")}</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}><Typography fontWeight={700}>Logistics & IDs</Typography></Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Courier Provider</TableCell><TableCell>{getField(row, "courierProviderName", "CourierProviderName")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Channel</TableCell><TableCell>{getField(row, "channelName", "ChannelName")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Putaway Code</TableCell><TableCell>{getField(row, "putawayCode", "PutawayCode")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Seller ID</TableCell><TableCell><Chip label={sellerId} color="primary" size="small" /></TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Customer ID</TableCell><TableCell><Chip label={customerId} color="secondary" size="small" /></TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell><TableCell>{row.createdDate? new Date(row.createdDate).toLocaleString("en-IN") : "—"}</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

                <Grid xs={12} md={6}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}><Typography fontWeight={700}>Logistics & IDs</Typography></Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Courier Provider</TableCell><TableCell>{getField(row, "courierProviderName", "CourierProviderName")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Channel</TableCell><TableCell>{getField(row, "channelName", "ChannelName")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Putaway Code</TableCell><TableCell>{getField(row, "putawayCode", "PutawayCode")}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Seller ID</TableCell><TableCell><Chip label={sellerId} color="primary" size="small" /></TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Customer ID</TableCell><TableCell><Chip label={customerId} color="secondary" size="small" /></TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell><TableCell>{row.createdDate? new Date(row.createdDate).toLocaleString("en-IN") : "—"}</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReversePickupView;
