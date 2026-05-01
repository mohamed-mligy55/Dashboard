import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import {Link} from "react-router-dom"

const Lists = () => {
  console.log("LISTS RENDER");
  return (
    <>
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <div className="top">
          <h3>customer</h3>
          <Link to="/new">Add New</Link>
        </div>
        <Datatable/>
      </div>
    </div>
    </>
  )
}

export default Lists