import React from 'react';
import './App.css';
import _ from 'lodash';

var possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
        var combinationSum = 0;
        for (var j=0 ; j < listSize ; j++) {
            if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
    }
    return false;
};

const Agent = (props) => {

    return(
        <div className="col-5">
            {_.range(props.arrayOfAgents).map(i =>
                <div key={i} style={{display: 'inline-block'}}>
                    <i key={i} className="fas fa-user-secret"></i>
                </div>
            )}
        </div>
    );
};

const Button = (props) => {
    let button;

    switch (props.answerIsCorrect) {
        case true:
            button =
                <button className="btn btn-success"  onClick={props.acceptAnswer}>
                    Correct
                </button>
            break;
        case false:
            button =
                <button className="btn btn-danger">
                    Wrong
                </button>
            break;
        default:
            button =
                <button className="btn btn-primary" onClick={props.checkAnswer}
                        disabled={props.selectedNumbers.length === 0}>=</button>
            break;

    }
    return(
        <div className="col-2 text-center">
            {button}
            <br />
            <br />
            <button className="btn btn-warning" onClick={props.redraw}
                    disabled={props.redraws === 0}>
                <i className="fa fa-sync-alt"></i> {props.redraws}
            </button>
        </div>
    );
};

const Answer = (props) => {
    return(
        <div style={{textAlign: 'center'}} className="col-5">
            {props.selectedNumbers.map((numbers, i) =>
                <span key={i}
                      onClick={() => props.unselectNumber(numbers)}
                >{numbers}
				</span>
            )}
        </div>
    );
};

const ChooseNumber = (props) => {

    const whichNumberSelected = (number) => {
        if(props.usedNumbers.indexOf(number) >= 0) {
            return 'used';
        }
        if(props.selectedNumbers.indexOf(number) >= 0) {
            return 'selected';
        }
    };

    return(
        <div className="card text-center">
            <div>
                {ChooseNumber.list.map((value, i) =>
                    <span className={whichNumberSelected(value)} key={i}
                          onClick={() => props.selectNumber(value)}>
								{value}
					</span>
                )}
            </div>
        </div>
    );
};

const DoneFrame = (props) => {
    return(
        <div className="text-center">
            <h2>{props.doneStatus}</h2>
            <button className="text-center btn btn-info" onClick={props.resetGame}>
                Play again
            </button>
        </div>
    );
};

ChooseNumber.list = _.range(1, 10);

class Game extends React.Component {
    static randomNumber = () => 1 + Math.floor(Math.random()* 9);
    static initialGame = () => ({
        selectedNumbers: [],
        arrayOfAgents: Game.randomNumber(),
        answerIsCorrect: null,
        usedNumbers: [],
        redraws: 5,
        doneStatus: null,
    });

    state = Game.initialGame();

    resetGame = () => this.setState(Game.initialGame());

    selectNumber = (clickedNumber) => {
        if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0) return;
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    };

    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(number =>
                number !== clickedNumber)
        }));
    };

    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.arrayOfAgents ===
            prevState.selectedNumbers.reduce((value1, value2) => value1 + value2, 0)
        }));
    };

    acceptAnswer = () => {
        this.setState(prevState =>({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            answerIsCorrect: null,
            arrayOfAgents: Game.randomNumber(),
            selectedNumbers: [],
        }), this.updateDoneStatus);
    };

    redraw = () => {
        if(this.state.redraws === 0) return;
        this.setState(prevState => ({
            answerIsCorrect: null,
            arrayOfAgents: Game.randomNumber(),
            selectedNumbers: [],
            redraws: prevState.redraws -1,
        }), this.updateDoneStatus);
    };

    possibleSolution = ({arrayOfAgents, usedNumbers}) => {
        const possibleNumbers = _.range(1, 10).filter(number =>
            usedNumbers.indexOf(number) === -1);
        return possibleCombinationSum(possibleNumbers, arrayOfAgents);
    };

    updateDoneStatus = () => {
        this.setState(prevState => {
            if(prevState.usedNumbers.length === 9){
                return {doneStatus: 'Well Done!!!'};
            }
            if(prevState.redraws === 0 && !this.possibleSolution(prevState)){
                return {doneStatus: 'Game over -:('};
            }
        });
    };

    render(){
        const { arrayOfAgents,
            selectedNumbers,
            answerIsCorrect,
            usedNumbers,
            redraws,
            doneStatus} = this.state;
        return(
            <div className='container'>
                <h1 style={{textAlign: 'center'}}>Catch all agents</h1>
                <hr/>
                <div className="row">
                    <Agent arrayOfAgents={arrayOfAgents}/>
                    <Button selectedNumbers={selectedNumbers}
                            checkAnswer={this.checkAnswer}
                            answerIsCorrect={answerIsCorrect}
                            acceptAnswer={this.acceptAnswer}
                            redraw={this.redraw}
                            redraws={redraws}/>
                    <Answer selectedNumbers={selectedNumbers}
                            unselectNumber={this.unselectNumber}/>
                </div>
                <br />
                {doneStatus ? <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/> :
                    <ChooseNumber selectedNumbers={selectedNumbers}
                                  selectNumber={this.selectNumber}
                                  usedNumbers={usedNumbers}/>
                }
            </div>
        );
    }
}

class App extends React.Component {
    render(){
        return(
            <Game />
        );
    }
}

export default App;
