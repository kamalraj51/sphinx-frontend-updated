import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import store from "./reducer/store.js";

import AppThemeProvider from "./component/AppThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppThemeProvider></AppThemeProvider>
  </Provider>,
);