// 1. Import the function into the test file
// 2. Add the describe and it functions
// 3. Add async on the "it" anonymous callback, which will call the async function. 
// 4. Add await in front of the async function call where the result will be saved.
// 5. Use the result with expect and toEqual or whatever condition you decide.
import {
    _saveQuestion,
    _saveQuestionAnswer,
    formatQuestion,
} from "../_DATA"


/* ---------- _saveQuestion ---------- */

var addQuestionPayload = (
    {
        optionOneText: 'Move to LA',
        optionTwoText: 'Move to MIA',
        author: 'sarahedo'
    }
)

var addQuestionPayloadBadFormatting = (
    {
        optionOneText: 'Move to LA',
        author: 'sarahedo'
    }
)

var addQuestionFormattedResponse = (
    {
        id: 'vsckasdl2n2a8evcugd8',
        timestamp: 1660058199730,
        author: 'sarahedo',
        optionOne: {
            text: "Move to LA",
            votes: []
        },
        optionTwo: {
            text: "Move to MIA",
            votes: []
        }
    }
)


/* ---------- _saveAnswerQuestion ---------- */

var addQuestionAnswerPayload = (
    {
        authedUser: 'sarahedo',
        qid: 'vthrdm985a262al8qx3do',
        answer: 'optionOne'
    }
)

var addQuestionAnswerPayloadBadFormat = (
    {
        authedUser: 'sarahedo',
        qid: 'vthrdm985a262al8qx3do',
        answer: 'optionOne'
    }
)



describe('When a new question is saved: ', () => {

    it('with a proper formatted question, it will return a properly formmated question.', async () => {
        var result = await _saveQuestion(addQuestionPayload);
        expect(result.author).toEqual(addQuestionFormattedResponse.author)
        expect(result.optionOne.text).toEqual(addQuestionFormattedResponse.optionOne.text)
        expect(result.optionTwo.text).toEqual(addQuestionFormattedResponse.optionTwo.text)
        expect(result.optionOne.votes).toEqual([])
        expect(result.optionTwo.votes).toEqual([])
    })

    it('with an improperly formatted question, it will be rejected with a standard message.', async () => {
        await expect(_saveQuestion(addQuestionPayloadBadFormatting))
            .rejects
            .toEqual("Please provide optionOneText, optionTwoText, and author");
        
    })
})


describe('When a new question answer is saved: ', () => {

    it('with a properly formatted answer, it will return a boolean of true.', async () => {
        var result = await _saveQuestionAnswer(addQuestionAnswerPayload);
        expect(result).toEqual(true)
    })

    it('with an improperly formatted answer, it will be rejected with a standard message.', async () => {
        await expect(_saveQuestionAnswer(addQuestionPayloadBadFormatting))
            .rejects
            .toEqual("Please provide authedUser, qid, and answer");
        
    })
})


