-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "credits" TEXT DEFAULT '10',
    "googleResourceId" TEXT,
    "localGoogleId" TEXT,
    "tier" TEXT DEFAULT 'Free',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LocalGoogleCredential" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "folderId" TEXT,
    "pageToken" TEXT,
    "channelId" TEXT NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LocalGoogleCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiscordWebhook" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DiscordWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Slack" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "authedUserId" TEXT NOT NULL,
    "authedUserToken" TEXT NOT NULL,
    "slackAccessToken" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Slack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notion" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,
    "workspaceName" TEXT NOT NULL,
    "workspaceIcon" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connections" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "discordWebhookId" TEXT,
    "notionId" TEXT,
    "userId" TEXT,
    "slackId" TEXT,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workflows" (
    "id" TEXT NOT NULL,
    "nodes" TEXT,
    "edges" TEXT,
    "name" TEXT NOT NULL,
    "discordTemplate" TEXT,
    "notionTemplate" TEXT,
    "slackTemplate" TEXT,
    "slackChannels" TEXT[],
    "slackAccessToken" TEXT,
    "notionAccessToken" TEXT,
    "notionDbId" TEXT,
    "flowPath" TEXT,
    "cronPath" TEXT,
    "publish" BOOLEAN DEFAULT false,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Workflows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "public"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleResourceId_key" ON "public"."User"("googleResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_localGoogleId_key" ON "public"."User"("localGoogleId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalGoogleCredential_accessToken_key" ON "public"."LocalGoogleCredential"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "LocalGoogleCredential_channelId_key" ON "public"."LocalGoogleCredential"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalGoogleCredential_userId_key" ON "public"."LocalGoogleCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordWebhook_webhookId_key" ON "public"."DiscordWebhook"("webhookId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordWebhook_url_key" ON "public"."DiscordWebhook"("url");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordWebhook_channelId_key" ON "public"."DiscordWebhook"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Slack_authedUserToken_key" ON "public"."Slack"("authedUserToken");

-- CreateIndex
CREATE UNIQUE INDEX "Slack_slackAccessToken_key" ON "public"."Slack"("slackAccessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_accessToken_key" ON "public"."Notion"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_workspaceId_key" ON "public"."Notion"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_databaseId_key" ON "public"."Notion"("databaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Connections_type_key" ON "public"."Connections"("type");

-- AddForeignKey
ALTER TABLE "public"."LocalGoogleCredential" ADD CONSTRAINT "LocalGoogleCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscordWebhook" ADD CONSTRAINT "DiscordWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Slack" ADD CONSTRAINT "Slack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notion" ADD CONSTRAINT "Notion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_discordWebhookId_fkey" FOREIGN KEY ("discordWebhookId") REFERENCES "public"."DiscordWebhook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_notionId_fkey" FOREIGN KEY ("notionId") REFERENCES "public"."Notion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_slackId_fkey" FOREIGN KEY ("slackId") REFERENCES "public"."Slack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workflows" ADD CONSTRAINT "Workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
