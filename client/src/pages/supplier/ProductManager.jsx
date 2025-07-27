import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductManager = () => {
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
  const [imagePreview, setImagePreview] = useState(null); // 🧠 Add this
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, [token]);

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
      toast.error("❌ Failed to fetch products");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setNewProduct((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file)); // 🧠 Show preview
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newProduct) {
        if (newProduct[key]) formData.append(key, newProduct[key]);
      }

      const url = editId
        ? `${import.meta.env.VITE_API_URL}/api/supplier/products/${editId}`
        : `${import.meta.env.VITE_API_URL}/api/supplier/products`;

      const method = editId ? "patch" : "post";

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`✅ Product ${editId ? "updated" : "added"} successfully!`);
      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error saving product", err);
      toast.error("❌ Failed to save product");
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
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("🗑️ Product deleted");
    } catch (err) {
      console.error("Error deleting product", err);
      toast.error("❌ Failed to delete product");
    }
  };

  const editProduct = (product) => {
    setNewProduct({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      category: product.category || "",
      unit: product.unit || "",
      image: null,
    });
    setEditId(product._id);
    setImagePreview(product.image?.url || null); // 🧠 Preview existing image
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
    setImagePreview(null); // 🧠 Clear preview
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-4xl mx-auto">
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

        {/* 🖼️ Image input and preview */}
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="col-span-full"
        />

        {imagePreview && (
          <div className="col-span-full">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}

        {/* 🧾 List of all products for edit/delete */}
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your Products
          </h3>

          <button
            onClick={handleSubmit}
            className="col-span-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            {editId ? "Update Product" : "Add Product"}
          </button>
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded flex justify-between items-center bg-gray-50"
              >
                <div>
                  <h4 className="font-semibold text-orange-700">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ₹{product.price} | Stock: {product.stock} {product.unit}
                  </p>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
