import React, { Component } from "react";


import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderSideNavItems,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,

} from 'carbon-components-react/lib/components/UIShell/';


import { Search20, Notification20, AppSwitcher20, Fade16 } from '@carbon/icons-react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import DetailsViewComponent from "../../components/overview/DetailsView";
import ArchitectureComponent from "../../components/builder/Architecture";
import BillofMaterialsComponent from "../../components/bom/BillofMaterials";
import Routes from "./router";


class UIShell extends Component {
  header = "Architecture Builder";

  menuItems = [
    "Overview",
    "Builder",
    "Compliance"
  ]
  builderMenuItems = [
    "Architecture",
    "Services",
    "Autmation",
    "Provisioner"
  ]
  complianceMenuItems = [
    "Controls",
    "Mapping",
    "Service",
    "Nist-800"
  ]


  constructor(props) {
    super(props);
    this.state = {
      patternName: "Overview"
    };
  }


  render() {


    return (

      <div>
        <Router>
          <Header aria-label="IBM Platform Name">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
            />
            <HeaderName href="#" prefix="IBM">
              FS Cloud Architectures
            </HeaderName>
            <HeaderNavigation aria-label="IBM [Platform]">
              <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
              <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
              <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
              <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
                <HeaderMenuItem href="#one">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem href="#two">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem href="#three">Sub-link 3</HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Search">
                <Search20 />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Notifications">
                <Notification20 />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="App Switcher">
                <AppSwitcher20 />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
            <SideNav aria-label="Side navigation" expanded="true">

              <SideNavItems>

                <Link to="/">
                  <SideNavMenuItem>Overview</SideNavMenuItem>
                </Link>

                <SideNavMenu title="Builder">

                  <SideNavMenuItem>
                    <Link to="/architectures">Architectures</Link>
                  </SideNavMenuItem>

                  <Link to="/services">
                    <SideNavMenuItem>Services</SideNavMenuItem>
                  </Link>

                </SideNavMenu>
                <SideNavMenu title="Compliance" >

                  <Link to="/controls">
                    <SideNavMenuItem>Controls</SideNavMenuItem>
                  </Link>

                </SideNavMenu>

              </SideNavItems>
            </SideNav>
          </Header>

          <Content>

            <Routes />

          </Content>
        </Router>
      </div>


    );
  }
}

export default UIShell;
