import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";
import { ProductContext } from "./contexts/ProductContext";
function App() {
  const [id, setId] = useState(null);
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState();

  const retreiveProducts = async ({ queryKey }) => {
    // const response = await axios.get(`http://localhost:3000/${queryKey[0]}`);
    const response = await axios.get(
      `http://localhost:3000/products?_page=${queryKey[1].page}&_per_page=6`
    );
    console.log(response.data);
    return response.data;
  };
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    // queryKey: ["products"],
    queryKey: ["products", { page }],
    queryFn: retreiveProducts,
    retry: false,
    // staleTime: 5000, no needd if we have already used it in root
    refetchInterval: 1000,
  });

  // const [products, setProducts] = useState(data);

  return (
    <div className="flex m-2">
      <ProductContext.Provider value={{ products, error, isLoading, setPage }}>
        {!isEditing ? (
          <AddProduct />
        ) : (
          <EditProduct product={product} setEdit={setIsEditing} />
        )}
        <ProductList setId={setId} setEdit={setIsEditing} onEdit={setProduct} />
        <ProductDetails id={id} />
      </ProductContext.Provider>
    </div>
  );
}

export default App;
