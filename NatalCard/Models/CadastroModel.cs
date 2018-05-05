using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NatalCard.Models
{
    public class CadastroModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Informe o UF")]
        public string Uf { get; set; }

        [Required(ErrorMessage = "Informe o Nome")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Informe o Cpf")]
        public string Cpf { get; set; }

        public string Rg { get; set; }

        [Required(ErrorMessage = "Informe o Telefone")]
        public string Telefone { get; set; }

        public string DataCadastro { get; set; }

        [Required(ErrorMessage = "Informe a Data de Nascimento")]
        public string DataNascimento { get; set; }

        public static int GetQtdPage()
        {
            var result = 0;

            using (var conn = new SqlConnection())
            {
                conn.ConnectionString = ConfigurationManager.ConnectionStrings["baseDados"].ConnectionString;
                conn.Open();
                using (var comando = new SqlCommand())
                {
                    comando.Connection = conn;
                    comando.CommandText = "SELECT count(*) FROM cadastro WHERE ativo=1";
                    result = (int)comando.ExecuteScalar();
                }
            }

            return result;
        }

        public static List<CadastroModel> GetLista(int page, int qtdPage, string filtroNome = "", string filtroDataNascimento = "", string filtroDataCadastro = "")
        {
            var result = new List<CadastroModel>();

            using (var conn = new SqlConnection())
            {
                conn.ConnectionString = ConfigurationManager.ConnectionStrings["baseDados"].ConnectionString;
                conn.Open();

                using (var comando = new SqlCommand())
                {
                    var pos = (page - 1) * qtdPage;

                    var sWhereNome = "";
                    var sWhereDataNascimento = "";
                    var sWhereDataCadastro = "";

                    if (!string.IsNullOrEmpty(filtroNome)) {
                        sWhereNome = string.Format(" AND lower(nome) LIKE '%{0}%' ", filtroNome.ToLower());
                    }

                    if (!string.IsNullOrEmpty(filtroDataNascimento))
                    {
                        sWhereDataNascimento = string.Format(" AND dataNascimento LIKE '%{0}%' ", filtroDataNascimento);
                    }

                    if (!string.IsNullOrEmpty(filtroDataCadastro))
                    {
                        sWhereDataCadastro = string.Format(" AND dataCadastro LIKE '%{0}%' ", filtroDataCadastro);
                    }

                    comando.Connection = conn;
                    comando.CommandText = "SELECT * " +
                        "FROM cadastro " +
                        "WHERE ativo=1 " +
                        sWhereNome + sWhereDataNascimento + sWhereDataCadastro +
                        "ORDER BY id " +
                        "OFFSET @pos ROWS FETCH NEXT @qtdPage ROWS ONLY";
                    comando.Parameters.Add("@pos", SqlDbType.Int).Value = pos > 0 ? pos - 1 : 0;
                    comando.Parameters.Add("@qtdPage", SqlDbType.Int).Value = qtdPage;
                    var reader = comando.ExecuteReader();
                    while (reader.Read())
                    {
                        result.Add(new CadastroModel
                        {
                            Id = (int)reader["id"],
                            Nome = (string)reader["nome"],
                            Rg = (string)reader["rg"],
                            Cpf = (string)reader["cpf"],
                            Telefone = (string)reader["telefone"],
                            DataCadastro = (string)reader["dataCadastro"],
                            DataNascimento = (string)reader["dataNascimento"]
                        });
                    }
                }
            }

            return result;
        }

        public static CadastroModel GetById(int id)
        {
            CadastroModel result = null;

            using (var conn = new SqlConnection())
            {
                conn.ConnectionString = ConfigurationManager.ConnectionStrings["baseDados"].ConnectionString;
                conn.Open();
                using (var comando = new SqlCommand())
                {
                    comando.Connection = conn;
                    comando.CommandText = "SELECT * FROM cadastro WHERE id=@id AND ativo=1";
                    comando.Parameters.Add("@id", SqlDbType.Int).Value = id;
                    var reader = comando.ExecuteReader();
                    if (reader.Read())
                    {
                        result = new CadastroModel
                        {
                            Id = (int)reader["id"],
                            Nome = (string)reader["nome"],
                            Rg = (string)reader["rg"],
                            Cpf = (string)reader["cpf"],
                            Telefone = (string)reader["telefone"],
                            DataCadastro = (string)reader["dataCadastro"],
                            DataNascimento = (string)reader["dataNascimento"]
                        };
                    }
                }
            }

            return result;
        }

        public static bool DeleteById(int id)
        {
            var result = false;

            if (GetById(id) != null)
            {
                using (var conn = new SqlConnection())
                {
                    conn.ConnectionString = ConfigurationManager.ConnectionStrings["baseDados"].ConnectionString;
                    conn.Open();
                    using (var comando = new SqlCommand())
                    {
                        comando.Connection = conn;
                        comando.CommandText = "UPDATE cadastro SET ativo = 0 WHERE id=@id";
                        comando.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        result = (comando.ExecuteNonQuery() > 0);
                    }
                }
            }
            return result;
        }

        public int Salvar()
        {
            var result = 0;
            var model = GetById(this.Id);
            
            using (var conn = new SqlConnection())
            {
                conn.ConnectionString = ConfigurationManager.ConnectionStrings["baseDados"].ConnectionString;
                conn.Open();
                using (var comando = new SqlCommand())
                {
                    comando.Connection = conn;

                    if (model == null)
                    {

                        comando.CommandText = "INSERT INTO cadastro (nome, rg, cpf, telefone, dataNascimento, dataCadastro) " +
                            "VALUES (@nome, @rg, @cpf, @telefone, @dataNascimento, @dataCadastro); SELECT convert(int, scope_identity())";
                        comando.Parameters.Add("@nome", SqlDbType.VarChar).Value = this.Nome;
                        if (this.Rg == null && this.Uf == "1")
                        {
                            comando.Parameters.Add("@rg", SqlDbType.VarChar).Value = "";
                        }
                        else {
                            comando.Parameters.Add("@rg", SqlDbType.VarChar).Value = this.Rg;
                        }
                        comando.Parameters.Add("@cpf", SqlDbType.VarChar).Value = this.Cpf;
                        comando.Parameters.Add("@telefone", SqlDbType.VarChar).Value = this.Telefone;
                        comando.Parameters.Add("@dataNascimento", SqlDbType.VarChar).Value = this.DataNascimento;
                        comando.Parameters.Add("@dataCadastro", SqlDbType.VarChar).Value = this.DataCadastro;
                        result = (int)comando.ExecuteScalar();
                    }
                    else
                    {
                        comando.CommandText = "UPDATE cadastro SET nome=@nome, rg=@rg, cpf=@cpf, telefone=@telefone," +
                            " dataNascimento=@dataNascimento, dataCadastro=@dataCadastro WHERE id=@id";
                        comando.Parameters.Add("@id", SqlDbType.Int).Value = this.Id;
                        comando.Parameters.Add("@nome", SqlDbType.VarChar).Value = this.Nome;
                        comando.Parameters.Add("@rg", SqlDbType.VarChar).Value = this.Rg;
                        comando.Parameters.Add("@cpf", SqlDbType.VarChar).Value = this.Cpf;
                        comando.Parameters.Add("@telefone", SqlDbType.VarChar).Value = this.Telefone;
                        comando.Parameters.Add("@dataNascimento", SqlDbType.VarChar).Value = this.DataNascimento;
                        comando.Parameters.Add("@dataCadastro", SqlDbType.VarChar).Value = this.DataCadastro;
                        if (comando.ExecuteNonQuery() > 0)
                        {
                            result = this.Id;
                        }
                    }
                }

                return result;
            }
        }
    }
}