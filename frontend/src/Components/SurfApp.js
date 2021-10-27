import React from 'react';
import Select from 'react-select';
import {CanvasJSChart} from 'canvasjs-react-charts';
import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import Loading from './Loading';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import "../css/surfapp.css";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function celciusToFahrenheit(celcius){

    let c_float = parseFloat(celcius);
    let f_float = Math.floor(( c_float * 9/5 ) + 32.0);

    return f_float.toString();

}

function metersToFeet(meters){

    let m_float = parseFloat(meters);
    let f_float = m_float * 3.28084;
    f_float = f_float.toFixed(2);

    return f_float;

}


class SurfMap extends React.Component{

	markerClick = (event) => {

			console.log(event.key);
			let m_latlng = event.latlng;
			let marker_coordinates = JSON.stringify([m_latlng.lat, m_latlng.lng]);
			let stations = this.props.stations;


			stations.forEach((station) =>{
				if(marker_coordinates === JSON.stringify(station.coordinates)){
					this.props.clickEvent(station);
				}
			});
	}

	displayMarkers(){

		const markers = this.props.stations.map((station) => { 

					return (<Marker key={station.value}

									position={station.coordinates}

									onMouseOver={ (e) => {
										e.target.openPopup();
									}}

									onMouseOut={ (e) => {
										e.target.closePopup();	
									}}

									onClick={
										this.markerClick
									}
							>

							<Popup>{station.label}</Popup>

							</Marker>

								);


				});

		return markers;


	}
	
	render(){

		return (
			<div className="Map">
				<MapContainer center={this.props.currentStation.coordinates} zoom={11}>
				  <TileLayer
        					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     			  />

     			  {this.displayMarkers()}


				</MapContainer>
			</div>
		);
	}
}


function DisplayTemps(props){
		
		const stationTemps = props.temps;
		const f_degree = '\u2109';

		let temperature_display = [];

		if(!stationTemps){
			return null;
		}

		if(stationTemps.WTMP !== "MM"){
			temperature_display.push(<p key="WTMP">Water Temperature: {celciusToFahrenheit(stationTemps.WTMP)}{f_degree}</p>);
		}

		if(stationTemps.ATMP !== "MM"){
			temperature_display.push(<p key="ATMP">Air Temperature: {celciusToFahrenheit(stationTemps.ATMP)}{f_degree}</p>);
		}

		return temperature_display;
}

function DisplayGraph(props){


		const waves = props.stationWaves.map( (t) => {return {x: t.time, y: parseFloat(metersToFeet(t.WVHT))};});
		const wave_list = waves.map(t => t.y);
		const wave_max = Math.max(...wave_list);
		const wave_min = Math.min(...wave_list);
		const fluff = Math.abs(wave_max - wave_min) * 0.1;

		const options = {

			axisY:{
				title:"Wave Height",
				maximum: wave_max + fluff,
				minimum: wave_min - fluff,
			},

			axisX:{
				
				interval:4, 
        		intervalType: "hour", 
        		xValueFormatString: "DD-hh",
			},

			height: 160,

			data :[{
				type: "splineArea", 
				name: "Wave Height ft",
				xValueType:"dateTime",
				xValueFormatString: "D MMM hh:mm TT",
				connectNullData: true,
				dataPoints: waves
			}]

		};

		return(
			<div className="Chart">
				<CanvasJSChart options={options} />
			</div>
		);
	}

	
function SurfText(props){
	
		const waves = props.stationWaves;
		const last_wave_height = (waves === undefined || waves.length === 0 ) ? null : waves[waves.length - 1].WVHT;

		return (
			
			<div className="SurfText">
				<h1><b>{props.stationName}</b></h1>
				<h2>{last_wave_height && 
							<b>Wave Height: {metersToFeet(last_wave_height).toString()} ft</b>
					}
					{!last_wave_height && 
						<b style={{color:"red"}}>Oh No! This station is currently down</b>
					}	
				</h2>
				<DisplayTemps temps={props.stationTemps}/>
				<DisplayGraph stationWaves={waves}/>
			</div>
		
		);
}


export default class SurfApp extends React.Component{
	
	constructor(props){

		super(props);

		this.state = {

			error: null,
			isLoaded: false,
			selectedStation: null,
			tempData: null,
			specData: null,
			stations: null,
			notAvailable: false,

			};
	
		this.damnStation = "LJAC1"; //seperate id for station reporting la jolla's temperature data

	}
	
