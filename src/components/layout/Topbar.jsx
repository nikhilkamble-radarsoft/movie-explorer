import { Layout, Button, Avatar, Space } from "antd";
import { MenuOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { useMediaQuery } from "react-responsive";
import Logo from "../../assets/logo.svg";

const { Header } = Layout;

export default function Topbar({ onToggleSidebar }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Header
      style={{
        background: "#f5f5f5",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        position: "fixed",
        width: "100%",
        zIndex: 99,
      }}
    >
      <div className="flex items-center w-full gap-3">
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onToggleSidebar}
            style={{ fontSize: "18px" }}
          />
        )}
        <div className="w-full flex items-center gap-2 overflow-hidden">
          <img src={Logo} alt="Logo" className="w-8 h-8 flex-shrink-0" />

          <Title
            level={5}
            className="!mb-0 text-ellipsis overflow-hidden whitespace-normal leading-tight text-sm sm:text-base"
          >
            Movie Explorer
          </Title>
        </div>

        {/* maybe later */}
        {/* <Space size="middle">
          <Button type="text" icon={<BellOutlined style={{ fontSize: "18px" }} />} />
          <Avatar icon={<UserOutlined />} />
        </Space> */}
      </div>
    </Header>
  );
}
