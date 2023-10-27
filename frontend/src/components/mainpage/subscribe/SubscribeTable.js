import {styled} from "@mui/styles";
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {useEffect, useState} from "react";
import {Avatar, Typography} from "@mui/material";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "@material-ui/core";
import {setMessage} from "../../../redux/messageSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

export const StyledAvatar = styled(Avatar)(({theme}) => ({
    height: '50px',
    width: '50px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
'&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
},
// hide last border
'&:last-child td, &:last-child th': {
    border: 0,
},
}));




//TODO: PASSING THE VALUE FROM PARAMETER
const SubscribeTable = (props) => {
    const { userId } = props
    const [rows, setRows] = useState([])
    const user = useSelector((state) => (state.user.userInfo))
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        getUserFollows()
    }, [userId])

    const getUserFollows = () => {
         axios
            .get("/api/sub/subscribe/?user_id=" + userId)
            .then((res) => {
                console.log(res.data)
                setRows(res.data.users)
            })
            .catch((error) => console.log(error))
    }

    const userUnfollow = (id) => {
        axios
            .delete('/api/sub/delete', { data: {"user": id, "follow": user.id}})
            .then((res) => {
                getUserFollows()
                dispatch(
                        setMessage({
                            "info": "Unfollow successful",
                            "type": "success"
                        })
                    )
            })
            .catch((error) => {
                console.log(error)
                dispatch(
                        setMessage({
                            "info": "Unfollow Fail",
                            "type": "error"
                        })
                    )
            })
    }

    const toProfile = (id) => {
        navigate('/profile/' + id)
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell align="left">Avatar</StyledTableCell>
                    <StyledTableCell align="center">User</StyledTableCell>
                    <StyledTableCell align="center">Description</StyledTableCell>
                    {
                        user.id == userId && (
                            <StyledTableCell align="center">Unfollow</StyledTableCell>
                        )}
                </TableRow>
                </TableHead>
                <TableBody>
                    { rows.length === 0 ? (
                        <Typography variant={"subtitle1"}>
                            No Follow anyone yet !
                        </Typography>
                    ) : (
                        rows.map((row) => (
                    <StyledTableRow key={row.username}>
                    <StyledTableCell align="center">
                        <StyledAvatar
                            alt="aemy Sharp"
                            src={row.avatar_url === '' ? '/assets/gril.png' : row.avatar_url}>
                        </StyledAvatar>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Link
                            color="inherit"
                            underline="hover"
                            onClick={() => toProfile(row.id)}
                        >
                            <Typography variant={"subtitle2"} noWrap>
                                {row.username}
                            </Typography>

                        </Link>

                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Typography noWrap>
                            {row.description === '' ? "No description" : row.description}
                        </Typography>
                    </StyledTableCell>
                        {
                            user.id == userId && (
                                <StyledTableCell align="center">
                                    <Button onClick={() => userUnfollow(row.id)}>
                                        unfollow
                                    </Button>
                                </StyledTableCell>
                            )}
                    </StyledTableRow>
                ))
                    )}

                </TableBody>
            </Table>
         </TableContainer>
    )
}

export default SubscribeTable;