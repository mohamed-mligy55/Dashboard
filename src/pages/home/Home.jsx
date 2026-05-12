import { lazy, Suspense } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";

const Feature = lazy(() => import("../../components/featured/Featured"));
const Chart = lazy(() => import("../../components/chart/Chart"));
const Tabledata = lazy(() => import("../../components/table/Table"));

const SectionFallback = ({ label }) => (
  <div
    className="home-section-fallback"
    role="status"
    aria-busy="true"
    aria-label={label}
  >
    Loading…
  </div>
);

const Home = () => {
  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          <h1 className="home-page-title">Dashboard</h1>
          <div className="widgets">
            <Widget type="user" />
            <Widget type="order" />
            <Widget type="earning" />
            <Widget type="balance" />
          </div>
          <Suspense
            fallback={<SectionFallback label="Loading charts" />}
          >
            <div className="charts">
              <Feature />
              <Chart aspect={2} title="Last 6 months (revenue)" />
            </div>
          </Suspense>
          <div className="listContainer">
            <div className="listTitle">Latest Transactions</div>
            <Suspense
              fallback={<SectionFallback label="Loading transactions table" />}
            >
              <Tabledata />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;