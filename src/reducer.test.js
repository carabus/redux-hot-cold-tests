import { hotColdReducer } from "./reducer";
import { generateAuralUpdate, restartGame, makeGuess } from "./actions";
import { stat } from "fs";

describe("hotColdReducer", () => {
  it("Should set the initial state when nothing is passed in", () => {
    const state = hotColdReducer(undefined, { type: "__UNKNOWN" });
    expect(state).toEqual({
      guesses: [],
      feedback: "Make your guess!",
      auralStatus: "",
      correctAnswer: state.correctAnswer
    });
  });

  it("Should return the current state on an unknown action", () => {
    let currentState = {};
    const state = hotColdReducer(currentState, { type: "__UNKNOWN" });
    expect(state).toBe(currentState);
  });

  describe("restartGame", () => {
    it("Should roll back the game to initial state", () => {
      let state;
      state = hotColdReducer(state, makeGuess(1));
      state = hotColdReducer(state, makeGuess(2));
      state = hotColdReducer(state, restartGame());
      expect(state).toEqual({
        guesses: [],
        feedback: "Make your guess!",
        auralStatus: "",
        correctAnswer: state.correctAnswer
      });
    });
  });

  describe("makeGuess", () => {
    it("Should update list of guesses", () => {
      let state;
      state = hotColdReducer(state, makeGuess(1));
      state = hotColdReducer(state, makeGuess(2));

      expect(state.guesses.length).toEqual(2);
      expect(state.guesses[0]).toEqual(1);
      expect(state.guesses[1]).toEqual(2);
    });

    it("Should return appropriate feedback", () => {
      var state = hotColdReducer(state, restartGame());
      const correctAnswer = state.correctAnswer;
      const guessOptions = [
        {
          guess: correctAnswer + 51,
          feedback: "You're Ice Cold..."
        },
        {
          guess: correctAnswer + 31,
          feedback: "You're Cold..."
        },
        {
          guess: correctAnswer + 11,
          feedback: "You're Warm."
        },
        {
          guess: correctAnswer + 1,
          feedback: "You're Hot!"
        },
        {
          guess: correctAnswer,
          feedback: "You got it!"
        }
      ];
      guessOptions.forEach(option => {
        state = hotColdReducer(state, makeGuess(option.guess));
        expect(state.feedback).toEqual(option.feedback);
      });
    });
    it("should test for when guess is not a number", () => {
      var state = hotColdReducer(state, makeGuess("test"));
      expect(state.feedback).toEqual("Please enter a valid number.");
    });
  });

  describe("aural update", () => {
    it("Should generate status update for single guess", () => {
      var state = hotColdReducer(state, makeGuess(1));
      state = hotColdReducer(state, generateAuralUpdate());
      expect(state.auralStatus).toEqual(
        `Here's the status of the game right now: ${
          state.feedback
        } You've made 1 guess. It was: 1`
      );
    });

    it("Should generate status update for multiple guesses", () => {
      var state = hotColdReducer(state, makeGuess(1));
      var state = hotColdReducer(state, makeGuess(2));
      state = hotColdReducer(state, generateAuralUpdate());
      expect(state.auralStatus).toEqual(
        `Here's the status of the game right now: ${
          state.feedback
        } You've made 2 guesses. In order of most- to least-recent, they are: 2, 1`
      );
    });
  });
});
