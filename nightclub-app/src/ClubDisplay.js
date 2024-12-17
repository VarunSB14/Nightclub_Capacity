import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';

class ClubDisplay extends Component {
    handleIncrement = () => {
        const { club, onAdjustOccupancy } = this.props;
        if (club.current_occupancy < club.capacity) {
            onAdjustOccupancy(club.id, 1);
        }
    };

    handleDecrement = () => {
        const { club, onAdjustOccupancy } = this.props;
        if (club.current_occupancy > 0) {
            onAdjustOccupancy(club.id, -1);
        }
    };

    render() {
        const { club, toggleModal, onRemove } = this.props;
        const { name, location, capacity, current_occupancy, yellow_threshold, music } = club;
        
        let className = null;
        let message = 'Welcome!';
        const isFull = current_occupancy >= capacity;

        if (current_occupancy > 0 && current_occupancy < yellow_threshold) {
            className = 'green';
        } else if (current_occupancy >= yellow_threshold && current_occupancy < capacity) {
            className = 'yellow';
            message = 'Warn the bouncers...';
        } else if (isFull) {
            className = 'red';
            message = 'No one allowed in!';
        }

        return (
            <Card className={`text-center ${className}`}>
                <div className='button-container'>
                    <Button className='color-success increment-btn' onClick={this.handleIncrement} disabled={isFull}>Increment</Button>{' '}
                    <Button className='color-danger decrement-btn' onClick={this.handleDecrement} disabled={current_occupancy === 0}>Decrement</Button>{' '}
                </div>
                <CardBody>
                    <CardTitle tag='h5'>{name}</CardTitle>
                    <p>Location: {location}</p>
                    <p>Genre: {music}</p>
                    <p>Occupancy: {current_occupancy}/{capacity}</p>
                    <p className='status-message'>{message}</p>
                    <Button color='info' onClick={toggleModal}>Edit</Button>{' '}
                    <Button color='secondary' onClick={onRemove}>Remove</Button>
                </CardBody>
            </Card>
        );

    }
}

export default ClubDisplay;