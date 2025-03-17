import { useEffect, useState } from "react";
import { Layout, Dropdown, MenuProps } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./i18n";
import headerlogo from "../../assets/header.jpg";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Header } = Layout;

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(Cookies.get("language") || i18n.language);

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang, i18n]);
  
  const languages = [
    { key: "en", label: "English" },
    { key: "th", label: "ภาษาไทย" },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    i18n.changeLanguage(key as string);
    setSelectedLang(key as string);
    Cookies.set("language", key as string, { expires: 7 });
  };

  const menuItems = languages.map((lang) => ({
    key: lang.key,
    label: lang.label,
  }));

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
      <div style={styles.langButton}>
        <GlobalOutlined /> {languages.find((l) => l.key === selectedLang)?.label || "EN"} ▼
      </div>
    </Dropdown>
  );
};

const AppHeader = () => {
  const navigate = useNavigate();
  return (
    <Header style={headerStyle}>
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
        onClick={() => navigate("/")}
      />
      <div style={styles.spacer}></div>
      <LanguageSelector />
    </Header>
  );
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  color: "#fff",
  height: 70,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#007bff",
  backgroundImage: `url(${headerlogo})`,
  backgroundSize: "cover",
  backgroundPosition: "80% 30%",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const styles = {
  logo: {
    width: "10%",
    cursor: "pointer",
  },
  spacer: {
    flexGrow: 1,
  },
  langButton: {
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    color: "rgb(79, 81, 82)",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
};

export default AppHeader;