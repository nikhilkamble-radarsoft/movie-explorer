import { useState } from "react";
import { Layout, Drawer } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useMediaQuery } from "react-responsive";

const { Content } = Layout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Detect mobile screen
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const toggleSidebar = () => {
    if (isMobile) {
      setDrawerVisible(!drawerVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar (fixed) */}
      {/* {!isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: collapsed ? 80 : 250,
            transition: "width 0.2s",
            zIndex: 100,
            background: "var(--color-primary)",
          }}
        >
          <Sidebar collapsed={collapsed} />
        </div>
      )} */}

      {/* Mobile Drawer */}
      {/* {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          style={{ backgroundColor: "var(--color-primary)" }}
          styles={{ body: { padding: 0 } }}
          width={250}
        >
          <Sidebar collapsed={false} toggleSidebar={toggleSidebar} />
        </Drawer>
      )} */}

      {/* Main layout (scrollable content only) */}
      <Layout
        style={{
          // marginLeft: !isMobile ? (collapsed ? 80 : 250) : 0,
          transition: "margin-left 0.2s",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* <Topbar onToggleSidebar={toggleSidebar} /> */}

        <Content
          style={{
            // marginTop: 64,
            // padding: 24,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            background: "linear-gradient(to bottom right, #121212, #7928ca, #121212)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
