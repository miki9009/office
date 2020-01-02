USE [Office]

CREATE TABLE [dbo].[TimeRecords](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[WorkerID] [int] NOT NULL,
	[Day] [nvarchar](max) NULL,
	[StartDate] [datetime2](7) NOT NULL,
	[EndTime] [datetime2](7) NOT NULL,
	[Total] [float] NOT NULL,
	[Notes] [nvarchar](max) NULL,
	[ClockedOut] [bit] NOT NULL,
	[ControlSum] [int] NOT NULL,
 CONSTRAINT [PK_TimeRecords] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]



