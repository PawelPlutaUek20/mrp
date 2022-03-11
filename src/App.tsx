import {
  AppShell,
  Header,
  MantineProvider,
  Navbar,
  NumberInput,
  ScrollArea,
  Table,
  Title,
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
  const rows = elements.map((element, index) => (
    <tr key={index}>
      <td>{element.name}</td>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
        <td>
          <NumberInput hideControls />
        </td>
      ))}
    </tr>
  ));

  const rows2 = elements2.map((element, index) => (
    <tr key={index}>
      <td>{element}</td>
      {[1, 2, 3, 4, 5, 6].map(() => (
        <td>
          <NumberInput hideControls />
        </td>
      ))}
    </tr>
  ));

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} height={"100%"} p="xs">
            {/* Navbar content */}
          </Navbar>
        }
        header={
          <Header height={60} p="xs">
            {/* Header content */}
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            paddingRight: 0,
          },
          body: {
            height: `calc(100% - 60px)`,
          },
        })}
      >
        <ScrollArea style={{ height: "100%", paddingRight: 16 }}>
          <Title
            sx={(theme) => ({
              color: theme.colors.gray[0],
            })}
            order={1}
          >
            GHP
          </Title>
          <Table sx={{ marginTop: 16, marginBottom: 16 }}>
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
          <Title
            sx={(theme) => ({
              color: theme.colors.gray[0],
            })}
            order={1}
          >
            MRP
          </Title>
          <Table sx={{ marginTop: 16, marginBottom: 16 }}>
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
