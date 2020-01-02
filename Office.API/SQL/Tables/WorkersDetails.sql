USE [Office]

CREATE TABLE [dbo].[WorkersDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[WorkerID] [int] NOT NULL,
	[PrivatePhoneNumber] [nvarchar](max) NULL,
	[WorkPhoneNumber] [nvarchar](max) NULL,
	[Salary] [float] NOT NULL,
	[City] [nvarchar](max) NULL,
	[Street] [nvarchar](max) NULL,
	[PostCode] [nvarchar](max) NULL,
	[HomeNumber] [nvarchar](max) NULL,
 CONSTRAINT [PK_WorkersDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]


