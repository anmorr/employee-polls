import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectQuestionById, fetchQuestions, addAnswer } from "./questionsSlice"
import { fetchUsers, selectUserById, selectAllUsers, userUpdated } from "../users/usersSlice"
import { Avatar } from "@mui/material"
import Spinner from "../../shared/components/Spinner"

import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import { Button } from "@mui/material"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { useContext } from 'react';
import AuthContext from "../../context/auth-context"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontColor: 'white'
  }));

export const SingleQuestionPage = ({ match }) => {

    const { questionId } = match.params
    console.log(match.params)

    const dispatch = useDispatch();

    const [isAnswered, setIsAnswered] = useState(false);
    const [optionOneMetadata, setOptionOneMetadata] = useState({})
    const [optionTwoMetadata, setOptionTwoMetadata] = useState({})
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const [currentUsersSelection, setCurrentUserSelection] = useState('')

    const history = useHistory();

    const authCtx = useContext(AuthContext);

    // export const selectUserById = (state, userId) =>
//   state.users.entities.find(user => user.id === userId)
    const questionsStatus = useSelector(state => state.questions.status)

    const currentQuestion = useSelector(state => {
        if (questionsStatus === 'succeeded') {
            return selectQuestionById(state, questionId)
        }
    })
    

    useEffect(() => {
        dispatch(fetchQuestions())

    }, [dispatch])

    let author
    
    let questionContent
    if (questionsStatus === 'succeeded') {

        if (!currentQuestion) {
            history.push('/404')
        }
        author = currentQuestion.author

        // <Item>{currentQuestion.author}</Item>
        // <Item>{formatDate(currentQuestion.timestamp)}</Item>
        questionContent = (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Item>{currentQuestion.optionOne.text}</Item>
                <Item>{currentQuestion.optionTwo.text}</Item>
            </Box>
        )
    }

    const users = useSelector(selectAllUsers)

    let currentUser
  
    if (authCtx.userPool.getCurrentUser()) {
        currentUser = authCtx.userPool.getCurrentUser().username
    }

    const usersStatus = useSelector(state => state.users.status)
    
    const currentUserObject = useSelector(state => {
        if (usersStatus === 'succeeded' && questionsStatus === 'succeeded') {
            return selectUserById(state, currentUser)
        }
    })

    const pollAuthor = useSelector(state => {
        if (usersStatus === 'succeeded' && questionsStatus === 'succeeded') {
            return selectUserById(state, author)
        }
    })


    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchUsers())
        }
        if (currentUserObject) {
            if (currentUserObject.answers[questionId]) {
                setQuestionMetadata(currentQuestion, users)
                setCurrentUserSelection(currentUserObject.answers[questionId])
                setIsAnswered(true)
            }
        }
    }, [usersStatus, currentUserObject, dispatch, questionId, currentQuestion, users])

    let user
    let userAvatar

    if (questionsStatus === 'succeeded') {
        user = currentQuestion.author
        userAvatar = (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Avatar sx={{ width: 400, height: 400,  }}
                        src={pollAuthor.avatarURL}
                        alt={user.name}
                />
            </Box>)
    }


    function setQuestionMetadata(currentQuestion, users) {
        let totalAnswersToOptionOne = currentQuestion['optionOne'].votes.length;
        let totalAnswersToOptionTwo = currentQuestion['optionTwo'].votes.length;

        let percentageForOptionOne = ((totalAnswersToOptionOne / users.length) * 100)
        let percentageForOptionTwo = ((totalAnswersToOptionTwo / users.length) * 100)

        setOptionOneMetadata({
            answeredTotal: totalAnswersToOptionOne,
            answeredPercentage: percentageForOptionOne,
        })

        setOptionTwoMetadata({
            answeredTotal: totalAnswersToOptionTwo,
            answeredPercentage: percentageForOptionTwo,
        })

    }

    const onPollSelectionClick = async (event) => {

        const pollSelection = event.target.name;
        setCurrentUserSelection(pollSelection)

        let totalAnswersToOptionOne = currentQuestion['optionOne'].votes.length;
        let totalAnswersToOptionTwo = currentQuestion['optionTwo'].votes.length;
        const answer = {
                        authedUser: currentUser,
                        qid: currentQuestion.id,
                        answer: pollSelection,
        }
        if (pollSelection === 'optionOne') {
            if (addRequestStatus === 'idle') {
                try {
                    setAddRequestStatus('pending')
                    await dispatch(addAnswer(answer)).unwrap()
                    dispatch(userUpdated({
                        uid: currentUser,
                        qid: currentQuestion.id,
                        option: pollSelection,
                    }))
                    totalAnswersToOptionOne += 1;
                    setIsAnswered(true)
                } catch (err) {
                    console.error('Failed to save the answer: ', err)
                } finally {
                    setAddRequestStatus('idle')
                }
            }
        } else {

            if (addRequestStatus === 'idle') {
                try {
                    setAddRequestStatus('pending')
                    await dispatch(addAnswer(answer)).unwrap()
                    dispatch(userUpdated({
                        uid: currentUser,
                        qid: currentQuestion.id,
                        option: pollSelection,
                    }))
                    totalAnswersToOptionTwo += 1;
                    setIsAnswered(true)
                } catch (err) {
                    console.error('Failed to save the answer: ', err)
                } finally {
                    setAddRequestStatus('idle')
                }
            }
        }

        let percentageForOptionOne = ((totalAnswersToOptionOne / users.length) * 100)
        let percentageForOptionTwo = ((totalAnswersToOptionTwo / users.length) * 100)

        setOptionOneMetadata({
            answeredTotal: totalAnswersToOptionOne,
            answeredPercentage: percentageForOptionOne,
        })

        setOptionTwoMetadata({
            answeredTotal: totalAnswersToOptionTwo,
            answeredPercentage: percentageForOptionTwo,
        })
        setIsAnswered(true);
    }

    if (questionsStatus === 'succeeded' && usersStatus === 'succeeded') {
        questionContent = (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '50px'
            }}>
                <Grid item xs={2} sm={4} md={4} key={currentQuestion.id} paddingRight={10}>
                    <Item>{currentQuestion.optionOne.text}</Item>
                    {isAnswered && (
                        <Item>
                            Total Answered: {optionOneMetadata.answeredTotal}
                        </Item>
                        // 
                    
                    )}
                    {isAnswered && (
                        <Item>
                            Percentage: {optionOneMetadata.answeredPercentage}
                        </Item>
                    )}
                    {currentUsersSelection === 'optionOne' && (
                        <Item sx={{
                            backgroundColor: 'green'
                        }}>
                            <span style={{ fontColor: 'white'}}>Your Selection</span>
                        </Item>
                    )}
                    <Item>{
                        <Button
                            variant="contained"
                            fullWidth
                            name="optionOne"
                            onClick={onPollSelectionClick}
                            disabled={isAnswered}
                        >
                        Click
                        </Button>}
                    </Item> 
                </Grid>
                <Grid item xs={2} sm={4} md={4} key={currentQuestion.id + '01'} paddingLeft={10}>
                    <Item>{currentQuestion.optionTwo.text}</Item>
                    {isAnswered && (
                        <Item>
                            Total Answered: {optionTwoMetadata.answeredTotal}
                        </Item>
                        // 
                    
                    )}
                    {isAnswered && (
                        <Item >
                            Percentage: {optionTwoMetadata.answeredPercentage}
                        </Item>
                    )}
                    {currentUsersSelection === 'optionTwo' && (
                        <Item sx={{
                            backgroundColor: 'green'
                        }}>
                            Your Selection
                        </Item>
                    )}

                    <Item>{
                        <Button
                            variant="contained"
                            fullWidth
                            name="optionTwo"
                            onClick={onPollSelectionClick}
                            disabled={isAnswered}
                        >
                        Click
                        </Button>}
                    </Item> 
                </Grid>
            </Box>
        )
    }


    
    const canDisplay = (questionsStatus === 'succeeded' && usersStatus === 'succeeded');
    
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            {(questionsStatus === 'succeeded' || usersStatus === 'succeeded') && <article>
                {canDisplay && <h2 style={{ textAlign: 'center' }}>Poll By {author}</h2>}
                {userAvatar}
                {canDisplay && <h2 style={{ textAlign: 'center' }}>Would You Rather</h2>}
                {(questionsStatus === 'loading' || usersStatus ==='loading') && <Spinner text="...Loading" />}
                {questionContent}
            </article>}
        </Box>
    )
}