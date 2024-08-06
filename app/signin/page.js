// app/signin/page.js
"use client";
import React, { useState } from "react";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import { useUserAuth } from "../_utils/auth-context"; // Import context here
import { useRouter } from "next/navigation";

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  margin-left: 60px;
  background-color: #ffffff;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const IntroParagraph = styled.p`
  text-align: center;
  max-width: 600px;
  margin-bottom: 20px;
`;

export default function SignInPage() {
  const { signInEmailPassword, signUpEmailPassword, error } = useUserAuth(); // Use context here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      if (isSignUp) {
        await signUpEmailPassword(email, password);
      } else {
        await signInEmailPassword(email, password);
        router.push("/home"); // Redirect to home page
      }
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <MainContainer>
      <Header>
        <Title>Sign In</Title>
        <IntroParagraph>
          Access your account to manage your tour schedules.
        </IntroParagraph>
        <SignIn
          email={email}
          password={password}
          isSignUp={isSignUp}
          localError={localError}
          globalError={error}
          setEmail={setEmail}
          setPassword={setPassword}
          setIsSignUp={setIsSignUp}
          handleSubmit={handleSubmit}
        />
      </Header>
    </MainContainer>
  );
}
