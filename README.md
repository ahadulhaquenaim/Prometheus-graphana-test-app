# Node.js Monitoring Stack with Prometheus, Grafana, and Loki

A complete monitoring solution for Node.js applications using Prometheus for metrics, Loki for logs, and Grafana for visualization - all containerized with Docker.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Services](#services)
- [Accessing the Application](#accessing-the-application)
- [Using Grafana](#using-grafana)
- [API Endpoints](#api-endpoints)
- [Monitoring Features](#monitoring-features)
- [Email Alerting Setup](#email-alerting-setup)
- [Troubleshooting](#troubleshooting)
- [Stopping the Application](#stopping-the-application)

## 🎯 Overview

This project demonstrates a complete observability stack for a Node.js Express application with:

- **Metrics Collection**: Prometheus scrapes metrics from the Node.js app
- **Log Aggregation**: Loki collects and stores application logs
- **Visualization**: Grafana provides beautiful dashboards for metrics and logs
- **Email Alerting**: Grafana sends email notifications when Node.js server goes down
- **Containerization**: All services run in Docker containers with Docker Compose

## 🏗️ Architecture

```
┌─────────────────┐
│   Node.js App   │ ──► Exposes /metrics endpoint
│   (Port 3000)   │ ──► Sends logs to Loki
└─────────────────┘
         │
         ├──────────► ┌─────────────┐
         │            │ Prometheus  │ ──► Scrapes metrics
         │            │ (Port 9090) │
         │            └─────────────┘
         │                    │
         │                    │
         └──────────► ┌─────────────┐     ┌─────────────┐
                      │    Loki     │ ◄─── │  Promtail   │
                      │ (Port 3100) │      │             │
                      └─────────────┘      └─────────────┘
                             │
                             │
                      ┌─────────────┐
                      │   Grafana   │ ──► Visualizes everything
                      │ (Port 3001) │
                      └─────────────┘
```

## 📦 Prerequisites

Before running this project, ensure you have installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

To verify your installation:

```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### 1. Clone or Navigate to the Project

```bash
cd /home/ahadul/Desktop/Test_graphana
```

### 2. Start All Services

Run the following command to start all services in detached mode:

```bash
docker-compose up -d
```

This will:

- Build the Node.js application Docker image
- Start Prometheus, Grafana, Loki, and Promtail containers
- Create a monitoring network connecting all services
- Set up persistent volumes for data storage

### 3. Verify Services are Running

Check that all containers are up and running:

```bash
docker-compose ps
```

You should see 5 services running:

- `node-app`
- `prometheus`
- `grafana`
- `loki`
- `promtail`

### 4. View Logs (Optional)

To see the logs from all services:

```bash
docker-compose logs -f
```

To view logs from a specific service:

```bash
docker-compose logs -f node-app
docker-compose logs -f grafana
```

## 🔧 Services

| Service         | Port | Description                                             |
| --------------- | ---- | ------------------------------------------------------- |
| **Node.js App** | 3000 | Express application with metrics endpoint               |
| **Grafana**     | 3001 | Visualization and dashboards (mapped to host port 3001) |
| **Prometheus**  | 9090 | Metrics collection and storage                          |
| **Loki**        | 3100 | Log aggregation system                                  |
| **Promtail**    | -    | Log shipping agent (no exposed port)                    |

## 🌐 Accessing the Application

### Node.js Application

Access the Node.js application at:

```
http://localhost:3000
```

### Grafana Dashboard

**URL**: `http://localhost:3001`

**Default Credentials**:

- **Username**: `admin`
- **Password**: `admin`

> ⚠️ **Important**: On first login, Grafana may prompt you to change the password. You can skip this or set a new password.

### Prometheus UI

Access Prometheus directly at:

```
http://localhost:9090
```

## 📊 Using Grafana

### Step 1: Log in to Grafana

1. Open your browser and go to `http://localhost:3001`
2. Enter username: `admin` and password: `admin`
3. Click "Log in"

### Step 2: Verify Data Sources

The data sources are pre-configured. To verify:

1. Click the **☰** menu icon (top left)
2. Go to **Connections** → **Data Sources**
3. You should see:
   - **Prometheus** (default) - Status: Working ✅
   - **Loki** - Status: Working ✅

### Step 3: View Pre-configured Dashboards

Two dashboards are automatically provisioned:

#### 1. **Node.js Metrics Dashboard**

Shows application performance metrics:

- HTTP request duration (response times)
- Total HTTP requests count
- Request rate by route
- Status code distribution
- Node.js memory usage
- CPU usage

To access:

1. Click **☰** → **Dashboards**
2. Select **Node.js Metrics Dashboard**

#### 2. **Logs Dashboard**

Shows application logs in real-time:

- Log stream from the Node.js application
- Log filtering by level
- Time-series log visualization

To access:

1. Click **☰** → **Dashboards**
2. Select **Logs Dashboard**

### Step 4: Test the Monitoring

Generate some traffic to see data in Grafana:

```bash
# Health check
curl http://localhost:3000/health

# Trigger an error
curl http://localhost:3000/error

# Heavy task (5 second response)
curl http://localhost:3000/heavy-task

# Generate multiple requests
for i in {1..10}; do curl http://localhost:3000/health; done
```

Refresh the Grafana dashboards to see the metrics and logs update in real-time.

### Step 5: Explore Metrics

1. In Grafana, go to **Explore** (compass icon in the left menu)
2. Select **Prometheus** as the data source
3. Try queries like:
   - `http_requests_total` - Total requests
   - `http_request_duration_seconds_bucket` - Request duration histogram
   - `rate(http_requests_total[1m])` - Request rate per minute

### Step 6: Explore Logs

1. Go to **Explore**
2. Select **Loki** as the data source
3. Use LogQL queries like:
   - `{job="node-app"}` - All logs from node-app
   - `{job="node-app"} |= "error"` - Logs containing "error"
   - `{job="node-app"} |= "Health check"` - Health check logs

## 🛣️ API Endpoints

The Node.js application exposes the following endpoints:

| Method | Endpoint      | Description                       | Response Time |
| ------ | ------------- | --------------------------------- | ------------- |
| GET    | `/health`     | Health check endpoint             | ~1ms          |
| GET    | `/error`      | Returns a 500 error (for testing) | ~1ms          |
| GET    | `/heavy-task` | Simulates a slow operation        | 5000ms        |
| GET    | `/metrics`    | Prometheus metrics endpoint       | ~10ms         |

### Example Requests

```bash
# Health check
curl http://localhost:3000/health

# Error endpoint
curl http://localhost:3000/error

# Heavy task
curl http://localhost:3000/heavy-task

# View Prometheus metrics
curl http://localhost:3000/metrics
```

## 📈 Monitoring Features

### Metrics Collected

1. **HTTP Request Duration**
   - Histogram: `http_request_duration_seconds`
   - Labels: method, route, status_code
   - Buckets: 0.1s, 0.5s, 1s, 2.5s, 5s, 10s

2. **HTTP Request Total**
   - Counter: `http_requests_total`
   - Labels: method, route, status_code

3. **Default Node.js Metrics**
   - Process CPU usage
   - Process memory usage
   - Event loop lag
   - Heap statistics
   - Garbage collection stats

### Logs

Application logs are sent to Loki with:

- Timestamp
- Log level (info, error, etc.)
- HTTP method and route
- Status code
- Response time

## 📧 Email Alerting Setup

This project includes email alerting that sends notifications when your Node.js server goes down.

### Step 1: Create Environment File

Create a `.env` file in the project root with the following SMTP configuration:

```bash
# Grafana credentials
GRAFANA_USERNAME=admin
GRAFANA_PASSWORD=admin

# SMTP Configuration for Email Alerts
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_ADDRESS=your-email@gmail.com
SMTP_SKIP_VERIFY=false

# Alert recipient email (can be comma-separated for multiple emails)
ALERT_EMAIL_ADDRESSES=recipient@example.com
```

### Step 2: Gmail Setup (if using Gmail)

If you're using Gmail, you need to create an **App Password**:

1. Go to your [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Search for "App passwords" in the settings
4. Create a new app password for "Mail"
5. Copy the 16-character password and use it as `SMTP_PASSWORD` in the `.env` file

### Step 3: Alternative Email Providers

For other email providers, use their SMTP settings:

#### **Outlook/Hotmail**

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### **Yahoo**

```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

#### **SendGrid**

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Step 4: Restart Services

After creating the `.env` file, restart your services:

```bash
docker-compose down
docker-compose up -d
```

### Step 5: Test the Alert

To test the email alert system:

1. **Stop the Node.js server**:

   ```bash
   docker-compose stop node-app
   ```

2. **Wait for the alert**: The alert rule checks every 30 seconds. After the server is down for 1 minute, you should receive an email notification.

3. **Check email**: Look for an email with subject "Node.js Server is Down"

4. **Restart the server**:
   ```bash
   docker-compose start node-app
   ```

### Alert Configuration Details

The alert system monitors the `up` metric from Prometheus:

- **Check Interval**: Every 30 seconds
- **Alert Condition**: Server down for more than 1 minute
- **Severity**: Critical
- **Notification Repeat**: Every 12 hours (until resolved)

### Viewing Alerts in Grafana

1. Log into Grafana at `http://localhost:3001`
2. Go to **Alerting** → **Alert Rules**
3. You should see "Node.js Server is Down" alert
4. Go to **Alerting** → **Contact Points** to verify email configuration
5. Go to **Alerting** → **Notification Policies** to view notification routing

### Customizing Alerts

You can customize the alert by editing `grafana/provisioning/alerting/rules.yml`:

- Change the evaluation interval
- Modify the threshold
- Add more alert rules for other conditions (CPU, memory, request rate, etc.)
- Update alert messages and severity levels

## 🐛 Troubleshooting

### Services Not Starting

Check if ports are already in use:

```bash
# Check port 3000 (Node.js app)
sudo lsof -i :3000

# Check port 3001 (Grafana)
sudo lsof -i :3001

# Check port 9090 (Prometheus)
sudo lsof -i :9090

# Check port 3100 (Loki)
sudo lsof -i :3100
```

### Grafana Shows "No Data"

1. Wait 30-60 seconds after starting for data collection to begin
2. Generate some traffic to the Node.js app
3. Check if Prometheus is scraping: `http://localhost:9090/targets`
4. Verify data sources in Grafana are working

### View Container Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs node-app
docker-compose logs grafana
docker-compose logs prometheus
docker-compose logs loki
```

### Restart a Specific Service

```bash
docker-compose restart node-app
docker-compose restart grafana
```

### Rebuild After Code Changes

```bash
docker-compose down
docker-compose up -d --build
```

## 🛑 Stopping the Application

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove Volumes (Delete All Data)

```bash
docker-compose down -v
```

This will remove:

- All containers
- The monitoring network
- Persistent volumes (Prometheus, Grafana, Loki data)

### Stop Without Removing Containers

```bash
docker-compose stop
```

To restart after stopping:

```bash
docker-compose start
```

## 📁 Project Structure

```
Test_graphana/
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile                  # Node.js app container definition
├── package.json                # Node.js dependencies
├── server.js                   # Express server setup
├── middleware.js               # Prometheus & logging middleware
├── router.js                   # API routes definition
├── prometheus-config.yml       # Prometheus scrape configuration
├── promtail-config.yml         # Promtail log shipping config
├── loki-config.yaml/
│   └── loki-config.yaml       # Loki storage configuration
└── grafana/
    ├── dashboards/            # Pre-built dashboard JSON files
    │   ├── logs-dashboard.json
    │   └── nodejs-dashboard.json
    └── provisioning/          # Grafana auto-configuration
        ├── dashboards/
        │   └── dashboards.yml
        └── datasources/
            └── datasources.yml
```

## 🔑 Key Configuration Files

### Prometheus Configuration

`prometheus-config.yml` defines:

- Scrape interval: 4 seconds
- Target: `node-app:3000/metrics`

### Grafana Data Sources

`grafana/provisioning/datasources/datasources.yml` configures:

- Prometheus at `http://prometheus:9090`
- Loki at `http://loki:3100`

### Docker Compose

`docker-compose.yml` orchestrates:

- 5 services with proper networking
- Volume mounts for persistence
- Port mappings to host machine

## 🎓 Learning Resources

- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/
- **Loki**: https://grafana.com/docs/loki/
- **prom-client**: https://github.com/siimon/prom-client

## 📝 Notes

- Grafana dashboard are automatically provisioned on startup
- Prometheus scrapes metrics every 4 seconds
- Logs are streamed in real-time to Loki via winston-loki transport
- All data is persisted in Docker volumes
- The Node.js app is configured to send logs to Loki using the `MY_HOST` environment variable (defaults to `loki`)

## 🚀 Next Steps

1. **Customize Dashboards**: Edit the JSON files in `grafana/dashboards/`
2. **Add Alerts**: Configure alerting rules in Prometheus or Grafana
3. **Add More Metrics**: Extend `middleware.js` with custom metrics
4. **Secure Grafana**: Change default passwords in production
5. **Add Authentication**: Implement auth middleware in the Node.js app

---

**Happy Monitoring! 📊📈**
