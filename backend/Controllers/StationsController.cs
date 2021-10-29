using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


using StationsApi.Models;
using StationsApi.Services;
using MongoDB.Bson;




namespace ProjectSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class StationsController : ControllerBase 
    {

        private readonly StationService _stationService;
        private readonly HttpClient _httpClient;

        public StationsController(StationService stationService)
        {
            _stationService = stationService;
            _httpClient = new HttpClient();

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Station>>> Get()
        {
            IEnumerable<Station> stations = await _stationService.GetAll();

            return stations.ToList();
        }

        [HttpPost]
        public async Task<ActionResult<Station>> CreateStation(Station station)
        {

            await _stationService.Create(station);

            return  station;
        }


        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Station>> GetStation(string id)
        {
            Station station = await _stationService.Get(id);

            if(station == null)
            {
                return NotFound();
            }

            return station;

        }


        [HttpGet("data/spec/{id:length(24)}")]
        public async Task<IActionResult> GetStationSpec(string id)
        {
            Station station = await _stationService.Get(id);

            //is it a valid station in our set
            if(station == null)
            {
                return NotFound();
            }
            //go grab spectral wave sizes data from the NDBC API
            try{ 

                HttpResponseMessage response = await _httpClient.GetAsync($"http://www.ndbc.noaa.gov/data/realtime2/{station.station_id}.spec");

                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();

                return Ok(responseBody);

            }     
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0}",e.Message);

                return StatusCode(500);
            }
        }


        [HttpGet("data/txt/{id:length(24)}")]
        public async Task<IActionResult> GetStationText(string id)
        {
            Station station = await _stationService.Get(id);

            //is it a valid station in our set
            if(station == null)
            {
                return NotFound();
            }

            //grab temperature data from NDBC API
            try{ 

                HttpResponseMessage response = await _httpClient.GetAsync($"http://www.ndbc.noaa.gov/data/realtime2/{station.station_id}.txt");

                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();

                return Ok(responseBody);

            }     
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0}",e.Message);

                return StatusCode(500);
            }
        }



    }
}