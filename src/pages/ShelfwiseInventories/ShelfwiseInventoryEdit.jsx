import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Alert } from "@mui/material";
import ShelfwiseInventoryForm from "./ShelfwiseInventoryForm";

const API_URL = "http://localhost:5000/api/ShelfwiseInventory";

const ShelfwiseInventoryEdit= () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/all`).then(res => {
            const all = res.data?.data || res.data || [];
            setData(all.find(r => String(r.shelfwiseInventoryId||r.id)===String(id)));
        }).finally(()=>setLoading(false));
    }, [id]);

    const handleUpdate = async (formData) => {
        const sellerId = formData.sellerId || data.sellerId || data.SellerId;
        const customerId = formData.customerId || data.customerId || data.CustomerId;

        await axios.put(
            `${API_URL}/${encodeURIComponent(id)}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`,
            formData
        );
        navigate("/shelfwise-inventories");
    };

    if (loading) return <Box sx={{p:8,display:"flex",justifyContent:"center"}}><CircularProgress/></Box>;
    if (!data) return <Alert severity="warning">Record {id} not found</Alert>;

    return (
        <Box sx={{p:3, maxWidth:900, mx:"auto"}}>
            <ShelfwiseInventoryForm
                inventory={data}
                mode="edit"
                onSubmit={handleUpdate}
                onCancel={()=>navigate("/shelfwise-inventories")}
            />
        </Box>
    );
};
export default ShelfwiseInventoryEdit;
