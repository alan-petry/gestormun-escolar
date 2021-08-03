/*!

=========================================================
* Paper Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useState, useEffect, useContext, useRef} from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import {routes, routes2, routesProfessor} from "routes.js";
import { GlobalContext } from "contexts/context";

var ps;

export default function Admin(props) {
  const context = useContext(GlobalContext);
  const [backgroundColor, setBackgroundColor] = useState('black');
  const [activeColor, setActiveColor] = useState('info');
  const [sidebarMini, setSidebarMini] = useState(false);
  const mainPanel = useRef(null);

  // componentDidMount() {
  //   if (navigator.platform.indexOf("Win") > -1) {
  //     document.documentElement.className += " perfect-scrollbar-on";
  //     document.documentElement.classList.remove("perfect-scrollbar-off");
  //     ps = new PerfectScrollbar(this.refs.mainPanel);
  //   }
  // }
  // componentWillUnmount() {
  //   if (navigator.platform.indexOf("Win") > -1) {
  //     ps.destroy();
  //     document.documentElement.className += " perfect-scrollbar-off";
  //     document.documentElement.classList.remove("perfect-scrollbar-on");
  //   }
  // }
  // componentDidUpdate(e) {
  //   if (e.history.action === "PUSH") {
  //     document.documentElement.scrollTop = 0;
  //     document.scrollingElement.scrollTop = 0;
  //     this.refs.mainPanel.scrollTop = 0;
  //   }
  // }

  function getRoutes (routes) {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  function getPerfilRoutes(){
    if (context.usuarioLogado.perfil === 'professor')
    { return routesProfessor } 
    else
    { return routes};
  }

  function handleActiveClick(color) {
    setActiveColor(color);
  };
  function handleBgClick(color) {
    setBackgroundColor(color);
  };
  function handleMiniClick() {
    if (document.body.classList.contains("sidebar-mini")) {
      setSidebarMini(false);
    } else {
      setSidebarMini(true);
    }
    document.body.classList.toggle("sidebar-mini");
  };

    return (
      <div className="wrapper">
        <Sidebar
          {...props}
          routes={getPerfilRoutes()}
          bgColor={backgroundColor}
          activeColor={activeColor}
        />

        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar {...props} handleMiniClick={handleMiniClick} />
          <Switch>{getRoutes(routes)}</Switch>
          <Switch>{getRoutes(routes2)}</Switch>
          <Switch>{getRoutes(routesProfessor)}</Switch>
          {
            // we don't want the Footer to be rendered on full screen maps page
            props.location.pathname.indexOf("full-screen-map") !==
            -1 ? null : (
              <Footer fluid />
            )
          }
        </div>
        <FixedPlugin
          bgColor={backgroundColor}
          activeColor={activeColor}
          sidebarMini={sidebarMini}
          handleActiveClick={handleActiveClick}
          handleBgClick={handleBgClick}
          handleMiniClick={handleMiniClick}
        />
      </div>
    );
  }


