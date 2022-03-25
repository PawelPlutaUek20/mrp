import { NumberInput, Table } from "@mantine/core";
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

export const GhpTable: React.FC<Props> = ({
  table,
  setTableData,
  variablesState: { state, setState },
}) => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Table style={{ marginTop: 16, marginBottom: 16, maxWidth: 200 }}>
          <tbody>
            <tr>
              <td>tydzien:</td>
            </tr>
            {ghpRows.map((row) => (
              <tr>
                <td style={{ height: 51 }}>{row}</td>
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
                  <th style={{ textAlign: "center", fontWeight: "normal" }}>
                    {i + 1}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, index1) => (
              <tr style={{ height: 51 }} key={index1}>
                {row.map((col, index2) =>
                  index1 === Ghp.DOSTEPNE ? (
                    <td style={{ height: 50.5, textAlign: "center" }}>{col}</td>
                  ) : (
                    <td>
                      <NumberInput
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
      {Object.entries(state).map(([variableKey, variableValue]) => (
        <NumberInput
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
