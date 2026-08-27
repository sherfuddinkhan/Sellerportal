import ProductPriceToolbar from "../ProductPrices/ProductPriceToolbar";

import ProductPriceStatistics from "../ProductPrices/ProductPriceStatistics";

import ProductPriceSearch from "../ProductPrices/ProductPriceSearch";

import ProductPriceTable from "../ProductPrices/ProductPriceTable";

import ProductPricePagination from "../ProductPrices/ProductPricePagination";

import ProductPriceModal from "../ProductPrices/ProductPriceModal";

import DeleteProductPriceDialog from "../ProductPrices/DeleteProductPriceDialog";


const ProductPriceList = () => {
    const navigate = useNavigate();
    // ===========================
    // State
    // ===========================
    const [productPrices,setProductPrices] = useState([]);
    const [filteredProductPrices,setFilteredProductPrices] = useState([]);
    const [loading,setLoading] = useState(false);
    const [searchText,setSearchText] = useState("");
    const [statusFilter,setStatusFilter] = useState("All");
    const [priceTypeFilter,setPriceTypeFilter] = useState("");
    const [currencyFilter,setCurrencyFilter] = useState("");
    const [selectedProductPrice,setSelectedProductPrice] = useState(null);
    const [deleteOpen,setDeleteOpen] = useState(false);
    const [page,setPage] = useState(1);
    const [pageSize,setPageSize] = useState(10);
    // ===========================
    // Load Product Prices
    // ===========================
    const loadProductPrices = async () => {
        try {
            setLoading(true);
            const response =
                await apiService.getProductPrices();
            setProductPrices(
                response.data
            );
            setFilteredProductPrices(
                response.data
            );
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };
    // ===========================
    // Initial Load
    // ===========================
    useEffect(() => {
        loadProductPrices();
    }, []);
    // ===========================
    // Search & Filter
    // ===========================
    useEffect(() => {
        let result = [...productPrices];
        if (searchText.trim() !== "") {
            const search = searchText.toLowerCase();
result = result.filter(item => item.PriceType ?.toLowerCase() .includes(search) || String(item.ProductId).includes(search)||String(item.SellerId).includes(search)
                    || String(item.Price).includes(search) ||item.Currency ?.toLowerCase() .includes(search));
        }
        if (statusFilter !== "All") {
            result = result.filter(item =>statusFilter === "Active"? item.IsActive : !item.IsActive);
        }
        if (priceTypeFilter !== "") {
            result = result.filter(item =>item.PriceType === priceTypeFilter);
        }
        if (currencyFilter !== "") {
            result =result.filter(item =>item.Currency ===currencyFilter);
        }
        setFilteredProductPrices(result);
        setPage(1);
    }, [
        productPrices,
        searchText,
        statusFilter,
        priceTypeFilter,
        currencyFilter
    ]);
    // ===========================
    // Pagination
    // ===========================
    const totalPages = Math.ceil(filteredProductPrices.length /pageSize);
    const pagedProductPrices = filteredProductPrices.slice((page - 1) * pageSize,page * pageSize);
    // ===========================
    // Save Product Price
    // ===========================
    const handleSave = async (data) => {
        try {
            if (data.ProductPriceId) {
                await apiService.updateProductPrice(
                    data.ProductPriceId,
                    data
                );
            }
            else {
                await apiService.createProductPrice(
                    data
                );
            }
            loadProductPrices();
            setSelectedProductPrice(null);
        }
        catch(err) {console.log(err);}
    };
    // ===========================
    // Delete Product Price
    // ===========================
    const handleDelete = async(id) => {
        try {
            await apiService.deleteProductPrice(
                id
            );
            loadProductPrices();
        }
        catch(err) {
            console.log(err);
        }
    };
    return (
        <Box
            sx={{
                p:3
            }}
        >
            <ProductPriceToolbar
                onAdd={() =>
                    setSelectedProductPrice({})
                }
                onRefresh={loadProductPrices}
                onExport={() =>
                    console.log("Export Product Prices")
                }
            />
            <ProductPriceStatistics
                productPrices={productPrices}
            />
            <ProductPriceSearch
                searchText={searchText}
                setSearchText={setSearchText}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priceTypeFilter={priceTypeFilter}
                setPriceTypeFilter={setPriceTypeFilter}
                currencyFilter={currencyFilter}
                setCurrencyFilter={setCurrencyFilter}
                productPrices={productPrices}
            />
            <ProductPriceTable
                productPrices={pagedProductPrices}
                loading={loading}
                onView={(row)=>setSelectedProductPrice(row)}
                onEdit={(row)=> setSelectedProductPrice(row)}
                onDelete={(row)=>{setSelectedProductPrice(row);
                setDeleteOpen(true);
                }}
            />
            <ProductPricePagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={filteredProductPrices.length}
                onPageChange={setPage}
                onPageSizeChange={(size)=>{setPageSize(size);
                setPage(1);
                }}
            />
            <ProductPriceModal
                open={Boolean(selectedProductPrice)}
                productPrice={selectedProductPrice}
                onClose={()=>
                    setSelectedProductPrice(null)
                }
                onSave={handleSave}
            />
            <DeleteProductPriceDialog
                open={deleteOpen}
                productPrice={selectedProductPrice}
                onClose={()=>{
                    setDeleteOpen(false);
                    setSelectedProductPrice(null);
                }}
                onDeleted={handleDelete}
            />
        </Box>
    );
};


export default ProductPriceList;