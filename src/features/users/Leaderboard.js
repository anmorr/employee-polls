import { selectAllUsers } from "./usersSlice"
import React, { useEffect } from "react"
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux"
import { fetchUsers } from "./usersSlice"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Spinner  from "../../shared/components/Spinner"

import Avatar from '@mui/material/Avatar';
import { Box } from "@mui/system"

import { compare } from "./usersSlice"


export default function Leaderboard() {

    const usersStatus = useSelector(state => state.users.status)
    const dispatch = useDispatch()

    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchUsers())
            
        }  
    }, [usersStatus, dispatch])

    const users = useSelector(selectAllUsers)

    

    users.sort(compare)

    let renderedUsers

    if (usersStatus === 'loading') {
        renderedUsers = <Spinner text="Loading..." />
    } else if (usersStatus === 'succeeded') {

        renderedUsers = users.map(user => (
            <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell
                    component="th"
                    scope="row"
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }} >
                    {<Avatar
                        src={user.avatarURL}
                        alt={user.name}
                    />}
                    <Box
                        sx={{
                            padding: '1em'
                        }}
                    >
                        {user.name}
                    </Box>
                    
                </TableCell>
                <TableCell align="right">{user.questions.length}</TableCell>
                <TableCell align="right">{Object.keys(user.answers).length}</TableCell>
            </TableRow>
        ))
    }
    
    return (
        <React.Fragment>
            {usersStatus === 'loading' && <Spinner />}
            {usersStatus === 'succeeded' && <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell align="right">Created</TableCell>
                            <TableCell align="right">Answered</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderedUsers}
                    </TableBody>
                </Table>
            </TableContainer>}
        </React.Fragment>
        
        
    )
}