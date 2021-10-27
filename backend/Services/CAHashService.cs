
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;

using CAHashingApi.Models;



namespace CAHashingApi.Services
{
    public class CAHashService
    {
        private readonly IMongoCollection<CAHash> _caHashes;
        private readonly IMongoCollection<CARule> _caRules;


        public CAHashService(ICAHashDatabaseSettings settings)
        {
            IMongoClient client = null;

            try{
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

                _caRules = database.GetCollection<CARule>(settings.CARuleCollectionName);
                _caHashes = database.GetCollection<CAHash>(settings.CAHashCollectionName);

            }
            catch(Exception ex)
            {
                Console.WriteLine("Failed To Get Database...");
                Console.WriteLine(ex.Message);
            }
            
        }

        
        //CA Hash Services

        public async Task<CAHash> GetHashById(string id) =>
            await _caHashes.Find(hash => hash.Id == id).FirstOrDefaultAsync();

        public async Task<CAHash> GetHashDuplicate(string input, uint ruleNumber, uint iterations){ 

            var filter =       Builders<CAHash>.Filter.Eq(hash => hash.input, input) 
                            &  Builders<CAHash>.Filter.Eq(hash => hash.ruleNumber, ruleNumber) 
                            &  Builders<CAHash>.Filter.Eq(hash => hash.iterations, iterations);

            CAHash found = await _caHashes.Find(filter).FirstOrDefaultAsync();

            return found;
        }

        public async Task<CAHash> GetHashCollision(string output, uint ruleNumber)
        {


            var filter =        Builders<CAHash>.Filter.Eq(hash => hash.outputHash, output) 
                            &   Builders<CAHash>.Filter.Eq(hash => hash.ruleNumber, ruleNumber);

            CAHash hashCollision = await _caHashes.Find(filter).FirstOrDefaultAsync();

            return hashCollision;
        }

        public async Task<CAHash> CreateHash(CAHash hash){

            await _caHashes.InsertOneAsync(hash);

            return hash;
        }



        //CA Rule Services

        public async Task<List<CARule>> GetAllRules() =>
            await _caRules.Find(rule => true).ToListAsync();

        public async Task<CARule> GetRuleByNumber(uint ruleNumber) =>
            await _caRules.Find( rule => rule.ruleNumber == ruleNumber).FirstOrDefaultAsync();

        public async Task<CARule> GetRuleById(string id) => 
            await _caRules.Find(rule => rule.Id == id).FirstOrDefaultAsync();

        public async Task<CARule> CreateRule(CARule rule){

            await _caRules.InsertOneAsync(rule);

            return rule;
        }
    }
}