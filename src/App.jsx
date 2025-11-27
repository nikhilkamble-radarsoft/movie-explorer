import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { createRoutesConfig } from "./routes/routes";
import { Suspense } from "react";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { ModalProvider } from "./logic/ModalProvider";
import "./App.css";

const getCssVariable = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function App() {
  const wrapWithAuth = (element, { isPrivate, isPublic, roles }) => {
    if (isPrivate) return <PrivateRoute allowedRoles={roles}>{element}</PrivateRoute>;
    if (isPublic) return <PublicRoute>{element}</PublicRoute>;
    return element;
  };

  const flattenRoutes = (routes) => {
    return routes.reduce((acc, route) => {
      const { path, Component, children, isPrivate, isPublic, roles, withLayout = true } = route;
      if (!Component) return acc;

      const element = wrapWithAuth(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>,
        { isPrivate, isPublic, roles }
      );

      acc.push({ path, element, withLayout });

      if (children) {
        acc.push(...flattenRoutes(children));
      }

      return acc;
    }, []);
  };

  const routesConfig = createRoutesConfig();
  const allRoutes = flattenRoutes(routesConfig);
  const layoutRoutes = allRoutes.filter((r) => r.withLayout);
  const nonLayoutRoutes = allRoutes.filter((r) => !r.withLayout);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: layoutRoutes.map(({ path, element }) => ({ path, element })),
    },
    ...nonLayoutRoutes.map(({ path, element }) => ({ path, element })),
    {
      path: "*",
      element: <div>404 - Page Not Found</div>,
    },
  ]);

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          token: {
            colorLink: getCssVariable("--color-primary"),
            colorPrimary: getCssVariable("--color-primary"),
            colorSecondary: getCssVariable("--color-secondary"),
            colorBackground: getCssVariable("--color-background"),
            colorBgLayout: getCssVariable("--color-background"),
            colorTextPrimary: getCssVariable("--color-text-primary"),
            colorTextSecondary: getCssVariable("--color-text-secondary"),

            fontFamily: `"Source Sans Pro", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
          },
          components: {
            Form: {
              labelFontSize: 14,
              verticalLabelPadding: 0,
              size: "large",
              itemMarginBottom: 10,
              // labelColor: getCssVariable("--color-primary"),
            },
            Input: {
              fontSizeLG: 14,
              colorTextDisabled: getCssVariable("--color-text-disabled"),
            },
            InputNumber: {
              fontSizeLG: 14,
              colorTextDisabled: getCssVariable("--color-text-disabled"),
            },
            Select: {
              fontSizeLG: 14,
              optionSelectedBg: getCssVariable("--color-primary"),
              optionSelectedColor: "#fff",
              colorTextDisabled: getCssVariable("--color-text-disabled"),
            },
            DatePicker: {
              fontSizeLG: 14,
              cellActiveWithRangeBg: getCssVariable("--color-primary"),
              cellActiveWithRangeColor: "#fff",
              cellHoverBg: "rgba(0,0,0,0.04)",
              cellActiveBg: getCssVariable("--color-primary"),
              cellSelectedBg: getCssVariable("--color-primary"),
              cellSelectedColor: "#fff",
              colorTextDisabled: getCssVariable("--color-text-disabled"),
            },
            TimePicker: {
              fontSizeLG: 14,
              cellActiveBg: getCssVariable("--color-primary"),
              cellHoverBg: "rgba(0,0,0,0.04)",
              cellSelectedBg: getCssVariable("--color-primary"),
              cellSelectedColor: "#fff",
              colorTextDisabled: getCssVariable("--color-text-disabled"),
            },
            Segmented: {
              fontSizeLG: 14,
              itemSelectedColor: getCssVariable("--color-primary"),
              itemSelectedBg: "#fff",
              itemSelectedFontWeight: 600,
              colorTextDisabled: getCssVariable("--color-text-disabled"),
            },
            Typography: {
              titleMarginBottom: 0,
            },
          },
        }}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ModalProvider>
              <RouterProvider router={router} />
            </ModalProvider>
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </StyleProvider>
  );
}
