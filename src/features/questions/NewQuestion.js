import { useHistory } from "react-router-dom";
import { useTextField } from "../../shared/hooks/hooks";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { addQuestion } from "./questionsSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/auth-context";
import { addQuestionToUser } from "../users/usersSlice";
import QuestionCard from "./QuestionCard";
import { Alert } from "@mui/material";
import { Box } from "@mui/material";


export default function NewQuestion() {

    const history = useHistory();
    const dispatch = useDispatch();

    const authCtx = useContext(AuthContext);

    const currentUser = (
        authCtx.userPool.getCurrentUser() ?
            authCtx.userPool.getCurrentUser().username :
            'sarahedo'
    )
    
    const [optionOneProps, setOptionOne] = useTextField('');
    const [optionTwoProps, setOptionTwo] = useTextField('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const [questionAdded, setQuestionAdded] = useState(false)


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (addRequestStatus === 'idle') {
            try {
                setAddRequestStatus('pending')
                let optionOne = optionOneProps.value
                let optionTwo = optionTwoProps.value
                const newQuestion = {
                    optionOneText: optionOne,
                    optionTwoText: optionTwo,
                    author: currentUser,
                }
                const response = await dispatch(addQuestion(newQuestion)).unwrap()
                // console.log(response)
                dispatch(addQuestionToUser({
                    id: response.id,
                    author: response.author,
                }))
                setOptionOne('')
                setOptionTwo('')
                setQuestionAdded(true)
                // console.log('location: ', history.location)
                // history.push('/')
                // console.log('location: ', history.location)
                showSuccessTimeout(3000)
            } catch (err) {
                console.error('Failed to save the question: ', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const showSuccessTimeout = (time) => {
        setTimeout(() => {
            setQuestionAdded(false)
            history.push('/')
        }, time)
    }
    
    const questionAddedSuccessAlert = (
        <Alert
            severity="success"
            inputProps={{
                "data-testid": "success-alert"
            }}
        >
            {/* <AlertTitle>Success</AlertTitle> */}
            New question has been added!
            You will now be redirected to the questions page...
        </Alert>
    )

    return (
        <Box>
            {questionAdded && questionAddedSuccessAlert}   
           
            {!questionAdded && <QuestionCard
                optionOneProps={optionOneProps}
                optionTwoProps={optionTwoProps}
                submitHandler={handleSubmit} />}
        </Box>
    )
}