import React, {useEffect,useMemo,useState} from "react";
import {Box,Grid,Typography,CircularProgress,Snackbar,Alert} from "@mui/material";

import CategoryToolbar from "./CategoryToolbar";
import CategoryStatistics from "./CategoryStatistics";
import CategorySearch from "./CategorySearch";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import CategoryPagination from "./CategoryPagination";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import CategoryModal from "./CategoryModal";
const CategoryList = () => {

    const [categories, setCategories] = useState([]);

    const [filteredCategories, setFilteredCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {

        loadCategories();

    }, []);

    useEffect(() => {

        let result = [...categories];

        if (searchText !== "") {

            result = result.filter(x =>

                x.categoryName
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

        setFilteredCategories(result);

    }, [categories, searchText, statusFilter]);

    const loadCategories = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getCategories();

            setCategories(response.data);

            setFilteredCategories(response.data);

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
<CategoryToolbar

    onAdd={() => navigate("/categories/create")}

    onRefresh={loadCategories}

    onExport={() => {

        console.log("Export Categories");

    }}

/>

            <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
            >

                <Grid item xs={12}>

                    <CategoryStatistics
                        categories={categories}
                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <CategorySearch

                        searchText={searchText}

                        setSearchText={setSearchText}

                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <CategoryFilters

                        statusFilter={statusFilter}

                        setStatusFilter={setStatusFilter}

                    />

                </Grid>

                <Grid item xs={12}>

                    <Paper sx={{ p: 2 }}>

                        <CategoryTable

                            categories={filteredCategories.slice(

                                page * rowsPerPage,

                                page * rowsPerPage + rowsPerPage

                            )}

                            loading={loading}

                            onView={(row) => {

                                setSelectedCategory(row);

                                setViewOpen(true);

                            }}

                            onDelete={(row) => {

                                setSelectedCategory(row);

                                setDeleteOpen(true);

                            }}

                        />

                        <CategoryPagination

                            page={page}

                            rowsPerPage={rowsPerPage}

                            totalRecords={filteredCategories.length}

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

            <DeleteCategoryDialog

                open={deleteOpen}

                category={selectedCategory}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedCategory(null);

                }}

                onDeleted={loadCategories}

            />

            <CategoryModal

                open={viewOpen}

                category={selectedCategory}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedCategory(null);

                }}

            />

        </Box>

    );

};

export default CategoryList;