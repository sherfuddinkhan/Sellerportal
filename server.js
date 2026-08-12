import sql from "mssql/msnodesqlv8.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dbConfig = {
  connectionString:
    "Driver={ODBC Driver 18 for SQL Server};" +
    "Server=tcp:DESKTOP-BUGKGO7,1433;" +
    "Database=SellerPortalDB;" +
    "Trusted_Connection=Yes;" +
    "TrustServerCertificate=Yes;",
};

console.log("SQL CONFIG:", {
  server: "DESKTOP-BUGKGO7",
  port: 1433,
  database: "SellerPortalDB",
  driver: "ODBC Driver 18 for SQL Server",
  authentication: "Windows Authentication",
});

try {
  await sql.connect(dbConfig);

  console.log("======================================");
  console.log("✅ SQL SERVER CONNECTED");
  console.log("======================================");
} catch (error) {
  console.error("======================================");
  console.error("❌ SQL SERVER CONNECTION ERROR");
  console.error("======================================");
  console.error(error);
}
/* =====================================================
1. AUTHENTICATION
===================================================== */
const BASE_URL = "https://localhost:5000/api";
// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/login`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Login failed" }
        );
    }
});

// Register
app.post("/api/auth/register", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/register`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(201).json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Registration failed" }
        );
    }
});

// Logout
app.post("/api/auth/logout", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/logout`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Logout failed" }
        );
    }
});

// Forgot Password
app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/forgot-password`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Forgot password failed" }
        );
    }
});

// Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/reset-password`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Reset password failed" }
        );
    }
});

// Change Password
app.post("/api/auth/change-password", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/change-password`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Change password failed" }
        );
    }
});

// Current User
app.get("/api/auth/me", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/auth/me`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Failed to get user" }
        );
    }
});

// Update Profile
app.put("/api/auth/profile", async (req, res) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/auth/profile`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Profile update failed" }
        );
    }
});

// Refresh Token
app.post("/api/auth/refresh-token", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Refresh token failed" }
        );
    }
});

/* =====================================================
2. DASHBOARD
===================================================== */

// Dashboard Summary
app.get("/api/dashboard/summary", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/dashboard/summary`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch dashboard summary",
            }
        );
    }
});

// Dashboard Statistics
app.get("/api/dashboard/statistics", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/dashboard/statistics`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch dashboard statistics",
            }
        );
    }
});

// Inventory Chart
app.get("/api/dashboard/inventory-chart", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/dashboard/inventory-chart`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch inventory chart",
            }
        );
    }
});

// Order Chart
app.get("/api/dashboard/order-chart", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/dashboard/order-chart`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch order chart",
            }
        );
    }
});

// Low Stock Products
app.get("/api/dashboard/low-stock-products", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/dashboard/low-stock-products`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch low stock products",
            }
        );
    }
});

/* =====================================================
3. BRAND
===================================================== */

// Get All Brands
app.get("/api/brand", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/brand`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch brands",
            }
        );
    }
});

// Get Brand By Id
app.get("/api/brand/:id", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/brand/${req.params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch brand",
            }
        );
    }
});

// Create Brand
app.post("/api/brand", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/brand`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(201).json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to create brand",
            }
        );
    }
});

// Update Brand
app.put("/api/brand/:id", async (req, res) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/brand/${req.params.id}`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to update brand",
            }
        );
    }
});

// Delete Brand
app.delete("/api/brand/:id", async (req, res) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/brand/${req.params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to delete brand",
            }
        );
    }
});

// Brand Statistics
app.get("/api/brand/statistics", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/brand/statistics`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch brand statistics",
            }
        );
    }
});

