import { Outlet } from "react-router-dom";
import Header from "../../user/Header";
import Footer from "../../user/Footer";
import Sidebar from "./Sidebar";
import "../../../styles/user/UserAreaLayout.css";

export default function UserAreaLayout() {
  return (
    <>
      <Header />

      <div className="container-fluid px-3 px-md-4 mt-3">
        <div className="user-area-layout">
          <Sidebar />

          <main className="user-area-main">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
