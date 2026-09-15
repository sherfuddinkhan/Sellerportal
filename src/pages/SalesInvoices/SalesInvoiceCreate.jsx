// ============================================================
// SalesInvoiceCreate.jsx
//
// Architecture:
// React -> Node server.js -> ASP.NET Core API
//
// Aggregate:
// GET /api/SellerCustomer/{sellerId}/customers/{customerId}
//
// Create:
// POST /api/sales-invoices
//
// Seller:
// 6
//
// Customer:
// 3
// ============================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

import {
    Add,
    ArrowBack,
    Delete,
    Save
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";


// ============================================================
// CONFIGURATION
// ============================================================

const SERVER_URL = "http://localhost:5000";

const SELLER_ID = 6;

const CUSTOMER_ID = 3;


// ============================================================
// HELPERS
// ============================================================

const toNumber = (value) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
};


const money = (value) => {

    return toNumber(value).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
};


const getValue = (
    object,
    ...keys
) => {

    if (!object) return "";

    for (const key of keys) {

        if (
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }

    }

    return "";
};


const getDateValue = (value) => {

    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime()))
        return "";

    return date
        .toISOString()
        .substring(0, 10);
};


const getCurrentFinancialYear = () => {

    const date = new Date();

    const year = date.getFullYear();

    const month = date.getMonth() + 1;

    if (month >= 4) {

        return `${year}-${String(year + 1).slice(-2)}`;

    }

    return `${year - 1}-${String(year).slice(-2)}`;
};


const getProductName = (
    product
) => {

    return getValue(
        product,
        "productName",
        "ProductName",
        "name",
        "Name"
    ) || "Product";
};


const getProductId = (
    product
) => {

    return toNumber(
        getValue(
            product,
            "productId",
            "ProductId"
        )
    );
};


const getProductSku = (
    product
) => {

    return getValue(
        product,
        "sku",
        "SKU",
        "Sku"
    );
};


const getProductHsn = (
    product
) => {

    return getValue(
        product,
        "hsnCode",
        "hsncode",
        "HsnCode",
        "HSNCode"
    );
};


const getProductUom = (
    product
) => {

    return getValue(
        product,
        "unitOfMeasure",
        "uom",
        "UOM",
        "UnitOfMeasure"
    ) || "PCS";
};


// ============================================================
// COMPONENT
// ============================================================

