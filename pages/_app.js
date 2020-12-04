import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import Head from "next/head";
import "./app.css";
import styled from "styled-components";

const ConfettiCanvas = styled.canvas`
  position: absolute;
  top: 0;
`;

const theme = {};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>
        <ConfettiCanvas id="confetti" />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
