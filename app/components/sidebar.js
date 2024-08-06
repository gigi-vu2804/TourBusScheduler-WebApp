"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaGripLines } from "react-icons/fa";
import styled from "styled-components";
import { useUserAuth } from "../_utils/auth-context";

const SidebarContainer = styled.div`
  height: 100vh;
  width: ${(props) => (props.isOpen ? "250px" : "60px")};
  position: fixed;
  top: 0;
  left: 0;
  background-color: #364358;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  border: solid 1px #364358;
`;

const Hamburger = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  cursor: pointer;
`;

const MenuItem = styled.div`
  padding: 10px 15px;
  text-align: left;
  text-decoration: none;
  font-size: 20px;
  color: #f1f1f1;
  font-family: Inter, sans-serif;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  transition: 0.3s;

  &:hover {
    color: #818181;
  }

  &.active {
    color: #4caf50;
  }
`;

const SubMenuContainer = styled.div`
  margin-left: 20px;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  transition: 0.3s;
`;

const Sidebar = () => {
  const router = useRouter();
  const { firebaseSignOut } = useUserAuth(); // Use firebaseSignOut from context
  const [isOpen, setIsOpen] = useState(false);
  const [isTripsOpen, setIsTripsOpen] = useState(false); // State for Trips sub-menu
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleTripsSubMenu = () => {
    setIsTripsOpen(!isTripsOpen);
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(); // Call sign out function
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <Hamburger onClick={toggleSidebar}>
        <FaGripLines color="white" width={30} height={30} />
      </Hamburger>
      <Link href="/home" passHref>
        <MenuItem
          isOpen={isOpen}
          className={pathname === "/home" ? "active" : ""}
        >
          Home
        </MenuItem>
      </Link>
      <div onClick={toggleTripsSubMenu} style={{ cursor: "pointer" }}>
        <MenuItem
          isOpen={isOpen}
          className={pathname.startsWith("/trips") ? "active" : ""}
        >
          Trips
        </MenuItem>
      </div>
      <SubMenuContainer isOpen={isOpen && isTripsOpen}>
        <Link href="/trips/calendar" passHref>
          <MenuItem
            isOpen={isOpen}
            className={pathname === "/trips/calendar" ? "active" : ""}
          >
            Trips Calendar
          </MenuItem>
        </Link>
        <Link href="/trips/view" passHref>
          <MenuItem
            isOpen={isOpen}
            className={pathname === "/trips/view" ? "active" : ""}
          >
            Trips List
          </MenuItem>
        </Link>
        <Link href="/trips/create" passHref>
          <MenuItem
            isOpen={isOpen}
            className={pathname === "/trips/create" ? "active" : ""}
          >
            Create Trip
          </MenuItem>
        </Link>
      </SubMenuContainer>
      <MenuItem isOpen={isOpen} onClick={handleSignOut}>
        Sign out
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