	componentDidMount(){
		this.getActiveStations().then((result) => {this.setState({isLoaded: true, stations: result});});	
	}


	async checkforSpecData(station_id){

		const ndbc_select_spec = "/api/Stations/data/spec/" + station_id;
		const res = await fetch(ndbc_select_spec);
		return (res.ok) ? await res.text() : false;
	}

	async getWeatherData(station_id){

		station_id = (station_id !== "LJPC1") ? station_id : "LJAC1";

		const ndbc_select_spec =  "/api/Stations/data/txt/" + station_id;
		const res = await fetch(ndbc_select_spec);

		return (res.ok) ? await res.text() : false;
	}

	async getActiveStations(){

		const json_header = {'Content-Type':'application/json'};

		const result = await fetch("/api/Stations/", {headers: json_header} );

		const res = await result.json();

		return this.parseActiveStations(res);
	}
	
	parseActiveStations(stations){

		let stationsLen = stations.length;
		let station_list = [];

		

		for(let i = 0; i < stationsLen ; i++){
				station_list.push({ value: stations[i].station_id,  label: stations[i].stationName, id: stations[i].id ,coordinates: [stations[i].lat, stations[i].lon]});	
		}
		return station_list;
	}


	handleSelectStation = (stationSelect) => {

		this.setState({isLoaded: false, notAvailable: false, selectedStation: null});	
		

		this.checkforSpecData(stationSelect.id).then((result) => {

					if(!result){
						this.setState({notAvailable: true});
						return;
					}

					this.setState({selectedStation: stationSelect, specData: this.parseSpectralData(result) , isLoaded:true });

				})
			.catch( (error) => {
					this.setState({error, isLoaded: true, notAvailable: true});

				});

		this.getWeatherData(stationSelect.id).then((result) => {

					this.setState({tempData: this.parseWeatherData(result)});

				})
			.catch((error) =>{
					this.setState({error, isLoaded: true, notAvailable: true});
			});
	}

	parseSpectralData(data){

		const twoDaysAgo = new Date();
		const twoDays = (24*60*60*1000);
		const rows = data.split("\n");

		let spec_object = [];
		let row_len;

		row_len = rows.length;

		twoDaysAgo.setTime(twoDaysAgo.getTime() - twoDays);

		for(let i = 2; i < row_len - 1; i++){	

			let cols = rows[i].match(/\S+/g);

			//row_date gets year,month,day,hr,min from columns
			let year = parseInt(cols[0]);
			let month = parseInt(cols[1]) - 1 ;
			let day = parseInt(cols[2]);
			let hour = parseInt(cols[3]);
			let min = parseInt(cols[4]);


			let row_date = new Date(Date.UTC(year, month , day, hour, min));

			if(row_date < twoDaysAgo){
				break;
			}

			spec_object.unshift({time: row_date, WVHT: cols[5], steepness: cols[12]});


		}

		return spec_object;


	}

	parseWeatherData(data){

		const rows = data.split("\n");
		let cols = rows[2].match(/\S+/g);	//skip the head and data type rows the split most recent weather entry on whitespace

		return { ATMP: cols[13], WTMP: cols[14]};
	}

	notAvailable(){
		return <h1>Station data not available</h1>
	}

	
	render(){
	
		const {	error, 
				isLoaded, 
				selectedStation, 
				stations,
				tempData,
				specData ,
				notAvailable   } = this.state;


			
		return (
			<div className="SurfApp">
			
			{error && error.message}
			
			{ /*If isLoaded is true then render select component else render Loading*/}
			
			{ !isLoaded && <Loading />}
			 
			{ isLoaded &&

				  <Select
				 	value={selectedStation}
				 	onChange={this.handleSelectStation}
					options={stations}
					menuPortalTarget={document.body}
					styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
				 />
			}
			{ selectedStation	&&  !notAvailable &&

				<SurfMap
					currentStation={selectedStation}
					stations={stations}
					clickEvent={this.handleSelectStation}
				/>

			}


			{ selectedStation && !notAvailable &&
				<SurfText 
					stationName={selectedStation.label}
					stationWaves={specData}
					stationTemps={tempData}
				/>
			}

				 
					
			</div>
		);	
	}

}
