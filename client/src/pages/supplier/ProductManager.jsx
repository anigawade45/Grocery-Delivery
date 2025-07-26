import React, { useState } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Tomato",
    price: 25,
    stock: 100,
    description: "Fresh farm tomatoes",
  },
  {
    id: 2,
    name: "Paneer",
    price: 240,
    stock: 20,
    description: "Homemade soft paneer",
  },
];

export default function ProductManager() {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const updated = [...products];
    if (editIndex !== null) {
      updated[editIndex] = { ...newProduct, id: updated[editIndex].id };
      setEditIndex(null);
    } else {
      updated.push({ ...newProduct, id: Date.now() });
    }
    setProducts(updated);
    setNewProduct({ name: "", price: "", stock: "", description: "" });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const editProduct = (index) => {
    setNewProduct(products[index]);
    setEditIndex(index);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Product name"
          value={newProduct.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="price"
          placeholder="Price (₹)"
          value={newProduct.price}
          onChange={handleChange}
          type="number"
          className="p-2 border rounded"
        />
        <input
          name="stock"
          placeholder="Stock (kg/ltr)"
          value={newProduct.stock}
          onChange={handleChange}
          type="number"
          className="p-2 border rounded"
        />
        <input
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          onClick={addProduct}
          className="col-span-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          {editIndex !== null ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">₹{product.price} | Stock: {product.stock}</p>
              <p className="text-sm text-gray-500">{product.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editProduct(index)}
                className="text-blue-600 hover:underline"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="text-red-600 hover:underline"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
