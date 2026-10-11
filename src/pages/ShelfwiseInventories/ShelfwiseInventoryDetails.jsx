import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Alert } from "@mui/material";
import ShelfwiseInventoryView from "./ShelfwiseInventoryView";

const API_URL = "http://localhost:5000/api/ShelfwiseInventory";

const ShelfwiseInventoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOne = async () => {
            try {
                // /all returns all, find by id
                const res = await axios.get(`${API_URL}/all`);
                const all = res.data?.data || res.data?.Data || res.data || [];
                const found = all.find(r =>
                    String(r.shelfwiseInventoryId || r.ShelfwiseInventoryId || r.id) === String(id)
                );
                if (found) setData(found);
                else {
                    // fallback: try list endpoint
                    const listRes = await axios.post(`${API_URL}/list`, { pageSize: 1000 });
                    const listAll = listRes.data?.data || listRes.data || [];
                    setData(listAll.find(r => String(r.shelfwiseInventoryId||r.id)===String(id)));
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOne();
    }, [id]);

    if (loading) return <Box sx={{p:8,display:"flex",justifyContent:"center"}}><CircularProgress/></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!data) return <Alert severity="warning">Record {id} not found in /all</Alert>;

    return <ShelfwiseInventoryView open={true} inventory={data} onClose={() => navigate("/shelfwise-inventories")} />;
};

export default ShelfwiseInventoryDetails;