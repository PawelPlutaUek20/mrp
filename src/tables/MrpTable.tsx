import { NumberInput, Table } from "@mantine/core";
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

export const MrpTable: React.FC<Props> = ({
  ghpVariables,
  table,
  setTableData,
  inputRow,
  variablesState: { state, setState },
}) => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Table style={{ marginTop: 16, marginBottom: 16, maxWidth: 250 }}>
          <tbody>
            <tr>
              <td>Dane produkcyjne / Okres</td>
            </tr>
            {mrpRows.map((title) => (
              <tr>
                <td style={{ height: 51 }}>{title}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Table my="md">
          <thead>
            <tr>
              {inputRow.slice(ghpVariables.czasRealizacji).map((v, i) => (
                <th style={{ textAlign: "center", fontWeight: "normal" }}>
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transpose(table.slice(ghpVariables.czasRealizacji))?.map(
              (row, index1) => (
                <tr key={index1} style={{ height: 51 }}>
                  {row.map((col, index2) =>
                    index1 !== Mrp.PLANOWANE_PRZYJECIA ? (
                      <td style={{ height: 50.5, textAlign: "center" }}>
                        {col}
                      </td>
                    ) : (
                      <td>
                        <NumberInput
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
          disabled={index === 2}
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
};
