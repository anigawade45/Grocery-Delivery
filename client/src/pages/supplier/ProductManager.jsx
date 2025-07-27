import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import axios from "axios";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    unit: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token"); // assumes login stores JWT

  // Fetch supplier products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewProduct((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) =>
        formData.append(key, value)
      );

      if (editId) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/supplier/products/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/supplier/products`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data.products);
      resetForm();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/supplier/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const editProduct = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
      unit: product.unit,
      image: null,
    });
    setEditId(product._id);
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      unit: "",
      image: null,
    });
    setEditId(null);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {editId ? "Edit Product" : "Add New Product"}
      </h2>

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
          type="number"
          value={newProduct.price}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="stock"
          placeholder="Stock"
          type="number"
          value={newProduct.stock}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="unit"
          placeholder="Unit (kg/ltr)"
          value={newProduct.unit}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          className="p-2 border rounded col-span-full"
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="col-span-full"
        />
        <button
          onClick={handleSubmit}
          className="col-span-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          {editId ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">
                ₹{product.price} | Stock: {product.stock} {product.unit}
              </p>
              <p className="text-sm text-gray-500">{product.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editProduct(product)}
                className="text-blue-600 hover:underline"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
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
