import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import heIL from "antd/locale/he_IL";
import dayjs from "dayjs";
import "dayjs/locale/he";
import App from "./App";
import "./index.css";

dayjs.locale("he");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      locale={heIL}
      direction="rtl"
      theme={{
        token: {
          fontFamily: "'Heebo', sans-serif",
          colorPrimary: "#1a6b5a",
          colorLink: "#1a6b5a",
          borderRadius: 8,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
