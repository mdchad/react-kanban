import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import update from 'immutability-helper';
import KanbanColumn from './KanbanColumn';
const uuidv1 = require('uuid/v1');


// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset + uuidv1().slice(0, 11)}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class App extends Component {
    state = {
        inputText: [''],
        cards: [
            getItems(10),
            getItems(4),
            getItems(5),
            getItems(3)
        ]
    };

    getList = id => this.state.cards[id];

    /**
     * Moves an item from one list to another list.
     */
    move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const sourceKey = droppableSource.droppableId;
        const destinationKey = droppableDestination.droppableId;

        const result = {
            [sourceKey]: sourceClone,
            [destinationKey]: destClone
        };
        /*result[sourceKey] = sourceClone;
      result[destinationKey] = destClone;*/

        return result;
    };

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        const sourceList = this.getList(source.droppableId);
        const destinationList = this.getList(destination.droppableId);

        if (source.droppableId === destination.droppableId) {
            const items = reorder(sourceList, source.index, destination.index);

            this.setState(update(this.state, {
                cards: {
                    [source.droppableId]: {
                        $set: items
                    }
                }
            }));

        } else {
            const result = Object.assign(
                this.state.cards,
                this.move(sourceList, destinationList, source, destination)
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
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
                    $push: [
                        {
                            id: uuidv1().slice(0, 11),
                            content: this.state.inputText[index]
                        }
                    ]
                }
            }
        }))
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.state.cards.map((card, index) => (
                    <div key={index}>
                        <KanbanColumn key={index} droppableId={`${index}`} data={card} />
                        <form onSubmit={(e) => this.submit(e, index)}>
                            <input value={this.state.inputText[index]} onChange={(e) => this.change(e, index)} />
                            <button type='submit'>Submit</button>
                        </form>
                    </div>
                ))}
            </DragDropContext>
        );
    }
}

// Put the things into the DOM!
export default App