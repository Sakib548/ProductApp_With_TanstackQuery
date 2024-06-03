import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const retreiveProduct = async ({ queryKey }) => {
  //   const response = await axios.get(`http://localhost:3000/products/${id}`);
  const response = await axios.get(
    `http://localhost:3000/${queryKey[0]}/${queryKey[1]}`
  );
  return response.data;
};
export default function ProductDetails({ id }) {
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: retreiveProduct,
    enabled: id !== null, //disables this query from automatically running.
  });

  if (!id) return <p className="w-1/4">Click a product to see details</p>;
  if (isLoading) return <div>Fetching Product Details ..</div>;
  if (error) return <div>An error occured:{error.message}</div>;

  console.log(product, error, isLoading);
  return (
    <div className="w-1/4">
      <h1 className="text-3xl my-2">Product Details</h1>
      <div className="border bg-gray-100 p-1 text-md rounded flex flex-col text-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-cover h-24 w-24 border rounded-full m-auto"
        />
        <p className="text-gray-800 ">{product.title}</p>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-green-600 font-semibold">Price:{product.price}</p>
        <p className="text-yellow-500">Rating:{product.rating}</p>
      </div>
    </div>
  );
}
