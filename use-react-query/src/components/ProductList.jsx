import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";

// const retreiveProducts = async () => {
//   console.log(obj);
//   const response = await axios.get("http://localhost:3000/products");
//   return response.data;
// };

// const handleDelete = (id) => {};

export default function ProductList({ setId, setEdit, onEdit }) {
  const queryClient = new QueryClient();
  const mutation = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:3000/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const { products, isLoading, error, setPage } = useContext(ProductContext);

  const handleDelete = (id) => {
    const result = confirm("Do you want to Delete");
    if (result) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <div>Fetching Products ..</div>;
  if (error) return <div>An error occured:{error.message}</div>;
  return (
    <div className="flex flex-col justify-center items-between w-3/5">
      <h2 className="text-3xl my-2 text-center">Product List</h2>
      <ul className="flex flex-wrap justify-center items-center">
        {products.data &&
          products.data.map((product) => (
            <li
              key={product.id}
              className="flex flex-col items-center m-2 border rounded-sm"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="object-cover h-48 w-80 rounded-sm"
              />
              <div className="flex justify-evenly w-full ">
                <p className="text-xl my-3">{product.title}</p>
                <button onClick={() => setId(product.id)}>Details</button>
              </div>

              <div className="flex justify-evenly w-full">
                <button
                  onClick={() => {
                    setEdit(true);
                    onEdit(product);
                  }}
                  className="bg-blue-500 hover:bg-blue-700
                   text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 mb-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded
                   transition duration-300 ease-in-out transform hover:-translate-y-1 mb-2"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>

      <div className="flex justify-center">
        {products.prev && (
          <button
            className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
            onClick={() => setPage(products.prev)}
          >
            Prev
          </button>
        )}
        {products.next && (
          <button
            className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
            onClick={() => setPage(products.next)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
