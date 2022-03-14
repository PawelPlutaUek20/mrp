import React from "react";
import {
  AppShell,
  Header,
  MantineProvider,
  Navbar,
  ScrollArea,
  Title,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";

import { NavbarContent } from "./NavbarContent";
import { MyTable } from "./Table";

const elements = [
  { name: "Przewidywany popyt" },
  { name: "Produkcja" },
  { name: "Dostępne" },
  { name: "Czas realizacji = Na stanie = " },
];

const elements2 = [
  { name: "Całkowite zapotrzebowanie" },
  { name: "Planowane przyjęcia" },
  { name: "Przewidywane na stanie" },
  { name: "Zapotrzebowanie netto" },
  { name: "Planowane zamówienia" },
  { name: "Planowane przyjęcie zamówień" },
  { name: "Czas realizacji = Wielkość partii = Poziom BOM = Na stanie = " },
];

const App = () => {
  const [opened, setOpened] = React.useState(false);
  const theme = useMantineTheme();

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <AppShell
        navbarOffsetBreakpoint="sm"
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
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 300, lg: 400 }}
          >
            <NavbarContent />
          </Navbar>
        }
        header={
          <Header height={70} p="md">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text>Algorytm MRP dla produkcji łóżek</Text>
            </div>
          </Header>
        }
      >
        <ScrollArea p="md" style={{ height: "100%" }}>
          <Title order={1}>GHP</Title>
          <MyTable
            headers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            headerTitle={"Tydzień:"}
            elements={elements}
          ></MyTable>
          <Title order={1}>MRP</Title>
          <MyTable
            headers={[1, 2, 3, 4, 5, 6]}
            headerTitle={"Dane produkcyjne: Okres:"}
            elements={elements2}
          ></MyTable>
        </ScrollArea>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
