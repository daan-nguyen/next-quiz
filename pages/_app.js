import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import Head from "next/head";
import "./app.css";

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
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
