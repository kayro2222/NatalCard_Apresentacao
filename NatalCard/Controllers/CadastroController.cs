using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NatalCard.Models;

namespace NatalCard.Controllers
{
    public class CadastroController : Controller
    {
        private const int _QtdMaxPagination = 5;

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public JsonResult SalvarDados(CadastroModel model)
        {
            var result = "OK";
            var mensagens = new List<string>();
            var idSalvo = string.Empty;
            if (!ModelState.IsValid)
            {
                result = "AVISO";
                mensagens = ModelState.Values.SelectMany(x=>x.Errors).Select(x=>x.ErrorMessage).ToList();
            }
            else
            {
                try
                {
                    var id = model.Salvar();
                    if (id > 0) {
                        idSalvo = id.ToString();
                    }
                    else
                    {
                        result = "ERRO";
                    }
                }
                catch (Exception e)
                {
                    result = "ERRO";
                }
            }


            return Json(new { Result = result, Mensagens = mensagens, IdSalvo = idSalvo });
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public JsonResult ExcluirDados(int id)
        {
            return Json(CadastroModel.DeleteById(id));
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public JsonResult RecuperarDados(int id)
        {
            return Json(CadastroModel.GetById(id));
        }

        [Authorize]
        public ActionResult Index()
        {
            ViewBag.ListaQtdLinhas = new SelectList(new int[] { _QtdMaxPagination, 10}, _QtdMaxPagination);
            ViewBag.QtdMaxPagination = _QtdMaxPagination;
            ViewBag.AtualPage = 1;

            var lista = CadastroModel.GetLista(ViewBag.AtualPage, _QtdMaxPagination);
            var qtdPage = CadastroModel.GetQtdPage();

            /* VERIFICA SE QTD DE LINHAS DA PAGINAÇÃO É MÚLTIPLO DE 5 */
            var diffQtdPaginas = (qtdPage % ViewBag.QtdMaxPagination) > 0 ? 1 : 0;
            ViewBag.QtdPaginas = (qtdPage / ViewBag.QtdMaxPagination) + diffQtdPaginas;

            return View(lista);
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult CadastroPagination(int page, int tamPage, string filtroNome, string filtroDataNascimento, string filtroDataCadastro)
        {
            var lista = CadastroModel.GetLista(page, tamPage, filtroNome, filtroDataNascimento, filtroDataCadastro);

            return Json(lista);
        }
    }
}