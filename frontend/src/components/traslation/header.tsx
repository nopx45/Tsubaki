import { useEffect, useRef, useState } from "react";
import { Layout, Dropdown, MenuProps, TourProps } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./i18n";
import headerlogo from "../../assets/header.jpg";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { IoHome } from "react-icons/io5";
import {FaQuestionCircle, FaUserCircle } from "react-icons/fa";
import { useTourRefStore, useTourStore } from "../../tourStore";
import { useRegisterTourRef } from "../../hooks/useRegisterTourRef";

const { Header } = Layout;

type LanguageSelectorProps = {
  containerRef?: React.RefObject<HTMLDivElement>;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ containerRef }) => {
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
    <div ref={containerRef}>
      <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
        <div style={styles.langButton}>
          <GlobalOutlined /> {languages.find((l) => l.key === selectedLang)?.label || "EN"} ▼
        </div>
      </Dropdown>
    </div>
  );
};

const AppHeader = () => {
  const [isLogin, setIslogin] = useState(false);
  const navigate = useNavigate();

  const ref1 = useRef<HTMLDivElement>(null!);
  const ref2 = useRef<HTMLDivElement>(null!);
  const ref3 = useRef<HTMLDivElement>(null!);
  const ref4 = useRef<HTMLDivElement>(null!);
  // ลงทะเบียนกับ store
  useRegisterTourRef("home-icon", ref1);
  useRegisterTourRef("help-icon", ref2);
  useRegisterTourRef("profile-icon", ref3);
  useRegisterTourRef("translate", ref4);

  const { startTour } = useTourStore();
  const { refs } = useTourRefStore();

  const handleStartTour = () => {
    const requiredKeys = [
      "home-icon",
      "help-icon",
      "profile-icon",
      "translate",
      "central-web",
      "section-web",
      "other-web",
      "login",
      "viewer",
      "search-user",
      "regulation",
      "it-knowledge",
      "training-knowledge",
      "information-security",
      "calendar",
    ];

    const notReadyKeys = requiredKeys.filter((key) => !refs[key]?.current);

    if (notReadyKeys.length > 0) {
      console.warn("Refs not ready:", notReadyKeys);
      return;
    }

    const steps: TourProps["steps"] = [
      {
        title: "Home",
        description: "Home button to return to the homepage",
        target: () => refs["home-icon"]!.current!,
      },
      {
        title: "Help",
        description: "The Help button will guide you through how to use various functions.",
        target: () => refs["help-icon"]!.current!,
      },
      {
        title: "User",
        description: "Button to view user details",
        target: () => refs["profile-icon"]!.current!,
      },
      {
        title: "Translate",
        description: "Language switch button supports 2 languages.",
        target: () => refs["translate"]!.current!,
        placement: "bottomLeft",
      },
      {
      title: "Central Web",
      description: "A function that collects frequently used work links.",
      target: () => refs["central-web"]!.current!,
      },
      {
      title: "Section Web",
      description: "A function that collects links to each department's work for easy use.",
      target: () => refs["section-web"]!.current!,
      },
      {
      title: "Other Web",
      description: "A function that collects frequently used external links",
      target: () => refs["other-web"]!.current!,
      },
      {
      title: "Login",
      description: "The Login button is only for users who want to access something that requires login first.",
      target: () => refs["login"]!.current!,
      placement: "bottomLeft",
      },
      {
      title: "Viewer",
      description: "Function to display the number of visitors to the web page who have logged in.",
      target: () => refs["viewer"]!.current!,
      placement: "bottomLeft",
      },
      {
      title: "Search User",
      description: "It is a function used to search for user information such as first name, last name, phone number, and email.",
      target: () => refs["search-user"]!.current!,
      placement: "bottomLeft",
      },
      {
      title: "Regulation",
      description: "It is a function that compiles document files related to the company's rules and regulations.",
      target: () => refs["regulation"]!.current!,
      placement: "bottomLeft",
      },
      {
      title: "IT Knowledge",
      description: "It is a function that compiles document files related to IT knowledge and basic troubleshooting methods.",
      target: () => refs["it-knowledge"]!.current!,
      placement: "bottomLeft",
      },
      {
      title: "Training Knowledge",
      description: "It is a function that compiles document files related to various training sessions.",
      target: () => refs["training-knowledge"]!.current!,
      placement: "bottomLeft",
      },
      {
      title: "Information Security",
      description: "It is a function that compiles document files related to security knowledge and methods for protection against various types of attacks.",
      target: () => refs["information-security"]!.current!,
      placement: "bottomLeft",
      },
      {
      title: "Calendar",
      description: "It is a calendar for viewing all company holidays and scheduled company events.",
      target: () => refs["calendar"]!.current!,
      placement: "bottomLeft",
      },
    ];

    startTour(steps);
  };

  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIslogin(isLoggedIn);
  }, []);
  

  return (
    <Header style={headerStyle}>
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
        onClick={() => navigate("/")}
      />
    <div style={{ flex: 1 }}></div>
    <div ref={ref1} style={{ display: "inline-block", marginTop: 10 }}>
    <IoHome 
      size={24} 
      style={{
        color: 'black',
        marginRight: '16px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease'
      }}
      onClick={() => navigate("/")}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    />
    </div>
    <div ref={ref2} style={{ display: "inline-block", marginTop: 10 }}>
    <FaQuestionCircle
      size={24} 
      style={{
        color: 'black',
        marginRight: '16px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease'
      }}
      onClick={handleStartTour}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    />
    </div>
    <div ref={ref3} style={{ display: "inline-block", marginTop: 10 }}>
    {isLogin && (
      <FaUserCircle
        size={24}
        style={{
          color: "black",
          marginRight: "16px",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onClick={() => navigate("/profile")}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    )}
    </div>
    <div
      style={{
        position: "relative",
        minHeight: "40px",
        borderRadius: '6px',
        padding: '6px 12px',
      }}
    >
      <LanguageSelector containerRef={ref4} />
    </div>
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