import React from "react";
import styled from "styled-components";

const HeroSection = styled.div`
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Section = styled.section`
  padding: 4rem 0;
  background: ${props => props.dark ? "#f5f5f5" : "white"};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const Feature = styled.div`
  text-align: center;
  padding: 2rem;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

export default function Home() {
  return (
    <>
      <HeroSection>
        <Container>
          <Title>Empowering Sustainable Business Transformation</Title>
          <Subtitle>
            LeafX helps enterprises assess, plan, and achieve their sustainability goals
            through AI-powered insights and guidance.
          </Subtitle>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <h2 style={{ textAlign: "center", marginBottom: "3rem", fontSize: "2.5rem" }}>Why Choose LeafX?</h2>
          <Grid>
            <Feature>
              <FeatureIcon></FeatureIcon>
              <h3>Smart Goal Setting</h3>
              <p>Set achievable sustainability targets based on industry standards and your business context.</p>
            </Feature>
            <Feature>
              <FeatureIcon></FeatureIcon>
              <h3>Data-Driven Insights</h3>
              <p>Track and analyze your sustainability metrics with our advanced analytics platform.</p>
            </Feature>
            <Feature>
              <FeatureIcon></FeatureIcon>
              <h3>AI-Powered Assistant</h3>
              <p>Get instant answers and guidance from our intelligent sustainability assistant.</p>
            </Feature>
          </Grid>
        </Container>
      </Section>

      <Section dark>
        <Container>
          <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2.5rem" }}>Our Mission</h2>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Companies want to "go sustainable," but they often don't know where to start. 
              LeafX bridges this gap by providing clear, actionable insights and guidance.
            </p>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
              Our platform combines advanced AI technology with sustainability expertise to help 
              enterprises assess their current state, plan meaningful improvements, and track 
              real progress  all while avoiding greenwashing.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
