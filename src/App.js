"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var HomePage_1 = require("./pages/HomePage");
var AdminPage_1 = require("./pages/AdminPage");
var react_1 = require("@vercel/analytics/react");
var react_2 = require("@vercel/speed-insights/react");
var AuthContext_1 = require("./contexts/AuthContext");
function App() {
    return (<>
      <AuthContext_1.AuthProvider>
        <react_router_dom_1.BrowserRouter>
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<HomePage_1.HomePage />}/>
            <react_router_dom_1.Route path="/admin" element={<AdminPage_1.AdminPage />}/>
          </react_router_dom_1.Routes>
        </react_router_dom_1.BrowserRouter>
      </AuthContext_1.AuthProvider>
      <react_1.Analytics />
      <react_2.SpeedInsights />
    </>);
}
exports.default = App;
