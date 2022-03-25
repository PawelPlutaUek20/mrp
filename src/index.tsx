import React from "react";
import ReactDOM from "react-dom";

import { AppShell, Header, MantineProvider, Text } from "@mantine/core";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "light" }}
    >
      <AppShell
        padding={0}
        fixed
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            height: `100vh`,
          },
        })}
        header={
          <Header height={70} p="md">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <Text>Algorytm MRP dla produkcji łóżek</Text>
            </div>
          </Header>
        }
      >
        <App />
      </AppShell>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
