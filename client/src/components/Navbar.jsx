import React, { useEffect, useContext } from "react";
import {
  TwitterOutlined,
  HomeOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { UserContext } from "../state/UserProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TweetModal from "./TweetModal";
import { useState } from "react";

export default function Navbar() {
  const user_ctx = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [shownf, setshownf] = useState(false);
  const lastNotificationCount = localStorage.getItem("nf_coount");
  console.log(shownf);
  const changeClickedState = (state) => {
    const newClickedState = {
      home: false,
      notification: false,
      profile: false,
      logout: false,
    };
    newClickedState[state] = true;
    user_ctx.setNavClicks(newClickedState);
  };
  useEffect(() => {
    if (location) {
      if (location.pathname === "/") changeClickedState("home");
      if (location.pathname === "/profile") changeClickedState("profile");
      if (location.pathname === "/notification")
        changeClickedState("notification");
    }
  }, [location]);

  useEffect(() => {
    console.log("d");

    if (user_ctx.user?.notifications) {
      setshownf(
        user_ctx.user?.notifications.length ===
          Number(localStorage.getItem("nf_count"))
          ? false
          : true
      );
    }
  }, [localStorage.getItem("nf_count"), user_ctx.user?.notifications]);

  return (
    <>
      {user_ctx.tweetModal && <TweetModal />}
      <nav className="max-h-screen  ">
        <div className="hidden  md:block ml-12 w-[250px] max-h-screen overflow-hidden">
          <div className="space-y-7 flex flex-col items-start">
            <Link to="/">
              <span className="cursor-pointer hover:bg-slate-900 rounded-full text-center h-12 w-12 ml-2 p-2  ">
                <TwitterOutlined className="text-blue-400 text-3xl " />
              </span>
            </Link>
            <Link to="/">
              <div
                className="flex items-center justify-center cursor-pointer hover:bg-slate-900  px-4  pb-2 mr-3 rounded-full"
                onClick={() => changeClickedState("home")}
              >
                <HomeOutlined className="text-gray-400 text-3xl" />
                <h1
                  className={`text-gray-400 ml-5 font-${
                    user_ctx.navClicks.home ? "bold" : "normal"
                  } mt-2  text-xl`}
                >
                  Home
                </h1>
              </div>
            </Link>
            <Link to="/notification">
              <div
                className="flex items-center cursor-pointer hover:bg-slate-900  px-4  pb-2 mr-3 rounded-full"
                onClick={() => changeClickedState("notification")}
              >
                <div className="relative">
                  {shownf && (
                    <div className="h-3 w-3 left-6 top-1 rounded-full bg-cyan-500 absolute"></div>
                  )}
                  <BellOutlined className="text-gray-400 text-3xl" />
                </div>
                <h1
                  className={`text-gray-400 ml-5 font-${
                    user_ctx.navClicks.notification ? "bold" : "normal"
                  } mt-2 text-xl`}
                >
                  Notifications
                </h1>
              </div>
            </Link>

            <Link to="/profile">
              <div
                className="flex items-center cursor-pointer hover:bg-slate-900  px-4  pb-2 mr-3 rounded-full"
                onClick={() => changeClickedState("profile")}
              >
                <UserOutlined className="text-gray-400 text-3xl" />
                <h1
                  className={`text-gray-400 ml-5 font-${
                    user_ctx.navClicks.profile ? "bold" : "normal"
                  } mt-2 text-xl`}
                >
                  Profile
                </h1>
              </div>
            </Link>

            <div
              className="flex items-center cursor-pointer hover:bg-slate-900  px-4  pb-2 mr-3 rounded-full"
              onClick={() => {
                changeClickedState("logout");
              }}
            >
              <LogoutOutlined className="text-gray-400 text-3xl" />
              <h1
                className={`text-gray-400 ml-5 font-${
                  user_ctx.navClicks.logout ? "bold" : "normal"
                } mt-2 text-xl`}
                onClick={() => {
                  localStorage.clear("firstLogin");
                  localStorage.clear("user_id");
                  window.location.href = "/login";
                }}
              >
                Log out
              </h1>
            </div>
            <div className="flex items-center cursor-pointer">
              <button
                className="bg-[#1D9BF0] px-20 py-3 text-md font-bold text-white rounded-full"
                onClick={() => user_ctx.setTWeetModal(true)}
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 md:hidden">
          <div className="flex  pb-3 pt-1 px-4 w-screen justify-between border-t-[1px] border-t-gray-600">
            <div className="cursor-pointer">
              <HomeOutlined className="text-white text-2xl" />
            </div>
            <div className="cursor-pointer">
              <BellOutlined className="text-white text-2xl" />
            </div>
            <div className="cursor-pointer">
              <UserOutlined className="text-white text-2xl" />
            </div>
            <div className="cursor-pointer">
              <LogoutOutlined className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
