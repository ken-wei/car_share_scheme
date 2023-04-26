import React,  { Component } from "react";
import GoogleMapReact from 'google-map-react';
import CarBookingService from "../../apis/CarBookingService";
import { Button } from 'react-bootstrap';
import { useHistory } from "react-router";
import '../../css/Marker.css'
import '../../css/HomePage.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faMapMarkedAlt, faLocationArrow, faTag, faDollarSign } from '@fortawesome/free-solid-svg-icons'

// Component for displaying user's current location or default position
const AnyReactComponent = ({ text, $hover }) => 
    <div>
        <div
          className="pin bounce"
          style={{ cursor: 'pointer' }}
          title={text}
        />
        <div className="pulse" />
    </div>;

// InfoWindow component
const InfoWindow = (props) => {
  let history = useHistory();
  const car = props.carDetails;

  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
    borderRadius: 10
  };

  const book = e => {
    history.push('/book', e.target.value)
  }

  return (
    <div style={infoWindowStyle} className="info-window">
      <Button variant="danger" className="infowindow-close" onClick={() => props.onCloseClick(car.id)}>X</Button>
      <div className="infowindow-title" style={{ fontSize: 16 }}>
        <FontAwesomeIcon icon={faCar} size="2x"/> {car.id} - {car["carType"]}
      </div>
      <div className="car-model" style={{ fontSize: 14, color: 'grey' }}>
        Model: {car["model"]}
      </div>
      <div className="car-position" style={{ fontSize: 14 }}>
        <FontAwesomeIcon className="position-icon" icon={faMapMarkedAlt} size="lg"/> 
        <span style={{ color: 'grey' }}>
          {car["parking-detail"][0].lat}
        </span>
        {", "}
        <span style={{ color: 'orange' }}>
          {car["parking-detail"][0].lng}
        </span>
      </div>
      <div className="car-address" style={{ fontSize: 14, color: 'grey' }}>
        <FontAwesomeIcon className="car-address-icon" icon={faLocationArrow} size="lg"/> {car["parking-detail"][0].address}
      </div>
      <div className="price-container" style={{ fontSize: 14, color: 'green' }}>
        <FontAwesomeIcon className="price-tag" icon={faTag} size="lg"/> 
        <FontAwesomeIcon className="price-dollar" icon={faDollarSign} size="lg"/>
         {car["rate"]} / Hour
      </div>
      <div className="book-button">
        <Button value={car.id} onClick={book} >Book</Button>
      </div>
    </div>
  );
};

// Marker component
const Marker = ({ show, car, $hover, onCloseClick }) => {
  // const [showWindow, setShowWindow] = useState(show);

  const markerStyle = {
    border: '1px solid white',
    borderRadius: '50%',
    height: 20,
    width: 20,
    backgroundColor: show ? 'red' : 'blue',
    cursor: 'pointer',
    zIndex: 10,
  };

  const markerHoverStyle = {
      ...markerStyle,
      backgroundColor: "green",
  }

  return (
    <>
      <div style={$hover ? markerHoverStyle : markerStyle} />
      {show && <InfoWindow carDetails={car} onCloseClick={onCloseClick} />}
    </>
  );
};

class MapComponent extends Component {
  
    constructor(props) {
        super(props)
        this.state = {
            cars: [],
            userPosition: this.props.center,
        };
    }

    getUserLocation = () => {
        var pos = {}
        if (navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
            navigator.geolocation.getCurrentPosition( 
                (position) => {
                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.setState({userPosition: pos})

                },
                (error) => {
                    // console.log(error)
                }, 
                { enableHighAccuracy: false, timeout: 20000, minimumAge: 0}
                )
            
        } else {
            // If location not allowed
        }
        return pos
    }
    
    shouldComponentUpdate(props) {
        this.getUserLocation();
        return true;
    }  

    componentDidMount(props) {
        // Retrieve user's current position
        console.log(this.state)
        // Retrieving available cars from the backend
        CarBookingService.retrieveAvailableCars()
            .then(
                response => {
                    response.data.forEach((car) => {
                        car.show = false; // eslint-disable-next-line
                    })
                    // console.log(response.data[0]["parking-detail"][0].lat)
                    this.setState({ cars: response.data })
                }
            )
    }

    static defaultProps = {
        center: {
          lat: -37.811445,
          lng: 144.959766
        },
        zoom: 11
      };
    
    // onChildClick callback can take two arguments: key and childProps
    onChildClickCallback = (key) => {
        // If user clicks on the current location icon (Return)
        if (key === 0) {
            return;        
        }
        var copyOfCurrentState = this.state.cars.slice()
        const index = copyOfCurrentState.findIndex((car) => car.id === key);
        copyOfCurrentState[index].show = !copyOfCurrentState[index].show; 
        this.setState({cars: copyOfCurrentState})
    };

    // Props function to pass into infowindow
    openCloseWindow = (key) => {
      // If user clicks on the current location icon (Return)
      if (key === 0) {
          return;        
      }
      var copyOfCurrentState = this.state.cars.slice()
      const index = copyOfCurrentState.findIndex((car) => car.id === key);
      copyOfCurrentState[index].show = !copyOfCurrentState[index].show; 
      this.setState({cars: copyOfCurrentState})
  };

    handleApiLoaded = (map, maps) => {
      if (this.state.pos === this.props.center) { 
        this.getUserLocation()
        this.forceUpdate()
      }
    }

    componentWillUnmount() {
      // setMapOnAll(null);
    }

    render() {
        const { cars } = this.state;

        return (
            // Important! Always set the container height explicitly
            <div id="map-component" style={{ height: '40vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyDkpox2EBIJ4SYqk8-C7Lf1mHINT565-Y0" }}
                center={this.state.userPosition}
                defaultZoom={this.props.zoom}
                onChildClick={this.onChildClickCallback}
                onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
              >
                { this.state.userPosition 
                    ? 
                        <AnyReactComponent
                            lat={this.state.userPosition.lat}
                            lng={this.state.userPosition.lng}
                            text="You"
                        />
                    :
                    <></>
                }
                {cars.map((car) => (
                    <Marker
                        key={car.id}
                        lat={car['parking-detail'][0].lat}
                        lng={car['parking-detail'][0].lng}
                        show={car.show}
                        car={car}
                        onCloseClick={this.openCloseWindow}
                    />
                ))}
              </GoogleMapReact>
            </div>
        );
    }

}

export default MapComponent;