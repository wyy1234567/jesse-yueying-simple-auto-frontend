import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      search_make: '',
      search_vin: '',
      show_update_form: false,
      new_auto_vin: '',
      new_auto_make: '',
      new_auto_year: '',
      new_auto_model: '',
      update_price: '',
      update_preowned: '',
      update_vin: ''

    };

    this.getAll = this.getAll.bind(this);
  }

  componentDidMount() {
    this.getAll();
    console.log(this.state);
  }

  getAll() {
    axios
      .get('https://simple-autos-jesse-kiwi.herokuapp.com/autos')
      .then((res) => {
        // console.log(res);
        var data = res.data.automobiles;
        this.setState({
          data: data,
        });
      })
      .catch(function (err) {
      });
  }

  renderAuto = (auto, index) => {
    return(
      <tr className="Auto-details" key={index}>
        <td>
          {auto.model}
        </td>
        <td>
          {auto.vin}
        </td>
        <td>
          {auto.make}
        </td>
        <td>
          {auto.year ? auto.year: "" }
        </td>
        <td>
          {auto.year ? auto.miles: "" }
        </td>
        <td>
          {auto.year ? auto.price: "" }
        </td>
        <td>
          <button className="update-auto-button" value={auto.vin} onClick={this.handleUpdateButton}>update</button>
          <button className="delete-auto-button" value={auto.vin} onClick={this.handleDeleteButton}>delete</button>
        </td>
      </tr>
    )
  }

  // Change the state show_update_form to true: price and preowned
  // Render the autoUpdate form
  handleUpdateButton = (event) => {
    this.setState({
      show_update_form: true,
      update_vin: event.target.value
    });
  }

  // Delete the specific auto from the auto list
  // Make a delete request to the backend
  handleDeleteButton = (event) => {
    axios.delete(`https://simple-autos-jesse-kiwi.herokuapp.com/autos/${event.target.value}`)
    .then(res => {
      if (res.status === 202) {
        this.getAll()
      }
    })
  }

  // Return a simple form, handle the update event: only update its price and preowned
  // Update the auto list below, and make a patch to backend
  // Hide the form once the operation is done: set the show_update_form to false
  // renderAutoUpdateForm = (vinNumber) => {
  //   return (
  //   <form onSubmit={() => this.handleUpdateAuto(vinNumber)}>
  //     <input className="input" name="update_price" placeholder="Auto price" value={this.state.update_price} onChange={this.handleInputChange}/>
  //     <input className="input" name="update_preowned" placeholder="Auto preowned" value={this.state.update_preowned} onChange={this.handleInputChange} />
  //     <button>update</button>
  //   </form>
  //   )
  // }

  handleUpdateAuto = (event) => {
    event.preventDefault();
    let updated = {
      price: this.state.update_price,
      preowned: this.state.update_preowned
    }

    axios.patch(`https://simple-autos-jesse-kiwi.herokuapp.com/autos/${this.state.update_vin}`, updated)
    .then(res => {
      this.getAll()
      this.setState({
        update_price: '',
        update_preowned: '',
        update_vin:  '',
        show_update_form: false
      })
    })
  }

  // Grab the form's info, update the auto list below
  // Make a Post to backend, update the db
  // Clear the form, don't refresh the page
  handleNewAutoSubmit = (event) => {
    event.preventDefault();
    let newAuto = {
      vin: this.state.new_auto_vin,
      make: this.state.new_auto_make,
      model: this.state.new_auto_model,
      year: this.state.new_auto_year
    }
    axios.post('https://simple-autos-jesse-kiwi.herokuapp.com/autos', newAuto)
      .then((res) => {
      console.log(res);

      const copy = [...this.state.data]
      copy.push(res.data)
      this.setState({
        data: copy,
        new_auto_vin: '',
        new_auto_make: '',
        new_auto_year: '',
        new_auto_model: ''
      })
    })
    .catch(function (err) {
    });
  }


  // Grab the form's info, filter the auto list, update the auto list with search result: make
  // Clear the form, don't refresh the page
  handleAutoSearch = (event) => {
    event.preventDefault();

    if (this.state.search_vin === '') {
      this.getAll();
    } else {
      axios.get(`https://simple-autos-jesse-kiwi.herokuapp.com/autos/${this.state.search_vin}`)
      .then(res => {
        // console.log(res);
        this.setState({
          data: [res.data],
          search_vin: ""
        })
      })
      .catch(function (err) {})
    }
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      if (this.state.search_make === '') {
        console.log("I WAS RAN");
        this.getAll();
      } else {
        if (event.target.name === 'search_make') {
          axios.get(`https://simple-autos-jesse-kiwi.herokuapp.com/autos?make=${this.state.search_make}`)
          .then((res) => {
            this.setState({
              data: res.data.automobiles
            }, () => {
              console.log(res);
            })
          })
          .catch(function (err) {
          });
        }
      }
    });
  }

  render() {
    return (
      <div className="App">
        <form className="new-auto-form" onSubmit={this.handleNewAutoSubmit}>
          <input className="input" name="new_auto_make" placeholder="Auto Make" value={this.state.new_auto_make} onChange={this.handleInputChange} />
          <input className="input" name="new_auto_model" placeholder="Auto Model" value={this.state.new_auto_model} onChange={this.handleInputChange} />
          <input className="input" name="new_auto_year" placeholder="Auto Year" value={this.state.new_auto_year} onChange={this.handleInputChange} />
          <input className="input" name="new_auto_vin" placeholder="Auto Vin Number" value={this.state.new_auto_vin} onChange={this.handleInputChange} />
          <button>submit</button>
        </form>

        <input className="input" name="search_make" placeholder="Search by make" value={this.state.search_make} onChange={this.handleInputChange} />
        <form onSubmit={this.handleAutoSearch}>
          <input className="input" name="search_vin" placeholder="Search by vin" value={this.state.search_vin} onChange={this.handleInputChange} />
          <button>search</button>
        </form>

        {this.state.show_update_form ?
              <form onSubmit={this.handleUpdateAuto}>
              <input className="input" name="update_price" placeholder="Auto price" value={this.state.update_price} onChange={this.handleInputChange}/>
              <input className="input" name="update_preowned" placeholder="Auto preowned" value={this.state.update_preowned} onChange={this.handleInputChange} />
              <button>update</button>
            </form>

        : ""}

        <h1>All autos:</h1>
        <table className="Auto-list">
          <thead>
            <th>Model</th>
            <th>Vin</th>
            <th>Make</th>
            <th>Year</th>
            <th>Miles</th>
            <th>Price</th>
            <th>Update/Delete</th>
          </thead>
          <tbody>

            {this.state.data.map((item, index) => (
              this.renderAuto(item, index)
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
