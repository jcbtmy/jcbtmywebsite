FROM mcr.microsoft.com/dotnet/aspnet:5.0

RUN apt-get update
RUN apt-get install -y libgdiplus libc6-dev
RUN apt-get install -y libicu-dev libharfbuzz0b libfontconfig1 libfreetype6

COPY bin/Release/net5.0/publish/ App/

WORKDIR /App

EXPOSE 80

ENTRYPOINT ["dotnet", "ProjectSite.dll"]