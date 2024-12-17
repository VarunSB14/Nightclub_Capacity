import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = { ...props.club };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSave = () => {
        const { capacity, yellow_threshold } = this.state;
        if (yellow_threshold > capacity) {
            alert("Yellow Threshold cannot exceed Capacity.")
            return;
        }
        this.props.onSave(this.state);
    };

    render() {
        const { isOpen, toggle } = this.props;
        const { name, location, capacity, yellow_threshold, music } = this.state;

        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Edit Club</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for='name'>Name</Label>
                            <Input 
                                id='name'
                                name='name'
                                value={name}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='location'>Location</Label>
                            <Input 
                                id='location'
                                name='location'
                                value={location}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='capacity'>Capacity</Label>
                            <Input 
                                id='capacity'
                                name='capacity'
                                type='number'
                                value={capacity}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='yellow_threshold'>Yellow Threshold</Label>
                            <Input 
                                id='yellow_threshold'
                                name='yellow_threshold'
                                type='number'
                                value={yellow_threshold}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='music'>Music</Label>
                            <Input 
                                id='music'
                                name='music'
                                value={music}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalHeader>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                    <Button color="primary" onClick={this.handleSave}>Save</Button>
                </ModalHeader>
            </Modal>
        );
    }
}

export default EditModal;