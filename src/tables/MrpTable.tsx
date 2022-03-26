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
        <Table my="md" style={{ maxWidth: "20em" }}>
          <tbody>
            <tr>
              <td>
                <TextInput
                  size="lg"
                  readOnly
                  variant="unstyled"
                  value={"Dane produkcyjne / Okres"}
                />
              </td>
            </tr>
            {mrpRows.map((title) => (
              <tr>
                <td>
                  <TextInput
                    size="lg"
                    readOnly
                    variant="unstyled"
                    value={title}
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
                <th style={{ textAlign: "center", fontWeight: "normal" }}>
                  <TextInput
                    size="lg"
                    readOnly
                    variant="unstyled"
                    value={i + 1}
                    styles={{
                      input: {
                        textAlign: "center",
                      },
                    }}
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
                      <td>
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
                      <td>
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
          size="lg"
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
