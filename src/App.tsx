import React, { useEffect } from "react";

import {
  AppShell,
  Header,
  ScrollArea,
  Title,
  Text,
  Space,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";

import { getX, getY, Ghp, transpose } from "./utils";
import { MrpTable, GhpTable } from "./tables";

const App = () => {
  // Rama input row
  const [MRPPlanowanePrzyjecia, setMRPPlanowanePrzyjecia] = React.useState<
    number[]
  >([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Nogi input row
  const [MRPNogiPlanowanePrzyjecia, setMRPNogiPlanowanePrzyjecia] =
    React.useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Stelaz input row
  const [BOM2StelazPlanowanePrzyjecia, setBOM2StelazPlanowanePrzyjecia] =
    React.useState<number[]>([0, 30, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Ghp variables
  const [ghpVariables, setGhpVariables] = useSetState({
    czasRealizacji: 1,
    naStanie: 2,
  });

  // Rama variables
  const [mrpVariables, setMrpVariables] = useSetState({
    czasRealizacji: 3,
    naStanie: 22,
    poziomBOM: 1,
    wielkoscPartii: 40,
  });

  // Nogi Variables
  const [mrpNogiVariables, setMrpNogiVariables] = useSetState({
    czasRealizacji: 2,
    naStanie: 40,
    poziomBOM: 2,
    wielkoscPartii: 120,
  });

  // Stelaz variables
  const [bom2StelazVariables, setbom2StelazVariables] = useSetState({
    czasRealizacji: 1,
    naStanie: 10,
    poziomBOM: 2,
    wielkoscPartii: 10,
  });

  // GHP table
  const [GHP, setGHP] = React.useState<number[][]>(() => {
    const emptyArr = Array.from(Array(3), () => new Array(10).fill(undefined));
    emptyArr[Ghp.PRZEWIDYWANY_POPTY][4] = 20;
    emptyArr[Ghp.PRZEWIDYWANY_POPTY][6] = 40;
    emptyArr[Ghp.PRODUKCJA][4] = 28;
    emptyArr[Ghp.PRODUKCJA][6] = 30;
    return getY(emptyArr, ghpVariables);
  });

  // Rama table
  const [x, setX] = React.useState<number[][]>(() =>
    getX(GHP, MRPPlanowanePrzyjecia, mrpVariables, ghpVariables)
  );

  // Nogi table
  const [nogiX, setNogiX] = React.useState<number[][]>(() => {
    const newGhp = GHP.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
    return getX(newGhp, MRPNogiPlanowanePrzyjecia, mrpVariables, ghpVariables);
  });

  // Stelaz table
  const [x2, setX2] = React.useState<number[][]>(() => {
    const fakeGHP = Array.from(Array(1), () => new Array(10).fill(undefined));
    fakeGHP[Ghp.PRODUKCJA] = transpose(x)[4];
    return getX(
      fakeGHP,
      BOM2StelazPlanowanePrzyjecia,
      bom2StelazVariables,
      ghpVariables
    );
  });

  useEffect(
    () => setX(getX(GHP, MRPPlanowanePrzyjecia, mrpVariables, ghpVariables)),
    [mrpVariables, ghpVariables, GHP]
  );
  useEffect(() => setGHP(getY(GHP, ghpVariables)), [ghpVariables]);

  useEffect(() => {
    const newGhp = GHP.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
    setNogiX(
      getX(newGhp, MRPNogiPlanowanePrzyjecia, mrpNogiVariables, ghpVariables)
    );
  }, [mrpNogiVariables, ghpVariables, GHP]);

  useEffect(() => {
    const fakeGHP = Array.from(Array(1), () => new Array(10).fill(undefined));
    fakeGHP[Ghp.PRODUKCJA] = transpose(x)[4];
    setX2(
      getX(
        fakeGHP,
        BOM2StelazPlanowanePrzyjecia,
        bom2StelazVariables,
        ghpVariables
      )
    );
  }, [bom2StelazVariables, mrpVariables, x]);

  const updateStelaz = (value: number, index: number) =>
    setBOM2StelazPlanowanePrzyjecia((mrpPlanowanePrzyjecia) => {
      const tempGHP = mrpPlanowanePrzyjecia;
      tempGHP[index + ghpVariables.czasRealizacji] = value;
      const fakeGHP = Array.from(Array(1), () => new Array(10).fill(undefined));
      fakeGHP[Ghp.PRODUKCJA] = transpose(x)[4];
      setX2(getX(fakeGHP, tempGHP, bom2StelazVariables, ghpVariables));
      return tempGHP;
    });

  const updateNogi = (value: number, index: number) =>
    setMRPNogiPlanowanePrzyjecia((mrpPlanowanePrzyjecia) => {
      const tempGHP = mrpPlanowanePrzyjecia;
      tempGHP[index + ghpVariables.czasRealizacji] = value;
      const newGhp = GHP.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
      setNogiX(
        getX(newGhp, MRPNogiPlanowanePrzyjecia, mrpNogiVariables, ghpVariables)
      );

      return tempGHP;
    });

  const updateRama = (value: number, index: number) => {
    setMRPPlanowanePrzyjecia((mrpPlanowanePrzyjecia) => {
      const tempGHP = mrpPlanowanePrzyjecia;
      tempGHP[index + ghpVariables.czasRealizacji] = value;

      setX(getX(GHP, MRPPlanowanePrzyjecia, mrpVariables, ghpVariables));
      return tempGHP;
    });
  };

  const updateGhp = (value: number, index1: number, index2: number) => {
    setGHP((ghp) => {
      const tempGHP = ghp;
      tempGHP[index1][index2] = value;

      setX(getX(ghp, MRPPlanowanePrzyjecia, mrpVariables, ghpVariables));
      return getY(tempGHP, ghpVariables);
    });
  };

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
        <GhpTable
          table={GHP}
          setTableData={updateGhp}
          variablesState={{
            state: ghpVariables,
            setState: setGhpVariables,
          }}
        />
        <Space h="xl" />
        <Title order={1}>MRP</Title>
        <Space h="md" />
        <Title order={2}>Rama</Title>
        <MrpTable
          ghpVariables={ghpVariables}
          inputRow={MRPPlanowanePrzyjecia}
          table={x}
          setTableData={updateRama}
          variablesState={{
            state: mrpVariables,
            setState: setMrpVariables,
          }}
        />
        <Space h="md" />
        <Title order={2}>Nogi (4)</Title>
        <MrpTable
          ghpVariables={ghpVariables}
          inputRow={MRPNogiPlanowanePrzyjecia}
          table={nogiX}
          setTableData={updateNogi}
          variablesState={{
            state: mrpNogiVariables,
            setState: setMrpNogiVariables,
          }}
        />
        <Space h="md" />
        <Title order={2}>Stelaż</Title>
        <MrpTable
          ghpVariables={ghpVariables}
          inputRow={BOM2StelazPlanowanePrzyjecia}
          table={x2}
          setTableData={updateStelaz}
          variablesState={{
            state: bom2StelazVariables,
            setState: setbom2StelazVariables,
          }}
        />
      </ScrollArea>
    </AppShell>
  );
};

export default App;
