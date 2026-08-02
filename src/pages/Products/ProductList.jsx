const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [brandFilter, setBrandFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [productTypeFilter, setProductTypeFilter] = useState("");
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        const response = await apiService.getProducts();

        setProducts(response.data);

        setFilteredProducts(response.data);

    };

    return (

        <Box>

            <ProductToolbar />

            <ProductStatistics />

            <ProductSearch />

            <ProductFilters />

            <ProductTable />

            <ProductPagination />

            <ProductModal />

            <DeleteProductDialog />

        </Box>

    );

};