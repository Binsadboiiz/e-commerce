using Microsoft.AspNetCore.Mvc;

namespace BE.Repositories.Implementations
{
    public class CategoryRepository : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
