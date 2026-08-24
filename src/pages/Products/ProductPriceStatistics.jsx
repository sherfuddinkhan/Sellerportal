import React from "react";

const ProductPriceStatistics = ({
    totalProducts = 0,
    activeProducts = 0,
    inactiveProducts = 0
}) => {

    return (
        <div className="product-price-statistics">

            <div className="stat-card">
                <h4>Total Products</h4>
                <strong>{totalProducts}</strong>
            </div>

            <div className="stat-card">
                <h4>Active Products</h4>
                <strong>{activeProducts}</strong>
            </div>

            <div className="stat-card">
                <h4>Inactive Products</h4>
                <strong>{inactiveProducts}</strong>
            </div>

        </div>
    );
};

export default ProductPriceStatistics;