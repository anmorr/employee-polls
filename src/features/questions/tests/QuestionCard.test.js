import {
    render
} from '@testing-library/react';
import QuestionCard from '../QuestionCard';

const optionOneProps = {
    value: 'Go to LA',
    onChange: e => setValue(e.target.value)
}

const optionTwoProps = {
    value: 'Go to MIA',
    onChange: e => setValue(e.target.value)
}

const handleSubmit = () => {

}
        

describe('QuestionCard', () => {

    it('renders new question', () => {
        render(
            <QuestionCard
                optionOneProps={optionOneProps}
                optionTwoProps={optionTwoProps}
                submitHandler={handleSubmit} />
        );
    });

    it('matches the snapshot', () => {
        var component = (
            <QuestionCard
                optionOneProps={optionOneProps}
                optionTwoProps={optionTwoProps}
                submitHandler={handleSubmit} />
        );
        expect(component).toMatchSnapshot();
    });

})
