import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [file, setFile] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");

  // 👉 API function
  const addUserApi = async (userData) => {
    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to add user");

    return res.json();
  };

  // 👉 Mutation
  const mutation = useMutation({
    mutationFn: addUserApi,
    onSuccess: () => {
      // 🔥 أهم سطر: تحديث جدول المستخدمين
     queryClient.invalidateQueries({
  queryKey: ["users"]
});
      navigate("/lists");
        setFirstName("");
  setLastName("");
  setUsername("");
  setPhone("");
  setEmail("");
  setStreet("");
  setCity("");
  setPassword("");
    },
    onError: () => {
  alert("Failed to add user");
},

  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
        id: Date.now(),
      email,
      username,
      password,
      phone,
      name: {
        firstname: firstName,
        lastname: lastName,
      },
      address: {
        city,
        street,
        number: 1,
        zipcode: "00000",
        geolocation: {
          lat: "0",
          long: "0",
        },
      },
    };

    mutation.mutate(userData);
  };

  return (
    <div className={`new ${theme.palette.mode}`}>
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
              <div className="inputs-section">

                <div className="form-group full-row">
                  <label>Image:</label>
                  <div className="upload-icon">
                    <input type="file" id="file-upload" hidden />
                    <label htmlFor="file-upload">📁</label>
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
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
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
                    />
                  </div>

                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Elton St."
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
                    />
                  </div>

                </div>

                <div className="button-container">
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Sending..." : "Send"}
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