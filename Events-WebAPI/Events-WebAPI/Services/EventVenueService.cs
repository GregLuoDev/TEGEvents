using Events_WebAPI.Models;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using System.Net.Http.Json;

namespace Events_WebAPI.Services;

public class EventVenueService
{
    private readonly HttpClient _httpClient;
    private const string EventVenueS3DataUrl = "https://teg-coding-challenge.s3.ap-southeast-2.amazonaws.com/events/event-data.json";

    public EventVenueService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<EventVenueData?> GetEventDataAsync()
    {
        try
        {
            var eventData = await _httpClient.GetFromJsonAsync<EventVenueData>(EventVenueS3DataUrl, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            Console.WriteLine(eventData);
            return eventData;
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Network error fetching event data: {ex.Message}");
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
            return null;
        }
    }

    public async Task<List<Event>> GetEventsAsync()
    {
        var data = await GetEventDataAsync();
        return data?.Events ?? new List<Event>();
    }

    public async Task<List<Venue>> GetVenuesAsync()
    {
        var data = await GetEventDataAsync();
        return data?.Venues ?? new List<Venue>();
    }
}
