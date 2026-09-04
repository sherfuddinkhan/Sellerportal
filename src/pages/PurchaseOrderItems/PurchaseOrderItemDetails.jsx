import React, {
useEffect,
useState
} from "react";

import {
Box,
Grid,
Typography,
Divider,
Chip,
Button,
CircularProgress,
Alert,
Paper
} from "@mui/material";

import {
ArrowBack,
Edit
} from "@mui/icons-material";

import {
useNavigate,
useParams
} from "react-router-dom";

import axios from "axios";

/* =========================================================
SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";

/* =========================================================
FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
const amount = Number(value);

if (!Number.isFinite(amount)) {
    return "₹ 0.00";
}

return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;


};

/* =========================================================
FORMAT QUANTITY
========================================================= */

const formatQuantity = (value) => {
const quantity = Number(value);

if (!Number.isFinite(quantity)) {
    return "0.00";
}

return quantity.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});


};

/* =========================================================
FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
const number = Number(value);

if (!Number.isFinite(number)) {
    return "0.00";
}

return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

};

/* =========================================================
FORMAT DATE
========================================================= */

const formatDate = (value) => {
if (!value) {
    return "-";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
    return "-";
}

return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
});


};

/* =========================================================
DETAIL FIELD
========================================================= */

const DetailField = ({
label,
value,
currency = false,
quantity = false
}) => {
let displayValue = value;

if (currency) {

    displayValue = formatCurrency(value);

} else if (quantity) {

    displayValue = formatQuantity(value);

} else if (
    value === null ||
    value === undefined ||
    value === ""
) {

    displayValue = "-";

}

return (
    <Box>

        <Typography
            variant="body2"
            color="text.secondary"
            sx={{
                mb: 0.5
            }}
        >
            {label}
        </Typography>

        <Typography
            variant="body1"
            fontWeight={500}
            sx={{
                wordBreak: "break-word"
            }}
        >
            {displayValue}
        </Typography>

    </Box>
);
};

/* =========================================================
SECTION TITLE
========================================================= */

const SectionTitle = ({
children
}) => {
return (
    <Box
        sx={{
            gridColumn: "1 / -1",
            mt: 2,
            mb: 1
        }}
    >

        <Typography
            variant="h6"
            fontWeight="bold"
        >
            {children}
        </Typography>

        <Divider
            sx={{
                mt: 1
            }}
        />

    </Box>
);
};

/* =========================================================
PURCHASE ORDER ITEM DETAILS PAGE
========================================================= */

