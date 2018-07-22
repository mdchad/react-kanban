import React, {Component} from 'react';
import {DragDropContext} from 'react-beautiful-dnd';
import update from 'immutability-helper';
import KanbanColumn from './KanbanColumn';

const uuidv1 = require('uuid/v1');


// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({length: count}, (v, k) => k).map(k => ({
        id: `item-${k + offset + uuidv1().slice(0, 11)}`,
        content: `item ${k + offset}`
    }));


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list.list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class App extends Component {
    state = {
        cards: [
            {id: '34', list: getItems(10), title: 'Hello'},
            {id: '232', list: getItems(3), title: 'World'},
            {id: '23', list: getItems(2), title: 'Adios'}
        ],
        inputText: [''],
        inputTitle: ''
    };


    getList = id => {
        return this.state.cards.find(card => card.id === id);
    }

    /**
     * Moves an item from one list to another list.
     */
    move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source.list);
        const destClone = Array.from(destination.list);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const sourceKey = droppableSource.droppableId;
        const destinationKey = droppableDestination.droppableId;

        const result = [{
                id: sourceKey,
                list: sourceClone,
                title: source.title
            },
            {
                id: destinationKey,
                list: destClone,
                title: destination.title
            }];
        /*result[sourceKey] = sourceClone;
      result[destinationKey] = destClone;*/
        console.log(result)
        return result;
    };

    onDragEnd = result => {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        const sourceList = this.getList(source.droppableId);
        const destinationList = this.getList(destination.droppableId);
        const columnIndex = this.state.cards.findIndex(card => card.id === source.droppableId)

        if (source.droppableId === destination.droppableId) {
            const items = reorder(sourceList, source.index, destination.index);
            this.setState(update(this.state, {
                cards: {
                    [columnIndex]: {
                        $set: {
                            id: source.droppableId,
                            list: items,
                            title: this.state.cards[columnIndex].title
                        }
                    }
                }
            }));
        } else {
            const moves = this.move(sourceList, destinationList, source, destination)
            const findSource = this.state.cards.map(card => moves.find(move => move.id === card.id) || card);
            this.setState({cards: findSource});
        }
    };

    change = (e, index) => {
        this.setState(update(this.state, {
            inputText: {
                [index]: {
                    $set: e.target.value
                }
            }
        }))
    }

    submit = (e, index) => {
        e.preventDefault()
        this.setState(update(this.state, {
            inputText: {
                [index]: {
                    $set: ''
                }
            },
            cards: {
                [index]: {
                    list: {
                        $push: [
                            {
                                id: uuidv1().slice(0, 11),
                                content: this.state.inputText[index]
                            }
                        ]
                    }
                }
            }
        }))
    }

    submitCard = (e) => {
        e.preventDefault()
        this.setState(update(this.state, {
            inputTitle: {
                $set: ''
            },
            cards: {
                $push: [{
                    id: `${Math.ceil(Math.random())}`,
                    title: this.state.inputTitle,
                    list: []
                }]
            }
        }))
    }

    changeCard = (e) => {
        this.setState(update(this.state, {
            inputTitle: {
                $set: e.target.value
            }
        }))
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.state.cards.map((card, index) => (
                    <div key={index}>
                        <KanbanColumn key={index} droppableId={`${card.id}`} data={card.list} title={card.title}/>
                        <form onSubmit={(e) => this.submit(e, index)}>
                            <input value={this.state.inputText[index]} onChange={(e) => this.change(e, index)}/>
                            <button type='submit'>Submit</button>
                        </form>
                    </div>
                ))}
                <form onSubmit={(e) => this.submitCard(e)}>
                    <input value={this.state.inputTitle} onChange={(e) => this.changeCard(e)}/>
                    <button type='submit'>New Card</button>
                </form>
            </DragDropContext>
        );
    }
}

// Put the things into the DOM!
export default App