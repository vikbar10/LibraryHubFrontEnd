using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LibraryFront.Controllers
{
    public class BooksController : Controller
    {
        // GET: Books
        public ActionResult Index()
        {
            string filePath = Server.MapPath("~/Views/Books.html");
            return File(filePath, "text/html");
        }
    }
}