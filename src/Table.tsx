import { Table, NumberInput } from "@mantine/core";

type Props = {
  headerTitle: string;
  headers: number[];
  elements: { name: string }[];
};

export const MyTable: React.FC<Props> = ({
  headerTitle,
  headers,
  elements,
}) => {
  return (
    <Table my="md">
      <thead>
        <tr>
          <th>{headerTitle}</th>
          {headers.map((week) => (
            <th>{week}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {elements.map(({ name }, index) => (
          <tr key={index}>
            <td>{name}</td>
            {index !== elements.length - 1 &&
              headers.map(() => (
                <td>
                  <NumberInput
                    hideControls
                    sx={{ minWidth: 40, maxWidth: 40 }}
                  />
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
