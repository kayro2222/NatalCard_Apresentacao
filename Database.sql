USE [master]
GO
CREATE DATABASE [natalcard]
GO
USE [natalcard]
GO
CREATE USER [admin] FOR LOGIN [admin] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [admin]
GO
CREATE TABLE [dbo].[grupo_produto] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[rg] [varchar](255),
	[cpf] [varchar](255) NOT NULL,
	[telefone] [varchar](255) NOT NULL,
	[dataNascimento] [varchar](255) NOT NULL,
	[dataCadastro] [varchar](255) NOT NULL,
	[ativo] [bit] NOT NULL
	CONSTRAINT [PK_cadastro] PRIMARY KEY ([id])
)