const SalesInvoiceCreate = () => {

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [
        aggregate,
        setAggregate
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    const [
        selectedSalesOrderId,
        setSelectedSalesOrderId
    ] = useState("");


    const [
        selectedOrder,
        setSelectedOrder
    ] = useState(null);


    const [
        items,
        setItems
    ] = useState([]);


    const [
        paidAmount,
        setPaidAmount
    ] = useState("");


    const [
        paymentStatus,
        setPaymentStatus
    ] = useState("Pending");


    const [
        invoiceStatus,
        setInvoiceStatus
    ] = useState("Draft");


    const [
        invoiceNumber,
        setInvoiceNumber
    ] = useState("");


    const [
        invoiceDate,
        setInvoiceDate
    ] = useState(
        new Date()
            .toISOString()
            .substring(0, 10)
    );


    const [
        financialYear,
        setFinancialYear
    ] = useState(
        getCurrentFinancialYear()
    );


    const [
        invoiceScenario,
        setInvoiceScenario
    ] = useState("B2B");


    const [
        category,
        setCategory
    ] = useState("Goods");


    const [
        transactionType,
        setTransactionType
    ] = useState("Sale");


    const [
        documentType,
        setDocumentType
    ] = useState("Invoice");


    const [
        supplyType,
        setSupplyType
    ] = useState("B2B");


    const [
        reverseCharge,
        setReverseCharge
    ] = useState("No");


    const [
        userGSTIN,
        setUserGSTIN
    ] = useState("");


    const [
        placeOfSupply,
        setPlaceOfSupply
    ] = useState("");


    const [
        remarks,
        setRemarks
    ] = useState("");


    // ========================================================
    // LOAD SELLER CUSTOMER AGGREGATE
    // ========================================================

    const loadAggregate = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const response = await axios.get(
                    `${SERVER_URL}/api/SellerCustomer/${SELLER_ID}/customers/${CUSTOMER_ID}`
                );


                const data =
                    response.data || {};


                setAggregate(data);


                // ------------------------------------------------
                // Customer defaults
                // ------------------------------------------------

                const customerState =
                    getValue(
                        data,
                        "state",
                        "State"
                    );

                const customerStateCode =
                    getValue(
                        data,
                        "stateCode",
                        "StateCode"
                    );


                setPlaceOfSupply(
                    customerStateCode
                        ? `${customerState} (${customerStateCode})`
                        : customerState
                );


                // ------------------------------------------------
                // Automatically derive seller GSTIN if available
                // ------------------------------------------------

                const sellerGSTIN =
                    getValue(
                        data,
                        "userGSTIN",
                        "UserGSTIN",
                        "sellerGSTIN",
                        "SellerGSTIN"
                    );


                if (sellerGSTIN) {

                    setUserGSTIN(
                        sellerGSTIN
                    );

                }


                // ------------------------------------------------
                // Generate invoice number
                // ------------------------------------------------

                const generatedNumber =
                    `INV-${Date.now()}`;


                setInvoiceNumber(
                    generatedNumber
                );


            } catch (err) {

                console.error(
                    "LOAD SELLER CUSTOMER AGGREGATE ERROR:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Failed to load customer aggregate."
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    useEffect(() => {

        loadAggregate();

    }, [loadAggregate]);


    // ========================================================
    // AGGREGATE ARRAYS
    // ========================================================

    const salesOrders =
        useMemo(() => {

            return (
                aggregate?.transactions?.salesOrders ||
                aggregate?.salesOrders ||
                []
            );

        }, [aggregate]);


    const salesOrderItems =
        useMemo(() => {

            return (
                aggregate?.transactions?.salesOrderItems ||
                aggregate?.salesOrderItems ||
                []
            );

        }, [aggregate]);


    const products =
        useMemo(() => {

            return (
                aggregate?.products ||
                []
            );

        }, [aggregate]);


    const prices =
        useMemo(() => {

            return (
                aggregate?.prices ||
                []
            );

        }, [aggregate]);


    const inventories =
        useMemo(() => {

            return (
                aggregate?.inventories ||
                []
            );

        }, [aggregate]);


    // ========================================================
    // CUSTOMER
    // ========================================================

    const customer =
        aggregate || {};


    // ========================================================
    // PRODUCT LOOKUP
    // ========================================================

    const getProduct = useCallback(
        (productId) => {

            return products.find(
                product =>
                    getProductId(product) ===
                    toNumber(productId)
            );

        },
        [products]
    );


    // ========================================================
    // PRICE LOOKUP
    // ========================================================

    const getProductPrice = useCallback(
        (productId) => {

            const productPrice =
                prices.find(
                    price =>
                        toNumber(
                            getValue(
                                price,
                                "productId",
                                "ProductId"
                            )
                        ) ===
                        toNumber(productId) &&
                        (
                            getValue(
                                price,
                                "isActive",
                                "IsActive"
                            ) === true ||
                            getValue(
                                price,
                                "isActive",
                                "IsActive"
                            ) === undefined
                        )
                );


            if (productPrice) {

                return toNumber(
                    getValue(
                        productPrice,
                        "price",
                        "Price"
                    )
                );

            }


            const product =
                getProduct(productId);


            return toNumber(
                getValue(
                    product,
                    "offerPrice",
                    "OfferPrice",
                    "sellingPrice",
                    "SellingPrice",
                    "price",
                    "Price"
                )
            );

        },
        [
            prices,
            getProduct
        ]
    );


    // ========================================================
    // INVENTORY LOOKUP
    // ========================================================

    const getAvailableStock = useCallback(
        (productId) => {

            const inventory =
                inventories.find(
                    item =>
                        toNumber(
                            getValue(
                                item,
                                "productId",
                                "ProductId"
                            )
                        ) ===
                        toNumber(productId)
                );


            if (!inventory)
                return null;


            const quantity =
                toNumber(
                    getValue(
                        inventory,
                        "quantity",
                        "Quantity"
                    )
                );


            const reserved =
                toNumber(
                    getValue(
                        inventory,
                        "reservedQuantity",
                        "ReservedQuantity"
                    )
                );


            const damaged =
                toNumber(
                    getValue(
                        inventory,
                        "damagedQuantity",
                        "DamagedQuantity"
                    )
                );


            return Math.max(
                quantity -
                reserved -
                damaged,
                0
            );

        },
        [inventories]
    );


    // ========================================================
    // SELECT SALES ORDER
    // ========================================================

    const handleSalesOrderChange = (
        event
    ) => {

        const value =
            event.target.value;


        setSelectedSalesOrderId(
            value
        );


        const order =
            salesOrders.find(
                item =>
                    toNumber(
                        getValue(
                            item,
                            "salesOrderId",
                            "SalesOrderId",
                            "orderId",
                            "OrderId"
                        )
                    ) ===
                    toNumber(value)
            );


        setSelectedOrder(
            order || null
        );


        if (!order) {

            setItems([]);

            return;

        }


        // ----------------------------------------------------
        // Transport information comes from Sales Order
        // ----------------------------------------------------

        setRemarks(
            getValue(
                order,
                "remarks",
                "Remarks"
            ) || ""
        );


        // ----------------------------------------------------
        // Order items
        // ----------------------------------------------------

        const orderId =
            toNumber(
                getValue(
                    order,
                    "salesOrderId",
                    "SalesOrderId",
                    "orderId",
                    "OrderId"
                )
            );


        const matchingItems =
            salesOrderItems.filter(
                item =>
                    toNumber(
                        getValue(
                            item,
                            "salesOrderId",
                            "SalesOrderId",
                            "orderId",
                            "OrderId"
                        )
                    ) === orderId
            );


        const mappedItems =
            matchingItems.map(
                (item, index) => {

                    const productId =
                        toNumber(
                            getValue(
                                item,
                                "productId",
                                "ProductId"
                            )
                        );


                    const product =
                        getProduct(
                            productId
                        );


                    const quantity =
                        toNumber(
                            getValue(
                                item,
                                "quantity",
                                "Quantity"
                            )
                        ) || 1;


                    const unitPrice =
                        toNumber(
                            getValue(
                                item,
                                "unitPrice",
                                "UnitPrice",
                                "quantityAmount",
                                "QuantityAmount"
                            )
                        ) ||
                        getProductPrice(
                            productId
                        );


                    const discount =
                        toNumber(
                            getValue(
                                item,
                                "discount",
                                "Discount"
                            )
                        );


                    const gst =
                        toNumber(
                            getValue(
                                item,
                                "gstPer",
                                "GSTPer"
                            )
                        );


                    const cgst =
                        toNumber(
                            getValue(
                                item,
                                "cgstPer",
                                "CGSTPer"
                            )
                        );


                    const sgst =
                        toNumber(
                            getValue(
                                item,
                                "sgstPer",
                                "SGSTPer"
                            )
                        );


                    const igst =
                        toNumber(
                            getValue(
                                item,
                                "igstPer",
                                "IGSTPer"
                            )
                        );


                    const subtotal =
                        Math.max(
                            quantity *
                            unitPrice -
                            discount,
                            0
                        );


                    const taxPercentage =
                        gst ||
                        cgst +
                        sgst +
                        igst ||
                        0;


                    const taxAmount =
                        toNumber(
                            getValue(
                                item,
                                "taxAmount",
                                "TaxAmount"
                            )
                        ) ||
                        (
                            subtotal *
                            taxPercentage /
                            100
                        );


                    const total =
                        toNumber(
                            getValue(
                                item,
                                "totalAmount",
                                "TotalAmount"
                            )
                        ) ||
                        (
                            subtotal +
                            taxAmount
                        );


                    return {

                        tempId:
                            `${productId}-${index}-${Date.now()}`,

                        itemXID:
                            getValue(
                                item,
                                "itemXID",
                                "ItemXID"
                            ),

                        productId,

                        productName:
                            getProductName(
                                product
                            ),

                        sku:
                            getProductSku(
                                product
                            ) ||
                            getValue(
                                item,
                                "sku",
                                "SKU",
                                "Sku"
                            ),

                        hsnCode:
                            getProductHsn(
                                product
                            ) ||
                            getValue(
                                item,
                                "hsncode",
                                "hsnCode",
                                "HSNCode"
                            ),

                        uom:
                            getProductUom(
                                product
                            ),

                        quantity,

                        unitPrice,

                        discount,

                        gstPercentage:
                            taxPercentage,

                        cgstPercentage:
                            cgst,

                        sgstPercentage:
                            sgst,

                        igstPercentage:
                            igst,

                        taxAmount,

                        subtotal,

                        total,

                        availableStock:
                            getAvailableStock(
                                productId
                            ),

                        description:
                            getValue(
                                item,
                                "description",
                                "Description"
                            ) ||
                            getValue(
                                product,
                                "description",
                                "Description"
                            ) ||
                            "",

                        remarks:
                            getValue(
                                item,
                                "remarks",
                                "Remarks"
                            ) ||
                            ""

                    };

                }
            );


        setItems(
            mappedItems
        );

    };


    // ========================================================
    // ADD PRODUCT MANUALLY
    // ========================================================

    const handleAddItem = () => {

        const firstProduct =
            products[0];


        if (!firstProduct) {

            setError(
                "No products are available for this customer."
            );

            return;

        }


        const productId =
            getProductId(
                firstProduct
            );


        const unitPrice =
            getProductPrice(
                productId
            );


        const newItem = {

            tempId:
                `${productId}-${Date.now()}`,

            productId,

            productName:
                getProductName(
                    firstProduct
                ),

            sku:
                getProductSku(
                    firstProduct
                ),

            hsnCode:
                getProductHsn(
                    firstProduct
                ),

            uom:
                getProductUom(
                    firstProduct
                ),

            quantity: 1,

            unitPrice,

            discount: 0,

            gstPercentage: 18,

            cgstPercentage: 9,

            sgstPercentage: 9,

            igstPercentage: 0,

            taxAmount:
                unitPrice *
                18 /
                100,

            subtotal:
                unitPrice,

            total:
                unitPrice *
                1.18,

            availableStock:
                getAvailableStock(
                    productId
                ),

            description:
                getValue(
                    firstProduct,
                    "description",
                    "Description"
                ) || "",

            remarks: ""

        };


        setItems(
            previous => [
                ...previous,
                newItem
            ]
        );

    };


    // ========================================================
    // UPDATE ITEM
    // ========================================================

    const updateItem = (
        tempId,
        field,
        value
    ) => {

        setItems(
            previous =>
                previous.map(
                    item => {

                        if (
                            item.tempId !==
                            tempId
                        ) {
                            return item;
                        }


                        const updated = {

                            ...item,

                            [field]:
                                value

                        };


                        const quantity =
                            Math.max(
                                toNumber(
                                    updated.quantity
                                ),
                                0
                            );


                        const unitPrice =
                            Math.max(
                                toNumber(
                                    updated.unitPrice
                                ),
                                0
                            );


                        const discount =
                            Math.max(
                                toNumber(
                                    updated.discount
                                ),
                                0
                            );


                        const subtotal =
                            Math.max(
                                quantity *
                                unitPrice -
                                discount,
                                0
                            );


                        const gstPercentage =
                            Math.max(
                                toNumber(
                                    updated.gstPercentage
                                ),
                                0
                            );


                        const taxAmount =
                            subtotal *
                            gstPercentage /
                            100;


                        const total =
                            subtotal +
                            taxAmount;


                        return {

                            ...updated,

                            quantity,

                            unitPrice,

                            discount,

                            subtotal,

                            taxAmount,

                            total

                        };

                    }
                )
        );

    };


    // ========================================================
    // DELETE ITEM
    // ========================================================

    const handleDeleteItem = (
        tempId
    ) => {

        setItems(
            previous =>
                previous.filter(
                    item =>
                        item.tempId !==
                        tempId
                )
        );

    };


    // ========================================================
    // INVOICE CALCULATIONS
    // ========================================================

    const subTotal =
        useMemo(
            () =>
                items.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        toNumber(
                            item.subtotal
                        ),
                    0
                ),
            [items]
        );


    const discountAmount =
        useMemo(
            () =>
                items.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        toNumber(
                            item.discount
                        ),
                    0
                ),
            [items]
        );


    const taxAmount =
        useMemo(
            () =>
                items.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        toNumber(
                            item.taxAmount
                        ),
                    0
                ),
            [items]
        );


    const totalAmount =
        useMemo(
            () =>
                Math.max(
                    subTotal +
                    taxAmount,
                    0
                ),
            [
                subTotal,
                taxAmount
            ]
        );


    const paid =
        toNumber(
            paidAmount
        );


    const balanceAmount =
        Math.max(
            totalAmount -
            paid,
            0
        );


    // ========================================================
    // AUTOMATIC PAYMENT STATUS
    // ========================================================

    useEffect(() => {

        if (paid <= 0) {

            setPaymentStatus(
                "Pending"
            );

        } else if (
            paid >= totalAmount &&
            totalAmount > 0
        ) {

            setPaymentStatus(
                "Paid"
            );

        } else {

            setPaymentStatus(
                "Partial"
            );

        }

    }, [
        paid,
        totalAmount
    ]);


    // ========================================================
    // SALES ORDER TRANSPORT DATA
    // ========================================================

    const transportData =
        useMemo(
            () => {

                if (!selectedOrder)
                    return {};


                return {

                    vehicleNo:
                        getValue(
                            selectedOrder,
                            "vehicleNo",
                            "VehicleNo"
                        ),

                    transport:
                        getValue(
                            selectedOrder,
                            "transport",
                            "Transport"
                        ),

                    transporterName:
                        getValue(
                            selectedOrder,
                            "transporterName",
                            "TransporterName"
                        ),

                    transporterID:
                        getValue(
                            selectedOrder,
                            "transporterID",
                            "TransporterID"
                        ),

                    transporterDocNo:
                        getValue(
                            selectedOrder,
                            "transporterDocNo",
                            "TransporterDocNo"
                        ),

                    transportMode:
                        getValue(
                            selectedOrder,
                            "transportMode",
                            "TransportMode"
                        ),

                    distance:
                        getValue(
                            selectedOrder,
                            "distance",
                            "Distance"
                        ),

                    eWayBillNumber:
                        getValue(
                            selectedOrder,
                            "eWayBillNumber",
                            "EWayBillNumber"
                        ),

                    deliveryNote:
                        getValue(
                            selectedOrder,
                            "deliveryNote",
                            "DeliveryNote"
                        ),

                    deliveryNoteDate:
                        getDateValue(
                            getValue(
                                selectedOrder,
                                "deliveryNoteDate",
                                "DeliveryNoteDate"
                            )
                        )

                };

            },
            [selectedOrder]
        );


    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {

        if (!invoiceNumber.trim()) {

            setError(
                "Invoice number is required."
            );

            return false;

        }


        if (!invoiceDate) {

            setError(
                "Invoice date is required."
            );

            return false;

        }


        if (items.length === 0) {

            setError(
                "Add at least one invoice item."
            );

            return false;

        }


        if (totalAmount <= 0) {

            setError(
                "Invoice total must be greater than zero."
            );

            return false;

        }


        if (paid > totalAmount) {

            setError(
                "Paid amount cannot exceed invoice total."
            );

            return false;

        }


        return true;

    };


    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        if (!validateForm())
            return;


        try {

            setSaving(true);


            const sellerId =
                toNumber(
                    getValue(
                        aggregate,
                        "sellerId",
                        "SellerId"
                    )
                ) ||
                SELLER_ID;


            const customerId =
                toNumber(
                    getValue(
                        aggregate,
                        "customerId",
                        "CustomerId"
                    )
                ) ||
                CUSTOMER_ID;


            // =================================================
            // EXISTING SALES-INVOICE API PAYLOAD
            // =================================================

            const payload = {

                SalesOrderId:
                    selectedSalesOrderId
                        ? toNumber(
                            selectedSalesOrderId
                        )
                        : null,

                SellerId:
                    sellerId,

                CustomerId:
                    customerId,

                InvoiceNumber:
                    invoiceNumber.trim(),

                InvoiceDate:
                    invoiceDate,

                InvoiceScenario:
                    invoiceScenario,

                Category:
                    category,

                TransactionType:
                    transactionType,

                UserGSTIN:
                    userGSTIN.trim(),

                DocumentType:
                    documentType,

                SupplyType:
                    supplyType,

                PlaceOfSupply:
                    placeOfSupply.trim(),

                FinancialYear:
                    financialYear.trim(),

                ReverseCharge:
                    reverseCharge === "Yes",

                Id:
                    selectedSalesOrderId
                        ? String(
                            selectedSalesOrderId
                        )
                        : "",

                RefId:
                    getValue(
                        selectedOrder,
                        "otherReferences",
                        "OtherReferences"
                    ) || "",

                SubTotal:
                    Number(
                        subTotal.toFixed(2)
                    ),

                DiscountAmount:
                    Number(
                        discountAmount.toFixed(2)
                    ),

                TaxAmount:
                    Number(
                        taxAmount.toFixed(2)
                    ),

                TotalAmount:
                    Number(
                        totalAmount.toFixed(2)
                    ),

                PaidAmount:
                    Number(
                        paid.toFixed(2)
                    ),

                BalanceAmount:
                    Number(
                        balanceAmount.toFixed(2)
                    ),

                PaymentStatus:
                    paymentStatus,

                Status:
                    invoiceStatus,

                Remarks:
                    remarks.trim()

            };


            console.log(
                "CREATE SALES INVOICE PAYLOAD:",
                payload
            );


            await axios.post(
                `${SERVER_URL}/api/sales-invoices`,
                payload
            );


            setSuccess(
                "Sales Invoice created successfully."
            );


            setTimeout(
                () => {

                    navigate(
                        "/sales-invoices"
                    );

                },
                1200
            );


        } catch (err) {

            console.error(
                "CREATE SALES INVOICE ERROR:",
                err
            );


            const responseData =
                err.response?.data;


            let message =
                "Failed to create Sales Invoice.";


            if (
                typeof responseData ===
                "string"
            ) {

                message =
                    responseData;

            } else if (
                responseData?.message
            ) {

                message =
                    responseData.message;

            } else if (
                responseData?.title
            ) {

                message =
                    responseData.title;

            }


            setError(
                message
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box sx={{ p: 3 }}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="h6"
                        >
                            Loading Sales Invoice...
                        </Typography>

                    </CardContent>

                </Card>

            </Box>

        );

    }


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                p: 3,
                backgroundColor: "#f5f6f8",
                minHeight: "100vh"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Card
                sx={{
                    mb: 2
                }}
            >

                <CardContent>

                    <Stack
                        direction={{
                            xs: "column",
                            md: "row"
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            md: "center"
                        }}
                        spacing={2}
                    >

                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight="700"
                            >
                                Create Sales Invoice
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Create an invoice using the
                                Seller / Customer aggregate
                            </Typography>

                        </Box>


                        <Button
                            variant="outlined"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={() =>
                                navigate(
                                    "/sales-invoices"
                                )
                            }
                        >
                            Back
                        </Button>

                    </Stack>

                </CardContent>

            </Card>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {String(error)}
                </Alert>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
            >


                {/* =============================================
                    CUSTOMER
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ mb: 2 }}
                        >
                            Customer
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Customer Name"
                                    value={
                                        getValue(
                                            customer,
                                            "customerName",
                                            "CustomerName"
                                        )
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Customer Code"
                                    value={
                                        getValue(
                                            customer,
                                            "customerCode",
                                            "CustomerCode"
                                        )
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    value={
                                        getValue(
                                            customer,
                                            "contactPerson",
                                            "ContactPerson"
                                        )
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={
                                        getValue(
                                            customer,
                                            "email",
                                            "Email"
                                        )
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={
                                        getValue(
                                            customer,
                                            "phone",
                                            "Phone"
                                        )
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    value={
                                        getValue(
                                            customer,
                                            "gstin",
                                            "GSTIN"
                                        )
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    label="Billing Address"
                                    value={[
                                        getValue(
                                            customer,
                                            "addressLine1",
                                            "AddressLine1"
                                        ),
                                        getValue(
                                            customer,
                                            "addressLine2",
                                            "AddressLine2"
                                        ),
                                        getValue(
                                            customer,
                                            "buildingName",
                                            "BuildingName"
                                        ),
                                        getValue(
                                            customer,
                                            "location",
                                            "Location"
                                        ),
                                        getValue(
                                            customer,
                                            "city",
                                            "City"
                                        ),
                                        getValue(
                                            customer,
                                            "state",
                                            "State"
                                        ),
                                        getValue(
                                            customer,
                                            "postalCode",
                                            "PostalCode"
                                        )
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    disabled
                                    multiline
                                    minRows={2}
                                />

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =============================================
                    INVOICE INFORMATION
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ mb: 2 }}
                        >
                            Invoice Information
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Invoice Number"
                                    value={
                                        invoiceNumber
                                    }
                                    onChange={event =>
                                        setInvoiceNumber(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Invoice Date"
                                    value={
                                        invoiceDate
                                    }
                                    onChange={event =>
                                        setInvoiceDate(
                                            event.target.value
                                        )
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Sales Order"
                                    value={
                                        selectedSalesOrderId
                                    }
                                    onChange={
                                        handleSalesOrderChange
                                    }
                                >

                                    <MenuItem value="">
                                        Select Sales Order
                                    </MenuItem>

                                    {salesOrders.map(
                                        order => {

                                            const orderId =
                                                getValue(
                                                    order,
                                                    "salesOrderId",
                                                    "SalesOrderId",
                                                    "orderId",
                                                    "OrderId"
                                                );


                                            const orderNumber =
                                                getValue(
                                                    order,
                                                    "orderNumber",
                                                    "OrderNumber",
                                                    "salesOrderNumber",
                                                    "SalesOrderNumber"
                                                );


                                            return (

                                                <MenuItem
                                                    key={
                                                        orderId
                                                    }
                                                    value={
                                                        orderId
                                                    }
                                                >
                                                    {orderNumber
                                                        ? `${orderNumber} (ID: ${orderId})`
                                                        : `Sales Order #${orderId}`}
                                                </MenuItem>

                                            );

                                        }
                                    )}

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Financial Year"
                                    value={
                                        financialYear
                                    }
                                    onChange={event =>
                                        setFinancialYear(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Seller GSTIN"
                                    value={
                                        userGSTIN
                                    }
                                    onChange={event =>
                                        setUserGSTIN(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Place of Supply"
                                    value={
                                        placeOfSupply
                                    }
                                    onChange={event =>
                                        setPlaceOfSupply(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =============================================
                    CLASSIFICATION
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ mb: 2 }}
                        >
                            Invoice Classification
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Invoice Scenario"
                                    value={
                                        invoiceScenario
                                    }
                                    onChange={event =>
                                        setInvoiceScenario(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="B2B">
                                        B2B
                                    </MenuItem>

                                    <MenuItem value="B2C">
                                        B2C
                                    </MenuItem>

                                    <MenuItem value="Export">
                                        Export
                                    </MenuItem>

                                    <MenuItem value="SEZ">
                                        SEZ
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Category"
                                    value={
                                        category
                                    }
                                    onChange={event =>
                                        setCategory(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="Goods">
                                        Goods
                                    </MenuItem>

                                    <MenuItem value="Services">
                                        Services
                                    </MenuItem>

                                    <MenuItem value="Goods and Services">
                                        Goods and Services
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Transaction Type"
                                    value={
                                        transactionType
                                    }
                                    onChange={event =>
                                        setTransactionType(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="Sale">
                                        Sale
                                    </MenuItem>

                                    <MenuItem value="Credit Note">
                                        Credit Note
                                    </MenuItem>

                                    <MenuItem value="Debit Note">
                                        Debit Note
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Document Type"
                                    value={
                                        documentType
                                    }
                                    onChange={event =>
                                        setDocumentType(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="Invoice">
                                        Invoice
                                    </MenuItem>

                                    <MenuItem value="Tax Invoice">
                                        Tax Invoice
                                    </MenuItem>

                                    <MenuItem value="Bill of Supply">
                                        Bill of Supply
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Supply Type"
                                    value={
                                        supplyType
                                    }
                                    onChange={event =>
                                        setSupplyType(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="B2B">
                                        B2B
                                    </MenuItem>

                                    <MenuItem value="B2C">
                                        B2C
                                    </MenuItem>

                                    <MenuItem value="Export">
                                        Export
                                    </MenuItem>

                                    <MenuItem value="SEZ">
                                        SEZ
                                    </MenuItem>

                                    <MenuItem value="Deemed Export">
                                        Deemed Export
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Reverse Charge"
                                    value={
                                        reverseCharge
                                    }
                                    onChange={event =>
                                        setReverseCharge(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="No">
                                        No
                                    </MenuItem>

                                    <MenuItem value="Yes">
                                        Yes
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Status"
                                    value={
                                        invoiceStatus
                                    }
                                    onChange={event =>
                                        setInvoiceStatus(
                                            event.target.value
                                        )
                                    }
                                    select
                                >

                                    <MenuItem value="Draft">
                                        Draft
                                    </MenuItem>

                                    <MenuItem value="Open">
                                        Open
                                    </MenuItem>

                                    <MenuItem value="Completed">
                                        Completed
                                    </MenuItem>

                                    <MenuItem value="Cancelled">
                                        Cancelled
                                    </MenuItem>

                                </TextField>

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =============================================
                    SALES ORDER SUMMARY
                ============================================= */}

                {selectedOrder && (

                    <Card sx={{ mb: 2 }}>

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight="700"
                                sx={{ mb: 2 }}
                            >
                                Sales Order Details
                            </Typography>


                            <Grid
                                container
                                spacing={2}
                            >

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >

                                    <TextField
                                        fullWidth
                                        label="Order Number"
                                        value={
                                            getValue(
                                                selectedOrder,
                                                "orderNumber",
                                                "OrderNumber",
                                                "salesOrderNumber",
                                                "SalesOrderNumber"
                                            )
                                        }
                                        disabled
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >

                                    <TextField
                                        fullWidth
                                        label="Company"
                                        value={
                                            getValue(
                                                selectedOrder,
                                                "company_Name",
                                                "companyName",
                                                "Company_Name",
                                                "CompanyName"
                                            )
                                        }
                                        disabled
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >

                                    <TextField
                                        fullWidth
                                        label="Customer PO / Reference"
                                        value={
                                            getValue(
                                                selectedOrder,
                                                "otherReferences",
                                                "OtherReferences"
                                            )
                                        }
                                        disabled
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >

                                    <TextField
                                        fullWidth
                                        label="Order Total"
                                        value={
                                            `₹ ${money(
                                                getValue(
                                                    selectedOrder,
                                                    "totalAmount",
                                                    "TotalAmount"
                                                )
                                            )}`
                                        }
                                        disabled
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >

                                    <TextField
                                        fullWidth
                                        label="Order Date"
                                        value={
                                            getValue(
                                                selectedOrder,
                                                "orderDate",
                                                "OrderDate",
                                                "salesOrderDate",
                                                "SalesOrderDate"
                                            )
                                        }
                                        disabled
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >

                                    <TextField
                                        fullWidth
                                        label="E-Way Bill"
                                        value={
                                            transportData.eWayBillNumber ||
                                            ""
                                        }
                                        disabled
                                    />

                                </Grid>

                            </Grid>

                        </CardContent>

                    </Card>

                )}


                {/* =============================================
                    ITEMS
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            justifyContent="space-between"
                            alignItems={{
                                xs: "flex-start",
                                sm: "center"
                            }}
                            spacing={2}
                            sx={{ mb: 2 }}
                        >

                            <Box>

                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                >
                                    Invoice Items
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Items are populated from the
                                    selected sales order.
                                </Typography>

                            </Box>


                            <Button
                                variant="outlined"
                                startIcon={
                                    <Add />
                                }
                                onClick={
                                    handleAddItem
                                }
                            >
                                Add Item
                            </Button>

                        </Stack>


                        {items.length === 0 ? (

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 4,
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Select a Sales Order to
                                    load invoice items.
                                </Typography>

                            </Paper>

                        ) : (

                            <TableContainer
                                component={Paper}
                                variant="outlined"
                            >

                                <Table
                                    size="small"
                                >

                                    <TableHead>

                                        <TableRow>

                                            <TableCell>
                                                Product
                                            </TableCell>

                                            <TableCell>
                                                SKU
                                            </TableCell>

                                            <TableCell>
                                                HSN
                                            </TableCell>

                                            <TableCell>
                                                Qty
                                            </TableCell>

                                            <TableCell>
                                                UOM
                                            </TableCell>

                                            <TableCell>
                                                Unit Price
                                            </TableCell>

                                            <TableCell>
                                                Discount
                                            </TableCell>

                                            <TableCell>
                                                GST %
                                            </TableCell>

                                            <TableCell>
                                                Tax
                                            </TableCell>

                                            <TableCell>
                                                Total
                                            </TableCell>

                                            <TableCell>
                                                Stock
                                            </TableCell>

                                            <TableCell>
                                                Action
                                            </TableCell>

                                        </TableRow>

                                    </TableHead>


                                    <TableBody>

                                        {items.map(
                                            item => (

                                                <TableRow
                                                    key={
                                                        item.tempId
                                                    }
                                                >

                                                    <TableCell
                                                        sx={{
                                                            minWidth: 180
                                                        }}
                                                    >

                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="600"
                                                        >
                                                            {
                                                                item.productName
                                                            }
                                                        </Typography>

                                                        {item.description && (

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {
                                                                    item.description
                                                                }
                                                            </Typography>

                                                        )}

                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            item.sku ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            item.hsnCode ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>

                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={event =>
                                                                updateItem(
                                                                    item.tempId,
                                                                    "quantity",
                                                                    event.target.value
                                                                )
                                                            }
                                                            inputProps={{
                                                                min: 0,
                                                                step: "1"
                                                            }}
                                                            sx={{
                                                                width: 80
                                                            }}
                                                        />

                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            item.uom
                                                        }
                                                    </TableCell>


                                                    <TableCell>

                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            value={
                                                                item.unitPrice
                                                            }
                                                            onChange={event =>
                                                                updateItem(
                                                                    item.tempId,
                                                                    "unitPrice",
                                                                    event.target.value
                                                                )
                                                            }
                                                            inputProps={{
                                                                min: 0,
                                                                step: "0.01"
                                                            }}
                                                            sx={{
                                                                width: 110
                                                            }}
                                                        />

                                                    </TableCell>


                                                    <TableCell>

                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            value={
                                                                item.discount
                                                            }
                                                            onChange={event =>
                                                                updateItem(
                                                                    item.tempId,
                                                                    "discount",
                                                                    event.target.value
                                                                )
                                                            }
                                                            inputProps={{
                                                                min: 0,
                                                                step: "0.01"
                                                            }}
                                                            sx={{
                                                                width: 100
                                                            }}
                                                        />

                                                    </TableCell>


                                                    <TableCell>

                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            value={
                                                                item.gstPercentage
                                                            }
                                                            onChange={event =>
                                                                updateItem(
                                                                    item.tempId,
                                                                    "gstPercentage",
                                                                    event.target.value
                                                                )
                                                            }
                                                            inputProps={{
                                                                min: 0,
                                                                step: "0.01"
                                                            }}
                                                            sx={{
                                                                width: 80
                                                            }}
                                                        />

                                                    </TableCell>


                                                    <TableCell>
                                                        ₹{" "}
                                                        {money(
                                                            item.taxAmount
                                                        )}
                                                    </TableCell>


                                                    <TableCell>
                                                        ₹{" "}
                                                        {money(
                                                            item.total
                                                        )}
                                                    </TableCell>


                                                    <TableCell>

                                                        {item.availableStock ===
                                                        null ? (

                                                            <Chip
                                                                size="small"
                                                                label="N/A"
                                                            />

                                                        ) : (

                                                            <Chip
                                                                size="small"
                                                                color={
                                                                    item.availableStock >=
                                                                    item.quantity
                                                                        ? "success"
                                                                        : "error"
                                                                }
                                                                label={
                                                                    item.availableStock
                                                                }
                                                            />

                                                        )}

                                                    </TableCell>


                                                    <TableCell>

                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                handleDeleteItem(
                                                                    item.tempId
                                                                )
                                                            }
                                                        >

                                                            <Delete />

                                                        </IconButton>

                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )}

                                    </TableBody>

                                </Table>

                            </TableContainer>

                        )}

                    </CardContent>

                </Card>


                {/* =============================================
                    TAX SUMMARY
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ mb: 2 }}
                        >
                            GST / Tax Summary
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <Paper
                                    variant="outlined"
                                    sx={{ p: 2 }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        CGST
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                    >
                                        ₹{" "}
                                        {money(
                                            items.reduce(
                                                (
                                                    sum,
                                                    item
                                                ) =>
                                                    sum +
                                                    (
                                                        item.subtotal *
                                                        toNumber(
                                                            item.cgstPercentage
                                                        ) /
                                                        100
                                                    ),
                                                0
                                            )
                                        )}
                                    </Typography>

                                </Paper>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <Paper
                                    variant="outlined"
                                    sx={{ p: 2 }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        SGST
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                    >
                                        ₹{" "}
                                        {money(
                                            items.reduce(
                                                (
                                                    sum,
                                                    item
                                                ) =>
                                                    sum +
                                                    (
                                                        item.subtotal *
                                                        toNumber(
                                                            item.sgstPercentage
                                                        ) /
                                                        100
                                                    ),
                                                0
                                            )
                                        )}
                                    </Typography>

                                </Paper>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <Paper
                                    variant="outlined"
                                    sx={{ p: 2 }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        IGST
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                    >
                                        ₹{" "}
                                        {money(
                                            items.reduce(
                                                (
                                                    sum,
                                                    item
                                                ) =>
                                                    sum +
                                                    (
                                                        item.subtotal *
                                                        toNumber(
                                                            item.igstPercentage
                                                        ) /
                                                        100
                                                    ),
                                                0
                                            )
                                        )}
                                    </Typography>

                                </Paper>

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =============================================
                    TRANSPORT
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ mb: 2 }}
                        >
                            Transport & Delivery
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Vehicle Number"
                                    value={
                                        transportData.vehicleNo ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Transporter"
                                    value={
                                        transportData.transporterName ||
                                        transportData.transport ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Transport Mode"
                                    value={
                                        transportData.transportMode ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Transporter ID"
                                    value={
                                        transportData.transporterID ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Transport Document No"
                                    value={
                                        transportData.transporterDocNo ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Distance"
                                    value={
                                        transportData.distance ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="E-Way Bill Number"
                                    value={
                                        transportData.eWayBillNumber ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Delivery Note"
                                    value={
                                        transportData.deliveryNote ||
                                        ""
                                    }
                                    disabled
                                />

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =============================================
                    PAYMENT
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ mb: 2 }}
                        >
                            Payment
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Invoice Total"
                                    value={
                                        `₹ ${money(
                                            totalAmount
                                        )}`
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Paid Amount"
                                    value={
                                        paidAmount
                                    }
                                    onChange={event =>
                                        setPaidAmount(
                                            event.target.value
                                        )
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Balance Amount"
                                    value={
                                        `₹ ${money(
                                            balanceAmount
                                        )}`
                                    }
                                    disabled
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Payment Status"
                                    value={
                                        paymentStatus
                                    }
                                    onChange={event =>
                                        setPaymentStatus(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="Pending">
                                        Pending
                                    </MenuItem>

                                    <MenuItem value="Partial">
                                        Partial
                                    </MenuItem>

                                    <MenuItem value="Paid">
                                        Paid
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Remarks"
                                    value={
                                        remarks
                                    }
                                    onChange={event =>
                                        setRemarks(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =============================================
                    SUMMARY
                ============================================= */}

                <Card sx={{ mb: 2 }}>

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ mb: 2 }}
                        >
                            Invoice Summary
                        </Typography>


                        <Box
                            sx={{
                                maxWidth: 450,
                                ml: "auto"
                            }}
                        >

                            <Stack
                                spacing={1.5}
                            >

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >

                                    <Typography>
                                        Sub Total
                                    </Typography>

                                    <Typography fontWeight="600">
                                        ₹{" "}
                                        {money(
                                            subTotal
                                        )}
                                    </Typography>

                                </Stack>


                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >

                                    <Typography>
                                        Discount
                                    </Typography>

                                    <Typography fontWeight="600">
                                        ₹{" "}
                                        {money(
                                            discountAmount
                                        )}
                                    </Typography>

                                </Stack>


                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >

                                    <Typography>
                                        Tax
                                    </Typography>

                                    <Typography fontWeight="600">
                                        ₹{" "}
                                        {money(
                                            taxAmount
                                        )}
                                    </Typography>

                                </Stack>


                                <Divider />


                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >

                                    <Typography
                                        variant="h6"
                                        fontWeight="700"
                                    >
                                        Grand Total
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight="700"
                                    >
                                        ₹{" "}
                                        {money(
                                            totalAmount
                                        )}
                                    </Typography>

                                </Stack>

                            </Stack>

                        </Box>

                    </CardContent>

                </Card>


                {/* =============================================
                    ACTIONS
                ============================================= */}

                <Card>

                    <CardContent>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            justifyContent="flex-end"
                            spacing={2}
                        >

                            <Button
                                variant="outlined"
                                startIcon={
                                    <ArrowBack />
                                }
                                onClick={() =>
                                    navigate(
                                        "/sales-invoices"
                                    )
                                }
                                disabled={
                                    saving
                                }
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    <Save />
                                }
                                disabled={
                                    saving ||
                                    items.length === 0
                                }
                            >
                                {saving
                                    ? "Creating..."
                                    : "Create Sales Invoice"}
                            </Button>

                        </Stack>

                    </CardContent>

                </Card>

            </Box>


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={
                    Boolean(success)
                }
                autoHideDuration={
                    2000
                }
                onClose={() =>
                    setSuccess("")
                }
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setSuccess("")
                    }
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>

    );

};


export default SalesInvoiceCreate;