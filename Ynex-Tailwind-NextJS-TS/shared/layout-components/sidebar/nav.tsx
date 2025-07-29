import React from "react";
import Menuloop from './menuloop';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

//icons
import { AppsIcon, DashboardIcon, Ecommerceicon, Formsicon, Mapicon, Uielementsicon, Widgetsicon,Pagesicon, Tableicon, Advanceduiicon, Authenticationicon, Chartsicon, NestedMenuIcon, UtilitiesIcon } from './nav-icons';
import { Menuposition } from '@/shared/redux/action';

function ThemeChanger(e: any): void {
  if (e.type === "click") {
    //  console.log(e);
  }
}

// **Updated Badge for Travel Bookings**
const travelBadge = <span className="badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2 !font-semibold">Hot</span>;
const urgentBadge = <span className="badge !bg-red-500 !text-white !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2 !font-semibold animate-pulse">23</span>;

export const MenuItems : any= [
    {
        menutitle: "GLOBAL HORIZON TRAVEL",
},

            // **Main GloHorizon Dashboard**
            {icon: DashboardIcon, badgetxt: travelBadge, title: 'Dashboard', type: "link", active: false, path: "/glohorizon/dashboard"},
            
            // **Booking Management**
            {icon: Ecommerceicon, badgetxt: urgentBadge, title: 'Bookings', type: "sub", active: false, children: [
                    {path: "/glohorizon/bookings", type: "link", active: false, selected: false, title: "All Bookings" },
                    {path: "/glohorizon/bookings/pending", type: "link", active: false, selected: false, title: "Pending Review" },
                    {path: "/glohorizon/bookings/urgent", type: "link", active: false, selected: false, title: "Urgent Bookings" },
                    {path: "/glohorizon/bookings/quotes", type: "link", active: false, selected: false, title: "Quote Management" },
                    {path: "/glohorizon/bookings/payments", type: "link", active: false, selected: false, title: "Payment Status" },
                ]
            },

            // **Customers & Communication**
            {icon: AppsIcon, title: 'Customers', type: "sub", active: false, children: [
                    {path: "/glohorizon/customers", type: "link", active: false, selected: false, title: "Customer List" },
                    {path: "/glohorizon/customers/communication", type: "link", active: false, selected: false, title: "Communication" },
                    {path: "/glohorizon/customers/feedback", type: "link", active: false, selected: false, title: "Feedback" },
                ]
            },

            // **Reports & Analytics**
            {icon: Chartsicon, title: 'Reports', type: "sub", active: false, children: [
                    {path: "/glohorizon/reports/revenue", type: "link", active: false, selected: false, title: "Revenue Analytics" },
                    {path: "/glohorizon/reports/bookings", type: "link", active: false, selected: false, title: "Booking Reports" },
                    {path: "/glohorizon/reports/performance", type: "link", active: false, selected: false, title: "Performance Stats" },
                ]
            },
       
   
    {
        menutitle: "SYSTEM ADMINISTRATION",
    },

    // **System Settings**
    {icon: UtilitiesIcon, title: 'System Settings', type: "sub", active: false, children: [
            {path: "/admin/settings/api", type: "link", active: false, selected: false, title: "API Configuration" },
            {path: "/admin/settings/payments", type: "link", active: false, selected: false, title: "Payment Setup" },
            {path: "/admin/settings/notifications", type: "link", active: false, selected: false, title: "Notifications" },
            {path: "/admin/settings/users", type: "link", active: false, selected: false, title: "Admin Users" },
        ]
    },

    // **Authentication & Security**
    {icon: Authenticationicon, title: 'Authentication', type: "sub", active: false, children: [
            {path: "/authentication/login", type: "link", active: false, selected: false, title: "Admin Login" },
            {path: "/authentication/logout", type: "link", active: false, selected: false, title: "Sign Out" },
        ]
    },

    {
        menutitle: "DEVELOPMENT TOOLS",
    },

    // **Keep some original dashboard examples for reference**
    {icon: DashboardIcon, title: 'Dashboard Examples', type: "sub", active: false, children: [
            {path: "/components/dashboards/crm", type: "link", active: false, selected: false, title: "CRM Example" },
            {path: "/components/dashboards/ecommerce", type: "link", active: false, selected: false, title: "Ecommerce Example" },
            {path: "/components/dashboards/analytics", type: "link", active: false, selected: false, title: "Analytics Example" },
        ]
    },

    // **UI Components** (Keep for building custom components)
    {icon: Uielementsicon, title: 'UI Elements', type: "sub", active: false, children: [
            {path: "/components/ui-elements/alerts", type: "link", active: false, selected: false, title: "Alerts" },
            {path: "/components/ui-elements/badge", type: "link", active: false, selected: false, title: "Badge" },
            {path: "/components/ui-elements/buttons", type: "link", active: false, selected: false, title: "Buttons" },
            {path: "/components/ui-elements/cards", type: "link", active: false, selected: false, title: "Cards" },
            {path: "/components/ui-elements/dropdowns", type: "link", active: false, selected: false, title: "Dropdowns" },
            {path: "/components/ui-elements/modals", type: "link", active: false, selected: false, title: "Modals" },
        ]
    },

    // **Forms & Tables** (Useful for booking forms)
    {icon: Formsicon, title: 'Forms & Tables', type: "sub", active: false, children: [
            {path: "/components/forms/form-layouts", type: "link", active: false, selected: false, title: "Form Layouts" },
            {path: "/components/forms/validation", type: "link", active: false, selected: false, title: "Form Validation" },
            {path: "/components/tables/basic-tables", type: "link", active: false, selected: false, title: "Basic Tables" },
            {path: "/components/tables/data-tables", type: "link", active: false, selected: false, title: "Data Tables" },
        ]
    },

];

