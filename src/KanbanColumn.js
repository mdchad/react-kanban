import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
//import { getListStyle, getItemStyle } from './utils';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the list look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'rgba(50,60,80,.75)',
    padding: grid,
    width: 250
});
const iconStyle = (color) => ({ color: color, float: 'right', cursor: 'pointer' })

const KanbanColumn = ({ droppableId, data, title, deleteItem, i, deleteCard }) => {
    if (!data) {
        return null
    }
    return <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
            <div ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                <h3>
                    <span style={{color: 'white'}}>{title}</span>
                    <i className="fas fa-trash-alt" style={iconStyle('white')} onClick={()=> deleteCard(i)}></i>
                </h3>
                {data.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}>
                                {item.content}
                                <i className="fas fa-trash-alt" onClick={()=> deleteItem(item, i)} style={iconStyle('grey')}></i>
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
};

export default KanbanColumn;
