import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../api";

const New = ({ title }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();

  // States للهوية والحقول
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");

  // دالة الإرسال إلى MockAPI
  const addUserApi = async (userData) => {
    const res = await fetch("https://6a03a27c2afe8349b4b5654c.mockapi.io/api/users/user", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to add user");
    }

    return res.json();
  };

  // 👉 Mutation لإدارة حالة الإضافة
  const mutation = useMutation({
    mutationFn: addUserApi,
    onSuccess: () => {
      // تحديث كاش البيانات لإظهار المستخدم الجديد فوراً في الجدول
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // التوجيه لصفحة القائمة
      navigate("/lists"); 

      // تصفير الحقول
      setFirstName("");
      setLastName("");
      setUsername("");
      setPhone("");
      setEmail("");
      setCity("");
      setPassword("");
    },
    onError: (err) => {
      alert("حدث خطأ أثناء الإضافة: " + err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 بناء الكائن بهيكل مسطح (Flat) ليتناسب مع MockAPI والجدول
    const userData = {
      "first-name": firstName, // نفس المفتاح المستخدم في الـ Datatable
      "last-name": lastName,
      "username": username,
      "email": email,
      "phone": phone,
      "city": city,
      "password": password,
      "status": "active", // حالة افتراضية
    };

    mutation.mutate(userData);
  };

  return (
    <div className={`new ${theme.palette.mode}`}>
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{title || "Add New User"}</h1>
        </div>

        <div className="add-user-container">
          <div className="header">
            <h1>User Details</h1>
          </div>

          <div className="form-card">
            <form className="user-form" onSubmit={handleSubmit} noValidate>
              <div className="inputs-section">
                
                <div className="form-group full-row">
                  <label>Image:</label>
                  <div className="upload-icon">
                    <input type="file" id="file-upload" hidden />
                    <label htmlFor="file-upload">📁</label>
                    <span style={{marginLeft: "10px", fontSize: "12px", color: "gray"}}>
                      (Avatar will be auto-generated)
                    </span>
                  </div>
                </div>

                <div className="inputs-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="john_doe"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 89"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john_doe@gmail.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cairo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                      required
                    />
                  </div>
                </div>

                <div className="button-container">
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Sending..." : "Add User"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;