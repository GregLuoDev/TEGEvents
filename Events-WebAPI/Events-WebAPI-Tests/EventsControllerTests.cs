using System.Net;
using System.Text;
using System.Text.Json;
using Events_WebAPI.Controllers;
using Events_WebAPI.Models;
using Events_WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace Events_WebAPI.Tests.Controllers
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

    public class EventsControllerTests
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

        [Fact]
        public async Task GetEvents_ReturnsOk_WithEventsWhenPresent()
        {
            var data = new EventVenueData
            {
                Events = new List<Event>
                {
                    new Event { Id = 1, Name = "Test Event", Description = "desc", StartDate = "2025-01-01", VenueId = 10 }
                }
            };

            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            var client = CreateHttpClientReturning(json);
            var svc = new EventVenueService(client);
            var controller = new EventsController(svc);

            var result = await controller.GetEvents();

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<Event>>(ok.Value);
            Assert.Single(returned);
        }

        [Fact]
        public async Task GetEvents_ReturnsNotFound_WhenNoEvents()
        {
            // Service returns empty/absent events (empty JSON object) -> controller should return NotFound
            var client = CreateHttpClientReturning("{}");
            var svc = new EventVenueService(client);
            var controller = new EventsController(svc);

            var result = await controller.GetEvents();

            var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("No events found.", notFound.Value);
        }

        [Fact]
        public async Task GetVenues_ReturnsOk_WithVenuesWhenPresent()
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
            var controller = new EventsController(svc);

            var result = await controller.GetVenues();

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<Venue>>(ok.Value);
            Assert.Single(returned);
        }

        [Fact]
        public async Task GetVenues_ReturnsNotFound_WhenNoVenues()
        {
            var client = CreateHttpClientReturning("{}");
            var svc = new EventVenueService(client);
            var controller = new EventsController(svc);

            var result = await controller.GetVenues();

            var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("No venues found.", notFound.Value);
        }
    }
}