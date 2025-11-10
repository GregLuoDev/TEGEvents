namespace Events_WebAPI.Models;

public class EventVenueData
{
    public List<Event> Events { get; set; } = new();
    public List<Venue> Venues { get; set; } = new();
}
