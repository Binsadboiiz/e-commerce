using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers
{
    [ApiController]
    [Route("api/attributes")]
    public class AttributeController : ControllerBase
    {
        private readonly IAttributeService _attributeService;

        public AttributeController(IAttributeService attributeService)
        {
            _attributeService = attributeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _attributeService.GetAllAsync();
            return Ok(result);
        }
    }
}