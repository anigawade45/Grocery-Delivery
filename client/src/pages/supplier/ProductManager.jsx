import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit, Package, RotateCcw } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data?.products || res.data;
      if (!Array.isArray(data)) throw new Error("Invalid product data");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
      toast.error("Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setNewProduct((prev) => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.info("Please fill all required fields.");
      return;
    }

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

      toast.success(`Product ${editId ? "updated" : "added"} successfully!`);
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error saving product", err);
      toast.error("Failed to save product");
    }
  };

  const deleteProduct = async (id) => {
    const confirmed = await confirmAction(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/supplier/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
      toast.error("Failed to delete product");
    }
  };

  const restoreProduct = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/supplier/products/${id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product restored");
      fetchProducts();
    } catch (err) {
      console.error("Error restoring product", err);
      toast.error("Failed to restore product");
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
    setImagePreview(product.image?.url || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setImagePreview(null);
  };

  const activeProducts = products.filter((p) => !p.isDeleted);
  const deletedProducts = products.filter((p) => p.isDeleted);

  const confirmAction = (message = "Are you sure?") => {
    return new Promise((resolve, reject) => {
      const id = toast(
        ({ closeToast }) => (
          <div>
            <p>{message}</p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(id);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  toast.dismiss(id);
                }}
                className="px-3 py-1 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeButton: false,
        }
      );
    });
  };

  const renderProductItem = (product, isDeleted = false) => (
    <div
      key={product._id}
      className={`bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between hover:shadow transition-all ${
        isDeleted ? "opacity-60" : ""
      }`}
    >
      <div>
        <h4 className="text-lg font-bold text-orange-700">{product.name}</h4>
        <p className="text-sm text-gray-600">
          ₹{product.price} | Stock: {product.stock} {product.unit}
        </p>
        <p className="text-sm text-gray-500">{product.description}</p>
      </div>
      <div className="flex gap-3">
        {!isDeleted ? (
          <>
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
          </>
        ) : (
          <button
            onClick={() => restoreProduct(product._id)}
            className="text-green-600 hover:text-green-800"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-2">
          <Package className="text-orange-500" />
          {editId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="price"
            placeholder="Price (₹)"
            type="number"
            value={newProduct.price}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="stock"
            placeholder="Stock"
            type="number"
            value={newProduct.stock}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="unit"
            placeholder="Unit (kg/ltr)"
            value={newProduct.unit}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="category"
            placeholder="Category"
            value={newProduct.category}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleChange}
            className="input-style col-span-full"
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="col-span-full text-sm"
          />
          {imagePreview && (
            <div className="col-span-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            {editId ? "Update Product" : "Add Product"}
          </button>
          {editId && (
            <button
              onClick={resetForm}
              className="text-gray-500 hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Active Products Section */}
      <div className="space-y-4 mb-10">
        <h3 className="text-xl font-semibold text-orange-700 mb-2">
          Your Products
        </h3>
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : activeProducts.length === 0 ? (
          <p className="text-gray-500">No active products found.</p>
        ) : (
          activeProducts.map((product) => renderProductItem(product))
        )}
      </div>

      {/* Deleted Products Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Deleted Products
        </h3>
        {deletedProducts.length === 0 ? (
          <p className="text-gray-400 italic">No deleted products.</p>
        ) : (
          deletedProducts.map((product) => renderProductItem(product, true))
        )}
      </div>
    </div>
  );
};

export default ProductManager;
