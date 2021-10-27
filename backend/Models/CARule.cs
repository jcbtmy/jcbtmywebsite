using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace CAHashingApi.Models 
{
    public class CARule 
    {
        public const int LEFT = 0;
        public const int TOP = 1;
        public const int RIGHT = 2;
        public const int CENTER = 3;

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string Id {get; set;}

        public uint ruleNumber {get; set;}
        
        public int[][] ruleSet {get; set;}
    }
}