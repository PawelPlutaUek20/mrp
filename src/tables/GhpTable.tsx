import React from "react";

import { NumberInput, Table, TextInput } from "@mantine/core";
import { Ghp } from "../utils";

const ghpRows = ["Przewidywany popyt", "Produkcja", "Dostepne"];

type Props = {
  table: any[][];
  setTableData: any;
  variablesState: {
    state: any;
    setState: any;
  };
};

export const GhpTable: React.FC<Props> = React.memo(
  ({ table, setTableData, variablesState: { state, setState } }) => {
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
                    value={"Tydzien:"}
                    styles={(theme) => ({
                      input: { color: theme.colors.indigo, fontWeight: "bold" },
                    })}
                  />
                </td>
              </tr>
              {ghpRows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <TextInput
                      size="lg"
                      readOnly
                      variant="unstyled"
                      value={row}
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
                {Array(10)
                  .fill(undefined)
                  .map((v, i) => (
                    <th key={i}>
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
              {table.map((row, index1) => (
                <tr key={index1}>
                  {row.map((col, index2) =>
                    index1 === Ghp.DOSTEPNE ? (
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
                          value={col || undefined}
                          hideControls
                          onChange={(value: number) => {
                            setTableData(value, index1, index2);
                          }}
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {Object.entries(state).map(([variableKey, variableValue], i) => (
          <NumberInput
            key={i}
            size="lg"
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
