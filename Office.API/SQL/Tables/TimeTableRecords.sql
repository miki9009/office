USE [Office]

CREATE TABLE [dbo].[TimeTableRecords](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Year] [int] NOT NULL,
	[Month] [tinyint] NOT NULL,
	[Day] [tinyint] NOT NULL,
	[Time] [nvarchar](5) NULL,
	[Title] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[UsersAttached] [nvarchar](max) NULL,
	[Repeating] [int] NOT NULL,
 CONSTRAINT [PK_TimeTableRecords] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

