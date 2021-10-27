using StationsApi.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace StationsApi.Services 
{

    public class StationService
    {
        private readonly IMongoCollection<Station> _stations;

        public StationService(IStationsDatabaseSettings settings)
        {

            IMongoClient client = null;

            try {
                Console.WriteLine("Creating MongoDB Connection...");
                client = new MongoClient(settings.ConnectionString);
            }

            catch(Exception ex)
            {
                Console.WriteLine("Failed To Create Connection...");
                Console.Write(ex.Message);
            }

            try {
                Console.WriteLine("Getting Database...");
                var database = client.GetDatabase(settings.DatabaseName);
                _stations = database.GetCollection<Station>(settings.StationsCollectionName);

                Console.WriteLine("Connection Successful");

            }
            catch(Exception ex)
            {
                Console.WriteLine("Failed To Get Database...");
                Console.WriteLine(ex.Message);
            }

        }

        public async Task<List<Station>> GetAll() => 
            await _stations.Find( station => true).ToListAsync();

        public async Task<Station> Get(string id) => 
            await _stations.Find<Station>(station => station.Id == id).FirstOrDefaultAsync();

        public async Task<Station> Create(Station station) {

            await _stations.InsertOneAsync(station);

            return station;
        }

        public async void Update(string id, Station stationRep) =>
            await _stations.ReplaceOneAsync(station => station.Id == id, stationRep);

        public async void Remove(string id) => 
            await _stations.DeleteOneAsync(station => station.Id == id);

    }
}