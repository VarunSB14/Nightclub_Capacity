import React, { Component } from 'react';
import { Container, Row, Col, Button, Input, FormGroup, Label } from 'reactstrap';
import ClubDisplay from './ClubDisplay';
import EditModal from './EditModal';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { clubs: [], selectedClub: null, showModal: false, filter: '' };
  }

  updateData = (clubs) => {
    this.setState ({ clubs });
  };

  fetchData = () => {
    fetch(`http://localhost:5000/api/clubs`)
      .then((response) => response.json())
      .then((data) => this.updateData(data))
      .catch((error) => console.error('Error fetching clubs:', error));
  }

  componentDidMount() {
    this.fetchData();
  }

  toggleModal = (club) => {
    this.setState({ showModal: !this.state.showModal, selectedClub: club});
  };

  updateClub = (updatedClub) => {
    fetch(`http://localhost:5000/api/clubs/${updatedClub.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClub)
    })
      .then(() => { 
        this.setState({ showModal: false });
        this.fetchData();
      })
      .catch((error) => console.error('Error updating club:', error));
  };

  addNewClub = () => {
    const newClub = {
      name: "New Club",
      location: "Unknown",
      capacity: 50,
      yellow_threshold: 30,
      current_occupancy: 0,
      music: "Unknown"
    };

    fetch(`http://localhost:5000/api/clubs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClub)
    })
      .then((response) => response.json())
      .then(() => this.fetchData())
      .catch((error) => console.error('Error adding club:', error));
  };

  removeClub = (id) => {
    fetch(`http://localhost:5000/api/clubs/${id}`, { method: 'DELETE' })
      .then(() => this.fetchData())
      .catch((error) => console.error('Error deleting club:', error));
  };

  handleFilter = (e) => {
    this.setState({ filter: e.target.value });
  };

  adjustOccupancy = (id, amount) => {
    const club = this.state.clubs.find((club) => club.id === id);
    const updatedOccupancy = Math.min(Math.max(club.current_occupancy + amount, 0), club.capacity);

    fetch(`http://localhost:5000/api/clubs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...club, current_occupancy: updatedOccupancy})
    })
      .then(() => {
        const updatedClubs = this.state.clubs.map(club => {
            if (club.id === id) {
              return { ...club, current_occupancy: updatedOccupancy};
            }
            return club;
        });
        this.setState({ clubs: updatedClubs });
      })
      .catch((error) => console.error('Error adjusting occupancy:', error));
  };

  render() {
    const { clubs, showModal, selectedClub, filter } = this.state;
    const filteredClubs = clubs.filter(club =>
      club.location && club.location.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <Container>
        <h1 className='text-center my-4'>Nightclub Capacity Tracker</h1>
        <FormGroup className='mb-4 text-center'>
          <Label for='filter' className='text-secondary'>Filter by Location:</Label>
          <Input
            id='filter'
            type='text'
            placeholder='Enter location'
            value={filter}
            onChange={this.handleFilter}
            className='mb-3'
          />
          <Button color='primary' onClick={this.addNewClub}>Add New Club</Button>
        </FormGroup>
        <Row>
          {filteredClubs.map(club => (
            <Col xs='12' sm='6' lg='4' key={club.id} className='mb-4'>
              <ClubDisplay 
                club={club} 
                onAdjustOccupancy={(id, amount) => this.adjustOccupancy(id, amount)}
                toggleModal={() => this.toggleModal(club)}
                onRemove={() => this.removeClub(club.id)} 
              />
            </Col>
          ))}
        </Row>
        {showModal && (
          <EditModal 
            isOpen={showModal}
            club={selectedClub}
            toggle={this.toggleModal}
            onSave={this.updateClub}
          />
        )}
      </Container>
    );
  }
}

export default App;
