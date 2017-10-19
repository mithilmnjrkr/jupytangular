echo
'<configuration> \
   <packageRestore> \
       <add key="enabled" value="True" /> \
       <add key="automatic" value="True" /> \
   </packageRestore> \
   <packageSources> \
       <add key="nuget.org" value="https://www.nuget.org/api/v2/" /> \
       <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" /> \
       <add key="teamCity" value="http://teamcity.actops.com/httpAuth/app/nuget/v1/FeedService.svc" /> \
   </packageSources> \
</configuration>' > / act.subscription.management /
.
nuget / NuGet.Config

ln - s
subscription.myact / Subscription.MyAct
ln - s
subscription.core / Subscription.Core
ln - s
subscription.entitlement / Subscription.Entitlement
ln - s
subscription.integrations / Subscription.Integrations
ln - s
subscription.identitymanagement / Subscription.IdentityManagement

nuget
sources
update - Name
teamCity - source
http://teamcity.actops.com/httpAuth/app/nuget/v1/FeedService.svc -User {username} -pass {password} -configFile .nuget/NuGet.Config -StorePasswordInClearText
    nuget
update / act.subscription.management / act.subscription.management.sln
msbuild
Subscription.IdentityManagement.csproj
