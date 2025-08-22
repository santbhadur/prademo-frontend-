import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Fetch sales data from backend
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bills");
        const data = await response.json();

        // 🔹 Format daily sales
        const daily = data.map((bill) => ({
          date: new Date(bill.billDate).toLocaleDateString("en-GB"), // DD/MM/YYYY
          total: bill.grandTotal,
        }));

        // 🔹 Group sales by month
        const monthlyMap = {};
        data.forEach((bill) => {
          const month = new Date(bill.billDate).toLocaleString("en-GB", {
            month: "short",
            year: "numeric",
          });
          monthlyMap[month] = (monthlyMap[month] || 0) + bill.grandTotal;
        });

        const monthly = Object.keys(monthlyMap).map((month) => ({
          month,
          total: monthlyMap[month],
        }));

        setSalesData(daily);
        setMonthlyData(monthly);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };

    fetchSales();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sales Dashboard</h2>

      {/* Daily Sales Line Chart */}
      <h3>Daily Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* Monthly Totals Bar Chart */}
      <h3 style={{ marginTop: "40px" }}>Monthly Sales Totals</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
