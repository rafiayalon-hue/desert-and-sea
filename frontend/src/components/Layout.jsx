import { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "דשבורד" },
  { key: "/bookings",  icon: <CalendarOutlined />,  label: "הזמנות" },
  { key: "/guests",    icon: <TeamOutlined />,       label: "אורחים" },
  { key: "/messages",  icon: <MessageOutlined />,    label: "הודעות" },
];

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Layout style={{ minHeight: "100vh", direction: "rtl" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{ position: "fixed", right: 0, height: "100vh", zIndex: 100 }}
        width={200}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Title level={5} style={{ color: "#fff", margin: 0, fontSize: collapsed ? 12 : 16 }}>
            {collapsed ? "D&S" : "Desert & Sea"}
          </Title>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout style={{ marginRight: collapsed ? 80 : 200, transition: "margin 0.2s" }}>
        <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0" }}>
          <Title level={4} style={{ margin: 0, lineHeight: "64px" }}>
            {menuItems.find((i) => i.key === pathname)?.label ?? "Desert and Sea"}
          </Title>
        </Header>
        <Content style={{ padding: 24, minHeight: "calc(100vh - 64px)" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
