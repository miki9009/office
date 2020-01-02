USE [Office]

CREATE TABLE [dbo].[Office](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Name] [nvarchar](50) NULL,
	[REGON] [nvarchar](50) NULL,
	[NIP] [nvarchar](20) NULL,
	[KRS] [nvarchar](20) NULL,
	[City] [nvarchar](50) NULL,
	[PostCode] [nvarchar](7) NULL,
	[DetailAddress] [nvarchar](100) NULL,
	[PhoneNumber] [nvarchar](20) NULL,
	[Mobile] [nvarchar](20) NULL,
	[Email] [nvarchar](50) NULL,
	[BankAccount] [nvarchar](32) NULL,
	[PESEL] [nvarchar](11) NULL,
 CONSTRAINT [PK_Office] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
