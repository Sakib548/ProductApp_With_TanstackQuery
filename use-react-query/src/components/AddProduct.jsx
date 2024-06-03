import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";

export default function AddProduct({ id }) {
  const queryClient = useQueryClient();
  const { products } = useContext(ProductContext);

  const [state, setState] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    rating: 5,
    thumbnail: "",
  });
  // useEffect(() => {
  //   if (product) {
  //     setState({
  //       id: product.id,
  //       title: product.title,
  //       description: product.description,
  //       price: product.price,
  //       rating: product.rating,
  //       thumbnail: product.thumbnail,
  //     });
  //   }
  // }, [product]);
  const mutation = useMutation({
    mutationFn: (newProduct) =>
      axios.post("http://localhost:3000/products", newProduct),
    // : axios.put(`http://localhost:3000/products/${id}`, state),
    ////only this lines is required to Add data
    ///onSucces can be called without any parameters
    onSuccess: (data, variables, context) => {
      // console.log(context);
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["products"]); //means fetch new things
    },

    onMutate: (variables) => {
      //calls before starting mutation
      return { greetings: "Say Hello" };
    },
  });
  const submitData = (event) => {
    event.preventDefault();
    //console.log(state);

    let newData = {
      ...state,
      id: crypto.randomUUID().toString(),
    };
    // } else {
    //   console.log("rerer", products.data);
    // newData = products.data.map((p) => (p.id === id ? state : p));
    // console.log(state);
    // console.log("rerer", products.data);
    // setState(newData);
    // console.log("NewData", newData);
    // }
    mutation.mutate(newData);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "number"
        ? event.target.valueAsNumber
        : event.target.value;

    setState({
      ...state,
      [name]: value,
    });

    console.log(state);
  };

  if (mutation.isLoading) {
    return <span>Submitting ...</span>;
  }
  if (mutation.isError) {
    return <span>Error:{mutation.error.message}</span>;
  }
  return (
    <div className="m-2 p-2 bg-gray-100 w-1/5 h-1/2">
      <h2 className="text-2xl my-2">{!id ? "Add" : "Edit"} a Product</h2>
      {mutation.isSuccess && <p>Product Added!</p>}
      <form className="flex flex-col" onSubmit={submitData}>
        <input
          type="text"
          value={state.title}
          name="title"
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product title"
        />
        <textarea
          value={state.description}
          name="description"
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product description"
        />

        <input
          type="number"
          value={state.price}
          name="price"
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product price"
        />
        <input
          type="text"
          value={state.thumbnail}
          name="thumbnail"
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product thumbnail URL"
        />

        <button
          //  disabled={mutation.isLoading}
          type="submit"
          className="bg-black m-auto text-white text-xl p-1 rounded-md"
        >
          Add
        </button>
      </form>
    </div>
  );
}
