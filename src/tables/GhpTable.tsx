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

export const GhpTable: React.FC<Props> = ({
  table,
  setTableData,
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
                  value={"tydzien:"}
                />
              </td>
            </tr>
            {ghpRows.map((row) => (
              <tr>
                <td>
                  <TextInput
                    size="lg"
                    readOnly
                    variant="unstyled"
                    value={row}
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
                  <th>
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
            {table.map((row, index1) => (
              <tr style={{ height: 51 }} key={index1}>
                {row.map((col, index2) =>
                  index1 === Ghp.DOSTEPNE ? (
                    <td>
                      <NumberInput
                        size="lg"
                        readOnly
                        variant="unstyled"
                        value={col}
                      />
                    </td>
                  ) : (
                    <td>
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
      {Object.entries(state).map(([variableKey, variableValue]) => (
        <NumberInput
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
};
