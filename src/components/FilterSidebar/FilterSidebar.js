import React from "react";
import styles from "./FilterSidebar.module.css";

const FilterSidebar = ({
  categories,
  setCategories,
  setPriceRange,
  priceRange,
}) => {
  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setCategories({
      ...categories,
      [name]: checked,
    });
  };

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
  };

  return (
    <aside className={styles.filterContainer}>
      <h2>Filter</h2>
      <form>
        <label htmlFor="price">Price: {priceRange}</label>
        <input
          type="range"
          id="price"
          name="price"
          min="1"
          max="100000"
          className={styles.priceRange}
          step="10"
          defaultValue={priceRange}
          onChange={handlePriceRangeChange}
        />
        <h2>Category</h2>
        <div className={styles.categoryContainer}>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="mensFashion"
              name="mensFashion"
              onChange={handleCheckBoxChange}
            />
            <label htmlFor="mensFashion">Men's Clothing</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="womensFashion"
              name="womensFashion"
              onChange={handleCheckBoxChange}
            />
            <label htmlFor="womensFashion">Women's Clothing</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="jewelery"
              name="jewelery"
              onChange={handleCheckBoxChange}
            />
            <label htmlFor="jewelery">Jewelery</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="electronics"
              name="electronics"
              onChange={handleCheckBoxChange}
            />
            <label htmlFor="electronics">Electronics</label>
          </div>
        </div>
      </form>
    </aside>
  );
};

export default FilterSidebar;
