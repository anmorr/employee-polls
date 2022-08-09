import classes from './StartingPageContent.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchQuestions, selectAllQuestions, selectAllQuestionsObject } from '../../../features/questions/questionsSlice';
import { Box } from '@mui/system';
import Spinner from '../../../shared/components/Spinner';
import { fetchUsers, selectUserById} from '../../../features/users/usersSlice';

import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { timestampCompare } from '../../../shared/utils/timestampUtils';

import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useContext } from 'react';
import AuthContext from '../../../context/auth-context';

function formatDate(timestamp) {
  const d = new Date(timestamp)
  const dateString = d.toLocaleDateString('en-US')
  const timeString = d.toLocaleTimeString()
  return timeString + ' | ' + dateString
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const StartingPageContent = () => {


  const authCtx = useContext(AuthContext);

  let currentUser
  
  if (authCtx.userPool.getCurrentUser()) {
    currentUser = authCtx.userPool.getCurrentUser().username
  }

  
  let answeredQuestions = []
  let answeredQuestionsItems = []
  let unansweredQuestions = []

  const questionsStatus = useSelector(state => state.questions.status)
  const dispatch = useDispatch()

  useEffect(() => {
      if (questionsStatus === 'idle') {
          dispatch(fetchQuestions())
      }  
  }, [questionsStatus, dispatch])

  const questionsObject = useSelector(selectAllQuestionsObject)
  const questions = useSelector(selectAllQuestions)

  const usersStatus = useSelector(state => state.users.status)

  useEffect(() => {
      if (usersStatus === 'idle') {
          dispatch(fetchUsers())
      }  
  })
  
  let currentUserObject = useSelector(state => {
    if (usersStatus === 'succeeded') {

      return selectUserById(state, currentUser)
    }
  })

  // console.log(currentUserObject)

  let questionIds
    if (currentUserObject) {
      questionIds = Object.keys(currentUserObject.answers)
    }

  if (questionsStatus === 'loading' || usersStatus === 'loading') {
    // answeredQuestions = <Spinner text="Loading..." />
  } else if (questionsStatus === 'succeeded' && usersStatus === 'succeeded') {

    
    if (questionIds) {
      questionIds.forEach(questionId => {
        let currentQuestion = questionsObject[questionId]
        answeredQuestions.push(
          // <Grid item xs={2} sm={4} md={4} key={currentQuestion.id}>
          //   <Item>{currentQuestion.author}</Item>
          //   <Item>{finalTime}</Item>
          // </Grid>
          currentQuestion
        )
      })
      answeredQuestions.sort(timestampCompare).forEach(currentQuestion => {
        answeredQuestionsItems.push(
          <Grid item xs={2} sm={4} md={4} key={currentQuestion.id}>
              <Item>{currentQuestion.author}</Item>
            <Item>{formatDate(currentQuestion.timestamp)}</Item>
            <Item>{
              <Link style={{textDecoration: 'none'}} to={`/questions/${currentQuestion.id}`} className="button muted-button">
              <Button
              variant="contained"
              fullWidth
              name="optionTwo"
            >
              View
            </Button>
              </Link>
            }</Item>
          </Grid>
        )
      })
    }

    let unansweredQuestionsList
    if (currentUserObject) {
      unansweredQuestionsList = questions.filter(function (item) {
        return questionIds.indexOf(item.id) === -1;
      });
    }
    

    if (unansweredQuestionsList) {
      unansweredQuestionsList.sort(timestampCompare)
      unansweredQuestionsList.forEach(currentQuestion => {
        const finalTime = formatDate(currentQuestion.timestamp)
        unansweredQuestions.push(
        <Grid item xs={2} sm={4} md={4} key={currentQuestion.id}>
            <Item>{currentQuestion.author}</Item>
            <Item>{finalTime}</Item>
            <Item>{
             <Link style={{textDecoration: 'none'}} to={`/questions/${currentQuestion.id}`} > 
              <Button
              variant="contained"
              fullWidth
              name="optionTwo"
            >
              View
            </Button>
              </Link>
            }</Item>
      </Grid>
        )
      })
    }
  }

  

  return (
    <section className={classes.starting}>
      <Box>
        {/* {questionsStatus === 'loading' && <Spinner text="...Loading" />} */}
        <h2>Answered Questions</h2>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {answeredQuestionsItems}
        </Grid>
        <h2>Unanswered Questions</h2>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {unansweredQuestions}
        </Grid>
        {questionsStatus === 'loading' && <Spinner text="...Loading" />}
      </Box>
      
    </section>
  );
};

export default StartingPageContent;
