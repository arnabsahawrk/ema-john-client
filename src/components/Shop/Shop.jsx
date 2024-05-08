import React, { useEffect, useState } from "react";
import { addToDb, deleteShoppingCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const storedCart = useLoaderData();
  const [cart, setCart] = useState(storedCart);
  const [products, setProducts] = useState([]);
  //Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(null);
  const numOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numOfPages).keys()];

  useEffect(() => {
    fetch("http://localhost:5000/productsCount")
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${
        currentPage - 1
      }&size=${itemsPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemsPerPage]);

  const handleAddToCart = (product) => {
    let newCart = [];
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div>
        <p style={{ textAlign: "center" }}>Current Page: {currentPage}</p>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {pages.map((page, idx) => (
            <button
              onClick={() => setCurrentPage(page + 1)}
              className={currentPage === page + 1 ? "paginationActive" : ""}
              key={idx}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pages.length}
          >
            Next
          </button>
          <select
            style={{ padding: "0 1rem" }}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseFloat(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Shop;