// Search Brands
app.get("/api/brand/search", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/brand/search`,
            {
                params: req.query,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to search brands",
            }
        );
    }
});

/* =====================================================
4. CATEGORY APIs
===================================================== */

// ======================================
// Get All Categories
// GET: /api/category
// ======================================
app.get("/api/category", async (req, res) => {

    try {

        // TODO:
        // Get All Categories

        res.json({
            success: true,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});


// ======================================
// Get Category By Id
// GET: /api/category/:id
// ======================================
app.get("/api/category/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Get Category By Id

        res.json({
            success: true,
            data: {
                id: id
            }
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});


// ======================================
// Create Category
// POST: /api/category
// ======================================
app.post("/api/category", async (req, res) => {

    try {

        const {

            categoryName,
            description,
            parentCategoryId,
            isActive

        } = req.body;

        // TODO:
        // Create Category

        res.status(201).json({

            success: true,
            message: "Category Created Successfully",

            data: {

                categoryName,
                description,
                parentCategoryId,
                isActive

            }

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Update Category
// PUT: /api/category/:id
// ======================================
app.put("/api/category/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {

            categoryName,
            description,
            parentCategoryId,
            isActive

        } = req.body;

        // TODO:
        // Update Category

        res.json({

            success: true,
            message: "Category Updated Successfully",

            data: {

                id,
                categoryName,
                description,
                parentCategoryId,
                isActive

            }

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Delete Category
// DELETE: /api/category/:id
// ======================================
app.delete("/api/category/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete Category

        res.json({

            success: true,
            message: `Category ${id} Deleted Successfully`

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Search Categories
// GET: /api/category/search
// ======================================
app.get("/api/category/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search Categories

        res.json({

            success: true,

            searchText,

            data: []

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Category Statistics
// GET: /api/category/statistics
// ======================================
app.get("/api/category/statistics", async (req, res) => {

    try {

        // TODO:
        // Category Statistics

        res.json({

            success: true,

            statistics: {

                totalCategories: 0,
                activeCategories: 0,
                inactiveCategories: 0,
                parentCategories: 0

            }

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});
/* =====================================================
5. PRODUCT TYPE APIs
===================================================== */

// ======================================
// Get All Product Types
// GET: /api/producttype
// ======================================
app.get("/api/producttype", async (req, res) => {

    try {

        // TODO:
        // Get All Product Types

        res.json({
            success: true,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});


// ======================================
// Get Product Type By Id
// GET: /api/producttype/:id
// ======================================
app.get("/api/producttype/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Get Product Type By Id

        res.json({
            success: true,
            data: {
                id
            }
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});


// ======================================
// Create Product Type
// POST: /api/producttype
// ======================================
app.post("/api/producttype", async (req, res) => {

    try {

        const {

            productTypeName,
            description,
            isActive

        } = req.body;

        // TODO:
        // Create Product Type

        res.status(201).json({

            success: true,
            message: "Product Type Created Successfully",

            data: {

                productTypeName,
                description,
                isActive

            }

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Update Product Type
// PUT: /api/producttype/:id
// ======================================
app.put("/api/producttype/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {

            productTypeName,
            description,
            isActive

        } = req.body;

        // TODO:
        // Update Product Type

        res.json({

            success: true,
            message: "Product Type Updated Successfully",

            data: {

                id,
                productTypeName,
                description,
                isActive

            }

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Delete Product Type
// DELETE: /api/producttype/:id
// ======================================
app.delete("/api/producttype/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete Product Type

        res.json({

            success: true,
            message: `Product Type ${id} Deleted Successfully`

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Product Type Statistics
// GET: /api/producttype/statistics
// ======================================
app.get("/api/producttype/statistics", async (req, res) => {

    try {

        // TODO:
        // Get Product Type Statistics

        res.json({

            success: true,

            statistics: {

                totalProductTypes: 0,
                activeProductTypes: 0,
                inactiveProductTypes: 0

            }

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ======================================
// Search Product Types
// GET: /api/producttype/search
// ======================================
app.get("/api/producttype/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search Product Types

        res.json({

            success: true,

            searchText,

            data: []

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});
/* =====================================================
6. PRODUCT
===================================================== */

// Get All Products
app.get("/api/product", async (req, res) => {
    try {
        // TODO:
        // Fetch all products

        res.json({
            success: true,
            message: "Get all products API",
            data: []
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
});

// Get Product By Id
app.get("/api/product/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch product by id

        res.json({
            success: true,
            message: "Get product by id API",
            productId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });

    }
});

// Create Product
app.post("/api/product", async (req, res) => {

    try {

        const product = req.body;

        // TODO:
        // Save Product

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create product"
        });

    }

});

// Update Product
app.put("/api/product/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const product = req.body;

        // TODO:
        // Update Product

        res.json({
            success: true,
            message: "Product updated successfully",
            productId: id,
            data: product
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update product"
        });

    }

});

// Delete Product
app.delete("/api/product/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete Product

        res.json({
            success: true,
            message: "Product deleted successfully",
            productId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });

    }

});

// Product Statistics
app.get("/api/product/statistics", async (req, res) => {

    try {

        // TODO:
        // Product Statistics

        res.json({
            success: true,
            message: "Product statistics API",
            data: {}
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product statistics"
        });

    }

});

// Search Products
app.get("/api/product/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search Product

        res.json({
            success: true,
            message: "Search products API",
            searchText,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to search products"
        });

    }

});

/* =====================================================
7. PRODUCT PRICE
===================================================== */

// Get All Product Prices
app.get("/api/productprice", async (req, res) => {

    try {

        // TODO:
        // Fetch all product prices

        res.json({
            success: true,
            message: "Get all product prices API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product prices"
        });

    }

});


// Get Product Price By Id
app.get("/api/productprice/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Fetch product price by id


        res.json({
            success: true,
            message: "Get product price by id API",
            productPriceId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product price"
        });

    }

});


// Create Product Price
app.post("/api/productprice", async (req, res) => {

    try {

        const productPrice = req.body;

        // TODO:
        // Save Product Price


        res.status(201).json({

            success: true,
            message: "Product price created successfully",
            data: productPrice

        });

    }
    catch (err) {

        console.error(err);


        res.status(500).json({

            success: false,
            message: "Failed to create product price"

        });

    }

});


// Update Product Price
app.put("/api/productprice/:id", async (req, res) => {


    try {


        const { id } = req.params;

        const productPrice = req.body;


        // TODO:
        // Update Product Price


        res.json({

            success: true,
            message: "Product price updated successfully",
            productPriceId: id,
            data: productPrice

        });


    }
    catch(err){

        console.error(err);


        res.status(500).json({

            success:false,
            message:"Failed to update product price"

        });

    }


});



// Delete Product Price
app.delete("/api/productprice/:id", async (req,res)=>{


    try{


        const { id } = req.params;


        // TODO:
        // Delete Product Price



        res.json({

            success:true,
            message:"Product price deleted successfully",
            productPriceId:id

        });


    }
    catch(err){


        console.error(err);


        res.status(500).json({

            success:false,
            message:"Failed to delete product price"

        });


    }


});



// Product Price Statistics
app.get("/api/productprice/statistics", async(req,res)=>{


    try{


        // TODO:
        // Product Price Statistics


        res.json({

            success:true,
            message:"Product price statistics API",
            data:{}

        });


    }
    catch(err){


        console.error(err);


        res.status(500).json({

            success:false,
            message:"Failed to fetch product price statistics"

        });


    }


});



// Search Product Prices
app.get("/api/productprice/search", async(req,res)=>{


    try{
        const { searchText } = req.query;
        // TODO:
        // Search Product Prices
        res.json({

            success:true,
            message:"Search product prices API",
            searchText,
            data:[]

        });


    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Failed to search product prices"

        });


    }


});

/* =====================================================
8. INVENTORY
===================================================== */

// Get All Inventory
app.get("/api/inventory", async (req, res) => {

    try {

        // TODO:
        // Fetch all inventory

        res.json({
            success: true,
            message: "Get all inventory API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch inventory"
        });

    }

});

// Get Inventory By Id
app.get("/api/inventory/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Fetch inventory by id

        res.json({
            success: true,
            message: "Get inventory by id API",
            inventoryId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch inventory"
        });

    }

});

// Create Inventory
app.post("/api/inventory", async (req, res) => {

    try {

        const inventory = req.body;

        // TODO:
        // Save inventory

        res.status(201).json({
            success: true,
            message: "Inventory created successfully",
            data: inventory
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create inventory"
        });

    }

});

// Update Inventory
app.put("/api/inventory/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const inventory = req.body;

        // TODO:
        // Update inventory

        res.json({
            success: true,
            message: "Inventory updated successfully",
            inventoryId: id,
            data: inventory
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update inventory"
        });

    }

});

// Delete Inventory
app.delete("/api/inventory/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete inventory

        res.json({
            success: true,
            message: "Inventory deleted successfully",
            inventoryId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete inventory"
        });

    }

});

// Low Stock Inventory
app.get("/api/inventory/low-stock", async (req, res) => {

    try {

        // TODO:
        // Fetch low stock inventory

        res.json({
            success: true,
            message: "Low stock inventory API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch low stock inventory"
        });

    }

});

// Inventory Statistics
app.get("/api/inventory/statistics", async (req, res) => {

    try {

        // TODO:
        // Inventory statistics

        res.json({
            success: true,
            message: "Inventory statistics API",
            data: {}
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch inventory statistics"
        });

    }

});

// Search Inventory
app.get("/api/inventory/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search inventory

        res.json({
            success: true,
            message: "Search inventory API",
            searchText,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to search inventory"
        });

    }

});
/* =====================================================
9. CUSTOMER PAYMENT
===================================================== */

// Get All Customer Payments
app.get("/api/customerpayment", async (req, res) => {

    try {

        // TODO:
        // Fetch all customer payments

        res.json({
            success: true,
            message: "Get all customer payments API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer payments"
        });

    }

});


// Get Customer Payment By Id
app.get("/api/customerpayment/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Fetch customer payment by id

        res.json({
            success: true,
            message: "Get customer payment by id API",
            customerPaymentId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer payment"
        });

    }

});


// Create Customer Payment
app.post("/api/customerpayment", async (req, res) => {

    try {

        const payment = req.body;

        // TODO:
        // Save customer payment

        res.status(201).json({
            success: true,
            message: "Customer payment created successfully",
            data: payment
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create customer payment"
        });

    }

});


// Update Customer Payment
app.put("/api/customerpayment/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const payment = req.body;

        // TODO:
        // Update customer payment

        res.json({
            success: true,
            message: "Customer payment updated successfully",
            customerPaymentId: id,
            data: payment
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update customer payment"
        });

    }

});


// Delete Customer Payment
app.delete("/api/customerpayment/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete customer payment

        res.json({
            success: true,
            message: "Customer payment deleted successfully",
            customerPaymentId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete customer payment"
        });

    }

});


// Customer Payment Statistics
app.get("/api/customerpayment/statistics", async (req, res) => {

    try {

        // TODO:
        // Customer payment statistics

        res.json({
            success: true,
            message: "Customer payment statistics API",
            data: {}
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer payment statistics"
        });

    }

});


// Search Customer Payments
app.get("/api/customerpayment/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search customer payments

        res.json({
            success: true,
            message: "Search customer payments API",
            searchText,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to search customer payments"
        });

    }

});
/* =====================================================
10. CUSTOMER RETURN
===================================================== */

// Get All Customer Returns
app.get("/api/customerreturn", async (req, res) => {

    try {

        // TODO:
        // Fetch all customer returns

        res.json({
            success: true,
            message: "Get all customer returns API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer returns"
        });

    }

});


// Get Customer Return By Id
app.get("/api/customerreturn/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Fetch customer return by id

        res.json({
            success: true,
            message: "Get customer return by id API",
            customerReturnId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer return"
        });

    }

});


// Create Customer Return
app.post("/api/customerreturn", async (req, res) => {

    try {

        const customerReturn = req.body;

        // TODO:
        // Save customer return

        res.status(201).json({
            success: true,
            message: "Customer return created successfully",
            data: customerReturn
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create customer return"
        });

    }

});


// Update Customer Return
app.put("/api/customerreturn/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const customerReturn = req.body;

        // TODO:
        // Update customer return

        res.json({
            success: true,
            message: "Customer return updated successfully",
            customerReturnId: id,
            data: customerReturn
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update customer return"
        });

    }

});


// Delete Customer Return
app.delete("/api/customerreturn/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete customer return

        res.json({
            success: true,
            message: "Customer return deleted successfully",
            customerReturnId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete customer return"
        });

    }

});


// Customer Return Statistics
app.get("/api/customerreturn/statistics", async (req, res) => {

    try {

        // TODO:
        // Customer return statistics

        res.json({
            success: true,
            message: "Customer return statistics API",
            data: {}
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer return statistics"
        });

    }

});


// Search Customer Returns
app.get("/api/customerreturn/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search customer returns

        res.json({
            success: true,
            message: "Search customer returns API",
            searchText,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to search customer returns"
        });

    }

});
/* =====================================================
11. ORDER
===================================================== */

// Get All Orders
app.get("/api/order", async (req, res) => {

    try {

        // TODO:
        // Fetch all orders

        res.json({
            success: true,
            message: "Get all orders API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });

    }

});


// Get Order By Id
app.get("/api/order/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Fetch order by id

        res.json({
            success: true,
            message: "Get order by id API",
            orderId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        });

    }

});


// Create Order
app.post("/api/order", async (req, res) => {

    try {

        const order = req.body;

        // TODO:
        // Save order

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });

    }

});


// Update Order
app.put("/api/order/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const order = req.body;

        // TODO:
        // Update order

        res.json({
            success: true,
            message: "Order updated successfully",
            orderId: id,
            data: order
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update order"
        });

    }

});


// Delete Order
app.delete("/api/order/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete order

        res.json({
            success: true,
            message: "Order deleted successfully",
            orderId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete order"
        });

    }

});


// Order Statistics
app.get("/api/order/statistics", async (req, res) => {

    try {

        // TODO:
        // Order statistics

        res.json({
            success: true,
            message: "Order statistics API",
            data: {}
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order statistics"
        });

    }

});


// Search Orders
app.get("/api/order/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search orders

        res.json({
            success: true,
            message: "Search orders API",
            searchText,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to search orders"
        });

    }

});
/* =====================================================
12. ORDER ITEM
===================================================== */

// Get All Order Items
app.get("/api/orderitem", async (req, res) => {

    try {

        // TODO:
        // Fetch all order items

        res.json({
            success: true,
            message: "Get all order items API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order items"
        });

    }

});


// Get Order Item By Id
app.get("/api/orderitem/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Fetch order item by id

        res.json({
            success: true,
            message: "Get order item by id API",
            orderItemId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order item"
        });

    }

});


// Create Order Item
app.post("/api/orderitem", async (req, res) => {

    try {

        const orderItem = req.body;

        // TODO:
        // Save order item

        res.status(201).json({
            success: true,
            message: "Order item created successfully",
            data: orderItem
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create order item"
        });

    }

});


// Update Order Item
app.put("/api/orderitem/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const orderItem = req.body;

        // TODO:
        // Update order item

        res.json({
            success: true,
            message: "Order item updated successfully",
            orderItemId: id,
            data: orderItem
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update order item"
        });

    }

});


// Delete Order Item
app.delete("/api/orderitem/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete order item

        res.json({
            success: true,
            message: "Order item deleted successfully",
            orderItemId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete order item"
        });

    }

});


// Order Item Statistics
app.get("/api/orderitem/statistics", async (req, res) => {

    try {

        // TODO:
        // Order item statistics

        res.json({
            success: true,
            message: "Order item statistics API",
            data: {}
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order item statistics"
        });

    }

});


// Search Order Items
app.get("/api/orderitem/search", async (req, res) => {

    try {

        const { searchText } = req.query;

        // TODO:
        // Search order items

        res.json({
            success: true,
            message: "Search order items API",
            searchText,
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to search order items"
        });

    }

});

/* =====================================================
13. ORDER STATUS HISTORY
===================================================== */

// Get All Order Status History
app.get("/api/orderstatushistory", async (req, res) => {

    try {

        // TODO:
        // Fetch all order status history

        res.json({
            success: true,
            message: "Get all order status history API",
            data: []
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order status history"
        });

    }

});


// Get Order Status History By Id
app.get("/api/orderstatushistory/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Fetch order status history by id

        res.json({
            success: true,
            message: "Get order status history by id API",
            orderStatusHistoryId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order status history"
        });

    }

});


// Create Order Status History
app.post("/api/orderstatushistory", async (req, res) => {

    try {

        const orderStatusHistory = req.body;

        // TODO:
        // Save order status history

        res.status(201).json({
            success: true,
            message: "Order status history created successfully",
            data: orderStatusHistory
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create order status history"
        });

    }

});


// Update Order Status History
app.put("/api/orderstatushistory/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const orderStatusHistory = req.body;

        // TODO:
        // Update order status history

        res.json({
            success: true,
            message: "Order status history updated successfully",
            orderStatusHistoryId: id,
            data: orderStatusHistory
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update order status history"
        });

    }

});


// Delete Order Status History
app.delete("/api/orderstatushistory/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // TODO:
        // Delete order status history

        res.json({
            success: true,
            message: "Order status history deleted successfully",
            orderStatusHistoryId: id
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete order status history"
        });

    }

});
/* =====================================================
14. SHIPMENT
===================================================== */

// ======================================================
// Get All Shipments
// ======================================================
app.get("/api/shipment", async (req, res) => {
    try {
        // TODO:
        // Fetch all shipments from database

        res.json({
            success: true,
            message: "Get all shipments API",
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Shipment By Id
// ======================================================
app.get("/api/shipment/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch shipment by id

        res.json({
            success: true,
            message: "Get shipment by id API",
            shipmentId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Create Shipment
// ======================================================
app.post("/api/shipment", async (req, res) => {
    try {

        const shipment = req.body;

        // TODO:
        // Save shipment

        res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            data: shipment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Update Shipment
// ======================================================
app.put("/api/shipment/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const shipment = req.body;

        // TODO:
        // Update shipment

        res.json({
            success: true,
            message: "Shipment updated successfully",
            shipmentId: id,
            data: shipment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Delete Shipment
// ======================================================
app.delete("/api/shipment/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Delete shipment

        res.json({
            success: true,
            message: "Shipment deleted successfully",
            shipmentId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Shipment Statistics
// ======================================================
app.get("/api/shipment/statistics", async (req, res) => {
    try {

        // TODO:
        // Shipment statistics

        res.json({
            success: true,
            message: "Shipment statistics API",
            data: {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Search Shipments
// ======================================================
app.get("/api/shipment/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // TODO:
        // Search shipment

        res.json({
            success: true,
            message: "Search shipment API",
            keyword: searchText,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
/* =====================================================
15. SALES ORDER
===================================================== */

// ======================================================
// Get All Sales Orders
// ======================================================
app.get("/api/salesorder", async (req, res) => {
    try {

        // TODO:
        // Fetch all sales orders

        res.json({
            success: true,
            message: "Get all sales orders API",
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Sales Order By Id
// ======================================================
app.get("/api/salesorder/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch sales order by id

        res.json({
            success: true,
            message: "Get sales order by id API",
            salesOrderId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Create Sales Order
// ======================================================
app.post("/api/salesorder", async (req, res) => {
    try {

        const salesOrder = req.body;

        // TODO:
        // Save sales order

        res.status(201).json({
            success: true,
            message: "Sales order created successfully",
            data: salesOrder
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Update Sales Order
// ======================================================
app.put("/api/salesorder/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const salesOrder = req.body;

        // TODO:
        // Update sales order

        res.json({
            success: true,
            message: "Sales order updated successfully",
            salesOrderId: id,
            data: salesOrder
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Delete Sales Order
// ======================================================
app.delete("/api/salesorder/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Delete sales order

        res.json({
            success: true,
            message: "Sales order deleted successfully",
            salesOrderId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Sales Order Statistics
// ======================================================
app.get("/api/salesorder/statistics", async (req, res) => {
    try {

        // TODO:
        // Sales order statistics

        res.json({
            success: true,
            message: "Sales order statistics API",
            data: {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Search Sales Orders
// ======================================================
app.get("/api/salesorder/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // TODO:
        // Search sales orders

        res.json({
            success: true,
            message: "Search sales orders API",
            keyword: searchText,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =====================================================
16. PURCHASE ORDER
===================================================== */

// ======================================================
// Get All Purchase Orders
// ======================================================
app.get("/api/purchaseorder", async (req, res) => {
    try {

        // TODO:
        // Fetch all purchase orders

        res.json({
            success: true,
            message: "Get all purchase orders API",
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Purchase Order By Id
// ======================================================
app.get("/api/purchaseorder/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch purchase order by id

        res.json({
            success: true,
            message: "Get purchase order by id API",
            purchaseOrderId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Create Purchase Order
// ======================================================
app.post("/api/purchaseorder", async (req, res) => {
    try {

        const purchaseOrder = req.body;

        // TODO:
        // Save purchase order

        res.status(201).json({
            success: true,
            message: "Purchase order created successfully",
            data: purchaseOrder
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Update Purchase Order
// ======================================================
app.put("/api/purchaseorder/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const purchaseOrder = req.body;

        // TODO:
        // Update purchase order

        res.json({
            success: true,
            message: "Purchase order updated successfully",
            purchaseOrderId: id,
            data: purchaseOrder
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Delete Purchase Order
// ======================================================
app.delete("/api/purchaseorder/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Delete purchase order

        res.json({
            success: true,
            message: "Purchase order deleted successfully",
            purchaseOrderId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Purchase Order Statistics
// ======================================================
app.get("/api/purchaseorder/statistics", async (req, res) => {
    try {

        // TODO:
        // Purchase order statistics

        res.json({
            success: true,
            message: "Purchase order statistics API",
            data: {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Search Purchase Orders
// ======================================================
app.get("/api/purchaseorder/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // TODO:
        // Search purchase orders

        res.json({
            success: true,
            message: "Search purchase orders API",
            keyword: searchText,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =====================================================
17. PURCHASE ORDER ITEM
===================================================== */

// ======================================================
// Get All Purchase Order Items
// ======================================================
app.get("/api/purchaseorderitem", async (req, res) => {
    try {

        // TODO:
        // Fetch all purchase order items

        res.json({
            success: true,
            message: "Get all purchase order items API",
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Purchase Order Item By Id
// ======================================================
app.get("/api/purchaseorderitem/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch purchase order item by id

        res.json({
            success: true,
            message: "Get purchase order item by id API",
            purchaseOrderItemId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Create Purchase Order Item
// ======================================================
app.post("/api/purchaseorderitem", async (req, res) => {
    try {

        const purchaseOrderItem = req.body;

        // TODO:
        // Save purchase order item

        res.status(201).json({
            success: true,
            message: "Purchase order item created successfully",
            data: purchaseOrderItem
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Update Purchase Order Item
// ======================================================
app.put("/api/purchaseorderitem/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const purchaseOrderItem = req.body;

        // TODO:
        // Update purchase order item

        res.json({
            success: true,
            message: "Purchase order item updated successfully",
            purchaseOrderItemId: id,
            data: purchaseOrderItem
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Delete Purchase Order Item
// ======================================================
app.delete("/api/purchaseorderitem/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Delete purchase order item

        res.json({
            success: true,
            message: "Purchase order item deleted successfully",
            purchaseOrderItemId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Purchase Order Item Statistics
// ======================================================
app.get("/api/purchaseorderitem/statistics", async (req, res) => {
    try {

        // TODO:
        // Purchase order item statistics

        res.json({
            success: true,
            message: "Purchase order item statistics API",
            data: {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Search Purchase Order Items
// ======================================================
app.get("/api/purchaseorderitem/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // TODO:
        // Search purchase order items

        res.json({
            success: true,
            message: "Search purchase order items API",
            keyword: searchText,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
/* =====================================================
18. GOODS RECEIPT NOTE (GRN)
===================================================== */

// ======================================================
// Get All Goods Receipt Notes
// ======================================================
app.get("/api/goodsreceiptnote", async (req, res) => {
    try {

        // TODO:
        // Fetch all Goods Receipt Notes

        res.json({
            success: true,
            message: "Get all Goods Receipt Notes API",
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Goods Receipt Note By Id
// ======================================================
app.get("/api/goodsreceiptnote/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch Goods Receipt Note by Id

        res.json({
            success: true,
            message: "Get Goods Receipt Note by Id API",
            goodsReceiptNoteId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Create Goods Receipt Note
// ======================================================
app.post("/api/goodsreceiptnote", async (req, res) => {
    try {

        const goodsReceiptNote = req.body;

        // TODO:
        // Save Goods Receipt Note

        res.status(201).json({
            success: true,
            message: "Goods Receipt Note created successfully",
            data: goodsReceiptNote
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Update Goods Receipt Note
// ======================================================
app.put("/api/goodsreceiptnote/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const goodsReceiptNote = req.body;

        // TODO:
        // Update Goods Receipt Note

        res.json({
            success: true,
            message: "Goods Receipt Note updated successfully",
            goodsReceiptNoteId: id,
            data: goodsReceiptNote
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Delete Goods Receipt Note
// ======================================================
app.delete("/api/goodsreceiptnote/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Delete Goods Receipt Note

        res.json({
            success: true,
            message: "Goods Receipt Note deleted successfully",
            goodsReceiptNoteId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Goods Receipt Note Statistics
// ======================================================
app.get("/api/goodsreceiptnote/statistics", async (req, res) => {
    try {

        // TODO:
        // Goods Receipt Note Statistics

        res.json({
            success: true,
            message: "Goods Receipt Note Statistics API",
            data: {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Search Goods Receipt Notes
// ======================================================
app.get("/api/goodsreceiptnote/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // TODO:
        // Search Goods Receipt Notes

        res.json({
            success: true,
            message: "Search Goods Receipt Notes API",
            keyword: searchText,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});




/* =====================================================
19. GOODS RECEIPT NOTE ITEM (GRN ITEM)
===================================================== */

// ======================================================
// Get All Goods Receipt Note Items
// ======================================================
app.get("/api/goodsreceiptnoteitem", async (req, res) => {
    try {

        // TODO:
        // Fetch all Goods Receipt Note Items

        res.json({
            success: true,
            message: "Get all Goods Receipt Note Items API",
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Goods Receipt Note Item By Id
// ======================================================
app.get("/api/goodsreceiptnoteitem/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch Goods Receipt Note Item by Id

        res.json({
            success: true,
            message: "Get Goods Receipt Note Item by Id API",
            goodsReceiptNoteItemId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Create Goods Receipt Note Item
// ======================================================
app.post("/api/goodsreceiptnoteitem", async (req, res) => {
    try {

        const goodsReceiptNoteItem = req.body;

        // TODO:
        // Save Goods Receipt Note Item

        res.status(201).json({
            success: true,
            message: "Goods Receipt Note Item created successfully",
            data: goodsReceiptNoteItem
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Update Goods Receipt Note Item
// ======================================================
app.put("/api/goodsreceiptnoteitem/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const goodsReceiptNoteItem = req.body;

        // TODO:
        // Update Goods Receipt Note Item

        res.json({
            success: true,
            message: "Goods Receipt Note Item updated successfully",
            goodsReceiptNoteItemId: id,
            data: goodsReceiptNoteItem
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Delete Goods Receipt Note Item
// ======================================================
app.delete("/api/goodsreceiptnoteitem/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Delete Goods Receipt Note Item

        res.json({
            success: true,
            message: "Goods Receipt Note Item deleted successfully",
            goodsReceiptNoteItemId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Goods Receipt Note Item Statistics
// ======================================================
app.get("/api/goodsreceiptnoteitem/statistics", async (req, res) => {
    try {

        // TODO:
        // Goods Receipt Note Item Statistics

        res.json({
            success: true,
            message: "Goods Receipt Note Item Statistics API",
            data: {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Search Goods Receipt Note Items
// ======================================================
app.get("/api/goodsreceiptnoteitem/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // TODO:
        // Search Goods Receipt Note Items

        res.json({
            success: true,
            message: "Search Goods Receipt Note Items API",
            keyword: searchText,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
/* =====================================================
20. STOCK LEDGER
===================================================== */

// ======================================================
// Get All Stock Ledger Entries
// ======================================================
app.get("/api/stockledger", async (req, res) => {
    try {

        // TODO:
        // Fetch all stock ledger entries

        res.json({
            success: true,
            message: "Get all Stock Ledger entries API",
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Stock Ledger By Id
// ======================================================
app.get("/api/stockledger/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Fetch Stock Ledger by Id

        res.json({
            success: true,
            message: "Get Stock Ledger by Id API",
            stockLedgerId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Create Stock Ledger Entry
// ======================================================
app.post("/api/stockledger", async (req, res) => {
    try {

        const stockLedger = req.body;

        // TODO:
        // Save Stock Ledger Entry

        res.status(201).json({
            success: true,
            message: "Stock Ledger entry created successfully",
            data: stockLedger
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Update Stock Ledger Entry
// ======================================================
app.put("/api/stockledger/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const stockLedger = req.body;

        // TODO:
        // Update Stock Ledger Entry

        res.json({
            success: true,
            message: "Stock Ledger entry updated successfully",
            stockLedgerId: id,
            data: stockLedger
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Delete Stock Ledger Entry
// ======================================================
app.delete("/api/stockledger/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // TODO:
        // Delete Stock Ledger Entry

        res.json({
            success: true,
            message: "Stock Ledger entry deleted successfully",
            stockLedgerId: id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Stock Ledger Statistics
// ======================================================
app.get("/api/stockledger/statistics", async (req, res) => {
    try {

        // TODO:
        // Get Stock Ledger Statistics

        res.json({
            success: true,
            message: "Stock Ledger Statistics API",
            data: {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Search Stock Ledger
// ======================================================
app.get("/api/stockledger/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // TODO:
        // Search Stock Ledger

        res.json({
            success: true,
            message: "Search Stock Ledger API",
            keyword: searchText,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Stock Ledger By Product
// ======================================================
app.get("/api/stockledger/product/:productId", async (req, res) => {
    try {

        const { productId } = req.params;

        // TODO:
        // Get Stock Ledger by Product

        res.json({
            success: true,
            message: "Get Stock Ledger By Product API",
            productId,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Stock Ledger By Warehouse
// ======================================================
app.get("/api/stockledger/warehouse/:warehouseId", async (req, res) => {
    try {

        const { warehouseId } = req.params;

        // TODO:
        // Get Stock Ledger by Warehouse

        res.json({
            success: true,
            message: "Get Stock Ledger By Warehouse API",
            warehouseId,
            data: []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================================================
// Get Current Stock Balance
// ======================================================
app.get("/api/stockledger/current-stock", async (req, res) => {
    try {

        const { productId, warehouseId } = req.query;

        // TODO:
        // Get Current Stock Balance

        res.json({
            success: true,
            message: "Get Current Stock Balance API",
            productId,
            warehouseId,
            currentStock: 0
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
/* =====================================================
21. DELIVERY CHALLAN
===================================================== */

// Get All Delivery Challans
app.get("/api/deliverychallan", async (req, res) => {
    try {
        const response = await axios.get(
            "https://localhost:5000/api/deliverychallan"
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch Delivery Challans"
            }
        );
    }
});

// Get Delivery Challan By Id
app.get("/api/deliverychallan/:id", async (req, res) => {
    try {
        const response = await axios.get(
            `https://localhost:5000/api/deliverychallan/${req.params.id}`
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch Delivery Challan"
            }
        );
    }
});

