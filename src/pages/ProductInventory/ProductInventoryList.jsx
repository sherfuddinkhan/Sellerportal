import React, {useEffect,useMemo,useState} from "react";
import {Box,Grid,Typography,CircularProgress,Snackbar,Alert} from "@mui/material";
import ProductInventoryToolbar from "./ProductInventoryToolbar";
import ProductInventoryStatistics from "./ProductInventoryStatistics";
import ProductInventorySearch from "./ProductInventorySearch";
import ProductInventoryFilters from "./ProductInventoryFilters";
import ProductInventoryTable from "./ProductInventoryTable";
import ProductInventoryPagination from "./ProductInventoryPagination";
import ProductInventoryModal from "./ProductInventoryModal";
import ProductInventoryView from "./ProductInventoryView";
import DeleteProductInventoryDialog from "./DeleteProductInventoryDialog";



const ProductInventoryList = () => {

    // ===========================
    // State
    // ===========================
    const [inventories,setInventories] = useState([]);
    const [filteredInventories,setFilteredInventories] = useState([]);
    const [loading,setLoading] = useState(false);
    const [searchText,setSearchText] = useState("");
    const [stockStatusFilter,setStockStatusFilter] = useState("");
    const [warehouseFilter,setWarehouseFilter] = useState("");
    const [statusFilter,setStatusFilter] = useState("All");
    const [quantityFilter,setQuantityFilter] = useState("");
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [modalOpen,setModalOpen] = useState(false);
    const [viewOpen,setViewOpen] = useState(false);
    const [deleteOpen,setDeleteOpen] = useState(false);
    const [page,setPage] = useState(1);
    const [pageSize,setPageSize] = useState(10);

    // ===========================
    // Load Inventory
    // ===========================

    const loadInventories = async () => {
        try {
            setLoading(true);
            const response = await apiService.getInventories();
            setInventories(response.data);
            setFilteredInventories(response.data);
        }
        catch(err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        loadInventories();
    },[]);

    // ===========================
    // Search & Filters
    // ===========================

    useEffect(()=>{
        let result = [
            ...inventories
        ];
        if(searchText.trim() !== ""){
            const search = searchText.toLowerCase();
            result = result.filter(item =>
                    String(
                        item.ProductId
                    )
                    .includes(search)



                    ||

                    String(
                        item.SellerId
                    )
                    .includes(search)



                    ||

                    String(
                        item.WarehouseId
                    )
                    .includes(search)
                    ||
                    item.StockStatus
                        ?.toLowerCase()
                        .includes(search)
                );
        }
        if(statusFilter !== "All"){
            result = result.filter(item => statusFilter === "Active" ? item.IsActive :!item.IsActive);
        }
        if(stockStatusFilter !== ""){
            result = result.filter(item => item.StockStatus === stockStatusFilter);
        }
        if(warehouseFilter !== ""){
            result = result.filter(item =>
                    String(item.WarehouseId)
                    ===
                    String(warehouseFilter)
                );
        }
        if(quantityFilter !== ""){
            result = result.filter(item=>{
                    const available =
                        Number(
                            item.AvailableQuantity || 0
                        );
                    const reorder =
                        Number(item.ReorderLevel || 0);



                    if(quantityFilter === "out")

                        return available === 0;



                    if(quantityFilter === "low")

                        return available <= reorder;



                    if(quantityFilter === "available")

                        return available > reorder;



                    return true;


                });


        }





        setFilteredInventories(result);



        setPage(1);



    },[

        inventories,

        searchText,

        statusFilter,

        stockStatusFilter,

        warehouseFilter,

        quantityFilter

    ]);







    // ===========================
    // Pagination
    // ===========================



    const totalPages =

        Math.ceil(

            filteredInventories.length /

            pageSize

        );




    const pagedInventories =

        filteredInventories.slice(

            (page - 1) * pageSize,

            page * pageSize

        );







    // ===========================
    // Save
    // ===========================



    const handleSave = async(data)=>{


        try{


            if(data.ProductInventoryId){


                await apiService.updateInventory(

                    data.ProductInventoryId,

                    data

                );


            }

            else{


                await apiService.createInventory(

                    data

                );


            }



            loadInventories();



            setModalOpen(false);



        }

        catch(err){


            console.log(err);


        }


    };







    // ===========================
    // Delete
    // ===========================



    const handleDelete = async(id)=>{


        try{


            await apiService.deleteInventory(id);



            loadInventories();



            setDeleteOpen(false);



        }

        catch(err){


            console.log(err);


        }


    };







    return (



        <Box

            sx={{

                p:3

            }}

        >




            <ProductInventoryToolbar



                onAdd={()=>{


                    setSelectedInventory(null);


                    setModalOpen(true);


                }}



                onRefresh={loadInventories}



                onExport={()=>


                    console.log(
                        "Export Inventory"
                    )


                }



            />





            <ProductInventoryStatistics


                inventories={inventories}


            />





            <ProductInventorySearch



                searchText={searchText}



                setSearchText={setSearchText}



                stockStatusFilter={stockStatusFilter}



                setStockStatusFilter={setStockStatusFilter}



                warehouseFilter={warehouseFilter}



                setWarehouseFilter={setWarehouseFilter}



                inventories={inventories}



            />





            <ProductInventoryFilters



                statusFilter={statusFilter}



                setStatusFilter={setStatusFilter}



                quantityFilter={quantityFilter}



                setQuantityFilter={setQuantityFilter}



                inventories={inventories}



            />







            <ProductInventoryTable



                inventories={pagedInventories}



                loading={loading}



                onView={(row)=>{


                    setSelectedInventory(row);


                    setViewOpen(true);


                }}



                onEdit={(row)=>{


                    setSelectedInventory(row);


                    setModalOpen(true);


                }}



                onDelete={(row)=>{


                    setSelectedInventory(row);


                    setDeleteOpen(true);


                }}



            />







            <ProductInventoryPagination



                page={page}



                totalPages={totalPages}



                pageSize={pageSize}



                totalRecords={filteredInventories.length}



                onPageChange={setPage}



                onPageSizeChange={(size)=>{


                    setPageSize(size);


                    setPage(1);


                }}



            />







            <ProductInventoryModal



                open={modalOpen}



                inventory={selectedInventory}



                onClose={()=>setModalOpen(false)}



                onSave={handleSave}



            />







            <ProductInventoryView



                open={viewOpen}



                inventory={selectedInventory}



                onClose={()=>setViewOpen(false)}



            />







            <DeleteProductInventoryDialog



                open={deleteOpen}



                inventory={selectedInventory}



                onClose={()=>setDeleteOpen(false)}



                onDeleted={handleDelete}



            />





        </Box>



    );


};



export default ProductInventoryList;