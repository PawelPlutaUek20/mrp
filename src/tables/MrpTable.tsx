import React from "react";

import { TextInput, NumberInput, Table } from "@mantine/core";
import { Mrp, transpose } from "../utils";

type Props = {
  ghpVariables: any;
  inputRow: number[];
  table: (number | undefined)[][];
  setTableData: any;
  variablesState: {
    state: any;
    setState: any;
  };
};

const mrpRows = [
  "Całkowite zapotrzebowanie",
  "Planowanie przyjecia",
  "Przewidywane na stanie",
  "Zapotrzeboawnie netto",
  "Planowanie zamowienia",
  "Planowane przyjecie zamowien",
];

export const MrpTable: React.FC<Props> = React.memo(
  ({
    ghpVariables,
    table,
    setTableData,
    inputRow,
    variablesState: { state, setState },
  }) => {
    return (
      <>
        <div style={{ display: "flex", minWidth: 1100 }}>
          <Table my="md" style={{ maxWidth: "20em" }}>
            <tbody>
              <tr>
                <td>
                  <TextInput
                    size="lg"
                    readOnly
                    variant="unstyled"
                    value={"Dane produkcyjne / Okres"}
                    styles={(theme) => ({
                      input: { color: theme.colors.indigo, fontWeight: "bold" },
                    })}
                  />
                </td>
              </tr>
              {mrpRows.map((title, i) => (
                <tr key={i}>
                  <td>
                    <TextInput
                      size="lg"
                      readOnly
                      variant="unstyled"
                      value={title}
                      styles={(theme) => ({
                        input: { color: theme.colors.indigo },
                      })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table my="md">
            <thead>
              <tr>
                {inputRow.slice(ghpVariables.czasRealizacji).map((v, i) => (
                  <th
                    key={i}
                    style={{ textAlign: "center", fontWeight: "normal" }}
                  >
                    <TextInput
                      size="lg"
                      readOnly
                      variant="unstyled"
                      value={i + 1}
                      styles={(theme) => ({
                        input: {
                          textAlign: "center",
                          color: theme.colors.indigo,
                          backgroundColor: theme.colors.indigo[0],
                          borderRadius: "4px",
                          fontWeight: "bold",
                        },
                      })}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transpose(table.slice(ghpVariables.czasRealizacji))?.map(
                (row, index1) => (
                  <tr key={index1}>
                    {row.map((col, index2) =>
                      index1 !== Mrp.PLANOWANE_PRZYJECIA ? (
                        <td key={index2}>
                          <NumberInput
                            size="lg"
                            readOnly
                            variant="unstyled"
                            value={col}
                            styles={{
                              input: {
                                textAlign: "center",
                              },
                            }}
                          />
                        </td>
                      ) : (
                        <td key={index2}>
                          <NumberInput
                            size="lg"
                            value={
                              inputRow[index2 + ghpVariables.czasRealizacji] ||
                              undefined
                            }
                            hideControls
                            onChange={(value: number) => {
                              setTableData(value, index2);
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
        </div>
        {Object.entries(state).map(([variableKey, variableValue], index) => (
          <NumberInput
            key={index}
            size="lg"
            readOnly={index === 3}
            hideControls={index === 3}
            label={variableKey}
            min={0}
            value={variableValue as number | undefined}
            onChange={(value: number) => {
              setState({ [variableKey]: value || 0 });
            }}
          />
        ))}
      </>
    );
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps) === JSON.stringify(nextProps)
);
