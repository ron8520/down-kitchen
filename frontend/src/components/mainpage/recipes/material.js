import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

 /*

 This is the table of material of each recipe, which use to describe 
 each materal of recipe

 */

export default function BasicTable(props) {
  const {rows}  = props
   
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
           
            <TableCell align="center">material</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Unit</TableCell>
             
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
             
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.amount}</TableCell>
              <TableCell align="center">{row.unit}</TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
