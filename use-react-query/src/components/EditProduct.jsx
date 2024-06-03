import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";

export default function EditProduct({ product, setEdit }) {
  const queryClient = useQueryClient();
  const { products } = useContext(ProductContext);
  console.log("Data", products);

  const [state, setState] = useState(product);
  console.log("Data", state);

  const mutation = useMutation({
    mutationFn: (state) =>
      axios.put(`http://localhost:3000/products/${state.id}`, state),

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["products"]); //means fetch new things
    },

    onMutate: (variables) => {
      return { greetings: "Say Hello" };
    },
  });
  const submitData = (event) => {
    event.preventDefault();
    console.log(state);
    const newData = products.data.map((p) => {
      if (p.id === state.id) {
        console.log("Hello");
        return state;
      } else {
        return p;
      }
    });
    console.log(newData);
    // let newData = products.data.map((p) => (p.id === state.id ? state : p));
    // console.log(state);
    // console.log("rerer", products.data);
    // setState(newData);
    // console.log("NewData", newData);
    // // }
    mutation.mutate(state);
    setState({
      id: "",
      title: "",
      description: "",
      price: 0,
      rating: 5,
      thumbnail: "",
    });
    setEdit(false);
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

  return (
    <div className="m-2 p-2 bg-gray-100 w-1/5 h-1/2">
      <h2 className="text-2xl my-2">Edit a Product</h2>
      {/* {mutation.isSuccess && <p>Product Updated!</p>} */}
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
          Edit
        </button>
      </form>
    </div>
  );
}
