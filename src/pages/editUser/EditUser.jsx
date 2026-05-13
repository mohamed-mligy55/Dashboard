import "./editUser.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useTheme } from "@mui/material/styles";
import { apiUrl } from "../../api";

const EditUser = ({ title }) => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");

  // 1. جلب بيانات المستخدم الحالية
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(`http://6a03a27c2afe8349b4b5654c.mockapi.io/api/users/user/${id}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
  });

  // 2. توزيع البيانات في الـ Inputs عند تحميلها
  useEffect(() => {
    if (user) {
      // قراءة المفاتيح بناءً على هيكلة MockAPI الجديدة
      setFirstName(user["first-name"] || user.firstname || "");
      setLastName(user["last-name"] || user.lastname || "");
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setCity(user.city || user.address?.city || "");
    }
  }, [user]);

  // 3. دالة التحديث (PATCH)
  const updateUser = async (updatedData) => {
    const res = await fetch(`https://6a03a27c2afe8349b4b5654c.mockapi.io/api/users/user/${id}`, {
      method: "PUT", // MockAPI يفضل PUT للتحديث الكامل أو PATCH للتحديث الجزئي
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Update failed");
    return res.json();
  };

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // تحديث الكاش وإعادة التوجيه
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      navigate("/lists"); // التوجيه لصفحة الجدول بعد النجاح
    },
    onError: () => {
      alert("حدث خطأ أثناء التحديث");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // بناء الكائن بنفس مفاتيح السيرفر (Flat Structure)
    const userData = {
      "first-name": firstName,
      "last-name": lastName,
      username,
      email,
      phone,
      city,
    };

    if (password.trim() !== "") {
      userData.password = password;
    }

    mutation.mutate(userData);
  };

  if (isLoading) return <div className="new">Loading...</div>;

  return (
    <div className={`new ${theme.palette.mode}`}>
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{title || "Edit User"}</h1>
        </div>

        <div className="add-user-container">
          <div className="header">
            <h1>Edit User Information</h1>
          </div>

          <div className="form-card">
            <form className="user-form" onSubmit={handleSubmit}>
              <div className="inputs-section">
                
                <div className="form-group full-row">
                  <label>Image:</label>
                  <div className="upload-icon">
                    <input type="file" id="file-upload" hidden />
                    <label htmlFor="file-upload">📁</label>
                    <span style={{marginLeft: "10px", fontSize: "12px", color: "gray"}}>
                       (Avatar is auto-generated from name)
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
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="button-container">
                  <button 
                    type="submit" 
                    className="send-btn" 
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Updating..." : "Update User"}
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

export default EditUser;