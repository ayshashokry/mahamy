import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css";
import { ConfigProvider } from "antd";
import "./localization/i18n";
/* Redux Connections */

import { Provider } from "react-redux";

/* LocalStorage Functions */
// import { saveState } from "./redux/LocalStorage";
import store from "./redux/store";

// store.subscribe(() => {
//   saveState({
//     userToken: localStorage.userToken,
//   });
// });
ReactDOM.render(
  <Suspense fallback={null}>
    <Provider store={store}>
      <ConfigProvider direction="rtl">
        <App />
      </ConfigProvider>
    </Provider>
  </Suspense>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
