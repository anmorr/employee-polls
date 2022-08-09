import {
    render, screen
} from '@testing-library/react';
import { SingleQuestionPage } from '../SingleQuestionPage';
import { AuthContextProvider } from '../../../context/auth-context';

import { store } from '../../../app/store';
import { Provider } from 'react-redux';


const match = {
    params: {
        questionId: 'loxhs1bqm25b708cmbf3g'
    }
}

test('renders new question', () => {
    render(
        <Provider store={store}>
            <AuthContextProvider>
                <SingleQuestionPage match={match} />
            </AuthContextProvider>
        </Provider>
    );

})


