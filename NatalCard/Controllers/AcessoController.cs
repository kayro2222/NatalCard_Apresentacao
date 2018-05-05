using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using NatalCard.Models;

namespace NatalCard.Controllers
{
    public class AcessoController : Controller
    {
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(LoginModel login, string returnUrl)
        {
            if (!ModelState.IsValid) {
                return View(login);
            }

            var usuario = LoginModel.ValidarUsuario(login.Usuario, login.Senha);

            if (usuario != null)
            {
                FormsAuthentication.SetAuthCookie(usuario.Nome, login.LembrarMe);
                if (Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            else {
                ModelState.AddModelError("", "Login Inválido");
            }
            return View(login);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Logoff() {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }
    }
}