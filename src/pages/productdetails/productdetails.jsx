import React from 'react'
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from "react-router-dom"; 
import { apiUrl } from "../../api";

const Productdetails = () => {
  const { id } = useParams();

  const fetchdetails = async () => {
    const res = await fetch(`http://6a03a27c2afe8349b4b5654c.mockapi.io/api/users/user/${id}`);
    if (!res.ok) throw new Error("User not found");
    const data = await res.json();
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id], 
    queryFn: fetchdetails
  });

  if (isLoading) return <div className="single">Loading...</div>;
  if (error) return <div className="single">Error loading user details.</div>;

  // استخراج البيانات بناءً على هيكلة MockAPI الجديدة
  const firstName = data?.["first-name"] || data?.firstname || "";
  const lastName = data?.["last-name"] || data?.lastname || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const city = data?.city || data?.address?.city || "N/A";

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {/* زر التعديل يوجه الآن لصفحة الـ Edit الحقيقية */}
            <Link to={`/users/${id}`} className="editButton" style={{ textDecoration: "none" }}>
              Edit
            </Link>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&size=120`}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{fullName}</h1>
                
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data?.email || "N/A"}</span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{data?.phone || "N/A"}</span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {city}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Username:</span>
                  <span className="itemValue">{data?.username || "N/A"}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className={`itemValue status ${data?.status || "active"}`}>
                    {data?.status || "active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div>
      </div>
    </div>
  );
}

export default Productdetails;