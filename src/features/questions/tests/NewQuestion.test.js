import {
    fireEvent,
    render, screen
} from '@testing-library/react';

import { AuthContextProvider } from '../../../context/auth-context';
import { store } from '../../../app/store';
import { Provider } from 'react-redux';
import NewQuestion from '../NewQuestion';


describe('New Question Page', () => {

    it('matches the snapshot', () => {
        var component = render(
            <Provider store={store}>
                    <AuthContextProvider>
                        <NewQuestion />
                    </AuthContextProvider>
            </Provider>
        );
        expect(component).toMatchSnapshot();
    });

    it('will display a success message if the question is added.', () => {

        var component = render(
                <Provider store={store}>
                    <AuthContextProvider>
                        <NewQuestion />
                    </AuthContextProvider>
            </Provider>);
        
        var optionOneInput = component.getByTestId('option-one')
        fireEvent.change(optionOneInput, { target: {value: 'Go to LA'}})
        var optionTwoInput = component.getByTestId('option-two')
        fireEvent.change(optionTwoInput, { target: {value: 'Go to MIA'}})
        var submitButton = component.getByTestId('submit-button')
        fireEvent.click(submitButton)

        setTimeout(function() {
            //your code to be executed after 1 second
            expect(component.getByTestId('success-alert')).toBeInTheDocument();
          }, 1500);
    })
})