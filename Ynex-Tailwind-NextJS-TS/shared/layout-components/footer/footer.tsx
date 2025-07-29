import React, { Fragment } from "react";

const Footer = () => {
    return (
        <Fragment>
            <footer className="footer mt-auto xl:ps-[15rem]  font-normal font-inter bg-white text-defaultsize leading-normal text-[0.813] shadow-[0_0_0.4rem_rgba(0,0,0,0.1)] dark:bg-bodybg py-4 text-center">
                <div className="container">
                    <p className="mt-2">
                        Designed by
                        <a
                            href="https://devseinty.netlify.app/"
                            target="_blank"
                            className="hover:opacity-80 transition-all ml-1"
                        >
                            <span style={{color: '#ff7a59', fontWeight: 'bold'}}>Zedi</span><span style={{color: '#42A5F5', fontWeight: 'bold'}}>Tech</span>
                        </a>
                    </p>
                </div>
            </footer>

        </Fragment>
    );
};

export default Footer;
