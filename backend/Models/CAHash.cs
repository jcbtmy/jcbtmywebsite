using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;



namespace CAHashingApi.Models 
{

    public class CAHash
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string Id {get; set;}

        [BsonElement("input")]
        public string input {get; set;}

        [BsonElement("outputHash")]
        public string outputHash {get; set;}

        [BsonElement("dimension")]
        public uint dimensions {get; set;}

        [BsonElement("iterations")]
        public uint iterations {get; set;}

        [BsonElement("ruleNumber")]
        public uint ruleNumber {get; set;}

        public string imageData {get; set;}

    }

}