// Create Delivery Challan
app.post("/api/deliverychallan", async (req, res) => {
    try {
        const response = await axios.post(
            "https://localhost:5000/api/deliverychallan",
            req.body,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to create Delivery Challan"
            }
        );
    }
});

// Update Delivery Challan
app.put("/api/deliverychallan/:id", async (req, res) => {
    try {
        const response = await axios.put(
            `https://localhost:5000/api/deliverychallan/${req.params.id}`,
            req.body,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to update Delivery Challan"
            }
        );
    }
});

// Delete Delivery Challan
app.delete("/api/deliverychallan/:id", async (req, res) => {
    try {
        const response = await axios.delete(
            `https://localhost:5000/api/deliverychallan/${req.params.id}`
        );

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to delete Delivery Challan"
            }
        );
    }
});

// Delivery Challan Statistics
app.get("/api/deliverychallan/statistics", async (req, res) => {
    try {
        const response = await axios.get(
            "https://localhost:5000/api/deliverychallan/statistics"
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch Delivery Challan Statistics"
            }
        );
    }
});

// Search Delivery Challans
app.get("/api/deliverychallan/search", async (req, res) => {
    try {
        const response = await axios.get(
            "https://localhost:5000/api/deliverychallan/search",
            {
                params: req.query
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to search Delivery Challans"
            }
        );
    }
});
/* =====================================================
22. MARKETPLACE ORDER ITEM
===================================================== */

