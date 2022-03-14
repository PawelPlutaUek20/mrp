import { Table, NumberInput } from "@mantine/core"

export const MyTable = (props:any) => {
    return <Table {...props}>
    <thead>
      <tr>
        <th>{props.headerTitle}</th>
        {props.headers.map((week:number) => (
          <th>{week}</th>
        ))}
      </tr>
    </thead>
    <tbody>
    {props.elements.map((element:any, index:any) => (
    <tr key={index}>
      <td>{element.name}</td>
      {index !== (props.elements.length-1) &&
        props.headers.map(() => (
          <td>
            <NumberInput hideControls sx={{minWidth:40,maxWidth:40}} />
          </td>
        ))}
    </tr>
    ))}
    </tbody>
  </Table>
}