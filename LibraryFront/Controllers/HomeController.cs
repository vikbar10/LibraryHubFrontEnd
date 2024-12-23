using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LibraryFront.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            string filePath = Server.MapPath("~/Views/Home.html");
            return File(filePath, "text/html");
        }
    }
}