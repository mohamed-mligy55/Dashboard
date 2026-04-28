import  Home  from "./pages/home/Home"
import {BrowserRouter,  Routes, Route } from "react-router-dom";
import Lists from "./pages/list/List"
import New from "./pages/new/New";
// في أعلى ملف App.jsx
import { DarkModeContextProvider } from "./components/context/darkModeContext";
import Productdetails from "./pages/productdetails/productdetails"
function App() {
 const userInputs = [
  { id: 1, label: "Username", type: "text", placeholder: "john_doe" },
  { id: 2, label: "Name and surname", type: "text", placeholder: "Jane Doe" },
  { id: 3, label: "Email", type: "mail", placeholder: "john_doe@gmail.com" },
  { id: 4, label: "Phone", type: "text", placeholder: "+1 234 567 89" },
  { id: 5, label: "Password", type: "password" },
  { id: 6, label: "Address", type: "text", placeholder: "Elton St. 216 NewYork" },
  { id: 7, label: "Country", type: "text", placeholder: "USA" },
];

  return (


    <DarkModeContextProvider>
    
        <Routes>
     
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<Lists />} />
          <Route path="/product/:id" element={<Productdetails/>} />
            <Route  path="new" element={<New  title="Add New Product" inputs={userInputs} />}/>
            
        </Routes>
       
     
    </DarkModeContextProvider>
  
    
  
 
  )
}

export default App
