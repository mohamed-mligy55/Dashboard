import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
const [username, setUsername] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [address, setAddress] = useState("");
const [password, setPassword] = useState("");
const [city, setCity] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();

  const userData = {
  
    username,
    phone,
    email,
   
    city,
  };

  try {
    const res = await fetch("http://localhost:4000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="add-user-container">
      <div className="header">
        <h1>Add New User</h1>
      </div>
      
      <div className="form-card">
        <form className="user-form" onSubmit={handleSubmit}>
        

          {/* القسم الأيمن: المدخلات */}
          <div className="inputs-section">
            
            <div className="form-group full-row">
              <label>Image:</label>
              <div className="upload-icon">
                <input type="file" id="file-upload" hidden />
                <label htmlFor="file-upload">
                  <i className="upload-box-icon">📁</i> {/* يمكنك استبدالها بأيقونة FontAwesome */}
                </label>
              </div>
            </div>

            <div className="inputs-grid">
              <div className="form-group">
                <label></label>
                <input  value={name}   onChange={(e) => setName(e.target.value)} type="text" placeholder="Jane" />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input  value={username}
  onChange={(e) => setUsername(e.target.value)} type="text" placeholder="john_doe" />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input   value={phone}
  onChange={(e) => setPhone(e.target.value)} type="text" placeholder="+1 234 567 89" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email"  value={email}
  onChange={(e) => setEmail(e.target.value)} placeholder="john_doe@gmail.com" />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text"   value={address}
  onChange={(e) => setAddress(e.target.value)} placeholder="Elton St. 216 NewYork" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password"   value={password}
  onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="form-group">
                {/* ترك مساحة فارغة أو إضافة حقل الدولة كما بالصورة */}
                <label>Country</label>
                <input type="text" placeholder="USA"  value={city}
  onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="send-btn">Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
       </div>
       </div>
  );
};
export default New