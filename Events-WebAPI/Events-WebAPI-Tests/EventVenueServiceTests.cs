using System.Net;
using System.Text;
using System.Text.Json;
using Events_WebAPI.Models;
using Events_WebAPI.Services;

namespace Events_WebAPI.Tests.Services
{
    // Minimal HttpMessageHandler stub to control HttpClient responses in tests.
    internal class FakeHttpMessageHandler : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> _sendAsync;

        public FakeHttpMessageHandler(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsync)
        {
            _sendAsync = sendAsync ?? throw new ArgumentNullException(nameof(sendAsync));
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            => _sendAsync(request, cancellationToken);
    }

    public class EventVenueServiceTests
    {
        private static HttpClient CreateHttpClientReturning(string content, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            var response = new HttpResponseMessage(statusCode)
            {
                Content = new StringContent(content ?? string.Empty, Encoding.UTF8, "application/json")
            };

            var handler = new FakeHttpMessageHandler((req, ct) => Task.FromResult(response));
            return new HttpClient(handler);
        }

        private static HttpClient CreateHttpClientThrowing(Exception ex)
        {
            var handler = new FakeHttpMessageHandler((req, ct) => Task.FromException<HttpResponseMessage>(ex));
            return new HttpClient(handler);
        }

        [Fact]
        public async Task GetEventDataAsync_ReturnsData_OnSuccess()
        {
            var data = new EventVenueData
            {
                Events = new List<Event>
                {
                    new Event { Id = 1, Name = "Test Event", Description = "desc", StartDate = "2025-01-01", VenueId = 10 }
                },
                Venues = new List<Venue>
                {
                    new Venue { Id = 10, Name = "Test Venue", Capacity = 200, Location = "City" }
                }
            };

            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            var client = CreateHttpClientReturning(json);

            var svc = new EventVenueService(client);
            var result = await svc.GetEventDataAsync();

            Assert.NotNull(result);
            Assert.NotNull(result.Events);
            Assert.NotNull(result.Venues);
            Assert.Single(result.Events);
            Assert.Single(result.Venues);
            Assert.Equal("Test Event", result.Events[0].Name);
            Assert.Equal("Test Venue", result.Venues[0].Name);
        }

        [Fact]
        public async Task GetEventDataAsync_ReturnsNull_OnHttpRequestException()
        {
            var client = CreateHttpClientThrowing(new HttpRequestException("network error"));
            var svc = new EventVenueService(client);

            var result = await svc.GetEventDataAsync();

            Assert.Null(result);
        }

        [Fact]
        public async Task GetEventDataAsync_ReturnsNull_OnMalformedJson()
        {
            var client = CreateHttpClientReturning("this-is-not-json");
            var svc = new EventVenueService(client);

            var result = await svc.GetEventDataAsync();

            Assert.Null(result);
        }

        [Fact]
        public async Task GetEventsAsync_ReturnsEventsList_WhenDataPresent()
        {
            var data = new EventVenueData
            {
                Events = new List<Event>
                {
                    new Event { Id = 2, Name = "Event2", Description = "d2", StartDate = "2025-02-01", VenueId = 20 }
                }
            };

            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            var client = CreateHttpClientReturning(json);

            var svc = new EventVenueService(client);
            var events = await svc.GetEventsAsync();

            Assert.NotNull(events);
            Assert.Single(events);
            Assert.Equal("Event2", events[0].Name);
        }

        [Fact]
        public async Task GetEventsAsync_ReturnsEmptyList_WhenNoEvents()
        {
            var client = CreateHttpClientReturning("{}");

            var svc = new EventVenueService(client);
            var events = await svc.GetEventsAsync();

            Assert.NotNull(events);
            Assert.Empty(events);
        }

        [Fact]
        public async Task GetVenuesAsync_ReturnsVenuesList_WhenDataPresent()
        {
            var data = new EventVenueData
            {
                Venues = new List<Venue>
                {
                    new Venue { Id = 3, Name = "Venue3", Capacity = 300, Location = "Loc3" }
                }
            };

            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            var client = CreateHttpClientReturning(json);

            var svc = new EventVenueService(client);
            var venues = await svc.GetVenuesAsync();

            Assert.NotNull(venues);
            Assert.Single(venues);
            Assert.Equal("Venue3", venues[0].Name);
        }

        [Fact]
        public async Task GetVenuesAsync_ReturnsEmptyList_WhenNoVenues()
        {
            var client = CreateHttpClientReturning("{}");

            var svc = new EventVenueService(client);
            var venues = await svc.GetVenuesAsync();

            Assert.NotNull(venues);
            Assert.Empty(venues);
        }
    }
}