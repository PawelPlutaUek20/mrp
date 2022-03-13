import React from "react";
import {
  AppShell,
  Header,
  MantineProvider,
  Navbar,
  NumberInput,
  ScrollArea,
  Table,
  Title,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";

const elements = [
  { name: "Przewidywany popyt" },
  { name: "Produkcja" },
  { name: "Dostępne" },
  { name: "Czas realizacji = Na stanie = " },
];

const elements2 = [
  "Całkowite zapotrzebowanie",
  "Planowane przyjęcia",
  "Przewidywane na stanie",
  "Zapotrzebowanie netto",
  "Planowane zamówienia",
  "Planowane przyjęcie zamówień",
  "Czas realizacji = Wielkość partii = Poziom BOM = Na stanie = ",
];

const App = () => {
  const [opened, setOpened] = React.useState(false);
  const theme = useMantineTheme();

  const rows = elements.map((element, index) => (
    <tr key={index}>
      <td>{element.name}</td>
      {index !== 3 &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
          <td>
            <NumberInput hideControls />
          </td>
        ))}
    </tr>
  ));

  const rows2 = elements2.map((element, index) => (
    <tr key={index}>
      <td>{element}</td>
      {index !== 6 &&
        [1, 2, 3, 4, 5, 6].map(() => (
          <td>
            <NumberInput hideControls />
          </td>
        ))}
    </tr>
  ));

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
        styles={{
          body: {
            height: `100%`,
          },
        }}
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 300, lg: 400 }}
          >
            <Text>Application navbar</Text>
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

              <Text>Application header</Text>
            </div>
          </Header>
        }
      >
        <ScrollArea p="md" style={{ height: "100%" }}>
          <Title order={1}>GHP</Title>
          <Table my="md">
            <thead>
              <tr>
                <th>tydzień:</th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((week) => (
                  <th>{week}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          <Title order={1}>MRP</Title>
          <Table mt="md">
            <thead>
              <tr>
                <th>Dane produkcyjne: Okres</th>
                {[1, 2, 3, 4, 5, 6].map((week) => (
                  <th>{week}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows2}</tbody>
          </Table>
        </ScrollArea>
      </AppShell>
    </MantineProvider>
  );
};

export default App;