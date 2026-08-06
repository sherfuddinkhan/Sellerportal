import React, {useEffect,useMemo,useState} from "react";
import { Box,Typography,CircularProgress,Snackbar,Alert} from "@mui/material";

import ProductTypeToolbar from "./ProductTypeToolbar";
import ProductTypeStatistics from "./ProductTypeStatistics";
import ProductTypeSearch from "./ProductTypeSearch";
import ProductTypeFilters from "./ProductTypeFilters";
import ProductTypeTable from "./ProductTypeTable";
import ProductTypePagination from "./ProductTypePagination";
import ProductTypeModal from "./ProductTypeModal";
import DeleteProductTypeDialog from "./DeleteProductTypeDialog";



const ProductTypeList = () => {

    const navigate = useNavigate();

    const [productTypes, setProductTypes] = useState([]);

    const [filteredProductTypes, setFilteredProductTypes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedProductType, setSelectedProductType] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {

        loadProductTypes();

    }, []);

    useEffect(() => {

        let result = [...productTypes];

        if (searchText !== "") {

            result = result.filter(x =>

                x.productTypeName

                    ?.toLowerCase()

                    .includes(searchText.toLowerCase())

            );

        }

        if (statusFilter !== "All") {

            const active = statusFilter === "Active";

            result = result.filter(x =>

                x.isActive === active

            );

        }

        setFilteredProductTypes(result);

    }, [productTypes, searchText, statusFilter]);

    const loadProductTypes = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getProductTypes();

            setProductTypes(response.data);

            setFilteredProductTypes(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <Box>

            <ProductTypeToolbar

                onAdd={() =>

                    navigate("/product-types/create")

                }

                onRefresh={loadProductTypes}

            />

            <Grid container spacing={2}>

                <Grid item xs={12}>

                    <ProductTypeStatistics

                        productTypes={productTypes}

                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <ProductTypeSearch

                        searchText={searchText}

                        setSearchText={setSearchText}

                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <ProductTypeFilters

                        statusFilter={statusFilter}

                        setStatusFilter={setStatusFilter}

                    />

                </Grid>

                <Grid item xs={12}>

                    <Paper sx={{ p: 2 }}>

                        <ProductTypeTable

                            productTypes={

                                filteredProductTypes.slice(

                                    page * rowsPerPage,

                                    page * rowsPerPage + rowsPerPage

                                )

                            }

                            loading={loading}

                            onView={(row) => {

                                setSelectedProductType(row);

                                setViewOpen(true);

                            }}

                            onEdit={(row) =>

                                navigate(

                                    `/product-types/edit/${row.productTypeId}`

                                )

                            }

                            onDelete={(row) => {

                                setSelectedProductType(row);

                                setDeleteOpen(true);

                            }}

                        />

                        <ProductTypePagination

                            page={page}

                            rowsPerPage={rowsPerPage}

                            totalRecords={filteredProductTypes.length}

                            onPageChange={(e, newPage) =>

                                setPage(newPage)

                            }

                            onRowsPerPageChange={(e) => {

                                setRowsPerPage(

                                    parseInt(e.target.value, 10)

                                );

                                setPage(0);

                            }}

                        />

                    </Paper>

                </Grid>

            </Grid>

            <ProductTypeModal

                open={viewOpen}

                productType={selectedProductType}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedProductType(null);

                }}

            />

            <DeleteProductTypeDialog

                open={deleteOpen}

                productType={selectedProductType}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedProductType(null);

                }}

                onDeleted={loadProductTypes}

            />

        </Box>

    );

};

export default ProductTypeList;