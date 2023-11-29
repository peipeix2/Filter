import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@nextui-org/react'
import useUserStore from '../../store/userStore'

const Setting = () => {
  const { user } = useUserStore()

  return (
    <Table>
      <TableHeader>
        <TableColumn>欄位</TableColumn>
        <TableColumn>名稱</TableColumn>
        <TableColumn>修改</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>用戶名稱</TableCell>
          <TableCell>{user.username}</TableCell>
          <TableCell>
            <Button size="sm">修改</Button>
          </TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>頭像</TableCell>
          <TableCell>
            <img src={user.avatar} className="w-20" />
          </TableCell>
          <TableCell>
            <Button size="sm">修改</Button>
          </TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Cover Photo</TableCell>
          <TableCell>
            <img src={user.avatar} className="w-20" />
          </TableCell>
          <TableCell>
            <Button size="sm">修改</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default Setting
