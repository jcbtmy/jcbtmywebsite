using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;


namespace StationsApi.Models
{

    public class Station 
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string stationName {get; set;}

        public string station_id  {get; set;}

        public float lat {get; set;}
        public float lon {get; set;}

    }

}