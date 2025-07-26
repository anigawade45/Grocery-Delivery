import tomatoImg from "../assets/tomato.png";
import milkImg from "../assets/milk.png";
import chickenImg from "../assets/chicken.png";
import flourImg from "../assets/flour.png";
import chiliImg from "../assets/chili.png";
import onionImg from "../assets/onion.png";
import riceImg from "../assets/rice.png";
import paneerImg from "../assets/paneer.png";
import profile1 from "../assets/profile1.png";
import profile2 from "../assets/profile2.png";
import profile3 from "../assets/profile3.png";
import profile4 from "../assets/profile4.png";
import profile5 from "../assets/profile5.png";

// ✅ PRODUCTS
export const products = [
    { _id: "p1", name: "Tomatoes", description: "Fresh farm tomatoes", price: 30, unit: "kg", category: "Vegetables", supplier: "FreshKart", image: tomatoImg, inStock: true, rating: 4.6, reviewsCount: 82 },
    { _id: "p2", name: "Milk", description: "Full cream dairy milk", price: 48, unit: "liter", category: "Dairy", supplier: "AgroHub", image: milkImg, inStock: true, rating: 4.8, reviewsCount: 140 },
    { _id: "p3", name: "Chicken", description: "Fresh farm chicken", price: 180, unit: "kg", category: "Meat", supplier: "FarmToFork", image: chickenImg, inStock: false, rating: 4.2, reviewsCount: 55 },
    { _id: "p4", name: "Wheat Flour", description: "Organic wheat flour", price: 45, unit: "kg", category: "Grains", supplier: "FreshKart", image: flourImg, inStock: true, rating: 4.5, reviewsCount: 73 },
    { _id: "p5", name: "Green Chilies", description: "Spicy fresh chilies", price: 60, unit: "kg", category: "Spices", supplier: "AgroHub", image: chiliImg, inStock: true, rating: 4.1, reviewsCount: 41 },
    { _id: "p6", name: "Red Onions", description: "Shelf-stable onions", price: 28, unit: "kg", category: "Vegetables", supplier: "FreshKart", image: onionImg, inStock: true, rating: 4.4, reviewsCount: 66 },
    { _id: "p7", name: "Basmati Rice", description: "Aromatic long-grain rice", price: 90, unit: "kg", category: "Grains", supplier: "RiceMart", image: riceImg, inStock: true, rating: 4.7, reviewsCount: 110 },
    { _id: "p8", name: "Paneer", description: "Cottage cheese cubes", price: 210, unit: "kg", category: "Dairy", supplier: "AgroHub", image: paneerImg, inStock: true, rating: 4.9, reviewsCount: 94 },
    { _id: "p9", name: "Curd", description: "Fresh thick curd", price: 35, unit: "kg", category: "Dairy", supplier: "DairyFresh", image: milkImg, inStock: true, rating: 4.3, reviewsCount: 62 },
    { _id: "p10", name: "Turmeric", description: "Pure turmeric powder", price: 150, unit: "kg", category: "Spices", supplier: "SpiceWorld", image: chiliImg, inStock: true, rating: 4.5, reviewsCount: 80 },
];

