import React, { useCallback, useEffect } from "react";

import { ScrollArea, Title, Space } from "@mantine/core";
import { useSetState } from "@mantine/hooks";

import { mrpAlgorithm, ghpAlgorithm, Ghp, transpose } from "./utils";
import { MrpTable, GhpTable } from "./tables";

const App = () => {
  const [RamaPlanowanePrzyjecia, setRamaPlanowanePrzyjecia] = React.useState<
    number[]
  >([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [NogiPlanowanePrzyjecia, setNogiPlanowanePrzyjecia] = React.useState<
    number[]
  >([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [StelazPlanowanePrzyjecia, setStelazPlanowanePrzyjecia] =
    React.useState<number[]>([0, 30, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [ZaglowekPlanowanePrzyjecia, setZaglowekPlanowanePrzyjecia] =
    React.useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [ghpVariables, setGhpVariables] = useSetState({
    czasRealizacji: 1,
    naStanie: 2,
  });

  const [ramaVariables, setRamaVariables] = useSetState({
    czasRealizacji: 3,
    naStanie: 22,
    wielkoscPartii: 40,
    poziomBOM: 1,
  });

  const [NogiVariables, setNogiVariables] = useSetState({
    czasRealizacji: 2,
    naStanie: 40,
    wielkoscPartii: 120,
    poziomBOM: 1,
  });

  const [StelazVariables, setStelazVariables] = useSetState({
    czasRealizacji: 1,
    naStanie: 10,
    wielkoscPartii: 10,
    poziomBOM: 2,
  });

  const [ZaglowekVariables, setZaglowekVariables] = useSetState({
    czasRealizacji: 1,
    naStanie: 10,
    wielkoscPartii: 10,
    poziomBOM: 2,
  });

  const [ghp, setGhp] = React.useState<number[][]>(() => {
    const emptyArr = Array.from(Array(3), () => new Array(10).fill(undefined));
    emptyArr[Ghp.PRZEWIDYWANY_POPTY][4] = 20;
    emptyArr[Ghp.PRZEWIDYWANY_POPTY][6] = 40;
    emptyArr[Ghp.PRODUKCJA][4] = 28;
    emptyArr[Ghp.PRODUKCJA][6] = 30;
    return ghpAlgorithm(emptyArr, ghpVariables);
  });

  const [rama, setRama] = React.useState<number[][]>(() =>
    mrpAlgorithm(ghp, RamaPlanowanePrzyjecia, ramaVariables, ghpVariables)
  );

  const [nogi, setNogi] = React.useState<number[][]>(() => {
    const newGhp = ghp.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
    return mrpAlgorithm(
      newGhp,
      NogiPlanowanePrzyjecia,
      ramaVariables,
      ghpVariables
    );
  });

  const [stelaz, setStelaz] = React.useState<number[][]>(() => {
    const fakeGHP = Array.from(Array(1), () => new Array(10).fill(undefined));
    fakeGHP[Ghp.PRODUKCJA] = transpose(rama)[4];
    return mrpAlgorithm(
      fakeGHP,
      StelazPlanowanePrzyjecia,
      StelazVariables,
      ghpVariables
    );
  });

  const [zaglowek, setZaglowek] = React.useState<number[][]>(() => {
    const fakeGHP = Array.from(Array(1), () => new Array(10).fill(undefined));
    fakeGHP[Ghp.PRODUKCJA] = transpose(rama)[4];
    return mrpAlgorithm(
      fakeGHP,
      ZaglowekPlanowanePrzyjecia,
      ZaglowekVariables,
      ghpVariables
    );
  });

  useEffect(
    () =>
      setRama(
        mrpAlgorithm(ghp, RamaPlanowanePrzyjecia, ramaVariables, ghpVariables)
      ),
    [ramaVariables, ghpVariables, ghp, RamaPlanowanePrzyjecia]
  );

  useEffect(
    () => setGhp((ghp) => ghpAlgorithm(ghp, ghpVariables)),
    [ghpVariables]
  );

  useEffect(() => {
    const newGhp = ghp.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
    setNogi(
      mrpAlgorithm(newGhp, NogiPlanowanePrzyjecia, NogiVariables, ghpVariables)
    );
  }, [NogiVariables, ghpVariables, ghp, NogiPlanowanePrzyjecia]);

  useEffect(() => {
    const fakeGHP = Array.from(Array(1), () => new Array(10).fill(undefined));
    fakeGHP[Ghp.PRODUKCJA] = transpose(rama)[4];
    setStelaz(
      mrpAlgorithm(
        fakeGHP,
        StelazPlanowanePrzyjecia,
        StelazVariables,
        ghpVariables
      )
    );
  }, [
    StelazVariables,
    ramaVariables,
    rama,
    StelazPlanowanePrzyjecia,
    ghpVariables,
  ]);

  useEffect(() => {
    const fakeGHP = Array.from(Array(1), () => new Array(10).fill(undefined));
    fakeGHP[Ghp.PRODUKCJA] = transpose(rama)[4];
    setZaglowek(
      mrpAlgorithm(
        fakeGHP,
        ZaglowekPlanowanePrzyjecia,
        ZaglowekVariables,
        ghpVariables
      )
    );
  }, [
    ZaglowekVariables,
    ramaVariables,
    rama,
    ZaglowekPlanowanePrzyjecia,
    ghpVariables,
  ]);

  const updateStelaz = useCallback(
    (value: number, index: number) =>
      setStelazPlanowanePrzyjecia((RamaPlanowanePrzyjecia) => {
        const tempGHP = RamaPlanowanePrzyjecia;
        tempGHP[index + ghpVariables.czasRealizacji] = value;
        const fakeGHP = Array.from(Array(1), () =>
          new Array(10).fill(undefined)
        );
        fakeGHP[Ghp.PRODUKCJA] = transpose(rama)[4];
        setStelaz(
          mrpAlgorithm(fakeGHP, tempGHP, StelazVariables, ghpVariables)
        );
        return tempGHP;
      }),
    [
      setStelaz,
      setStelazPlanowanePrzyjecia,
      StelazVariables,
      ghpVariables,
      rama,
    ]
  );

  const updateZaglowek = useCallback(
    (value: number, index: number) =>
      setZaglowekPlanowanePrzyjecia((RamaPlanowanePrzyjecia) => {
        const tempGHP = RamaPlanowanePrzyjecia;
        tempGHP[index + ghpVariables.czasRealizacji] = value;
        const fakeGHP = Array.from(Array(1), () =>
          new Array(10).fill(undefined)
        );
        fakeGHP[Ghp.PRODUKCJA] = transpose(rama)[4];
        setZaglowek(
          mrpAlgorithm(fakeGHP, tempGHP, ZaglowekVariables, ghpVariables)
        );
        return tempGHP;
      }),
    [
      setZaglowek,
      setZaglowekPlanowanePrzyjecia,
      ghpVariables,
      ZaglowekVariables,
      rama,
    ]
  );

  const updateNogi = useCallback(
    (value: number, index: number) =>
      setNogiPlanowanePrzyjecia((RamaPlanowanePrzyjecia) => {
        const tempGHP = RamaPlanowanePrzyjecia;
        tempGHP[index + ghpVariables.czasRealizacji] = value;
        const newGhp = ghp.map((v, i) => (i === 1 ? v.map((w) => w * 4) : v));
        setNogi(
          mrpAlgorithm(
            newGhp,
            NogiPlanowanePrzyjecia,
            NogiVariables,
            ghpVariables
          )
        );

        return tempGHP;
      }),
    [
      setNogi,
      setNogiPlanowanePrzyjecia,
      NogiPlanowanePrzyjecia,
      ghp,
      ghpVariables,
      NogiVariables,
    ]
  );

  const updateRama = useCallback(
    (value: number, index: number) => {
      setRamaPlanowanePrzyjecia((RamaPlanowanePrzyjecia) => {
        const tempGHP = RamaPlanowanePrzyjecia;
        tempGHP[index + ghpVariables.czasRealizacji] = value;

        setRama(
          mrpAlgorithm(ghp, RamaPlanowanePrzyjecia, ramaVariables, ghpVariables)
        );
        return tempGHP;
      });
    },
    [setRama, setRamaPlanowanePrzyjecia, ghp, ghpVariables, ramaVariables]
  );

  const updateGhp = useCallback(
    (value: number, index1: number, index2: number) => {
      setGhp((ghp) => {
        const tempGHP = ghp;
        tempGHP[index1][index2] = value;
        return ghpAlgorithm(tempGHP, ghpVariables);
      });
    },
    [setGhp, ghpVariables]
  );

  return (
    <ScrollArea p="md" style={{ height: "100%" }}>
      <Title order={1}>GHP</Title>
      <GhpTable
        table={ghp}
        setTableData={updateGhp}
        variablesState={{
          state: ghpVariables,
          setState: setGhpVariables,
        }}
      />
      <Space h="xl" />
      <Title order={1}>MRP</Title>
      <Space h="md" />
      <Title order={2}>Nogi (4)</Title>
      <MrpTable
        ghpVariables={ghpVariables}
        inputRow={NogiPlanowanePrzyjecia}
        table={nogi}
        setTableData={updateNogi}
        variablesState={{
          state: NogiVariables,
          setState: setNogiVariables,
        }}
      />
      <Space h="md" />
      <Title order={2}>Rama</Title>
      <MrpTable
        ghpVariables={ghpVariables}
        inputRow={RamaPlanowanePrzyjecia}
        table={rama}
        setTableData={updateRama}
        variablesState={{
          state: ramaVariables,
          setState: setRamaVariables,
        }}
      />
      <Space h="md" />
      <Title order={2}>Stelaż</Title>
      <MrpTable
        ghpVariables={ghpVariables}
        inputRow={StelazPlanowanePrzyjecia}
        table={stelaz}
        setTableData={updateStelaz}
        variablesState={{
          state: StelazVariables,
          setState: setStelazVariables,
        }}
      />
      <Space h="md" />
      <Title order={2}>Zagłówek</Title>
      <MrpTable
        ghpVariables={ghpVariables}
        inputRow={ZaglowekPlanowanePrzyjecia}
        table={zaglowek}
        setTableData={updateZaglowek}
        variablesState={{
          state: ZaglowekVariables,
          setState: setZaglowekVariables,
        }}
      />
    </ScrollArea>
  );
};

export default App;
