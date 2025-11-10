using Events_WebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Events_WebAPI.Services;

namespace Events_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly EventVenueService _eventService;

    public EventsController(EventVenueService eventService)
    {
        _eventService = eventService;
    }

    // GET: api/events
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
    {
        var events = await _eventService.GetEventsAsync();
        if (events == null || events.Count == 0)
            return NotFound("No events found.");

        return Ok(events);
    }

    // GET: api/events/venues
    [HttpGet("venues")]
    public async Task<ActionResult<IEnumerable<Venue>>> GetVenues()
    {
        var venues = await _eventService.GetVenuesAsync();
        if (venues == null || venues.Count == 0)
            return NotFound("No venues found.");

        return Ok(venues);
    }
}
