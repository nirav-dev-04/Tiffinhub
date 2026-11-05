# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first for optimal layer caching
COPY ["TiffinHub.Domain/TiffinHub.Domain.csproj", "TiffinHub.Domain/"]
COPY ["TiffinHub.Application/TiffinHub.Application.csproj", "TiffinHub.Application/"]
COPY ["TiffinHub.Infrastructure/TiffinHub.Infrastructure.csproj", "TiffinHub.Infrastructure/"]
COPY ["TiffinHub.Api/TiffinHub.Api.csproj", "TiffinHub.Api/"]

# Restore packages
RUN dotnet restore "TiffinHub.Api/TiffinHub.Api.csproj"

# Copy full source and publish
COPY . .
WORKDIR "/src/TiffinHub.Api"
RUN dotnet publish "TiffinHub.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TiffinHub.Api.dll"]
