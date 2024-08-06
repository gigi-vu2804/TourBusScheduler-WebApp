// app/home/page.js
"use client";
import React, { useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../_utils/auth-context";
import Image from "next/image";

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: #ffffff;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const IntroParagraph = styled.p`
  text-align: center;
  max-width: 600px;
  margin-bottom: 20px;
  font-size: 1.25rem;
`;

const StyledButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 10px;
  cursor: pointer;
`;

export default function Home() {
  const { user, firebaseSignOut } = useUserAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  return (
    <MainContainer>
      <Header>
        <Image
          src="/logo.png"
          alt="TourBusScheduler Logo"
          width={150}
          height={150}
        />
        <Title>Trips & Tour Bus Scheduler</Title>
        {user ? (
          <div>
            <IntroParagraph>
              Welcome, {user.displayName || user.email}! <br />
              You can schedule and manage trips or tour buses for your company
              here. Happy scheduling!
            </IntroParagraph>
            <StyledButton onClick={handleSignOut}>Logout</StyledButton>
          </div>
        ) : (
          <p>
            <Link href="/signin">Sign in</Link> to manage your tour schedules
          </p>
        )}
      </Header>
    </MainContainer>
  );
}
