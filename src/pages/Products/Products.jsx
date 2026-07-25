import { useState } from "react";
import "./Products.css";

const Products = () => {

  const [products, setProducts] = useState([]);

  return (

    <div className="products-page">

      <div className="page-header">

        <h2>Products</h2>

        <button className="add-btn">
          + Add Product
        </button>

      </div>

      <div className="search-section">

        <input
          type="text"
          placeholder="Search Product..."
          className="search-box"
        />

      </div>

      <table className="product-table">

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {products.length === 0 ? (

            <tr>

              <td colSpan="7">

                No Products Found

              </td>

            </tr>

          ) : (

            products.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td>{item.stock}</td>
                <td>{item.status}</td>

                <td>

                  <button>Edit</button>

                  <button>Delete</button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

};

export default Products;