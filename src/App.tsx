import React, { useEffect } from "react";

import {
  AppShell,
  Header,
  ScrollArea,
  Title,
  Text,
  Table,
  NumberInput,
  Space,
} from "@mantine/core";

import { getX, getY, Ghp, Mrp, transpose } from "./utils";

const App = () => {
  const [MRPPlanowanePrzyjecia, setMRPPlanowanePrzyjecia] = React.useState<
    number[]
  >([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [MRPNogiPlanowanePrzyjecia, setMRPNogiPlanowanePrzyjecia] =
    React.useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [ghpVariables, setGhpVariables] = React.useState({
    czasRealizacji: 1,
    naStanie: 2,
  });

  const [mrpVariables, setMrpVariables] = React.useState({
    czasRealizacji: 3,
    naStanie: 22,
    poziomBOM: 1,
    wielkoscPartii: 40,
  });

  const [mrpNogiVariables, setMrpNogiVariables] = React.useState({
    czasRealizacji: 2,
    naStanie: 40,
    poziomBOM: 2,
    wielkoscPartii: 120,
  });

  const [GHP, setGHP] = React.useState<number[][]>(() => {
    const emptyArr = Array.from(Array(3), () => new Array(10).fill(undefined));
    emptyArr[Ghp.PRZEWIDYWANY_POPTY][4] = 20;
    emptyArr[Ghp.PRZEWIDYWANY_POPTY][6] = 40;
    emptyArr[Ghp.PRODUKCJA][4] = 28;
    emptyArr[Ghp.PRODUKCJA][6] = 30;
    return getY(emptyArr, ghpVariables);
  });

  const [x, setX] = React.useState<number[][]>(() =>
    getX(GHP, MRPPlanowanePrzyjecia, mrpVariables)
  );

  const [nogiX, setNogiX] = React.useState<number[][]>(() => {
    const newGhp = GHP.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
    return getX(newGhp, MRPNogiPlanowanePrzyjecia, mrpVariables);
  });

  useEffect(
    () => setX(getX(GHP, MRPPlanowanePrzyjecia, mrpVariables)),
    [mrpVariables]
  );
  useEffect(() => setGHP(getY(GHP, ghpVariables)), [ghpVariables]);

  useEffect(() => {
    const newGhp = GHP.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
    setNogiX(getX(newGhp, MRPNogiPlanowanePrzyjecia, mrpNogiVariables));
  }, [mrpNogiVariables]);

  return (
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
                  index1 === Ghp.DOSTEPNE ? (
                    <td style={{ height: 50.5, textAlign: "center" }}>{col}</td>
                  ) : (
                    <td>
                      <NumberInput
                        value={col || undefined}
                        hideControls
                        onChange={(value: number) => {
                          setGHP((ghp) => {
                            const tempGHP = ghp;
                            tempGHP[index1][index2] = value;

                            setX(
                              getX(ghp, MRPPlanowanePrzyjecia, mrpVariables)
                            );
                            return getY(tempGHP, ghpVariables);
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
          min={0}
          value={ghpVariables.naStanie}
          onChange={(value: number) => {
            setGhpVariables((ghpVariables) => ({
              ...ghpVariables,
              naStanie: value || 0,
            }));
          }}
        />
        <Space h="xl" />
        <Title order={1}>MRP</Title>
        <Space h="md" />
        <Title order={2}>Rama</Title>
        <Table my="md">
          <tbody>
            {transpose(x.slice(ghpVariables.czasRealizacji))?.map(
              (row, index1) => (
                <tr key={index1}>
                  {row.map((col, index2) =>
                    index1 !== Mrp.PLANOWANE_PRZYJECIA ? (
                      <td style={{ height: 50.5, textAlign: "center" }}>
                        {col}
                      </td>
                    ) : (
                      <td>
                        <NumberInput
                          value={
                            MRPPlanowanePrzyjecia[
                              index2 + ghpVariables.czasRealizacji
                            ] || undefined
                          }
                          hideControls
                          onChange={(value: number) => {
                            setMRPPlanowanePrzyjecia(
                              (mrpPlanowanePrzyjecia) => {
                                const tempGHP = mrpPlanowanePrzyjecia;
                                tempGHP[index2 + ghpVariables.czasRealizacji] =
                                  value;

                                setX(
                                  getX(GHP, MRPPlanowanePrzyjecia, mrpVariables)
                                );
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
        <Space h="md" />
        <Title order={2}>Nogi (4)</Title>
        <Table my="md">
          <tbody>
            {transpose(nogiX.slice(ghpVariables.czasRealizacji))?.map(
              (row, index1) => (
                <tr key={index1}>
                  {row.map((col, index2) =>
                    index1 !== Mrp.PLANOWANE_PRZYJECIA ? (
                      <td style={{ height: 50.5, textAlign: "center" }}>
                        {col}
                      </td>
                    ) : (
                      <td>
                        <NumberInput
                          value={
                            MRPNogiPlanowanePrzyjecia[
                              index2 + ghpVariables.czasRealizacji
                            ] || undefined
                          }
                          hideControls
                          onChange={(value: number) => {
                            setMRPNogiPlanowanePrzyjecia(
                              (mrpPlanowanePrzyjecia) => {
                                const tempGHP = mrpPlanowanePrzyjecia;
                                tempGHP[index2 + ghpVariables.czasRealizacji] =
                                  value;
                                const newGhp = GHP.map((v, i) =>
                                  i === 1 ? v.map((w) => w * 4) : v
                                );
                                setNogiX(
                                  getX(
                                    newGhp,
                                    MRPNogiPlanowanePrzyjecia,
                                    mrpNogiVariables
                                  )
                                );

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
          value={mrpNogiVariables.czasRealizacji}
          onChange={(value: number) => {
            setMrpNogiVariables((mrpVariables) => ({
              ...mrpVariables,
              czasRealizacji: value || 0,
            }));
          }}
        />
        <NumberInput
          label="Na stanie"
          min={0}
          value={mrpNogiVariables.naStanie}
          onChange={(value: number) => {
            setMrpNogiVariables((mrpVariables) => ({
              ...mrpVariables,
              naStanie: value || 0,
            }));
          }}
        />
        <NumberInput
          label="Wielkosc Partii"
          min={0}
          value={mrpNogiVariables.wielkoscPartii}
          onChange={(value: number) => {
            setMrpNogiVariables((mrpVariables) => ({
              ...mrpVariables,
              wielkoscPartii: value || 0,
            }));
          }}
        />
      </ScrollArea>
    </AppShell>
  );
};

export default App;
