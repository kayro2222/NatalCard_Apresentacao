using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace NatalCard.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Informe o Usuário.")]
        [DisplayName("Usuário")]
        public string Usuario { get; set; }

        [Required(ErrorMessage = "Informe a Senha.")]
        [DisplayName("Senha")]
        public string Senha { get; set; }

        [Required]
        [DisplayName("Lembrar")]
        public bool LembrarMe { get; set; }

        public string Nome { get; set; }

        public static LoginModel ValidarUsuario(string usuario, string senha)
        {
            LoginModel result = null;
            using (var conn = new SqlConnection())
            {
                conn.ConnectionString = ConfigurationManager.ConnectionStrings["baseDados"].ConnectionString;
                conn.Open();
                using (var comando = new SqlCommand())
                {
                    comando.Connection = conn;
                    comando.CommandText = "SELECT * FROM usuario WHERE usuario=@usuario AND senha=@senha";
                    comando.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;
                    comando.Parameters.Add("@senha", SqlDbType.VarChar).Value = CriptoHelper.HashMD5(senha);
                    var reader = comando.ExecuteReader();
                    if (reader.Read()) {
                        result = new LoginModel
                        {
                            Usuario = (string)reader["usuario"],
                            Senha = (string)reader["senha"],
                            Nome = (string)reader["nome"]
                        };
                    }
                }
            }

            return result;
        }
    }
}