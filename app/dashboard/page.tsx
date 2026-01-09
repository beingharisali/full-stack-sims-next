import React from "react";
import { FaBox, FaWarehouse, FaShoppingCart, FaFileInvoice } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold p-4 m-3">
        Welcome to Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

  {/* Total Products */}
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex items-center justify-between group">
    <div>
      <h2 className="text-gray-500 text-base font-medium">Total Products</h2>
      <p className="text-3xl font-bold mt-3 text-gray-800">24</p>
    </div>
    <div className="p-5 rounded-full bg-blue-100 group-hover:bg-blue-200 transition">
      <FaBox className="text-3xl text-blue-600" />
    </div>
  </div>

  {/* Total Stock */}
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex items-center justify-between group">
    <div>
      <h2 className="text-gray-500 text-base font-medium">Total Stock</h2>
      <p className="text-3xl font-bold mt-3 text-gray-800">320</p>
    </div>
    <div className="p-5 rounded-full bg-green-100 group-hover:bg-green-200 transition">
      <FaWarehouse className="text-3xl text-green-600" />
    </div>
  </div>

  {/* Total Sales */}
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex items-center justify-between group">
    <div>
      <h2 className="text-gray-500 text-base font-medium">Total Sales</h2>
      <p className="text-3xl font-bold mt-3 text-gray-800">Rs. 85,000</p>
    </div>
    <div className="p-5 rounded-full bg-purple-100 group-hover:bg-purple-200 transition">
      <FaShoppingCart className="text-3xl text-purple-600" />
    </div>
  </div>

  {/* Invoices */}
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex items-center justify-between group">
    <div>
      <h2 className="text-gray-500 text-base font-medium">Invoices</h2>
      <p className="text-3xl font-bold mt-3 text-gray-800">12</p>
    </div>
    <div className="p-5 rounded-full bg-red-100 group-hover:bg-red-200 transition">
      <FaFileInvoice className="text-3xl text-red-600" />
    </div>
  </div>

</div>

  </div>


  );
}
