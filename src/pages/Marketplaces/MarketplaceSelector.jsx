import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    Store,
    Zap,
    Shirt,
    ShoppingCart,
    Globe,
} from "lucide-react";

const marketplaces = [
    {
        name: "Amazon",
        description: "Manage Amazon marketplace orders and products",
        icon: ShoppingCart,
        path: "/amazon",
    },
    {
        name: "Flipkart",
        description: "Manage Flipkart marketplace operations",
        icon: ShoppingBag,
        path: "/flipkart",
    },
    {
        name: "Meesho",
        description: "Manage Meesho orders and catalog",
        icon: Store,
        path: "/meesho",
    },
    {
        name: "Blinkit",
        description: "Manage Blinkit marketplace operations",
        icon: Zap,
        path: "/blinkit",
    },
    {
        name: "Myntra",
        description: "Manage Myntra products and orders",
        icon: Shirt,
        path: "/myntra",
    },
    {
        name: "JioMart",
        description: "Manage JioMart marketplace operations",
        icon: ShoppingCart,
        path: "/jiomart",
    },
    {
        name: "Shopify",
        description: "Manage Shopify store operations",
        icon: Globe,
        path: "/shopify",
    },
];

const MarketplaceSelector = () => {
    const navigate = useNavigate();

    const handleMarketplaceClick = (marketplace) => {
        navigate(marketplace.path);
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            Select Marketplace
                        </h1>

                        <p style={styles.subtitle}>
                            Choose a marketplace to continue managing your
                            seller account.
                        </p>
                    </div>
                </div>

                {/* Marketplace Cards */}
                <div style={styles.grid}>
                    {marketplaces.map((marketplace) => {
                        const Icon = marketplace.icon;

                        return (
                            <div
                                key={marketplace.name}
                                style={styles.card}
                                onClick={() =>
                                    handleMarketplaceClick(marketplace)
                                }
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-5px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 10px 25px rgba(0,0,0,0.12)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(0,0,0,0.08)";
                                }}
                            >
                                {/* Icon */}
                                <div style={styles.iconContainer}>
                                    <Icon size={36} strokeWidth={1.8} />
                                </div>

                                {/* Content */}
                                <div style={styles.cardContent}>
                                    <h2 style={styles.cardTitle}>
                                        {marketplace.name}
                                    </h2>

                                    <p style={styles.cardDescription}>
                                        {marketplace.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div style={styles.arrow}>
                                    →
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "40px 24px",
        boxSizing: "border-box",
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
    },

    header: {
        marginBottom: "35px",
    },

    title: {
        margin: 0,
        fontSize: "32px",
        fontWeight: "700",
        color: "#1f2937",
    },

    subtitle: {
        marginTop: "10px",
        fontSize: "16px",
        color: "#6b7280",
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "22px",
    },

    card: {
        position: "relative",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "25px",
        minHeight: "190px",
        cursor: "pointer",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition:
            "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
    },

    iconContainer: {
        width: "65px",
        height: "65px",
        borderRadius: "12px",
        backgroundColor: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#2563eb",
        marginBottom: "18px",
    },

    cardContent: {
        flex: 1,
    },

    cardTitle: {
        margin: 0,
        fontSize: "21px",
        fontWeight: "600",
        color: "#111827",
    },

    cardDescription: {
        marginTop: "8px",
        marginBottom: 0,
        fontSize: "14px",
        lineHeight: "1.5",
        color: "#6b7280",
    },

    arrow: {
        position: "absolute",
        right: "22px",
        bottom: "20px",
        fontSize: "24px",
        color: "#2563eb",
        fontWeight: "500",
    },
};

export default MarketplaceSelector;

