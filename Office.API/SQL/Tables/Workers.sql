USE [Office]


CREATE TABLE [dbo].[Workers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NULL,
	[Surname] [nvarchar](max) NULL,
	[LastLogin] [datetime2](7) NOT NULL,
	[JobPosition] [nvarchar](max) NULL,
	[Supervisor] [nvarchar](max) NULL,
	[CheckedIn] [bit] NOT NULL,
	[UserID] [int] NOT NULL,
	[unReadMessage] [bit] NOT NULL,
	[OfficeID] [int] NOT NULL,
 CONSTRAINT [PK_Workers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

ALTER TABLE [dbo].[Workers]  WITH CHECK ADD  CONSTRAINT [FK_Workers_Users_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE


ALTER TABLE [dbo].[Workers] CHECK CONSTRAINT [FK_Workers_Users_UserID]