export const orderHistory = [
    { _id: "o1", orderId: "ORD001", date: "2025-07-01", status: "Delivered", totalAmount: 500, items: [{ name: "Milk", quantity: 5, unitPrice: 48 }] },
    { _id: "o2", orderId: "ORD002", date: "2025-07-03", status: "Pending", totalAmount: 210, items: [{ name: "Paneer", quantity: 1, unitPrice: 210 }] },
    { _id: "o3", orderId: "ORD003", date: "2025-07-05", status: "Cancelled", totalAmount: 360, items: [{ name: "Tomatoes", quantity: 4, unitPrice: 30 }, { name: "Onions", quantity: 3, unitPrice: 28 }] },
    { _id: "o4", orderId: "ORD004", date: "2025-07-06", status: "Delivered", totalAmount: 180, items: [{ name: "Chicken", quantity: 1, unitPrice: 180 }] },
    { _id: "o5", orderId: "ORD005", date: "2025-07-08", status: "Delivered", totalAmount: 90, items: [{ name: "Rice", quantity: 1, unitPrice: 90 }] },
    { _id: "o6", orderId: "ORD006", date: "2025-07-10", status: "Delivered", totalAmount: 135, items: [{ name: "Flour", quantity: 3, unitPrice: 45 }] },
    { _id: "o7", orderId: "ORD007", date: "2025-07-12", status: "Pending", totalAmount: 180, items: [{ name: "Turmeric", quantity: 1, unitPrice: 150 }, { name: "Chilies", quantity: 1, unitPrice: 30 }] },
    { _id: "o8", orderId: "ORD008", date: "2025-07-14", status: "Delivered", totalAmount: 320, items: [{ name: "Curd", quantity: 4, unitPrice: 35 }, { name: "Milk", quantity: 2, unitPrice: 48 }] },
    { _id: "o9", orderId: "ORD009", date: "2025-07-17", status: "Delivered", totalAmount: 56, items: [{ name: "Onions", quantity: 2, unitPrice: 28 }] },
    { _id: "o10", orderId: "ORD010", date: "2025-07-20", status: "Delivered", totalAmount: 120, items: [{ name: "Rice", quantity: 1, unitPrice: 90 }, { name: "Flour", quantity: 1, unitPrice: 30 }] },
];

export const userDummyData = [
    { _id: "u1", fullName: "Rajesh Kumar", email: "rajesh@vendor.com", role: "vendor", profilePic: profile1, bio: "Street food specialist", location: "Delhi" },
    { _id: "u2", fullName: "Suman Devi", email: "suman@supplier.com", role: "supplier", profilePic: profile2, bio: "Trusted veggie supplier", location: "Lucknow" },
    { _id: "u3", fullName: "Amit Verma", email: "amit@vendor.com", role: "vendor", profilePic: profile3, bio: "Running dosa stall", location: "Mumbai" },
    { _id: "u4", fullName: "Neha Rathi", email: "neha@supplier.com", role: "supplier", profilePic: profile4, bio: "Dairy & grains distributor", location: "Bengaluru" },
    { _id: "u5", fullName: "Vikram Shah", email: "vikram@vendor.com", role: "vendor", profilePic: profile5, bio: "Daily chaat seller", location: "Ahmedabad" },
    { _id: "u6", fullName: "Rani Mehta", email: "rani@supplier.com", role: "supplier", profilePic: profile2, bio: "Organic produce supplier", location: "Pune" },
    { _id: "u7", fullName: "Kunal Joshi", email: "kunal@vendor.com", role: "vendor", profilePic: profile3, bio: "Momos vendor", location: "Chandigarh" },
    { _id: "u8", fullName: "Meera Das", email: "meera@supplier.com", role: "supplier", profilePic: profile4, bio: "Rice and pulses expert", location: "Kolkata" },
    { _id: "u9", fullName: "Arjun Yadav", email: "arjun@vendor.com", role: "vendor", profilePic: profile1, bio: "Paratha & chai shop owner", location: "Jaipur" },
    { _id: "u10", fullName: "Sneha Gupta", email: "sneha@supplier.com", role: "supplier", profilePic: profile5, bio: "Fast delivery network", location: "Hyderabad" },
];

export const mockSuppliers = [
    {
        id: "s1",
        name: "Anil Sharma",
        email: "anil@supplyhub.com",
        phone: "9876543210",
        status: "Pending",
        documents: {
            downloadUrl: "/docs/anil-verification.pdf",
            files: [
                { name: "License.pdf", url: "/docs/license.pdf" },
                { name: "Aadhar.pdf", url: "/docs/aadhar.pdf" },
            ],
        },
    },
    {
        id: "s2",
        name: "Meena Traders",
        email: "contact@meenatraders.in",
        phone: "8123456789",
        status: "Approved",
        documents: {
            downloadUrl: "/docs/meena-verification.pdf",
            files: [{ name: "GST.pdf", url: "/docs/gst.pdf" }],
        },
    },
];