// Get All Marketplace Order Items
app.get("/api/MarketplaceOrderItems", async (req, res) => {
    try {
        // Database logic here

        res.json({
            success: true,
            message: "Marketplace Order Items fetched successfully",
            data: []
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Get Marketplace Order Item By Id
app.get("/api/MarketplaceOrderItems/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Marketplace Order Item fetched successfully",
            id,
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Create Marketplace Order Item
app.post("/api/MarketplaceOrderItems", async (req, res) => {
    try {

        const model = req.body;

        // Insert logic here

        res.status(201).json({
            success: true,
            message: "Marketplace Order Item created successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Marketplace Order Item
app.put("/api/MarketplaceOrderItems/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const model = req.body;

        // Update logic here

        res.json({
            success: true,
            message: "Marketplace Order Item updated successfully",
            id,
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete Marketplace Order Item
app.delete("/api/MarketplaceOrderItems/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Delete logic here

        res.json({
            success: true,
            message: "Marketplace Order Item deleted successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Marketplace Order Item Statistics
app.get("/api/MarketplaceOrderItems/statistics", async (req, res) => {
    try {

        // Statistics logic here

        res.json({
            success: true,
            message: "Marketplace Order Item statistics fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Search Marketplace Order Items
app.get("/api/MarketplaceOrderItems/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // Search logic here

        res.json({
            success: true,
            message: "Marketplace Order Item search completed",
            searchText,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

/* =====================================================
23. REVIEWS
===================================================== */

// Get All Reviews
app.get("/api/review", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Reviews fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Review By Id
app.get("/api/review/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Review fetched successfully",
            id,
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Create Review
app.post("/api/review", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Review
app.put("/api/review/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Review updated successfully",
            id,
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete Review
app.delete("/api/review/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Review deleted successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Review Statistics
app.get("/api/review/statistics", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Review statistics fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Search Reviews
app.get("/api/review/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Review search completed",
            searchText,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Reviews By Product
app.get("/api/review/product/:productId", async (req, res) => {
    try {

        const { productId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Product reviews fetched successfully",
            productId,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Reviews By Customer
app.get("/api/review/customer/:customerId", async (req, res) => {
    try {

        const { customerId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Customer reviews fetched successfully",
            customerId,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Approve Review
app.put("/api/review/:id/approve", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Review approved successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Reject Review
app.put("/api/review/:id/reject", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Review rejected successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Reply To Review
app.put("/api/review/:id/reply", async (req, res) => {
    try {

        const { id } = req.params;
        const { reply } = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Reply added successfully",
            id,
            reply
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
/* =====================================================
24. SHOPPING CART
===================================================== */

// Get All Shopping Cart Items
app.get("/api/shoppingcart", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Shopping cart items fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Shopping Cart Item By Id
app.get("/api/shoppingcart/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Shopping cart item fetched successfully",
            id,
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Add Item To Shopping Cart
app.post("/api/shoppingcart", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.status(201).json({
            success: true,
            message: "Item added to shopping cart successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Shopping Cart Item
app.put("/api/shoppingcart/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Shopping cart updated successfully",
            id,
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete Shopping Cart Item
app.delete("/api/shoppingcart/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Shopping cart item deleted successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Clear Shopping Cart
app.delete("/api/shoppingcart/clear/:customerId", async (req, res) => {
    try {

        const { customerId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Shopping cart cleared successfully",
            customerId
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Shopping Cart By Customer
app.get("/api/shoppingcart/customer/:customerId", async (req, res) => {
    try {

        const { customerId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Customer shopping cart fetched successfully",
            customerId,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Item Quantity
app.put("/api/shoppingcart/:id/quantity", async (req, res) => {
    try {

        const { id } = req.params;
        const { quantity } = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Item quantity updated successfully",
            id,
            quantity
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Shopping Cart Statistics
app.get("/api/shoppingcart/statistics", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Shopping cart statistics fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Search Shopping Cart
app.get("/api/shoppingcart/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Shopping cart search completed",
            searchText,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
/* =====================================================
25. WISHLIST
===================================================== */

// Get All Wishlist Items
app.get("/api/wishlist", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist items fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Wishlist Item By Id
app.get("/api/wishlist/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist item fetched successfully",
            id,
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Add Item To Wishlist
app.post("/api/wishlist", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.status(201).json({
            success: true,
            message: "Item added to wishlist successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Wishlist Item
app.put("/api/wishlist/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist item updated successfully",
            id,
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete Wishlist Item
app.delete("/api/wishlist/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist item deleted successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Clear Wishlist
app.delete("/api/wishlist/clear/:customerId", async (req, res) => {
    try {

        const { customerId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist cleared successfully",
            customerId
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Wishlist By Customer
app.get("/api/wishlist/customer/:customerId", async (req, res) => {
    try {

        const { customerId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Customer wishlist fetched successfully",
            customerId,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Move Wishlist Item To Cart
app.post("/api/wishlist/:id/move-to-cart", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist item moved to shopping cart successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Wishlist Statistics
app.get("/api/wishlist/statistics", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist statistics fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Search Wishlist
app.get("/api/wishlist/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Wishlist search completed",
            searchText,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});


/* =====================================================
26. NOTIFICATIONS
===================================================== */

// Get All Notifications
app.get("/api/notification", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Notifications fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Notification By Id
app.get("/api/notification/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Notification fetched successfully",
            id,
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Create Notification
app.post("/api/notification", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Notification
app.put("/api/notification/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Notification updated successfully",
            id,
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete Notification
app.delete("/api/notification/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Notification deleted successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Notifications By User
app.get("/api/notification/user/:userId", async (req, res) => {
    try {

        const { userId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "User notifications fetched successfully",
            userId,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Mark Notification As Read
app.put("/api/notification/:id/read", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Notification marked as read",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Mark All Notifications As Read
app.put("/api/notification/user/:userId/read-all", async (req, res) => {
    try {

        const { userId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "All notifications marked as read",
            userId
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Notification Statistics
app.get("/api/notification/statistics", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Notification statistics fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Search Notifications
app.get("/api/notification/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Notification search completed",
            searchText,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Unread Notification Count
app.get("/api/notification/user/:userId/unread-count", async (req, res) => {
    try {

        const { userId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Unread notification count fetched successfully",
            userId,
            unreadCount: 0
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete All Notifications
app.delete("/api/notification/user/:userId", async (req, res) => {
    try {

        const { userId } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "All notifications deleted successfully",
            userId
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
/* =====================================================
27. REPORTS
===================================================== */

// Get All Reports
app.get("/api/report", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Reports fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Report By Id
app.get("/api/report/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Report fetched successfully",
            id,
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Generate Report
app.post("/api/report", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.status(201).json({
            success: true,
            message: "Report generated successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Report
app.put("/api/report/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Report updated successfully",
            id,
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete Report
app.delete("/api/report/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Report deleted successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Sales Report
app.get("/api/report/sales", async (req, res) => {
    try {

        const { fromDate, toDate } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Sales report fetched successfully",
            fromDate,
            toDate,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Purchase Report
app.get("/api/report/purchase", async (req, res) => {
    try {

        const { fromDate, toDate } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Purchase report fetched successfully",
            fromDate,
            toDate,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Inventory Report
app.get("/api/report/inventory", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Inventory report fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Customer Report
app.get("/api/report/customer", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Customer report fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Product Report
app.get("/api/report/product", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Product report fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Order Report
app.get("/api/report/order", async (req, res) => {
    try {

        const { status } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Order report fetched successfully",
            status,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Export Report
app.post("/api/report/export", async (req, res) => {
    try {

        const { reportType, format } = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Report exported successfully",
            reportType,
            format
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Report Statistics
app.get("/api/report/statistics", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Report statistics fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Search Reports
app.get("/api/report/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Report search completed",
            searchText,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

/* =====================================================
28. SETTINGS
===================================================== */

// Get All Settings
app.get("/api/settings", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Settings fetched successfully",
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Setting By Id
app.get("/api/settings/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Setting fetched successfully",
            id,
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Create Setting
app.post("/api/settings", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.status(201).json({
            success: true,
            message: "Setting created successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Setting
app.put("/api/settings/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Setting updated successfully",
            id,
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Delete Setting
app.delete("/api/settings/:id", async (req, res) => {
    try {

        const { id } = req.params;

        // Database logic here

        res.json({
            success: true,
            message: "Setting deleted successfully",
            id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get General Settings
app.get("/api/settings/general", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "General settings fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update General Settings
app.put("/api/settings/general", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "General settings updated successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Company Settings
app.get("/api/settings/company", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Company settings fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Company Settings
app.put("/api/settings/company", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Company settings updated successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Email Settings
app.get("/api/settings/email", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Email settings fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Email Settings
app.put("/api/settings/email", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Email settings updated successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Get Notification Settings
app.get("/api/settings/notifications", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Notification settings fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Update Notification Settings
app.put("/api/settings/notifications", async (req, res) => {
    try {

        const model = req.body;

        // Database logic here

        res.json({
            success: true,
            message: "Notification settings updated successfully",
            data: model
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Settings Statistics
app.get("/api/settings/statistics", async (req, res) => {
    try {

        // Database logic here

        res.json({
            success: true,
            message: "Settings statistics fetched successfully",
            data: {}
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Search Settings
app.get("/api/settings/search", async (req, res) => {
    try {

        const { searchText } = req.query;

        // Database logic here

        res.json({
            success: true,
            message: "Settings search completed",
            searchText,
            data: []
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
/* =====================================================
29. USER MANAGEMENT
===================================================== */

// Get All Users
app.get("/api/usermanagement", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/usermanagement`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch users",
            }
        );
    }
});

// Get User By Id
app.get("/api/usermanagement/:id", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/usermanagement/${req.params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch user",
            }
        );
    }
});

// Create User
app.post("/api/usermanagement", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/usermanagement`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(201).json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to create user",
            }
        );
    }
});

// Update User
app.put("/api/usermanagement/:id", async (req, res) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/usermanagement/${req.params.id}`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to update user",
            }
        );
    }
});

// Delete User
app.delete("/api/usermanagement/:id", async (req, res) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/usermanagement/${req.params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to delete user",
            }
        );
    }
});

// User Statistics
app.get("/api/usermanagement/statistics", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/usermanagement/statistics`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch user statistics",
            }
        );
    }
});

// Search Users
app.get("/api/usermanagement/search", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/usermanagement/search`,
            {
                params: req.query,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to search users",
            }
        );
    }
});

/* =====================================================
30. ROLE MANAGEMENT
===================================================== */

// Get All Roles
app.get("/api/rolemanagement", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/rolemanagement`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch roles",
            }
        );
    }
});

// Get Role By Id
app.get("/api/rolemanagement/:id", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/rolemanagement/${req.params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch role",
            }
        );
    }
});

// Create Role
app.post("/api/rolemanagement", async (req, res) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/rolemanagement`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(201).json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to create role",
            }
        );
    }
});

// Update Role
app.put("/api/rolemanagement/:id", async (req, res) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/rolemanagement/${req.params.id}`,
            req.body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to update role",
            }
        );
    }
});

// Delete Role
app.delete("/api/rolemanagement/:id", async (req, res) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/rolemanagement/${req.params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to delete role",
            }
        );
    }
});

// Role Statistics
app.get("/api/rolemanagement/statistics", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/rolemanagement/statistics`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to fetch role statistics",
            }
        );
    }
});

// Search Roles
app.get("/api/rolemanagement/search", async (req, res) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/rolemanagement/search`,
            {
                params: req.query,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json(
            err.response?.data || {
                message: "Failed to search roles",
            }
        );
    }
});