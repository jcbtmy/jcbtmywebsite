namespace CAHashingApi.Models {

    public class CAHashDatabaseSettings : ICAHashDatabaseSettings
    {
        public string CAHashCollectionName {get; set;}
        public string CARuleCollectionName {get; set;}
        public string ConnectionString{get; set;}
        public string DatabaseName {get; set;}
    }    

    public interface ICAHashDatabaseSettings
    {
        string CAHashCollectionName {get; set;}
        string CARuleCollectionName {get; set;}
        string ConnectionString {get; set;}
        string DatabaseName {get; set;}
    }    
}