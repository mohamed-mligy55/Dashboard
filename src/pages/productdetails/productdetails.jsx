import React from 'react'
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom"; // تأكد من المسار الصحيح للـ router

const Productdetails = () => {
  const { id } = useParams();

  const fetchdetails = async () => {
    // تأكد من البورت (5000 كما عملنا سابقاً)
    const res = await fetch(`http://localhost:4000/users/${id}`);
    if (!res.ok) throw new Error("User not found");
    const data = await res.json();
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id], // أضف id للـ key لضمان تحديث البيانات لكل مستخدم
    queryFn: fetchdetails
  });

  if (isLoading) return <div className="single">Loading...</div>;
  if (error) return <div className="single">Error loading user details.</div>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                // صورة افتراضية تعتمد على الاسم بما أن الـ API لا يحتوي على صور
                src={`https://ui-avatars.com/api/?name=${data?.name.firstname}+${data?.name.lastname}&background=random&size=120`}
                alt=""
                className="itemImg"
              />
              <div className="details">
                {/* دمج الاسم الأول والأخير من الـ API */}
                <h1 className="itemTitle">{data?.name.firstname} {data?.name.lastname}</h1>
                
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data?.email}</span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{data?.phone}</span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {data?.address.street}, {data?.address.number}, {data?.address.city}
                  </span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Zip Code:</span>
                  <span className="itemValue">{data?.address.zipcode}</span>
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