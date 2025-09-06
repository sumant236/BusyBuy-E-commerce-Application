import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import { addDataToCollection } from "../../utils/utils";
import data from "../../utils/data";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import ProductList from "../../components/Product/ProductList/ProductList";
import Loader from "../../components/UI/Loader/Loader";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState("75000");
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({
    mensFashion: false,
    womensFashion: false,
    jewelery: false,
    electronics: false,
  });

  // Write logic to Fetch products on app mount
  useEffect(() => {
    addDataToCollection();
    getDataFromCollection();
  }, []);

  useEffect(() => {
    filterProductFromState();
  }, [priceRange, categories, searchInput]);

  const getDataFromCollection = () => {
    onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      setProducts(productList);
    });
  };

  // Write logic to Rerender the products if the search or filter parameters change
  const filterProductFromState = () => {
    setLoading(false);

    // Create a mapping between your checkbox keys and the product categories.
    const categoryMap = {
      mensFashion: "men's clothing",
      womensFashion: "women's clothing",
      jewelery: "jewelery",
      electronics: "electronics",
    };

    // Get a list of the categories that are currently checked.
    const activeCategories = Object.keys(categories)
      .filter((key) => categories[key] === true)
      .map((key) => categoryMap[key]);

    // Use a single filter operation to apply all three conditions.
    const finalFilteredProducts = data.filter((product) => {
      // Check if the product's title includes the search text (case-insensitive).
      // This is the fix for your error.
      const isSearchMatch = product.title
        .toLowerCase()
        .includes(searchInput.toLowerCase());

      // Check if the product is within the price range.
      const isPriceInRange = product.price <= Number(priceRange);

      // Check if the product's category is selected.
      // If no categories are active, all products pass this check.
      const isCategorySelected =
        activeCategories.length === 0 ||
        activeCategories.includes(product.category);

      // All three conditions must be true for the product to be included.
      return isSearchMatch && isPriceInRange && isCategorySelected;
    });

    setProducts(finalFilteredProducts);
    setLoading(false);
  };

  return (
    <div className={styles.homePageContainer}>
      <FilterSidebar
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        setCategories={setCategories}
        categories={categories}
      />
      <form className={styles.form}>
        <input
          type="search"
          placeholder="Search By Name"
          className={styles.searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>
      {/* Component to display the product using the ProductList */}
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : (
        <ProductList products={products} onCart={false} />
      )}
    </div>
  );
}

export default HomePage;
