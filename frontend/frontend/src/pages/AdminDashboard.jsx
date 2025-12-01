import React from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-grid">
        
        {/* Customers */}
        <div className="admin-box">
          <h2 className="box-title">Customers</h2>
          <p className="box-desc">Manage all registered customers.</p>

          <button
            onClick={() => (window.location.href = "http://127.0.0.1:8000/api/api/customers/")}
            className="btn btn-blue"
          >
            View Customers →
          </button>
        </div>

        {/* Restaurants */}
        <div className="admin-box">
          <h2 className="box-title">Restaurants</h2>
          <p className="box-desc">View or manage restaurant partners.</p>

          <button
            onClick={() => window.location.href = "http://127.0.0.1:8000/admin/accounts/menuitem/add/"}
             className="btn btn-green"
          >
            View Restaurants →
          </button>
        </div>

        {/* Orders */}
        <div className="admin-box">
          <h2 className="box-title">Orders</h2>
          <p className="box-desc">Monitor all customer orders.</p>

          <button
            onClick={() => (window.location.href = "http://127.0.0.1:8000/admin/accounts/customerorderitem/")}
            className="btn btn-purple"
          >
            View All Orders →
          </button>
        </div>

        {/* Reports */}
        <div className="admin-box">
          <h2 className="box-title">Reports</h2>
          <p className="box-desc">Analytics & system reports.</p>

          <button
            onClick={() => alert("Report section coming soon")}
            className="btn btn-dark"
          >
            Generate Reports →
          </button>
        </div>
      </div>
    </div>
  );
}
