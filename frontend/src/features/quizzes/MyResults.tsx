import React, { useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUserResults, selectUserResultsLoading } from './quizSlice';
import { getUserResults } from './quizThunk';
import { selectUser } from '../users/usersSlice';
import { Alert, Box, CircularProgress } from '@mui/material';

const MyResults = () => {
  const dispatch = useAppDispatch();
  const myResults = useAppSelector(selectUserResults);
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserResultsLoading);

  useEffect(() => {
    if (user) {
      dispatch(getUserResults(user._id));
    }
  }, [dispatch, user]);

  return (
    <div className="results-block">
      <h2 className="quizzes__title">Мои результаты</h2>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={80} color="secondary" />
        </Box>
      ) : myResults && myResults.length === 0 ? (
        <Alert variant="outlined" severity="info">
          Вы еще не сыграли ни один квиз!
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 292 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Название квиза</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Результат
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Когда пройдено
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myResults &&
                myResults.map((row) => (
                  <TableRow
                    key={row.createdAt?.toString()}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.quizTitle}
                    </TableCell>
                    <TableCell align="center">{row.correct} %</TableCell>
                    <TableCell align="center">
                      {row.createdAt && dayjs(row.createdAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MyResults;
