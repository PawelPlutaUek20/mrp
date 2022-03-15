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
  Table,
  NumberInput,
} from "@mantine/core";

import { NavbarContent } from "./NavbarContent";
import { MyTable } from "./Table";

function transpose(matrix: any[][]) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

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

  const [GHP, setGHP] = React.useState([
    [null, null, null, null, 20, null, 40, null, null, null],
    [null, null, null, null, 28, null, 30, null, null, null],
    [2, 2, 2, 2, 10, 10, 0, 0, 0, 0],
  ]);

  const naStanie = 22;
  const wielkoscPartii = 40;

  const getX = (ghp: any[][]): any[][] => {
    return transpose(ghp).reduce((acc, val, index) => {
      return !val[0] && !val[1]
        ? [
            ...acc,
            [
              null,
              null,
              acc[index - 1] ? acc[index - 1][2] : naStanie,
              null,
              null,
              null,
            ],
          ]
        : acc[index - 1][2] - val[1] < 0
        ? [
            ...acc,
            [
              val[1],
              null,
              wielkoscPartii - (val[1] - acc[index - 1][2]),
              val[1] - acc[index - 1][2],
              null,
              wielkoscPartii,
            ],
          ]
        : [
            ...acc,
            [val[1], null, acc[index - 1][2] - val[1], null, null, null],
          ];
    }, []);
  };

  const [x, setX] = React.useState<any[][]>(() => getX(GHP));

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
          <Table my="md">
            <tbody>
              {GHP.map((row, index1) => (
                <tr key={index1}>
                  {row.map((col, index2) =>
                    index1 == 2 ? (
                      <td>{col}</td>
                    ) : (
                      <td>
                        <NumberInput
                          value={col || undefined}
                          hideControls
                          onChange={(value: number) => {
                            setGHP((ghp) => {
                              const tempGHP = ghp;
                              tempGHP[index1][index2] = value;

                              setX(getX(ghp));
                              return tempGHP;
                            });
                          }}
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <Title order={1}>MRP</Title>
          <MyTable elements={transpose(x)}></MyTable>
        </ScrollArea>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
