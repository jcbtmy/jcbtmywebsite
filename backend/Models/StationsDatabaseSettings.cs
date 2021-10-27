namespace StationsApi.Models
{
    public class StationsDatabaseSettings : IStationsDatabaseSettings
    {
        public string StationsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IStationsDatabaseSettings
    {
        string StationsCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}