import "./editUser.scss";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useTheme } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const EditUser = ({ title }) => {
     const theme = useTheme(); // 
  const { id } = useParams();
  const navigate = useNavigate(); // لإعادة التوجيه بعد النجاح
  
  // States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const queryClient = useQueryClient();
  const [password, setPassword] = useState(""); // يفضل الحذر عند تعديل الباسورد



  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/users/${id}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.name?.firstname || "");
      setLastName(user.name?.lastname || "");
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setStreet(user.address?.street || "");
      setCity(user.address?.city || "");
    }
  }, [user]);
   
const updateUser = async (updatedData) => {
  const res = await fetch(`http://localhost:5000/users/${id}`, {
    method: "PATCH",
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
   queryClient.invalidateQueries({ queryKey: ["user", id] });
    navigate("/lists"); // مش lists
  },
  onError: () => {
    alert("Update failed");
  },
});
  // 2. دالة التحديث
  const handleSubmit = async (e) => {
    e.preventDefault();
   const userData = {
    email,
    username,
    phone,
    name: {
      firstname: firstName,
      lastname: lastName,
    },
    address: {
      city,
      street,
    },
  };


    // بناء الكائن مع التأكد من عدم إرسال باسورد فارغ إذا لم يتم تغييره
 

    // إضافة الباسورد فقط إذا قام المستخدم بكتابة شيء جديد
    if (password.trim() !== "") {
      userData.password = password;
    }
        mutation.mutate(userData);
 
  };
  return (
    <div className={`new ${theme.palette.mode}`}>
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          {/* تغيير العنوان ليكون معبراً عن التعديل */}
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
                    <label htmlFor="file-upload">
                      📁
                    </label>
                  </div>
                </div>

                <div className="inputs-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder="john_doe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      placeholder="+1 234 567 89"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="john_doe@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      placeholder="Elton St."
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="Cairo"
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
                  <button type="submit" className="send-btn">
                    Update User
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