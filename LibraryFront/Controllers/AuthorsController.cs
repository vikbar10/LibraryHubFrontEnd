using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LibraryFront.Controllers
{
    public class AuthorsController : Controller
    {
        // GET: Authors
        public ActionResult Index()
        {
            string filePath = Server.MapPath("~/Public/Authors.html");
            return File(filePath, "text/html");
        }
    }
}