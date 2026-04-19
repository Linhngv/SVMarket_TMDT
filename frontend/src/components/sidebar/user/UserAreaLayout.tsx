import { Outlet } from "react-router-dom";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "./Sidebar";
import "../../../styles/UserAreaLayout.css";

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
