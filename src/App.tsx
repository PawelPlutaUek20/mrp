import React, { useEffect } from "react";
import {
  AppShell,
  Header,
  MantineProvider,
  ScrollArea,
  Title,
  Text,
  Table,
  NumberInput,
  Space,
} from "@mantine/core";

function transpose(matrix: any[][]) {
  return matrix[0]?.map((col, i) => matrix.map((row) => row[i]));
}

const App = () => {
  const [MRPPlanowanePrzyjecia, setMRPPlanowanePrzyjecia] = React.useState<
    number[]
  >([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [ghpVariables, setGhpVariables] = React.useState({
    czasRealizacji: 1,
    naStanie: 2,
  });

  const [mrpVariables, setMrpVariables] = React.useState({
    czasRealizacji: 2,
    naStanie: 22,
    poziomBOM: 1,
    wielkoscPartii: 40,
  });

  const getY = (ghp: number[][]): number[][] => {
    const a = transpose(ghp).reduce(
      (acc, val, idx) =>
        idx === 0
          ? [
              ...acc,
              [
                val[0] || 0,
                val[1] || 0,
                (val[1] || 0) - (val[0] || 0) + ghpVariables.naStanie,
              ],
            ]
          : [
              ...acc,
              [
                val[0] || 0,
                val[1] || 0,
                (val[1] || 0) - (val[0] || 0) + (acc[idx - 1][2] || 0),
              ],
            ],
      []
    );
    return transpose(a);
  };

  const getX = (ghp: number[][], czasRealizacji: number): number[][] => {
    const res = transpose(ghp).reduce((acc, val, index) => {
      return !val[0] && !val[1]
        ? [
            ...acc,
            [
              undefined,
              MRPPlanowanePrzyjecia[index] || 0,
              acc[index - 1]
                ? (acc[index - 1][2] || 0) + (MRPPlanowanePrzyjecia[index] || 0)
                : mrpVariables.naStanie + (MRPPlanowanePrzyjecia[index] || 0),
              undefined,
              undefined,
              undefined,
            ],
          ]
        : index - 1 >= 0 && acc[index - 1][2] - val[1] < 0
        ? [
            ...acc,
            [
              val[1] || 0,
              MRPPlanowanePrzyjecia[index] || 0,
              mrpVariables.wielkoscPartii -
                ((val[1] || 0) -
                  (index - 1 >= 0
                    ? acc[index - 1][2] || 0
                    : mrpVariables.naStanie)) +
                (MRPPlanowanePrzyjecia[index] || 0),
              (val[1] || 0) - (acc[index - 1][2] || 0),
              undefined,
              mrpVariables.wielkoscPartii,
            ],
          ]
        : [
            ...acc,
            [
              val[1] || 0,
              MRPPlanowanePrzyjecia[index] || 0,
              (index - 1 >= 0
                ? acc[index - 1][2] || 0
                : mrpVariables.naStanie) -
                (val[1] || 0) +
                (MRPPlanowanePrzyjecia[index] || 0),
              undefined,
              undefined,
              undefined,
            ],
          ];
    }, []);

    res.forEach((item, index) => {
      if (item[5] && index - czasRealizacji >= 0) {
        res[index - czasRealizacji][4] = item[5];
      }
    });
    return res;
  };

  const [GHP, setGHP] = React.useState<number[][]>(() => {
    const emptyArr = Array.from(Array(3), () => new Array(10).fill(undefined));
    emptyArr[0][4] = 20;
    emptyArr[0][6] = 40;
    emptyArr[1][4] = 28;
    emptyArr[1][6] = 30;
    return getY(emptyArr);
  });

  const [x, setX] = React.useState<number[][]>(() =>
    getX(GHP, mrpVariables.czasRealizacji)
  );

  useEffect(() => setX(getX(GHP, mrpVariables.czasRealizacji)), [mrpVariables]);
  useEffect(() => setGHP(getY(GHP)), [ghpVariables]);

  return (
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
        <ScrollArea p="md" style={{ height: "100%" }}>
          <Title order={1}>GHP</Title>
          <Table my="md">
            <tbody>
              {GHP.map((row, index1) => (
                <tr key={index1}>
                  {row.map((col, index2) =>
                    index1 === 2 ? (
                      <td style={{ height: 50.5, textAlign: "center" }}>
                        {col}
                      </td>
                    ) : (
                      <td>
                        <NumberInput
                          value={col || undefined}
                          hideControls
                          onChange={(value: number) => {
                            setGHP((ghp) => {
                              const tempGHP = ghp;
                              tempGHP[index1][index2] = value;

                              setX(getX(ghp, mrpVariables.czasRealizacji));
                              return getY(tempGHP);
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
          <NumberInput
            label="Czas realizacji"
            min={0}
            value={ghpVariables.czasRealizacji}
            onChange={(value: number) => {
              setGhpVariables((ghpVariables) => ({
                ...ghpVariables,
                czasRealizacji: value || 0,
              }));
            }}
          />
          <NumberInput
            label="Na stanie"
            value={ghpVariables.naStanie}
            onChange={(value: number) => {
              setGhpVariables((ghpVariables) => ({
                ...ghpVariables,
                naStanie: value,
              }));
            }}
          />
          <Space h="xl" />
          <Title order={1}>MRP</Title>
          <Table my="md">
            <tbody>
              {transpose(x.slice(ghpVariables.czasRealizacji))?.map(
                (row, index1) => (
                  <tr key={index1}>
                    {row.map((col, index2) =>
                      index1 !== 1 ? (
                        <td style={{ height: 50.5, textAlign: "center" }}>
                          {col}
                        </td>
                      ) : (
                        <td>
                          <NumberInput
                            value={MRPPlanowanePrzyjecia[index2] || undefined}
                            hideControls
                            onChange={(value: number) => {
                              setMRPPlanowanePrzyjecia(
                                (mrpPlanowanePrzyjecia) => {
                                  const tempGHP = mrpPlanowanePrzyjecia;
                                  tempGHP[index2] = value;

                                  setX(getX(GHP, mrpVariables.czasRealizacji));
                                  return tempGHP;
                                }
                              );
                            }}
                          />
                        </td>
                      )
                    )}
                  </tr>
                )
              )}
            </tbody>
          </Table>
          <NumberInput
            label="Czas realizacji"
            min={0}
            value={mrpVariables.czasRealizacji}
            onChange={(value: number) => {
              setMrpVariables((mrpVariables) => ({
                ...mrpVariables,
                czasRealizacji: value || 0,
              }));
            }}
          />
          <NumberInput
            label="Na stanie"
            min={0}
            value={mrpVariables.naStanie}
            onChange={(value: number) => {
              setMrpVariables((mrpVariables) => ({
                ...mrpVariables,
                naStanie: value || 0,
              }));
            }}
          />
          <NumberInput
            label="Wielkosc Partii"
            min={0}
            value={mrpVariables.wielkoscPartii}
            onChange={(value: number) => {
              setMrpVariables((mrpVariables) => ({
                ...mrpVariables,
                wielkoscPartii: value || 0,
              }));
            }}
          />
        </ScrollArea>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