const PurchaseOrderItemDetails = () => {
const {
    id
} = useParams();

const navigate = useNavigate();


/* =====================================================
   STATE
===================================================== */

const [
    item,
    setItem
] = useState(null);

const [
    loading,
    setLoading
] = useState(true);

const [
    error,
    setError
] = useState("");


/* =====================================================
   LOAD ITEM
===================================================== */

useEffect(() => {

    const loadItem = async () => {

        try {

            setLoading(true);
            setError("");

            if (!id || !/^\d+$/.test(id)) {

                setError(
                    `Invalid Purchase Order Item ID: ${id}`
                );

                return;
            }


            console.log(
                "================================================"
            );

            console.log(
                "GET PURCHASE ORDER ITEM DETAILS"
            );

            console.log(
                "ITEM ID:",
                id
            );


            const response = await axios.get(
                `${SERVER_URL}/api/purchase-order-items/${id}`
            );


            console.log(
                "PURCHASE ORDER ITEM DETAILS RESPONSE:",
                response.data
            );


            setItem(response.data);

        } catch (err) {

            console.error(
                "LOAD PURCHASE ORDER ITEM DETAILS ERROR:",
                err
            );


            if (err.response) {

                setError(
                    err.response.data?.message ||
                    err.response.data ||
                    `Failed to load Purchase Order Item ${id}`
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {

            setLoading(false);

        }

    };


    loadItem();

}, [id]);


/* =====================================================
   LOADING
===================================================== */

if (loading) {

    return (
        <Box
            sx={{
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2
            }}
        >

            <CircularProgress />

            <Typography>
                Loading Purchase Order Item...
            </Typography>

        </Box>
    );
}


/* =====================================================
   ERROR
===================================================== */

if (error) {

    return (
        <Box
            sx={{
                p: 3
            }}
        >

            <Alert
                severity="error"
                sx={{
                    mb: 2
                }}
            >
                {error}
            </Alert>

            <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() =>
                    navigate(
                        "/purchase-order-items"
                    )
                }
            >
                Back to Purchase Order Items
            </Button>

        </Box>
    );
}


/* =====================================================
   NO DATA
===================================================== */

if (!item) {

    return (
        <Box
            sx={{
                p: 3
            }}
        >

            <Alert
                severity="warning"
                sx={{
                    mb: 2
                }}
            >
                Purchase Order Item not found.
            </Alert>

            <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() =>
                    navigate(
                        "/purchase-order-items"
                    )
                }
            >
                Back to Purchase Order Items
            </Button>

        </Box>
    );
}


/* =====================================================
   NESTED OBJECTS
===================================================== */

const purchaseOrder =
    item.purchaseOrder || {};

const product =
    item.product || {};


/* =====================================================
   PAGE
===================================================== */

return (

    <Box
        sx={{
            p: {
                xs: 2,
                md: 3
            }
        }}
    >

        {/* =================================================
            HEADER
        ================================================= */}

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                    xs: "flex-start",
                    md: "center"
                },
                flexDirection: {
                    xs: "column",
                    md: "row"
                },
                gap: 2,
                mb: 3
            }}
        >

            <Box>

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Purchase Order Item Details
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    Purchase Order Item ID:{" "}
                    {item.purchaseOrderItemId}
                </Typography>

            </Box>


            <Box
                sx={{
                    display: "flex",
                    gap: 1
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/purchase-order-items"
                        )
                    }
                >
                    Back
                </Button>


                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() =>
                        navigate(
                            `/purchase-order-items/edit/${item.purchaseOrderItemId}`
                        )
                    }
                >
                    Edit
                </Button>

            </Box>

        </Box>


        {/* =================================================
            ITEM DETAILS CARD
        ================================================= */}

        <Paper
            elevation={2}
            sx={{
                p: {
                    xs: 2,
                    md: 3
                },
                mb: 3
            }}
        >

            <Grid
                container
                spacing={3}
            >

                <SectionTitle>
                    Purchase Order Item
                </SectionTitle>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Purchase Order Item ID"
                        value={
                            item.purchaseOrderItemId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Purchase Order ID"
                        value={
                            item.purchaseOrderId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Seller ID"
                        value={
                            item.sellerId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Customer ID"
                        value={
                            item.customerId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Product ID"
                        value={
                            item.productId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Quantity"
                        value={
                            item.quantity
                        }
                        quantity
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Unit Price"
                        value={
                            item.unitPrice
                        }
                        currency
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Discount"
                        value={
                            item.discount
                        }
                        currency
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Tax Amount"
                        value={
                            item.taxAmount
                        }
                        currency
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(
                                item.totalAmount
                            )}
                        </Typography>

                    </Box>

                </Grid>

            </Grid>

        </Paper>


        {/* =================================================
            PURCHASE ORDER DETAILS
        ================================================= */}

        <Paper
            elevation={2}
            sx={{
                p: {
                    xs: 2,
                    md: 3
                },
                mb: 3
            }}
        >

            <Grid
                container
                spacing={3}
            >

                <SectionTitle>
                    Purchase Order Details
                </SectionTitle>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Purchase Order ID"
                        value={
                            purchaseOrder.purchaseOrderId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Purchase Order Number"
                        value={
                            purchaseOrder.purchaseOrderNumber
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Seller ID"
                        value={
                            purchaseOrder.sellerId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Supplier ID"
                        value={
                            purchaseOrder.supplierId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Customer ID"
                        value={
                            purchaseOrder.customerId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Order Date"
                        value={
                            formatDate(
                                purchaseOrder.orderDate
                            )
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Expected Delivery Date"
                        value={
                            formatDate(
                                purchaseOrder.expectedDeliveryDate
                            )
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Status
                        </Typography>

                        {purchaseOrder.status ? (

                            <Chip
                                label={
                                    purchaseOrder.status
                                }
                                color="primary"
                                size="small"
                            />

                        ) : (

                            <Typography>
                                -
                            </Typography>

                        )}

                    </Box>

                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Purchase Order Total Amount"
                        value={
                            purchaseOrder.totalAmount
                        }
                        currency
                    />
                </Grid>


                <Grid item xs={12}>
                    <DetailField
                        label="Remarks"
                        value={
                            purchaseOrder.remarks
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <DetailField
                        label="Created Date"
                        value={
                            formatDate(
                                purchaseOrder.createdDate
                            )
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <DetailField
                        label="Updated Date"
                        value={
                            formatDate(
                                purchaseOrder.updatedDate
                            )
                        }
                    />
                </Grid>

            </Grid>

        </Paper>


        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <Paper
            elevation={2}
            sx={{
                p: {
                    xs: 2,
                    md: 3
                },
                mb: 3
            }}
        >

            <Grid
                container
                spacing={3}
            >

                <SectionTitle>
                    Product Details
                </SectionTitle>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Product ID"
                        value={
                            product.productId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="SKU"
                        value={
                            product.sku
                        }
                    />
                </Grid>


                <Grid item xs={12} md={8}>
                    <DetailField
                        label="Product Name"
                        value={
                            product.productName
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Seller ID"
                        value={
                            product.sellerId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Customer ID"
                        value={
                            product.customerId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Brand ID"
                        value={
                            product.brandId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Category ID"
                        value={
                            product.categoryId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Product Type ID"
                        value={
                            product.productTypeId
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Barcode"
                        value={
                            product.barcode
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="HSN Code"
                        value={
                            product.hsnCode
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Unit of Measure"
                        value={
                            product.unitOfMeasure
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Weight"
                        value={
                            product.weight
                        }
                        quantity
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Length"
                        value={
                            product.length
                        }
                        quantity
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Width"
                        value={
                            product.width
                        }
                        quantity
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Height"
                        value={
                            product.height
                        }
                        quantity
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={4}>

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Product Status
                        </Typography>

                        {product.status ? (

                            <Chip
                                label={
                                    product.status
                                }
                                size="small"
                                color={
                                    product.isActive
                                        ? "success"
                                        : "default"
                                }
                            />

                        ) : (

                            <Typography>
                                -
                            </Typography>

                        )}

                    </Box>

                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <DetailField
                        label="Active"
                        value={
                            product.isActive
                                ? "Yes"
                                : "No"
                        }
                    />
                </Grid>


                <Grid item xs={12}>
                    <DetailField
                        label="Description"
                        value={
                            product.description
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <DetailField
                        label="Product Created Date"
                        value={
                            formatDate(
                                product.createdDate
                            )
                        }
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <DetailField
                        label="Product Updated Date"
                        value={
                            formatDate(
                                product.updatedDate
                            )
                        }
                    />
                </Grid>

            </Grid>

        </Paper>


        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                pb: 3
            }}
        >

            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() =>
                    navigate(
                        "/purchase-order-items"
                    )
                }
            >
                Back to List
            </Button>


            <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() =>
                    navigate(
                        `/purchase-order-items/edit/${item.purchaseOrderItemId}`
                    )
                }
            >
                Edit Item
            </Button>

        </Box>

    </Box>
);


};

export default PurchaseOrderItemDetails;
