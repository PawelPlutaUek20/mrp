import { Table, NumberInput } from "@mantine/core";

type Props = {
  elements: any[][];
};

export const MyTable: React.FC<Props> = ({ elements }) => {
  return (
    <Table my="md">
      <tbody>
        {elements.map((val, index) => (
          <tr key={index}>
            {val.map((num) => (
              <td>{num}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