let history:any[] = [];
const Sidebar = () => {

    let router = useRouter();
    let [MyclassName, setMyClass] = useState("");
    let [menuitems, setMenuitems] = useState(MenuItems);
    const [menuUP, setupMenu] = useState(false);

    useEffect(() => {
        // console.log(router,"router");
        history.push(router.asPath)
        if (history.length > 2) {
            history.shift()
        }
        if (history[0] !== history[1]) {

            setSidemenu()
        }

        let mainContent = document.querySelector('.main-content');
        if(router.pathname == "/" ){
            mainContent?.classList.add("!pe-0")
            mainContent?.classList.add("!ms-0")
        }else{

            mainContent?.classList.remove("!pe-0")
            mainContent?.classList.remove("!ms-0")
        }
        
        // ****** //
        let submenu = document.querySelectorAll(".slide-menu");

        function slideClick(e: any) {
            e.stopPropagation()
            let target = e.target as HTMLElement;
            if (target?.nextElementSibling?.classList.contains('slide-menu')) {
              let slideMenu = target.nextElementSibling as HTMLElement;
              slideMenu.style.display = slideMenu.style.display === 'block' ? 'none' : 'block';
              target.classList.toggle('rotate');
              setupMenu(true);
            }
          }
          
          // Add event listeners to slide elements
          submenu.forEach((e: any) => {
            if (e.previousElementSibling) {
              e.previousElementSibling.addEventListener('click', slideClick);
            }
          });
          
          // Cleanup function to remove event listeners
          return () => {
            submenu.forEach((e: any) => {
              if (e.previousElementSibling) {
                e.previousElementSibling.removeEventListener('click', slideClick);
              }
            });
          };
          
        //   ****** //

    }, [router])

    const setSidemenu = () => {
        let menuElements = document.querySelectorAll(".side-menu__item")
        let bodyElement = document.querySelector('body');
        menuElements.forEach((element: any) => {

            if ((element.href.includes(`${router.asPath}`) || element.href.includes(`${router.pathname}`)) && !bodyElement?.classList.contains('horizontal') && router.pathname !== "/") {
                element.classList.add("active");
                let parent = element.parentElement;
                while (parent && !parent.classList.contains("main-sidebar")) {
                    if (parent.tagName === "UL") {
                        const sibling = parent.previousElementSibling as HTMLElement;
                        if (sibling && sibling.classList.contains("side-menu__item") && !sibling.classList.contains("active")) {
                            sibling.classList.add("active");
                        }
                        parent.style.display = "block";
                    }
                    parent = parent.parentElement;
                }
            }
        });
    }

    function switcherArrowFn() {
        // Used to remove is-expanded class and remove class on clicking arrow buttons
        function slideClick() {
            let slide = document.querySelectorAll(".slide")
            let slideMenu = document.querySelectorAll(".slide-menu")
            slide.forEach((element, index) => {
                if (slideMenu[index].classList.contains("open")) {
                    slideMenu[index].classList.remove("open")
                    slideMenu[index].style.display = 'none';
                } else {
                    slideMenu[index].classList.add("open")
                    slideMenu[index].style.display = 'block';
                }
            })
        }
        slideClick()
    }

    function Onhover() {
        setMyclassName("sidebar-mini")
        if (document.querySelector("body")?.classList.contains('sidebar-mini')) {
            // setMyClass("")

        } else {
            document.querySelector("body")?.classList.add('sidebar-mini');

        }
    }
    function Outhover() {
        setMyclassName("")
        document.querySelector("body")?.classList.remove('sidebar-mini');

    }

    return (

        <Fragment>
            <aside className="app-sidebar" id="sidebar" onMouseEnter={() => Onhover()} onMouseLeave={() => Outhover()}>
                <div className="main-sidebar-header">
                    <Link href="/glohorizon/dashboard" className="header-logo">
                        <img src={"../../../assets/images/global-horizon/glo.png"} alt="Global Horizon Travel and Tour" className="desktop-logo" style={{height: '40px', width: 'auto'}} />
                        <img src={"../../../assets/images/global-horizon/glo.png"} alt="Global Horizon Travel and Tour" className="toggle-logo" style={{height: '32px', width: 'auto'}} />
                        <img src={"../../../assets/images/global-horizon/glo.png"} alt="Global Horizon Travel and Tour" className="desktop-dark" style={{height: '40px', width: 'auto'}} />
                        <img src={"../../../assets/images/global-horizon/glo.png"} alt="Global Horizon Travel and Tour" className="toggle-dark" style={{height: '32px', width: 'auto'}} />
                    </Link>
                </div>
                <div className="main-sidebar" id="sidebar-scroll">
                    <nav className="main-menu-container nav nav-pills flex-column sub-open">
                        <div className="slide-left" id="slide-left">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#7a70ba" width="24" height="24" viewBox="0 0 24 24"> <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path> </svg>
                        </div>
                        <ul className="main-menu" onClick={() => Menuposition()}>
                            {menuitems.map((levelone: any) => {
                                return (
                                    <Fragment key={Math.random()}>
                                        <Menuloop MenuItems={levelone} toggleSidemenu={switcherArrowFn} level={0} />
                                    </Fragment>
                                )
                            })}

                        </ul>
                        <div className="slide-right" id="slide-right"><svg xmlns="http://www.w3.org/2000/svg" fill="#7a70ba" width="24" height="24" viewBox="0 0 24 24"> <path d="m10.707 17.707 5.707-5.707-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path> </svg></div>
                    </nav>
                </div>
            </aside>
        </Fragment>
    );
};

export default Sidebar;
